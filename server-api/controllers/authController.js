var debug = require('debug')('home-productsapi:auth-controller');
var config = require('../config');
var appError = require('../config/appError');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var shortid = require('shortid');
var User = require('../models/user');
var Veterinary = require('../models/veterinary');
var Distributor = require('../models/distributor');

var emailController = require('./emailController');

const REFERENCE_POINTS = 100;

exports.loginUser = function(req,res,next){
  loginUserModel(req, res, next, 'client');
}
exports.loginVeterinary = function(req,res,next){
  loginUserModel(req, res, next, 'veterinary');
}
exports.loginDistributor = function(req,res,next){
  loginUserModel(req, res, next, 'distributor');
}
exports.loginMaster = function(req,res,next){
  loginUserModel(req, res, next, 'master');
}

loginUserModel = function(req, res, next, type){
  debug("login type",type,req.body.email);
  let userModel =
  type == 'master'?Distributor:
  type == 'distributor'?Distributor:
  type == 'veterinary'?Veterinary:
  type == 'client'?User:
  null;
  if(userModel === null){
    return next(appError('Error de inicio',500));
  }
  let isMaster = type == 'master';
  let query = {email:req.body.email};
  if(isMaster)
  query.isMaster = {$exists:isMaster, $eq:isMaster};
  userModel.findOne(query).then((user)=>{
    if(!user) return next(appError("Usuario no encontrado",403));
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (isMatch && !err) {
        if(user.status == 'verify' || user.status == 'verify-request')
        return next(appError("Debes verificar tu cuenta",403));
        if(type == 'distributor' || type == 'veterinary'){
          if(user.status == 'request')
          return next(appError("Debes esperar a que acepten tu solicitud",403));
        }
        var token = signUser(user);
        res.json({success: true, token: token, type: type, userName: user.name});
        user.lastLogin = new Date();
        user.save().then(res=>{
          debug("lastLogin",user.email,user.lastLogin);
        },error=>{
          debug("lastLogin error",error);
        });
      } else {
        return next(appError("Contraseña incorrecta",403));
      }
    });
  },err=>{
    debug("err",err);
    return next(appError("Usuario no encontrado",404));
  });
};
exports.registerUser =  function(req, res, next){
  return registerUserModel(req, res, next, 'client');
}
exports.registerVeterinary =  function(req, res, next){
  return registerUserModel(req, res, next, 'veterinary');
}
exports.registerDistributor =  function(req, res, next){
  return registerUserModel(req, res, next, 'distributor');
}
exports.registerMaster =  function(req, res, next){
  // if(config.dev)
  return registerUserModel(req, res, next, 'master');
}
registerUserModel = function(req,res,next, type){
  debug("register type",type);
  let userModel =
  type == 'master'?Distributor:
  type == 'distributor'?Distributor:
  type == 'veterinary'?Veterinary:
  type == 'client'?User:
  null;
  if(userModel === null){
    return next(appError('Error de inicio',500));
  }
  let body = req.body;
  let isMaster = type == 'master';
  if (!body.email || !body.password || !body.name ) {
    return next(appError('Faltan datos',403));
  }
  let verificationCode = emailController.getVerificationCode();
  let userCode = shortid.generate();
  var newUser = new userModel(Object.assign({},{
    name: body.name,
    email: body.email,
    password: body.password,
    verification: verificationCode,
    userCode: userCode,
    status: (type == 'master')?'active':(type == 'distributor')?'verify-request':'verify',
    points: 0,
    totalPoints: 0,
    referenceCount: 0,
    registerDate: new Date(),
  },isMaster?{isMaster:isMaster}:{},isMaster&&body.isMain?{isMain:true}:{}));
  if(type == 'distributor'){
    newUser.legalUserName = body.legalUserName;
    newUser.rfc = body.rfc;
    newUser.shippingAddress = body.shippingAddress;
    newUser.legalAddress = body.legalAddress;
    newUser.phone = body.phone;
    newUser.reference = body.reference;
  }
  if(type == 'veterinary'){
    newUser.legalUserName = body.legalUserName;
    newUser.shippingAddress = body.shippingAddress;
    newUser.phone = body.phone;
    newUser.location = body.location;
  }
  if(type == 'client'){
    newUser.petName = body.petName;
    newUser.petBreed = body.petBreed;
  }


  let saveQuery = [];
  if(body.referenceCode){
    // debug("body.referenceCode",body.referenceCode);
    saveQuery.push(User.findOneAndUpdate({userCode:body.referenceCode, referenceCount:{$lt: 5}},{$inc:{points:REFERENCE_POINTS, totalPoints: REFERENCE_POINTS, referenceCount:1}}));
    saveQuery.push(Veterinary.findOneAndUpdate({userCode:body.referenceCode, referenceCount:{$lt: 5}},{$inc:{points:REFERENCE_POINTS, totalPoints: REFERENCE_POINTS, referenceCount:1}}));
    saveQuery.push(Distributor.findOneAndUpdate({userCode:body.referenceCode, referenceCount:{$lt: 5}},{$inc:{points:REFERENCE_POINTS, totalPoints: REFERENCE_POINTS, referenceCount:1}}));
  }

  Promise.all(saveQuery).then(results=>{
    debug("results[0]",results[0]);
    debug("results[1]",results[1]);
    debug("results[2]",results[2]);
  },error=>{
    debug("Update referenceCode error",error);
  });


  let veterinaryCode;
  // debug("newUser",newUser);
  newUser.save().then((user)=>{
    // debug("new user",user.id);
    // debug("body",body);
    let linkQuery;
    if(body.veterinaryCode){
      linkQuery = Veterinary.findOneAndUpdate({userCode:body.veterinaryCode},{$push:{usersLinked:user._id}})
      .then(veterinary=>{
        debug("linked other",veterinary._id);
        if(!user.veterinariesLinked)
        user.veterinariesLinked = []
        user.veterinariesLinked.push(veterinary._id);
        return user.save();
      },error=>{
        debug("newUser error",error);
      });
    }

    if(body.distributorCode){
      // debug("body.distributorCode",body.distributorCode);
      linkQuery = Distributor.findOneAndUpdate({userCode:body.distributorCode},{$push:{veterinariesLinked:user._id}})
      .then(distributor=>{
        debug("linked other",distributor._id);
        if(!user.distributorsLinked)
        user.distributorsLinked = []
        // debug("user.distributorsLinked",user.distributorsLinked);
        user.distributorsLinked.push(distributor._id);
        // debug("user.distributorsLinked",user.distributorsLinked);
        return user.save();
      });
    }
    if(linkQuery)
    linkQuery.then(userLink=>{
      debug("saved linked user",userLink._id);
    },error=>{
      debug("linkQuery error",error);
    });
    var token = signUser(user,type);
    var responseBody = {success: true, token: token, type: type};
    res.json(responseBody);
    // if(type=='client')
    emailController.sendUserVerificationEmail(user.name,user.email,user.verification,user._id,type)
    .then(sended=>{
      debug("email sended");
    },error=>{
      debug("error sending",error);
    });
  }, error=>{
    debug("newUser.save error",error);
    if(error.message.indexOf('duplicate key error') !== -1)
    return next(appError('Ya existe el correo',403));
    if(error.errors['email'])
    return next(appError('Correo inválido',403));
    return next(appError('Error interno',500));
  });
};
exports.verifyUser =  function(req, res, next){
  return verifyEmail(req, res, next, 'client');
}
exports.verifyVeterinary =  function(req, res, next){
  return verifyEmail(req, res, next, 'veterinary');
}
exports.verifyDistributor =  function(req, res, next){
  return verifyEmail(req, res, next, 'distributor');
}


function verifyEmail(req,res,next, userType){
  debug("verifyEmail",userType);
  let verificationCode = req.query.c;
  let userId = req.params.id;
  let userModel =
  userType == 'distributor'?Distributor:
  userType == 'veterinary'?Veterinary:
  userType == 'client'?User:
  null;

  userModel.findById(userId).then(user=>{
    // debug("user.verification",user.verification);
    // debug("verificationCode",verificationCode);
    if(user.verification == verificationCode){
      let status = (userType == 'client'?'active':'request');
      return user.update({status:status})
      .then(success=>{
        res.sendFile('/verification/success.html', {root: './public'});
      },error=>{
        debug("user.update error",error);
        res.sendFile('/verification/error.html', {root: './public'});
      });
    }else{
      debug("error no match");
      res.sendFile('/verification/error.html', {root: './public'});
    }
  },error=>{
    debug("userModel.findById error",error);
    res.sendFile('/verification/error.html', {root: './public'});
  });
}


// HELPER functions
let signUser = (dbUser,type)=>{
  dbUser = dbUser.toObject?dbUser.toObject():dbUser;
  var tokenUser = {email:'',id:'',type:''};
  tokenUser.email = dbUser.email;
  tokenUser.id = dbUser.id;
  tokenUser.type = type;
  return jwt.sign(tokenUser, config.secret);
}
let getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

let authenticate = function(type, runFunction){
  var returnFunction = function(req, res, next){
    let strategy =
    type == 'master'?'jwt-master':
    type == 'distributor'?'jwt-distributor':
    type == 'veterinary'?'jwt-veterinary':
    type == 'client'?'jwt-user':
    null;
    passport.authenticate(strategy, function(err, user, info) {
      if (err) {
        debug("passport.authenticate Error ",err);
        return next(appError('No hay acceso',403));
      }
      if (!user) {
        return next(appError('No hay acceso',403));
      }
      var token = getToken(req.headers);
      if (token) {
        return runFunction(req, res, next, user,token);
      } else {
        return next(appError('No hay acceso',403));
      }
    })(req, res, next);
  };
  return returnFunction;
}

exports.authenticate = authenticate;


exports.isLoggedInMaster = authenticate('master',function(req, res, next, user,token){
  if (token) {
    res.json({success: true, type: 'master', userName: user.name});
  } else {
    return next(appError('No hay acceso',403));
  }
});
exports.isLoggedInDistributor = authenticate('distributor',function(req, res, next, user,token){
  if (token) {
    res.json({success: true, type: 'distributor', userName: user.name});
  } else {
    return next(appError('No hay acceso',403));
  }
});
exports.isLoggedInVeterinary = authenticate('veterinary',function(req, res, next, user,token){
  if (token) {
    res.json({success: true, type: 'veterinary', userName: user.name});
  } else {
    return next(appError('No hay acceso',403));
  }
});
exports.isLoggedInUser = authenticate('client',function(req, res, next, user,token){
  if (token) {
    res.json({success: true, type: 'client', userName: user.name});
  } else {
    return next(appError('No hay acceso',403));
  }
});

// exports.verifyEmail = emailController.verifyEmail;

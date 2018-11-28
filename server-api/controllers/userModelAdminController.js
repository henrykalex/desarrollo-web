var debug = require('debug')('home-productsapi:userModel-controller');
var config = require('../config');
var appError = require('../config/appError');
var authenticate = require('./authController').authenticate;
var generator = require('generate-password');
var shortid = require('shortid');

var User = require('../models/user');
var Veterinary = require('../models/veterinary');
var Distributor = require('../models/distributor');

var emailController = require('./emailController');

const APROBE_MESSAGE = config.APROBE_MESSAGE;
const APROBE_MESSAGE_HTML = config.APROBE_MESSAGE_HTML;
const APROBE_SUBJECT = config.APROBE_SUBJECT;

function getUserModel(userModelType){
  return userModelType=='distributor'?Distributor:
  userModelType=='veterinary'?Veterinary:
  userModelType=='client'?User:
  null;
}
function validateUser(userType){
  return userType=='distributor'?true:
  userType=='veterinary'?true:
  userType=='client'?true:
  false;
}

exports.masterGetUsersByPage = authenticate('master',_getUsersByPage());

function _getUsersByPage(){
  return function(req, res, next, user,token){
    debug("_getUsersByPage");
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);
    let sort = req.query.sort?req.query.sort:'_id';
    let sortDir = req.query.direction?req.query.direction.toUpperCase():'DESC';
    // let order = sort?
    // sort=='estatus'?
    // [[sort, sortDir]]:
    // [['estatus','ASC'],[sort, sortDir]]:
    // [['estatus','ASC']];


    let query = {isMaster:{$exists: false}};
    if(req.query.request)
    query["$or"] = req.query.request=="true"?[{status:'request'},{status:'verify-request'}]:[{status:'active'},{status:'verify'}];
    Promise.all([
      userModel.find(query).skip(skip).limit(5),
      userModel.count(query)
    ]).then(users=>{
      return res.json({success: true, items: users[0],count:users[1]});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.masterGetUser = authenticate('master',_getUser());
function _getUser(){
  return function(req, res, next, user,token){
    debug("_getUser");
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let userId = req.params.id
    let query = {_id:userId};

    userModel.findOne(query).then(user=>{
      return res.json({success: true, item: user});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.masterAddUser = authenticate('master',_addUser());
function _addUser(){
  return function(req, res, next, user,token){
    debug("_addUser");
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let body = req.body;
    let verificationCode = emailController.getVerificationCode();
    let userCode = shortid.generate();
    let newPassword = generator.generate({
      length: 10,
      numbers: true
    });
    body.verification = verificationCode;
    body.userCode = userCode;
    body.password= newPassword;
    body.status = 'active';
    body.points = 0;
    body.totalPoints = 0;
    body.referenceCount = 0;
    let newUser = new userModel(body);
    newUser.save().then(user=>{
      debug("email ",user.email);
      debug("newPassword ",newPassword);
      emailController.sendVerificationEmail(user.name,user.email,verificationCode,user._id,newPassword, userModelType)
      .then(sended=>{
        res.json({success: true, item: user});
      },error=>{
        debug("Error sending email",error);
        res.json({success: true, password: newPassword});
      });
    },error=>{
      debug("newUser.save error",error);
      return next(appError("Error al guardar en la base de datos"));
    });
  }
}

exports.masterAproveUser = authenticate('master',_aproveUser());
function _aproveUser(){
  return function(req, res, next, user,token){
    debug("_aproveUser");
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let userId = req.params.id;
    userModel.findByIdAndUpdate(userId,{status:'active'},{new:true})
    .then(user=>{
      emailController.sendEmail(user.name,user.email,APROBE_MESSAGE,APROBE_MESSAGE_HTML,APROBE_SUBJECT)
      .then(sended=>{
        res.json({success: user?true:false, item: user});
      },error=>{
        debug("Error sending email",error);
        res.json({success: user?true:false, item: user});
      });
    },error=>{
      debug("userModel.findByIdAndUpdate error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.masterDeleteUser = authenticate('master',_delteUser());
function _delteUser(){
  return function(req, res, next, user,token){
    debug("_delteUser");
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let userId = req.params.id;
    userModel.findByIdAndUpdate(userId,{status:'inactive'},{new:true}).then(user=>{
      // debug("user",user);
      res.json({success: user?true:false});
    },error=>{
      debug("userModel.findByIdAndUpdate error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.masterPatchUser = authenticate('master',_patchUser());
function _patchUser(){
  return function(req, res, next, user,token){
    debug("_patchUser");
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let userId = req.params.id;
    userModel.findByIdAndUpdate(userId,req.body,{new:true}).then(user=>{
      // TODO: Send email with verification
      // emailController.sendEmail(user.name,user.email,verificationCode,user._id,newPassword, userModelType)
      // .then(sended=>{
      debug("user",user);
        res.json({success: user?true:false, item: user});
      // },error=>{
        // debug("Error sending email",error);
        // res.json({success: true, password: newPassword});
      // });
    },error=>{
      debug("userModel.findByIdAndUpdate error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

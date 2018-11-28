var debug = require('debug')('home-productsapi:userLink-controller');
var config = require('../config');
var appError = require('../config/appError');
var authenticate = require('./authController').authenticate;

var User = require('../models/user');
var Veterinary = require('../models/veterinary');
var Distributor = require('../models/distributor');

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

function getLinkedUsersField(linkUserType){
  return linkUserType=='veterinary'?'veterinariesLinked':
  linkUserType=='distributor'?'distributorsLinked':
  linkUserType=='client'?'usersLinked':
  null;
}

exports.userLinkUserModel = authenticate('client',_linkUserModel('client'));
exports.veterinaryLinkUserModel = authenticate('veterinary',_linkUserModel('veterinary'));
exports.distributorLinkUserModel = authenticate('distributor',_linkUserModel('distributor'));
exports.masterLinkUserModel = authenticate('master',_linkUserModel('master'));

function _linkUserModel(userType){
  return async function(req, res, next, user,token){
    debug("_linkUserModel",userType);

    let linkUserType = req.params.userModel;
    let linkUserModel = getUserModel(linkUserType);
    if(!linkUserModel)
    return next(appError("No se encontró el usuario",404));
    let linkUserCode = req.body.linkUserCode;

    let linkUser;
    try {
      linkUser = await linkUserModel.findOne({userCode: linkUserCode});//Find user info
    } catch (error) {
      debug("linkUserModel.findOne error",error);
      return next(appError("No se encontró el usuario",404));
    }
    if(!linkUser)
    return next(appError("No se encontró el usuario",404));


    let linkUserId = linkUser._id;
    let linkPromises = [];

    let linkToUserPushField = getLinkedUsersField(linkUserType);

    let linkToUserId;
    let linkUserPushField;

    if(userType == 'master'){
      let linkToUserType = req.body.linkToUserType;
      let linkToUserModel = getUserModel(linkToUserType);
      linkToUserId = req.body.linkToUserId;

      // Get user info
      let linkToUserInfo = await linkToUserModel.findById(linkToUserId);
      if(!linkToUserInfo)
      return next(appError("No se econtró el usuario"));

      // Validate if linkUser has already this user linked or if user has
      let linkUserIndex = linkToUserInfo[linkToUserPushField].findIndex((linkedUserId)=>linkedUserId.toString()==linkUserId.toString());
      if(linkUserIndex!=-1)
      return  next(appError("Ya se encuentra afiliado el usuario",404));


      linkToUserInfo[linkToUserPushField].push(linkUserId);
      linkPromises.push(linkToUserInfo.save());

      linkUserPushField = getLinkedUsersField(linkToUserType);

      if(linkToUserType=='veterinary' && linkUserType=='distributor'){
        if(linkToUserInfo[linkToUserPushField].length>=10)
        return next(appError("Error, haz alcanzado el número máximo de afiliaciones"));
        if(linkUser[linkUserPushField].length>=30)
        return next(appError("Error, el usuario ha alcanzado el número máximo de afiliaciones"));
      }
      if(linkToUserType=='distributor' && linkUserType=='veterinary'){
        if(linkToUserInfo[linkToUserPushField].length>=30)
        return next(appError("Error, haz alcanzado el número máximo de afiliaciones"));
        if(linkUser[linkUserPushField].length>=10)
        return next(appError("Error, el usuario ha alcanzado el número máximo de afiliaciones"));
      }
    }else{
      linkUserPushField = getLinkedUsersField(userType);
      linkToUserId = user._id;
      // Validate count
      let maxLinks = userType=='veterinary'?10:30;
      if(userType=='veterinary' && linkUserType=='distributor'){
        if(user[linkToUserPushField].length>=10)
        return next(appError("Error, haz alcanzado el número máximo de afiliaciones"));
        if(linkUser[linkUserPushField].length>=30)
        return next(appError("Error, el usuario ha alcanzado el número máximo de afiliaciones"));
      }
      if(userType=='distributor' && linkUserType=='veterinary'){
        if(user[linkToUserPushField].length>=30)
        return next(appError("Error, haz alcanzado el número máximo de afiliaciones"));
        if(linkUser[linkUserPushField].length>=10)
        return next(appError("Error, el usuario ha alcanzado el número máximo de afiliaciones"));
      }
      // Validate if user has already this linkedUser
      let linkUserIndex = user[linkToUserPushField].findIndex((linkedUserId)=>linkedUserId.toString()==linkUserId.toString());
      if(linkUserIndex!=-1)
      return  next(appError("Ya se encuentra afiliado el usuario",404));

      user[linkToUserPushField].push(linkUserId);
      linkPromises.push(user.save());
    }

    // Validate if user has already this linkedUser
    let linkToUserIndex = linkUser[linkUserPushField].findIndex((linkedUserId)=>linkedUserId.toString()==linkToUserId.toString());
    if(linkToUserIndex!=-1)
    return  next(appError("Ya se encuentra afiliado el usuario",404));

    linkUser[linkUserPushField].push(linkToUserId);
    linkPromises.push(linkUser.save());

    Promise.all(linkPromises).then(results=>{
      // debug("results",results);
      return res.json({success: true});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.userGetLinkedUserModelByPage = authenticate('client',_getLinkedUsersByPage('client'));
exports.veterinaryGetLinkedUserModelByPage = authenticate('veterinary',_getLinkedUsersByPage('veterinary'));
exports.distributorGetLinkedUserModelByPage = authenticate('distributor',_getLinkedUsersByPage('distributor'));
exports.masterGetLinkedUserModelByPage = authenticate('master',_getLinkedUsersByPage('master'));

function _getLinkedUsersByPage(userType){
  return function(req, res, next, user,token){
    debug("_getLinkedUsersByPage",userType);

    let linkedUserType = req.params.userModel;
    let linkedUserModel = getUserModel(linkedUserType);
    if(!linkedUserModel)
    return next(appError("No encontrado",404));
    let linkedUsersField = getLinkedUsersField(linkedUserType);

    if(userType == 'master'){
      let linkedToUserType = req.query.linkedToUserType;
      let linkedToUserModel = getUserModel(linkedToUserType);
      let linkedToUserId = req.query.linkedToUserId;

      linkedToUserModel.findById(linkedToUserId)
      .populate(linkedUsersField)
      .then(user=>{
        // debug("user[linkedUsersField]",user[linkedUsersField]);
        return res.json({success:true, items: user[linkedUsersField], count: user[linkedUsersField].length});
      },error=>{
        debug("linkedToUserModel.findById error",error);
      });
    }else{
      user.populate(linkedUsersField)
      .execPopulate()
      .then(user=>{
        // debug("user[linkedUsersField]",user[linkedUsersField]);
        return res.json({success:true, items: user[linkedUsersField], count: user[linkedUsersField].length});
      },error=>{
        debug("user.populate error",error);
      })
    }
    // TODO: Paginate: https://www.hacksparrow.com/mongodb-pagination-using-slice.html
    // let userTypeQuery = 'getUsers';
    // // userModel[userTypeQuery]()
    //
    // let limit = req.query.limit?parseInt(req.query.limit):5;
    // let page = req.query.page?parseInt(req.query.page):0;
    // let skip = (page?(limit)*(page):0);
    // let sort = req.query.sort?req.query.sort:'_id';
    // let sortDir = req.query.direction?req.query.direction.toUpperCase():'DESC';
    // // let order = sort?
    // // sort=='estatus'?
    // // [[sort, sortDir]]:
    // // [['estatus','ASC'],[sort, sortDir]]:
    // // [['estatus','ASC']];
    // let query = {};
    // // query.

  }
}

exports.userGetLinkedUserModel = authenticate('client',_getUser('client'));
exports.veterinaryGetLinkedUserModel = authenticate('veterinary',_getUser('veterinary'));
exports.distributorGetLinkedUserModel = authenticate('distributor',_getUser('distributor'));

function _getUser(userType){
  return function(req, res, next, user,token){
    debug("_getUser",userType);
    let userModelType = req.params.userModel;
    let userModel = getUserModel(userModelType);
    if(!userModel)
    return next(appError("No encontrado",404));
    let userId = req.params.id
    let query = {_id:userId};
    // TODO (optional) validate if linked
    userModel.findOne(query).then(user=>{
      return res.json({success: true, item: user});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.userUnlinkUserModel = authenticate('client',_unlinkUserModel('client'));
exports.veterinaryUnlinkUserModel = authenticate('veterinary',_unlinkUserModel('veterinary'));
exports.distributorUnlinkUserModel = authenticate('distributor',_unlinkUserModel('distributor'));
exports.masterUnlinkUserModel = authenticate('master',_unlinkUserModel('master'));

function _unlinkUserModel(userType){
  return async function(req, res, next, user,token){
    debug("_unlinkUserModel",userType);

    let unlinkUserType = req.params.userModel;
    let unlinkUserModel = getUserModel(unlinkUserType);
    if(!unlinkUserModel)
    return next(appError("No encontrado",404));
    let unlinkUserId = req.body.unlinkUserId;

    let unlinkPromises = [];

    let unlinkToUserPushField = getLinkedUsersField(unlinkUserType);

    let unlinkToUserId;
    let unlinkUserPushField;

    if(userType == 'master'){
      let unlinkToUserType = req.body.unlinkToUserType;
      let unlinkToUserModel = getUserModel(unlinkToUserType);
      unlinkToUserId = req.body.unlinkToUserId;
      let pullQuery = {};
      pullQuery[unlinkToUserPullField] = unlinkUserId;
      unlinkPromises.push(linkToUserModel.findByIdAndUpdate(unlinkToUserId,{$pull:pullQuery},{new:true}));

      unlinkUserPushField = getLinkedUsersField(unlinkToUserType);
    }else{
      let idIndex = user[unlinkToUserPushField].findIndex(id=>id==unlinkUserId);
      user[unlinkToUserPushField].splice(idIndex,1);
      unlinkPromises.push(user.save());

      unlinkUserPushField = getLinkedUsersField(userType);
      unlinkToUserId = user._id;
    }
    let pullQuery = {};
    pullQuery[unlinkUserPushField] = unlinkToUserId;
    unlinkPromises.push(unlinkUserModel.findByIdAndUpdate(unlinkUserId,{$pull:pullQuery},{new:true}));

    Promise.all(unlinkPromises).then(results=>{
      // debug("results",results);
      return res.json({success: true});
    },error=>{
      debug("unlinkPromises error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

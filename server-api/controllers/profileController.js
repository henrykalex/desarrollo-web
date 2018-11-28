var debug = require('debug')('home-productsapi:profile-controller');
var config = require('../config');
var appError = require('../config/appError');
var authenticate = require('./authController').authenticate;

exports.userGetUserProfile = authenticate('client',_getUserProfile());
exports.veterinaryGetUserProfile = authenticate('veterinary',_getUserProfile());
exports.distributorGetUserProfile = authenticate('distributor',_getUserProfile());

function _getUserProfile(){
  return function(req, res, next, user,token){
    debug("_getUserProfile");
    return res.json({success: true, item: user});
  }
}

exports.userPatchUser = authenticate('client',_patchUser());
exports.veterinaryPatchUser = authenticate('veterinary',_patchUser());
exports.distributorPatchUser = authenticate('distributor',_patchUser());

function _patchUser(){
  return async function(req, res, next, user,token){
    debug("_patchUser");
    let body = req.body;
    for(let prop in body){
      user[prop] = body[prop];
    }
    user = await user.save();
    return res.json({success: true, item: user});
  }
}

exports.userVerifyEmail = verifyUserEmail('client');
exports.veterinaryVerifyEmail = verifyUserEmail('veterinary');
exports.distributorVerifyEmail = verifyUserEmail('distributor');

function verifyUserEmail(userType){
  return async function(req, res, next){
    debug("verifyUserEmail",userType);
    let verifictionCode = req.query.c;
    let userId = req.params.id;
    let userModel = userType=='client'?User:
    userType=='veterinary'?User:
    userType=='distributor'?User:null;
    if(!userType)
    return next(appError("No econtrado",404));
    userModel.findById(userId).then(user=>{
      // debug("user.verificationCode",user.verification);
      // debug("verificationCode",verificationCode);
      if(user.verification == verificationCode){
        return user.update({status:'active'}).then(success=>{
          res.sendfile('/verification/success.html', {root: './public'});
        },error=>{
          res.sendfile('/verification/error.html', {root: './public'});
        });
      }else{
        res.sendfile('/verification/error.html', {root: './public'});
      }
    },error=>{
      return next(appError("No econtrado",404));
    });
    authController.verifyEmail(verifictionCode,userId).then(success=>{
      if(success){
        res.sendfile('/verification/success.html', {root: './public'});
      }else{
        res.sendfile('/verification/error.html', {root: './public'});
      }
    },error=>{
      debug("error",error);
      res.sendfile('/verification/error.html', {root: './public'});
    });
  }

}

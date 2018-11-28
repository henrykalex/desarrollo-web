var debug = require('debug')('home-productsapi:passport');
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('../config');
var User = require('../models/user');
var Veterinary = require('../models/veterinary');
var Distributor = require('../models/distributor');

module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
  };
  passport.use('jwt-user',new JwtStrategy(opts, doneFunction('client'),(error)=>{
    debug("error",error);
  }));
  passport.use('jwt-veterinary',new JwtStrategy(opts, doneFunction('veterinary'),(error)=>{
    debug("error",error);
  }));
  passport.use('jwt-distributor',new JwtStrategy(opts, doneFunction('distributor'),(error)=>{
    debug("error",error);
  }));
  passport.use('jwt-master',new JwtStrategy(opts, doneFunction('master'),(error)=>{
    debug("error",error);
  }));
};
doneFunction = function(type){
  return (jwt_payload, done)=>{
    let userModel =
    type == 'master'?Distributor:
    type == 'distributor'?Distributor:
    type == 'veterinary'?Veterinary:
    type == 'client'?User: User;
    let isMaster = (type == 'master');
    let query = {
      id: jwt_payload.id,
      email:jwt_payload.email,
    };
    if(isMaster)
    query.isMaster = {$exists:isMaster, $eq:isMaster};

    userModel.findOne(query)
    .then((user)=>{
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    },(error)=>{
      return done(err, false);
    });
  }
}

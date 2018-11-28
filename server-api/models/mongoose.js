var debug = require('debug')('home-productsapi:mongoose-conect');
var debugError = require('debug')('home-productsapi:error-mongoose-conect');
var mongoose = require('mongoose');
var config = require('../config');

conectToMongo = ()=>{
  let options = {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD
  };
  debug("Conecting to mongo",options.user,options.pass,config.mongo.url);
  mongoose.connect(config.mongo.url,options).then(conected=>{
    debug("Mongo conected");
  },error=>{
    debugError("Mongo error",error);
    setTimeout(conectToMongo,2000);
  });
};
module.exports = conectToMongo;

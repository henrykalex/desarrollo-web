var debug = require('debug')('home-productsapi:userModel-controller');
var config = require('../config');
var appError = require('../config/appError');

var Veterinary = require('../models/veterinary');


exports.getVeterinariesLocations = _getVeterinariesLocations();

function _getVeterinariesLocations(){
  return function(req, res, next){
    Veterinary.find({}).select("-_id name location")
    .exec().then(veterinaries=>{
      return res.json({success: true, items: veterinaries});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

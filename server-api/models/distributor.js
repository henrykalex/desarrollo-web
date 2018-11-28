var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var ObjectId = Schema.Types.ObjectId;
var helper = require('./helper')
var userBase = helper.userBase;
var addressInterface = helper.addressInterface;
var hashPassword = helper.hashPassword;



var distributorSchema = new Schema(Object.assign({},userBase,{
  // name, email, password
  isMaster: Boolean,
  isMain: Boolean,
  legalUserName: String,
  rfc: String,
  shippingAddress: addressInterface,
  legalAddress: addressInterface,
  phone: String,
  reference: {name: String, phone: String, relationship: String, address: String},
  veterinariesLinked: [{type: ObjectId, ref:'Veterinary'}],
}));

distributorSchema.pre('save', hashPassword);

distributorSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Distributor', distributorSchema);

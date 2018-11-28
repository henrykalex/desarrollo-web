var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var ObjectId = Schema.Types.ObjectId;
var helper = require('./helper')
var addressInterface = helper.addressInterface;
var userBase = helper.userBase;
var hashPassword = helper.hashPassword;

var veterinarySchema = new Schema(Object.assign({},userBase,{
  legalUserName: String,
  shippingAddress: addressInterface,
  phone: String,
  location: [Number],
  distributorsLinked: [{type: ObjectId, ref:'Distributor'}],
  usersLinked: [{type: ObjectId, ref:'User'}],
}));

veterinarySchema.index({ location: "2dsphere"});
veterinarySchema.pre('save', hashPassword);

veterinarySchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Veterinary', veterinarySchema);

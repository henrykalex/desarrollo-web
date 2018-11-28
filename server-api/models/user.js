var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var ObjectId = Schema.Types.ObjectId;
var helper = require('./helper')
var userBase = helper.userBase;
var hashPassword = helper.hashPassword;

var userSchema = new Schema(Object.assign({},userBase,{
  // phone: String,
  phone: String,
  country: String,
  veterinariesLinked: [{type: ObjectId, ref:'Veterinary'}],
}));

userSchema.pre('save', hashPassword);

userSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);

var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

exports.userBase = {
  name:  {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: '{VALUE} is not a valid email!'
    },
  },
  password: {
    type: String,
    required: true
  },
  verification: String,
  registerDate: Date,
  lastLogin: Date,
  status: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['active','verify','verify-request','request','inactive'].includes(v);
      },
      message: '{VALUE} no es un estatus válido!'
    }
  },
  products: [{product: {type:ObjectId, ref:'Product'}, quantity: Number}],
  points: Number,
  totalPoints: Number,
  userCode: String, // Código para ligar/referenciar
  // referenceCode: String, //Codigo del referenciado
  referenceCount: Number, // Contador de referenciados conn este código
};

exports.addressInterface = {
  street: String,
  number: String,
  city: String,
  state: String,
  country: String,
  postalcode: String,
};


exports.hashPassword = function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var orderSchema = new Schema({
  orderCode: String,
  products: [{
    productId:{type: ObjectId, ref:'Product'},
    cost: Number,
    quantity: Number,
    isReward: Boolean,
  }],
  total: Number,
  totalPoints: Number,
  totalRewardPoints: Number,
  date: Date,
  userId: {type: ObjectId, ref: 'User'}, // User Id + Vterinary Id
  veterinaryId: {type: ObjectId, ref: 'Veterinary'}, // Veterinary Id + Distributor Id
  distributorId: {type: ObjectId, ref: 'Distributor'}, // Distributor Id
  userType: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['client','veterinary','distributor'].includes(v);
      },
      message: '{VALUE} no es un estatus válido!'
    }
  },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['complete','incomplete'].includes(v);
      },
      message: '{VALUE} no es un estatus válido!'
    }
  },
});


module.exports = mongoose.model('Order', orderSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var productSchema = new Schema({
  name: String,
  category: { // sector
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['home','coucine','bathroom','room'].includes(v);
      },
      message: '{VALUE} no es un sector válido!'
    }
  },
  characteristics: String,
  presentations: String,
  feedingChartImage: String,
  image: String,
  points: Number, // que aporta o cuesta
  cost: Number,
  isReward: Boolean,
  generalInfo: String,
  productCode: String,
  status: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['active','inactive'].includes(v);
      },
      message: '{VALUE} no es un estatus válido!'
    }
  },
});


module.exports = mongoose.model('Product', productSchema);

var debug = require('debug')('home-productsapi:order-controller');
var config = require('../config');
var appError = require('../config/appError');
var authenticate = require('./authController').authenticate;
var shortid = require('shortid');

var Order = require('../models/order');
var User = require('../models/user');
var Veterinary = require('../models/veterinary');
var Distributor = require('../models/distributor');
var Product = require('../models/product');

var emailController = require('./emailController');

const CREATE_ORDER_MESSAGE = config.CREATE_ORDER_MESSAGE;
const CREATE_ORDER_MESSAGE_HTML = config.CREATE_ORDER_MESSAGE_HTML;
const CREATE_ORDER_SUBJECT = config.CREATE_ORDER_SUBJECT;

exports.userGetOrdersByPage = authenticate('client',_getOrdersByPage('client'));
exports.veterinaryGetOrdersByPage = authenticate('veterinary',_getOrdersByPage('veterinary'));
exports.distributorGetOrdersByPage = authenticate('distributor',_getOrdersByPage('distributor'));

function _getOrdersByPage(userType){
  return function(req, res, next, user,token){
    debug("_getOrdersByPage",userType);
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);
    let sort = req.query.sort?req.query.sort:'_id';
    let sortDir = req.query.direction?req.query.direction.toUpperCase():'DESC';
    // let order = sort?
    // sort=='estatus'?
    // [[sort, sortDir]]:
    // [['estatus','ASC'],[sort, sortDir]]:
    // [['estatus','ASC']];
    let query;
    if(userType == 'client')
    query = {userId:user._id,userType:userType};
    if(userType == 'veterinary')
    query = {veterinaryId:user._id,userType:userType};
    if(userType == 'distributor')
    query = {distributorId:user._id,userType:userType};

    Promise.all([
      Order.find(query).populate('userId veterinaryId distributorId','name').skip(skip).limit(5),
      Order.count(query)
    ]).then(orders=>{
      return res.json({success: true, items: orders[0],count:orders[1]});
    },error=>{
      debug("Promise.all error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

function getOrderUserQuery(userType,userId){
  let query;
  if(userType == 'client')
  query = {userId:userId,userType:userType};
  if(userType == 'veterinary')
  query = {veterinaryId:userId,userType:userType};
  if(userType == 'distributor')
  query = {distributorId:userId,userType:userType};
  return query
}

exports.masterGetUserOrdersByPage = authenticate('master',_getUserOrders());
function _getUserOrders(){
  return async function(req, res, next, user,token){
    debug("_getUserOrders");
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);

    let userId = req.params.id;
    let userModel = req.params.userModel;

    let query = getOrderUserQuery(userModel,userId);

    Promise.all([
      Order.find(query).skip(skip).limit(limit),
      Order.count(query)
    ]).then(orders=>{
      return res.json({success: true, items: orders[0],count:orders[1]});
    },error=>{
      debug("Promise.all error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.userGetOrder = authenticate('client',_getOrder());
exports.veterinaryGetOrder = authenticate('veterinary',_getOrder());
exports.distributorGetOrder = authenticate('distributor',_getOrder());
exports.masterGetOrder = authenticate('master',_getOrder());
function _getOrder(){
  return function(req, res, next, user,token){
    debug("_getOrder");
    let orderId = req.params.id
    // TODO validate is from the user
    Order.findById(orderId)
    .populate('userId veterinaryId distributorId','name')
    .populate('products.productId','_id productCode name category')
    .then(order=>{
      return res.json({success: true, item: order});
    },error=>{
      debug("Order.findById error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.userGetOrderProviders = authenticate('client',_getOrderProviders('client'));
exports.veterinaryGetOrderProviders = authenticate('veterinary',_getOrderProviders('veterinary'));
function _getOrderProviders(userType){
  return function(req, res, next, user,token){
    debug("_getOrderProviders",userType);
    let providersQuery;
    if(userType=='client')
    providersQuery = User.findById(user._id).populate('veterinariesLinked').select('_id name').exec();
    if(userType=='veterinary')
    providersQuery = Veterinary.findById(user._id).populate('distributorsLinked').select('_id name').exec();
    providersQuery.then(userPopulated=>{
      let providers = userType=='client'?userPopulated.veterinariesLinked:
      userType=='veterinary'?userPopulated.distributorsLinked:[];
      res.json({success: true, items:providers})
    },error=>{
      debug("providersQuery.then error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.userAddOrder = authenticate('client',_addOrder('client'));
exports.veterinaryAddOrder = authenticate('veterinary',_addOrder('veterinary'));
exports.distributorAddOrder = authenticate('distributor',_addOrder('distributor'));
function _addOrder(userType){
  return async function(req, res, next, user,token){
    debug("_addOrder",userType);
    let body = req.body;
    let orderCode = shortid.generate();
    let newOrder = new Order();
    newOrder.products = body.orderList;

    if(userType=='client'){
      newOrder.userId = user._id;
      newOrder.veterinaryId = body.providerId;
    }
    if(userType=='veterinary'){
      newOrder.veterinaryId = user._id;
      newOrder.distributorId = body.providerId;
    }
    if(userType=='distributor')
    newOrder.distributorId = user._id;


    newOrder.orderCode = orderCode;
    newOrder.status = 'incomplete';
    newOrder.userType = userType;
    newOrder.date = new Date();

    let totalCost = 0;
    let totalPoints = 0;
    let totalRewardPoints = 0;
    let productsId = newOrder.products.map(product=>{
      return product.productId;
    });
    let dbProducts = await Product.find({_id:{$in:productsId}});
    dbProducts.forEach(dbProduct=>{
      let requestProduct = newOrder.products.find(reqProduct=>reqProduct.productId.toString()==dbProduct._id.toString());
      totalPoints+= dbProduct.isReward?dbProduct.points*requestProduct.quantity:0;
      totalRewardPoints+= !dbProduct.isReward?dbProduct.points*requestProduct.quantity:0;
      totalCost+= !dbProduct.isReward?dbProduct.cost*requestProduct.quantity:0;
    });
    newOrder.total = totalCost;
    newOrder.totalPoints = totalPoints;
    newOrder.totalRewardPoints = totalRewardPoints;

    if(user.points < newOrder.totalPoints)
    return next(appError("No se cuenta con puntos suficientes"));

    newOrder.save().then(async order=>{
      // Get parent user from db
      let provider;
      if(userType=='client')
      provider = await Veterinary.findById(order.veterinaryId).select('_id name email').exec();
      if(userType=='veterinary')
      provider = await Distributor.findById(order.distributorId).select('_id name email').exec();
      if(userType=='distributor')
      provider = await Distributor.findOne({isMaster:true}).select('_id name email').exec();
      emailController.sendEmail(provider.name,provider.email,CREATE_ORDER_MESSAGE,CREATE_ORDER_MESSAGE_HTML,CREATE_ORDER_SUBJECT)
      .then(sended=>{
        res.json({success: true, item: order});
      },error=>{
        debug("Error sending email",error);
        res.json({success: true, item: order});
      });
    },error=>{
      debug("newOrder.save error",error);
      return next(appError("Error al guardar en la base de datos"));
    });
  }
}


exports.userDeleteOrder = authenticate('client',_deleteOrder());
exports.veterinaryDeleteOrder = authenticate('veterinary',_deleteOrder());
exports.distributorDeleteOrder = authenticate('distributor',_deleteOrder());
function _deleteOrder(){
  return function(req, res, next, user,token){
  }
}

exports.userPatchOrder = authenticate('client',_patchOrder());
exports.veterinaryPatchOrder = authenticate('veterinary',_patchOrder());
exports.distributorPatchOrder = authenticate('distributor',_patchOrder());
function _patchOrder(){
  return function(req, res, next, user,token){
  }
}

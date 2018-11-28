var debug = require('debug')('home-productsapi:request-controller');
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

const APROBE_REQUEST_MESSAGE = config.APROBE_REQUEST_MESSAGE;
const APROBE_REQUEST_MESSAGE_HTML = config.APROBE_REQUEST_MESSAGE_HTML;
const APROBE_REQUEST_SUBJECT = config.APROBE_REQUEST_SUBJECT;

exports.veterinaryGetRequestsByPage = authenticate('veterinary',_getRequestsByPage('veterinary', false));
exports.distributorGetRequestsByPage = authenticate('distributor',_getRequestsByPage('distributor', false));
exports.masterGetRequestsByPage = authenticate('master',_getRequestsByPage('master', false));

exports.veterinaryGetRequestsAproveByPage = authenticate('veterinary',_getRequestsByPage('veterinary', true));
exports.distributorGetRequestsAproveByPage = authenticate('distributor',_getRequestsByPage('distributor', true));
exports.masterGetRequestsAproveByPage = authenticate('master',_getRequestsByPage('master', true));

function _getRequestsByPage(userType, isIncomplete){
  return function(req, res, next, user,token){
    debug("_getRequestsByPage",userType,isIncomplete);
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);
    let sort = req.query.sort?req.query.sort:'_id';
    let sortDir = req.query.direction?req.query.direction.toUpperCase():'DESC';
    // let request = sort?
    // sort=='estatus'?
    // [[sort, sortDir]]:
    // [['estatus','ASC'],[sort, sortDir]]:
    // [['estatus','ASC']];
    let query;

    if(userType == 'veterinary')
    query = {veterinaryId:user._id,userType:'client'};
    if(userType == 'distributor')
    query = {distributorId:user._id,userType:'veterinary'};
    if(userType == 'master')
    query = {userType:'distributor'};

    query.status = isIncomplete?'incomplete':'complete';

    Promise.all([
      Order.find(query).populate('userId veterinaryId distributorId','name').skip(skip).limit(5),
      Order.count(query)
    ]).then(orders=>{
      return res.json({success: true, items: orders[0],count:orders[1]});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.veterinaryAproveRequest = authenticate('veterinary',_aproveRequest('veterinary'));
exports.distributorAproveRequest = authenticate('distributor',_aproveRequest('distributor'));
exports.masterAproveRequest = authenticate('master',_aproveRequest('master'));
// Proceso: Get order -> Get master -> forEach order product -> Validate inventory existance ->
// ->Get buyer user -> Update user inventory -> Updte user points -> Update order status

function _aproveRequest(userType){
  return function(req, res, next, user,token){
    debug("_aproveRequest",userType);
    let orderId = req.params.id
    // TODO validate is from the user
    Order.findById(orderId)
    // .populate('userId veterinaryId distributorId','name')
    // .populate('products.productId','productCode name category')
    .then( async order=>{
      if(order.status=='complete')
      return next(appError("Error, la orden ya ha sido aprobada"));

      let master = await Distributor.findOne({isMaster:true,isMain:true}).exec();
      debug("master",master);
      if(!master)
      return next(appError("¡NO hay usuario 'MAIN'  CONTACTAR WEBMASTER!"));

      let buyerId = userType=='master'?order.distributorId:
      userType=='distributor'?order.veterinaryId:
      userType=='veterinary'?order.userId:null;
      // debug("buyerId",buyerId);
      let userModel = userType=='master'?Distributor:
      userType=='distributor'?Veterinary:
      userType=='veterinary'?User:null;
      let userBuyer = await userModel.findById(buyerId);
      // debug("userBuyer",userBuyer.name);

      let isAvailable = false;
      let userHasPoints = true;
      let missingProducts = [];
      order.products.forEach(orderProduct=>{
        // debug("orderProduct",orderProduct);
        let productsUser = orderProduct.isReward?master:user;
        let inventoryIndex = productsUser.products.findIndex(inventoryProduct=>{
          let var1 = inventoryProduct.product.toString();
          let var2 = orderProduct.productId.toString();
          // debug("inventoryProduct",var1, var2);
          return var1 == var2;
        });
        // debug("inventoryIndex",inventoryIndex);

        isAvailable = inventoryIndex!=-1;
        // debug("isAvailable",isAvailable,productsUser.products[inventoryIndex]);
        if(isAvailable)
        isAvailable = productsUser.products[inventoryIndex].quantity-orderProduct.quantity>=0;
        // debug("isAvailable",isAvailable);
        if(isAvailable){
          let buyerInventoryIndex = userBuyer.products.findIndex(inventoryProduct=>{
            return ""+inventoryProduct.product == ""+orderProduct.productId;
          });
          // debug("buyerInventoryIndex",buyerInventoryIndex);
          if(buyerInventoryIndex==-1){ // User doesn't have the product
            if(userBuyer.products){ // Validate array existance
              userBuyer.products.push({
                product: orderProduct.productId,
                quantity: orderProduct.quantity
              });
            }else {
              userBuyer.products = [{
                product: orderProduct.productId,
                quantity: orderProduct.quantity
              }];
            }
          }else{ // User has the product
            userBuyer.products[buyerInventoryIndex].quantity+=orderProduct.quantity;
          }
          productsUser.products[inventoryIndex].quantity = productsUser.products[inventoryIndex].quantity-orderProduct.quantity;
        }else{
          missingProducts.push({productId:orderProduct.productId});
        }
      });
      if(missingProducts.length>0){
        let products = await Product.populate(missingProducts,{path:'productId',select:'name'});
        products = products.map(product=>product.productId.name+"&");
        return next(appError("No se cuenta con el inventario suficiente, faltan los siguientes productos:"+products.toString(),401));
      }
      if(order.totalPoints)
      if(userBuyer.points - order.totalPoints>=0){
        userBuyer.points -= order.totalPoints;
      }else{
        return next(appError("El usuario no cuenta con los puntos suficientes",401));
      }
      if(order.totalRewardPoints){
        let rewardPoints = order.totalRewardPoints;
        userBuyer.points = userBuyer.points?userBuyer.points+rewardPoints:rewardPoints;
        userBuyer.totalPoints = userBuyer.totalPoints?userBuyer.totalPoints+rewardPoints:rewardPoints;
      }
      // return next(appError("Testing"));
      let promisesArray = [];
      promisesArray.push(user.save());
      promisesArray.push(master.save());
      promisesArray.push(userBuyer.save());

      order.status = 'complete';
      promisesArray.push(order.save());
      // debug("user",user);
      // debug("master",master);
      // debug("userBuyer",userBuyer);
      // debug("order",order);
      Promise.all(promisesArray).then(results=>{
        // debug("results",results[0],results[1],results[2],results[3]);
        // return res.json({success: true});
        emailController.sendEmail(userBuyer.name,userBuyer.email,APROBE_REQUEST_MESSAGE,APROBE_REQUEST_MESSAGE_HTML,APROBE_REQUEST_SUBJECT)
        .then(sended=>{
          // debug("userBuyer",userBuyer);
          return res.json({success: true});
        },error=>{
          debug("Error sending email",error);
          return res.json({success: true});
        });
      });
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.veterinaryGetRequest = authenticate('veterinary',_getRequest());
exports.distributorGetRequest = authenticate('distributor',_getRequest());
exports.masterGetRequest = authenticate('master',_getRequest());
function _getRequest(){
  return function(req, res, next, user,token){
    debug("_getRequest");
    let orderId = req.params.id
    // TODO validate is from the user
    Order.findById(orderId)
    .populate('userId veterinaryId distributorId','name')
    .populate('products.productId','productCode name category')
    .then(order=>{
      return res.json({success: true, item: order});
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.veterinaryGetRequestBuyers = authenticate('veterinary',_getRequestBuyers('veterinary'));
exports.distributorGetRequestBuyers = authenticate('distributor',_getRequestBuyers('distributor'));
exports.masterGetRequestBuyers = authenticate('master',_getRequestBuyers('master'));

function _getRequestBuyers(userType){
  return function(req, res, next, user,token){
    debug("_getRequestBuyers",userType);
    let buyersQuery;
    if(userType=='veterinary')
    buyersQuery = Veterinary.findById(user._id).populate('usersLinked').select('_id name').exec();
    if(userType=='distributor')
    buyersQuery = Distributor.findById(user._id).populate('veterinariesLinked').select('_id name').exec();
    if(userType=='master')
    buyersQuery = Distributor.find({isMaster:{$exists: false}, status: 'active'}).select('_id name').exec();
    // debug("buyersQuery",buyersQuery);
    buyersQuery.then(userPopulated=>{
      let buyers = userType=='distributor'?userPopulated.veterinariesLinked:
      userType=='veterinary'?userPopulated.usersLinked:
      userType=='master'?userPopulated:[];
      res.json({success: true, items:buyers})
    },error=>{
      debug("error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.veterinaryAddRequest = authenticate('veterinary',_addRequest('veterinary'));
exports.distributorAddRequest = authenticate('distributor',_addRequest('distributor'));
exports.masterAddRequest = authenticate('master',_addRequest('master'));

function _addRequest(userType){
  return function(req, res, next, user,token){
    debug("_addRequest",userType);
    let body = req.body;
    // debug("body",body);
    let orderCode = shortid.generate();
    let newOrder = new Order();
    newOrder.products = body.requestList;

    if(userType=='veterinary'){
      newOrder.veterinaryId = user._id;
      newOrder.userId = body.buyerId;
    }
    if(userType=='distributor'){
      newOrder.distributorId = user._id;
      newOrder.veterinaryId = body.buyerId;
    }
    if(userType=='master'){
      newOrder.distributorId = body.buyerId;
    }

    newOrder.orderCode = orderCode;
    newOrder.status = 'incomplete';
    newOrder.userType = userType=='master'?'distributor':
    userType=='distributor'?'veterinary':
    userType=='veterinary'?'client':'client';
    newOrder.date = new Date();

    let totalCost = 0;
    let totalPoints = 0;
    let totalRewardPoints = 0;
    let productsId = newOrder.products.map(product=>{
      return product.productId;
    });
    // debug("productsId",productsId);
    Product.find({_id:{$in:productsId}}).then(dbProducts=>{
      // debug("dbProducts",dbProducts);
      dbProducts.forEach(dbProduct=>{
        // debug("dbProduct",dbProduct);
        // debug("newOrder",newOrder);
        let requestProduct = newOrder.products.find(reqProduct=>reqProduct.productId.toString()==dbProduct._id.toString());
        // debug("requestProduct",requestProduct);
        totalPoints+= dbProduct.isReward?dbProduct.points*requestProduct.quantity:0;
        totalRewardPoints+= !dbProduct.isReward?dbProduct.points*requestProduct.quantity:0;
        totalCost+= !dbProduct.isReward?dbProduct.cost*requestProduct.quantity:0;
      });

      // debug("totalCost",totalCost,totalPoints,totalRewardPoints);
      newOrder.total = totalCost;
      newOrder.totalPoints = totalPoints;
      newOrder.totalRewardPoints = totalRewardPoints;

      // debug("newOrder",newOrder);
      newOrder.save().then(order=>{
        // debug("order ",order);
        res.json({success: true, item: order});
      },error=>{
        debug("error",error);
        return next(appError("Error al guardar en la base de datos"));
      });
    });
  }
}


exports.veterinaryDeleteRequest = authenticate('veterinary',_deleteRequest());
exports.distributorDeleteRequest = authenticate('distributor',_deleteRequest());
exports.masterDeleteRequest = authenticate('master',_deleteRequest());
function _deleteRequest(){
  return function(req, res, next, user,token){
  }
}

exports.veterinaryPatchRequest = authenticate('veterinary',_patchRequest());
exports.distributorPatchRequest = authenticate('distributor',_patchRequest());
exports.masterPatchRequest = authenticate('master',_patchRequest());
function _patchRequest(){
  return function(req, res, next, user,token){
  }
}

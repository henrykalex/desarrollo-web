var debug = require('debug')('home-productsapi:product-controller');
var config = require('../config');
var appError = require('../config/appError');
var authenticate = require('./authController').authenticate;
var shortid = require('shortid');
var imageUploadController = require('./imageUploadController');

var Product = require('../models/product');
var User = require('../models/user');
var Veterinary = require('../models/veterinary');
var Distributor = require('../models/distributor');
var Order = require('../models/order');

function getUserModel(userModelType){
  return userModelType=='distributor'?Distributor:
  userModelType=='veterinary'?Veterinary:
  userModelType=='client'?User:
  null;
}

exports.userGetProductsByPage = authenticate('client',_getProductsByPage('client'));
exports.veterinaryGetProductsByPage = authenticate('veterinary',_getProductsByPage('veterinary'));
exports.distributorGetProductsByPage = authenticate('distributor',_getProductsByPage('distributor'));
exports.masterGetProductsByPage = authenticate('master',_getProductsByPage('master'));

function _getProductsByPage(userType){
  return function(req, res, next, user,token){
    debug("_getProductsByPage")
    // let limit = req.query.limit?parseInt(req.query.limit):5;
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);
    let sort = req.query.sort?req.query.sort:'_id';
    let sortDir = req.query.direction?req.query.direction.toUpperCase():'DESC';



    let isReward = req.query.reward?true:false;
    let query = {isReward:{$exists:isReward},status:'active'};
    // debug("skip",skip, page);
    Promise.all([
      Product.find(query).skip(skip).limit(limit),
      Product.count(query)
    ])
    .then(products=>{
      return res.json({success: true, items: products[0],count:products[1]});
    },error=>{
      debug("Promise.all error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

function filterRewardProducts(products){
  return products.filter(product=>product.isReward);
}

exports.userGetProduct = authenticate('client',_getProduct());
exports.veterinaryGetProduct = authenticate('veterinary',_getProduct());
exports.distributorGetProduct = authenticate('distributor',_getProduct());
exports.masterGetProduct = authenticate('master',_getProduct());
function _getProduct(){
  return function(req, res, next, user,token){
    debug("_getProduct")
    let productId = req.params.id
    let query = {_id:productId};

    Product.findOne(query).then(product=>{
      return res.json({success: true, item: product});
    },error=>{
      debug("Product.findOne error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.userGetProductInventory = authenticate('client',_getProductInventory());
exports.veterinaryGetProductInventory = authenticate('veterinary',_getProductInventory());
exports.distributorGetProductInventory = authenticate('distributor',_getProductInventory());
exports.masterGetProductInventory = authenticate('master',_getProductInventory());
function _getProductInventory(){
  return function(req, res, next, user,token){
    debug("_getProductInventory");
    let productId = req.params.id
    let product = user.products.find(product=>product.product == productId);
    let quantity = product?product.quantity:0;
    return res.json({success: true, quantity: quantity});
  }
}

exports.userGetProductsInventoryReward = authenticate('client',_getProductsInventoryReward('client'));
exports.veterinaryGetProductsInventoryReward = authenticate('veterinary',_getProductsInventoryReward('veterinary'));
exports.distributorGetProductsInventoryReward = authenticate('distributor',_getProductsInventoryReward('distributor'));
exports.masterGetProductsInventoryReward = authenticate('master',_getProductsInventoryReward('master'));
function _getProductsInventoryReward(userType){
  return async function(req, res, next, user,token){
    debug("_getProductsInventoryReward");
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);

    let userId;
    let productsIds = [];

    if(userType=='master' && req.params.userType){
      userId = req.params.userId;// Admin get reward products from userId
      let userModel = getUserModel(req.params.userType);
      let dbUser = await userModel.findById(userId);
      productsIds = dbUser.products;
    }else{
      userId = user._id;
      productsIds = user.products;
    }
    productsIds = productsIds.map(productId=>productId.product);

    let query = {};
    if(productsIds.length>0)
    query._id = {$in: productsIds};
    query.isReward = true;

    Promise.all([
      Product.find(query).skip(skip).limit(limit),
      Product.count(query)
    ])
    .then(products=>{
      // debug("products",products);
      return res.json({success: true, items: products[0],count:products[1]});
    },error=>{
      debug("Promise.all error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.masterGetProductOrders = authenticate('master',_getProductOrders());
function _getProductOrders(){
  return async function(req, res, next, user,token){
    debug("_getProductOrders");
    let limit = 5;
    let page = req.query.page?parseInt(req.query.page):0;
    let skip = (page?(limit)*(page):0);

    let productId = req.params.id;
    let userModel = req.params.userModel;
    let query = {'products.productId':productId,userType:userModel};


    Promise.all([
      Order.find(query).skip(skip).limit(limit),
      Order.count(query)
    ])
    .then(orders=>{
      // debug("orders",orders);
      return res.json({success: true, items: orders[0],count:orders[1]});
    },error=>{
      debug("Promise.all error",error);
      return next(appError("Error al buscar en la base de datos"));
    });
  }
}

exports.masterAddProduct = authenticate('master',_addProduct());
function _addProduct(){
  return function(req, res, next, user,token){
    debug("_addProduct");
    let body = req.body;
    let productCode = shortid.generate();
    body.productCode = productCode;
    body.status = 'active';
    let newProduct = new Product(body);
    let savePromises = [newProduct.save()];
    if(!newProduct.isReward)
    savePromises.push(
      Distributor.updateMany(
        {isMaster:{$exists:true, $eq:true}},
        {$push:{products:{product:newProduct._id,quantity:0}}}
      )
    );
    Promise.all(savePromises)
    .then(results=>{
      res.json({success: true, item: results[0]});
    },error=>{
      debug("Promise.all error",error);
      return next(appError("Error al guardar en la base de datos"));
    });
  }
}

exports.masterAddProductImage = authenticate('master',_addProductImage());
function _addProductImage(){
  return async function(req, res, next, user,token){
    debug("_addProductImage");
    let productId = req.params.id;
    let body = req.body;
    let fileName;
    fileName = await imageUploadController.uploadImage('product',productId, req);
    Product.findByIdAndUpdate(productId,{image: fileName})
    .exec().then(product=>{
      if(product){
        res.json({success: true, image: fileName});
      }else{
        return next(appError("No se encontró el elemento"));
      }
    },error=>{
      debug("Product.findByIdAndUpdate error",error);
      return next(appError("Error al actualizar el elemento"));
    });
  }
}

exports.masterAddProductfeedingChartImage = authenticate('master',_addProductFeedingChartImage());
function _addProductFeedingChartImage(){
  return async function(req, res, next, user,token){
    debug("_addProductFeedingChartImage");
    let productId = req.params.id;
    let body = req.body;
    let fileName;
    fileName = await imageUploadController.uploadImage('feedingChart',productId, req);
    Product.findByIdAndUpdate(productId,{feedingChartImage: fileName})
    .exec().then(product=>{
      if(product){
        res.json({success: true, image: fileName});
      }else{
        return next(appError("No se encontró el elemento"));
      }

    },error=>{
      debug("Product.findByIdAndUpdate error",error);
      return next(appError("Error al actualizar el elemento"));
    });
  }
}

exports.masterDeleteProduct = authenticate('master',_delteProduct());
function _delteProduct(){
  return async function(req, res, next, user,token){
    debug("_delteProduct");
    let productId = req.params.id;
    // debug("productId",productId);
    Product.findByIdAndUpdate(productId,{status:'inactive'}, {new: true})
    .exec().then(product=>{
      // debug("product",product);
      if(product){
        res.json({success: true, item: product});
      }else{
        return next(appError("No se encontró el elemento"));
      }
    },error=>{
      debug("Product.findByIdAndUpdate error",error);
      return next(appError("Error al actualizar el elemento"));
    });
  }
}

exports.masterPatchProduct = authenticate('master',_patchProduct());
function _patchProduct(){
  return async function(req, res, next, user,token){
    debug("_patchProduct");
    let productId = req.params.id;
    let body = req.body;
    Product.findByIdAndUpdate(productId,body, {new: true})
    .exec().then(product=>{
      if(product){
        res.json({success: true, item: product});
      }else{
        return next(appError("No se encontró el elemento"));
      }
    },error=>{
      debug("Product.findByIdAndUpdate error",error);
      return next(appError("Error al actualizar el elemento"));
    });
  }
}

exports.masterPatchProductInventory = authenticate('master',_patchProductInventory());
function _patchProductInventory(){
  return async function(req, res, next, user,token){
    debug("_patchProductInventory");
    let productId = req.params.id;
    let quantity = req.body.quantity;
    quantity = quantity?quantity:0;
    let inventoryProductIndex = user.products.findIndex(product=>product.product==productId)
    if(inventoryProductIndex==-1){
      user.products.push({product:productId,quantity:quantity});
    }else{
      user.products[inventoryProductIndex].quantity = quantity;
    }
    Distributor.updateMany(
      {isMaster:{$exists:true, $eq:true},isMain:{$exists:true, $eq:true}},
      {$set:{products:user.products}}
    ).then(user=>{
      if(user){
        res.json({success: true});
      }else{
        return next(appError("No se encontró el elemento"));
      }
    },error=>{
      debug("Distributor.updateMany error",error);
      return next(appError("Error al actualizar el elemento"));
    });

  }
}

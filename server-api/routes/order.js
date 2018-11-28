var express = require('express');
var router = express.Router();

var orderController = require('../controllers/orderController');

router.get('/orders',orderController.userGetOrdersByPage); // ej. /users?limit=10&page=0&order=createdAt&direction=desc
router.get('/veterinary/orders',orderController.veterinaryGetOrdersByPage);
router.get('/distributor/orders',orderController.distributorGetOrdersByPage);
router.get('/master/orders/:userModel/:id',orderController.masterGetUserOrdersByPage);

router.get('/order/providers',orderController.userGetOrderProviders);
router.get('/veterinary/order/providers',orderController.veterinaryGetOrderProviders);

router.get('/order/:id',orderController.userGetOrder);
router.get('/veterinary/order/:id',orderController.veterinaryGetOrder);
router.get('/distributor/order/:id',orderController.distributorGetOrder);
router.get('/master/order/:id',orderController.masterGetOrder);

router.post('/order',orderController.userAddOrder);
router.post('/veterinary/order',orderController.veterinaryAddOrder);
router.post('/distributor/order',orderController.distributorAddOrder);

router.delete('/order/:id',orderController.userDeleteOrder);
router.delete('/veterinary/order/:id',orderController.veterinaryDeleteOrder);
router.delete('/distributor/order/:id',orderController.distributorDeleteOrder);

router.patch('/order/:id',orderController.userPatchOrder);
router.patch('/veterinary/order/:id',orderController.veterinaryPatchOrder);
router.patch('/distributor/order/:id',orderController.distributorPatchOrder);

module.exports = router;

var express = require('express');
var router = express.Router();

var productController = require('../controllers/productController');

router.get('/products',productController.userGetProductsByPage); // ej. /users?limit=10&page=0&order=createdAt&direction=desc
router.get('/veterinary/products',productController.veterinaryGetProductsByPage);
router.get('/distributor/products',productController.distributorGetProductsByPage);
router.get('/master/products',productController.masterGetProductsByPage);

router.get('/product/:id',productController.userGetProduct);
router.get('/veterinary/product/:id',productController.veterinaryGetProduct);
router.get('/distributor/product/:id',productController.distributorGetProduct);
router.get('/master/product/:id',productController.masterGetProduct);

router.get('/product/:id/inventory',productController.userGetProductInventory);
router.get('/veterinary/product/:id/inventory',productController.veterinaryGetProductInventory);
router.get('/distributor/product/:id/inventory',productController.distributorGetProductInventory);
router.get('/master/product/:id/inventory',productController.masterGetProductInventory);
router.get('/master/product/:id/orders/:userModel',productController.masterGetProductOrders);

router.get('/products/inventory/rewards',productController.userGetProductsInventoryReward);
router.get('/veterinary/products/inventory/rewards',productController.veterinaryGetProductsInventoryReward);
router.get('/distributor/products/inventory/rewards',productController.distributorGetProductsInventoryReward);
router.get('/master/products/:userType/:userId/inventory/rewards',productController.masterGetProductsInventoryReward);

router.post('/master/product',productController.masterAddProduct);
router.post('/master/product/:id/image',productController.masterAddProductImage);
router.post('/master/product/:id/feeding-chart-image',productController.masterAddProductfeedingChartImage);

router.delete('/master/product/:id',productController.masterDeleteProduct);

router.patch('/master/product/:id',productController.masterPatchProduct);
router.patch('/master/product/:id/inventory',productController.masterPatchProductInventory);

module.exports = router;

var debug = require('debug')('rematesapi:auth-routes');
var express = require('express');
var router = express.Router();

var authController = require('../controllers/authController');

router.post('/register',authController.registerUser);
router.post('/register/veterinary',authController.registerVeterinary);
router.post('/register/distributor',authController.registerDistributor);
// router.post('/register/master',authController.registerMaster);

router.post('/login',authController.loginUser);
router.post('/login/veterinary',authController.loginVeterinary);
router.post('/login/distributor',authController.loginDistributor);
router.post('/login/master',authController.loginMaster);

router.get('/isLoggedIn',authController.isLoggedInUser);
router.get('/isLoggedIn/veterinary',authController.isLoggedInVeterinary);
router.get('/isLoggedIn/distributor',authController.isLoggedInDistributor);
router.get('/isLoggedIn/master',authController.isLoggedInMaster);

router.get('/client/verify/:id',authController.verifyUser);
router.get('/veterinary/verify/:id',authController.verifyVeterinary);
router.get('/distributor/verify/:id',authController.verifyDistributor);

module.exports = router;

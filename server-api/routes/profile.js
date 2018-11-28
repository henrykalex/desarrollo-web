var express = require('express');
var router = express.Router();

var profileController = require('../controllers/profileController');


router.get('/profile',profileController.userGetUserProfile);
router.get('/veterinary/profile',profileController.veterinaryGetUserProfile);
router.get('/distributor/profile',profileController.distributorGetUserProfile);

router.patch('/profile',profileController.userPatchUser);
router.patch('/veterinary/profile',profileController.veterinaryPatchUser);
router.patch('/distributor/profile',profileController.distributorPatchUser);

router.get('/client/verify/:id',profileController.userVerifyEmail);
router.get('/veterinary/verify/:id',profileController.veterinaryVerifyEmail);
router.get('/distributor/verify/:id',profileController.distributorVerifyEmail);

module.exports = router;

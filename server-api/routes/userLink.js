var express = require('express');
var router = express.Router();

var userLinkController = require('../controllers/userLinkController');

router.post('/link/:userModel',userLinkController.userLinkUserModel);
router.post('/veterinary/link/:userModel',userLinkController.veterinaryLinkUserModel);
router.post('/distributor/link/:userModel',userLinkController.distributorLinkUserModel);
router.post('/master/link/:userModel',userLinkController.masterLinkUserModel);

router.get('/linked/:userModel',userLinkController.userGetLinkedUserModelByPage);
router.get('/veterinary/linked/:userModel',userLinkController.veterinaryGetLinkedUserModelByPage);
router.get('/distributor/linked/:userModel',userLinkController.distributorGetLinkedUserModelByPage);
router.get('/master/linked/:userModel',userLinkController.masterGetLinkedUserModelByPage);

router.get('/user/:userModel/:id',userLinkController.userGetLinkedUserModel);
router.get('/veterinary/user/:userModel/:id',userLinkController.veterinaryGetLinkedUserModel);
router.get('/distributor/user/:userModel/:id',userLinkController.distributorGetLinkedUserModel);

router.patch('/unlink/:userModel',userLinkController.userUnlinkUserModel);
router.patch('/veterinary/unlink/:userModel',userLinkController.veterinaryUnlinkUserModel);
router.patch('/distributor/unlink/:userModel',userLinkController.distributorUnlinkUserModel);
router.patch('/master/unlink/:userModel',userLinkController.masterUnlinkUserModel);

module.exports = router;

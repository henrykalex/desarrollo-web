var express = require('express');
var router = express.Router();

var requestController = require('../controllers/requestController');

router.get('/veterinary/requests',requestController.veterinaryGetRequestsByPage);
router.get('/distributor/requests',requestController.distributorGetRequestsByPage);
router.get('/master/requests',requestController.masterGetRequestsByPage);

router.get('/veterinary/requests/aprove',requestController.veterinaryGetRequestsAproveByPage);
router.get('/distributor/requests/aprove',requestController.distributorGetRequestsAproveByPage);
router.get('/master/requests/aprove',requestController.masterGetRequestsAproveByPage);

router.get('/veterinary/request/buyers',requestController.veterinaryGetRequestBuyers);
router.get('/distributor/request/buyers',requestController.distributorGetRequestBuyers);
router.get('/master/request/buyers',requestController.masterGetRequestBuyers);

router.get('/veterinary/request/:id',requestController.veterinaryGetRequest);
router.get('/distributor/request/:id',requestController.distributorGetRequest);
router.get('/master/request/:id',requestController.masterGetRequest);

router.get('/veterinary/request/:id/aprove',requestController.veterinaryAproveRequest);
router.get('/distributor/request/:id/aprove',requestController.distributorAproveRequest);
router.get('/master/request/:id/aprove',requestController.masterAproveRequest);

router.post('/veterinary/request',requestController.veterinaryAddRequest);
router.post('/distributor/request',requestController.distributorAddRequest);
router.post('/master/request',requestController.masterAddRequest);

router.delete('/veterinary/request/:id',requestController.veterinaryDeleteRequest);
router.delete('/distributor/request/:id',requestController.distributorDeleteRequest);
router.delete('/master/request/:id',requestController.masterDeleteRequest);

router.patch('/veterinary/request/:id',requestController.veterinaryPatchRequest);
router.patch('/distributor/request/:id',requestController.distributorPatchRequest);
router.patch('/master/request/:id',requestController.masterPatchRequest);

module.exports = router;

var express = require('express');
var router = express.Router();

var userModelAdminController = require('../controllers/userModelAdminController');

router.get('/master/users/:userModel',userModelAdminController.masterGetUsersByPage);

router.get('/master/user/:userModel/:id',userModelAdminController.masterGetUser);

router.post('/master/user/:userModel',userModelAdminController.masterAddUser);

router.get('/master/user/aprove/:userModel/:id',userModelAdminController.masterAproveUser);

router.delete('/master/user/:userModel/:id',userModelAdminController.masterDeleteUser);

router.patch('/master/user/:userModel/:id',userModelAdminController.masterPatchUser);

module.exports = router;

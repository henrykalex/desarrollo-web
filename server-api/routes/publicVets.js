var express = require('express');
var router = express.Router();

var publicVetsController = require('../controllers/publicVetsController');


router.get('/veterinaries-locations',publicVetsController.getVeterinariesLocations);

module.exports = router;

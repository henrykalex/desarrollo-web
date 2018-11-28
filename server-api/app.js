var debug = require('debug')('home-productsapi:app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config');

var app = express();

var urlBase = config.urlBase;
debug("urlBase",urlBase);

var cors = require('./cors');
app.use(cors);

// Pasport init
require('./config/passport-jwt')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongooseConect = require('./models/mongoose');
mongooseConect();

let appFolders = require('./appFolders');
appFolders.syncFolders();

app.use(urlBase+'/product-images',express.static(path.join(__dirname,'..', 'uploads','products')));
app.use(urlBase+'/feeding-chart-images',express.static(path.join(__dirname,'..', 'uploads','feeding-charts')));


var auth = require('./routes/auth');
app.use(urlBase,auth);
var product = require('./routes/product');
app.use(urlBase,product);
var userModelAdmin = require('./routes/userModelAdmin');
app.use(urlBase,userModelAdmin);
var userLink = require('./routes/userLink');
app.use(urlBase,userLink);
var profile = require('./routes/profile');
app.use(urlBase,profile);
var order = require('./routes/order');
app.use(urlBase,order);
var request = require('./routes/request');
app.use(urlBase,request);
var publicVets = require('./routes/publicVets');
app.use(urlBase,publicVets);

// var cron = require('./controllers/cronController');
// cron.start();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({message:err.message});
});

module.exports = app;

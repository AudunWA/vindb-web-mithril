// Global debug flag
debug = typeof v8debug === 'object';

console.log("VinDB server starting!");
console.log("Debug: " + debug);

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// REST
var priceHistory = require('./routes/rest/pricehistory');
var restProduct = require("./routes/rest/product");
var restProducts = require("./routes/rest/products");
var priceChanges = require("./routes/rest/pricechanges");
var changes = require("./routes/rest/changes");

var app = express();
var test = app.get('env');
if (app.get('env') === 'development') {
  // Load environment variables from .env
  require('dotenv').config();
}

app.set('view engine', 'jade');

// set mysql config
pool = mysql.createPool({
  connectionLimit: 15,
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME
});

// Listen port
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

// REST
app.use('/rest/pricehistory', priceHistory);
app.use("/rest/products", restProduct);
app.use("/rest/products", restProducts);
app.use("/rest/pricechanges", priceChanges);
app.use("/rest/changes", changes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Start listen
//if (app.get('env') != 'development') {
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
//}

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');


var app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


function setRouter( routerName ){
  var newRouter = require('./routes/' + routerName);
  app.use('/' + routerName , newRouter);
}

app.use('/', indexRouter);

setRouter('pcrun');
setRouter('acamibo');
setRouter('wasmEngine');
// setRouter('media');
setRouter('tetdoku');
//setRouter('comicBook');
var newRouter = require('./routes/helltaker');
app.use('/helltaker' , newRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

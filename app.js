const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const {startDb} = require('./services/db');
const indexRouter = require('./routes/index');

const app = express();

dotenv.config();

(async () => {
  const db = await startDb();

  // dependency injection
  app.use(function(req, res, next) {
    req.db = db;
    next();
  });

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/', indexRouter);

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
    res.send('error');
  });
})();


module.exports = app;

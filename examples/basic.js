'use strict';

/**
 * Modules
 */
const express = require('express');
const expressify = require('../');

const app = express();
module.exports = app;

app.get('/', expressify(function(ctx, next) {
  ctx.body = 'Hello World';
}));

app.get('/flow', function(req, res, next) {
  res.locals.expressify = 'Hello';
  next();
});

app.get('/flow', expressify(function(ctx, next) {
  ctx.res.locals.expressify += ' World';
  next();
}));

app.get('/flow', function(req, res, next) {
  res.send(res.locals.expressify);
});

app.get('/logout', expressify(function(ctx, next) {
  ctx.redirect('/login');
}));

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000'); // eslint-disable-line no-console
}
/**
 * Expressify Koa
 * Copyright(c) 2017 Faraz Syed
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const Koa = require('koa');
const Stream = require('stream');
const compose = require('koa-compose');
const isJSON = require('koa-is-json');
const onFinished = require('on-finished');

/**
 * Express/Connect-compatible middleware
 *
 * Modifed version of Koa's `callback()` method:
 * https://github.com/koajs/koa/blob/ee5af59f1f847922c9cf41ccedbdbe6a3c024c2e/lib/application.js#L125
 *
 * @param {function} middleware
 * @returns {middleware}
 */
module.exports = function expressify(middleware) {
  const app = new Koa();
  app.use(middleware);
  const fn = compose(app.middleware);

  if (!app.listeners('error').length) {
    app.on('error', app.onerror);
  }

  return (req, res, next) => {
    const ctx = app.createContext(req, res);
    const onerror = err => ctx.onerror(err);
    onFinished(res, onerror);
    fn(ctx) // modified: do not return after fn(ctx)
      .then(() => {
        if (!ctx.writable) {
          return; // returning without `next()` ends the Express response
        }

        let body = ctx.body;

        if ('HEAD' == ctx.method) { // eslint-disable-line eqeqeq
          if (!ctx.res.headersSent && isJSON(body)) {
            ctx.length = Buffer.byteLength(JSON.stringify(body));
          }
          return ctx.res.end();
        }

        // responses
        if (Buffer.isBuffer(body)) {
          return ctx.res.end(body);
        }
        if ('string' == typeof body) { // eslint-disable-line eqeqeq
          return ctx.res.end(body);
        }
        if (body instanceof Stream) {
          return body.pipe(ctx.res);
        }

        if (body) { // modified: only return if `body` is truthy
          // body: json
          body = JSON.stringify(body);
          if (!ctx.res.headersSent) {
            ctx.length = Buffer.byteLength(body);
          }
          return ctx.res.end(body);
        }

        // modified: if we haven't ended the response yet,
        // transfer the `req` and `res` to Express
        Object.assign(req, ctx.req);
        Object.assign(res, ctx.res);

        next(); // pass control flow to Express
      }).catch(next); // modified: pass the error to Express
  };
};
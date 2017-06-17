'use strict';

const app = require('../examples/basic');
const request = require('supertest');

describe('basic', function() {
  describe('GET /', function() {
    it('should return `Hello World`', function(done) {
      request(app)
        .get('/')
        .expect(200, 'Hello World', done);
    });
  });

  describe('GET /flow', function() {
    it('should return `Hello World`', function(done) {
      request(app)
        .get('/flow')
        .expect(200, 'Hello World', done);
    });
  });

  describe('GET /logout', function() {
    it('should redirect to /login', function(done) {
      request(app)
        .get('/logout')
        .expect('Location', '/login')
        .expect(302, done);
    });
  });
});
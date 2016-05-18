'use strict';

var Request = require('./base-request');

var DEFAULT_HOST = 'api.smitegame.com/smiteapi.svc',
    DEFAULT_PORT = 80,
    DEFAULT_SCHEME = 'http';

module.exports.builder = function() {
  return Request.builder()
      .withHost(DEFAULT_HOST)
      .withPort(DEFAULT_PORT)
      .withScheme(DEFAULT_SCHEME);
};
'use strict';

var SessionRequest = require('./session-request'),
    ApiRequest = require('./api-request'),
    HttpManager = require('./http-manager'),
    PromiseImpl = require('promise');
var md5 = require('md5');
var moment = require('moment');

function SmiteWebApi(credentials) {

  var _credentials = credentials || {};

  function _getTimestamp() {
    return new moment().utc().format("YYYYMMDDHHmmss");
  }

  function _addBodyParameters(request, options) {
    if (options) {
      for (var key in options) {
        if (key !== 'credentials') {
          request.addBodyParameter(key, options[key]);
        }
      }
    }
  }

  function _addQueryParameters(request, options) {
    if (!options) {
      return;
    }
    for (var key in options) {
      if (key !== 'credentials') {
        request.addQueryParameter(key, options[key]);
      }
    }
  }

  function _performRequest(method, request) {
    var promiseFunction = function(resolve, reject) {
      method(request, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    };
    return new PromiseImpl(promiseFunction);
  }


  this.setCredentials = function(credentials) {
    for (var key in credentials) {
      if (credentials.hasOwnProperty(key)) {
        _credentials[key] = credentials[key];
      }
    }
  };

  this.getCredentials = function() {
    return _credentials;
  };

  this.resetCredentials = function() {
    _credentials = null;
  };

  this.setDevId = function(devId) {
    _setCredential('devId', devId);
  };

  this.setAuthKey = function(authKey) {
    _setCredential('authKey', authKey);
  };

  this.setSessionId = function(sessionId) {
    _setCredential('sessionId', sessionId);
  };



  this.getDevId = function() {
    return _getCredential('devId');
  };

  this.getAuthKey = function() {
    return _getCredential('authKey');
  };

  this.getSessionId = function() {
    return _getCredential('sessionId');
  };



  this.resetDevId = function() {
    _resetCredential('devId');
  };

  this.resetAuthKey = function() {
    _resetCredential('authKey');
  };

  this.resetSessionId= function() {
    _resetCredential('sessionId');
  };


  function _setCredential(credentialKey, value) {
    _credentials = _credentials || {};
    _credentials[credentialKey] = value;
  }

  function _getCredential(credentialKey) {
    if (!_credentials) {
      return;
    } else {
      return _credentials[credentialKey];
    }
  }

  function _resetCredential(credentialKey) {
    if (!_credentials) {
      return;
    } else {
      _credentials[credentialKey] = null;
    }
  }

  /**
   * Refresh the access token given that it hasn't expired.
   * Requires that client ID, client secret and refresh token has been set previous to the call.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing the
   *          access token, time to expiration and token type. If rejected, it contains an error object.
   *          Not returned if a callback is given.
   *
   */
  this.refreshSession = function(callback) {
    var request = SessionRequest.builder()
      .withPath('/createsessionjson')
      .withBodyParameters({
        'grant_type' : 'refresh_token',
        'refresh_token' : this.getRefreshToken()
      })
      .build();

    var promise = _performRequest(HttpManager.post, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  
  /**
   * Look up a player.
   * @param {string} trackId The track's ID.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getPlayer('JoeTheory').then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the player. Not returned if a callback is given.
   */
  this.getPlayer = function(playerName, callback) {
    
    var utcTime = _getTimestamp();
    var authHash = md5('1063' + "getplayer" + '34F03C32BCF246159E80350672E3D6BE' + utcTime);
    var baseUrl = 'http://api.smitegame.com/smiteapi.svc/' + 'getplayerjson/';
    var request = baseUrl + '1063' + '/' + authHash + '/' + utcTime;

    var promise = _performRequest(HttpManager.get, request);

  
      return promise;

    
  };

}

module.exports = SmiteWebApi;
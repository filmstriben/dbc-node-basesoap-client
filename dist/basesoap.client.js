'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _soap = require('soap');

var soap = _interopRequireWildcard(_soap);

var _util = require('util');

var util = _interopRequireWildcard(_util);

var _es6Promise = require('es6-promise');

var _cacheManager = require('cache-manager');

var cacheManager = _interopRequireWildcard(_cacheManager);

var memoryCache = cacheManager.caching({
  store: 'memory',
  max: 100,
  ttl: 100
});

var BaseSoapClient = {};

/**
 * @param {String} wsdl The URL where the WSDL for the given service can be retrieved
 * @param {Object} config a object containe
 * @param {Object} logger An optional logger object
 * @return {{request: call}}
 */
BaseSoapClient.client = function (wsdl, config, logger) {
  var _soapclient = undefined;
  var Logger = null;
  if (logger) {
    Logger = logger;
  }

  /**
   * Returns a promise for a new client
   * @param  {String} wsdl URL for service WSDL
   * @param {Object }params
   * @return {Promise}
   */
  function _client(wsdl, params) {
    // eslint-disable-line
    return new _es6Promise.Promise(function (resolve, reject) {
      if (_soapclient) {
        resolve(_soapclient);
      }
      // Create soap client from a given wsdl
      soap.createClient(wsdl, params, function (err, client) {
        // Resolve promise from result
        if (err) {
          reject(err);
        } else {
          _soapclient = client;
          resolve(client);
        }
      });
    });
  }

  /**
   * Returns a promise for a request
   * @param  {Object} client  soap client object
   * @param  {String} op      Action on service
   * @param  {Object} options Options for request
   * @param ignoreCache
   * @return {Promise}
   */
  function _action(client, op, options, ignoreCache) {

    if (Logger) {
      Logger.log('info', 'soap request', {
        service: op,
        params: options,
        ignoreCache: ignoreCache
      });
    }

    return new _es6Promise.Promise(function (resolve, reject) {
      // Call to service is wrapped by the cache manager
      // that handles caching auto-magically
      var query = util._extend({}, options);

      if (ignoreCache) {
        _actionWithoutCache(client[op], query, function (err, result) {
          // eslint-disable-line
          if (Logger) {
            Logger.log('info', 'soap response', {
              service: op,
              params: options,
              err: err,
              result: result,
              statInfo: result.result && result.result.statInfo ? result.result.statInfo : ''
            });
          }

          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } else {
        _actionWithCache(client[op], query, function (err, result) {
          // eslint-disable-line
          if (Logger) {
            Logger.log('info', 'soap response', {
              service: op,
              params: options,
              err: err,
              result: result,
              statInfo: result.result && result.result.statInfo ? result.result.statInfo : ''
            });
          }

          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  }

  function _actionWithCache(call, options, callback) {
    // eslint-disable-line
    var cachekey = JSON.stringify(options);
    memoryCache.wrap(cachekey, function (cb) {
      call(options, cb);
    }, callback);
  }

  function _actionWithoutCache(call, options, callback) {
    // eslint-disable-line
    call(options, callback);
  }

  /**
   * Make request to soap service
   * @param  {String} action  Type of request
   * @param  {Object} params map of params
   * @param  {Object} opt map of extra options i.e. alternative endpoint
   * @param  {boolean} ignoreCache flag that indicates if the call should be cached.
   * @return {Promise}
   */
  function call(action, params, opt, ignoreCache) {
    var options = opt || {};
    return _client(wsdl, options).then(function (client) {
      var o = util._extend(config, params);
      return _action(client, action, o, ignoreCache);
    });
  }

  // Return factory for making soap requests
  return {
    request: call
  };
};

exports['default'] = BaseSoapClient;
module.exports = exports['default'];
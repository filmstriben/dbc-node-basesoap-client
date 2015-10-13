'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _basesoapClient = require('../basesoap.client');

var _basesoapClient2 = _interopRequireDefault(_basesoapClient);

describe('Test the basesoap client', function () {
  it('should be configurable without providing a logger', function () {
    var wsdl = 'url/to/wsdl';
    var config = {};
    var logger = null;
    var client = _basesoapClient2['default'].client(wsdl, config, logger);
    _chai.assert.isObject(client, 'Got an object');
    _chai.assert.property(client, 'request', 'Object has property request');
    _chai.assert.isFunction(client.request, 'Property request has a value recognized as a function');
  });

  it('should be configurable when providing a logger', function () {
    var wsdl = 'url/to/wsdl';
    var config = {};
    var logger = { info: function info() {} };
    var client = _basesoapClient2['default'].client(wsdl, config, logger);
    _chai.assert.isObject(client, 'Got an object');
    _chai.assert.property(client, 'request', 'Object has property request');
    _chai.assert.isFunction(client.request, 'Property request has a value recognized as a function');
  });
});
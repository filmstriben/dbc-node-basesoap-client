'use strict';

import {assert} from 'chai';
import BaseSoapClient from '../basesoap.client';

describe('Test the basesoap client', () => {
  it('should be configurable without providing a logger', () => {
    const wsdl = 'url/to/wsdl';
    const config = {};
    const logger = null;
    var client = BaseSoapClient.client(wsdl, config, logger);
    assert.isObject(client, 'Got an object');
    assert.property(client, 'request', 'Object has property request');
    assert.isFunction(client.request, 'Property request has a value recognized as a function');
  });

  it('should be configurable when providing a logger', () => {
    const wsdl = 'url/to/wsdl';
    const config = {};
    const logger = {info: () => {}};
    var client = BaseSoapClient.client(wsdl, config, logger);
    assert.isObject(client, 'Got an object');
    assert.property(client, 'request', 'Object has property request');
    assert.isFunction(client.request, 'Property request has a value recognized as a function');
  });
});

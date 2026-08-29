const test = require('node:test');
const assert = require('node:assert/strict');
const { isApiRequest, getApiProxyTarget } = require('./proxy-router');

test('api routes are proxied to the backend service', () => {
  assert.equal(isApiRequest('/api/auth/login'), true);
  assert.equal(isApiRequest('/health'), false);
  assert.equal(getApiProxyTarget('/api/auth/login'), 'http://localhost:3001/api/auth/login');
});

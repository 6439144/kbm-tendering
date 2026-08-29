const test = require('node:test');
const assert = require('node:assert/strict');
const { EdgeGateway } = require('./edge-gateway.js');

test('applies OWASP security headers', () => {
  const gateway = new EdgeGateway();
  const headers = {};
  const mockRes = {
    setHeader: (k, v) => { headers[k] = v; }
  };

  gateway.applySecurityHeaders(mockRes);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.ok(headers['Content-Security-Policy']);
});

test('enforces rate limiting threshold', () => {
  const gateway = new EdgeGateway({ rateLimitMax: 3, windowMs: 10000 });
  assert.equal(gateway.checkRateLimit('127.0.0.1').allowed, true);
  assert.equal(gateway.checkRateLimit('127.0.0.1').allowed, true);
  assert.equal(gateway.checkRateLimit('127.0.0.1').allowed, true);
  assert.equal(gateway.checkRateLimit('127.0.0.1').allowed, false);
});


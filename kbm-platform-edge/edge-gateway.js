/**
 * KBM Platform — Edge Gateway & Security Middleware
 * Applies security headers (OWASP ASVS), rate limiting, correlation IDs,
 * and premises boundary access policies.
 */

const crypto = require('crypto');

class EdgeGateway {
  constructor(options = {}) {
    this.rateLimitMap = new Map();
    this.rateLimitMax = options.rateLimitMax || 200; // max req per window
    this.windowMs = options.windowMs || 60000;
  }

  applySecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  checkRateLimit(clientIp) {
    const now = Date.now();
    const clientRecord = this.rateLimitMap.get(clientIp) || { count: 0, resetAt: now + this.windowMs };

    if (now > clientRecord.resetAt) {
      clientRecord.count = 1;
      clientRecord.resetAt = now + this.windowMs;
    } else {
      clientRecord.count += 1;
    }

    this.rateLimitMap.set(clientIp, clientRecord);
    return {
      allowed: clientRecord.count <= this.rateLimitMax,
      current: clientRecord.count,
      remaining: Math.max(0, this.rateLimitMax - clientRecord.count)
    };
  }

  validatePremisesAccess(req, allowedSubnets = ['127.0.0.1', '::1', '10.0.', '192.168.']) {
    const ip = req.socket?.remoteAddress || '127.0.0.1';
    const isAllowed = allowedSubnets.some(sub => ip.includes(sub));
    return { allowed: isAllowed, clientIp: ip };
  }

  injectCorrelationId(req, res) {
    const correlationId = req.headers['x-correlation-id'] || `corr-${crypto.randomUUID()}`;
    res.setHeader('X-Correlation-Id', correlationId);
    return correlationId;
  }
}

module.exports = {
  EdgeGateway
};


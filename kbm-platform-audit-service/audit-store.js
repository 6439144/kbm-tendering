/**
 * KBM Platform — Audit & Compliance Service
 * Append-only event store compatible with Azure Cosmos DB NoSQL model,
 * featuring SHA-256 cryptographic hash chaining for tamper evidence.
 */

const crypto = require('crypto');

class AuditStore {
  constructor() {
    this.events = [];
    this.genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';
  }

  appendEvent({
    tenantId,
    actorId,
    actorRole,
    action, // e.g. 'TENDER_PUBLISHED', 'VENDOR_GRADED', 'TASK_APPROVED'
    entityType, // 'TENDER', 'VENDOR', 'WORKFLOW_TASK', 'PAYMENT'
    entityId,
    details = {},
    clientIp = '127.0.0.1'
  }) {
    const eventId = `aud-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    const previousHash = this.events.length > 0 ? this.events[this.events.length - 1].hash : this.genesisHash;

    const payloadToHash = JSON.stringify({
      eventId,
      tenantId,
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      clientIp,
      timestamp,
      previousHash
    });

    const hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    const eventRecord = {
      id: eventId,
      tenantId,
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      clientIp,
      timestamp,
      previousHash,
      hash,
      immutable: true
    };

    this.events.push(eventRecord);
    return eventRecord;
  }

  listEvents({ tenantId, entityId = null, action = null }) {
    return this.events.filter(e => {
      if (tenantId && e.tenantId !== tenantId) return false;
      if (entityId && e.entityId !== entityId) return false;
      if (action && e.action !== action) return false;
      return true;
    });
  }

  verifyChainIntegrity() {
    for (let i = 0; i < this.events.length; i++) {
      const e = this.events[i];
      const expectedPrevHash = i === 0 ? this.genesisHash : this.events[i - 1].hash;

      if (e.previousHash !== expectedPrevHash) {
        return { valid: false, brokenAtIndex: i, reason: 'Broken previousHash link' };
      }

      const payloadToHash = JSON.stringify({
        eventId: e.id,
        tenantId: e.tenantId,
        actorId: e.actorId,
        actorRole: e.actorRole,
        action: e.action,
        entityType: e.entityType,
        entityId: e.entityId,
        details: e.details,
        clientIp: e.clientIp,
        timestamp: e.timestamp,
        previousHash: e.previousHash
      });

      const recalculatedHash = crypto.createHash('sha256').update(payloadToHash).digest('hex');
      if (e.hash !== recalculatedHash) {
        return { valid: false, brokenAtIndex: i, reason: 'Tampered event data detected' };
      }
    }

    return { valid: true, totalEvents: this.events.length };
  }

  exportAuditPackage(tenantId) {
    const events = this.listEvents({ tenantId });
    const verification = this.verifyChainIntegrity();

    return {
      tenantId,
      exportTimestamp: new Date().toISOString(),
      integrityStatus: verification.valid ? 'VERIFIED_TAMPER_FREE' : 'INTEGRITY_COMPROMISED',
      chainLength: events.length,
      events
    };
  }
}

module.exports = {
  AuditStore
};


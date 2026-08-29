const test = require('node:test');
const assert = require('node:assert/strict');
const { AuditStore } = require('./audit-store.js');

test('appends events with SHA-256 hash chaining and verifies chain integrity', () => {
  const store = new AuditStore();
  const e1 = store.appendEvent({
    tenantId: 'tenant-moi',
    actorId: 'user-staff-01',
    actorRole: 'STAFF',
    action: 'TENDER_REQUEST_INTAKE',
    entityType: 'REQUEST',
    entityId: 'req-101',
    details: { channel: 'manual_gm_letter' }
  });

  const e2 = store.appendEvent({
    tenantId: 'tenant-moi',
    actorId: 'user-admin-01',
    actorRole: 'TENANT_ADMIN',
    action: 'VENDOR_GRADED',
    entityType: 'VENDOR',
    entityId: 'vnd-202',
    details: { assignedGrade: 'SECOND' }
  });

  assert.equal(e2.previousHash, e1.hash);
  const verify = store.verifyChainIntegrity();
  assert.equal(verify.valid, true);
  assert.equal(verify.totalEvents, 2);
});

test('detects unauthorized tampering in historical audit log', () => {
  const store = new AuditStore();
  store.appendEvent({
    tenantId: 'tenant-moi',
    actorId: 'user-1',
    actorRole: 'STAFF',
    action: 'ACTION_1',
    entityType: 'TENDER',
    entityId: 'tnd-1'
  });

  store.appendEvent({
    tenantId: 'tenant-moi',
    actorId: 'user-2',
    actorRole: 'STAFF',
    action: 'ACTION_2',
    entityType: 'TENDER',
    entityId: 'tnd-1'
  });

  // Rogue modification of event 1
  store.events[0].details = { maliciousInjectedField: true };

  const check = store.verifyChainIntegrity();
  assert.equal(check.valid, false);
  assert.equal(check.brokenAtIndex, 0);
});


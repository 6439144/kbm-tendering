const test = require('node:test');
const assert = require('node:assert/strict');
const { createDocument, canAccessDocument } = require('./document-store');

test('staff can access tenant document', () => {
  const document = createDocument({ tenantId: 'tenant-001', ownerId: 'vendor-001', fileName: 'contract.pdf' });
  const user = { tenantId: 'tenant-001', roles: ['staff'], userId: 'staff-001' };

  assert.equal(canAccessDocument(user, document), true);
});

test('vendor can access own document', () => {
  const document = createDocument({ tenantId: 'tenant-001', ownerId: 'vendor-001', fileName: 'trade-license.pdf' });
  const user = { tenantId: 'tenant-001', roles: ['vendor'], userId: 'vendor-001' };

  assert.equal(canAccessDocument(user, document), true);
});

test('vendor cannot access another vendor document', () => {
  const document = createDocument({ tenantId: 'tenant-001', ownerId: 'vendor-001', fileName: 'trade-license.pdf' });
  const user = { tenantId: 'tenant-001', roles: ['vendor'], userId: 'vendor-002' };

  assert.equal(canAccessDocument(user, document), false);
});

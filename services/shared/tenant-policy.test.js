const test = require('node:test');
const assert = require('node:assert/strict');
const { canAccessTenant, canAccessObject, hasRole } = require('./tenant-policy');

test('staff with matching tenant can access tenant resources', () => {
  const user = { tenantId: 'tenant-001', roles: ['staff'] };
  assert.equal(canAccessTenant(user, 'tenant-001'), true);
});

test('user from a different tenant cannot access a tenant resource', () => {
  const user = { tenantId: 'tenant-001', roles: ['vendor'] };
  assert.equal(canAccessTenant(user, 'tenant-002'), false);
});

test('admin role can access object in the same tenant', () => {
  const user = { tenantId: 'tenant-001', roles: ['tenant-admin'] };
  const object = { tenantId: 'tenant-001', ownerId: 'vendor-1' };
  assert.equal(canAccessObject(user, object), true);
});

test('vendor cannot access another vendor object even in same tenant', () => {
  const user = { tenantId: 'tenant-001', roles: ['vendor'], userId: 'vendor-2' };
  const object = { tenantId: 'tenant-001', ownerId: 'vendor-1' };
  assert.equal(canAccessObject(user, object), false);
});

test('role checks are stable and case-insensitive', () => {
  const user = { tenantId: 'tenant-001', roles: ['Staff'] };
  assert.equal(hasRole(user, 'staff'), true);
});

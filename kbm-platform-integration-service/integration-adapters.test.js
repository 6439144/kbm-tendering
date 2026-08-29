const test = require('node:test');
const assert = require('node:assert/strict');
const { RaslniAdapter, MoCIClassificationAdapter, EntraIdAdapter } = require('./integration-adapters.js');

test('RaslniAdapter processes incoming G2G electronic message', () => {
  const adapter = new RaslniAdapter();
  const msg = adapter.simulateIncomingMessage({
    tenantId: 'tenant-moi',
    senderDepartment: 'General Directorate of Traffic',
    subject: 'Request for Automated Radar Maintenance',
    bodyText: 'Kindly initiate public tender procedure for speed cameras'
  });

  assert.ok(msg.id);
  assert.equal(msg.sourceSystem, 'RASLNI_G2G');
  assert.equal(adapter.listMessages('tenant-moi').length, 1);
});

test('MoCIClassificationAdapter validates commercial activity codes', () => {
  const adapter = new MoCIClassificationAdapter();
  const res1 = adapter.validateActivityCodes(['IT-SYS-01', 'CYBER-SEC-09']);
  assert.equal(res1.valid, true);

  const res2 = adapter.validateActivityCodes(['INVALID-CODE-99']);
  assert.equal(res2.valid, false);
  assert.equal(res2.invalidCodes[0], 'INVALID-CODE-99');
});

test('EntraIdAdapter maps Active Directory groups to KBM roles', () => {
  const adapter = new EntraIdAdapter();
  const roles = adapter.resolveRolesFromDirectoryGroups(['SG-MOI-ADMINS', 'SG-MOI-TENDER-STAFF']);
  assert.ok(roles.includes('TENANT_ADMIN'));
  assert.ok(roles.includes('STAFF'));
});


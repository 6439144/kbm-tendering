const test = require('node:test');
const assert = require('node:assert/strict');
const { VendorManager } = require('./vendor-manager.js');

test('registers vendor with initial grade and pending status', () => {
  const manager = new VendorManager();
  const vendor = manager.registerVendor({
    tenantId: 'tenant-moi',
    companyName: 'Al-Kharafi Technologies',
    commercialRegistrationNo: 'CR-104928',
    email: 'info@alkharafi.demo',
    activities: ['IT-SYS-01', 'SEC-SURV-02'],
    initialGrade: 'SECOND'
  });

  assert.ok(vendor.id);
  assert.equal(vendor.grade, 'SECOND');
  assert.equal(vendor.status, 'PENDING_APPROVAL');
  assert.equal(vendor.subscriptionStatus, 'UNPAID');
});

test('handles grade upgrade request and approval', () => {
  const manager = new VendorManager();
  const vendor = manager.registerVendor({
    tenantId: 'tenant-moi',
    companyName: 'Gulf Network Systems',
    commercialRegistrationNo: 'CR-99281',
    email: 'contact@gulfnet.demo',
    initialGrade: 'THIRD'
  });

  const upgReq = manager.requestGradeUpgrade(vendor.id, 'FIRST', ['doc-audit-financial.pdf']);
  assert.equal(upgReq.status, 'PENDING');
  assert.equal(upgReq.requestedGrade, 'FIRST');

  manager.processGradeUpgrade(upgReq.id, 'APPROVE', 'staff-grading-officer', 'All financial criteria met');
  const updatedVendor = manager.getVendor(vendor.id);
  assert.equal(updatedVendor.grade, 'FIRST');
});

test('suspends vendor and validates automatic date-range reinstatement', () => {
  const manager = new VendorManager();
  const vendor = manager.registerVendor({
    tenantId: 'tenant-moi',
    companyName: 'Pioneer Trading',
    commercialRegistrationNo: 'CR-55412',
    email: 'info@pioneer.demo'
  });

  manager.blockVendor(vendor.id, { reason: 'Commercial license renewal pending', durationDays: -1 }); // already expired
  const check = manager.getVendor(vendor.id);
  assert.equal(check.status, 'ACTIVE'); // auto-reinstated because block expired
});

test('activates 1-year subscription', () => {
  const manager = new VendorManager();
  const vendor = manager.registerVendor({
    tenantId: 'tenant-moi',
    companyName: 'Apex Solutions',
    commercialRegistrationNo: 'CR-11223',
    email: 'admin@apex.demo'
  });

  manager.activateAnnualSubscription(vendor.id);
  const updated = manager.getVendor(vendor.id);
  assert.equal(updated.subscriptionStatus, 'ACTIVE');
  assert.ok(updated.subscriptionExpiresAt);
});


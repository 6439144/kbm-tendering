const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateVendorEligibility, createReceipt } = require('./domain');

test('eligible vendor meets activity and grade rule', () => {
  const vendor = {
    tenantId: 'tenant-001',
    activities: ['IT'],
    grade: 'Second',
    status: 'approved',
    blocked: false
  };

  const tender = {
    tenantId: 'tenant-001',
    activities: ['IT'],
    gradeRule: 'grade-and-above',
    gradeRequired: 'Second'
  };

  assert.equal(evaluateVendorEligibility(vendor, tender), true);
});

test('blocked vendor is not eligible', () => {
  const vendor = {
    tenantId: 'tenant-001',
    activities: ['IT'],
    grade: 'Second',
    status: 'approved',
    blocked: true
  };

  const tender = {
    tenantId: 'tenant-001',
    activities: ['IT'],
    gradeRule: 'grade-and-above',
    gradeRequired: 'Second'
  };

  assert.equal(evaluateVendorEligibility(vendor, tender), false);
});

test('receipt includes printable and tenant metadata', () => {
  const receipt = createReceipt({
    tenantId: 'tenant-001',
    vendorId: 'vendor-001',
    tenderId: 'tender-001',
    amount: 2500,
    currency: 'SAR'
  });

  assert.match(receipt.receiptNumber, /^KBN-/);
  assert.equal(receipt.status, 'paid');
  assert.equal(receipt.currency, 'SAR');
  assert.equal(receipt.printable, true);
});

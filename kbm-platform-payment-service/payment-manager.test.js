const test = require('node:test');
const assert = require('node:assert/strict');
const { PaymentManager } = require('./payment-manager.js');

test('creates checkout session and handles successful KNET callback with receipt generation', () => {
  const manager = new PaymentManager();
  const session = manager.createCheckoutSession({
    tenantId: 'tenant-moi',
    vendorId: 'vnd-101',
    vendorName: 'Kuwait Cyber Defense Co.',
    paymentType: 'TENDER_PURCHASE',
    tenderId: 'tnd-202',
    amountKwd: 150
  });

  assert.ok(session.paymentId);
  assert.equal(session.status, 'INITIATED');

  const res = manager.processKnetCallback({
    paymentId: session.paymentId,
    trackId: session.trackId,
    result: 'CAPTURED',
    authCode: 'AUTH99201',
    referenceNo: 'REF887123'
  });

  assert.equal(res.alreadyProcessed, false);
  assert.equal(res.transaction.status, 'CAPTURED');
  assert.ok(res.receipt);
  assert.ok(res.receipt.receiptNumber.startsWith('REC-'));
  assert.equal(res.receipt.amountKwd, 150);
});

test('idempotently handles duplicate KNET callback without generating duplicate receipt', () => {
  const manager = new PaymentManager();
  const session = manager.createCheckoutSession({
    tenantId: 'tenant-moi',
    vendorId: 'vnd-101',
    vendorName: 'Kuwait Cyber Defense Co.',
    paymentType: 'TENDER_PURCHASE',
    tenderId: 'tnd-202',
    amountKwd: 150
  });

  const res1 = manager.processKnetCallback({
    paymentId: session.paymentId,
    trackId: session.trackId,
    result: 'CAPTURED'
  });

  const res2 = manager.processKnetCallback({
    paymentId: session.paymentId,
    trackId: session.trackId,
    result: 'CAPTURED'
  });

  assert.equal(res2.alreadyProcessed, true);
  assert.equal(res1.receipt.id, res2.receipt.id);
});


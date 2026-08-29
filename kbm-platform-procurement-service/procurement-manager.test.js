const test = require('node:test');
const assert = require('node:assert/strict');
const { ProcurementManager } = require('./procurement-manager.js');

test('submits manual tender request with mandatory scanned GM letter', () => {
  const manager = new ProcurementManager();
  const req = manager.submitRequest({
    tenantId: 'tenant-moi',
    channel: 'manual_gm_letter',
    title: 'Surveillance Camera Maintenance 2026',
    requestingDepartment: 'Information Systems Dept',
    gmLetterReference: 'GM-REF-2026/881',
    gmLetterAttachmentId: 'doc-gm-scan-881.pdf',
    estimatedBudgetKwd: 125000
  });

  assert.ok(req.id);
  assert.equal(req.status, 'SUBMITTED');
  assert.equal(req.gmLetterAttachmentId, 'doc-gm-scan-881.pdf');
});

test('submits manual request smoothly when attachment is optional/omitted', () => {
  const manager = new ProcurementManager();
  const req = manager.submitRequest({
    tenantId: 'tenant-moi',
    channel: 'manual_gm_letter',
    title: 'Optional Scan Request',
    requestingDepartment: 'Logistics'
  });

  assert.ok(req.id);
  assert.equal(req.status, 'SUBMITTED');
  assert.equal(req.gmLetterAttachmentId, null);
});

test('evaluates eligibility: matches activity overlap and grade hierarchy', () => {
  const manager = new ProcurementManager();
  const tender = manager.createTender({
    tenantId: 'tenant-moi',
    title: 'Enterprise Cyber Security Operations',
    activities: ['IT-SYS-01', 'CYBER-SEC-09'],
    gradeRule: 'SECOND',
    gradeMatchMode: 'GRADE_AND_ABOVE',
    priceKwd: 150
  });

  // Eligible vendor: Grade 1 (higher than 2) and matching activity
  const vendor1 = {
    id: 'vnd-1',
    grade: 'FIRST',
    status: 'ACTIVE',
    activities: ['IT-SYS-01', 'OTHER-00']
  };

  const res1 = manager.evaluateEligibility(tender, vendor1);
  assert.equal(res1.eligible, true);
  assert.equal(res1.matchedActivities[0], 'IT-SYS-01');

  // Ineligible vendor: Grade 3 (lower than required Grade 2)
  const vendor2 = {
    id: 'vnd-2',
    grade: 'THIRD',
    status: 'ACTIVE',
    activities: ['IT-SYS-01']
  };

  const res2 = manager.evaluateEligibility(tender, vendor2);
  assert.equal(res2.eligible, false);

  // Ineligible vendor: Blocked/Suspended
  const vendor3 = {
    id: 'vnd-3',
    grade: 'FIRST',
    status: 'SUSPENDED',
    activities: ['IT-SYS-01']
  };

  const res3 = manager.evaluateEligibility(tender, vendor3);
  assert.equal(res3.eligible, false);
});


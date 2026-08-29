const test = require('node:test');
const assert = require('node:assert/strict');
const { DocumentManager } = require('./document-manager.js');

test('registers document and validates supported MIME types', () => {
  const manager = new DocumentManager();
  const doc = manager.registerDocument({
    tenantId: 'tenant-moi',
    ownerId: 'vnd-101',
    ownerType: 'VENDOR',
    filename: 'commercial_register.pdf',
    mimeType: 'application/pdf'
  });

  assert.ok(doc.id);
  assert.ok(doc.sha256Checksum);
  assert.equal(doc.classification, 'CONFIDENTIAL');
});

test('enforces cross-tenant and cross-vendor access isolation', () => {
  const manager = new DocumentManager();
  const doc = manager.registerDocument({
    tenantId: 'tenant-moi',
    ownerId: 'vnd-101',
    ownerType: 'VENDOR',
    filename: 'tax_clearance.pdf',
    mimeType: 'application/pdf'
  });

  // Cross-tenant user denied
  const res1 = manager.authorizeAccess(doc.id, { tenantId: 'other-tenant', role: 'STAFF' });
  assert.equal(res1.authorized, false);

  // Different vendor denied
  const res2 = manager.authorizeAccess(doc.id, { tenantId: 'tenant-moi', role: 'VENDOR', vendorId: 'vnd-999' });
  assert.equal(res2.authorized, false);

  // Owner vendor authorized
  const res3 = manager.authorizeAccess(doc.id, { tenantId: 'tenant-moi', role: 'VENDOR', vendorId: 'vnd-101' });
  assert.equal(res3.authorized, true);

  // Internal staff authorized
  const res4 = manager.authorizeAccess(doc.id, { tenantId: 'tenant-moi', role: 'STAFF' });
  assert.equal(res4.authorized, true);
});

test('generates dynamic anti-screenshot watermarking metadata', () => {
  const manager = new DocumentManager();
  const doc = manager.registerDocument({
    tenantId: 'tenant-moi',
    ownerId: 'staff-01',
    ownerType: 'STAFF',
    filename: 'tender_specs_cctv.pdf'
  });

  const wm = manager.generateWatermarkMetadata(doc.id, {
    companyName: 'Kuwait Advanced Tech',
    vendorId: 'vnd-882',
    ip: '192.168.10.45'
  });

  assert.ok(wm.watermarkLines.length >= 3);
  assert.ok(wm.watermarkLines[1].includes('Kuwait Advanced Tech'));
  assert.ok(wm.watermarkLines[2].includes('192.168.10.45'));
});


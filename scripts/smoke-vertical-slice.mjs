import assert from 'node:assert/strict';
import { WorkflowEngine } from '../kbm-platform-workflow-service/workflow-engine.js';
import { VendorManager } from '../kbm-platform-vendor-service/vendor-manager.js';
import { ProcurementManager } from '../kbm-platform-procurement-service/procurement-manager.js';
import { PaymentManager } from '../kbm-platform-payment-service/payment-manager.js';
import { DocumentManager } from '../kbm-platform-document-service/document-manager.js';
import { AuditStore } from '../kbm-platform-audit-service/audit-store.js';
import { MarketplaceManager } from '../kbm-platform-marketplace-service/marketplace-manager.js';

console.log('--- RUNNING END-TO-END VERTICAL SLICE SMOKE TEST ---');

// 1. Tenant & Vendor Setup
const vendorManager = new VendorManager();
const vendor = vendorManager.registerVendor({
  tenantId: 'tenant-moi',
  companyName: 'Al-Kharafi Technologies W.L.L.',
  commercialRegistrationNo: 'CR-104928',
  email: 'vendor@kbm.demo',
  activities: ['IT-SYS-01', 'CYBER-SEC-09'],
  initialGrade: 'SECOND'
});
vendorManager.activateAnnualSubscription(vendor.id);
assert.equal(vendor.grade, 'SECOND');
assert.equal(vendor.subscriptionStatus, 'ACTIVE');

// 2. Tender Request Intake (Manual GM Letter with Scan)
const procManager = new ProcurementManager();
const req = procManager.submitRequest({
  tenantId: 'tenant-moi',
  channel: 'manual_gm_letter',
  title: 'Ministry IT Core Infrastructure Upgrade',
  requestingDepartment: 'Information Systems Dept',
  gmLetterAttachmentId: 'doc-gm-scan-881.pdf',
  estimatedBudgetKwd: 180000
});
assert.ok(req.id);

// 3. Workflow Engine Execution (Practices Template)
const workflowEngine = new WorkflowEngine();
const wfInstance = workflowEngine.startWorkflow({
  templateCode: 'PRACTICES',
  tenantId: 'tenant-moi',
  entityId: req.id
});
assert.equal(wfInstance.tasks.length, 8);
const task1 = wfInstance.tasks[0];
workflowEngine.transitionTask({
  taskId: task1.id,
  action: 'APPROVE',
  actorId: 'staff-01',
  role: 'ROLE_SYSTEMS',
  comment: 'Initial technical requirements verified'
});
assert.equal(task1.status, 'APPROVED');

// 4. Tender Publishing with Grade & Activity Rules
const tender = procManager.createTender({
  tenantId: 'tenant-moi',
  requestId: req.id,
  title: 'Ministry IT Core Infrastructure Upgrade',
  activities: ['IT-SYS-01'],
  gradeRule: 'SECOND',
  gradeMatchMode: 'GRADE_AND_ABOVE',
  priceKwd: 75
});

// 5. Server-Side Eligibility Evaluation
const elig = procManager.evaluateEligibility(tender, vendor);
assert.equal(elig.eligible, true, 'Vendor should be eligible for tender');

// 6. Anti-Screenshot Document Watermarking Metadata
const docManager = new DocumentManager();
const tenderDoc = docManager.registerDocument({
  tenantId: 'tenant-moi',
  ownerId: 'staff-01',
  ownerType: 'STAFF',
  filename: 'Tender_Booklet_2026.pdf'
});
const watermark = docManager.generateWatermarkMetadata(tenderDoc.id, {
  companyName: vendor.companyName,
  vendorId: vendor.id,
  ip: '192.168.10.22'
});
assert.ok(watermark.watermarkLines.length >= 3);

// 7. KNET Payment & Receipt Generation
const payManager = new PaymentManager();
const session = payManager.createCheckoutSession({
  tenantId: 'tenant-moi',
  vendorId: vendor.id,
  vendorName: vendor.companyName,
  paymentType: 'TENDER_PURCHASE',
  tenderId: tender.id,
  amountKwd: 75
});
const payResult = payManager.processKnetCallback({
  paymentId: session.paymentId,
  trackId: session.trackId,
  result: 'CAPTURED'
});
assert.equal(payResult.transaction.status, 'CAPTURED');
assert.ok(payResult.receipt.receiptNumber.startsWith('REC-'));

// 8. Immutable Cosmos DB Audit Trail Verification
const auditStore = new AuditStore();
auditStore.appendEvent({
  tenantId: 'tenant-moi',
  actorId: 'staff-01',
  actorRole: 'STAFF',
  action: 'TENDER_REQUEST_APPROVED',
  entityType: 'REQUEST',
  entityId: req.id
});
auditStore.appendEvent({
  tenantId: 'tenant-moi',
  actorId: vendor.id,
  actorRole: 'VENDOR',
  action: 'TENDER_PURCHASE_COMPLETED',
  entityType: 'PAYMENT',
  entityId: payResult.receipt.receiptNumber
});
const auditVerification = auditStore.verifyChainIntegrity();
assert.equal(auditVerification.valid, true);

// 9. Commercial Marketplace SaaS Fulfillment Token Resolution
const marketManager = new MarketplaceManager();
const resolved = marketManager.resolveMarketplaceToken('sample-jwt-token');
const saasSub = marketManager.activateSubscription({
  subscriptionId: resolved.id,
  planId: 'kbm-professional',
  tenantName: 'State of Kuwait - Ministry of Interior',
  adminEmail: 'admin@moi.gov.kw'
});
assert.equal(saasSub.status, 'Subscribed');

console.log('✓ ALL 9 VERTICAL SLICE EVIDENCE CHECKS PASSED PERFECTLY:');
console.log(JSON.stringify({
  vendor: vendor.companyName,
  grade: vendor.grade,
  workflowProgress: `${wfInstance.progressPercent}%`,
  tenderEligibility: elig.eligible,
  receiptNumber: payResult.receipt.receiptNumber,
  auditChainIntegrity: auditVerification.valid ? 'VERIFIED_TAMPER_FREE (SHA-256)' : 'COMPROMISED',
  saasMarketplaceStatus: saasSub.status
}, null, 2));

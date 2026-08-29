import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ProcurementManager } from '../kbm-platform-procurement-service/procurement-manager.js';
import { WorkflowEngine } from '../kbm-platform-workflow-service/workflow-engine.js';
import { AuditStore } from '../kbm-platform-audit-service/audit-store.js';

describe('Tender Registration & Approval QA Suite', () => {
  const TENANT_ID = 'tenant-moi-qa';

  it('QA-01: Successfully accepts manual tender request when attachment is optional/omitted', () => {
    const procurement = new ProcurementManager();
    const req = procurement.submitRequest({
      tenantId: TENANT_ID,
      channel: 'manual_gm_letter',
      title: 'Hardware Expansion',
      titleAr: 'توسعة الخوادم',
      requestingDepartment: 'IT Systems',
      gmLetterReference: 'GM/2026/991',
      gmLetterAttachmentId: null // Optional scan omitted
    });
    assert.ok(req.id);
    assert.equal(req.status, 'SUBMITTED');
    assert.equal(req.gmLetterAttachmentId, null);
  });

  it('QA-02: Successfully accepts manual tender request with valid scanned GM letter attachment', () => {
    const procurement = new ProcurementManager();
    const req = procurement.submitRequest({
      tenantId: TENANT_ID,
      channel: 'manual_gm_letter',
      title: 'Perimeter Surveillance Cameras',
      titleAr: 'كاميرات المراقبة الأمنية',
      requestingDepartment: 'Security Directorate',
      gmLetterReference: 'GM/2026/102',
      gmLetterAttachmentId: 'doc-scan-9921',
      estimatedBudgetKwd: 120000
    });

    assert.ok(req.id);
    assert.equal(req.status, 'SUBMITTED');
    assert.equal(req.channel, 'manual_gm_letter');
    assert.equal(req.gmLetterAttachmentId, 'doc-scan-9921');
  });

  it('QA-03: Successfully accepts electronic Raslni G2G tender request without physical scan', () => {
    const procurement = new ProcurementManager();
    const req = procurement.submitRequest({
      tenantId: TENANT_ID,
      channel: 'raslni',
      title: 'Cloud Infrastructure Upgrade',
      titleAr: 'تحديث البنية التحتية السحابية',
      requestingDepartment: 'Information Systems Center',
      raslniMessageId: 'raslni-msg-4482',
      estimatedBudgetKwd: 250000
    });

    assert.ok(req.id);
    assert.equal(req.status, 'SUBMITTED');
    assert.equal(req.channel, 'raslni');
    assert.equal(req.raslniMessageId, 'raslni-msg-4482');
  });

  it('QA-04: Transitions tender request to PUBLISHED with targeted MoCI activities and Grade rules', () => {
    const procurement = new ProcurementManager();
    const req = procurement.submitRequest({
      tenantId: TENANT_ID,
      channel: 'raslni',
      title: 'Data Center Virtualization',
      requestingDepartment: 'IT',
      raslniMessageId: 'raslni-101'
    });

    const tender = procurement.createTender({
      tenantId: TENANT_ID,
      requestId: req.id,
      referenceNumber: 'MOI/TNT/2026/099',
      title: 'Data Center Virtualization',
      titleAr: 'بيئة الخوادم الافتراضية',
      activities: ['IT-SYS-01'],
      gradeRule: 'SECOND',
      gradeMatchMode: 'GRADE_AND_ABOVE',
      priceKwd: 100
    });

    assert.ok(tender.id);
    assert.equal(tender.status, 'PUBLISHED');
    assert.equal(tender.referenceNumber, 'MOI/TNT/2026/099');
    assert.deepEqual(tender.activities, ['IT-SYS-01']);
    assert.equal(tender.gradeRule, 'SECOND');
  });

  it('QA-05: Orchestrates full 8-step Practices workflow cycle with step-by-step approvals', () => {
    const workflow = new WorkflowEngine();
    const instance = workflow.startWorkflow({
      templateCode: 'PRACTICES',
      tenantId: TENANT_ID,
      entityId: 'tnd-practice-01'
    });

    assert.equal(instance.tasks.length, 8);
    assert.equal(instance.status, 'IN_PROGRESS');

    // Step through each task
    for (let i = 0; i < instance.tasks.length; i++) {
      const task = instance.tasks[i];
      if (task.status === 'QUEUED') {
        workflow.transitionTask({
          taskId: task.id,
          action: 'START',
          actorId: `officer-step-${i}`,
          role: task.ownerRole
        });
      }

      const updated = workflow.transitionTask({
        taskId: task.id,
        action: 'APPROVE',
        actorId: `officer-step-${i}`,
        role: task.ownerRole,
        comment: `Step ${i + 1} reviewed and approved per Law 49/2016`
      });

      assert.equal(updated.status, 'APPROVED');
      assert.ok(updated.history.length > 0);
    }

    const completedInstance = workflow.getInstance(instance.id);
    assert.equal(completedInstance.status, 'COMPLETED');
    assert.equal(completedInstance.progressPercent, 100);
  });

  it('QA-06: Validates return-for-correction loop in statutory workflow', () => {
    const workflow = new WorkflowEngine();
    const instance = workflow.startWorkflow({
      templateCode: 'TENDERS',
      tenantId: TENANT_ID,
      entityId: 'tnd-full-01'
    });

    assert.equal(instance.tasks.length, 16);

    // Task 1: Start review
    const t1 = instance.tasks[0];
    workflow.transitionTask({
      taskId: t1.id,
      action: 'START_REVIEW',
      actorId: 'staff-01',
      role: t1.ownerRole
    });

    // Request correction on specs
    const returned = workflow.transitionTask({
      taskId: t1.id,
      action: 'REQUEST_CORRECTION',
      actorId: 'legal-reviewer',
      role: 'ROLE_AUDIT_CONTROL',
      comment: 'Article 12 terms booklet missing liquidated damages clause'
    });

    assert.equal(returned.status, 'CORRECTION_REQUIRED');
    assert.equal(returned.history.at(-1).comment, 'Article 12 terms booklet missing liquidated damages clause');

    // Re-approve after correction
    const reApproved = workflow.transitionTask({
      taskId: t1.id,
      action: 'APPROVE',
      actorId: 'legal-reviewer',
      role: 'ROLE_AUDIT_CONTROL',
      comment: 'Clause corrected and compliant'
    });

    assert.equal(reApproved.status, 'APPROVED');
  });

  it('QA-07: Validates State Audit Bureau pre-audit and Undersecretary 100% milestone', () => {
    const workflow = new WorkflowEngine();
    const instance = workflow.startWorkflow({
      templateCode: 'TENDERS',
      tenantId: TENANT_ID,
      entityId: 'tnd-audit-01'
    });

    // Find State Audit Bureau task (Task 13) and Undersecretary task (Task 16)
    const auditTask = instance.tasks.find(t => t.ownerRole === 'ROLE_AUDIT_BUREAU');
    assert.ok(auditTask, 'State Audit Bureau pre-audit task must exist');
    assert.equal(auditTask.nameAr, 'كتاب من ديوان المحاسبة بالموافقة على التعاقد');

    const undersecretaryTask = instance.tasks.find(t => t.ownerRole === 'ROLE_UNDERSECRETARY');
    assert.ok(undersecretaryTask, 'Undersecretary 100% signing task must exist');
    assert.equal(undersecretaryTask.nameAr, 'توقيع العقد 100% من وكيل الوزارة');
  });

  it('QA-08: Cryptographic SHA-256 hash chaining seals all tender intake and approval events', () => {
    const auditStore = new AuditStore();

    // Event 1: Intake
    const e1 = auditStore.appendEvent({
      tenantId: TENANT_ID,
      actorId: 'officer-01',
      actorRole: 'STAFF',
      action: 'TENDER_REQUEST_SUBMITTED',
      entityType: 'REQUEST',
      entityId: 'req-qa-01',
      details: { channel: 'manual_gm_letter', gmRef: 'GM-2026' }
    });

    // Event 2: Approval
    const e2 = auditStore.appendEvent({
      tenantId: TENANT_ID,
      actorId: 'committee-chair',
      actorRole: 'PURCHASE_COMMITTEE',
      action: 'TENDER_SPECS_APPROVED',
      entityType: 'WORKFLOW_TASK',
      entityId: 'tsk-01',
      details: { decision: 'APPROVED' }
    });

    // Event 3: Final Contract Signing
    const e3 = auditStore.appendEvent({
      tenantId: TENANT_ID,
      actorId: 'undersecretary',
      actorRole: 'UNDERSECRETARY',
      action: 'CONTRACT_EXECUTED_100',
      entityType: 'TENDER',
      entityId: 'tnd-qa-01',
      details: { status: 'CONTRACT_SIGNED_100' }
    });

    assert.equal(e2.previousHash, e1.hash);
    assert.equal(e3.previousHash, e2.hash);

    const verification = auditStore.verifyChainIntegrity();
    assert.equal(verification.valid, true);
  });
});


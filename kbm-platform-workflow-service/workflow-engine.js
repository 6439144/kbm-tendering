/**
 * KBM Platform — Workflow & Task Management Service
 * Supports versioned definitions, multi-stage human & service tasks,
 * delegation, escalation, return-for-correction loops, and SLA tracking.
 */

const crypto = require('crypto');

// Pre-seeded template from Historical Practices Tracker (الممارسات)
const TEMPLATE_PRACTICES = {
  id: 'tmpl-practices-v1',
  code: 'PRACTICES',
  name: 'Standard Practices Procurement Workflow (الممارسات)',
  nameAr: 'إجراءات طرح وتوقيع الممارسات',
  source: 'TRACKER-REFERENCE',
  stages: [
    {
      id: 'stage-prep',
      name: 'Preparation (التجهيز)',
      nameAr: 'التجهيز',
      sequence: 1,
      tasks: [
        { id: 'p-01', name: 'Needs assessment & ministry sector correspondence', nameAr: 'تحديد احتياجات الوزارة وحصر احتياجات القطاعات', ownerRole: 'ROLE_SYSTEMS', weight: 0.10, slaDays: 30 },
        { id: 'p-02', name: 'Cost estimation & budget allocation', nameAr: 'تحديد التكلفة التقديرية وتحديد بنود الميزانية', ownerRole: 'ROLE_SYSTEMS', weight: 0.15, slaDays: 14 },
        { id: 'p-03', name: 'Purchase committee review & tender docs preparation', nameAr: 'كتاب للجنة الشراء بالمواصفات الفنية وموافقة الميزانية', ownerRole: 'ROLE_PURCHASE_COMMITTEE', weight: 0.15, slaDays: 14 }
      ]
    },
    {
      id: 'stage-award',
      name: 'Award & Evaluation (الترسية)',
      nameAr: 'الترسية',
      sequence: 2,
      tasks: [
        { id: 'p-04', name: 'Bid evaluation & technical recommendation report', nameAr: 'دراسة العطاءات والتوصية بالترسية واعتماد التقرير الفني', ownerRole: 'ROLE_SYSTEMS', weight: 0.15, slaDays: 14 },
        { id: 'p-05', name: 'Purchase committee award approval', nameAr: 'كتاب موافقة لجنة الشراء على التوصية بالترسية', ownerRole: 'ROLE_PURCHASE_COMMITTEE', weight: 0.10, slaDays: 7 },
        { id: 'p-06', name: 'Transmittal to Procurement and Warehouses', nameAr: 'كتاب إلى المشتريات والمخازن متضمن موافقة لجنة الشراء', ownerRole: 'ROLE_SYSTEMS', weight: 0.10, slaDays: 7 }
      ]
    },
    {
      id: 'stage-sign',
      name: 'Contracting & Signature (التوقيع)',
      nameAr: 'التوقيع',
      sequence: 3,
      tasks: [
        { id: 'p-07', name: 'Submit contract for execution', nameAr: 'كتاب رفع العقد للتوقيع', ownerRole: 'ROLE_PROCUREMENT', weight: 0.10, slaDays: 14 },
        { id: 'p-08', name: 'Contract signature (100%)', nameAr: 'توقيع العقد 100%', ownerRole: 'ROLE_UNDERSECRETARY', weight: 0.10, slaDays: 7 }
      ]
    }
  ]
};

// Pre-seeded template from Historical Tenders Tracker (المناقصات)
const TEMPLATE_TENDERS = {
  id: 'tmpl-tenders-v1',
  code: 'TENDERS',
  name: 'Standard Public Tenders Procurement Workflow (المناقصات)',
  nameAr: 'إجراءات طرح وتوقيع المناقصات الحكومية',
  source: 'TRACKER-REFERENCE',
  stages: [
    {
      id: 'stage-t-prep',
      name: 'Preparation & Budget (التجهيز)',
      nameAr: 'التجهيز',
      sequence: 1,
      tasks: [
        { id: 't-01', name: 'Needs determination & sector survey', nameAr: 'تحديد احتياجات الوزارة من قبل مركز نظم المعلومات', ownerRole: 'ROLE_SYSTEMS', weight: 0.05, slaDays: 30 },
        { id: 't-02', name: 'Cost estimation & CAIT budget entry', nameAr: 'تحديد التكلفة واستيفاء بيانات ميزانية CAIT', ownerRole: 'ROLE_SYSTEMS', weight: 0.05, slaDays: 30 },
        { id: 't-03', name: 'Ministry of Finance budget approval', nameAr: 'كتاب من وزارة المالية باعتماد ميزانية نظم المعلومات', ownerRole: 'ROLE_FINANCE', weight: 0.05, slaDays: 60 },
        { id: 't-04', name: 'Purchase committee technical approval', nameAr: 'كتاب موافقة لجنة الشراء على المواصفات', ownerRole: 'ROLE_PURCHASE_COMMITTEE', weight: 0.05, slaDays: 14 },
        { id: 't-05', name: 'Fatwa & Legislation review & approval', nameAr: 'كتاب موافقة الفتوى والتشريع على مستندات الطرح', ownerRole: 'ROLE_AUDIT_CONTROL', weight: 0.05, slaDays: 30 }
      ]
    },
    {
      id: 'stage-t-launch',
      name: 'Tender Launch & Publication (الطرح)',
      nameAr: 'الطرح',
      sequence: 2,
      tasks: [
        { id: 't-06', name: 'CAPT announcement submission', nameAr: 'كتاب إلى CAPT لطلب الإعلان عن المناقصة', ownerRole: 'ROLE_AUDIT_CONTROL', weight: 0.05, slaDays: 15 },
        { id: 't-07', name: 'CAPT approval on tender launch', nameAr: 'إعلان موافقة CAPT على طرح المناقصة', ownerRole: 'ROLE_CAPT', weight: 0.05, slaDays: 60 },
        { id: 't-08', name: 'Official publication in Official Gazette', nameAr: 'إعلان الطرح 100%', ownerRole: 'ROLE_CAPT', weight: 0.05, slaDays: 30 }
      ]
    },
    {
      id: 'stage-t-study',
      name: 'Technical Study & Bids (الدراسة الفنية)',
      nameAr: 'الدراسة الفنية',
      sequence: 3,
      tasks: [
        { id: 't-09', name: 'Tender closing & bid referral from CAPT', nameAr: 'إقفال المناقصة وإحالة العطاءات من CAPT', ownerRole: 'ROLE_CAPT', weight: 0.05, slaDays: 90 },
        { id: 't-10', name: 'Technical study & award recommendation report', nameAr: 'دراسة العطاءات والتوصية بالترسية واعتماد التقرير الفني', ownerRole: 'ROLE_SYSTEMS', weight: 0.10, slaDays: 14 },
        { id: 't-11', name: 'Ministry of Finance financial commitment approval', nameAr: 'كتاب موافقة وزارة المالية والارتباط المالي', ownerRole: 'ROLE_FINANCE', weight: 0.05, slaDays: 7 }
      ]
    },
    {
      id: 'stage-t-award',
      name: 'Award & State Audit Bureau (الترسية وديوان المحاسبة)',
      nameAr: 'الترسية وديوان المحاسبة',
      sequence: 4,
      tasks: [
        { id: 't-12', name: 'CAPT award approval decision', nameAr: 'كتاب من CAPT بالموافقة على الترسية', ownerRole: 'ROLE_CAPT', weight: 0.05, slaDays: 30 },
        { id: 't-13', name: 'State Audit Bureau pre-contract approval', nameAr: 'كتاب من ديوان المحاسبة بالموافقة على التعاقد', ownerRole: 'ROLE_AUDIT_BUREAU', weight: 0.05, slaDays: 30 },
        { id: 't-14', name: 'Financial Control Bureau review', nameAr: 'كتاب من وحدة الرقابة المالية بالوزارة بالرأي بالتعاقد', ownerRole: 'ROLE_FINANCIAL_CONTROL', weight: 0.05, slaDays: 15 }
      ]
    },
    {
      id: 'stage-t-contract',
      name: 'Final Guarantees & Contract Execution (التوقيع)',
      nameAr: 'التوقيع',
      sequence: 5,
      tasks: [
        { id: 't-15', name: 'Final guarantee receipt & preliminary contract signature', nameAr: 'استلام التأمين النهائي والأوراق الثبوتية وتوقيع العقد ابتدائياً', ownerRole: 'ROLE_WINNING_VENDOR', weight: 0.05, slaDays: 7 },
        { id: 't-16', name: 'Final contract signature (100%)', nameAr: 'توقيع العقد 100% من وكيل الوزارة', ownerRole: 'ROLE_UNDERSECRETARY', weight: 0.05, slaDays: 7 }
      ]
    }
  ]
};

class WorkflowEngine {
  constructor() {
    this.templates = new Map();
    this.instances = new Map();
    this.tasks = new Map();

    this.registerTemplate(TEMPLATE_PRACTICES);
    this.registerTemplate(TEMPLATE_TENDERS);
  }

  registerTemplate(template) {
    this.templates.set(template.id, template);
    this.templates.set(template.code, template);
  }

  getTemplates() {
    return Array.from(new Set(this.templates.values()));
  }

  startWorkflow({ templateCode, tenantId, entityId, entityType = 'TENDER' }) {
    const template = this.templates.get(templateCode) || this.templates.get('PRACTICES');
    const instanceId = `wfi-${crypto.randomUUID().slice(0, 8)}`;

    const instanceTasks = [];
    template.stages.forEach(stage => {
      stage.tasks.forEach((t, idx) => {
        const taskId = `task-${instanceId}-${t.id}`;
        const taskObj = {
          id: taskId,
          instanceId,
          tenantId,
          templateTaskId: t.id,
          stageId: stage.id,
          stageName: stage.name,
          stageNameAr: stage.nameAr,
          name: t.name,
          nameAr: t.nameAr,
          ownerRole: t.ownerRole,
          weight: t.weight,
          slaDays: t.slaDays,
          status: idx === 0 && stage.sequence === 1 ? 'PENDING' : 'QUEUED',
          assignedTo: null,
          history: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.tasks.set(taskId, taskObj);
        instanceTasks.push(taskObj);
      });
    });

    const instance = {
      id: instanceId,
      templateId: template.id,
      templateCode: template.code,
      templateName: template.name,
      tenantId,
      entityId,
      entityType,
      status: 'IN_PROGRESS',
      currentStageIndex: 0,
      tasks: instanceTasks,
      progressPercent: 0,
      createdAt: new Date().toISOString()
    };

    this.instances.set(instanceId, instance);
    return instance;
  }

  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  getInstance(instanceId) {
    return this.instances.get(instanceId);
  }

  transitionTask({ taskId, action, actorId, role, comment = '', delegatedTo = null }) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const validTransitions = {
      QUEUED: ['START', 'ACTIVATE'],
      PENDING: ['START_REVIEW', 'APPROVE', 'REJECT', 'REQUEST_CORRECTION', 'DELEGATE', 'ESCALATE'],
      IN_REVIEW: ['APPROVE', 'REJECT', 'REQUEST_CORRECTION', 'DELEGATE', 'ESCALATE'],
      CORRECTION_REQUIRED: ['RESUBMIT', 'APPROVE', 'REJECT'],
      REJECTED: ['REOPEN'],
      APPROVED: []
    };

    const normAction = action.toUpperCase();
    const currentStatus = task.status;

    if (currentStatus === 'APPROVED') {
      throw new Error(`Cannot transition already APPROVED task ${taskId}`);
    }

    if (currentStatus === 'REJECTED' && normAction !== 'REOPEN') {
      throw new Error(`Rejected task ${taskId} requires explicit correction or reopen action`);
    }

    let nextStatus = currentStatus;
    if (normAction === 'START_REVIEW') nextStatus = 'IN_REVIEW';
    else if (normAction === 'APPROVE') nextStatus = 'APPROVED';
    else if (normAction === 'REJECT') nextStatus = 'REJECTED';
    else if (normAction === 'REQUEST_CORRECTION') nextStatus = 'CORRECTION_REQUIRED';
    else if (normAction === 'RESUBMIT') nextStatus = 'IN_REVIEW';
    else if (normAction === 'DELEGATE') {
      task.assignedTo = delegatedTo;
      nextStatus = 'IN_REVIEW';
    } else if (normAction === 'ESCALATE') {
      task.ownerRole = 'ROLE_UNDERSECRETARY';
      nextStatus = 'IN_REVIEW';
    } else {
      nextStatus = normAction;
    }

    const event = {
      fromStatus: currentStatus,
      toStatus: nextStatus,
      action: normAction,
      actorId,
      role,
      comment,
      delegatedTo,
      timestamp: new Date().toISOString()
    };

    task.status = nextStatus;
    task.history.push(event);
    task.updatedAt = new Date().toISOString();

    // Auto-advance next task if approved
    if (nextStatus === 'APPROVED') {
      const instance = this.instances.get(task.instanceId);
      if (instance) {
        const pendingOrQueued = instance.tasks.find(t => t.status === 'QUEUED');
        if (pendingOrQueued) {
          pendingOrQueued.status = 'PENDING';
        }

        // Recalculate progress
        const approvedCount = instance.tasks.filter(t => t.status === 'APPROVED').length;
        instance.progressPercent = Math.round((approvedCount / instance.tasks.length) * 100);
        if (approvedCount === instance.tasks.length) {
          instance.status = 'COMPLETED';
        }
      }
    }

    return task;
  }
}

module.exports = {
  WorkflowEngine,
  TEMPLATE_PRACTICES,
  TEMPLATE_TENDERS
};


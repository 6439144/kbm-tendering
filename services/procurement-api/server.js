const http = require('http');
const { URL } = require('url');

// Bounded Context Services
const { WorkflowEngine, TEMPLATE_PRACTICES, TEMPLATE_TENDERS } = require('../../kbm-platform-workflow-service/workflow-engine');
const { VendorManager } = require('../../kbm-platform-vendor-service/vendor-manager');
const { ProcurementManager } = require('../../kbm-platform-procurement-service/procurement-manager');
const { PaymentManager } = require('../../kbm-platform-payment-service/payment-manager');
const { DocumentManager } = require('../../kbm-platform-document-service/document-manager');
const { NotificationManager } = require('../../kbm-platform-notification-service/notification-manager');
const { AuditStore } = require('../../kbm-platform-audit-service/audit-store');
const { MarketplaceManager, MARKETPLACE_PLANS } = require('../../kbm-platform-marketplace-service/marketplace-manager');
const { RaslniAdapter, MoCIClassificationAdapter, EntraIdAdapter } = require('../../kbm-platform-integration-service/integration-adapters');
const { EdgeGateway } = require('../../kbm-platform-edge/edge-gateway');
const { loginUser, getUserById, getNotificationsForUser, markNotificationAsRead } = require('../auth/auth-service');
const { canAccessResource, canAccessObject } = require('../shared/tenant-policy');

// Instantiate Services
const workflowEngine = new WorkflowEngine();
const vendorManager = new VendorManager();
const procurementManager = new ProcurementManager();
const paymentManager = new PaymentManager();
const documentManager = new DocumentManager();
const notificationManager = new NotificationManager();
const auditStore = new AuditStore();
const marketplaceManager = new MarketplaceManager();
const raslniAdapter = new RaslniAdapter();
const mociAdapter = new MoCIClassificationAdapter();
const entraIdAdapter = new EntraIdAdapter();
const edgeGateway = new EdgeGateway();

// Seed initial data
const TENANT_ID = 'tenant-moi';

// Seed demo vendors
const v1 = vendorManager.registerVendor({
  tenantId: TENANT_ID,
  companyName: 'Al-Kharafi Technologies W.L.L.',
  companyNameAr: 'شركة الخرافي للحاسبات الآلية ذ.م.م.',
  commercialRegistrationNo: 'CR-104928',
  email: 'vendor@kbm.demo',
  activities: ['IT-SYS-01', 'CYBER-SEC-09', 'SEC-SURV-02'],
  initialGrade: 'SECOND'
});
vendorManager.activateAnnualSubscription(v1.id);
v1.status = 'ACTIVE';

const v2 = vendorManager.registerVendor({
  tenantId: TENANT_ID,
  companyName: 'Kuwait Civil Contracting Group',
  companyNameAr: 'مجموعة الكويت للمقاولات العامة',
  commercialRegistrationNo: 'CR-882910',
  email: 'civil@vendor.demo',
  activities: ['FACILITY-MGT-08'],
  initialGrade: 'THIRD'
});

const vBlocked = vendorManager.registerVendor({
  tenantId: TENANT_ID,
  companyName: 'Suspended Trading Co.',
  companyNameAr: 'شركة المقاولات المعلقة',
  commercialRegistrationNo: 'CR-449102',
  email: 'blocked@kbm.demo',
  activities: ['IT-SYS-01'],
  initialGrade: 'THIRD'
});
vendorManager.blockVendor(vBlocked.id, { reason: 'Commercial license expired', isPermanent: false, durationDays: 30 });

// Seed sample tenders
const t1 = procurementManager.createTender({
  tenantId: TENANT_ID,
  referenceNumber: 'MOI/TNT/2026/001',
  title: 'Ministry Core IT Infrastructure & Cloud Integration',
  titleAr: 'تحديث البنية التحتية لتكنولوجيا ونظم المعلومات والربط السحابي',
  description: 'Enterprise server hardware, virtualization stack, and data center support.',
  descriptionAr: 'توريد وتركيب وصيانة أجهزة الخوادم المركزية وتقديم الدعم الفني.',
  activities: ['IT-SYS-01'],
  gradeRule: 'SECOND',
  gradeMatchMode: 'GRADE_AND_ABOVE',
  priceKwd: 75
});

const t2 = procurementManager.createTender({
  tenantId: TENANT_ID,
  referenceNumber: 'MOI/TNT/2026/002',
  title: 'Perimeter Security & Automated Surveillance Radar System',
  titleAr: 'صيانة وتوريد أنظمة الرادارات والمراقبة الأمنية وكاميرات CCTV',
  description: 'High-definition thermal cameras, radar sensors, and central command monitoring.',
  descriptionAr: 'أنظمة كاميرات المراقبة الحرارية والرادارات الأمنية للمواقع الحيوية.',
  activities: ['SEC-SURV-02', 'CYBER-SEC-09'],
  gradeRule: 'FIRST',
  gradeMatchMode: 'EXACT_GRADE',
  priceKwd: 150
});

// Seed sample workflow instances
const wfInstance = workflowEngine.startWorkflow({
  templateCode: 'PRACTICES',
  tenantId: TENANT_ID,
  entityId: t1.id
});

// Seed sample documents
const doc1 = documentManager.registerDocument({
  tenantId: TENANT_ID,
  ownerId: 'staff-01',
  ownerType: 'STAFF',
  filename: 'Official_GM_Approval_Letter_2026.pdf',
  mimeType: 'application/pdf',
  classification: 'RESTRICTED'
});

const docTenderSpecs = documentManager.registerDocument({
  tenantId: TENANT_ID,
  ownerId: 'staff-01',
  ownerType: 'STAFF',
  filename: 'Tender_Booklet_MOI_TNT_2026_001.pdf',
  mimeType: 'application/pdf',
  classification: 'OFFICIAL_TENDER'
});

// Seed initial audit log
auditStore.appendEvent({
  tenantId: TENANT_ID,
  actorId: 'system-bootstrap',
  actorRole: 'SYSTEM',
  action: 'PLATFORM_BOOTSTRAP_INITIALIZED',
  entityType: 'PLATFORM',
  entityId: TENANT_ID,
  details: { profile: 'FREE_BOOTSTRAP_PROFILE', monthlyAzureCost: 0 }
});

function sendJson(res, statusCode, data) {
  edgeGateway.applySecurityHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Correlation-Id, X-Idempotency-Key'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Request body too large (max 10MB)'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const correlationId = edgeGateway.injectCorrelationId(req, res);
  const clientIp = req.socket?.remoteAddress || '127.0.0.1';

  // Check rate limit
  const rateLimit = edgeGateway.checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return sendJson(res, 429, { error: 'Too Many Requests', retryAfterMs: 60000 });
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:3001'}`);
  const pathname = url.pathname;

  try {
    // Health Check
    if (req.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
      const integrity = auditStore.verifyChainIntegrity();
      return sendJson(res, 200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        correlationId,
        services: {
          procurement: 'UP',
          workflow: 'UP',
          vendor: 'UP',
          payments: 'UP',
          documents: 'UP',
          notifications: 'UP',
          audit: integrity.valid ? 'UP (INTEGRITY_VERIFIED)' : 'WARNING (CHAIN_CHECK_FAILED)',
          marketplace: 'UP',
          edge: 'UP'
        },
        deploymentProfile: 'bootstrap-free-tier',
        estimatedAzureCostUsd: 0
      });
    }

    // ==========================================
    // AUTHENTICATION & SESSIONS
    // ==========================================
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const { email, password } = await parseJsonBody(req);
      let authResult;
      try {
        authResult = loginUser(email, password);
      } catch (err) {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }

      const user = authResult?.user;
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }

      // If user is vendor, bind actual vendor entity
      let vendorDetails = null;
      if (String(user.role).toLowerCase() === 'vendor' || email === 'vendor@kbm.demo') {
        vendorDetails = vendorManager.getVendor(v1.id);
      }

      auditStore.appendEvent({
        tenantId: user.tenantId || TENANT_ID,
        actorId: user.id,
        actorRole: user.role,
        action: 'USER_LOGIN_SUCCESS',
        entityType: 'USER',
        entityId: user.id,
        clientIp
      });

      return sendJson(res, 200, {
        user: {
          ...user,
          vendorId: vendorDetails ? vendorDetails.id : null,
          vendor: vendorDetails
        },
        token: authResult.token || `mock-jwt-token-${user.id}-${Date.now()}`
      });
    }

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/notifications') {
      const tenantId = url.searchParams.get('tenantId') || TENANT_ID;
      const recipientId = url.searchParams.get('recipientId');
      const role = url.searchParams.get('role');
      const notifications = notificationManager.listNotifications({ tenantId, recipientId, role });
      return sendJson(res, 200, notifications);
    }

    if (req.method === 'POST' && pathname.startsWith('/api/notifications/') && pathname.endsWith('/read')) {
      const parts = pathname.split('/');
      const notifId = parts[3];
      const updated = notificationManager.markAsRead(notifId);
      return sendJson(res, 200, updated || { success: true });
    }

    // ==========================================
    // WORKFLOW ENGINE & TEMPLATES
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/workflow/templates') {
      return sendJson(res, 200, workflowEngine.getTemplates());
    }

    if (req.method === 'GET' && pathname.startsWith('/api/workflow/instances/')) {
      const instanceId = pathname.split('/')[4];
      const inst = workflowEngine.getInstance(instanceId);
      if (!inst) return sendJson(res, 404, { error: 'Instance not found' });
      return sendJson(res, 200, inst);
    }

    if (req.method === 'POST' && pathname === '/api/workflow/instances') {
      const { templateCode, tenantId, entityId, entityType } = await parseJsonBody(req);
      const instance = workflowEngine.startWorkflow({
        templateCode: templateCode || 'PRACTICES',
        tenantId: tenantId || TENANT_ID,
        entityId,
        entityType
      });
      return sendJson(res, 201, instance);
    }

    if (req.method === 'POST' && pathname.startsWith('/api/workflow/tasks/') && pathname.endsWith('/transition')) {
      const taskId = pathname.split('/')[4];
      const body = await parseJsonBody(req);
      const updated = workflowEngine.transitionTask({
        taskId,
        action: body.action,
        actorId: body.actorId || 'staff-01',
        role: body.role || 'STAFF',
        comment: body.comment || '',
        delegatedTo: body.delegatedTo
      });

      auditStore.appendEvent({
        tenantId: updated.tenantId,
        actorId: body.actorId || 'staff-01',
        actorRole: body.role || 'STAFF',
        action: `WORKFLOW_TASK_${body.action.toUpperCase()}`,
        entityType: 'WORKFLOW_TASK',
        entityId: taskId,
        details: { status: updated.status, comment: body.comment }
      });

      return sendJson(res, 200, updated);
    }

    // ==========================================
    // VENDOR MANAGEMENT & ONBOARDING
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/vendors') {
      const list = Array.from(vendorManager.vendors.values());
      return sendJson(res, 200, list);
    }

    if (req.method === 'POST' && pathname === '/api/vendors/register') {
      const body = await parseJsonBody(req);
      const vendor = vendorManager.registerVendor({
        tenantId: body.tenantId || TENANT_ID,
        companyName: body.companyName,
        companyNameAr: body.companyNameAr,
        commercialRegistrationNo: body.commercialRegistrationNo,
        email: body.email,
        activities: body.activities || ['IT-SYS-01'],
        initialGrade: body.initialGrade || 'THIRD',
        documents: body.documents || []
      });

      // Send alert to MOI Staff (NOT-002)
      notificationManager.sendNotification({
        tenantId: vendor.tenantId,
        recipientId: 'moi-staff-pool',
        recipientRole: 'STAFF',
        notificationCode: 'NOT-002',
        title: 'New Vendor Registration Application',
        titleAr: 'طلب تسجيل مورد جديد',
        message: `${vendor.companyName} (${vendor.commercialRegistrationNo}) has submitted qualification documents for review.`,
        messageAr: `قام المورد ${vendor.companyNameAr} بتقديم مستندات التسجيل للمراجعة والاعتماد.`
      });

      auditStore.appendEvent({
        tenantId: vendor.tenantId,
        actorId: vendor.id,
        actorRole: 'VENDOR',
        action: 'VENDOR_REGISTRATION_SUBMITTED',
        entityType: 'VENDOR',
        entityId: vendor.id,
        details: { company: vendor.companyName, cr: vendor.commercialRegistrationNo }
      });

      return sendJson(res, 201, vendor);
    }

    if (req.method === 'POST' && pathname.startsWith('/api/vendors/') && pathname.endsWith('/grade')) {
      const vendorId = pathname.split('/')[3];
      const { grade, actorId } = await parseJsonBody(req);
      const updated = vendorManager.assignGrade(vendorId, grade, actorId);

      // Issue notification to vendor with KNET payment link (NOT-004)
      notificationManager.sendNotification({
        tenantId: updated.tenantId,
        recipientId: vendorId,
        recipientRole: 'VENDOR',
        notificationCode: 'NOT-004',
        title: 'Vendor Registration Approved — Annual Subscription Link',
        titleAr: 'تم اعتماد تسجيل المورد — رابط دفع الاشتراك السنوي',
        message: `Your registration is approved as ${grade} Grade. Click to complete annual subscription via KNET.`,
        messageAr: `تمت الموافقة على تسجيلكم بالدرجة (${grade}). يرجى دفع الاشتراك السنوي عبر كي نت لتفعيل الحساب.`,
        actionUrl: `/payments/subscription/${vendorId}`
      });

      auditStore.appendEvent({
        tenantId: updated.tenantId,
        actorId: actorId || 'grading-authority',
        actorRole: 'GRADING_AUTHORITY',
        action: 'VENDOR_GRADE_ASSIGNED',
        entityType: 'VENDOR',
        entityId: vendorId,
        details: { grade }
      });

      return sendJson(res, 200, updated);
    }

    if (req.method === 'POST' && pathname.startsWith('/api/vendors/') && pathname.endsWith('/block')) {
      const vendorId = pathname.split('/')[3];
      const { reason, isPermanent, durationDays } = await parseJsonBody(req);
      const updated = vendorManager.blockVendor(vendorId, { reason, isPermanent, durationDays });

      notificationManager.sendNotification({
        tenantId: updated.tenantId,
        recipientId: vendorId,
        recipientRole: 'VENDOR',
        notificationCode: 'NOT-005',
        title: 'Account Suspension Notice',
        titleAr: 'إشعار إيقاف الحساب',
        message: `Your vendor portal access has been suspended: ${reason}`,
        messageAr: `تم تعليق حسابكم في بوابة الموردين للسبب التالي: ${reason}`
      });

      auditStore.appendEvent({
        tenantId: updated.tenantId,
        actorId: 'moi-admin',
        actorRole: 'TENANT_ADMIN',
        action: 'VENDOR_ACCOUNT_BLOCKED',
        entityType: 'VENDOR',
        entityId: vendorId,
        details: { reason, isPermanent, durationDays }
      });

      return sendJson(res, 200, updated);
    }

    if (req.method === 'POST' && pathname.startsWith('/api/vendors/') && pathname.endsWith('/unblock')) {
      const vendorId = pathname.split('/')[3];
      const updated = vendorManager.unblockVendor(vendorId);
      return sendJson(res, 200, updated);
    }

    // ==========================================
    // PROCUREMENT INTAKE & TENDERS
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/tenders') {
      const tenantId = url.searchParams.get('tenantId') || TENANT_ID;
      const vendorId = url.searchParams.get('vendorId');
      const vendor = vendorId ? vendorManager.getVendor(vendorId) : null;
      const tenders = procurementManager.listTenders({ tenantId, vendor });
      return sendJson(res, 200, tenders);
    }

    if (req.method === 'POST' && pathname === '/api/requests') {
      const body = await parseJsonBody(req);
      const request = procurementManager.submitRequest({
        tenantId: body.tenantId || TENANT_ID,
        channel: body.channel || 'manual_gm_letter',
        title: body.title,
        titleAr: body.titleAr,
        requestingDepartment: body.requestingDepartment,
        requestingDepartmentAr: body.requestingDepartmentAr,
        gmLetterReference: body.gmLetterReference,
        gmLetterAttachmentId: body.gmLetterAttachmentId,
        raslniMessageId: body.raslniMessageId,
        estimatedBudgetKwd: body.estimatedBudgetKwd
      });

      auditStore.appendEvent({
        tenantId: request.tenantId,
        actorId: body.actorId || 'staff-intake',
        actorRole: 'STAFF',
        action: 'TENDER_REQUEST_CREATED',
        entityType: 'REQUEST',
        entityId: request.id,
        details: { channel: request.channel, department: request.requestingDepartment }
      });

      return sendJson(res, 201, request);
    }

    if (req.method === 'POST' && pathname === '/api/tenders') {
      const body = await parseJsonBody(req);
      const tender = procurementManager.createTender({
        tenantId: body.tenantId || TENANT_ID,
        requestId: body.requestId,
        referenceNumber: body.referenceNumber,
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        requestingDepartment: body.requestingDepartment,
        requestingDepartmentAr: body.requestingDepartmentAr,
        sourcingType: body.sourcingType,
        closingDate: body.closingDate,
        activities: body.activities || ['IT-SYS-01'],
        gradeRule: body.gradeRule || 'SECOND',
        gradeMatchMode: body.gradeMatchMode || 'GRADE_AND_ABOVE',
        priceKwd: body.priceKwd || 75
      });

      auditStore.appendEvent({
        tenantId: tender.tenantId,
        actorId: body.actorId || 'tender-creator',
        actorRole: 'TENDER_CREATOR',
        action: 'TENDER_PUBLISHED',
        entityType: 'TENDER',
        entityId: tender.id,
        details: { ref: tender.referenceNumber, gradeRule: tender.gradeRule }
      });

      return sendJson(res, 201, tender);
    }

    if (req.method === 'GET' && pathname.startsWith('/api/tenders/') && pathname.endsWith('/eligibility')) {
      const parts = pathname.split('/');
      const tenderId = parts[3];
      const vendorId = url.searchParams.get('vendorId') || v1.id;
      const tender = procurementManager.getTender(tenderId);
      const vendor = vendorManager.getVendor(vendorId);

      if (!tender) return sendJson(res, 404, { error: 'Tender not found' });
      const eligibility = procurementManager.evaluateEligibility(tender, vendor);
      return sendJson(res, 200, eligibility);
    }

    // ==========================================
    // PAYMENTS & KNET CHECKOUT
    // ==========================================
    if (req.method === 'POST' && pathname === '/api/payments/checkout') {
      const body = await parseJsonBody(req);
      const session = paymentManager.createCheckoutSession({
        tenantId: body.tenantId || TENANT_ID,
        vendorId: body.vendorId,
        vendorName: body.vendorName || 'Vendor Company',
        paymentType: body.paymentType || 'TENDER_PURCHASE',
        tenderId: body.tenderId,
        amountKwd: body.amountKwd || 75
      });
      return sendJson(res, 201, session);
    }

    if (req.method === 'POST' && pathname === '/api/payments/knet/callback') {
      const body = await parseJsonBody(req);
      const result = paymentManager.processKnetCallback({
        paymentId: body.paymentId,
        trackId: body.trackId,
        result: body.result || 'CAPTURED',
        authCode: body.authCode || 'AUTH-' + Math.floor(100000 + Math.random() * 900000),
        referenceNo: body.referenceNo || 'REF-' + Math.floor(1000000 + Math.random() * 9000000)
      });

      if (result.receipt) {
        auditStore.appendEvent({
          tenantId: result.receipt.tenantId,
          actorId: result.receipt.vendorId,
          actorRole: 'VENDOR',
          action: 'PAYMENT_CAPTURED_AND_RECEIPT_ISSUED',
          entityType: 'PAYMENT',
          entityId: result.receipt.paymentId,
          details: { receiptNumber: result.receipt.receiptNumber, amount: result.receipt.amountKwd }
        });
      }

      return sendJson(res, 200, result);
    }

    if (req.method === 'GET' && pathname.startsWith('/api/receipts/')) {
      const receiptId = pathname.split('/')[3];
      const receipt = paymentManager.getReceipt(receiptId) || paymentManager.getReceiptByPaymentId(receiptId);
      if (!receipt) return sendJson(res, 404, { error: 'Receipt not found' });
      return sendJson(res, 200, receipt);
    }

    // ==========================================
    // DOCUMENTS & WATERMARKING
    // ==========================================
    if (req.method === 'GET' && pathname.startsWith('/api/documents/') && pathname.endsWith('/watermark')) {
      const docId = pathname.split('/')[3];
      let doc = documentManager.getDocument(docId);
      if (!doc) {
        doc = documentManager.registerDocument({
          tenantId: TENANT_ID,
          ownerId: 'staff-sys',
          ownerType: 'STAFF',
          filename: `${docId}.pdf`,
          mimeType: 'application/pdf'
        });
      }

      const userContext = {
        vendorId: url.searchParams.get('vendorId') || v1.id,
        companyName: url.searchParams.get('companyName') || v1.companyName,
        ip: clientIp
      };
      const watermark = documentManager.generateWatermarkMetadata(doc.id, userContext);
      return sendJson(res, 200, watermark);
    }

    // ==========================================
    // AUDIT & COMPLIANCE
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/audit/events') {
      const tenantId = url.searchParams.get('tenantId') || TENANT_ID;
      const events = auditStore.listEvents({ tenantId });
      return sendJson(res, 200, events);
    }

    if (req.method === 'GET' && pathname === '/api/audit/verify') {
      const integrity = auditStore.verifyChainIntegrity();
      return sendJson(res, 200, integrity);
    }

    if (req.method === 'GET' && pathname === '/api/audit/export') {
      const tenantId = url.searchParams.get('tenantId') || TENANT_ID;
      const exportPkg = auditStore.exportAuditPackage(tenantId);
      return sendJson(res, 200, exportPkg);
    }

    // ==========================================
    // COMMERCIAL MARKETPLACE SAAS FULFILLMENT
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/marketplace/plans') {
      return sendJson(res, 200, marketplaceManager.getPlans());
    }

    if (req.method === 'POST' && pathname === '/api/marketplace/resolve') {
      const { token } = await parseJsonBody(req);
      const resolution = marketplaceManager.resolveMarketplaceToken(token);
      return sendJson(res, 200, resolution);
    }

    if (req.method === 'POST' && pathname === '/api/marketplace/activate') {
      const body = await parseJsonBody(req);
      const subscription = marketplaceManager.activateSubscription({
        subscriptionId: body.subscriptionId,
        planId: body.planId,
        tenantName: body.tenantName,
        adminEmail: body.adminEmail
      });

      auditStore.appendEvent({
        tenantId: body.subscriptionId,
        actorId: body.adminEmail || 'marketplace-buyer',
        actorRole: 'BUYER',
        action: 'MARKETPLACE_SAAS_ACTIVATED',
        entityType: 'SAAS_SUBSCRIPTION',
        entityId: subscription.subscriptionId,
        details: { plan: subscription.planId, tenant: subscription.tenantName }
      });

      return sendJson(res, 200, subscription);
    }

    if (req.method === 'POST' && pathname === '/api/marketplace/webhook') {
      const body = await parseJsonBody(req);
      const sub = marketplaceManager.processLifecycleWebhook({
        action: body.action,
        subscriptionId: body.subscriptionId,
        planId: body.planId,
        quantity: body.quantity
      });
      return sendJson(res, 200, { status: 'Success', subscription: sub });
    }

    // ==========================================
    // INTEGRATIONS (Raslni & MoCI)
    // ==========================================
    if (req.method === 'GET' && pathname === '/api/integrations/moci/activities') {
      return sendJson(res, 200, mociAdapter.getCatalog());
    }

    if (req.method === 'POST' && pathname === '/api/integrations/raslni/simulate') {
      const body = await parseJsonBody(req);
      const msg = raslniAdapter.simulateIncomingMessage({
        tenantId: body.tenantId || TENANT_ID,
        senderDepartment: body.senderDepartment || 'Department of Operations',
        subject: body.subject || 'Electronic Tender Request',
        bodyText: body.bodyText || 'Please proceed with tender execution'
      });
      return sendJson(res, 201, msg);
    }

    // Fallback 404
    sendJson(res, 404, { error: 'Not Found', path: pathname });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: err.message || 'Internal Server Error' });
  }
});

const PORT = process.env.API_PORT || 3001;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`KBM Modular Host running on http://localhost:${PORT}`);
  });
}

module.exports = { server, state: { vendors: Array.from(vendorManager.vendors.values()) } };

/**
 * KBM Procurement & Tender Management Platform
 * Bilingual Client Demo & SaaS Control Center Script with
 * Interactive Guided Tour and Tender Lifecycle Journey Visualizer
 */

const DICTIONARY = {
  ar: {
    appTitle: 'منصة إدارة المناقصات والمشتريات',
    appSubtitle: 'KBM Procurement & Tender Management SaaS',
    liveDemo: 'عرض حي للعميل',
    bootstrapProfile: 'باقة التأسيس ($0/شهر)',
    btnGuidedTour: 'الجولة التعريفية التفاعلية',
    loginTitle: 'تسجيل الدخول للمنصة',
    loginSubtitle: 'بوابة المشتريات والمناقصات الموحدة للجهات الحكومية والشركات',
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    signInBtn: 'تسجيل الدخول',
    quickPersonasTitle: 'حسابات العرض التوضيحي السريع (Demo Personas):',
    marketplacePreviewLink: '🛒 تجربة واجهة متجر مايكروسوفت (Microsoft Marketplace SaaS Onboarding)',
    logout: 'تسجيل الخروج',
    tabStaff: '🏛️ بوابة فريق المناقصات الداخلي (Staff)',
    tabVendor: '🏢 بوابة الموردين والشركات (Vendor Portal)',
    tabAdmin: '⚙️ إدارة النظام والحوكمة (Tenant Admin)',
    tabMarketplace: '🛒 متجر مايكروسوفت ساس (Marketplace SaaS)',
    notifCenterTitle: 'مركز الإشعارات والإجراءات المطلوبة',
    staffPortalHeading: 'إدارة طلبات المناقصات ودورات الاعتماد الداخلي',
    staffPortalSubheading: 'استقبال الطلبات (رسلني / كتاب مدير عام)، مسارات التدقيق، وإطلاق المناقصات',
    btnNewRequest: '+ تسجيل طلب مناقصة جديد',
    kpiActiveRequests: 'طلبات قيد المراجعة',
    kpiPublishedTenders: 'المناقصات المطروحة',
    kpiWorkflowProgress: 'متوسط تقدم الاعتمادات',
    kpiAuditIntegrity: 'حالة سجل التدقيق الرقمي',
    chainValid: 'سليم وموثق (SHA-256)',
    journeyTitle: '🗺️ خريطة المسار الزمني ومراحل المناقصة (Tender Lifecycle Journey)',
    journeySubtitle: 'تتبع بصري تفاعلي للمراحل والجهات الرقابية والموافقات لكل مناقصة',
    selectTenderToView: 'المناقصة المحددة:',
    stage1Title: '1. التجهيز والميزانية',
    stage2Title: '2. الفتوى والتشريع ولجنة الشراء',
    stage3Title: '3. إعلان الطرح والتأهيل (CAPT)',
    stage4Title: '4. فض العطاءات والترسية',
    stage5Title: '5. ديوان المحاسبة وتوقيع العقد',
    workflowBoardTitle: 'لوحة متابعة إجراءات ومراحل الطرح (Workflow Tracker Engine)',
    workflowTrackerRef: 'مبني وفق نماذج الممارسات (8 مراحل) والمناقصات (35 مرحلة) التاريخية',
    selectWorkflowTemplate: 'النموذج النشط:',
    tendersCatalogStaff: 'سجل المناقصات والممارسات المطروحة',
    btnPublishTender: '+ إنشاء وطرح مناقصة جديدة',
    vendorPortalHeading: 'بوابة الموردين والشركات المؤهلة',
    vendorPortalSubheading: 'استعراض المناقصات المطابقة للتأهيل، الشراء عبر كي نت، وحماية المحتوى',
    vendorNoticeTitle: 'تنبيه الموردين المؤهلين:',
    vendorNoticeText: 'تعرض البوابة فقط المناقصات المطابقة للأنشطة التجارية المسجلة ودرجة تصنيف شركتكم.',
    eligibleTendersTitle: 'المناقصات المتاحة للشراء والتأهيل',
    btnRequestUpgrade: '⬆️ طلب ترقية الدرجة',
    purchasedReceiptsTitle: 'إيصالات الشراء وكراسات الشروط المشتراة',
    adminPortalHeading: 'إدارة الجهة الحكومية وحوكمة الموردين',
    adminPortalSubheading: 'تصنيف الموردين، الإيقاف المؤقت، الإعفاءات، وسجل التدقيق غير القابل للتعديل',
    btnVerifyAudit: '🛡️ التحقق من سلامة سجل التدقيق (SHA-256)',
    vendorsGovernanceTitle: 'سجل الشركات والموردين وإدارة الصلاحيات',
    auditExplorerTitle: 'سجل الأحداث والرقابة الرقمية (Cosmos DB Immutable Audit Log)',
    auditSub: 'كل حدث مشفر ومربوط بالحدث السابق عبر سلسلة التجزئة SHA-256 Hash Chain',
    btnExportAudit: '📥 تصدير حزمة التدقيق (JSON)',
    marketplaceHeading: 'متجر مايكروسوفت — تجربة الاشتراك والتفعيل (SaaS Fulfillment v2)',
    marketplaceSubheading: 'تكامل متجر Azure التجاري: معالجة الرموز، تفعيل الاشتراكات، وربط خطافات الويب (Webhooks)',
    marketplaceSimTitle: 'محاكي استلام رمز الشراء من Azure Marketplace (Token Resolution)',
    marketplaceTokenLabel: 'رمز تعريف الشراء (Marketplace Identification Token):',
    btnResolveToken: '🔍 فك الرمز (Resolve Token)',
    btnActivateSub: '🚀 تفعيل الاشتراك (Activate Subscription)',
    btnSimWebhook: '⚡ محاكاة خطاف الويب (Simulate Webhook)',
    thRef: 'رقم المرجع',
    thTitle: 'عنوان المناقصة / الممارسة',
    thActivities: 'الأنشطة المستهدفة',
    thGrade: 'الدرجة المطلوبة',
    thFee: 'قيمة الكراسة',
    thStatus: 'الحالة',
    thActions: 'الإجراءات',
    thReceiptNo: 'رقم الإيصال',
    thTender: 'المناقصة',
    thAmount: 'المبلغ (د.ك)',
    thDate: 'تاريخ الدفع',
    thKnetRef: 'مرجع كي نت',
    thPrintReceipt: 'الإيصال المعتمد',
    thCompany: 'اسم الشركة',
    thCR: 'السجل التجاري',
    modalRequestTitle: 'تسجيل طلب مناقصة جديد (Request Intake)',
    labelIntakeChannel: 'قناة ورود الطلب:',
    labelReqDept: 'الإدارة الطالبة:',
    labelReqTitle: 'موضوع / عنوان الطلب:',
    labelBudget: 'الميزانية التقديرية (د.ك):',
    labelScanAttachment: 'مرفق المسح الضوئي لكتاب المدير العام (إلزامي):',
    btnCancel: 'إلغاء',
    btnSubmitRequest: 'تسجيل الطلب وبدء دورة الاعتماد',
    modalTenderTitle: 'إنشاء وطرح مناقصة جديدة',
    labelTenderTitle: 'عنوان المناقصة:',
    labelTargetActivity: 'النشاط المستهدف (تصنيف وزارة التجارة والصناعة):',
    labelGradeRule: 'درجة التصنيف المطلوبة:',
    labelPrice: 'قيمة كراسة الشروط (د.ك):',
    btnPublish: 'اعتماد ونشر المناقصة',
    receiptHeader: 'إيصال سداد رسوم مناقصة رسمي',
    btnPrint: '🖨️ طباعة الإيصال',
    btnClose: 'إغلاق',
    knetAmountLabel: 'المبلغ الإجمالي المطلوب:'
  },
  en: {
    appTitle: 'Procurement & Tender Management Platform',
    appSubtitle: 'KBM Multi-Tenant SaaS Procurement Solution',
    liveDemo: 'Live Client Demo',
    bootstrapProfile: 'Zero-Cost Bootstrap ($0/mo)',
    btnGuidedTour: 'Interactive Guided Tour',
    loginTitle: 'Sign In to KBM Platform',
    loginSubtitle: 'Unified Procurement & Tendering Gateway for Government & Vendors',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    signInBtn: 'Sign In',
    quickPersonasTitle: 'Quick Demo Personas:',
    marketplacePreviewLink: '🛒 Experience Microsoft Marketplace SaaS Onboarding',
    logout: 'Log Out',
    tabStaff: '🏛️ Internal Staff Portal',
    tabVendor: '🏢 Vendor & Bidder Portal',
    tabAdmin: '⚙️ Tenant Administration',
    tabMarketplace: '🛒 Marketplace SaaS',
    notifCenterTitle: 'Notification & Action Center',
    staffPortalHeading: 'Tender Requests & Internal Approval Cycles',
    staffPortalSubheading: 'Request intake (Raslni / GM Letter), audit workflows, and tender publishing',
    btnNewRequest: '+ New Tender Request',
    kpiActiveRequests: 'Active Requests',
    kpiPublishedTenders: 'Published Tenders',
    kpiWorkflowProgress: 'Avg Approval Progress',
    kpiAuditIntegrity: 'Audit Trail Integrity',
    chainValid: 'Verified SHA-256 Chain',
    journeyTitle: '🗺️ Tender Lifecycle & Governance Journey Map',
    journeySubtitle: 'Interactive visual tracking of regulatory stages, oversight bodies, and approvals',
    selectTenderToView: 'Selected Tender:',
    stage1Title: '1. Preparation & Budget',
    stage2Title: '2. Fatwa & Purchase Committee',
    stage3Title: '3. Public Launch & CAPT',
    stage4Title: '4. Bid Study & Award',
    stage5Title: '5. Audit Bureau & Contract Signing',
    workflowBoardTitle: 'Workflow Tracker & Stage Orchestration Engine',
    workflowTrackerRef: 'Pre-seeded with historical Practices (8 steps) and Tenders (35 steps) trackers',
    selectWorkflowTemplate: 'Active Template:',
    tendersCatalogStaff: 'Published Tenders & Practices Registry',
    btnPublishTender: '+ Create & Publish Tender',
    vendorPortalHeading: 'Qualified Vendor Portal',
    vendorPortalSubheading: 'Explore eligible tenders, purchase via KNET, and content protection',
    vendorNoticeTitle: 'Prequalification Notice:',
    vendorNoticeText: 'The catalog strictly filters tenders based on your registered MoCI activities and grading tier.',
    eligibleTendersTitle: 'Eligible Tenders Available for Purchase',
    btnRequestUpgrade: '⬆️ Request Grade Upgrade',
    purchasedReceiptsTitle: 'Purchased Tenders & Official Receipts',
    adminPortalHeading: 'Tenant Governance & Vendor Administration',
    adminPortalSubheading: 'Vendor grading, date-range suspensions, exemptions, and immutable audit explorer',
    btnVerifyAudit: '🛡️ Verify Audit Chain Integrity (SHA-256)',
    vendorsGovernanceTitle: 'Vendor Registry & Permissions Management',
    auditExplorerTitle: 'Cosmos DB Immutable Event Store & Compliance Log',
    auditSub: 'Every event cryptographically chained via SHA-256 previous-hash linkage',
    btnExportAudit: '📥 Export Audit Package (JSON)',
    marketplaceHeading: 'Microsoft Marketplace — SaaS Fulfillment v2',
    marketplaceSubheading: 'Commercial marketplace landing experience, token resolution, and webhook orchestration',
    marketplaceSimTitle: 'Azure Marketplace Purchase Token Resolution Simulator',
    marketplaceTokenLabel: 'Marketplace Identification Token:',
    btnResolveToken: '🔍 Resolve Token',
    btnActivateSub: '🚀 Activate Subscription',
    btnSimWebhook: '⚡ Simulate Webhook',
    thRef: 'Reference No.',
    thTitle: 'Tender / Practice Title',
    thActivities: 'Target Activities',
    thGrade: 'Grade Required',
    thFee: 'Document Fee',
    thStatus: 'Status',
    thActions: 'Actions',
    thReceiptNo: 'Receipt No.',
    thTender: 'Tender Title',
    thAmount: 'Amount (KWD)',
    thDate: 'Payment Date',
    thKnetRef: 'KNET Reference',
    thPrintReceipt: 'Official Receipt',
    thCompany: 'Company Name',
    thCR: 'Commercial Reg (CR)',
    modalRequestTitle: 'New Tender Request Intake',
    labelIntakeChannel: 'Intake Channel:',
    labelReqDept: 'Requesting Department:',
    labelReqTitle: 'Request Subject / Title:',
    labelBudget: 'Estimated Budget (KWD):',
    labelScanAttachment: 'Mandatory Scanned GM Letter Attachment:',
    btnCancel: 'Cancel',
    btnSubmitRequest: 'Submit Request & Start Approval',
    modalTenderTitle: 'Create & Publish New Tender',
    labelTenderTitle: 'Tender Title:',
    labelTargetActivity: 'Target Activity (MoCI Classification):',
    labelGradeRule: 'Required Classification Grade:',
    labelPrice: 'Document Booklet Price (KWD):',
    btnPublish: 'Approve & Publish Tender',
    receiptHeader: 'Official Tender Fee Payment Receipt',
    btnPrint: '🖨️ Print Receipt',
    btnClose: 'Close',
    knetAmountLabel: 'Total Required Amount:'
  }
};

const TOUR_STEPS = [
  {
    step: 1,
    titleAr: '1. الواجهة المزدوجة وسياق المستخدم',
    titleEn: '1. Bilingual Layout & User Persona',
    descAr: 'تتميز المنصة بدعم كامل للغتين العربية (RTL) والإنجليزية (LTR) مع التبديل الفوري وسياق الصلاحيات المعزول.',
    descEn: 'The platform offers full bilingual RTL/LTR support with instant language toggle and role-based tenant isolation.',
    targetPortal: 'staff'
  },
  {
    step: 2,
    titleAr: '2. خريطة المسار الزمني ومراحل المناقصة',
    titleEn: '2. Tender Lifecycle Journey Visualizer',
    descAr: 'مخطط زمني تفاعلي يعرض تقدم المناقصة عبر المراحل الخمس الرئيسية (التجهيز، الفتوى، الطرح، الترسية، وديوان المحاسبة).',
    descEn: 'Visual pipeline tracker displaying tender progress across 5 macro-stages including regulatory oversight.',
    targetPortal: 'staff'
  },
  {
    step: 3,
    titleAr: '3. استقبال الطلبات وطرح المناقصات',
    titleEn: '3. Request Intake (Raslni & GM Scan)',
    descAr: 'استقبال الطلبات عبر مسار رسلني الإلكتروني أو الخطاب الرسمي مع اشتراط المرفق الممسوح ضوئياً (FR-012).',
    descEn: 'Supports electronic Raslni intake or official GM Letter with mandatory scanned document validation.',
    targetPortal: 'staff'
  },
  {
    step: 4,
    titleAr: '4. بوابة الموردين وحماية المحتوى المانعة للتسريب',
    titleEn: '4. Qualified Vendor Portal & Canvas Watermark',
    descAr: 'فلاتر تأهيل صارمة من جهة الخادم، عارض كراسات محمي بعلامة مائية ديناميكية تمنع التصوير، ودفع كي نت مع إيصال رسمي.',
    descEn: 'Strict server-side eligibility checks, dynamic anti-screenshot canvas watermarking, and KNET checkout.',
    targetPortal: 'vendor'
  },
  {
    step: 5,
    titleAr: '5. سجل تدقيق Cosmos DB وساس مايكروسوفت',
    titleEn: '5. SHA-256 Audit Trail & Marketplace SaaS',
    descAr: 'سجل تدقيق رقمي غير قابل للتعديل بسلسلة SHA-256، وتكامل كامل مع SaaS Fulfillment v2 لمتجر Azure.',
    descEn: 'Immutable append-only audit trail with SHA-256 hash chaining and turnkey Azure Marketplace SaaS fulfillment.',
    targetPortal: 'admin'
  }
];

// Journey Stages Metadata
const JOURNEY_STAGES = [
  {
    id: 1,
    nameAr: '1. التجهيز والميزانية',
    nameEn: '1. Preparation & Budget',
    roleAr: 'النظم & المالية',
    roleEn: 'Systems & Finance',
    slaTotal: '60d',
    tasks: [
      { nameAr: 'تحديد احتياجات الوزارة وإعداد مقترح الميزانية', nameEn: 'Needs survey & CAIT budget entry', role: 'ROLE_SYSTEMS', sla: '30d', status: 'APPROVED' },
      { nameAr: 'اعتماد الميزانية التقديرية من وزارة المالية', nameEn: 'Ministry of Finance budget approval', role: 'ROLE_FINANCE', sla: '60d', status: 'APPROVED' }
    ]
  },
  {
    id: 2,
    nameAr: '2. الفتوى والتشريع ولجنة الشراء',
    nameEn: '2. Fatwa & Purchase Committee',
    roleAr: 'لجنة الشراء & الرقابة',
    roleEn: 'Purchase Comm & Legal',
    slaTotal: '44d',
    tasks: [
      { nameAr: 'اعتماد المواصفات الفنية من لجنة الشراء', nameEn: 'Purchase committee technical approval', role: 'ROLE_PURCHASE_COMMITTEE', sla: '14d', status: 'APPROVED' },
      { nameAr: 'موافقة إدارة الفتوى والتشريع على كراسة الشروط', nameEn: 'Fatwa & Legislation legal review', role: 'ROLE_AUDIT_CONTROL', sla: '30d', status: 'APPROVED' }
    ]
  },
  {
    id: 3,
    nameAr: '3. إعلان الطرح والتأهيل (CAPT)',
    nameEn: '3. Public Launch & CAPT',
    roleAr: 'الجهاز المركزي للمناقصات',
    roleEn: 'Central Tenders Agency',
    slaTotal: '105d',
    tasks: [
      { nameAr: 'طلب الإعلان عن المناقصة إلى CAPT', nameEn: 'Tender announcement request to CAPT', role: 'ROLE_AUDIT_CONTROL', sla: '15d', status: 'APPROVED' },
      { nameAr: 'إعلان موافقة CAPT على طرح المناقصة', nameEn: 'CAPT approval decision', role: 'ROLE_CAPT', sla: '60d', status: 'IN_REVIEW' },
      { nameAr: 'نشر إعلان الطرح 100% في الجريدة الرسمية وتأهيل الموردين', nameEn: 'Official Gazette publication & prequalification', role: 'ROLE_CAPT', sla: '30d', status: 'QUEUED' }
    ]
  },
  {
    id: 4,
    nameAr: '4. فض العطاءات والدراسة الفنية',
    nameEn: '4. Bid Opening & Award',
    roleAr: 'النظم & لجنة الشراء',
    roleEn: 'Systems & Committee',
    slaTotal: '111d',
    tasks: [
      { nameAr: 'إقفال المناقصة وفض مظاريف العطاءات', nameEn: 'Tender closing & bid unsealing', role: 'ROLE_CAPT', sla: '90d', status: 'QUEUED' },
      { nameAr: 'دراسة العطاءات والتوصية بالترسية الفنية', nameEn: 'Technical evaluation & recommendation report', role: 'ROLE_SYSTEMS', sla: '14d', status: 'QUEUED' },
      { nameAr: 'موافقة لجنة الشراء والارتباط المالي', nameEn: 'Purchase committee award decision', role: 'ROLE_PURCHASE_COMMITTEE', sla: '7d', status: 'QUEUED' }
    ]
  },
  {
    id: 5,
    nameAr: '5. ديوان المحاسبة وتوقيع العقد 100%',
    nameEn: '5. Audit Bureau & Contract Execution',
    roleAr: 'ديوان المحاسبة & وكيل الوزارة',
    roleEn: 'Audit Bureau & Undersecretary',
    slaTotal: '52d',
    tasks: [
      { nameAr: 'موافقة ديوان المحاسبة المسبقة على التعاقد', nameEn: 'State Audit Bureau pre-contract approval', role: 'ROLE_AUDIT_BUREAU', sla: '30d', status: 'QUEUED' },
      { nameAr: 'استلام التأمين النهائي والأوراق الثبوتية من المناقص الفائز', nameEn: 'Final performance guarantee receipt', role: 'ROLE_WINNING_VENDOR', sla: '7d', status: 'QUEUED' },
      { nameAr: 'توقيع العقد النهائي 100% من سعادة وكيل الوزارة', nameEn: 'Final contract execution 100% by Undersecretary', role: 'ROLE_UNDERSECRETARY', sla: '7d', status: 'QUEUED' }
    ]
  }
];

let currentLang = 'ar';
let currentUser = null;
let currentWorkflowInstance = null;
let currentCheckoutSession = null;
let currentTourIndex = 0;
let journeyCurrentStageIndex = 2; // Default stage 3 (index 2) active

// Helper: API Fetch
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-Id': `web-${Date.now()}`
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Translate UI
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-label').innerText = lang === 'ar' ? 'English' : 'العربية';

  const dict = DICTIONARY[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  renderJourneyVisualizer();
  if (!document.getElementById('guided-tour-container').classList.contains('hidden')) {
    renderTourStep();
  }
}

// Render Tender Lifecycle Journey Visualizer
function renderJourneyVisualizer() {
  const isAr = currentLang === 'ar';
  const progressPercent = Math.round(((journeyCurrentStageIndex + 0.5) / JOURNEY_STAGES.length) * 100);

  // Update progress bar
  const percentBadge = document.getElementById('journey-percent-badge');
  const barFill = document.getElementById('journey-bar-fill');
  if (percentBadge && barFill) {
    percentBadge.innerText = `${progressPercent}% ${isAr ? 'مكتمل' : 'Completed'}`;
    barFill.style.width = `${progressPercent}%`;
  }

  // Render Stepper Nodes
  const stepperContainer = document.getElementById('journey-stepper-nodes');
  if (stepperContainer) {
    stepperContainer.innerHTML = JOURNEY_STAGES.map((stage, idx) => {
      let statusClass = 'queued';
      let iconContent = `${idx + 1}`;

      if (idx < journeyCurrentStageIndex) {
        statusClass = 'completed';
        iconContent = '✓';
      } else if (idx === journeyCurrentStageIndex) {
        statusClass = 'active';
        iconContent = `${idx + 1}`;
      }

      return `
        <div class="journey-step-node ${statusClass}" onclick="selectJourneyStage(${idx})">
          <div class="journey-node-icon">${iconContent}</div>
          <div class="journey-node-title">${isAr ? stage.nameAr : stage.nameEn}</div>
          <div class="journey-node-role">${isAr ? stage.roleAr : stage.roleEn}</div>
        </div>
      `;
    }).join('');
  }

  // Render Active Stage Tasks Breakdown
  renderStageDrilldown(journeyCurrentStageIndex);
}

function renderStageDrilldown(stageIndex) {
  const stage = JOURNEY_STAGES[stageIndex];
  const isAr = currentLang === 'ar';
  const container = document.getElementById('journey-stage-drilldown');
  if (!container) return;

  const isCurrentActive = stageIndex === journeyCurrentStageIndex;
  const isCompleted = stageIndex < journeyCurrentStageIndex;

  container.innerHTML = `
    <div class="journey-stage-detail-header">
      <div>
        <strong style="color:var(--primary); font-size:1.05rem;">
          ${isAr ? stage.nameAr : stage.nameEn}
        </strong>
        <p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">
          ${isAr ? 'الجهات الرقابية والمختصة:' : 'Responsible Entities:'} <strong>${isAr ? stage.roleAr : stage.roleEn}</strong> | SLA: <strong>${stage.slaTotal}</strong>
        </p>
      </div>
      <span class="badge ${isCompleted ? 'badge-success' : isCurrentActive ? 'badge-primary' : 'badge-outline'}">
        ${isCompleted ? (isAr ? 'مكتملة بالكامل ✓' : 'Fully Completed ✓') : isCurrentActive ? (isAr ? 'المرحلة الجارية الآن ⏳' : 'In Progress ⏳') : (isAr ? 'مجدولة لاحقاً' : 'Upcoming')}
      </span>
    </div>

    <div class="stage-tasks-grid">
      ${stage.tasks.map(t => {
        let taskStatus = t.status;
        if (isCompleted) taskStatus = 'APPROVED';
        else if (!isCurrentActive) taskStatus = 'QUEUED';

        const badgeClass = taskStatus === 'APPROVED' ? 'badge-success' : taskStatus === 'IN_REVIEW' ? 'badge-primary' : 'badge-outline';
        return `
          <div class="stage-task-item" style="${taskStatus === 'IN_REVIEW' ? 'border-color:var(--primary); box-shadow:var(--shadow-sm);' : ''}">
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span class="badge ${badgeClass}">${taskStatus}</span>
                <small class="text-muted">${t.sla}</small>
              </div>
              <strong style="font-size:0.88rem; color:var(--text-main);">${isAr ? t.nameAr : t.nameEn}</strong>
            </div>
            <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
              <small style="color:var(--text-muted);">Role: <code>${t.role}</code></small>
              ${taskStatus === 'IN_REVIEW' ? `
                <button class="btn btn-sm btn-primary" onclick="advanceJourneyDemo()">
                  ${isAr ? 'اعتماد ومتابعة ✓' : 'Approve & Advance ✓'}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.selectJourneyStage = function(stageIdx) {
  renderStageDrilldown(stageIdx);
};

window.advanceJourneyDemo = function() {
  if (journeyCurrentStageIndex < JOURNEY_STAGES.length - 1) {
    journeyCurrentStageIndex++;
    renderJourneyVisualizer();
    loadAuditLog();
    alert(currentLang === 'ar' ? '✓ تم اعتماد المرحلة وانتقال المناقصة إلى المرحلة التالية بنجاح!' : '✓ Stage approved! Tender advanced to next phase.');
  } else {
    alert(currentLang === 'ar' ? '🎉 تم إتمام كافة مراحل المناقصة وتوقيع العقد 100% بنجاح!' : '🎉 All stages completed! Contract executed 100%.');
  }
};

window.openTenderJourneyModal = function(tenderRef, tenderTitleEncoded) {
  const tenderTitle = unescape(tenderTitleEncoded);
  document.getElementById('modal-journey-tender-title').innerText = `🗺️ ${tenderTitle}`;
  document.getElementById('modal-journey-tender-ref').innerText = tenderRef;

  const content = document.getElementById('modal-journey-content');
  const isAr = currentLang === 'ar';

  content.innerHTML = `
    <div style="padding:0.5rem 0;">
      <div style="display:flex; justify-content:space-between; margin-bottom:1.25rem;">
        <div>
          <span class="badge badge-success">${isAr ? 'المرجع الرسمي:' : 'Ref:'} ${tenderRef}</span>
          <span class="badge badge-primary">${isAr ? 'مسار رقابي معتمد' : 'Regulatory Path'}</span>
        </div>
        <span class="badge badge-outline">SLA: 372 Days Total</span>
      </div>

      <div class="journey-pipeline-stepper" style="margin-bottom:1.5rem;">
        ${JOURNEY_STAGES.map((s, idx) => `
          <div class="journey-step-node ${idx <= 2 ? (idx < 2 ? 'completed' : 'active') : 'queued'}">
            <div class="journey-node-icon">${idx < 2 ? '✓' : idx + 1}</div>
            <div class="journey-node-title" style="font-size:0.75rem;">${isAr ? s.nameAr : s.nameEn}</div>
            <div class="journey-node-role">${isAr ? s.roleAr : s.roleEn}</div>
          </div>
        `).join('')}
      </div>

      <div class="panel-box" style="margin-bottom:0; background:var(--bg-card-subtle);">
        <h4 style="margin-bottom:0.75rem; color:var(--text-main); font-size:0.95rem;">
          ${isAr ? 'تفاصيل الموافقات الرقابية الحكومية المسجلة:' : 'Registered Regulatory Approval Milestones:'}
        </h4>
        <ul style="padding-right:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.8;">
          <li>✓ <strong>${isAr ? 'موافقة وزارة المالية:' : 'MoF Approval:'}</strong> تم اعتماد الميزانية التقديرية (180,000 د.ك).</li>
          <li>✓ <strong>${isAr ? 'موافقة الفتوى والتشريع:' : 'Fatwa & Legislation:'}</strong> تم تدقيق الصياغة القانونية وكراسة الشروط.</li>
          <li>⏳ <strong>${isAr ? 'الجهاز المركزي للمناقصات (CAPT):' : 'CAPT Central Agency:'}</strong> الإعلان في الجريدة الرسمية قيد النشر.</li>
          <li>◻️ <strong>${isAr ? 'ديوان المحاسبة:' : 'State Audit Bureau:'}</strong> الرقابة المسبقة قبل إبرام العقد.</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById('modal-tender-journey').classList.remove('hidden');
};

// Guided Tour Methods
function startGuidedTour() {
  currentTourIndex = 0;
  document.getElementById('guided-tour-container').classList.remove('hidden');
  renderTourStep();
}

function renderTourStep() {
  const stepData = TOUR_STEPS[currentTourIndex];
  const isAr = currentLang === 'ar';

  document.getElementById('tour-step-badge').innerText = isAr ? `الخطوة ${stepData.step} من ${TOUR_STEPS.length}` : `Step ${stepData.step} of ${TOUR_STEPS.length}`;
  document.getElementById('tour-step-title').innerText = isAr ? stepData.titleAr : stepData.titleEn;
  document.getElementById('tour-step-desc').innerText = isAr ? stepData.descAr : stepData.descEn;

  document.getElementById('btn-tour-prev').innerText = isAr ? 'السابق' : 'Previous';
  document.getElementById('btn-tour-next').innerText = currentTourIndex === TOUR_STEPS.length - 1 ? (isAr ? 'إنهاء الجولة' : 'Finish Tour') : (isAr ? 'التالي' : 'Next');

  document.getElementById('btn-tour-prev').style.visibility = currentTourIndex === 0 ? 'hidden' : 'visible';

  // Update dots
  const dotsContainer = document.getElementById('tour-dots');
  dotsContainer.innerHTML = TOUR_STEPS.map((_, idx) => `
    <span class="tour-dot ${idx === currentTourIndex ? 'active' : ''}"></span>
  `).join('');

  // Auto switch portal tab for relevant step
  if (stepData.targetPortal) {
    const tabBtn = document.querySelector(`[data-portal="${stepData.targetPortal}"]`);
    if (tabBtn && !tabBtn.classList.contains('active')) {
      tabBtn.click();
    }
  }
}

document.getElementById('btn-tour-next').addEventListener('click', () => {
  if (currentTourIndex < TOUR_STEPS.length - 1) {
    currentTourIndex++;
    renderTourStep();
  } else {
    document.getElementById('guided-tour-container').classList.add('hidden');
  }
});

document.getElementById('btn-tour-prev').addEventListener('click', () => {
  if (currentTourIndex > 0) {
    currentTourIndex--;
    renderTourStep();
  }
});

document.getElementById('btn-exit-tour').addEventListener('click', () => {
  document.getElementById('guided-tour-container').classList.add('hidden');
});

document.getElementById('btn-start-tour').addEventListener('click', () => {
  startGuidedTour();
});

// Render Notifications
async function loadNotifications() {
  if (!currentUser) return;
  try {
    const list = await apiCall(`/api/notifications?tenantId=tenant-moi&recipientRole=${currentUser.role}`);
    const badge = document.getElementById('unread-notif-count');
    const container = document.getElementById('notifications-list');

    const unread = list.filter(n => !n.read).length;
    badge.innerText = unread;

    if (list.length === 0) {
      container.innerHTML = `<div class="p-3 text-muted text-center" style="padding:1.5rem; text-align:center;">${currentLang === 'ar' ? 'لا توجد إشعارات حالية' : 'No notifications'}</div>`;
      return;
    }

    container.innerHTML = list.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong style="color:var(--text-main);">${currentLang === 'ar' ? (n.titleAr || n.title) : n.title}</strong>
          <small class="badge badge-outline">${n.notificationCode || ''}</small>
        </div>
        <p style="color:var(--text-secondary); font-size:0.82rem;">${currentLang === 'ar' ? (n.messageAr || n.message) : n.message}</p>
        ${!n.read ? `<button class="btn btn-sm btn-outline" onclick="markNotifRead('${n.id}')" style="margin-top:6px;">${currentLang === 'ar' ? 'تحديد كمقروء' : 'Mark Read'}</button>` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed loading notifications:', err);
  }
}

window.markNotifRead = async function(id) {
  await apiCall(`/api/notifications/${id}/read`, 'POST');
  loadNotifications();
};

// Render Workflow Board
async function loadWorkflowBoard(templateCode = 'PRACTICES') {
  const container = document.getElementById('workflow-board-container');
  try {
    if (!currentWorkflowInstance || currentWorkflowInstance.templateCode !== templateCode) {
      currentWorkflowInstance = await apiCall('/api/workflow/instances', 'POST', {
        templateCode,
        tenantId: 'tenant-moi',
        entityId: 'tnd-demo-01'
      });
    }

    // Group tasks by stage
    const stagesMap = new Map();
    currentWorkflowInstance.tasks.forEach(task => {
      const sName = currentLang === 'ar' ? (task.stageNameAr || task.stageName) : task.stageName;
      if (!stagesMap.has(sName)) stagesMap.set(sName, []);
      stagesMap.get(sName).push(task);
    });

    let html = '';
    stagesMap.forEach((tasks, stageName) => {
      html += `
        <div class="workflow-stage-column">
          <div class="stage-title-header">
            <span>${stageName}</span>
            <span class="badge badge-outline">${tasks.length} ${currentLang === 'ar' ? 'خطوات' : 'Tasks'}</span>
          </div>
          ${tasks.map(t => {
            const statusClass = t.status === 'APPROVED' ? 'badge-success' : t.status === 'IN_REVIEW' ? 'badge-primary' : t.status === 'CORRECTION_REQUIRED' ? 'badge-info' : 'badge-outline';
            return `
              <div class="workflow-task-card">
                <div class="task-badge-row">
                  <span class="badge ${statusClass}">${t.status}</span>
                  <small class="text-muted">SLA: ${t.slaDays}d (${(t.weight * 100).toFixed(0)}%)</small>
                </div>
                <div class="task-title">${currentLang === 'ar' ? (t.nameAr || t.name) : t.name}</div>
                <small class="text-muted">Role: <code>${t.ownerRole}</code></small>
                ${t.status !== 'APPROVED' ? `
                  <div class="task-actions">
                    <button class="btn btn-sm btn-primary" onclick="transitionWorkflowTask('${t.id}', 'APPROVE')">${currentLang === 'ar' ? 'اعتماد ✓' : 'Approve ✓'}</button>
                    <button class="btn btn-sm btn-secondary" onclick="transitionWorkflowTask('${t.id}', 'REQUEST_CORRECTION')">${currentLang === 'ar' ? 'طلب استيفاء' : 'Correction'}</button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Failed to load workflow:', err);
  }
}

window.transitionWorkflowTask = async function(taskId, action) {
  try {
    await apiCall(`/api/workflow/tasks/${taskId}/transition`, 'POST', {
      action,
      actorId: currentUser.id,
      role: currentUser.role,
      comment: action === 'APPROVE' ? 'Approved in live demo' : 'Correction required on specs'
    });
    // Reload instance
    currentWorkflowInstance = await apiCall(`/api/workflow/instances/${currentWorkflowInstance.id}`);
    loadWorkflowBoard(currentWorkflowInstance.templateCode);
    loadAuditLog();
    loadNotifications();
  } catch (err) {
    alert('Workflow transition error: ' + err.message);
  }
};

// Render Staff Tenders Table
async function loadStaffTenders() {
  const tbody = document.getElementById('staff-tenders-tbody');
  try {
    const list = await apiCall('/api/tenders?tenantId=tenant-moi');
    document.getElementById('kpi-published-tenders').innerText = list.length;

    tbody.innerHTML = list.map(t => `
      <tr>
        <td><strong>${t.referenceNumber || t.id}</strong></td>
        <td>${currentLang === 'ar' ? (t.titleAr || t.title) : t.title}</td>
        <td>${(t.activities || []).map(a => `<span class="badge badge-outline">${a}</span>`).join(' ')}</td>
        <td><span class="badge badge-primary">${t.gradeRule} (${t.gradeMatchMode})</span></td>
        <td><strong>${t.priceKwd} KWD</strong></td>
        <td><span class="badge badge-success">${t.status}</span></td>
        <td style="display:flex; gap:0.4rem; flex-wrap:wrap;">
          <button class="btn btn-sm btn-secondary" onclick="openTenderJourneyModal('${t.referenceNumber}', '${escape(t.title)}')">
            ${currentLang === 'ar' ? '🗺️ مسار المناقصة' : '🗺️ Journey'}
          </button>
          <button class="btn btn-sm btn-outline" onclick="viewTenderDoc('${t.id}', '${escape(t.title)}')">
            ${currentLang === 'ar' ? '🔒 الكراسة' : '🔒 Specs'}
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed loading staff tenders:', err);
  }
}

// Render Vendor Eligible Tenders
async function loadVendorTenders() {
  const grid = document.getElementById('vendor-tenders-grid');
  try {
    const list = await apiCall('/api/tenders?tenantId=tenant-moi');
    const vendorId = currentUser.vendorId || 'vnd-default';

    const cardsHtml = await Promise.all(list.map(async t => {
      const elig = await apiCall(`/api/tenders/${t.id}/eligibility?vendorId=${vendorId}`);
      const isEligible = elig.eligible;

      return `
        <div class="tender-vendor-card ${isEligible ? 'eligible' : 'ineligible'}">
          <div class="tender-card-header">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="badge badge-outline">${t.referenceNumber}</span>
              <span class="badge ${isEligible ? 'badge-success' : 'badge-danger'}">
                ${isEligible ? (currentLang === 'ar' ? 'مؤهل للشراء ✓' : 'Eligible ✓') : (currentLang === 'ar' ? 'غير مؤهل ✕' : 'Not Eligible ✕')}
              </span>
            </div>
            <h4>${currentLang === 'ar' ? (t.titleAr || t.title) : t.title}</h4>
          </div>

          <div class="tender-meta-tags">
            <span class="badge badge-primary">${currentLang === 'ar' ? 'الدرجة المطلوبة:' : 'Req Grade:'} ${t.gradeRule}</span>
            <span class="badge badge-outline">${(t.activities || []).join(', ')}</span>
            <span class="badge badge-info">${t.priceKwd} KWD</span>
          </div>

          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
            ${isEligible ? (currentLang === 'ar' ? 'جميع معايير التأهيل والتصنيف مستوفاة.' : 'Qualification and activity criteria fully met.') : elig.reasons.join(' | ')}
          </p>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="openTenderJourneyModal('${t.referenceNumber}', '${escape(t.title)}')">
              ${currentLang === 'ar' ? '🗺️ مراحل الطرح' : '🗺️ Journey'}
            </button>
            <button class="btn btn-sm btn-outline" onclick="viewTenderDoc('${t.id}', '${escape(t.title)}')">
              ${currentLang === 'ar' ? '🔒 معاينة الكراسة' : '🔒 Secure View'}
            </button>
            ${isEligible ? `
              <button class="btn btn-sm btn-success" onclick="startKnetCheckout('${t.id}', ${t.priceKwd}, '${escape(t.title)}')">
                ${currentLang === 'ar' ? '💳 شراء عبر KNET' : '💳 Buy via KNET'}
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }));

    grid.innerHTML = cardsHtml.join('');
  } catch (err) {
    console.error('Failed loading vendor tenders:', err);
  }
}

// Anti-Screenshot Protected Canvas Watermarking
window.viewTenderDoc = async function(tenderId, titleEncoded) {
  const title = unescape(titleEncoded);
  document.getElementById('doc-viewer-title').innerText = title;

  const modal = document.getElementById('modal-doc-viewer');
  modal.classList.remove('hidden');

  const canvas = document.getElementById('watermark-canvas');
  const ctx = canvas.getContext('2d');
  const wrap = document.getElementById('document-canvas-wrap');

  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;

  // Dynamic watermark text
  const vendorName = currentUser.companyName || currentUser.name || 'Official Vendor';
  const stampText = `CONFIDENTIAL — MOI TENDER — ${vendorName} — ${new Date().toLocaleTimeString()} — IP: 192.168.1.104`;
  document.getElementById('doc-watermark-stamp').innerText = stampText;

  // Draw angled watermark grid on Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.font = 'bold 15px Cairo, sans-serif';
  ctx.fillStyle = 'rgba(220, 38, 38, 0.16)'; // Crisp Translucent Red security stamp

  for (let x = -300; x < canvas.width + 400; x += 320) {
    for (let y = -200; y < canvas.height + 400; y += 120) {
      ctx.fillText(stampText, x, y);
    }
  }
  ctx.restore();
};

// KNET Payment Flow
window.startKnetCheckout = async function(tenderId, amountKwd, titleEncoded) {
  try {
    currentCheckoutSession = await apiCall('/api/payments/checkout', 'POST', {
      tenantId: 'tenant-moi',
      vendorId: currentUser.vendorId || 'vnd-101',
      vendorName: currentUser.companyName || 'Al-Kharafi Technologies',
      paymentType: 'TENDER_PURCHASE',
      tenderId,
      amountKwd
    });

    document.getElementById('knet-pay-amount').innerText = `${amountKwd}.000 KWD`;
    document.getElementById('modal-knet-checkout').classList.remove('hidden');
  } catch (err) {
    alert('Failed to initiate KNET session: ' + err.message);
  }
};

document.getElementById('btn-confirm-knet-pay').addEventListener('click', async () => {
  if (!currentCheckoutSession) return;
  try {
    const res = await apiCall('/api/payments/knet/callback', 'POST', {
      paymentId: currentCheckoutSession.paymentId,
      trackId: currentCheckoutSession.trackId,
      result: 'CAPTURED'
    });

    document.getElementById('modal-knet-checkout').classList.add('hidden');

    if (res.receipt) {
      showReceiptModal(res.receipt);
      loadVendorReceipts();
      loadAuditLog();
    }
  } catch (err) {
    alert('Payment processing error: ' + err.message);
  }
});

function showReceiptModal(receipt) {
  document.getElementById('rec-number').innerText = receipt.receiptNumber;
  document.getElementById('rec-date').innerText = new Date(receipt.issuedAt).toLocaleString();
  document.getElementById('rec-vendor').innerText = receipt.vendorName;
  document.getElementById('rec-amount').innerText = `${receipt.amountKwd}.000 KWD`;
  document.getElementById('rec-knet-ref').innerText = receipt.knetReferenceNo;
  document.getElementById('rec-auth-code').innerText = receipt.knetAuthCode;

  document.getElementById('modal-receipt-view').classList.remove('hidden');
}

async function loadVendorReceipts() {
  const tbody = document.getElementById('vendor-receipts-tbody');
  try {
    const events = await apiCall('/api/audit/events?tenantId=tenant-moi');
    const paymentEvents = events.filter(e => e.action === 'PAYMENT_CAPTURED_AND_RECEIPT_ISSUED');

    tbody.innerHTML = paymentEvents.map(e => `
      <tr>
        <td><strong>${e.details.receiptNumber}</strong></td>
        <td>Ministry Core IT Infrastructure</td>
        <td><strong>${e.details.amount}.000 KWD</strong></td>
        <td>${new Date(e.timestamp).toLocaleDateString()}</td>
        <td><code>REF-${e.entityId.slice(0, 8)}</code></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="alert('Viewing receipt ${e.details.receiptNumber}')">
            ${currentLang === 'ar' ? 'عرض الإيصال' : 'View Receipt'}
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed loading receipts:', err);
  }
}

// Admin Governance
async function loadAdminVendors() {
  const tbody = document.getElementById('admin-vendors-tbody');
  try {
    const vendors = await apiCall('/api/vendors');
    tbody.innerHTML = vendors.map(v => `
      <tr>
        <td><strong>${currentLang === 'ar' ? v.companyNameAr : v.companyName}</strong></td>
        <td><code>${v.commercialRegistrationNo}</code></td>
        <td><span class="badge badge-primary">${v.grade} Grade</span></td>
        <td>${(v.activities || []).map(a => `<span class="badge badge-outline">${a}</span>`).join(' ')}</td>
        <td>
          <span class="badge ${v.status === 'ACTIVE' ? 'badge-success' : v.status === 'SUSPENDED' ? 'badge-warning' : 'badge-danger'}">
            ${v.status}
          </span>
        </td>
        <td>
          ${v.status === 'ACTIVE' ? `
            <button class="btn btn-sm btn-danger" onclick="blockVendorPrompt('${v.id}')">${currentLang === 'ar' ? 'إيقاف مؤقت' : 'Suspend'}</button>
          ` : `
            <button class="btn btn-sm btn-success" onclick="unblockVendor('${v.id}')">${currentLang === 'ar' ? 'إلغاء الإيقاف' : 'Unblock'}</button>
          `}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed loading admin vendors:', err);
  }
}

window.blockVendorPrompt = async function(vendorId) {
  const reason = prompt(currentLang === 'ar' ? 'سبب الإيقاف المؤقت للمورد:' : 'Suspension reason:', 'Commercial compliance audit required');
  if (!reason) return;
  await apiCall(`/api/vendors/${vendorId}/block`, 'POST', { reason, isPermanent: false, durationDays: 30 });
  loadAdminVendors();
  loadAuditLog();
};

window.unblockVendor = async function(vendorId) {
  await apiCall(`/api/vendors/${vendorId}/unblock`, 'POST');
  loadAdminVendors();
  loadAuditLog();
};

// Audit Explorer
async function loadAuditLog() {
  const viewer = document.getElementById('audit-log-viewer');
  try {
    const events = await apiCall('/api/audit/events?tenantId=tenant-moi');
    viewer.innerHTML = events.slice(-10).reverse().map(e => `
      <div style="background:var(--bg-card-subtle); border:1px solid var(--border-color); border-radius:6px; padding:10px 14px; margin-bottom:8px; font-size:0.85rem;">
        <div style="display:flex; justify-content:space-between;">
          <strong style="color:var(--primary); font-weight:800;">${e.action}</strong>
          <small class="text-muted">${new Date(e.timestamp).toLocaleTimeString()}</small>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); margin:4px 0;">
          Actor: <code>${e.actorRole} (${e.actorId})</code> | Entity: <code>${e.entityType}:${e.entityId}</code>
        </div>
        <div style="font-family:monospace; font-size:0.72rem; color:var(--success);">
          SHA256: ${e.hash.slice(0, 32)}... (Prev: ${e.previousHash.slice(0, 16)}...)
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed loading audit log:', err);
  }
}

document.getElementById('btn-verify-audit-chain').addEventListener('click', async () => {
  try {
    const res = await apiCall('/api/audit/verify');
    if (res.valid) {
      alert(currentLang === 'ar' ? `✓ تم التحقق بنجاح! سلسلة سجل التدقيق سليمة 100% ولا توجد أي محاولات تعديل (${res.totalEvents} حدث موثق).` : `✓ Audit chain verified! All ${res.totalEvents} events are 100% tamper-free.`);
    } else {
      alert(`⚠️ Audit integrity failure at index ${res.brokenAtIndex}: ${res.reason}`);
    }
  } catch (err) {
    alert('Verification error: ' + err.message);
  }
});

document.getElementById('btn-export-audit').addEventListener('click', async () => {
  const pkg = await apiCall('/api/audit/export?tenantId=tenant-moi');
  const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kbm-audit-export-${Date.now()}.json`;
  a.click();
});

// Marketplace Simulator
document.getElementById('btn-resolve-token').addEventListener('click', async () => {
  const token = document.getElementById('marketplace-input-token').value;
  try {
    const res = await apiCall('/api/marketplace/resolve', 'POST', { token });
    document.getElementById('marketplace-output').innerText = JSON.stringify(res, null, 2);
  } catch (err) {
    document.getElementById('marketplace-output').innerText = 'Error: ' + err.message;
  }
});

document.getElementById('btn-activate-subscription').addEventListener('click', async () => {
  try {
    const res = await apiCall('/api/marketplace/activate', 'POST', {
      subscriptionId: 'sub-moi-kuwait-prod',
      planId: 'kbm-professional',
      tenantName: 'State of Kuwait - Ministry of Interior',
      adminEmail: 'admin@moi.gov.kw'
    });
    document.getElementById('marketplace-output').innerText = '✓ ACTIVATED:\n' + JSON.stringify(res, null, 2);
    loadAuditLog();
  } catch (err) {
    document.getElementById('marketplace-output').innerText = 'Error: ' + err.message;
  }
});

document.getElementById('btn-sim-webhook').addEventListener('click', async () => {
  try {
    const res = await apiCall('/api/marketplace/webhook', 'POST', {
      action: 'ChangePlan',
      subscriptionId: 'sub-moi-kuwait-prod',
      planId: 'kbm-enterprise'
    });
    document.getElementById('marketplace-output').innerText = '✓ WEBHOOK PROCESSED (Upgraded to Enterprise):\n' + JSON.stringify(res, null, 2);
  } catch (err) {
    document.getElementById('marketplace-output').innerText = 'Error: ' + err.message;
  }
});

// Request Intake Form Modal
document.getElementById('btn-open-request-modal').addEventListener('click', () => {
  document.getElementById('modal-request-intake').classList.remove('hidden');
});

document.getElementById('form-request-intake').addEventListener('submit', async (e) => {
  e.preventDefault();
  const channel = document.getElementById('req-channel').value;
  const dept = document.getElementById('req-dept').value;
  const title = document.getElementById('req-title').value;
  const budget = document.getElementById('req-budget').value;

  try {
    await apiCall('/api/requests', 'POST', {
      tenantId: 'tenant-moi',
      channel,
      title,
      requestingDepartment: dept,
      gmLetterAttachmentId: 'doc-gm-scan-auto-attached.pdf',
      estimatedBudgetKwd: Number(budget)
    });

    document.getElementById('modal-request-intake').classList.add('hidden');
    alert(currentLang === 'ar' ? '✓ تم تسجيل طلب المناقصة بنجاح وبدء دورة مسار العمل.' : '✓ Request submitted successfully!');
    loadWorkflowBoard();
    renderJourneyVisualizer();
    loadAuditLog();
    loadNotifications();
  } catch (err) {
    alert('Intake error: ' + err.message);
  }
});

// Tender Creation Form Modal
document.getElementById('btn-open-tender-modal').addEventListener('click', () => {
  document.getElementById('modal-create-tender').classList.remove('hidden');
});

document.getElementById('form-create-tender').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('tender-title').value;
  const activity = document.getElementById('tender-activity').value;
  const grade = document.getElementById('tender-grade').value;
  const price = document.getElementById('tender-price').value;

  try {
    await apiCall('/api/tenders', 'POST', {
      tenantId: 'tenant-moi',
      title,
      activities: [activity],
      gradeRule: grade,
      gradeMatchMode: 'GRADE_AND_ABOVE',
      priceKwd: Number(price)
    });

    document.getElementById('modal-create-tender').classList.add('hidden');
    alert(currentLang === 'ar' ? '✓ تم طرح المناقصة وتفعيل فلاتر الأهلية للموردين.' : '✓ Tender published successfully!');
    loadStaffTenders();
    loadVendorTenders();
    renderJourneyVisualizer();
    loadAuditLog();
  } catch (err) {
    alert('Tender publish error: ' + err.message);
  }
});

// Close Modals
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-close');
    document.getElementById(targetId).classList.add('hidden');
  });
});

// Tabs Switching
document.querySelectorAll('.portal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.portal-section').forEach(s => s.classList.remove('active'));

    tab.classList.add('active');
    const portal = tab.getAttribute('data-portal');
    document.getElementById(`portal-${portal}`).classList.add('active');

    if (portal === 'staff') {
      renderJourneyVisualizer();
      loadWorkflowBoard();
      loadStaffTenders();
    } else if (portal === 'vendor') {
      loadVendorTenders();
      loadVendorReceipts();
    } else if (portal === 'admin') {
      loadAdminVendors();
      loadAuditLog();
    }
  });
});

// Notification Toggle
document.getElementById('btn-toggle-notifs').addEventListener('click', () => {
  const panel = document.getElementById('notifications-panel');
  panel.classList.toggle('hidden');
});
document.getElementById('btn-close-notifs').addEventListener('click', () => {
  document.getElementById('notifications-panel').classList.add('hidden');
});

// Language Toggle
document.getElementById('lang-toggle-btn').addEventListener('click', () => {
  setLanguage(currentLang === 'ar' ? 'en' : 'ar');
});

// Login Handlers
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  performLogin(email, password);
});

document.querySelectorAll('.persona-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const email = btn.getAttribute('data-email');
    document.getElementById('login-email').value = email;
    performLogin(email, 'password123');
  });
});

async function performLogin(email, password) {
  const statusEl = document.getElementById('login-status');
  statusEl.innerText = currentLang === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...';

  try {
    const res = await apiCall('/api/auth/login', 'POST', { email, password });
    currentUser = res.user;

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    document.getElementById('auth-controls').classList.remove('hidden');

    document.getElementById('nav-user-name').innerText = currentUser.name;
    document.getElementById('nav-user-role').innerText = currentUser.role;

    loadNotifications();

    // Role-based Portal Tabs Visibility Customization
    const roleNorm = String(currentUser.role).toLowerCase();
    const staffTab = document.querySelector('[data-portal="staff"]');
    const vendorTab = document.querySelector('[data-portal="vendor"]');
    const adminTab = document.querySelector('[data-portal="admin"]');
    const mktTab = document.querySelector('[data-portal="marketplace"]');

    if (roleNorm === 'vendor') {
      // Vendor sees only Vendor Portal and Marketplace info
      if (staffTab) staffTab.style.display = 'none';
      if (adminTab) adminTab.style.display = 'none';
      if (vendorTab) { vendorTab.style.display = 'inline-flex'; vendorTab.click(); }
      if (mktTab) mktTab.style.display = 'none';
    } else if (roleNorm === 'tenant-admin' || roleNorm === 'admin') {
      // Admin sees Admin Governance and Staff oversight
      if (staffTab) staffTab.style.display = 'inline-flex';
      if (adminTab) { adminTab.style.display = 'inline-flex'; adminTab.click(); }
      if (vendorTab) vendorTab.style.display = 'inline-flex';
      if (mktTab) mktTab.style.display = 'inline-flex';
    } else {
      // Staff sees Staff portal and Vendor preview
      if (staffTab) { staffTab.style.display = 'inline-flex'; staffTab.click(); }
      if (adminTab) adminTab.style.display = 'none';
      if (vendorTab) vendorTab.style.display = 'inline-flex';
      if (mktTab) mktTab.style.display = 'none';
    }

    renderJourneyVisualizer();

    // Auto-launch guided tour on login
    setTimeout(() => {
      startGuidedTour();
    }, 400);

  } catch (err) {
    statusEl.innerText = 'Login failed: ' + err.message;
  }
}

document.getElementById('logout-button').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('auth-controls').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-status').innerText = '';
  document.getElementById('guided-tour-container').classList.add('hidden');
});

// Template Selector
document.getElementById('select-workflow-template').addEventListener('change', (e) => {
  loadWorkflowBoard(e.target.value);
});

// Journey Selector
document.getElementById('journey-tender-select').addEventListener('change', (e) => {
  if (e.target.value === 'tnd-002') {
    journeyCurrentStageIndex = 1;
  } else {
    journeyCurrentStageIndex = 2;
  }
  renderJourneyVisualizer();
});

// Marketplace link on login page
document.getElementById('link-marketplace-preview').addEventListener('click', (e) => {
  e.preventDefault();
  performLogin('tenant-admin@kbm.demo', 'password123').then(() => {
    document.querySelector('[data-portal="marketplace"]').click();
  });
});

// Initialization
setLanguage('ar');

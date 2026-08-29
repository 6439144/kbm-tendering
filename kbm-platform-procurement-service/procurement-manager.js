/**
 * KBM Platform — Procurement Service
 * Handles tender request intake (Raslni & Manual GM Letter),
 * tender publication, multi-activity targeting, and server-side eligibility checks.
 */

const crypto = require('crypto');

const GRADE_RANKS = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3
};

class ProcurementManager {
  constructor() {
    this.requests = new Map();
    this.tenders = new Map();
  }

  submitRequest({
    tenantId,
    channel, // 'raslni' or 'manual_gm_letter'
    title,
    titleAr,
    requestingDepartment,
    requestingDepartmentAr,
    gmLetterReference = null,
    gmLetterAttachmentId = null,
    raslniMessageId = null,
    estimatedBudgetKwd = 0
  }) {
    if (channel === 'manual_gm_letter' && !gmLetterAttachmentId) {
      throw new Error('Mandatory scanned GM letter attachment is required for manual request intake');
    }

    const requestId = `req-${crypto.randomUUID().slice(0, 8)}`;
    const request = {
      id: requestId,
      tenantId,
      channel,
      title,
      titleAr: titleAr || title,
      requestingDepartment,
      requestingDepartmentAr: requestingDepartmentAr || requestingDepartment,
      gmLetterReference,
      gmLetterAttachmentId,
      raslniMessageId,
      estimatedBudgetKwd,
      status: 'SUBMITTED', // SUBMITTED, IN_APPROVAL, APPROVED, REJECTED, TENDER_CREATED
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.requests.set(requestId, request);
    return request;
  }

  createTender({
    tenantId,
    requestId = null,
    referenceNumber,
    title,
    titleAr,
    description = '',
    descriptionAr = '',
    activities = [], // Array of MoCI activity codes
    gradeRule = 'SECOND', // Target grade: 'FIRST', 'SECOND', 'THIRD', or 'ANY'
    gradeMatchMode = 'GRADE_AND_ABOVE', // 'EXACT_GRADE' or 'GRADE_AND_ABOVE'
    priceKwd = 75,
    submissionDeadline = null,
    requestingDepartment = 'Information Systems Center',
    requestingDepartmentAr = 'إدارة مركز نظم المعلومات',
    sourcingType = 'PUBLIC_TENDER',
    closingDate = null
  }) {
    if (!title || !activities.length) {
      throw new Error('Tender requires title and at least one target activity');
    }

    const tenderId = `tnd-${crypto.randomUUID().slice(0, 8)}`;
    const tender = {
      id: tenderId,
      tenantId,
      requestId,
      referenceNumber: referenceNumber || `MOI/TNT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      titleAr: titleAr || title,
      description,
      descriptionAr: descriptionAr || description,
      requestingDepartment,
      requestingDepartmentAr: requestingDepartmentAr || requestingDepartment,
      sourcingType,
      activities,
      gradeRule,
      gradeMatchMode,
      priceKwd,
      closingDate: closingDate || submissionDeadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      submissionDeadline: submissionDeadline || closingDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'PUBLISHED', // DRAFT, PUBLISHED, CLOSED, AWARDED
      createdAt: new Date().toISOString()
    };

    this.tenders.set(tenderId, tender);
    return tender;
  }

  getTender(tenderId) {
    return this.tenders.get(tenderId);
  }

  listTenders({ tenantId, vendor = null }) {
    const list = Array.from(this.tenders.values()).filter(t => t.tenantId === tenantId);
    if (!vendor) return list;

    // Filter server-side for vendor
    return list.filter(tender => this.evaluateEligibility(tender, vendor).eligible);
  }

  evaluateEligibility(tender, vendor) {
    if (!vendor) {
      return { eligible: false, reasons: ['Vendor not authenticated'] };
    }

    if (vendor.status === 'BANNED' || vendor.status === 'SUSPENDED') {
      return {
        eligible: false,
        reasons: [`Vendor is currently ${vendor.status.toLowerCase()}: ${vendor.blockReason || 'Account restricted'}`]
      };
    }

    const reasons = [];

    // 1. Activity overlap check
    const matchedActivities = (tender.activities || []).filter(act => (vendor.activities || []).includes(act));
    if (matchedActivities.length === 0) {
      reasons.push('No matching Ministry of Commerce activity codes');
    }

    // 2. Grade check
    const vendorRank = GRADE_RANKS[vendor.grade] || 99;
    const requiredRank = GRADE_RANKS[tender.gradeRule] || 99;

    let gradePassed = false;
    if (tender.gradeRule === 'ANY') {
      gradePassed = true;
    } else if (tender.gradeMatchMode === 'EXACT_GRADE') {
      gradePassed = vendor.grade === tender.gradeRule;
      if (!gradePassed) reasons.push(`Requires exact ${tender.gradeRule} (vendor has ${vendor.grade})`);
    } else {
      // GRADE_AND_ABOVE (Rank 1 is highest, Rank 3 is lowest)
      gradePassed = vendorRank <= requiredRank;
      if (!gradePassed) reasons.push(`Requires ${tender.gradeRule} or above (vendor has ${vendor.grade})`);
    }

    const eligible = matchedActivities.length > 0 && gradePassed;
    return {
      eligible,
      reasons,
      vendorGrade: vendor.grade,
      requiredGrade: tender.gradeRule,
      gradeMatchMode: tender.gradeMatchMode,
      matchedActivities
    };
  }
}

module.exports = {
  ProcurementManager
};


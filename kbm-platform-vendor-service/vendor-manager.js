/**
 * KBM Platform — Vendor Service
 * Handles vendor lifecycle, qualification dossiers, 3-grade hierarchy,
 * annual subscription state, suspensions/bans, and fee exemptions.
 */

const crypto = require('crypto');

const VENDOR_GRADES = {
  FIRST: { rank: 1, name: 'First Grade', nameAr: 'الدرجة الأولى' },
  SECOND: { rank: 2, name: 'Second Grade', nameAr: 'الدرجة الثانية' },
  THIRD: { rank: 3, name: 'Third Grade', nameAr: 'الدرجة الثالثة' }
};

class VendorManager {
  constructor() {
    this.vendors = new Map();
    this.upgradeRequests = new Map();
  }

  registerVendor({
    tenantId,
    companyName,
    companyNameAr,
    commercialRegistrationNo,
    email,
    activities = [],
    initialGrade = 'THIRD',
    documents = []
  }) {
    if (!companyName || !commercialRegistrationNo || !email) {
      throw new Error('Missing mandatory vendor registration fields');
    }

    const vendorId = `vnd-${crypto.randomUUID().slice(0, 8)}`;
    const grade = VENDOR_GRADES[initialGrade] ? initialGrade : 'THIRD';

    const vendor = {
      id: vendorId,
      tenantId,
      companyName,
      companyNameAr: companyNameAr || companyName,
      commercialRegistrationNo,
      email,
      activities, // MoCI activity codes
      grade,
      status: 'PENDING_APPROVAL', // PENDING_APPROVAL, ACTIVE, SUSPENDED, BANNED
      subscriptionStatus: 'UNPAID', // UNPAID, ACTIVE, EXPIRED
      subscriptionExpiresAt: null,
      exemptFromFees: false,
      blockReason: null,
      blockExpiresAt: null,
      documents, // Array of document IDs
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.vendors.set(vendorId, vendor);
    return vendor;
  }

  getVendor(vendorId) {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return null;

    // Check automatic reinstatement for date-range blocks
    if (vendor.status === 'SUSPENDED' && vendor.blockExpiresAt) {
      const expiry = new Date(vendor.blockExpiresAt);
      if (expiry <= new Date()) {
        vendor.status = 'ACTIVE';
        vendor.blockReason = null;
        vendor.blockExpiresAt = null;
        vendor.updatedAt = new Date().toISOString();
      }
    }

    return vendor;
  }

  assignGrade(vendorId, grade, gradingAuthorityActorId) {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);
    if (!VENDOR_GRADES[grade]) throw new Error(`Invalid grade: ${grade}`);

    vendor.grade = grade;
    vendor.status = 'ACTIVE';
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }

  requestGradeUpgrade(vendorId, requestedGrade, supportingDocuments = []) {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);
    if (!VENDOR_GRADES[requestedGrade]) throw new Error(`Invalid requested grade: ${requestedGrade}`);

    const requestId = `upg-${crypto.randomUUID().slice(0, 8)}`;
    const request = {
      id: requestId,
      vendorId,
      tenantId: vendor.tenantId,
      currentGrade: vendor.grade,
      requestedGrade,
      supportingDocuments,
      status: 'PENDING', // PENDING, APPROVED, REJECTED
      createdAt: new Date().toISOString()
    };

    this.upgradeRequests.set(requestId, request);
    return request;
  }

  processGradeUpgrade(requestId, decision, approverActorId, reason = '') {
    const req = this.upgradeRequests.get(requestId);
    if (!req) throw new Error(`Upgrade request ${requestId} not found`);

    req.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    req.approverActorId = approverActorId;
    req.decisionReason = reason;
    req.decidedAt = new Date().toISOString();

    if (decision === 'APPROVE') {
      const vendor = this.vendors.get(req.vendorId);
      if (vendor) {
        vendor.grade = req.requestedGrade;
        vendor.updatedAt = new Date().toISOString();
      }
    }

    return req;
  }

  blockVendor(vendorId, { reason, isPermanent = false, durationDays = 30 }) {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    vendor.status = isPermanent ? 'BANNED' : 'SUSPENDED';
    vendor.blockReason = reason;
    if (!isPermanent) {
      const expires = new Date();
      expires.setDate(expires.getDate() + durationDays);
      vendor.blockExpiresAt = expires.toISOString();
    } else {
      vendor.blockExpiresAt = null;
    }
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }

  unblockVendor(vendorId) {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    vendor.status = 'ACTIVE';
    vendor.blockReason = null;
    vendor.blockExpiresAt = null;
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }

  setFeeExemption(vendorId, isExempt = true, exemptionReason = '') {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    vendor.exemptFromFees = isExempt;
    vendor.exemptionReason = exemptionReason;
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }

  activateAnnualSubscription(vendorId) {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    vendor.subscriptionStatus = 'ACTIVE';
    vendor.subscriptionExpiresAt = expiresAt.toISOString();
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }
}

module.exports = {
  VendorManager,
  VENDOR_GRADES
};


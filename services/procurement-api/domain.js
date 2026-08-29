const gradeOrder = { Third: 1, Second: 2, First: 3 };

function evaluateVendorEligibility(vendor, tender) {
  if (!vendor || !tender) return false;
  if (vendor.tenantId !== tender.tenantId) return false;
  if (vendor.blocked || vendor.status !== 'approved') return false;
  if (!Array.isArray(vendor.activities) || !Array.isArray(tender.activities)) return false;

  const activityMatch = tender.activities.some(activity => vendor.activities.includes(activity));
  if (!activityMatch) return false;

  const tenderRequiredGrade = tender.gradeRequired || 'Third';
  const vendorGradeValue = gradeOrder[vendor.grade] || 0;
  const tenderGradeValue = gradeOrder[tenderRequiredGrade] || 0;

  if (tender.gradeRule === 'grade-and-above') {
    return vendorGradeValue >= tenderGradeValue;
  }

  return vendorGradeValue === tenderGradeValue;
}

function createReceipt({ tenantId, vendorId, tenderId, amount, currency = 'SAR' }) {
  const timestamp = new Date().toISOString();
  return {
    receiptNumber: `KBN-${tenantId}-${Date.now()}`,
    tenantId,
    vendorId,
    tenderId,
    amount,
    currency,
    issuedAt: timestamp,
    status: 'paid',
    printable: true
  };
}

module.exports = {
  gradeOrder,
  evaluateVendorEligibility,
  createReceipt
};

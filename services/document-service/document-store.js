function createDocument({ id, tenantId, ownerId, fileName, category = 'general', visibility = 'tenant', watermark = 'KBM Demo', status = 'approved' }) {
  return {
    id: id || `doc-${Date.now()}`,
    tenantId,
    ownerId,
    fileName,
    category,
    visibility,
    watermark,
    status,
    uploadedAt: new Date().toISOString(),
    version: 1
  };
}

function canAccessDocument(user, document) {
  if (!user || !document) return false;
  if (user.tenantId !== document.tenantId) return false;

  if (user.roles?.some(role => ['staff', 'tenant-admin'].includes(String(role).trim().toLowerCase()))) {
    return true;
  }

  if (user.roles?.includes('vendor') || user.roles?.some(role => String(role).trim().toLowerCase() === 'vendor')) {
    return document.ownerId === user.userId;
  }

  return false;
}

module.exports = {
  createDocument,
  canAccessDocument
};

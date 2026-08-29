/**
 * KBM Platform — Document Service
 * Manages document registration, checksums, MIME validation,
 * tokenized access, and anti-screenshot watermarking metadata.
 */

const crypto = require('crypto');

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

class DocumentManager {
  constructor() {
    this.documents = new Map();
  }

  registerDocument({
    tenantId,
    ownerId, // vendorId or staffId
    ownerType = 'STAFF', // 'STAFF' or 'VENDOR'
    filename,
    mimeType = 'application/pdf',
    sizeBytes = 1024,
    contentHash = null,
    classification = 'CONFIDENTIAL',
    watermarkingRequired = true
  }) {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    const docId = `doc-${crypto.randomUUID().slice(0, 8)}`;
    const hash = contentHash || crypto.createHash('sha256').update(filename + Date.now()).digest('hex');

    const document = {
      id: docId,
      tenantId,
      ownerId,
      ownerType,
      filename,
      mimeType,
      sizeBytes,
      sha256Checksum: hash,
      classification,
      watermarkingRequired,
      uploadedAt: new Date().toISOString()
    };

    this.documents.set(docId, document);
    return document;
  }

  getDocument(docId) {
    return this.documents.get(docId);
  }

  authorizeAccess(docId, requestingUser) {
    const doc = this.documents.get(docId);
    if (!doc) return { authorized: false, reason: 'Document not found' };

    // Tenant boundary check
    if (doc.tenantId !== requestingUser.tenantId) {
      return { authorized: false, reason: 'Cross-tenant access forbidden' };
    }

    // Role-based check
    if (requestingUser.role === 'STAFF' || requestingUser.role === 'TENANT_ADMIN' || requestingUser.role === 'OPERATOR') {
      return { authorized: true, document: doc };
    }

    // Vendor check (must own document or have purchased associated tender)
    if (doc.ownerType === 'VENDOR' && doc.ownerId !== requestingUser.vendorId) {
      return { authorized: false, reason: 'Access to other vendor dossier forbidden' };
    }

    return { authorized: true, document: doc };
  }

  generateWatermarkMetadata(docId, userContext) {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    const timestamp = new Date().toISOString();
    return {
      documentId: doc.id,
      filename: doc.filename,
      watermarkLines: [
        `CONFIDENTIAL — OFFICIAL TENDER USE ONLY`,
        `RECIPIENT: ${userContext.companyName || userContext.name || userContext.email}`,
        `AUTH-ID: ${userContext.vendorId || userContext.id || 'ANON'} | IP: ${userContext.ip || '127.0.0.1'}`,
        `ACCESSED: ${timestamp}`
      ],
      token: crypto.createHmac('sha256', 'kbm-watermark-key').update(`${docId}:${timestamp}`).digest('hex').slice(0, 16)
    };
  }
}

module.exports = {
  DocumentManager,
  ALLOWED_MIME_TYPES
};


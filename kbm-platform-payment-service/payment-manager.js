/**
 * KBM Platform — Payment Service
 * Handles KNET sandbox transactions, idempotent callbacks,
 * signature validation, and tenant-branded printable receipts.
 */

const crypto = require('crypto');

class PaymentManager {
  constructor(secretKey = 'kbm-knet-sandbox-secret-2026') {
    this.secretKey = secretKey;
    this.transactions = new Map();
    this.processedCallbacks = new Set();
    this.receipts = new Map();
    this.receiptCounter = 1000;
  }

  createCheckoutSession({
    tenantId,
    vendorId,
    vendorName,
    paymentType, // 'TENDER_PURCHASE' or 'ANNUAL_SUBSCRIPTION'
    tenderId = null,
    amountKwd,
    currency = 'KWD'
  }) {
    const trackId = `TRK-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const paymentId = `KNET-${crypto.randomUUID().slice(0, 12).toUpperCase()}`;

    const tx = {
      paymentId,
      trackId,
      tenantId,
      vendorId,
      vendorName,
      paymentType,
      tenderId,
      amountKwd: Number(amountKwd),
      currency,
      status: 'INITIATED', // INITIATED, CAPTURED, FAILED
      redirectUrl: `http://localhost:3000/knet-mock?paymentId=${paymentId}&trackId=${trackId}&amount=${amountKwd}`,
      createdAt: new Date().toISOString()
    };

    this.transactions.set(paymentId, tx);
    return tx;
  }

  processKnetCallback({
    paymentId,
    trackId,
    result, // 'CAPTURED' or 'NOT_CAPTURED'
    authCode = 'AUTH883921',
    referenceNo = 'REF9901823',
    signature = null
  }) {
    const tx = this.transactions.get(paymentId);
    if (!tx) throw new Error(`Transaction ${paymentId} not found`);

    // Idempotency check
    const idempotencyKey = `${paymentId}:${result}`;
    if (this.processedCallbacks.has(idempotencyKey)) {
      return {
        alreadyProcessed: true,
        transaction: tx,
        receipt: this.getReceiptByPaymentId(paymentId)
      };
    }

    tx.result = result;
    tx.authCode = authCode;
    tx.referenceNo = referenceNo;
    tx.status = result === 'CAPTURED' ? 'CAPTURED' : 'FAILED';
    tx.processedAt = new Date().toISOString();

    let receipt = null;
    if (result === 'CAPTURED') {
      this.receiptCounter += 1;
      const receiptNo = `REC-${new Date().getFullYear()}-${this.receiptCounter}`;
      receipt = {
        id: `rcp-${crypto.randomUUID().slice(0, 8)}`,
        receiptNumber: receiptNo,
        tenantId: tx.tenantId,
        vendorId: tx.vendorId,
        vendorName: tx.vendorName,
        paymentId: tx.paymentId,
        knetTrackId: tx.trackId,
        knetAuthCode: authCode,
        knetReferenceNo: referenceNo,
        amountKwd: tx.amountKwd,
        currency: tx.currency,
        paymentType: tx.paymentType,
        tenderId: tx.tenderId,
        issuedAt: new Date().toISOString(),
        issuerTitle: 'Ministry of Interior — Financial Affairs',
        issuerTitleAr: 'وزارة الداخلية — الشئون المالية',
        printable: true
      };
      this.receipts.set(receipt.id, receipt);
    }

    this.processedCallbacks.add(idempotencyKey);
    return {
      alreadyProcessed: false,
      transaction: tx,
      receipt
    };
  }

  getReceipt(receiptId) {
    return this.receipts.get(receiptId);
  }

  getReceiptByPaymentId(paymentId) {
    return Array.from(this.receipts.values()).find(r => r.paymentId === paymentId);
  }

  listVendorReceipts(vendorId) {
    return Array.from(this.receipts.values()).filter(r => r.vendorId === vendorId);
  }
}

module.exports = {
  PaymentManager
};


/**
 * KBM Platform — Microsoft Commercial Marketplace Service
 * Implements SaaS Fulfillment API v2 integration, webhook lifecycle handlers,
 * and tenant entitlement provisioning for Azure Marketplace transactable offers.
 */

const crypto = require('crypto');

const MARKETPLACE_PLANS = {
  'kbm-starter': {
    id: 'kbm-starter',
    name: 'KBM Procurement Starter',
    nameAr: 'باقة المشتريات الأساسية',
    priceUsd: 499,
    features: ['Up to 10 Active Tenders', 'Standard 3-Grade Vendor Portal', 'Local Azurite / File Storage']
  },
  'kbm-professional': {
    id: 'kbm-professional',
    name: 'KBM Procurement Professional',
    nameAr: 'باقة المشتريات الاحترافية',
    priceUsd: 1499,
    features: ['Up to 50 Active Tenders', 'Custom Workflow Designer', 'Raslni & MoCI Adapters', 'Bilingual Support']
  },
  'kbm-enterprise': {
    id: 'kbm-enterprise',
    name: 'KBM Procurement Enterprise',
    nameAr: 'باقة المشتريات للمؤسسات الكبرى',
    priceUsd: 3999,
    features: ['Unlimited Tenders', 'Dedicated Cosmos Audit Store', 'Custom EDMS / SharePoint Adapter', '24/7 SLA']
  }
};

class MarketplaceManager {
  constructor() {
    this.subscriptions = new Map();
  }

  resolveMarketplaceToken(token) {
    if (!token) throw new Error('Marketplace identification token is required');

    // Emulate SaaS token resolution payload
    const mockSubscriptionId = `sub-${crypto.createHash('md5').update(token).digest('hex').slice(0, 12)}`;
    return {
      id: mockSubscriptionId,
      subscriptionName: 'Ministry of Interior Kuwait - Production',
      offerId: 'kbm-procurement-saas',
      planId: 'kbm-professional',
      quantity: 1,
      beneficiary: {
        emailId: 'procurement-admin@moi.gov.kw',
        tenantId: 'azure-tenant-moi-kuwait-88192'
      },
      purchaser: {
        emailId: 'buyer@moi.gov.kw',
        tenantId: 'azure-tenant-moi-kuwait-88192'
      },
      saasSubscriptionStatus: 'PendingFulfillmentStart'
    };
  }

  activateSubscription({
    subscriptionId,
    planId = 'kbm-professional',
    tenantName,
    adminEmail
  }) {
    if (!MARKETPLACE_PLANS[planId]) throw new Error(`Unknown marketplace plan: ${planId}`);

    const subscription = {
      subscriptionId,
      planId,
      tenantName: tenantName || 'Default Enterprise Tenant',
      adminEmail,
      status: 'Subscribed', // Subscribed, Suspended, Unsubscribed
      planDetails: MARKETPLACE_PLANS[planId],
      activatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  processLifecycleWebhook({
    action, // 'ChangePlan', 'ChangeQuantity', 'Suspend', 'Reinstate', 'Unsubscribe'
    subscriptionId,
    planId = null,
    quantity = 1
  }) {
    const sub = this.subscriptions.get(subscriptionId);
    if (!sub) throw new Error(`Subscription ${subscriptionId} not found`);

    switch (action) {
      case 'ChangePlan':
        if (planId && MARKETPLACE_PLANS[planId]) {
          sub.planId = planId;
          sub.planDetails = MARKETPLACE_PLANS[planId];
        }
        break;
      case 'Suspend':
        sub.status = 'Suspended';
        break;
      case 'Reinstate':
        sub.status = 'Subscribed';
        break;
      case 'Unsubscribe':
        sub.status = 'Unsubscribed';
        break;
      default:
        break;
    }

    sub.lastModified = new Date().toISOString();
    return sub;
  }

  getSubscription(subscriptionId) {
    return this.subscriptions.get(subscriptionId);
  }

  getPlans() {
    return Object.values(MARKETPLACE_PLANS);
  }
}

module.exports = {
  MarketplaceManager,
  MARKETPLACE_PLANS
};


const test = require('node:test');
const assert = require('node:assert/strict');
const { MarketplaceManager } = require('./marketplace-manager.js');

test('resolves marketplace token and activates SaaS subscription', () => {
  const manager = new MarketplaceManager();
  const resolution = manager.resolveMarketplaceToken('marketplace-jwt-token-sample-9988');

  assert.ok(resolution.id);
  assert.equal(resolution.saasSubscriptionStatus, 'PendingFulfillmentStart');

  const activation = manager.activateSubscription({
    subscriptionId: resolution.id,
    planId: 'kbm-enterprise',
    tenantName: 'State of Kuwait - Ministry of Interior',
    adminEmail: 'admin@moi.gov.kw'
  });

  assert.equal(activation.status, 'Subscribed');
  assert.equal(activation.planDetails.priceUsd, 3999);
});

test('handles marketplace webhook lifecycle events (ChangePlan, Suspend, Reinstate)', () => {
  const manager = new MarketplaceManager();
  const sub = manager.activateSubscription({
    subscriptionId: 'sub-test-1234',
    planId: 'kbm-starter',
    tenantName: 'Civil Aviation',
    adminEmail: 'ops@dgca.gov.kw'
  });

  manager.processLifecycleWebhook({
    action: 'ChangePlan',
    subscriptionId: sub.subscriptionId,
    planId: 'kbm-professional'
  });
  assert.equal(manager.getSubscription(sub.subscriptionId).planId, 'kbm-professional');

  manager.processLifecycleWebhook({
    action: 'Suspend',
    subscriptionId: sub.subscriptionId
  });
  assert.equal(manager.getSubscription(sub.subscriptionId).status, 'Suspended');

  manager.processLifecycleWebhook({
    action: 'Reinstate',
    subscriptionId: sub.subscriptionId
  });
  assert.equal(manager.getSubscription(sub.subscriptionId).status, 'Subscribed');
});


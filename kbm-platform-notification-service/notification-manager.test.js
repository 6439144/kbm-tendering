const test = require('node:test');
const assert = require('node:assert/strict');
const { NotificationManager } = require('./notification-manager.js');

test('dispatches NOT-001 subscription renewal reminder and filters for vendor', () => {
  const manager = new NotificationManager();
  const notif = manager.sendNotification({
    tenantId: 'tenant-moi',
    recipientId: 'vnd-101',
    recipientRole: 'VENDOR',
    notificationCode: 'NOT-001',
    title: 'Annual Subscription Renewal Due',
    titleAr: 'تذكير بتجديد الاشتراك السنوي',
    message: 'Your vendor subscription will expire in 14 days. Click to renew.',
    actionUrl: '/subscription/renew'
  });

  assert.ok(notif.id);
  assert.equal(notif.notificationCode, 'NOT-001');

  const vendorNotifs = manager.listNotifications({ tenantId: 'tenant-moi', recipientId: 'vnd-101' });
  assert.equal(vendorNotifs.length, 1);
  assert.equal(vendorNotifs[0].read, false);

  manager.markAsRead(notif.id);
  assert.equal(vendorNotifs[0].read, true);
});


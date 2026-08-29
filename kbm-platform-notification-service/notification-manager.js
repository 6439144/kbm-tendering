/**
 * KBM Platform — Notification Service
 * Dispatches and stores multi-channel alerts (In-App, Email, SMS Sandbox),
 * subscription renewal reminders, grade upgrade notices, and admin alerts.
 */

const crypto = require('crypto');

class NotificationManager {
  constructor() {
    this.notifications = [];
  }

  sendNotification({
    tenantId,
    recipientId,
    recipientRole = 'VENDOR',
    notificationCode, // 'NOT-001', 'NOT-002', 'NOT-003', 'NOT-004', 'NOT-005'
    title,
    titleAr,
    message,
    messageAr,
    channels = ['IN_APP', 'EMAIL'],
    actionUrl = null,
    metadata = {}
  }) {
    const notificationId = `notif-${crypto.randomUUID().slice(0, 8)}`;
    const record = {
      id: notificationId,
      tenantId,
      recipientId,
      recipientRole,
      notificationCode,
      title,
      titleAr: titleAr || title,
      message,
      messageAr: messageAr || message,
      channels,
      actionUrl,
      metadata,
      read: false,
      dispatchedAt: new Date().toISOString()
    };

    this.notifications.push(record);
    return record;
  }

  listNotifications({ tenantId, recipientId = null, role = null }) {
    return this.notifications.filter(n => {
      if (n.tenantId !== tenantId) return false;
      if (recipientId && n.recipientId !== recipientId) return false;
      if (role && n.recipientRole !== role) return false;
      return true;
    });
  }

  markAsRead(notificationId) {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) notif.read = true;
    return notif;
  }
}

module.exports = {
  NotificationManager
};


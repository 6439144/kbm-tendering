const USERS = [
  {
    id: 'staff-01',
    name: 'Nora Al-Harbi',
    email: 'staff@kbm.demo',
    password: 'password123',
    role: 'staff',
    department: 'Procurement Office',
    tenantId: 'tenant-001'
  },
  {
    id: 'tenant-admin-01',
    name: 'Hamad Al-Mansoor',
    email: 'tenant-admin@kbm.demo',
    password: 'password123',
    role: 'tenant-admin',
    department: 'Tenant Administration',
    tenantId: 'tenant-001'
  },
  {
    id: 'vendor-001',
    name: 'Al Nahar Contractors',
    email: 'vendor@kbm.demo',
    password: 'password123',
    role: 'vendor',
    department: 'Supplier Operations',
    tenantId: 'tenant-001'
  }
];

const NOTIFICATIONS = [
  {
    id: 'notif-001',
    userId: 'staff-01',
    type: 'approval',
    priority: 'high',
    title: 'Review tender approval',
    message: 'Approve the IT Infrastructure Support request before the committee review closes.',
    actionLabel: 'Review now',
    dueAt: '2026-08-28T16:00:00Z',
    read: false
  },
  {
    id: 'notif-002',
    userId: 'tenant-admin-01',
    type: 'approval',
    priority: 'high',
    title: 'Confirm policy exception',
    message: 'A grade exemption request needs final approval from the tenant admin.',
    actionLabel: 'Check request',
    dueAt: '2026-08-28T15:30:00Z',
    read: false
  },
  {
    id: 'notif-003',
    userId: 'vendor-001',
    type: 'document',
    priority: 'critical',
    title: 'Upload compliance documents',
    message: 'Your trade license and financial certificate are pending upload for vendor review.',
    actionLabel: 'Upload missing docs',
    dueAt: '2026-08-28T17:00:00Z',
    read: false
  },
  {
    id: 'notif-004',
    userId: 'vendor-001',
    type: 'correction',
    priority: 'medium',
    title: 'Correction requested',
    message: 'Please revise the submitted certificate and confirm the updated issue date.',
    actionLabel: 'Update record',
    dueAt: '2026-08-28T18:00:00Z',
    read: false
  }
];

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

function loginUser(credentialsOrEmail, maybePassword) {
  let email, password;
  if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
    email = credentialsOrEmail.email;
    password = credentialsOrEmail.password;
  } else {
    email = credentialsOrEmail;
    password = maybePassword;
  }

  const candidate = USERS.find(user => user.email.toLowerCase() === String(email || '').trim().toLowerCase() && user.password === String(password || ''));
  if (!candidate) {
    throw new Error('Invalid email or password');
  }

  return {
    user: sanitizeUser(candidate),
    token: `kbm-demo-token-${candidate.id}`
  };
}

function getUserById(userId) {
  const user = USERS.find(item => item.id === userId);
  return sanitizeUser(user);
}

function getNotificationsForUser(userId) {
  return NOTIFICATIONS.filter(item => item.userId === userId).map(item => ({ ...item }));
}

function markNotificationAsRead(notificationId) {
  const notification = NOTIFICATIONS.find(item => item.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return notification;
}

module.exports = {
  USERS,
  NOTIFICATIONS,
  loginUser,
  getUserById,
  getNotificationsForUser,
  markNotificationAsRead
};

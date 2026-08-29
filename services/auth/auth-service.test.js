const test = require('node:test');
const assert = require('node:assert/strict');
const { loginUser, getNotificationsForUser } = require('./auth-service');

test('staff login succeeds with valid credentials', () => {
  const result = loginUser({ email: 'staff@kbm.demo', password: 'password123' });
  assert.equal(result.user.role, 'staff');
  assert.equal(result.user.email, 'staff@kbm.demo');
});

test('invalid credentials fail', () => {
  assert.throws(() => loginUser({ email: 'staff@kbm.demo', password: 'wrong' }), /invalid/i);
});

test('vendor receives required action notifications', () => {
  const notifications = getNotificationsForUser('vendor-001');
  assert.ok(notifications.some(item => /document|upload|review|approval/i.test(item.title) || /document|upload|review|approval/i.test(item.message)));
});

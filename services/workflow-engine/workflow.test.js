const test = require('node:test');
const assert = require('node:assert/strict');
const { createWorkflowTask, transitionTask } = require('./workflow');

test('pending task can move to in_review', () => {
  const task = createWorkflowTask({ id: 'wf-1', tenantId: 'tenant-001', title: 'GM Letter Review', ownerRole: 'staff', assignee: 'staff-1' });
  transitionTask(task, 'in_review', 'staff-1', 'submitted for approval');

  assert.equal(task.state, 'in_review');
  assert.equal(task.history.at(-1).to, 'in_review');
});

test('in review can be approved', () => {
  const task = createWorkflowTask({ id: 'wf-2', tenantId: 'tenant-001', title: 'Tender Publication', ownerRole: 'staff', assignee: 'staff-2', initialState: 'in_review' });
  transitionTask(task, 'approved', 'tenant-admin', 'approved by committee');

  assert.equal(task.state, 'approved');
  assert.equal(task.history.at(-1).actor, 'tenant-admin');
});

test('rejected tasks cannot move to approved without corrective action', () => {
  const task = createWorkflowTask({ id: 'wf-3', tenantId: 'tenant-001', title: 'Vendor Grade Upgrade', ownerRole: 'staff', assignee: 'staff-3', initialState: 'rejected' });

  assert.throws(() => transitionTask(task, 'approved', 'staff-3', 'reapply'), /invalid transition/);
});

test('correction is a configurable state', () => {
  const task = createWorkflowTask({ id: 'wf-4', tenantId: 'tenant-001', title: 'Tender Check', ownerRole: 'staff', assignee: 'staff-4', initialState: 'in_review' });
  transitionTask(task, 'correction_requested', 'staff-4', 'missing scanned letter');

  assert.equal(task.state, 'correction_requested');
  assert.equal(task.history.at(-1).note, 'missing scanned letter');
});

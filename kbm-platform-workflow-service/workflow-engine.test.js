const test = require('node:test');
const assert = require('node:assert/strict');
const { WorkflowEngine, TEMPLATE_PRACTICES, TEMPLATE_TENDERS } = require('./workflow-engine.js');

test('workflow engine registers Practices and Tenders templates', () => {
  const engine = new WorkflowEngine();
  const templates = engine.getTemplates();
  assert.equal(templates.length, 2);
  assert.ok(templates.find(t => t.code === 'PRACTICES'));
  assert.ok(templates.find(t => t.code === 'TENDERS'));
});

test('starts Practices workflow with 8 tasks and initial PENDING status', () => {
  const engine = new WorkflowEngine();
  const instance = engine.startWorkflow({
    templateCode: 'PRACTICES',
    tenantId: 'tenant-moi',
    entityId: 'tender-101'
  });

  assert.equal(instance.tasks.length, 8);
  assert.equal(instance.status, 'IN_PROGRESS');
  assert.equal(instance.tasks[0].status, 'PENDING');
  assert.equal(instance.tasks[1].status, 'QUEUED');
});

test('transitions task from PENDING to IN_REVIEW and APPROVE with history', () => {
  const engine = new WorkflowEngine();
  const instance = engine.startWorkflow({
    templateCode: 'PRACTICES',
    tenantId: 'tenant-moi',
    entityId: 'tender-101'
  });

  const task1 = instance.tasks[0];
  engine.transitionTask({
    taskId: task1.id,
    action: 'START_REVIEW',
    actorId: 'user-staff-01',
    role: 'ROLE_SYSTEMS',
    comment: 'Reviewing technical scope'
  });

  assert.equal(task1.status, 'IN_REVIEW');
  assert.equal(task1.history.length, 1);

  engine.transitionTask({
    taskId: task1.id,
    action: 'APPROVE',
    actorId: 'user-staff-01',
    role: 'ROLE_SYSTEMS',
    comment: 'Scope approved'
  });

  assert.equal(task1.status, 'APPROVED');
  assert.equal(task1.history.length, 2);

  // Task 2 should auto-advance to PENDING
  const task2 = instance.tasks[1];
  assert.equal(task2.status, 'PENDING');
});

test('handles return-for-correction and rejects invalid transition', () => {
  const engine = new WorkflowEngine();
  const instance = engine.startWorkflow({
    templateCode: 'PRACTICES',
    tenantId: 'tenant-moi',
    entityId: 'tender-101'
  });

  const task1 = instance.tasks[0];
  engine.transitionTask({
    taskId: task1.id,
    action: 'REQUEST_CORRECTION',
    actorId: 'user-staff-01',
    role: 'ROLE_SYSTEMS',
    comment: 'Needs budget documentation attached'
  });

  assert.equal(task1.status, 'CORRECTION_REQUIRED');
});


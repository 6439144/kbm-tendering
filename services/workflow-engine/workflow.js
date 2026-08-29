const VALID_TRANSITIONS = {
  pending: ['in_review', 'cancelled'],
  in_review: ['approved', 'rejected', 'correction_requested', 'cancelled'],
  correction_requested: ['in_review', 'cancelled'],
  approved: [],
  rejected: [],
  cancelled: []
};

function createWorkflowTask({ id, tenantId, title, ownerRole, assignee, initialState = 'pending' }) {
  return {
    id,
    tenantId,
    title,
    ownerRole,
    assignee,
    state: initialState,
    history: [{
      from: null,
      to: initialState,
      actor: 'system',
      note: 'task created',
      timestamp: new Date().toISOString()
    }]
  };
}

function transitionTask(task, action, actor, note = '') {
  if (!task || !action) {
    throw new Error('task and action are required');
  }

  const nextState = action.toLowerCase();
  const allowed = VALID_TRANSITIONS[task.state] || [];

  if (!allowed.includes(nextState)) {
    throw new Error(`invalid transition: ${task.state} -> ${nextState}`);
  }

  const previousState = task.state;
  task.state = nextState;
  task.history.push({
    from: previousState,
    to: nextState,
    actor,
    note,
    timestamp: new Date().toISOString()
  });

  return task;
}

module.exports = {
  createWorkflowTask,
  transitionTask,
  VALID_TRANSITIONS
};

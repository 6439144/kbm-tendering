function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function hasRole(user, requiredRole) {
  if (!user || !user.roles) return false;
  return user.roles.some(role => normalizeRole(role) === normalizeRole(requiredRole));
}

function canAccessTenant(user, tenantId) {
  if (!user || !tenantId) return false;
  return user.tenantId === tenantId;
}

function canAccessObject(user, object) {
  if (!user || !object) return false;
  if (!canAccessTenant(user, object.tenantId)) return false;

  const hasAdminRole = hasRole(user, 'tenant-admin') || hasRole(user, 'staff');
  if (hasAdminRole) return true;

  if (hasRole(user, 'vendor')) {
    return object.ownerId === user.userId;
  }

  return false;
}

module.exports = {
  normalizeRole,
  hasRole,
  canAccessTenant,
  canAccessObject
};

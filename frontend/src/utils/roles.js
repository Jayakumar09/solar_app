export const normalizeRole = (role) => {
  if (role === 'customer') return 'client';
  return role || 'guest';
};

export const getDashboardPath = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'admin') return '/admin/dashboard';
  if (normalizedRole === 'vendor') return '/vendor/dashboard';
  return '/client/dashboard';
};

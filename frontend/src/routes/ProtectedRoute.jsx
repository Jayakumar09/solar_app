import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath, normalizeRole } from '../utils/roles';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  const role = normalizeRole(user.role);
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }
  return <Outlet />;
}

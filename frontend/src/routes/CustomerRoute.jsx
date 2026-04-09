import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomerSidebar from '../components/layout/CustomerSidebar';

export default function CustomerRoute() {
  const { user } = useAuth();
  if (user?.role !== 'customer') return <Navigate to="/login" />;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CustomerSidebar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
}

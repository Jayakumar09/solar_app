import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, Package, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/leads', icon: Users, label: 'Leads' },
    { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/plans', icon: Package, label: 'Plans' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-xl">☀</span>
          </div>
          <span className="font-bold">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span>View Site</span>
        </Link>
        <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600/20 text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

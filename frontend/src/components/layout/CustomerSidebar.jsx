import { Link } from 'react-router-dom';
import { Sun, LayoutDashboard, Calendar, Headphones, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerSidebar() {
  const { logout, user } = useAuth();

  const links = [
    { to: '/customer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/customer/services', icon: Headphones, label: 'Service Requests' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm">Green Hybrid</span>
            <span className="block text-xs text-primary-400">Power</span>
          </div>
        </Link>
        <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span>{user?.name}</span>
        </div>
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

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { 
  Users, Calendar, MessageSquare, Package, TrendingUp, Zap, 
  ArrowUpRight, ArrowDownRight, LogOut, User, DollarSign, 
  Target, Wrench, ChevronRight, Loader2, AlertCircle 
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, changeType, color, loading }) => (
  <motion.div 
    className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      {change && !loading && (
        <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
    {loading ? (
      <div className="h-9 w-20 bg-gray-200 animate-pulse rounded mb-2" />
    ) : (
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    )}
    <div className="text-sm text-gray-500 font-medium">{label}</div>
  </motion.div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <Icon className="w-12 h-12 mb-3 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-purple-100 text-purple-700',
    quoted: 'bg-amber-100 text-amber-700',
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    scheduled: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const leadByStatus = stats?.leads || [];
  const totalLeads = leadByStatus.reduce((sum, l) => sum + parseInt(l.count || 0), 0);
  const completedInstallations = stats?.completedInstallations || 0;
  const conversionRate = stats?.conversionRate || 0;

  const quickActions = [
    { to: '/admin/leads', label: 'View All Leads', icon: Users, color: 'bg-primary-500', hover: 'hover:bg-primary-600' },
    { to: '/admin/bookings', label: 'Manage Bookings', icon: Calendar, color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    { to: '/admin/plans', label: 'Edit Plans', icon: Package, color: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    { to: '/admin/customers', label: 'Customers', icon: User, color: 'bg-amber-500', hover: 'hover:bg-amber-600' },
  ];

  const statusColors = {
    new: 'bg-blue-500',
    contacted: 'bg-purple-500',
    quoted: 'bg-amber-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Green Hybrid Power</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {adminUser.name?.charAt(0) || 'A'}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{adminUser.name || 'Admin'}</p>
                  <p className="text-gray-500 text-xs">{adminUser.email || 'admin@green hybrid.in'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            label="Total Customers" 
            value={stats?.totalCustomers || 0} 
            change="+12%" 
            changeType="up" 
            color="bg-gradient-to-br from-blue-500 to-blue-600" 
            loading={loading} 
          />
          <StatCard 
            icon={Calendar} 
            label="Total Bookings" 
            value={stats?.totalBookings || 0} 
            change="+8%" 
            changeType="up" 
            color="bg-gradient-to-br from-primary-500 to-primary-600" 
            loading={loading} 
          />
          <StatCard 
            icon={DollarSign} 
            label="Total Revenue" 
            value={`₹${((stats?.totalRevenue || 0)).toLocaleString()}`} 
            change="+15%" 
            changeType="up" 
            color="bg-gradient-to-br from-green-500 to-green-600" 
            loading={loading} 
          />
          <StatCard 
            icon={Target} 
            label="Conversion Rate" 
            value={`${stats?.conversionRate || 0}%`} 
            change={(stats?.conversionRate || 0) > 20 ? '+5%' : '-2%'} 
            changeType={(stats?.conversionRate || 0) > 20 ? 'up' : 'down'} 
            color="bg-gradient-to-br from-purple-500 to-purple-600" 
            loading={loading} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={MessageSquare} 
            label="New Leads Today" 
            value={stats?.newLeadsToday || 0} 
            change="+23%" 
            changeType="up" 
            color="bg-gradient-to-br from-amber-500 to-amber-600" 
            loading={loading} 
          />
          <StatCard 
            icon={Wrench} 
            label="Completed Installations" 
            value={completedInstallations} 
            color="bg-gradient-to-br from-cyan-500 to-cyan-600" 
            loading={loading} 
          />
          <StatCard 
            icon={Package} 
            label="Active Plans" 
            value={stats?.plans?.length || 0} 
            color="bg-gradient-to-br from-orange-500 to-orange-600" 
            loading={loading} 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Total Enquiries" 
            value={stats?.totalEnquiries || 0} 
            color="bg-gradient-to-br from-pink-500 to-pink-600" 
            loading={loading} 
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Lead Pipeline</h2>
              <Link to="/admin/leads" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : totalLeads === 0 ? (
              <EmptyState icon={MessageSquare} message="No leads yet" />
            ) : (
              <div className="space-y-4">
                {['new', 'contacted', 'quoted', 'won'].map(status => {
                  const item = leadByStatus.find(l => l.status === status);
                  const count = parseInt(item?.count || 0);
                  const pct = Math.round((count / totalLeads) * 100);
                  const color = statusColors[status];
                  return (
                    <div key={status} className="group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="capitalize font-medium text-gray-700">{status}</span>
                        <span className="font-bold text-gray-900">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map(({ to, label, icon: Icon, color, hover }) => (
                <Link 
                  key={to} 
                  to={to} 
                  className={`${color} ${hover} p-4 rounded-xl text-white font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : (!stats?.recentBookings || stats.recentBookings.length === 0) ? (
            <EmptyState icon={Calendar} message="No bookings yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inspection</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Installation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentBookings.map((booking, idx) => (
                    <motion.tr 
                      key={booking.id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {(booking.customer_name || 'U').charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{booking.customer_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{booking.plan_name || 'N/A'}</td>
                      <td className="px-6 py-4"><StatusBadge status={booking.inspection_status} /></td>
                      <td className="px-6 py-4"><StatusBadge status={booking.installation_status} /></td>
                      <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
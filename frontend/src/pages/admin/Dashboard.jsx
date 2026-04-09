import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Users, Calendar, MessageSquare, Package, TrendingUp, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change && (
        <div className={`flex items-center text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const leadByStatus = stats?.leads || [];
  const newLeads = leadByStatus.find(l => l.status === 'new')?.count || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Customers" value={stats?.totalCustomers || 0} change="+12%" changeType="up" color="bg-blue-500" />
        <StatCard icon={Calendar} label="Total Bookings" value={stats?.totalBookings || 0} change="+8%" changeType="up" color="bg-primary-500" />
        <StatCard icon={MessageSquare} label="New Enquiries" value={newLeads} change="+23%" changeType="up" color="bg-purple-500" />
        <StatCard icon={Zap} label="Active Plans" value={stats?.plans?.length || 0} color="bg-orange-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Overview</h2>
          <div className="space-y-3">
            {['new', 'contacted', 'quoted', 'won'].map(status => {
              const item = leadByStatus.find(l => l.status === status);
              const count = item?.count || 0;
              const total = leadByStatus.reduce((sum, l) => sum + parseInt(l.count), 1);
              const pct = Math.round((count / total) * 100) || 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-600">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/leads" className="p-4 rounded-xl bg-primary-50 text-primary-700 font-medium text-center hover:bg-primary-100 transition-colors">View All Leads</Link>
            <Link to="/admin/bookings" className="p-4 rounded-xl bg-blue-50 text-blue-700 font-medium text-center hover:bg-blue-100 transition-colors">Manage Bookings</Link>
            <Link to="/admin/enquiries" className="p-4 rounded-xl bg-purple-50 text-purple-700 font-medium text-center hover:bg-purple-100 transition-colors">View Enquiries</Link>
            <Link to="/admin/plans" className="p-4 rounded-xl bg-orange-50 text-orange-700 font-medium text-center hover:bg-orange-100 transition-colors">Edit Plans</Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Inspection</th>
                <th className="pb-3 font-medium">Installation</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(stats?.recentBookings || []).map(booking => (
                <tr key={booking.id} className="border-b last:border-0">
                  <td className="py-3">{booking.customer_name || 'N/A'}</td>
                  <td className="py-3">{booking.plan_name || 'N/A'}</td>
                  <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${booking.inspection_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.inspection_status}</span></td>
                  <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${booking.installation_status === 'completed' ? 'bg-green-100 text-green-700' : booking.installation_status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{booking.installation_status}</span></td>
                  <td className="py-3 text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

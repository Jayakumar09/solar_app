import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { 
  Search, Calendar, Package, MapPin, Mail, Phone, 
  Loader2, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

const StatusBadge = ({ status, type = 'default' }) => {
  const styles = {
    default: {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
    },
    installation: {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
    }
  };
  const typeStyles = styles[type] || styles.default;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeStyles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Calendar className="w-16 h-16 mb-4 opacity-30" />
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm">Bookings will appear here when customers schedule inspections</p>
  </div>
);

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, field, value) => {
    try {
      const payload = field === 'inspection' ? { inspection_status: value } : { installation_status: value };
      await api.put(`/bookings/${id}`, payload);
      toast.success('Status updated successfully');
      loadBookings();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getDateFilter = (dateStr) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (dateFilter === 'today') return diffDays === 0;
    if (dateFilter === 'week') return diffDays <= 7;
    if (dateFilter === 'month') return diffDays <= 30;
    return true;
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = !search || 
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search) ||
      b.plan_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      b.installation_status === statusFilter || 
      b.inspection_status === statusFilter;
    const matchesDate = getDateFilter(b.created_at);
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-500 mt-1">Track and manage all installations</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <motion.div 
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState message="No bookings found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Inspection</th>
                    <th className="px-6 py-4">Installation</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((booking, idx) => (
                    <motion.tr 
                      key={booking.id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {(booking.customer_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{booking.customer_name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{booking.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.plan_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {booking.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={booking.inspection_status || 'pending'} 
                          onChange={e => updateStatus(booking.id, 'inspection', e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={booking.installation_status || 'pending'} 
                          onChange={e => updateStatus(booking.id, 'installation', e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status || 'pending'} type="installation" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {!loading && filtered.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        )}
      </div>
    </div>
  );
}
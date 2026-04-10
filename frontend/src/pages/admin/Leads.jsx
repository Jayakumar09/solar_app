import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { 
  Search, Filter, ChevronDown, ChevronUp, Mail, Phone, 
  MapPin, Calendar, Loader2, Users, ArrowUpDown 
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-purple-100 text-purple-700 border-purple-200',
    quoted: 'bg-amber-100 text-amber-700 border-amber-200',
    won: 'bg-green-100 text-green-700 border-green-200',
    lost: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Users className="w-16 h-16 mb-4 opacity-30" />
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm">Leads will appear here when customers submit inquiries</p>
  </div>
);

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      toast.success('Status updated successfully');
      loadLeads();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getDateFilter = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (dateFilter === 'today') return diffDays === 0;
    if (dateFilter === 'week') return diffDays <= 7;
    if (dateFilter === 'month') return diffDays <= 30;
    return true;
  };

  const filtered = leads.filter(l => {
    const matchesFilter = filter === 'all' || l.status === filter;
    const matchesSearch = !search || 
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search);
    const matchesDate = getDateFilter(l.created_at);
    return matchesFilter && matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-gray-500 mt-1">Manage and track all customer leads</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
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
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
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
            <EmptyState message="No leads found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((lead, idx) => (
                    <motion.tr 
                      key={lead.id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {(lead.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{lead.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {lead.email || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {lead.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{lead.service_type?.replace('_', ' ') || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {lead.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                          {lead.source || 'Website'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={lead.status} 
                          onChange={e => updateStatus(lead.id, e.target.value)} 
                          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
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
            Showing {filtered.length} of {leads.length} leads
          </div>
        )}
      </div>
    </div>
  );
}
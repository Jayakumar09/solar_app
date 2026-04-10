import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { 
  Search, Mail, Phone, Calendar, Loader2, MessageSquare, 
  CheckCircle, Clock, AlertCircle, Send, X 
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    responded: 'bg-green-100 text-green-700 border-green-200',
    closed: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm">Contact enquiries will appear here</p>
  </div>
);

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const res = await api.get('/contact');
      setEnquiries(res.data);
    } catch {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status });
      toast.success('Status updated');
      loadEnquiries();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/contact/${id}/reply`, { message: replyText });
      toast.success('Reply sent successfully');
      setReplyText('');
      setSelectedEnquiry(null);
      loadEnquiries();
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = enquiries.filter(e => {
    const matchesSearch = !search || 
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
            <p className="text-gray-500 mt-1">Customer messages and queries</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search enquiries..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No enquiries found" />
        ) : (
          <div className="grid gap-4">
            {filtered.map((enquiry, idx) => (
              <motion.div 
                key={enquiry.id}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedEnquiry(enquiry)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(enquiry.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{enquiry.name || 'N/A'}</h3>
                        <StatusBadge status={enquiry.status} />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{enquiry.subject}</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{enquiry.message}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      {enquiry.email || 'N/A'}
                    </div>
                    {enquiry.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-4 h-4" />
                        {enquiry.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
              <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {(selectedEnquiry.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedEnquiry.name}</p>
                  <p className="text-sm text-gray-500">{selectedEnquiry.email}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="font-medium text-gray-900">{selectedEnquiry.subject}</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Message</p>
                <p className="text-gray-700">{selectedEnquiry.message}</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <select 
                  value={selectedEnquiry.status}
                  onChange={e => updateStatus(selectedEnquiry.id, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="new">New</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Send Reply</label>
              <textarea 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                rows={3}
                placeholder="Type your reply..."
              />
              <button 
                onClick={() => sendReply(selectedEnquiry.id)}
                disabled={submitting || !replyText.trim()}
                className="mt-3 w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
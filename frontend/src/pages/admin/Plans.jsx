import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PlanImage from '../../components/common/PlanImage';
import { 
  Plus, Loader2, Edit2, Trash2, X, Package, CheckCircle, 
  DollarSign, ArrowUpDown, Search, Zap 
} from 'lucide-react';

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Package className="w-16 h-16 mb-4 opacity-30" />
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm">Plans will appear here when you add them</p>
  </div>
);

const planTypes = ['basic', 'hybrid', 'premium', 'commercial'];

const TypeBadge = ({ type }) => {
  const styles = {
    basic: 'bg-blue-100 text-blue-700 border-blue-200',
    hybrid: 'bg-purple-100 text-purple-700 border-purple-200',
    premium: 'bg-amber-100 text-amber-700 border-amber-200',
    commercial: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {type}
    </span>
  );
};

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'basic', price: '', description: '', features: '', image_url: '', solar_panel_image_url: '', inverter_image_url: '', battery_image_url: ''
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      price: Number(form.price),
      features: form.features.split('\n').filter(f => f.trim())
    };
    try {
      if (editingPlan) {
        await api.put(`/plans/${editingPlan.id}`, payload);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/plans', payload);
        toast.success('Plan created successfully');
      }
      setShowModal(false);
      setEditingPlan(null);
      setForm({ name: '', type: 'basic', price: '', description: '', features: '', image_url: '', solar_panel_image_url: '', inverter_image_url: '', battery_image_url: '' });
      loadPlans();
    } catch {
      toast.error('Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      type: plan.type,
      price: plan.price?.toString() || '',
      description: plan.description || '',
      features: (plan.features || []).join('\n'),
      image_url: plan.image_url || '',
      solar_panel_image_url: plan.solar_panel_image_url || '',
      inverter_image_url: plan.inverter_image_url || '',
      battery_image_url: plan.battery_image_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/plans/${id}`);
      toast.success('Plan deleted successfully');
      loadPlans();
    } catch {
      toast.error('Failed to delete plan');
    }
  };

  const filtered = plans.filter(p => {
    const matchesSearch = !search || 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plans & Pricing</h1>
            <p className="text-gray-500 mt-1">Manage your service plans</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search plans..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <select 
              value={typeFilter} 
              onChange={e => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Types</option>
              {planTypes.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <button 
              onClick={() => { setEditingPlan(null); setForm({ name: '', type: 'basic', price: '', description: '', features: '', image_url: '', solar_panel_image_url: '', inverter_image_url: '', battery_image_url: '' }); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Plan
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No plans found" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((plan, idx) => (
              <motion.div 
                key={plan.id}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <PlanImage src={plan.image_url} alt={plan.name} planType={plan.type} className="mb-4 h-40 rounded-2xl" />
                <div className="flex items-center justify-between mb-4">
                  <TypeBadge type={plan.type} />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">₹{Number(plan.price || 0).toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/system</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <PlanImage src={plan.solar_panel_image_url} alt={`${plan.name} solar panel`} type="panel" planType={plan.type} className="h-16 rounded-xl" />
                  <PlanImage src={plan.inverter_image_url} alt={`${plan.name} inverter`} type="inverter" planType={plan.type} className="h-16 rounded-xl" />
                  <PlanImage src={plan.battery_image_url} alt={`${plan.name} battery`} type="battery" planType={plan.type} className="h-16 rounded-xl" />
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {(plan.features || []).slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                  {(plan.features || []).length > 4 && (
                    <div className="text-xs text-gray-400">+{(plan.features || []).length - 4} more features</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input 
                      type="text" 
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="e.g., Basic Solar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {planTypes.map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g., 125000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    rows={2}
                    placeholder="Brief description of the plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Image URL</label>
                  <input 
                    type="url"
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="https://example.com/plan.jpg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Panel Image URL</label>
                    <input type="url" value={form.solar_panel_image_url} onChange={e => setForm({ ...form, solar_panel_image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://example.com/panel.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inverter Image URL</label>
                    <input type="url" value={form.inverter_image_url} onChange={e => setForm({ ...form, inverter_image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://example.com/inverter.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Battery Image URL</label>
                    <input type="url" value={form.battery_image_url} onChange={e => setForm({ ...form, battery_image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://example.com/battery.jpg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                  <textarea 
                    value={form.features}
                    onChange={e => setForm({ ...form, features: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    rows={4}
                    placeholder="3KW Rooftop System&#10;5KW Inverter&#10;25-Year Panel Warranty"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

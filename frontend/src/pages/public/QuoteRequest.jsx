import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FileText, User, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export default function QuoteRequest() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', plan_id: '', monthly_units: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/plans').then(res => setPlans(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/leads', { ...form, service_type: 'quote_request' });
      toast.success('Quote request submitted! Our team will prepare a customized quotation and contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', address: '', city: '', pincode: '', plan_id: '', monthly_units: '', message: '' });
    } catch {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Request a <span className="text-primary-600">Quote</span></h1>
            <p className="text-lg text-gray-600">Get a customized quotation for your solar needs</p>
          </motion.div>

          <motion.div className="bg-white rounded-3xl p-8 shadow-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><User className="w-4 h-4 inline mr-1" /> Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-1" /> Phone</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-1" /> Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" /> City</label>
                  <input type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Your city" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" /> Address</label>
                <input type="text" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Full address" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested Plan</label>
                  <select required value={form.plan_id} onChange={e => setForm({ ...form, plan_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="">Select a plan</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{Number(p.price).toLocaleString()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Electricity Units</label>
                  <input type="number" required value={form.monthly_units} onChange={e => setForm({ ...form, monthly_units: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., 300" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
                <textarea rows="3" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Roof type, available space, specific requirements..."></textarea>
              </div>

              <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-primary-500" />
                <span>Quotes are free and come with expert consultation</span>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-lg">
                {loading ? 'Submitting...' : 'Request Quote'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

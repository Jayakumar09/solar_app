import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Calendar, MapPin, User, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function BookInspection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', preferred_date: '', preferred_time: '', service_type: 'basic', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/leads', { ...form, service_type: form.service_type });
      toast.success('Inspection booked successfully! We will contact you to confirm.');
      setForm({ name: '', email: '', phone: '', address: '', city: '', pincode: '', preferred_date: '', preferred_time: '', service_type: 'basic', message: '' });
    } catch {
      toast.error('Failed to book inspection. Please try again.');
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
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Book Free Site <span className="text-primary-600">Inspection</span></h1>
            <p className="text-lg text-gray-600">Our experts will visit your property and provide a free consultation</p>
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
                <input type="text" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Full address with landmark" />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="basic">Basic Solar</option>
                    <option value="hybrid">Hybrid Solar + Wind</option>
                    <option value="premium">Premium Setup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" /> Preferred Date</label>
                  <input type="date" required value={form.preferred_date} onChange={e => setForm({ ...form, preferred_date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="w-4 h-4 inline mr-1" /> Preferred Time</label>
                  <select required value={form.preferred_time} onChange={e => setForm({ ...form, preferred_time: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="">Select time</option>
                    {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message (Optional)</label>
                <textarea rows="3" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Any specific requirements..."></textarea>
              </div>

              <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-primary-500" />
                <span>Free inspection - No charges until you approve the quotation</span>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-lg">
                {loading ? 'Booking...' : 'Book Free Inspection'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

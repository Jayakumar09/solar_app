import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FileText, User, Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader2, Zap, Battery, Clock } from 'lucide-react';

const fallbackPlans = [
  { id: 'basic', name: 'Basic Solar', price: 125000 },
  { id: 'hybrid', name: 'Hybrid Power', price: 215000 },
  { id: 'premium', name: 'Premium Suite', price: 350000 },
];

export default function QuoteRequest() {
  const location = useLocation();
  const calcData = location.state?.fromCalculator ? location.state : null;

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: calcData?.location || '',
    pincode: '',
    plan_id: '',
    monthly_units: calcData?.monthlyUnits || '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans');
        if (res.data && res.data.length > 0) {
          setPlans(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch plans, using fallback:', err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        service_type: 'quote_request',
        roof_type: calcData?.roofType || undefined,
        roof_area: calcData?.roofArea || undefined,
        solar_data: calcData?.solarData || undefined,
        appliance_data: calcData?.applianceData || undefined,
        battery_data: calcData?.batteryData || undefined,
        payback_years: calcData?.paybackYears || undefined,
      };
      await api.post('/leads', payload);
      toast.success('Quote request submitted! Our team will prepare a customized quotation and contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', address: '', city: '', pincode: '', plan_id: '', monthly_units: '', message: '' });
    } catch {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;
  const showNoPlansMessage = !loadingPlans && plansError && plans.length === 0 && fallbackPlans.length === 0;

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

          {calcData?.applianceData && (
            <motion.div
              className="mb-8 bg-blue-50 rounded-2xl p-6 border border-blue-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-800">Solar Calculator Summary</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Total Load</div>
                  <div className="font-bold text-gray-900">{calcData.applianceData.totalLoad} W</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Daily Usage</div>
                  <div className="font-bold text-gray-900">{calcData.applianceData.dailyUnits} kWh</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Monthly Units</div>
                  <div className="font-bold text-gray-900">{calcData.applianceData.monthlyUnits} kWh</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">System Size</div>
                  <div className="font-bold text-green-700">{calcData.applianceData.solarSize} kW</div>
                </div>
              </div>
              <div className="mt-3 grid sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Estimated Cost</div>
                  <div className="font-bold text-gray-900">₹{calcData.applianceData.estimatedCost.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Monthly Savings</div>
                  <div className="font-bold text-green-700">₹{calcData.solarData?.monthlySavings.toLocaleString()}</div>
                </div>
                {calcData.paybackYears && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Payback</div>
                    <div className="font-bold text-amber-700">{calcData.paybackYears} years</div>
                  </div>
                )}
              </div>
              {calcData.batteryData && calcData.batteryData.size > 0 && (
                <div className="mt-3 bg-blue-100 rounded-lg p-3 text-sm flex items-center gap-2">
                  <Battery className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Battery: {calcData.batteryData.size} kWh (+₹{calcData.batteryData.cost.toLocaleString()})</span>
                </div>
              )}
              <div className="mt-3 text-xs text-gray-500">
                <strong>Appliances:</strong>{' '}
                {calcData.applianceData.appliances.map(a => `${a.name} (${a.watt}W×${a.quantity})`).join(', ')}
              </div>
            </motion.div>
          )}

          {calcData && !calcData.applianceData && calcData.solarData && (
            <motion.div
              className="mb-8 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-wrap gap-4 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div><span className="text-gray-500">System:</span> <strong>{calcData.solarData.requiredKw} kW</strong></div>
              <div><span className="text-gray-500">Est. Cost:</span> <strong>₹{calcData.solarData.estimatedCost.toLocaleString()}</strong></div>
              <div><span className="text-gray-500">Monthly Savings:</span> <strong className="text-green-700">₹{calcData.solarData.monthlySavings.toLocaleString()}</strong></div>
            </motion.div>
          )}

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
                  {loadingPlans ? (
                    <div className="flex items-center gap-2 px-4 py-3 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" /> Loading plans...
                    </div>
                  ) : (
                    <>
                      <select 
                        required 
                        value={form.plan_id} 
                        onChange={e => setForm({ ...form, plan_id: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        <option value="">Select a plan</option>
                        {displayPlans.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.price ? `- ₹${Number(p.price).toLocaleString()}` : ''}
                          </option>
                        ))}
                      </select>
                      {showNoPlansMessage && (
                        <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4" /> No plans available. Please contact us directly.
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Electricity Units</label>
                  <input type="number" required value={form.monthly_units} onChange={e => setForm({ ...form, monthly_units: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${calcData ? 'bg-gray-50 border-gray-300' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500 outline-none`} placeholder="e.g., 300" readOnly={!!calcData} />
                  {calcData && <p className="text-xs text-amber-600 mt-1">From calculator</p>}
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

              <button type="submit" disabled={submitting} className="w-full py-4 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-lg">
                {submitting ? 'Submitting...' : 'Request Quote'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

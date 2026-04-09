import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Plus } from 'lucide-react';

export default function CustomerServices() {
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ booking_id: '', service_type: 'maintenance', description: '', scheduled_date: '' });

  useEffect(() => {
    Promise.all([api.get('/services'), api.get('/bookings')]).then(([sr, bk]) => {
      setRequests(sr.data);
      setBookings(bk.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', form);
      toast.success('Service request submitted');
      setShowForm(false);
      const sr = await api.get('/services');
      setRequests(sr.data);
    } catch {
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-500">Manage your maintenance and service requests</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center px-4 py-2 gradient-primary text-white rounded-xl hover:shadow-lg">
          <Plus className="w-5 h-5 mr-2" /> New Request
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Create Service Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
                <select required value={form.booking_id} onChange={e => setForm({ ...form, booking_id: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select booking</option>
                  {bookings.map(b => <option key={b.id} value={b.id}>#{b.id} - {b.plan_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select required value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="maintenance">Regular Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">System Inspection</option>
                  <option value="upgrade">Upgrade</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
              <input type="date" required value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Describe your issue or requirement..." />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="px-6 py-2 gradient-primary text-white rounded-xl">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">{req.service_type}</h3>
                <p className="text-sm text-gray-500">Request #{req.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === 'requested' ? 'bg-blue-100 text-blue-700' : req.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' : req.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {req.status}
              </span>
            </div>
            <p className="text-gray-600 mt-3">{req.description}</p>
            {req.scheduled_date && <p className="text-sm text-gray-500 mt-2">Scheduled: {new Date(req.scheduled_date).toLocaleDateString()}</p>}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">No service requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

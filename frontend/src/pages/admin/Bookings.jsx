import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      toast.success('Status updated');
      loadBookings();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-500">Track and manage all installations</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Inspection</th>
                <th className="px-6 py-4 font-medium">Installation</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.customer_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.plan_name}</td>
                  <td className="px-6 py-4">
                    <select value={booking.inspection_status} onChange={e => updateStatus(booking.id, 'inspection', e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select value={booking.installation_status} onChange={e => updateStatus(booking.id, 'installation', e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then(res => setBookings(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500">Track your installation bookings</p>
      </div>

      <div className="space-y-6">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.plan_name}</h3>
                <p className="text-sm text-gray-500">Booking #{booking.id} • {new Date(booking.created_at).toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">{booking.installation_status}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Site Inspection</h4>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${booking.inspection_status === 'completed' ? 'bg-green-500' : booking.inspection_status === 'scheduled' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <span className="capitalize text-gray-600">{booking.inspection_status}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Installation</h4>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${booking.installation_status === 'completed' ? 'bg-green-500' : booking.installation_status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="capitalize text-gray-600">{booking.installation_status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

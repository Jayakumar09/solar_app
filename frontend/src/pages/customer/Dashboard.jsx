import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Sun, Zap, Calendar, FileText, Wrench, ArrowRight, Activity } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then(res => setBookings(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const latestBooking = bookings[0];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-500">Here's an overview of your solar journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Sun className="w-10 h-10 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{latestBooking?.plan_name || 'No Plan'}</div>
          <div className="text-white/70 text-sm">Selected Plan</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">-</div>
              <div className="text-sm text-gray-500">Est. Monthly Savings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 capitalize">{latestBooking?.installation_status || 'Pending'}</div>
              <div className="text-sm text-gray-500">Installation Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Installation Progress</h2>
          {latestBooking ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${latestBooking.inspection_status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>✓</div>
                <div className="ml-4"><div className="font-medium text-gray-900">Site Inspection</div><div className="text-sm text-gray-500">{latestBooking.inspection_status}</div></div>
              </div>
              <div className="ml-4 border-l-2 border-gray-200 h-8"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${latestBooking.installation_status === 'completed' ? 'bg-green-500 text-white' : latestBooking.installation_status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>✓</div>
                <div className="ml-4"><div className="font-medium text-gray-900">Installation</div><div className="text-sm text-gray-500">{latestBooking.installation_status}</div></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active bookings</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/customer/bookings" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3"><Calendar className="w-5 h-5 text-primary-600" /><span className="font-medium">My Bookings</span></div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link to="/customer/services" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3"><Wrench className="w-5 h-5 text-primary-600" /><span className="font-medium">Service Requests</span></div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link to="/quote-request" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3"><FileText className="w-5 h-5 text-primary-600" /><span className="font-medium">Request Quote</span></div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Energy Monitoring (Placeholder)</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-xl"><div className="text-2xl font-bold text-green-700">0</div><div className="text-xs text-gray-600">kWh Today</div></div>
          <div className="p-4 bg-blue-50 rounded-xl"><div className="text-2xl font-bold text-blue-700">0</div><div className="text-xs text-gray-600">kWh This Month</div></div>
          <div className="p-4 bg-yellow-50 rounded-xl"><div className="text-2xl font-bold text-yellow-700">₹0</div><div className="text-xs text-gray-600">Savings</div></div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { CheckCircle } from 'lucide-react';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plans & Pricing</h1>
        <p className="text-gray-500">Manage your service plans</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">{plan.type}</span>
              <span className="text-2xl font-bold text-gray-900">₹{Number(plan.price).toLocaleString()}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            <div className="space-y-2">
              {(plan.features || []).map((f, i) => (
                <div key={i} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-primary-500 mr-2" />{f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

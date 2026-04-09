import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
        <p className="text-gray-500">Customer messages and queries</p>
      </div>

      <div className="grid gap-6">
        {enquiries.map(enquiry => (
          <div key={enquiry.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
                <p className="text-sm text-gray-500">{enquiry.email} • {enquiry.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' : enquiry.status === 'responded' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {enquiry.status}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">{enquiry.subject}</p>
            <p className="text-gray-600">{enquiry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

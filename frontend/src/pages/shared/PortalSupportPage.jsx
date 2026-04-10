import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import PageHeader from '../../components/dashboard/PageHeader';
import portalService from '../../services/portal';

export default function PortalSupportPage({ title, description }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'general',
    priority: 'medium',
    subject: '',
    message: '',
  });

  useEffect(() => {
    portalService.getSupportTickets().then(setTickets).finally(() => setLoading(false));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await portalService.createSupportTicket(form);
      setTickets((prev) => [created, ...prev]);
      setForm({ category: 'general', priority: 'medium', subject: '', message: '' });
      toast.success('Support request submitted.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400">
                <option value="general">General</option>
                <option value="installation">Installation</option>
                <option value="payment">Payment</option>
                <option value="service">Service</option>
                <option value="warranty">Warranty</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-600">
              Priority
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-600 md:col-span-2">
              Subject
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" required />
            </label>
            <label className="text-sm font-medium text-slate-600 md:col-span-2">
              Message
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" required />
            </label>
          </div>
          <button type="submit" disabled={submitting} className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Create Ticket'}
          </button>
        </form>

        {loading ? (
          <LoadingState label="Loading support tickets..." />
        ) : (
          <DataTable
            columns={[
              { key: 'subject', label: 'Subject' },
              { key: 'category', label: 'Category' },
              { key: 'priority', label: 'Priority' },
              { key: 'status', label: 'Status', type: 'status' },
              { key: 'created_at', label: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
            ]}
            rows={tickets}
            emptyMessage="No support tickets created yet."
          />
        )}
      </div>
    </div>
  );
}

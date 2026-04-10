import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import PageHeader from '../../components/dashboard/PageHeader';
import portalService from '../../services/portal';

export default function PortalDocumentsPage({ title, description, visibility }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    document_type: 'general',
    file_name: '',
    file_url: '',
  });

  useEffect(() => {
    portalService.getDocuments().then(setDocuments).finally(() => setLoading(false));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await portalService.createDocument({ ...form, visibility });
      setDocuments((prev) => [created, ...prev]);
      setForm({ title: '', document_type: 'general', file_name: '', file_url: '' });
      toast.success('Document metadata saved.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save document.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-600">
              Document title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" required />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Type
              <select value={form.document_type} onChange={(e) => setForm({ ...form, document_type: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400">
                <option value="general">General</option>
                <option value="invoice">Invoice</option>
                <option value="warranty">Warranty</option>
                <option value="identity">Identity</option>
                <option value="installation">Installation</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-600">
              File name
              <input value={form.file_name} onChange={(e) => setForm({ ...form, file_name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" required />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              File URL or reference
              <input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" placeholder="/docs/sample.pdf" />
            </label>
          </div>
          <button type="submit" disabled={submitting} className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
            {submitting ? 'Saving...' : 'Add Document'}
          </button>
        </form>

        {loading ? (
          <LoadingState label="Loading documents..." />
        ) : (
          <DataTable
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'document_type', label: 'Type' },
              { key: 'file_name', label: 'File' },
              { key: 'status', label: 'Status', type: 'status' },
              { key: 'created_at', label: 'Uploaded', render: (row) => new Date(row.created_at).toLocaleDateString() },
            ]}
            rows={documents}
            emptyMessage="No documents uploaded yet."
          />
        )}
      </div>
    </div>
  );
}

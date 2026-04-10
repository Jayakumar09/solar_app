import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/dashboard/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import portalService from '../../services/portal';

export default function PortalProfilePage({ title, description, vendorFields = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    company_name: '',
    territory: '',
    specialization: '',
  });

  useEffect(() => {
    portalService.getProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          name: data?.name || '',
          phone: data?.phone || '',
          city: data?.city || '',
          company_name: data?.company_name || '',
          territory: data?.territory || '',
          specialization: data?.specialization || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await portalService.updateProfile(form);
      setProfile((prev) => ({ ...prev, ...updated, ...form }));
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Full name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Phone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
            </label>
            <label className="text-sm font-medium text-slate-600">
              City
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Email
              <input disabled value={profile?.email || ''} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500" />
            </label>
            {vendorFields ? (
              <>
                <label className="text-sm font-medium text-slate-600">
                  Company name
                  <input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
                </label>
                <label className="text-sm font-medium text-slate-600">
                  Territory
                  <input value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
                </label>
                <label className="text-sm font-medium text-slate-600 md:col-span-2">
                  Specialization
                  <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
                </label>
              </>
            ) : null}
          </div>
          <button type="submit" disabled={saving} className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
          <h2 className="text-lg font-bold text-slate-900">Account Snapshot</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">Role</p>
              <p className="capitalize">{profile?.role}</p>
            </div>
            {vendorFields ? (
              <>
                <div>
                  <p className="font-semibold text-slate-900">Onboarding Status</p>
                  <p className="capitalize">{profile?.onboarding_status || 'active'}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Partner Rating</p>
                  <p>{profile?.rating || 4.5} / 5</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Documents Uploaded</p>
                  <p>{profile?.documents_count || 0}</p>
                </div>
              </>
            ) : (
              <div>
                <p className="font-semibold text-slate-900">Registered On</p>
                <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

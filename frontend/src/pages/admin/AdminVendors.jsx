import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function AdminVendors() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  return (
    <ListPage
      title="Vendors"
      description="Manage installation partners, territories, and onboarding status."
      columns={[
        { key: 'name', label: 'Vendor' },
        { key: 'company_name', label: 'Company' },
        { key: 'territory', label: 'Territory' },
        { key: 'specialization', label: 'Specialization' },
        { key: 'onboarding_status', label: 'Status', type: 'status' },
        { key: 'rating', label: 'Rating' },
      ]}
      rows={data?.vendors || []}
      emptyMessage="No vendor records are available yet."
    />
  );
}

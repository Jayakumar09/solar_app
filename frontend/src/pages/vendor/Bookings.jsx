import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function VendorBookings() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Bookings & Site Visits"
      description="Coordinate site inspections, install dates, and customer readiness."
      columns={[
        { key: 'client_name', label: 'Client' },
        { key: 'plan_name', label: 'Plan' },
        { key: 'site_visit_date', label: 'Site Visit', render: (row) => row.site_visit_date ? new Date(row.site_visit_date).toLocaleDateString() : '—' },
        { key: 'installation_date', label: 'Install Date', render: (row) => row.installation_date ? new Date(row.installation_date).toLocaleDateString() : '—' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.bookings || []}
      emptyMessage="No vendor bookings are scheduled yet."
    />
  );
}

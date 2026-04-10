import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function VendorServices() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Service Requests"
      description="Manage post-installation work orders and maintenance commitments."
      columns={[
        { key: 'client_name', label: 'Client' },
        { key: 'service_type', label: 'Service Type' },
        { key: 'description', label: 'Description' },
        { key: 'scheduled_date', label: 'Scheduled', render: (row) => row.scheduled_date ? new Date(row.scheduled_date).toLocaleDateString() : '—' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.services || []}
      emptyMessage="No service requests are assigned to your team."
    />
  );
}

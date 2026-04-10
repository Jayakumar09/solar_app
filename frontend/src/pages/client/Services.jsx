import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientServices() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Service Requests"
      description="Track maintenance, repair, and upgrade requests after handover."
      columns={[
        { key: 'service_type', label: 'Service Type' },
        { key: 'description', label: 'Description' },
        { key: 'scheduled_date', label: 'Scheduled', render: (row) => row.scheduled_date ? new Date(row.scheduled_date).toLocaleDateString() : '—' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.services || []}
      emptyMessage="No service requests have been raised yet."
    />
  );
}

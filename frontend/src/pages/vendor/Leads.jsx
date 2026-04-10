import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function VendorLeads() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Assigned Leads"
      description="Review handoffs from the admin team and qualify next actions quickly."
      columns={[
        { key: 'name', label: 'Lead Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'service_type', label: 'Service Type' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.leads || []}
      emptyMessage="No assigned leads yet."
    />
  );
}

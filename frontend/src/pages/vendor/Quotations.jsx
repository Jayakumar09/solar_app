import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function VendorQuotations() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Vendor Quotations"
      description="Track proposal value, status, and active commercial conversations."
      columns={[
        { key: 'client_name', label: 'Client' },
        { key: 'plan_name', label: 'Plan' },
        { key: 'system_size_kw', label: 'System Size (kW)' },
        { key: 'total_amount', label: 'Amount', render: (row) => `Rs ${Number(row.total_amount || 0).toLocaleString()}` },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.quotations || []}
      emptyMessage="No quotations to manage right now."
    />
  );
}

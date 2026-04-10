import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function AdminQuotations() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  return (
    <ListPage
      title="Quotations"
      description="Monitor proposal value, ownership, and customer approvals."
      columns={[
        { key: 'client_name', label: 'Client' },
        { key: 'vendor_name', label: 'Vendor' },
        { key: 'plan_name', label: 'Plan' },
        { key: 'system_size_kw', label: 'System Size (kW)' },
        { key: 'total_amount', label: 'Amount', render: (row) => `Rs ${Number(row.total_amount || 0).toLocaleString()}` },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.quotations || []}
      emptyMessage="No quotations have been generated yet."
    />
  );
}

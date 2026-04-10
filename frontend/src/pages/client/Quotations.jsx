import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientQuotations() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Quotations"
      description="Compare proposal value, validity, and current approval stage."
      columns={[
        { key: 'plan_name', label: 'Plan' },
        { key: 'system_size_kw', label: 'System Size (kW)' },
        { key: 'total_amount', label: 'Quoted Amount', render: (row) => `Rs ${Number(row.total_amount || 0).toLocaleString()}` },
        { key: 'validity_date', label: 'Valid Until', render: (row) => row.validity_date ? new Date(row.validity_date).toLocaleDateString() : '—' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.quotations || []}
      emptyMessage="No quotations have been shared yet."
    />
  );
}

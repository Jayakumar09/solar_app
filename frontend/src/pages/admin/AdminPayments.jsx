import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function AdminPayments() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  return (
    <ListPage
      title="Payments"
      description="Track due collections, paid milestones, and partner-linked payouts."
      columns={[
        { key: 'title', label: 'Payment' },
        { key: 'client_name', label: 'Client' },
        { key: 'vendor_name', label: 'Vendor' },
        { key: 'payment_stage', label: 'Stage' },
        { key: 'amount', label: 'Amount', render: (row) => `Rs ${Number(row.amount || 0).toLocaleString()}` },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.payments || []}
      emptyMessage="No payments are currently recorded."
    />
  );
}

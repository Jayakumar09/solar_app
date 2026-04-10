import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientPayments() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Payments"
      description="Review payment stages, due dates, and collection status for your project."
      columns={[
        { key: 'title', label: 'Payment' },
        { key: 'payment_stage', label: 'Stage' },
        { key: 'amount', label: 'Amount', render: (row) => `Rs ${Number(row.amount || 0).toLocaleString()}` },
        { key: 'due_date', label: 'Due Date', render: (row) => row.due_date ? new Date(row.due_date).toLocaleDateString() : '—' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.payments || []}
      emptyMessage="No payments are due right now."
    />
  );
}

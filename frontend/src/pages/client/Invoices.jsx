import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientInvoices() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Invoices"
      description="Access issued invoices, due dates, and current settlement state."
      columns={[
        { key: 'invoice_number', label: 'Invoice Number' },
        { key: 'amount', label: 'Amount', render: (row) => `Rs ${Number(row.amount || 0).toLocaleString()}` },
        { key: 'due_date', label: 'Due Date', render: (row) => row.due_date ? new Date(row.due_date).toLocaleDateString() : '—' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.invoices || []}
      emptyMessage="No invoices have been issued yet."
    />
  );
}

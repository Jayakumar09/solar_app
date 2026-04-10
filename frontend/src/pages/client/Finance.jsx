import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientFinance() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Finance Status"
      description="Follow loan approvals, lender programs, and repayment expectations."
      columns={[
        { key: 'lender_name', label: 'Lender' },
        { key: 'scheme_name', label: 'Scheme' },
        { key: 'amount_requested', label: 'Requested', render: (row) => `Rs ${Number(row.amount_requested || 0).toLocaleString()}` },
        { key: 'approved_amount', label: 'Approved', render: (row) => `Rs ${Number(row.approved_amount || 0).toLocaleString()}` },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.finance || []}
      emptyMessage="No finance applications are linked to your account yet."
    />
  );
}

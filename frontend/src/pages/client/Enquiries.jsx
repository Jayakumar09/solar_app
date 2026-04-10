import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientEnquiries() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Enquiries"
      description="Review the enquiries and active project conversations tied to your account."
      columns={[
        { key: 'title', label: 'Topic' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'created_at', label: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
      ]}
      rows={data?.enquiries || []}
      emptyMessage="No enquiries have been recorded yet."
    />
  );
}

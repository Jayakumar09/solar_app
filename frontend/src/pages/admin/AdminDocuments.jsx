import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function AdminDocuments() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  return (
    <ListPage
      title="Documents"
      description="Review uploaded commercial, installation, and customer-facing document records."
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'document_type', label: 'Type' },
        { key: 'owner_name', label: 'Owner' },
        { key: 'visibility', label: 'Visibility' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.documents || []}
      emptyMessage="No documents are available yet."
    />
  );
}

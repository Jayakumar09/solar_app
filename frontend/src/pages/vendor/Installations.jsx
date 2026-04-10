import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function VendorInstallations() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Installation Tracking"
      description="Keep delivery, on-site execution, and completion progress visible."
      columns={[
        { key: 'clientName', label: 'Client' },
        { key: 'siteVisitDate', label: 'Site Visit', render: (row) => row.siteVisitDate ? new Date(row.siteVisitDate).toLocaleDateString() : '—' },
        { key: 'installationDate', label: 'Installation', render: (row) => row.installationDate ? new Date(row.installationDate).toLocaleDateString() : '—' },
        { key: 'progressPercent', label: 'Progress', render: (row) => `${row.progressPercent || 0}%` },
        { key: 'installationStatus', label: 'Status', type: 'status' },
      ]}
      rows={data?.installations || []}
      emptyMessage="No installation tracking items exist yet."
    />
  );
}

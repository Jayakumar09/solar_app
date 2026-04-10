import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientInstallationProgress() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Installation Progress"
      description="See where your project sits across inspection, installation, and completion."
      columns={[
        { key: 'planName', label: 'Plan' },
        { key: 'progressPercent', label: 'Progress', render: (row) => `${row.progressPercent || 0}%` },
        { key: 'siteVisitDate', label: 'Site Visit', render: (row) => row.siteVisitDate ? new Date(row.siteVisitDate).toLocaleDateString() : '—' },
        { key: 'installationDate', label: 'Install Date', render: (row) => row.installationDate ? new Date(row.installationDate).toLocaleDateString() : '—' },
        { key: 'installationStatus', label: 'Status', type: 'status' },
      ]}
      rows={data?.installationProgress || []}
      emptyMessage="Installation progress will appear once work is scheduled."
    />
  );
}

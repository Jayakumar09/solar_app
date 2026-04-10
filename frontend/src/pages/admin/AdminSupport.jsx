import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function AdminSupport() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  return (
    <ListPage
      title="Support Tickets"
      description="Surface blocked installations, finance questions, and warranty escalations."
      columns={[
        { key: 'requester_name', label: 'Requester' },
        { key: 'subject', label: 'Subject' },
        { key: 'category', label: 'Category' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
      rows={data?.supportTickets || []}
      emptyMessage="No support tickets are open right now."
    />
  );
}

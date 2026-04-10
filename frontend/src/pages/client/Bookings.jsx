import ListPage from '../../components/dashboard/ListPage';
import LoadingState from '../../components/dashboard/LoadingState';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientBookings() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;
  return (
    <ListPage
      title="Booking Status"
      description="Track every confirmed milestone from booking through commissioning."
      columns={[
        { key: 'plan_name', label: 'Plan' },
        { key: 'booking_date', label: 'Booked On', render: (row) => row.booking_date ? new Date(row.booking_date).toLocaleDateString() : '—' },
        { key: 'inspection_status', label: 'Inspection', type: 'status' },
        { key: 'installation_status', label: 'Installation', type: 'status' },
        { key: 'status', label: 'Overall', type: 'status' },
      ]}
      rows={data?.bookings || []}
      emptyMessage="No bookings have been confirmed yet."
    />
  );
}

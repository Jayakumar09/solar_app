import { CalendarDays, CreditCard, HandCoins, Headset } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientDashboard() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6">
      <PageHeader title="Client Overview" description="Follow your project, finance journey, and service commitments from one place." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarDays} label="Open Bookings" value={metrics.openBookings || 0} />
        <StatCard icon={CreditCard} label="Pending Payments" value={metrics.pendingPayments || 0} tone="amber" />
        <StatCard icon={HandCoins} label="Active Enquiries" value={metrics.activeEnquiries || 0} tone="blue" />
        <StatCard icon={Headset} label="Service Requests" value={metrics.serviceRequests || 0} tone="violet" />
      </div>
      <DataTable
        columns={[
          { key: 'planName', label: 'Plan' },
          { key: 'progressPercent', label: 'Progress', render: (row) => `${row.progressPercent || 0}%` },
          { key: 'siteVisitDate', label: 'Site Visit', render: (row) => row.siteVisitDate ? new Date(row.siteVisitDate).toLocaleDateString() : '—' },
          { key: 'installationDate', label: 'Installation', render: (row) => row.installationDate ? new Date(row.installationDate).toLocaleDateString() : '—' },
          { key: 'installationStatus', label: 'Status', type: 'status' },
        ]}
        rows={data?.installationProgress || []}
        emptyMessage="Your installation timeline will appear here once a booking is confirmed."
      />
    </div>
  );
}

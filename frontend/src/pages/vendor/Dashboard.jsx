import { CalendarDays, CreditCard, Files, LayoutDashboard, Settings2, Users } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function VendorDashboard() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6">
      <PageHeader title="Vendor Overview" description="Stay on top of assigned leads, active site work, billing, and service follow-ups." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Assigned Leads" value={metrics.assignedLeads || 0} />
        <StatCard icon={LayoutDashboard} label="Pending Quotations" value={metrics.pendingQuotations || 0} tone="blue" />
        <StatCard icon={CalendarDays} label="Active Bookings" value={metrics.activeBookings || 0} tone="amber" />
        <StatCard icon={Settings2} label="Avg Installation Progress" value={`${metrics.installationProgressAvg || 0}%`} tone="violet" />
        <StatCard icon={CreditCard} label="Pending Payments" value={metrics.pendingPayments || 0} tone="rose" />
        <StatCard icon={Files} label="Open Services" value={metrics.openServices || 0} tone="slate" />
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Lead' },
          { key: 'phone', label: 'Phone' },
          { key: 'city', label: 'City' },
          { key: 'service_type', label: 'Service Type' },
          { key: 'status', label: 'Status', type: 'status' },
        ]}
        rows={data?.leads || []}
        emptyMessage="No assigned leads right now."
      />
    </div>
  );
}

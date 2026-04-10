import { Briefcase, CreditCard, LayoutDashboard, ShieldCheck, Users, Wrench } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function AdminOverview() {
  const { data, loading } = usePortalSummary();

  if (loading) {
    return <LoadingState />;
  }

  const metrics = data?.metrics || {};
  const recentBookings = (data?.bookings || []).slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" description="Audit the operating pipeline across demand generation, fulfilment, and support." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Clients" value={metrics.totalClients || 0} />
        <StatCard icon={Briefcase} label="Vendors" value={metrics.totalVendors || 0} tone="blue" />
        <StatCard icon={LayoutDashboard} label="Leads" value={metrics.totalLeads || 0} tone="amber" />
        <StatCard icon={Wrench} label="Active Bookings" value={metrics.activeBookings || 0} tone="violet" />
        <StatCard icon={CreditCard} label="Pending Payments" value={metrics.pendingPayments || 0} tone="rose" />
        <StatCard icon={ShieldCheck} label="Open Tickets" value={metrics.openTickets || 0} tone="slate" />
        <StatCard icon={LayoutDashboard} label="Quotations" value={metrics.totalQuotations || 0} tone="emerald" />
        <StatCard icon={CreditCard} label="Collected Revenue" value={`Rs ${Number(metrics.monthlyRevenue || 0).toLocaleString()}`} tone="blue" />
      </div>

      <DataTable
        columns={[
          { key: 'customer_name', label: 'Client' },
          { key: 'vendor_name', label: 'Vendor' },
          { key: 'plan_name', label: 'Plan' },
          { key: 'progress_percent', label: 'Progress', render: (row) => `${row.progress_percent || 0}%` },
          { key: 'installation_status', label: 'Installation', type: 'status' },
          { key: 'status', label: 'Overall', type: 'status' },
        ]}
        rows={recentBookings}
        emptyMessage="No bookings are available yet."
      />
    </div>
  );
}

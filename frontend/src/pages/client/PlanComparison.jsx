import LoadingState from '../../components/dashboard/LoadingState';
import PageHeader from '../../components/dashboard/PageHeader';
import usePortalSummary from '../../hooks/usePortalSummary';

export default function ClientPlanComparison() {
  const { data, loading } = usePortalSummary();
  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader title="Plan Comparison" description="Evaluate available plans, features, and estimated commercial fit before final approval." />
      <div className="grid gap-5 lg:grid-cols-3">
        {(data?.plans || []).map((plan) => (
          <div key={plan.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">{plan.type}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">Rs {Number(plan.price || 0).toLocaleString()}</p>
            <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              {(plan.features || []).map((feature) => (
                <li key={feature} className="rounded-2xl bg-slate-50 px-3 py-2">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

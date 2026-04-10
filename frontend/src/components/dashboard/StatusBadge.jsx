const colorMap = {
  new: 'bg-sky-100 text-sky-700',
  contacted: 'bg-indigo-100 text-indigo-700',
  quoted: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-cyan-100 text-cyan-700',
  requested: 'bg-fuchsia-100 text-fuchsia-700',
  completed: 'bg-emerald-100 text-emerald-700',
  open: 'bg-orange-100 text-orange-700',
  issued: 'bg-slate-100 text-slate-700',
  paid: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
  under_review: 'bg-violet-100 text-violet-700',
  in_progress: 'bg-cyan-100 text-cyan-700',
  'in-progress': 'bg-cyan-100 text-cyan-700',
  responded: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-700',
  uploaded: 'bg-slate-100 text-slate-700',
  sent: 'bg-indigo-100 text-indigo-700',
};

export default function StatusBadge({ value }) {
  const normalized = `${value || 'pending'}`.toLowerCase();
  const classes = colorMap[normalized] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}>
      {normalized.replace(/_/g, ' ')}
    </span>
  );
}

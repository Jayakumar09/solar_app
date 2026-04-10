export default function StatCard({ icon: Icon, label, value, tone = 'emerald' }) {
  const tones = {
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-400 to-amber-500',
    blue: 'from-sky-500 to-sky-600',
    slate: 'from-slate-700 to-slate-900',
    rose: 'from-rose-500 to-rose-600',
    violet: 'from-violet-500 to-violet-600',
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.5)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        {Icon ? (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${tones[tone] || tones.emerald}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

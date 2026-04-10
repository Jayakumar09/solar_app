export default function LoadingState({ label = 'Loading dashboard data...' }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-sm text-slate-500 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
      {label}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Menu, Sun, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardConfigs } from '../../config/dashboardConfig';
import { normalizeRole } from '../../utils/roles';

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const normalizedRole = normalizeRole(role || user?.role);
  const config = useMemo(() => dashboardConfigs[normalizedRole], [normalizedRole]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef4f1_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-40 rounded-2xl border border-white/80 bg-white/90 p-3 text-slate-700 shadow-lg lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-300 lg:static lg:translate-x-0`}>
          <aside className="flex h-full flex-col border-r border-white/60 bg-slate-950 px-6 py-6 text-white shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-emerald-500 text-slate-950">
                  <Sun className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold">Green Hybrid</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{config?.title}</p>
                </div>
              </Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-xl p-2 text-slate-300 lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{user?.name || 'Workspace User'}</p>
              <p className="mt-1 text-sm text-slate-400">{user?.email || 'workspace@greenhybridpower.in'}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-emerald-300">{normalizedRole}</p>
            </div>

            <nav className="mt-8 flex-1 space-y-2">
              {config?.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="space-y-3 border-t border-white/10 pt-6">
              <Link to="/" className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white">
                Return to Website
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/12 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>

        {mobileOpen ? <button type="button" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" /> : null}

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-white/60 bg-white/70 px-6 py-6 backdrop-blur lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{config?.title}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{config?.subtitle}</h1>
          </header>
          <main className="flex-1 px-6 py-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, LayoutDashboard, Users, Calendar, FileText, MessageSquare, Settings, Package, HelpCircle, Menu, X, LogOut, ChevronLeft, Zap } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/leads', label: 'Leads', icon: Users },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/quotes', label: 'Quotes', icon: FileText },
    { path: '/admin/customers', label: 'Customers', icon: Package },
    { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    { path: '/admin/services', label: 'Services', icon: Settings },
    { path: '/admin/plans', label: 'Plans', icon: Zap }
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        background: '#111827',
        borderRight: '1px solid #374151',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        transition: 'width 0.3s',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          height: '70px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sun size={24} color="#fff" />
          </div>
          {sidebarOpen && (
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Green Hybrid</span>
              <span style={{ fontSize: '0.75rem', color: '#22c55e', display: 'block' }}>Admin Panel</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '80px',
            width: '24px',
            height: '24px',
            background: '#374151',
            border: 'none',
            borderRadius: '50%',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 101
          }}
        >
          <ChevronLeft size={14} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)' }} />
        </button>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              title={!sidebarOpen ? item.label : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                color: isActive(item.path, item.exact) ? '#22c55e' : '#94a3b8',
                background: isActive(item.path, item.exact) ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              color: '#94a3b8',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}
          >
            <ChevronLeft size={20} />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              width: '100%',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '70px',
        transition: 'margin-left 0.3s',
        background: '#0a1628',
        minHeight: '100vh'
      }}>
        <header style={{
          background: '#111827',
          borderBottom: '1px solid #374151',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Welcome, {user?.name || 'Admin'}</h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Manage your business operations</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-success">Admin</span>
          </div>
        </header>

        <div style={{ padding: '1.5rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

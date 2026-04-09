import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, Menu, X, Home, Info, Target, Grid, Star, Calendar, Phone, HelpCircle, FileText, LogOut, User } from 'lucide-react';

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/vision', label: 'Vision', icon: Target },
    { path: '/services', label: 'Services', icon: Grid },
    { path: '/why-choose-us', label: 'Why Us', icon: Star },
    { path: '/book-inspection', label: 'Book Inspection', icon: Calendar },
    { path: '/contact', label: 'Contact', icon: Phone },
    { path: '/faq', label: 'FAQ', icon: HelpCircle }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(10, 22, 40, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sun size={24} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>Green Hybrid</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 300, color: '#22c55e' }}> Power</span>
              </div>
            </Link>

            <div style={{ display: 'none', gap: '2rem' }} className="desktop-nav">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: isActive(link.path) ? '#22c55e' : '#94a3b8',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/customer'}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  Login
                </Link>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
                className="mobile-menu-btn"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>

        {mobileOpen && (
          <div style={{
            background: '#111827',
            padding: '1rem',
            borderTop: '1px solid #374151'
          }} className="mobile-nav">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  color: isActive(link.path) ? '#22c55e' : '#94a3b8',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main style={{ flex: 1, paddingTop: '70px' }}>
        <Outlet />
      </main>

      <footer style={{
        background: '#111827',
        borderTop: '1px solid #374151',
        padding: '3rem 0 1.5rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sun size={20} color="#fff" />
                </div>
                <span style={{ fontWeight: 600 }}>Green Hybrid Power</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Leading provider of rooftop solar systems, hybrid solar + wind solutions, and battery backup systems for homes and businesses.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/services" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>Services</Link>
                <Link to="/about" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>About Us</Link>
                <Link to="/vision" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>Our Vision</Link>
                <Link to="/why-choose-us" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>Why Choose Us</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/services" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>Basic Solar</Link>
                <Link to="/services" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>Hybrid Systems</Link>
                <Link to="/services" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>Premium Solutions</Link>
                <Link to="/services" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>AMC Services</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <Phone size={16} />
                  +91 98765 43210
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <Mail size={16} />
                  info@greenhybridpower.in
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>123 Renewable Energy Park, Bangalore, Karnataka 560001</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
              © 2024 Green Hybrid Power. All rights reserved. | Made with ☀️ in India
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#64748b' }}><Facebook size={20} /></a>
              <a href="#" style={{ color: '#64748b' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: '#64748b' }}><Instagram size={20} /></a>
              <a href="#" style={{ color: '#64748b' }}><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-nav { display: flex; flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default PublicLayout;

import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Ensure a default meta description exists for pages that don't set one
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    if (!desc.content || desc.content.trim() === '') {
      desc.content = 'Green Hybrid Power - Rooftop solar, hybrid solutions, and smart monitoring for homes and businesses in India.';
    }

    // Ensure canonical exists
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://greenhybridpower.in${location.pathname}`;
  }, [location.pathname]);

  return (
    <>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}

export default Layout;

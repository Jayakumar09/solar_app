import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';

export default function PublicRoute() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}

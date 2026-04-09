import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

function Layout() {
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

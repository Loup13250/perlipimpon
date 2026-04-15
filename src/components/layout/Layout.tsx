import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloralBorders from './FloralBorders';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`site-layout ${isHome ? 'is-home' : ''}`}>
      {!isAdmin && <Header />}
      {!isAdmin && <FloralBorders />}
      <main className="site-main" style={isAdmin ? { paddingTop: 0 } : {}}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

/**
 * Layout wrapper — Header + contenu + Footer.
 * Utilisé comme élément parent dans le routeur.
 */

import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="site-layout">
      {!isAdmin && <Header />}
      <main className="site-main" style={isAdmin ? { paddingTop: 0 } : {}}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

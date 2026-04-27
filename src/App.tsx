/**
 * App — Routeur principal de l'application.
 * Toutes les routes sont définies ici avec lazy loading pour la performance.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import { useConfig } from './hooks/useConfig';
import { useEffect } from 'react';
import { ToastProvider } from './components/Toast';

// Lazy loading : chaque page est chargée uniquement quand elle est visitée
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Spinner minimal pendant le chargement d'une page
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-cream)',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid var(--color-gold-light)',
        borderTopColor: 'var(--color-gold)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

function SEOInjector() {
  const { config } = useConfig();

  useEffect(() => {
    if (config.metaTitle) {
      document.title = config.metaTitle;
    }
    if (config.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', config.metaDescription);
    }
  }, [config.metaTitle, config.metaDescription]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <SEOInjector />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
            <Route path="/creations" element={<Suspense fallback={<PageLoader />}><ShopPage /></Suspense>} />
            <Route path="/creations/:id" element={<Suspense fallback={<PageLoader />}><ProductDetailPage /></Suspense>} />
            <Route path="/a-propos" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
            <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminPage /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

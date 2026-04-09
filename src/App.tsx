/**
 * App — Routeur principal de l'application.
 * Toutes les routes sont définies ici.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { useConfig } from './hooks/useConfig';
import { useEffect } from 'react';

function SEOInjector() {
  const { config } = useConfig();

  useEffect(() => {
    // MAJ Titre
    if (config.metaTitle) {
      document.title = config.metaTitle;
    }
    // MAJ Meta Description
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
    <BrowserRouter>
      <SEOInjector />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/creations" element={<ShopPage />} />
          <Route path="/creations/:id" element={<ProductDetailPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

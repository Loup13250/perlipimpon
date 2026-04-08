/**
 * Point d'entrée — initialise React et charge les styles.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Styles — chargés dans l'ordre pour respecter la cascade CSS
import './styles/index.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/home.css';
import './styles/shop.css';
import './styles/product.css';
import './styles/about.css';
import './styles/contact.css';
import './styles/admin.css';

import App from './App';

// Force reset local storage to load new sample media
localStorage.removeItem('articles');
localStorage.removeItem('perlipimpon_articles_v2');
localStorage.removeItem('perlipimpon_config_v2');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

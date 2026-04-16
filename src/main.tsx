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

// Le chargement des données se fait désormais via Firestore avec migration automatique.


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Footer du site — compact, 3 colonnes, liens, réseaux sociaux.
 */

import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';


export default function Footer() {
  const { config } = useConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Pied de page">
      <div className="container">

        <div className="footer-grid">
          {/* Marque */}
          <div className="footer-brand">
            <h3>{config.nomMarque || 'Perlipimpon'}</h3>
            <p>
              {config.tagline || 'Création de bijoux fantaisie. Chaque pièce est unique, fabriquée à la main avec amour.'}
            </p>
            <div className="footer-social" style={{ marginTop: 'var(--space-md)' }} aria-label="Réseaux sociaux">
              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation + Catégories */}
          <nav className="footer-column" aria-label="Navigation du site">
            <h4>Explorer</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/creations">Toutes les créations</Link></li>
              <li><Link to="/a-propos">Notre histoire</Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact</h4>
            <a href={`tel:${config.telephone.replace(/\s/g, '')}`}>
              {config.telephone}
            </a>
            <a href={`mailto:${config.email}`}>{config.email}</a>
            <nav aria-label="Catégories de bijoux" style={{ marginTop: 'var(--space-sm)' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {config.categories.slice(0, 4).map(cat => (
                  <li key={cat.name}>
                    <Link to={`/creations?cat=${encodeURIComponent(cat.name)}`} style={{ display: 'block', fontSize: 'var(--text-xs)', padding: '12px 0', margin: '-10px 0' }}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} {config.nomMarque || 'Perlipimpon'} — Tous droits réservés</p>
          <p>Bijoux artisanaux faits main avec amour <span aria-hidden="true">❤</span></p>
        </div>
      </div>
    </footer>
  );
}

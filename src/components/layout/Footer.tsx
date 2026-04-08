/**
 * Footer du site — grille 4 colonnes, liens, réseaux sociaux.
 */

import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';

export default function Footer() {
  const { config } = useConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Marque */}
          <div className="footer-brand">
            <h3>✦ {config.nomMarque || 'Perlipimpon'}</h3>
            <p>
              {config.tagline || 'Création de bijoux fantaisies & co. Chaque pièce est unique, fabriquée à la main avec amour.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-column">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/creations">Créations</Link>
            <Link to="/a-propos">À propos</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Catégories */}
          <div className="footer-column">
            <h4>Catégories</h4>
            {config.categories.map(cat => (
              <Link key={cat.name} to={`/creations?cat=${encodeURIComponent(cat.name)}`}>{cat.name}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact</h4>
            <a href={`tel:${config.telephone.replace(/\s/g, '')}`}>
              {config.telephone}
            </a>
            <a href={`mailto:${config.email}`}>{config.email}</a>

            <div className="footer-social">
              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Perlipimpon — Tous droits réservés</p>
          <p>
            Bijoux artisanaux faits main avec ♥
          </p>
        </div>
      </div>
    </footer>
  );
}

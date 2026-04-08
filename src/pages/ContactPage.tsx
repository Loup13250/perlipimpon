import { useConfig } from '../hooks/useConfig';

export default function ContactPage() {
  const { config } = useConfig();

  return (
    <div className="contact-page">
      <div className="container">
        {/* Hero */}
        <div className="contact-hero">
          <h1>Contactez-nous</h1>
          <p>
            Une question, une envie, une commande personnalisée ? N'hésitez pas à nous contacter directement.
          </p>
        </div>

        {/* Fiche Contact */}
        <div className="contact-card">
          <div className="contact-info">
            <div className="contact-info__card">
              <div className="contact-info__icon">📞</div>
              <div className="contact-info__text">
                <h3>Téléphone</h3>
                <p>
                  <a href={`tel:${config.telephone.replace(/\s/g, '')}`}>
                    {config.telephone}
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-info__card">
              <div className="contact-info__icon">✉️</div>
              <div className="contact-info__text">
                <h3>Email</h3>
                <p>
                  <a href={`mailto:${config.email}`}>{config.email}</a>
                </p>
              </div>
            </div>

            <div className="contact-info__card">
              <div className="contact-info__icon">🕐</div>
              <div className="contact-info__text">
                <h3>Disponibilité</h3>
                <p>Du lundi au samedi, 9h – 19h</p>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="contact-social">
              <h3>Retrouvez-nous sur les réseaux</h3>
              <div className="contact-social__links">
                {config.facebook && (
                  <a
                    href={config.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            <div className="contact-action" style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
              <a href={`mailto:${config.email}`} className="btn btn--primary btn--lg">
                Écrire un email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

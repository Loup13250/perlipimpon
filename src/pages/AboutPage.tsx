/**
 * Page À Propos — Histoire de Perlipimpon, Lithothérapie et Processus de Création.
 */

import { Link } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';

export default function AboutPage() {
  const { config, configLoading } = useConfig();

  if (configLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  const aboutTitle = config?.aboutTitle || "L'Éclat des Pierres, l'Énergie du Corps";
  const aboutText1 = config?.aboutText1 || "Chaque gemme est sélectionnée pour sa vibration unique. Chez Perlipimpon, nous croyons que la beauté d'un bijou réside autant dans son éclat que dans les bienfaits qu'il procure à l'âme.";
  const aboutText2 = config?.aboutText2 || "De l'apaisement du Quartz Rose à la force protectrice de l'Améthyste, nous créons des talismans modernes pensés pour harmoniser vos énergies et vos humeurs au quotidien.";
  const aboutImage = config?.aboutImage || "/images/about_workshop.png";
  const lithotherapyValues = config?.lithotherapyValues || [];
  const processSteps = config?.processSteps || [];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Compact */}
        <div className="about-hero">
          <h1>{config?.aboutHeroTitle || 'À propos de Perlipimpon'}</h1>
          <p>{config?.aboutHeroSubtitle || "L'histoire d'une passion pour les pierres et la création artisanale"}</p>
        </div>

        {/* Story Section */}
        <div className="about-story">
          <div className="about-story__image">
            <picture>
              <source srcSet={aboutImage.replace('.png', '.webp')} type="image/webp" />
              <img 
                src={aboutImage}
                alt="Notre atelier de création" 
                loading="lazy" 
                decoding="async"
                width="600" 
                height="800" 
              />
            </picture>
          </div>
          <div className="about-story__text">
            <h2>{aboutTitle}</h2>
            <p>{aboutText1}</p>
            <p>{aboutText2}</p>
          </div>
        </div>

        {/* Lithotherapy Deep Dive */}
        <div className="about-values">
          <div className="section-title">
            <h2>L'Âme des Pierres</h2>
            <p>La Lithothérapie au cœur de chaque parure</p>
          </div>

          {/* Suppression de reveal-item pour garantir la visibilité immédiate */}
          <div className="values-grid">
            {lithotherapyValues.map((value, index) => (
              <div className="value-card" key={index}>
                <div className="value-card__icon">
                  {index % 3 === 0 && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  )}
                  {index % 3 === 1 && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  )}
                  {index % 3 === 2 && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      <path d="M5 3v4" />
                      <path d="M19 17v4" />
                      <path d="M3 5h4" />
                      <path d="M17 19h4" />
                    </svg>
                  )}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section (Vertical Timeline) */}
        <div className="about-process">
          <div className="section-title">
            <h2>Le voyage de création</h2>
            <p>Un savoir-faire minutieux, de l'inspiration à l'écrin</p>
          </div>

          {/* Suppression de reveal-item pour garantir la visibilité immédiate */}
          <div className="process-timeline">
            <div className="process-timeline__line"></div>
            
            {processSteps.map((step, index) => (
              <div className="process-item" key={index}>
                <div className="process-item__marker">{step.number}</div>
                <div className="process-item__content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section about-cta">
          <h2>Envie d'une création personnalisée ?</h2>
          <p>Nous pouvons imaginer ensemble le bijou qui résonne avec votre énergie.</p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}

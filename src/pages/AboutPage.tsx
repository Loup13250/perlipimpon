/**
 * Page À Propos — histoire de Perlipimpon et sa philosophie.
 */

import { Link } from 'react-router-dom';
import { useScrollRevealGroup } from '../hooks/useScrollReveal';
import { useConfig } from '../hooks/useConfig';

const values = [
  {
    icon: '✋',
    title: 'Fait main',
    description: 'Chaque bijou est entièrement façonné à la main, avec soin et patience. Aucune production en série.',
  },
  {
    icon: '💎',
    title: 'Pierres naturelles',
    description: 'Nous sélectionnons des pierres naturelles de qualité : pierre de lune, perles, améthyste et bien d\'autres.',
  },
  {
    icon: '🌿',
    title: 'Pièces uniques',
    description: 'Chaque création est unique. Deux bijoux ne sont jamais exactement identiques, c\'est la magie de l\'artisanat.',
  },
];

// Le processus de création est dynamique depuis la config (processSteps)

export default function AboutPage() {
  const valuesRef = useScrollRevealGroup();
  const processRef = useScrollRevealGroup();
  const { config, configLoading } = useConfig();

  if (configLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <h1>À propos de Perlipimpon</h1>
          <p>
            L'histoire d'une passion pour la création de bijoux artisanaux
          </p>
        </div>

        {/* Story */}
        <div className="about-story">
          <div className="about-story__image" style={{ padding: 0, overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <img src={config.aboutImage || "/images/moonstone_necklace.png"} alt="A propos" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
          </div>
          <div className="about-story__text">
            <h2>{config.aboutTitle || 'Une passion devenue création'}</h2>
            <p>{config.aboutText1}</p>
            {config.aboutText2 && <p>{config.aboutText2}</p>}
          </div>
        </div>

        {/* Valeurs */}
        <div className="about-values">
          <div className="section-title">
            <h2>Nos valeurs</h2>
            <p>Ce qui guide chaque création</p>
          </div>

          <div className="values-grid" ref={valuesRef}>
            {values.map((v) => (
              <div key={v.title} className="value-card reveal-item">
                <div className="value-card__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Processus */}
        <div className="about-process">
          <div className="section-title">
            <h2>Le processus de création</h2>
            <p>De l'idée au bijou fini, chaque étape compte</p>
          </div>

          <div className="process-steps" ref={processRef}>
            {(config.processSteps || []).map((step, idx) => (
              <div key={idx} className="process-step reveal-item">
                <div className="process-step__number">{step.number || idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section" style={{ borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-3xl)' }}>
          <h2>{config.ctaTitle}</h2>
          <p>
            {config.ctaDescription}
          </p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Parlons de votre projet
          </Link>
        </div>
      </div>
    </div>
  );
}

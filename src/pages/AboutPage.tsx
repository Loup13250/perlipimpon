/**
 * Page À Propos — histoire de Perlipimpon et sa philosophie.
 */

import { Link } from 'react-router-dom';
import { useScrollRevealGroup } from '../hooks/useScrollReveal';
import { useConfig } from '../hooks/useConfig';


// Le processus de création est dynamique depuis la config (processSteps)

export default function AboutPage() {
  const { config, configLoading } = useConfig();
  const valuesRef = useScrollRevealGroup();
  const processRef = useScrollRevealGroup({}, [config.processSteps]);

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
            <img src={config.aboutImage || "/images/moonstone_necklace.png"} alt="A propos" loading="lazy" width="600" height="800" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
          </div>
          <div className="about-story__text">
            <h2>{config.aboutTitle || 'Une passion devenue création'}</h2>
            <p>{config.aboutText1}</p>
            {config.aboutText2 && <p>{config.aboutText2}</p>}
          </div>
        </div>

        {/* La Magie de la Lithothérapie */}
        <div className="about-values">
          <div className="section-title">
            <h2>L'Âme des Pierres</h2>
            <p>La Lithothérapie au cœur de nos créations</p>
          </div>

          <div className="lithotherapy-content" ref={valuesRef}>
            <div className="lithotherapy-text" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', lineHeight: '1.8', color: 'var(--color-gray-600)', fontSize: '1.05rem', marginBottom: 'var(--space-2xl)' }}>
              <p>
                Chez Perlipimpon, la beauté d'un bijou ne s'arrête pas à son esthétique. Nous accordons une importance fondamentale à l'énergie que chaque pierre renferme. Nos gemmes sont rigoureusement étudiées et sélectionnées pour leurs vertus thérapeutiques, offrant un accompagnement subtil de l'âme et du corps.
              </p>
            </div>

            <div className="values-grid">
              
              <div className="value-card reveal-item" style={{ border: '1px solid var(--color-gold-light)', padding: 'var(--space-xl)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🌸</div>
                <h3>L'Harmonie du Cœur</h3>
                <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-gray-600)' }}>
                  Des joyaux comme le Quartz Rose ou la Rhodonite sont spécifiquement choisis pour apaiser les blessures émotionnelles. Ils ouvrent le chakra du cœur, diffusent une douceur enveloppante et favorisent la paix intérieure et l'amour de soi.
                </p>
              </div>

              <div className="value-card reveal-item" style={{ border: '1px solid var(--color-gold-light)', padding: 'var(--space-xl)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🌙</div>
                <h3>Sérénité Mentale</h3>
                <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-gray-600)' }}>
                  Pour l'anxiété et le surmenage, nous marions l'Améthyste ou la Labradorite. Ces pierres libèrent l'esprit des ruminations, équilibrent le système nerveux profond et stimulent des nuits paisibles et réparatrices.
                </p>
              </div>

              <div className="value-card reveal-item" style={{ border: '1px solid var(--color-gold-light)', padding: 'var(--space-xl)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🌿</div>
                <h3>Équilibre du Corps</h3>
                <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-gray-600)' }}>
                  La répercussion physique est intime. L'Oeil de Tigre ou la Cornaline, aux vibrations chaudes, réveillent la vitalité corporelle, apaisent le système digestif et l'intestin, et relancent l'énergie vitale depuis les fondations du corps.
                </p>
              </div>

            </div>
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

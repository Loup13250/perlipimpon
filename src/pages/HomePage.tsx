/**
 * Page d'accueil — vitrine du site Perlipimpon.
 * Sections : Hero, À propos preview, Produits vedette,
 * Catégories, Témoignages, CTA.
 */

import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useConfig } from '../hooks/useConfig';
import { useScrollRevealGroup } from '../hooks/useScrollReveal';
import { formatPrice, truncateText } from '../utils/helpers';

export default function HomePage() {
  const { featuredArticles, articlesLoading } = useArticles();
  const { config, configLoading } = useConfig();
  const featuredRef = useScrollRevealGroup({}, [featuredArticles]);
  const categoriesRef = useScrollRevealGroup({}, [config.categories]);
  const testimonialsRef = useScrollRevealGroup({}, [config.testimonials]);

  if (configLoading || articlesLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-black)', color: 'var(--color-gold)' }}>
        <p>Chargement des collections...</p>
      </div>
    );
  }

  return (
    <>
      {/* ── HERO ──────────────────────────── */}
      <section className="hero" style={{ backgroundImage: `url('${config.heroImage}')` }}>
        <div className="hero__glow-1" />
        <div className="hero__glow-2" />

        <div className="hero__content">
          <p className="hero__subtitle">{config.heroSubtitle}</p>
          <h1 className="hero__title">
            {config.heroTitle1} <span>{config.heroTitle2}</span>
          </h1>
          <p className="hero__description">
            {config.heroDescription}
          </p>
          <div className="hero__actions">
            <Link to="/creations" className="btn btn--primary btn--lg">
              Découvrir les créations
            </Link>
            <Link to="/a-propos" className="btn btn--outline btn--lg" style={{ borderColor: 'var(--color-gold-light)', color: 'var(--color-gold-light)' }}>
              Notre histoire
            </Link>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span>Défiler</span>
          <span className="arrow">↓</span>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ─────────────────── */}
      <section className="about-preview">
        <div className="container">
          <div className="about-preview__grid">
            <div className="about-preview__image" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={config.aboutImage || "/images/moonstone_necklace.png"} alt="Création artisanale" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="about-preview__text">
              <h2>
                {config.aboutTitle || 'Fait main, fait avec cœur'}
              </h2>
              <p>{config.aboutText1}</p>
              {config.aboutText2 && <p>{config.aboutText2}</p>}
              <p className="about-preview__signature">— {config.nomMarque || 'Perlipimpon'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUITS VEDETTE ──────────────── */}
      <section className="featured">
        <div className="container">
          <div className="section-title">
            <h2>Nos pièces vedettes</h2>
            <p>Découvrez nos créations les plus appréciées</p>
          </div>

          <div className="featured__grid" ref={featuredRef}>
            {featuredArticles.slice(0, 4).map((article) => (
              <Link
                to={`/creations/${article.id}`}
                key={article.id}
                className="product-card reveal-item"
              >
                <div className="product-card__image">
                  {article.photos && article.photos.length > 0 ? (
                    <img src={article.photos[0]} alt={article.titre} />
                  ) : (
                    <div className="product-card__placeholder">
                      <span role="img" aria-label="placeholder" style={{ fontSize: '3rem', color: 'var(--color-gold)' }}>🌙</span>
                      <span>{article.categorie}</span>
                    </div>
                  )}
                  <div className="product-card__badge">Vedette</div>
                </div>
                <div className="product-card__body">
                  <p className="product-card__category">{article.categorie}</p>
                  <h3 className="product-card__title">{article.titre}</h3>
                  <p className="product-card__description">
                    {truncateText(article.description, 90)}
                  </p>
                  <div className="product-card__footer">
                    <span className="product-card__price">
                      {formatPrice(article.prix)}
                    </span>
                    <div className="product-card__stones">
                      {Array.isArray(article.pierres) && article.pierres.map((pierre) => (
                        <span key={pierre} className="badge badge--gold">
                          {pierre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="featured__cta">
            <Link to="/creations" className="btn btn--dark btn--lg">
              Voir toutes les créations
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ────────────────────── */}
      <section className="categories">
        <div className="container">
          <div className="section-title">
            <h2>Nos catégories</h2>
            <p>Explorez nos univers de création</p>
          </div>

          <div className="categories__grid" ref={categoriesRef}>
            {config.categories.map((cat) => (
              <Link
                to={`/creations?cat=${encodeURIComponent(cat.name)}`}
                key={cat.name}
                className="category-card reveal-item"
                style={{ overflow: 'hidden' }}
              >
                <div className="category-card__icon">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} />
                  ) : (
                    '🌙'
                  )}
                </div>
                <div className="category-card__content">
                  <h3>{cat.name}</h3>
                  <p>{cat.description || `Découvrir les ${cat.name.toLowerCase()}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ───────────────────── */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>L'avis de notre clientèle</h2>
            <p>Nos clients partagent leur expérience</p>
          </div>

          <div className="testimonials__grid" ref={testimonialsRef}>
            {(config.testimonials || []).map((t) => (
              <div key={t.id} className="testimonial-card reveal-item">
                <div className="testimonial-card__stars">
                  {'★'.repeat(t.note)}{'☆'.repeat(5 - t.note)}
                </div>
                <p className="testimonial-card__text">{t.texte}</p>
                <p className="testimonial-card__author">{t.auteur}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <h2>{config.ctaTitle}</h2>
          <p>
            {config.ctaDescription}
          </p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}

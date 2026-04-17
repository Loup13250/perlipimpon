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
  const { config } = useConfig();
  const featuredRef = useScrollRevealGroup({}, [featuredArticles]);
  const categoriesRef = useScrollRevealGroup({}, [config.categories]);
  const testimonialsRef = useScrollRevealGroup({}, [config.testimonials]);

  return (
    <>
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

      {articlesLoading ? (
        <div style={{ padding: 'var(--space-4xl) 0', textAlign: 'center', background: 'var(--color-cream)', color: 'var(--color-gold)' }}>
          <p>Chargement des collections...</p>
        </div>
      ) : (
        <>

          {/* ── ABOUT PREVIEW ─────────────────── */}
          <section className="about-preview">
            <div className="container">
              <div className="about-preview__grid">
                <div className="about-preview__image" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={config.aboutImage || "/images/moonstone_necklace.png"} alt="Création artisanale" loading="lazy" width="800" height="800" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <h2>Nos Coups de Cœur</h2>
                <p>Découvrez nos créations les plus appréciées</p>
              </div>

              {featuredArticles.length > 0 ? (
                <>
                  <div className="featured__grid" ref={featuredRef}>
                    {featuredArticles.slice(0, 6).map((article) => (
                      <Link
                        to={`/creations/${article.id}`}
                        key={article.id}
                        className="product-card reveal-item"
                      >
                        <div className="product-card__image">
                          {article.photos && article.photos.length > 0 ? (
                            <img src={article.photos[0]} alt={article.titre} loading="lazy" width="500" height="500" />
                          ) : (
                            <div className="product-card__placeholder">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                              </svg>
                              <span>{article.categorie}</span>
                            </div>
                          )}
                          {article.vendu && (
                            <div className="product-card__banner-vendu"><span>Vendu</span></div>
                          )}
                          {!article.vendu && (
                            <div className="product-card__badge">Coup de Cœur</div>
                          )}
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
                            <span className="product-card__cta-hint">Voir le détail →</span>
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
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0', color: 'var(--color-gray-500)', fontStyle: 'italic' }}>
                  <p>Une nouvelle collection "Coup de Cœur" est en cours de préparation... ✨</p>
                  <Link to="/creations" className="btn btn--outline" style={{ marginTop: 'var(--space-md)' }}>Explorer la boutique</Link>
                </div>
              )}
            </div>
          </section>

          {/* ── CONFIANCE E-COMMERCE ──────────────── */}
          <section className="trust-section">
            <div className="container">
              <div className="trust-grid">
                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <h4>Fait main avec amour</h4>
                  <p>Chaque bijou est une pièce unique, façonnée à la main dans mon atelier.</p>
                </div>
                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                    </svg>
                  </div>
                  <h4>Pièces uniques</h4>
                  <p>Aucune création n'est identique — vous portez une pièce qui n'existe qu'en un seul exemplaire.</p>
                </div>
                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <h4>Livraison partout en France</h4>
                  <p>Vos créations sont soigneusement emballées et expédiées avec soin dans toute la France.</p>
                </div>
                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9c1.06 1.844 2.386 3.497 3.92 4.92L12.34 12.7a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <h4>Commande personnalisée</h4>
                  <p>Vous avez un projet spécial ? Contactez-moi pour créer la pièce de vos rêves sur mesure.</p>
                </div>
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
                        <img src={cat.image} alt={cat.name} loading="lazy" width="400" height="400" />
                      ) : (
                        <img src={
                          cat.name.toLowerCase().includes('collier') ? '/images/moonstone_necklace.png' :
                          cat.name.toLowerCase().includes('bracelet') ? '/images/pearl_bracelet.png' :
                          cat.name.toLowerCase().includes('bague') ? '/images/rose_quartz_ring.png' :
                          '/images/hero_bg.png'
                        } alt={cat.name} loading="lazy" width="400" height="400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill={i < t.note ? "var(--color-gold)" : "none"} 
                          stroke="var(--color-gold)" 
                          strokeWidth="1"
                          style={{ marginRight: '2px' }}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
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
      )}
    </>
  );
}

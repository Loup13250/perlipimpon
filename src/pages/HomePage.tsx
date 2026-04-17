/**
 * Page d'accueil — vitrine du site Perlipimpon.
 * Ordre e-commerce : Hero compact → Coups de Cœur → Catégories → À Propos → Témoignages → CTA
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
      {/* ── HERO COMPACT ─────────────────────── */}
      <section className="hero">
        <picture>
          <source media="(max-width: 768px)" srcSet={config.heroImageMobile || config.heroImage} />
          <img src={config.heroImage} alt="Bienvenue — Héro" fetchPriority="high" decoding="sync" className="hero__background" />
        </picture>
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
            <Link to="/creations" className="btn btn--primary">
              Découvrir les créations
            </Link>
            <Link to="/a-propos" className="btn btn--outline" style={{ borderColor: 'var(--color-gold-light)', color: 'var(--color-gold-light)' }}>
              Notre histoire
            </Link>
          </div>
        </div>
      </section>

      {articlesLoading ? (
        <div style={{ padding: 'var(--space-4xl) 0', textAlign: 'center', background: 'var(--color-cream)', color: 'var(--color-gold)' }}>
          <p>Chargement des collections...</p>
        </div>
      ) : (
        <>

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
                            <img src={article.photos[0]} alt={article.titre} loading="lazy" decoding="async" width="500" height="500" />
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
                        <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" width="400" height="400" />
                      ) : (
                        <img src={
                          cat.name.toLowerCase().includes('collier') ? '/images/moonstone_necklace.png' :
                          cat.name.toLowerCase().includes('bracelet') ? '/images/pearl_bracelet.png' :
                          cat.name.toLowerCase().includes('bague') ? '/images/rose_quartz_ring.png' :
                          '/images/hero_bg.png'
                        } alt={cat.name} loading="lazy" decoding="async" width="400" height="400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

          {/* ── ABOUT PREVIEW ─────────────────── */}
          <section className="about-preview">
            <div className="container">
              <div className="about-preview__grid">
                <div className="about-preview__image" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={config.aboutImage === '/images/moonstone_necklace.png' ? "/images/about_workshop.png" : config.aboutImage} alt="Création artisanale" loading="lazy" decoding="async" width="800" height="800" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="about-preview__text">
                  <h2>
                    {config.aboutTitle === 'Fait main, fait avec cœur' ? "L'Éclat des Pierres, l'Énergie du Cœur" : config.aboutTitle}
                  </h2>
                  <p>{config.aboutText1.includes('Bienvenue') ? "Chaque gemme est sélectionnée pour sa vibration unique. Chez Perlipimpon, nous croyons que la beauté d'un bijou réside autant dans son éclat que dans les bienfaits qu'il procure à l'âme." : config.aboutText1}</p>
                  <p>{config.aboutText1.includes('Bienvenue') ? "De l'apaisement du Quartz Rose à la force protectrice de l'Améthyste, nous créons des talismans modernes pensés pour harmoniser vos énergies au quotidien." : config.aboutText2}</p>
                  <p className="about-preview__signature">— {config.nomMarque || 'Perlipimpon'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── VALEURS ARTISANALES ──────────────── */}
          <section className="brand-values">
            <div className="container">
              <div className="section-title">
                <h2>L'Âme de l'Atelier</h2>
                <div className="floral-divider" aria-hidden="true">
                  <span className="floral-divider__line"></span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="floral-divider__icon">
                    <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" />
                    <path d="M12 22V17" />
                  </svg>
                  <span className="floral-divider__line"></span>
                </div>
              </div>
              <div className="brand-values__grid">
                
                <div className="brand-value-card">
                  <h4>Atelier Artisanal</h4>
                  <p>Chaque parure prend vie minutieusement à la main, guidée par une passion authentique.</p>
                </div>

                <div className="brand-value-card">
                  <h4>Gemmes Sélectionnées</h4>
                  <p>Des pierres fines sourcées avec exigence pour leurs vertus énergétiques et leur éclat naturel.</p>
                </div>

                <div className="brand-value-card">
                  <h4>Édition Singulière</h4>
                  <p>Aucune copie. Vous adoptez une création qui n'existe qu'en un seul et unique exemplaire.</p>
                </div>

                <div className="brand-value-card">
                  <h4>Envois Soignés</h4>
                  <p>Toutes nos petites merveilles voyagent délicatement emballées, partout en France.</p>
                </div>

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

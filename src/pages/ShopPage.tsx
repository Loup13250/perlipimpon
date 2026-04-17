/**
 * Page Boutique — grille filtrable de toutes les créations.
 * Filtres par catégorie (desktop pill + mobile accordéon).
 * Multi-sélection + toggle.
 */

import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useConfig } from '../hooks/useConfig';
import { useScrollRevealGroup } from '../hooks/useScrollReveal';
import { formatPrice, truncateText } from '../utils/helpers';
import CategoryFilter from '../components/CategoryFilter';

export default function ShopPage() {
  const { articles, articlesLoading } = useArticles();
  const { config, configLoading } = useConfig();
  const [searchParams, setSearchParams] = useSearchParams();

  // Récupère le filtre catégorie depuis l'URL si on vient de la page d'accueil
  const urlCategory = searchParams.get('cat') || '';
  const urlCoupDeCoeur = searchParams.get('coupdecoeur') === 'true';
  
  const [activeCategories, setActiveCategories] = useState<string[]>(
    urlCategory ? [urlCategory] : []
  );
  const [showCoupsDeCoeur, setShowCoupsDeCoeur] = useState<boolean>(urlCoupDeCoeur);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (showCoupsDeCoeur) {
      result = result.filter(a => a.enVedette);
    }
    if (activeCategories.length > 0) {
      result = result.filter(a => activeCategories.includes(a.categorie));
    }
    return result;
  }, [articles, activeCategories, showCoupsDeCoeur]);

  const gridRef = useScrollRevealGroup({}, [filteredArticles]);

  const updateUrl = (cats: string[], coeur: boolean) => {
    const params = new URLSearchParams();
    if (coeur) params.set('coupdecoeur', 'true');
    if (cats.length === 1) params.set('cat', cats[0]);
    else if (cats.length > 1) params.set('cat', cats.join(','));
    setSearchParams(params);
  };

  const handleCategoryToggle = (cat: string) => {
    setShowCoupsDeCoeur(false);
    const nextCategories = activeCategories.includes(cat)
      ? activeCategories.filter((c) => c !== cat)
      : [...activeCategories, cat];

    setActiveCategories(nextCategories);
    updateUrl(nextCategories, false);
  };

  const handleCoupsDeCoeurToggle = () => {
    const nextCoups = !showCoupsDeCoeur;
    setShowCoupsDeCoeur(nextCoups);
    setActiveCategories([]);
    updateUrl([], nextCoups);
  };

  const handleCategoryAll = () => {
    setActiveCategories([]);
    setShowCoupsDeCoeur(false);
    setSearchParams({});
  };

  return (
    <div className="shop-page">
      <div className="container">
        {/* En-tête (toujours visible) */}
        <div className="shop-header">
          <h1>Nos Créations</h1>
          <p>Bijoux fantaisie artisanaux, pièces uniques faites main</p>
        </div>

        {articlesLoading || configLoading ? (
          <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div className="loader-spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gold-light)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>Recherche des créations...</p>
          </div>
        ) : (
          <>
            {/* Filtres — le composant gère lui-même desktop et mobile */}
            <CategoryFilter
              categories={config.categories}
              activeCategories={activeCategories}
              onCategoryToggle={handleCategoryToggle}
              showCoupsDeCoeur={showCoupsDeCoeur}
              onCoupsDeCoeurToggle={handleCoupsDeCoeurToggle}
              onCategoryAll={handleCategoryAll}
            />

            {/* Compteur */}
            <div className="shop-info-bar">
              <p className="shop-count">
                {filteredArticles.length} création{filteredArticles.length > 1 ? 's' : ''}
                {activeCategories.length === 0 && !showCoupsDeCoeur && " au total"}
              </p>
            </div>

            {/* Grille */}
            <div className="shop-grid" ref={gridRef}>
              {filteredArticles.length === 0 ? (
                <div className="shop-empty">
                  <div className="shop-empty__icon">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <h3>Aucune création trouvée</h3>
                  <p>Essayez de modifier vos filtres ou retirez les restrictions pour voir plus de résultats.</p>
                  <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} onClick={handleCategoryAll}>
                    Voir toutes les créations
                  </button>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <Link
                    to={`/creations/${article.id}`}
                    key={article.id}
                    className="product-card reveal-item"
                  >
                    <div className="product-card__image">
                      {Array.isArray(article.photos) && article.photos.length > 0 ? (
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
                      {article.enVedette && !article.vendu && (
                        <div className="product-card__badge">Coup de Cœur</div>
                      )}
                    </div>
                    <div className="product-card__body">
                      <p className="product-card__category">{article.categorie}</p>
                      <h3 className="product-card__title">{article.titre}</h3>
                      <p className="product-card__description">
                        {truncateText(article.description || '', 100)}
                      </p>
                      <div className="product-card__footer">
                        <span className="product-card__price">
                          {formatPrice(article.prix || 0)}
                        </span>
                        <span className="product-card__cta-hint">Voir le détail →</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Page Boutique — grille filtrable de toutes les créations.
 * Filtres par catégorie (bracelet desktop).
 * Multi-sélection + toggle.
 */

import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useConfig } from '../hooks/useConfig';
import { useScrollRevealGroup } from '../hooks/useScrollReveal';
import { formatPrice, truncateText } from '../utils/helpers';
import BraceletFilter from '../components/BraceletFilter';

export default function ShopPage() {
  const { visibleArticles, articlesLoading } = useArticles();
  const { config, configLoading } = useConfig();
  const [searchParams, setSearchParams] = useSearchParams();

  // On récupère le filtre catégorie depuis l'URL si on vient de la page d'accueil
  const urlCategory = searchParams.get('cat') || '';
  const [activeCategories, setActiveCategories] = useState<string[]>(
    urlCategory ? [urlCategory] : []
  );

  const filteredArticles = useMemo(() => {
    let results = visibleArticles;

    if (activeCategories.length > 0) {
      results = results.filter((a) => activeCategories.includes(a.categorie));
    }

    return results;
  }, [visibleArticles, activeCategories]);

  const gridRef = useScrollRevealGroup({}, [filteredArticles]);

  // Toggle catégorie : clic = ajouter/retirer de la sélection
  const handleCategoryToggle = (cat: string) => {
    setActiveCategories((prev) => {
      const next = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat];
      // Sync URL
      if (next.length === 1) {
        setSearchParams({ cat: next[0] });
      } else if (next.length === 0) {
        setSearchParams({});
      } else {
        setSearchParams({ cat: next.join(',') });
      }
      return next;
    });
  };

  // "Tout" = réinitialiser les catégories
  const handleCategoryAll = () => {
    setActiveCategories([]);
    setSearchParams({});
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setSearchParams({});
  };

  // ──────────────────────────────────────────────
  // Rendu Unique (Safe Hooks)
  // ──────────────────────────────────────────────
  return (
    <div className="shop-page">
      <div className="container">
        {/* En-tête (toujours visible) */}
        <div className="shop-header">
          <h1>Nos Créations</h1>
          <p>Bijoux fantaisies artisanaux, pièces uniques faites main</p>
        </div>

        {articlesLoading || configLoading ? (
          <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div className="loader-spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gold-light)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>Recherche des créations...</p>
          </div>
        ) : (
          <>
            {/* ── BRACELET FILTRES (Desktop) ── */}
            <div className="shop-filters-desktop-wrapper">
              <BraceletFilter
                categories={config.categories}
                activeCategories={activeCategories}
                onCategoryToggle={handleCategoryToggle}
                onCategoryAll={handleCategoryAll}
                onClearFilters={clearFilters}
              />
            </div>

            {/* ── FILTRES MOBILE : Menus déroulants ── */}
            <div className="shop-filters-mobile">
              <div className="shop-filter-bar">

                {/* Filtre Catégorie */}
                <div className="shop-filter-select-wrapper">
                  <label htmlFor="cat-select-mob" className="shop-filter-label">Sélectionner une catégorie</label>
                  <select
                    id="cat-select-mob"
                    className="shop-select"
                    value={activeCategories.length === 1 ? activeCategories[0] : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setActiveCategories([e.target.value]);
                        setSearchParams({ cat: e.target.value });
                      } else {
                        handleCategoryAll();
                      }
                    }}
                  >
                    <option value="">Toutes les catégories</option>
                    {config.categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Vider */}
                {(activeCategories.length > 0) && (
                  <button
                    className="btn btn--outline btn--sm shop-filter-clear-btn-mobile"
                    onClick={clearFilters}
                  >
                    Vider les filtres
                  </button>
                )}
              </div>
            </div>

            {/* Compteur */}
            <p className="shop-count">
              {filteredArticles.length} création{filteredArticles.length > 1 ? 's' : ''}
              {activeCategories.length > 0 && ` dans ${activeCategories.join(', ')}`}
            </p>

            {/* Grille */}
            <div className="shop-grid" ref={gridRef}>
              {filteredArticles.length === 0 ? (
                <div className="shop-empty">
                  <div className="shop-empty__icon">🔍</div>
                  <h3>Aucune création trouvée</h3>
                  <p>Essayez de modifier vos filtres ou retirez les restrictions pour voir plus de résultats.</p>
                  <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} onClick={clearFilters}>
                    Vider les filtres
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
                        <img src={article.photos[0]} alt={article.titre} />
                      ) : (
                        <div className="product-card__placeholder">
                          <span role="img" aria-label="placeholder" style={{ fontSize: '3rem', color: 'var(--color-gold)' }}>🌙</span>
                          <span>{article.categorie}</span>
                        </div>
                      )}
                      {article.vendu && (
                        <div className="product-card__banner-vendu"><span>Vendu</span></div>
                      )}
                      {article.enVedette && (
                        <div className="product-card__badge">Vedette</div>
                      )}
                    </div>
                    <div className="product-card__body">
                      <p className="product-card__category">{article.categorie}</p>
                      <h3 className="product-card__title">{article.titre}</h3>
                      <p className="product-card__description">
                        {truncateText(article.description || "", 100)}
                      </p>
                      <div className="product-card__footer">
                        <span className="product-card__price">
                          {formatPrice(article.prix || 0)}
                        </span>
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

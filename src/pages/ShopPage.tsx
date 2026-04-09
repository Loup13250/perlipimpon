/**
 * Page Boutique — grille filtrable de toutes les créations.
 * Filtres par catégorie et par pierre.
 */

import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useConfig } from '../hooks/useConfig';
import { useScrollRevealGroup } from '../hooks/useScrollReveal';
import { formatPrice, truncateText } from '../utils/helpers';
import type { Stone } from '../types';

export default function ShopPage() {
  const { visibleArticles, articlesLoading } = useArticles();
  const { config, configLoading } = useConfig();
  const [searchParams, setSearchParams] = useSearchParams();

  // On récupère le filtre catégorie depuis l'URL si on vient de la page d'accueil
  const urlCategory = searchParams.get('cat') || '';
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);
  const [activeStone, setActiveStone] = useState<string>('');

  const filteredArticles = useMemo(() => {
    let results = visibleArticles;

    if (activeCategory) {
      results = results.filter((a) => a.categorie === activeCategory);
    }
    if (activeStone) {
      results = results.filter((a) => a.pierres?.includes(activeStone as Stone));
    }

    return results;
  }, [visibleArticles, activeCategory, activeStone]);

  const gridRef = useScrollRevealGroup({}, [filteredArticles]);

  if (configLoading || articlesLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Recherche des créations...</p>
      </div>
    );
  }

  const handleCategoryFilter = (cat: string) => {
    setActiveCategory(cat);
    if (cat) {
      setSearchParams({ cat });
    } else {
      setSearchParams({});
    }
  };

  const handleStoneFilter = (stone: string) => {
    setActiveStone(stone);
  };

  const clearFilters = () => {
    setActiveCategory('');
    setActiveStone('');
    setSearchParams({});
  };

  return (
    <div className="shop-page">
      <div className="container">
        {/* En-tête */}
        <div className="shop-header">
          <h1>Nos Créations</h1>
          <p>Bijoux fantaisies artisanaux, pièces uniques faites main</p>
        </div>

        {/* Filtres Séparés & Modernisés */}
        <div className="shop-filters-container">
          <div className="shop-filter-bar">
            
            {/* Filtre Catégorie */}
            <div className="shop-filter-select-wrapper">
              <label htmlFor="cat-select" className="shop-filter-label">📂 Catégorie</label>
              <select 
                id="cat-select" 
                className="shop-select"
                value={activeCategory} 
                onChange={(e) => handleCategoryFilter(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {config.categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Filtre Pierres */}
            <div className="shop-filter-select-wrapper">
              <label htmlFor="stone-select" className="shop-filter-label">💎 Pierre</label>
              <select 
                id="stone-select" 
                className="shop-select"
                value={activeStone} 
                onChange={(e) => handleStoneFilter(e.target.value)}
              >
                <option value="">Toutes les pierres</option>
                {config.stones?.map((stone) => (
                  <option key={stone} value={stone}>{stone}</option>
                ))}
              </select>
            </div>

            {/* Vider les filtres quand au moins un est actif */}
            {(activeCategory || activeStone) && (
              <button 
                className="btn btn--outline btn--sm shop-filter-clear-btn" 
                onClick={clearFilters}
              >
                ✕ Vider les filtres
              </button>
            )}

          </div>
        </div>

        {/* Compteur */}
        <p className="shop-count">
          {filteredArticles.length} création{filteredArticles.length > 1 ? 's' : ''}
          {activeCategory && ` dans ${activeCategory}`}
          {activeStone && ` avec ${activeStone}`}
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
                  {article.photos && article.photos.length > 0 ? (
                    <img src={article.photos[0]} alt={article.titre} />
                  ) : (
                    <div className="product-card__placeholder">
                      <span role="img" aria-label="placeholder" style={{ fontSize: '3rem', color: 'var(--color-gold)' }}>🌙</span>
                      <span>{article.categorie}</span>
                    </div>
                  )}
                  {article.enVedette && (
                    <div className="product-card__badge">Vedette</div>
                  )}
                </div>
                <div className="product-card__body">
                  <p className="product-card__category">{article.categorie}</p>
                  <h3 className="product-card__title">{article.titre}</h3>
                  <p className="product-card__description">
                    {truncateText(article.description, 100)}
                  </p>
                  <div className="product-card__footer">
                    <span className="product-card__price">
                      {formatPrice(article.prix)}
                    </span>
                    <div className="product-card__stones">
                      {article.pierres?.slice(0, 2).map((p) => (
                        <span key={p} className="badge badge--gold">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

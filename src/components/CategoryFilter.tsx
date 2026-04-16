/**
 * Filtre de catégories — Desktop : pills horizontales.
 * Mobile : accordéon pill compact et élégant.
 */

import { useState } from 'react';
import type { CategoryData } from '../types';

interface CategoryFilterProps {
  categories: CategoryData[];
  activeCategories: string[];
  onCategoryToggle: (cat: string) => void;
  onCategoryAll: () => void;
  onClearFilters: () => void;
}

export default function CategoryFilter({
  categories,
  activeCategories,
  onCategoryToggle,
  onCategoryAll,
}: CategoryFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = activeCategories.length === 0
    ? 'Toutes les créations'
    : activeCategories.join(', ');

  return (
    <>
      {/* ── Desktop : Rang de boutons pill ── */}
      <div className="category-filter-modern">
        <button
          type="button"
          className={`category-filter__btn ${activeCategories.length === 0 ? 'active' : ''}`}
          onClick={onCategoryAll}
        >
          Toutes les créations
        </button>

        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className={`category-filter__btn ${activeCategories.includes(cat.name) ? 'active' : ''}`}
            onClick={() => onCategoryToggle(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Mobile : Accordéon pill ── */}
      <div className="shop-filter-mobile-container">
        <div
          className="shop-filter-mobile-header"
          onClick={() => setMobileOpen(!mobileOpen)}
          role="button"
          aria-expanded={mobileOpen}
        >
          <span className="shop-filter-mobile-label">Filtrer par catégorie</span>
          <span className="shop-filter-mobile-active">{activeLabel}</span>
          <svg
            className={`shop-filter-mobile-chevron ${mobileOpen ? 'open' : ''}`}
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {mobileOpen && (
          <div className="shop-filter-mobile-pills">
            <button
              type="button"
              className={`filter-pill ${activeCategories.length === 0 ? 'active' : ''}`}
              onClick={() => { onCategoryAll(); setMobileOpen(false); }}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={`filter-pill ${activeCategories.includes(cat.name) ? 'active' : ''}`}
                onClick={() => { onCategoryToggle(cat.name); setMobileOpen(false); }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

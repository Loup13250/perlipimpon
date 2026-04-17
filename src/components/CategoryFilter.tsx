/**
 * Filtre de catégories — Desktop : pills horizontales.
 * Mobile : accordéon pill compact et élégant.
 */


import type { CategoryData } from '../types';

interface CategoryFilterProps {
  categories: CategoryData[];
  activeCategories: string[];
  onCategoryToggle: (cat: string) => void;
  onCategoryAll: () => void;
  showCoupsDeCoeur: boolean;
  onCoupsDeCoeurToggle: () => void;
}

export default function CategoryFilter({
  categories,
  activeCategories,
  onCategoryToggle,
  onCategoryAll,
  showCoupsDeCoeur,
  onCoupsDeCoeurToggle,
}: CategoryFilterProps) {

  return (
    <>
      {/* ── Desktop : Rang de boutons pill ── */}
      <div className="category-filter-modern">
        <button
          type="button"
          className={`category-filter__btn ${showCoupsDeCoeur ? 'active' : ''}`}
          onClick={onCoupsDeCoeurToggle}
          style={{ borderColor: showCoupsDeCoeur ? 'var(--color-gold)' : undefined, color: showCoupsDeCoeur ? 'var(--color-gold)' : undefined, fontWeight: '500' }}
        >
          ❤ Coups de Cœur
        </button>

        <div className="category-filter__divider" style={{ width: '1px', height: '24px', background: 'var(--color-gray-300)', margin: '0 8px' }}></div>

        <button
          type="button"
          className={`category-filter__btn ${activeCategories.length === 0 && !showCoupsDeCoeur ? 'active' : ''}`}
          onClick={() => {
            if (showCoupsDeCoeur) onCoupsDeCoeurToggle();
            onCategoryAll();
          }}
        >
          Toutes
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
    </>
  );
}

/**
 * Filtre de catégories élégant type "Haute Joaillerie".
 * Navigation textuelle horizontale avec soulignement dynamique.
 */

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
  return (
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
  );
}

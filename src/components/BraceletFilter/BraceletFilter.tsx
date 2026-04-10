/**
 * BraceletFilter — Bracelet joaillerie premium (desktop uniquement).
 * Transformé en système de pampilles (pendants) suspendus.
 * Mise à jour : Filtrage uniquement par Catégories.
 */

import { useEffect, useState } from 'react';
import type { CategoryData } from '../../types';
import './BraceletFilter.css';

// ─── Couleurs par défaut des catégories (élégantes et sobres) ────────────────
const KNOWN_CAT_COLORS: Record<string, string> = {
  'Colliers':           '#b8986a', 
  'Bracelets':          '#c4887a', 
  'Bagues':             '#8888a8', 
  'Boucles d\'oreilles': '#a89060', 
  'Pendentifs':         '#b07850', 
  'Ensembles':          '#9a80a0', 
};

const DEFAULT_COLOR = '#a0a098';
const GOLD_COLOR = '#d4af37';

/**
 * Génère un style de gemme facettée
 */
function makeGemStyle(hex: string): React.CSSProperties {
  return {
    '--pendant-color': hex,
  } as React.CSSProperties;
}

// ─── Pampille individuelle (Pendant) ──────────────────────────────────────────
interface PendantProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  gemStyle: React.CSSProperties;
  index: number;
  isAll?: boolean;
}

function Pendant({ label, isActive, onClick, gemStyle, index, isAll }: PendantProps) {
  return (
    <button
      className={`pendant ${isActive ? 'pendant--active' : ''} ${isAll ? 'pendant--all' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      style={{ 
        ...gemStyle, 
        '--pendant-delay': `${index * 0.04}s` 
      } as React.CSSProperties}
    >
      {/* Anneau de suspension */}
      <span className="pendant__link" />
      
      {/* Corps du pendentif */}
      <div className="pendant__body">
        <span className="pendant__stone" />
        <span className="pendant__shimmer" />
        <span className="pendant__label">{label}</span>
      </div>
      
      {/* Halo de sélection premium */}
      {isActive && <span className="pendant__glow" />}
    </button>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────
interface BraceletFilterProps {
  categories: CategoryData[];
  activeCategories: string[];
  onCategoryToggle: (cat: string) => void;
  onCategoryAll: () => void;
  onClearFilters: () => void;
}

export default function BraceletFilter({
  categories,
  activeCategories,
  onCategoryToggle,
  onCategoryAll,
  onClearFilters,
}: BraceletFilterProps) {
  const hasFilter = activeCategories.length > 0;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  function getCatColor(cat: CategoryData): string {
    if (cat.color) return cat.color;
    return KNOWN_CAT_COLORS[cat.name] || DEFAULT_COLOR;
  }

  return (
    <div className={`bracelet-filter ${mounted ? 'bracelet-filter--in' : ''}`}>
      {/* ── Catégories ── */}
      <section className="bracelet-section">
        <header className="bracelet-header">
          <span className="bracelet-title">
            <span className="bracelet-title__dot">✦</span>
            Sélections
          </span>
          {hasFilter && (
            <button className="bracelet-clear" onClick={onClearFilters}>
              Effacer les filtres
            </button>
          )}
        </header>

        <div className="bracelet-row">
          <span className="clasp clasp--left" />
          <div className="wire">
            <div className="wire__core" />
          </div>

          <div className="pendant-rail">
            <Pendant
              label="Tout"
              isActive={activeCategories.length === 0}
              onClick={onCategoryAll}
              gemStyle={makeGemStyle(GOLD_COLOR)}
              index={0}
              isAll
            />
            {categories.map((cat, i) => (
              <Pendant
                key={cat.name}
                label={cat.name}
                isActive={activeCategories.includes(cat.name)}
                onClick={() => onCategoryToggle(cat.name)}
                gemStyle={makeGemStyle(getCatColor(cat))}
                index={i + 1}
              />
            ))}
          </div>

          <span className="clasp clasp--right" />
        </div>
      </section>
    </div>
  );
}

/**
 * BraceletFilter — Bracelet joaillerie premium (desktop uniquement).
 * Transformé en système de pampilles (pendants) suspendus.
 */

import { useEffect, useState } from 'react';
import type { CategoryData, StoneData } from '../../types';
import './BraceletFilter.css';

// ─── Couleurs par défaut des pierres ─────────────────────────────────────────
const KNOWN_STONE_COLORS: Record<string, string> = {
  'Pierre de lune':   '#7888b8', 
  'Perle':            '#d8ceac', 
  'Améthyste':        '#7b3fa0', 
  'Quartz rose':      '#d4849a', 
  'Labradorite':      '#3a6898', 
  'Aigue-marine':     '#48a8b8', 
  'Tourmaline':       '#8838a0', 
  'Opale':            '#b888c8', 
  'Nacre':            '#c8b890', 
  'Cristal de roche': '#a0a8c8', 
};

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
  type?: 'category' | 'stone';
}

function Pendant({ label, isActive, onClick, gemStyle, index, isAll, type = 'stone' }: PendantProps) {
  return (
    <button
      className={`pendant pendant--${type} ${isActive ? 'pendant--active' : ''} ${isAll ? 'pendant--all' : ''}`}
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
  stonesData?: StoneData[];
  stones: string[];
  activeCategories: string[];
  activeStones: string[];
  onCategoryToggle: (cat: string) => void;
  onCategoryAll: () => void;
  onStoneToggle: (stone: string) => void;
  onStoneAll: () => void;
  onClearFilters: () => void;
}

export default function BraceletFilter({
  categories,
  stonesData,
  stones,
  activeCategories,
  activeStones,
  onCategoryToggle,
  onCategoryAll,
  onStoneToggle,
  onStoneAll,
  onClearFilters,
}: BraceletFilterProps) {
  const hasFilter = activeCategories.length > 0 || activeStones.length > 0;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  function getStoneColor(stoneName: string): string {
    if (stonesData) {
      const found = stonesData.find((s) => s.name === stoneName);
      if (found?.color) return found.color;
    }
    return KNOWN_STONE_COLORS[stoneName] || DEFAULT_COLOR;
  }

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

        <div className="bracelet-row bracelet-row--category">
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
              type="category"
            />
            {categories.map((cat, i) => (
              <Pendant
                key={cat.name}
                label={cat.name}
                isActive={activeCategories.includes(cat.name)}
                onClick={() => onCategoryToggle(cat.name)}
                gemStyle={makeGemStyle(getCatColor(cat))}
                index={i + 1}
                type="category"
              />
            ))}
          </div>

          <span className="clasp clasp--right" />
        </div>
      </section>

      {/* ── Pierres ── */}
      {stones && stones.length > 0 && (
        <section className="bracelet-section">
          <header className="bracelet-header">
            <span className="bracelet-title">
              <span className="bracelet-title__dot">◈</span>
              Gemmes
            </span>
          </header>

          <div className="bracelet-row bracelet-row--stone">
            <span className="clasp clasp--left" />
            <div className="wire">
              <div className="wire__core" />
            </div>

            <div className="pendant-rail">
              <Pendant
                label="Toutes"
                isActive={activeStones.length === 0}
                onClick={onStoneAll}
                gemStyle={makeGemStyle(GOLD_COLOR)}
                index={0}
                isAll
              />
              {stones.map((stone, i) => (
                <Pendant
                  key={stone}
                  label={stone}
                  isActive={activeStones.includes(stone)}
                  onClick={() => onStoneToggle(stone)}
                  gemStyle={makeGemStyle(getStoneColor(stone))}
                  index={i + 1}
                />
              ))}
            </div>

            <span className="clasp clasp--right" />
          </div>
        </section>
      )}
    </div>
  );
}

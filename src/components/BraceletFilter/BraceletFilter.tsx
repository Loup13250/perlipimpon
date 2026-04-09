/**
 * BraceletFilter — Bracelet joaillerie premium (desktop uniquement).
 * Multi-sélection, couleurs personnalisées depuis la config admin.
 */

import { useEffect, useState } from 'react';
import type { CategoryData, StoneData } from '../../types';
import './BraceletFilter.css';

// ─── Couleurs par défaut des pierres (basées sur les vraies gemmes) ──────────
// Utilisées si aucune couleur admin (stonesData) n'est configurée
const KNOWN_STONE_COLORS: Record<string, string> = {
  'Pierre de lune':   '#7888b8', // Bleu lunaire nacré
  'Perle':            '#d8ceac', // Ivoire crème chaud
  'Améthyste':        '#7b3fa0', // Violet profond
  'Quartz rose':      '#d4849a', // Rose tendre
  'Labradorite':      '#3a6898', // Bleu-gris profond
  'Aigue-marine':     '#48a8b8', // Bleu-vert limpide
  'Tourmaline':       '#8838a0', // Violet-magenta (tourmaline rubellite)
  'Opale':            '#b888c8', // Blanc irisé violet
  'Nacre':            '#c8b890', // Crème nacré chaud
  'Cristal de roche': '#a0a8c8', // Blanc cristallin bleuté
};

// ─── Couleurs par défaut des catégories (élégantes et sobres) ────────────────
const KNOWN_CAT_COLORS: Record<string, string> = {
  'Colliers':           '#b8986a', // Or antique
  'Bracelets':          '#c4887a', // Or rose
  'Bagues':             '#8888a8', // Argent mat
  'Boucles d\'oreilles': '#a89060', // Bronze doré
  'Pendentifs':         '#b07850', // Cuivre
  'Ensembles':          '#9a80a0', // Améthyste pâle
};

const DEFAULT_COLOR = '#a0a098'; // Gris neutre universel
const GOLD_COLOR = '#d4af37';

/**
 * Génère un gradient de sphère 3D à partir d'une couleur hex unique.
 * Les tons highlight / midtone / shadow sont calculés automatiquement.
 */
function makeGemGradient(hex: string): React.CSSProperties {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Highlight (plus clair + désaturé)
  const hr = Math.min(255, r + 80);
  const hg = Math.min(255, g + 80);
  const hb = Math.min(255, b + 80);

  // Shadow (plus sombre)
  const sr = Math.max(0, Math.floor(r * 0.35));
  const sg = Math.max(0, Math.floor(g * 0.35));
  const sb = Math.max(0, Math.floor(b * 0.35));

  return {
    background: `radial-gradient(circle at 38% 32%, rgb(${hr},${hg},${hb}) 0%, rgb(${r},${g},${b}) 46%, rgb(${sr},${sg},${sb}) 100%)`,
  };
}

// ─── Perle individuelle ─────────────────────────────────────────────────────
interface BeadProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  gemStyle: React.CSSProperties;
  index: number;
  isAll?: boolean;
}

function Bead({ label, isActive, onClick, gemStyle, index, isAll }: BeadProps) {
  return (
    <button
      className={`bead ${isActive ? 'bead--active' : ''} ${isAll ? 'bead--all' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      title={label}
      style={{ '--bead-delay': `${index * 0.055}s` } as React.CSSProperties}
    >
      <span className="bead__sphere" style={gemStyle} />
      <span className="bead__gloss" />
      {isActive && <span className="bead__halo" />}
      <span className="bead__label">{label}</span>
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
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Résoudre la couleur d’une pierre (admin → défaut connu → gris neutre)
  function getStoneColor(stoneName: string): string {
    if (stonesData) {
      const found = stonesData.find((s) => s.name === stoneName);
      if (found?.color) return found.color;
    }
    return KNOWN_STONE_COLORS[stoneName] || DEFAULT_COLOR;
  }

  // Résoudre la couleur d’une catégorie (admin → défaut connu → gris neutre)
  function getCatColor(cat: CategoryData): string {
    if (cat.color) return cat.color;
    return KNOWN_CAT_COLORS[cat.name] || DEFAULT_COLOR;
  }

  const goldGem = makeGemGradient(GOLD_COLOR);

  return (
    <div className={`bracelet-filter ${mounted ? 'bracelet-filter--in' : ''}`}>
      {/* ── Catégories ── */}
      <section className="bracelet-section">
        <header className="bracelet-header">
          <span className="bracelet-title">
            <span className="bracelet-title__gem">◆</span>
            Catégories
          </span>
          {hasFilter && (
            <button className="bracelet-clear" onClick={onClearFilters}>
              Réinitialiser
            </button>
          )}
        </header>

        <div className="bracelet-row">
          <span className="clasp clasp--left" aria-hidden="true" />
          <span className="wire" aria-hidden="true">
            <span className="wire__body" />
            <span className="wire__shine" />
          </span>

          <div className="bead-rail" role="group" aria-label="Filtrer par catégorie">
            <Bead
              label="Tout"
              isActive={activeCategories.length === 0}
              onClick={onCategoryAll}
              gemStyle={goldGem}
              index={0}
              isAll
            />
            {categories.map((cat, i) => (
              <Bead
                key={cat.name}
                label={cat.name}
                isActive={activeCategories.includes(cat.name)}
                onClick={() => onCategoryToggle(cat.name)}
                gemStyle={makeGemGradient(getCatColor(cat))}
                index={i + 1}
              />
            ))}
          </div>

          <span className="clasp clasp--right" aria-hidden="true" />
        </div>
      </section>

      {/* ── Pierres ── */}
      {stones && stones.length > 0 && (
        <section className="bracelet-section">
          <header className="bracelet-header">
            <span className="bracelet-title">
              <span className="bracelet-title__gem">◈</span>
              Pierres
            </span>
          </header>

          <div className="bracelet-row">
            <span className="clasp clasp--left" aria-hidden="true" />
            <span className="wire" aria-hidden="true">
              <span className="wire__body" />
              <span className="wire__shine" />
            </span>

            <div className="bead-rail" role="group" aria-label="Filtrer par pierre">
              <Bead
                label="Toutes"
                isActive={activeStones.length === 0}
                onClick={onStoneAll}
                gemStyle={goldGem}
                index={0}
                isAll
              />
              {stones.map((stone, i) => (
                <Bead
                  key={stone}
                  label={stone}
                  isActive={activeStones.includes(stone)}
                  onClick={() => onStoneToggle(stone)}
                  gemStyle={makeGemGradient(getStoneColor(stone))}
                  index={i + 1}
                />
              ))}
            </div>

            <span className="clasp clasp--right" aria-hidden="true" />
          </div>
        </section>
      )}
    </div>
  );
}

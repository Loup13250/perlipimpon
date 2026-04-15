/**
 * BraceletFilter — L'Encolure Organique (Premium Redesign)
 * Système de perles 3D suspendues sur un fil d'or courbe.
 */

import { useEffect, useState } from 'react';
import type { CategoryData } from '../../types';
import './BraceletFilter.css';

// ─── Matériaux Premium ──────────────────────────────────────────────────────
const BEAD_MATERIALS: Record<string, string> = {
  'Tout':               'material--pearl',
  'Colliers':           'material--gold', 
  'Bracelets':          'material--moonstone', 
  'Bagues':             'material--onyx', 
  'Boucles d\'oreilles': 'material--quartz', 
  'Pendentifs':         'material--emerald', 
  'Ensembles':          'material--topaz', 
};

// Constantes de la courbe (Partagées entre SVG et Math)
const P0_Y = 15;
const P1_Y = 180; // Control point deeper for better "WAOUW" effect
const P2_Y = 15;
const VIEWBOX_W = 1000;

/**
 * Perle de joaillerie individuelle
 */
interface JewelBeadProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  materialClass: string;
  t: number; // Position normalisée [0, 1] le long du fil
}

function JewelBead({ label, isActive, onClick, materialClass, t }: JewelBeadProps) {
  // Calcul exact du point sur la courbe de Bézier quadratique
  // y(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const y = Math.pow(1 - t, 2) * P0_Y + 2 * (1 - t) * t * P1_Y + Math.pow(t, 2) * P2_Y;

  return (
    <div 
      className="bead-wrapper"
      style={{ 
        transform: `translateY(${y}px)`,
        '--bead-delay': `${t * 0.8}s`
      } as React.CSSProperties}
    >
      <button
        className={`bead ${materialClass} ${isActive ? 'bead--active' : ''}`}
        onClick={onClick}
        aria-pressed={isActive}
      >
        <div className="bead__label-container">
            <span className="bead__label">{label}</span>
        </div>
        <div className="bead__surface">
          <div className="bead__reflection" />
        </div>
        {isActive && <div className="bead__aura" />}
      </button>
    </div>
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
  const [mounted, setMounted] = useState(false);
  const items = [{ name: 'Tout' }, ...categories];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`bracelet-filter ${mounted ? 'bracelet-filter--in' : ''}`}>
      <section className="necklace-container">
        <header className="necklace-header">
          <h3 className="necklace-title">
            Collection Perlimpimpon
          </h3>
          {activeCategories.length > 0 && (
            <button className="necklace-reset" onClick={onClearFilters}>
              Effacer
            </button>
          )}
        </header>

        <div className="necklace-row">
          {/* Fil d'or courbe (SVG) */}
          <svg className="necklace-wire" viewBox={`0 0 ${VIEWBOX_W} 130`} preserveAspectRatio="none">
            {/* Définitions des matériaux */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8A6500' }} />
                <stop offset="25%" style={{ stopColor: '#D4AF37' }} />
                <stop offset="50%" style={{ stopColor: '#F3E5AB' }} />
                <stop offset="75%" style={{ stopColor: '#D4AF37' }} />
                <stop offset="100%" style={{ stopColor: '#8A6500' }} />
              </linearGradient>
            </defs>

            {/* Le Fil principal */}
            <path 
              d={`M0,${P0_Y} Q${VIEWBOX_W / 2},${P1_Y} ${VIEWBOX_W},${P2_Y}`} 
              fill="none" 
              stroke="url(#goldGradient)" 
              strokeWidth="2"
            />

            {/* Points d'ancrage (Hardware Joaillerie) */}
            <circle cx="2" cy={P0_Y} r="4" fill="#D4AF37" />
            <circle cx={VIEWBOX_W - 2} cy={P2_Y} r="4" fill="#D4AF37" />
          </svg>

          {/* Perles positionnées sur le fil */}
          <div className="bead-rail">
            {items.map((item, i) => {
              const isAll = item.name === 'Tout';
              const isActive = isAll ? activeCategories.length === 0 : activeCategories.includes(item.name);
              
              // On utilise un léger rembourrage (padding) sur les bords pour que les perles 
              // ne se chevauchent pas avec les ancrages SVG
              const edgePadding = 0.08;
              const t = edgePadding + (i / (items.length - 1)) * (1 - 2 * edgePadding);
              
              return (
                <JewelBead
                  key={item.name}
                  label={item.name}
                  isActive={isActive}
                  onClick={isAll ? onCategoryAll : () => onCategoryToggle(item.name)}
                  materialClass={BEAD_MATERIALS[item.name] || 'material--stone'}
                  t={t}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

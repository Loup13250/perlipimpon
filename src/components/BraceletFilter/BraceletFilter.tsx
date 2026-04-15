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

/**
 * Perle de joaillerie individuelle
 */
interface JewelBeadProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  materialClass: string;
  index: number;
  total: number;
}

function JewelBead({ label, isActive, onClick, materialClass, index, total }: JewelBeadProps) {
  // Calcul de la courbure (parabole simple pour l'effet "collier porté")
  const midpoint = (total - 1) / 2;
  const distanceFromCenter = index - midpoint;
  const curveIntensity = 18; // Intensité du pendage
  const translateY = Math.pow(distanceFromCenter, 2) * (curveIntensity / Math.pow(midpoint || 1, 2));

  return (
    <div 
      className="bead-wrapper"
      style={{ 
        transform: `translateY(${translateY}px)`,
        '--bead-delay': `${index * 0.08}s`
      } as React.CSSProperties}
    >
      <button
        className={`bead ${materialClass} ${isActive ? 'bead--active' : ''}`}
        onClick={onClick}
        aria-pressed={isActive}
      >
        <span className="bead__label">{label}</span>
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
            <span className="necklace-title__glint" />
            Collection
          </h3>
          {activeCategories.length > 0 && (
            <button className="necklace-reset" onClick={onClearFilters}>
              Réinitialiser
            </button>
          )}
        </header>

        <div className="necklace-row">
          {/* Fil d'or courbe (SVG) */}
          <svg className="necklace-wire" viewBox="0 0 1000 120" preserveAspectRatio="none">
            <path 
              d="M0,10 Q500,120 1000,10" 
              fill="none" 
              stroke="url(#goldGradient)" 
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8A6500' }} />
                <stop offset="20%" style={{ stopColor: '#D4AF37' }} />
                <stop offset="50%" style={{ stopColor: '#F3E5AB' }} />
                <stop offset="80%" style={{ stopColor: '#D4AF37' }} />
                <stop offset="100%" style={{ stopColor: '#8A6500' }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Perles positionnées sur le fil */}
          <div className="bead-rail">
            {items.map((item, i) => {
              const isAll = item.name === 'Tout';
              const isActive = isAll ? activeCategories.length === 0 : activeCategories.includes(item.name);
              
              return (
                <JewelBead
                  key={item.name}
                  label={item.name}
                  isActive={isActive}
                  onClick={isAll ? onCategoryAll : () => onCategoryToggle(item.name)}
                  materialClass={BEAD_MATERIALS[item.name] || 'material--stone'}
                  index={i}
                  total={items.length}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

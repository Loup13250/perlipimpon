/**
 * FloralBorders — Décorations botaniques sur les bords du site.
 * Ajoute une touche organique et délicate aux pages.
 */

import './FloralBorders.css';

export default function FloralBorders() {
  return (
    <>
      {/* Filtre SVG chirurgical pour transformer le blanc en transparence réelle */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', visibility: 'hidden' }}>
        <defs>
          <filter id="remove-white-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                     -1.5 -1.5 -1.5 1 3.5" 
            />
          </filter>
        </defs>
      </svg>

      <div className="floral-frame" aria-hidden="true">
        <div className="floral-border floral-border--left">
          <div className="floral-border-inner" />
        </div>
        <div className="floral-border floral-border--right">
          <div className="floral-border-inner" />
        </div>
      </div>
    </>
  );
}

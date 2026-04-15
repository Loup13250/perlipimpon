/**
 * FloralBorders — Décorations botaniques sur les bords du site.
 * Ajoute une touche organique et délicate aux pages.
 */

import './FloralBorders.css';

export default function FloralBorders() {
  return (
    <div className="floral-frame" aria-hidden="true">
      <div className="floral-border floral-border--left">
        <div className="floral-border-inner" />
      </div>
      <div className="floral-border floral-border--right">
        <div className="floral-border-inner" />
      </div>
    </div>
  );
}

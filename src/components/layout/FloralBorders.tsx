/**
 * FloralBorders — Décorations botaniques sur les bords du site.
 * Ajoute une touche organique et délicate aux pages.
 */

import './FloralBorders.css';

export default function FloralBorders() {
  return (
    <div className="floral-frame" aria-hidden="true">
      <div className="floral-border floral-border--left">
        <img src="/images/decorations/floral-left.png" alt="" />
      </div>
      <div className="floral-border floral-border--right">
        <img src="/images/decorations/floral-right.png" alt="" />
      </div>
    </div>
  );
}

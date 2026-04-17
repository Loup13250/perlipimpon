/**
 * Page détail produit — galerie + informations complètes.
 * Accessible via /creations/:id
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { formatPrice, formatDate } from '../utils/helpers';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getArticle, articlesLoading } = useArticles();
  const article = id ? getArticle(id) : undefined;
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevPhoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (article) setActivePhoto(prev => (prev - 1 + article.photos.length) % article.photos.length);
  }, [article]);

  const nextPhoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (article) setActivePhoto(prev => (prev + 1) % article.photos.length);
  }, [article]);

  // Navigation clavier + scroll lock dans la lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxOpen, closeLightbox, prevPhoto, nextPhoto]);

  return (
    <div className="product-page">
      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && article && article.photos.length > 0 && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie : ${article.titre}`}
        >
          {/* Bouton Précédent */}
          {article.photos.length > 1 && (
            <button
              onClick={prevPhoto}
              style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: 'white', fontSize: '2rem', cursor: 'pointer',
                width: '52px', height: '52px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, transition: 'background 0.2s',
                lineHeight: 1, padding: 0,
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              aria-label="Photo précédente"
            >
              &#8249;
            </button>
          )}

          {/* Image principale */}
          <img
            src={article.photos[activePhoto]}
            alt={`${article.titre} — Vue ${activePhoto + 1}`}
            style={{ maxHeight: '88vh', maxWidth: '86vw', objectFit: 'contain', userSelect: 'none', zIndex: 10000 }}
            onClick={e => e.stopPropagation()}
            draggable={false}
          />

          {/* Bouton Suivant */}
          {article.photos.length > 1 && (
            <button
              onClick={nextPhoto}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: 'white', fontSize: '2rem', cursor: 'pointer',
                width: '52px', height: '52px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, transition: 'background 0.2s',
                lineHeight: 1, padding: 0,
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              aria-label="Photo suivante"
            >
              &#8250;
            </button>
          )}

          {/* Bouton Fermer */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              color: 'white', fontSize: '1.4rem', cursor: 'pointer',
              width: '44px', height: '44px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10001, padding: 0,
            }}
            aria-label="Fermer"
          >
            ×
          </button>

          {/* Indicateurs de position (dots) */}
          {article.photos.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 10001,
            }}>
              {article.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActivePhoto(i); }}
                  style={{
                    width: i === activePhoto ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === activePhoto ? 'rgba(201,169,110,0.9)' : 'rgba(255,255,255,0.45)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    padding: 0,
                  }}
                  aria-label={`Vue ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="container">
        {articlesLoading ? (
          <div className="product-not-found">
            <p style={{ color: 'var(--color-gold)' }}>Chargement de la création...</p>
          </div>
        ) : !article ? (
          <div className="product-not-found">
            <div className="product-not-found__icon" style={{ fontSize: '3rem' }}><span role="img" aria-label="Not found">🌙</span></div>
            <h2>Création introuvable</h2>
            <p>Cette pièce n'existe pas ou a été retirée de la collection.</p>
            <Link to="/creations" className="btn btn--primary">
              Retour aux créations
            </Link>
          </div>
        ) : (
          <>
            {/* Fil d'ariane */}
            <nav className="product-breadcrumb">
              <Link to="/">Accueil</Link>
              <span className="separator">›</span>
              <Link to="/creations">Créations</Link>
              <span className="separator">›</span>
              <span>{article.titre}</span>
            </nav>

            {/* Layout principal */}
            <div className="product-layout">
              {/* Galerie images */}
              <div className="gallery">
                <div className="gallery__main" style={{ position: 'relative', cursor: article.photos.length > 0 ? 'zoom-in' : 'default', background: 'var(--color-cream)' }} onClick={() => article.photos.length > 0 && setLightboxOpen(true)}>
                  {article.vendu && (
                    <div className="product-card__banner-vendu" style={{ top: '40px', right: '-65px', width: '280px', fontSize: 'var(--text-lg)', padding: '12px 0' }}>
                      <span>Vendu</span>
                    </div>
                  )}
                  {article.photos.length > 0 ? (
                    <img
                      src={article.photos[activePhoto]}
                      alt={`${article.titre} — Vue ${activePhoto + 1}`}
                      width="800"
                      height="800"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="gallery__main-placeholder">
                      <span role="img" aria-label="placeholder" style={{ fontSize: '5rem', color: 'var(--color-gold)' }}>🌙</span>
                      <span>Photo à venir</span>
                    </div>
                  )}
                </div>

                {article.photos.length > 1 && (
                  <div className="gallery__thumbs">
                    {article.photos.map((photo, index) => (
                      <button
                        key={index}
                        className={`gallery__thumb ${index === activePhoto ? 'active' : ''}`}
                        onClick={() => setActivePhoto(index)}
                        aria-label={`Vue ${index + 1}`}
                      >
                        <img src={photo} alt={`${article.titre} — Miniature ${index + 1}`} loading="lazy" width="100" height="100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informations produit */}
              <div className="product-info">
                <p className="product-info__category">{article.categorie}</p>
                <h1>{article.titre}</h1>
                <p className="product-info__price">{formatPrice(article.prix)}</p>
                <div className="product-info__divider" />
                <p className="product-info__description">{article.description}</p>

                {/* Détails */}
                <div className="product-info__details">
                  <div className="product-info__detail-row">
                    <span className="product-info__detail-label">Catégorie</span>
                    <span className="product-info__detail-value">
                      <span className="badge badge--gold">{article.categorie}</span>
                    </span>
                  </div>


                  <div className="product-info__detail-row">
                    <span className="product-info__detail-label">Ajouté le</span>
                    <span className="product-info__detail-value">
                      {formatDate(article.dateCreation)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="product-info__actions">
                  {article.vendu ? (
                    <button className="btn btn--outline btn--lg" disabled style={{ opacity: 0.7, cursor: 'not-allowed', width: '100%', borderColor: 'var(--color-gray-500)', color: 'var(--color-gray-500)' }}>
                      Cette création a été vendue
                    </button>
                  ) : (
                    <Link to="/contact" className="btn btn--primary btn--lg" style={{ width: '100%', textAlign: 'center' }}>
                      Prendre contact pour ce bijou
                    </Link>
                  )}
                  <Link to="/creations" className="btn btn--outline" style={{ width: '100%', textAlign: 'center' }}>
                    ← Retour aux créations
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

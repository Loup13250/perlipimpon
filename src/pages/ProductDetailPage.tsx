/**
 * Page détail produit — galerie + informations complètes.
 * Accessible via /creations/:id
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { formatPrice, formatDate } from '../utils/helpers';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getArticle, articlesLoading } = useArticles();
  const article = id ? getArticle(id) : undefined;
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="product-page">
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
                <div className="gallery__main" style={{ position: 'relative' }}>
                  {article.vendu && (
                    <div className="product-card__banner-vendu" style={{ top: '40px', right: '-65px', width: '280px', fontSize: 'var(--text-lg)', padding: '12px 0' }}>
                      <span>Vendu</span>
                    </div>
                  )}
                  {article.photos.length > 0 ? (
                    <img
                      src={article.photos[activePhoto]}
                      alt={`${article.titre} — Vue ${activePhoto + 1}`}
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
                        <img src={photo} alt={`${article.titre} — Miniature ${index + 1}`} />
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

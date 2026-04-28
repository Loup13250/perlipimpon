/**
 * Page Admin — Dashboard complet avec gestion des articles.
 * Protégée par mot de passe.
 * Vue principale : liste + formulaire d'édition + gestion des données.
 */

import { useState, useCallback, useEffect, useRef, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useArticles } from '../hooks/useArticles';
import { useConfig } from '../hooks/useConfig';
import { useLogs } from '../hooks/useLogs';
import { formatPrice, formatDate, compressImageToBase64, compressCategoryImage } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { defaultSiteConfig } from '../data/sampleArticles';
import type { Article, ArticleFormData, Category, SiteConfig, CategoryData } from '../types';

// ──────────────────────────────────────────────
// Hook : avertissement avant fermeture navigateur
// ──────────────────────────────────────────────
function useBeforeUnload(isDirty: boolean | React.MutableRefObject<boolean>) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const dirty = typeof isDirty === 'boolean' ? isDirty : isDirty.current;
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}

// ──────────────────────────────────────────────
// Composant Login
// ──────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (email: string, password: string) => Promise<boolean> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onLogin(email, password);
    if (!success) {
      setError('Identifiants incorrects');
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-login">
          <div className="admin-login__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1"/></svg>
          </div>
          <h2>Espace Créatrice</h2>
          <p>Connectez-vous pour gérer vos créations</p>

          {error && <p className="admin-login__error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-email">Adresse e-mail</label>
              <input
                id="admin-email"
                name="admin-email"
                type="email"
                placeholder="Entrez votre e-mail"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="admin-password">Mot de passe</label>
              <input
                id="admin-password"
                name="admin-password"
                type="password"
                placeholder="Entrez le mot de passe"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Composant Formulaire Article
// ──────────────────────────────────────────────
function ArticleForm({
  article,
  categories,
  onSave,
  onCancel,
  onDirtyChange,
}: {
  article?: Article;
  categories: string[];
  onSave: (data: ArticleFormData) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const isEditing = !!article;

  const [form, setForm] = useState<ArticleFormData>({
    titre: article?.titre || '',
    description: article?.description || '',
    prix: article?.prix || 0,
    categorie: article?.categorie || (categories[0] || 'Colliers'),
    photos: article?.photos || [],
    enVedette: article?.enVedette || false,
    vendu: article?.vendu || false,
  });

  const isDirtyRef = useRef(false);

  const updateField = <K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (!isDirtyRef.current) {
        isDirtyRef.current = true;
        onDirtyChange?.(true);
      }
      return next;
    });
  };

  // Réinitialiser dirty après sauvegarde
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.titre.trim() || form.prix <= 0) return;
    isDirtyRef.current = false;
    onDirtyChange?.(false);
    onSave(form);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newPhotosBase64: string[] = [];
    for (const file of Array.from(files)) {
      try {
        // Compression avant stockage Firestore (limite 1 Mo/document)
        const base64 = await compressImageToBase64(file, 800, 0.75);
        newPhotosBase64.push(base64);
      } catch (err) {
        console.error('Erreur upload photo:', err);
      }
    }
    setForm((prev) => {
      const updatedPhotos = [...prev.photos, ...newPhotosBase64].slice(0, 4);
      if (!isDirtyRef.current) {
        isDirtyRef.current = true;
        onDirtyChange?.(true);
      }
      return { ...prev, photos: updatedPhotos };
    });
    // Réinitialiser l'input pour pouvoir re-sélectionner le même fichier
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    updateField('photos', form.photos.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-form">
      <div className="admin-form__header">
        <h2 style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {isEditing ? (
            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Modifier l'article</>
          ) : (
            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Nouvel article</>
          )}
        </h2>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={onCancel}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form__grid">
          {/* Titre */}
          <div className="form-group">
            <label htmlFor="article-titre">Titre *</label>
            <input
              id="article-titre"
              name="titre"
              type="text"
              placeholder="Ex : Collier Éclat de Lune"
              value={form.titre}
              onChange={(e) => updateField('titre', e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Prix */}
          <div className="form-group">
            <label htmlFor="article-prix">Prix (€) *</label>
            <input
              id="article-prix"
              name="prix"
              type="number"
              min="0"
              step="0.01"
              placeholder="45.00"
              value={form.prix || ''}
              onChange={(e) => updateField('prix', parseFloat(e.target.value) || 0)}
              required
              autoComplete="off"
            />
          </div>

          {/* Catégorie */}
          <div className="form-group">
            <label htmlFor="article-categorie">Catégorie</label>
            <select
              id="article-categorie"
              name="categorie"
              value={form.categorie}
              onChange={(e) => updateField('categorie', e.target.value as Category)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group form-group--full">
            <label htmlFor="article-description">Description</label>
            <textarea
              id="article-description"
              name="description"
              placeholder="Décrivez ce bijou en détail : matériaux, dimensions, inspiration..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              autoComplete="off"
            />
          </div>

          {/* Upload photos */}
          <div className="photo-upload">
            <label>Photos ({form.photos.length}/4)</label>

            {/* Zone cliquable pour ajouter des photos */}
            <label
              className="photo-upload__area"
              htmlFor="photo-input-field"
              style={{
                cursor: form.photos.length < 4 ? 'pointer' : 'not-allowed',
                opacity: form.photos.length < 4 ? 1 : 0.55,
                pointerEvents: form.photos.length < 4 ? 'auto' : 'none',
              }}
            >
              <div className="photo-upload__area-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              {form.photos.length < 4 ? (
                <>
                  <p><span>Cliquez pour ajouter</span> des photos (max 4)</p>
                  <p>JPG, PNG — 5 Mo max par image</p>
                </>
              ) : (
                <p style={{ color: 'var(--color-gold-deep)', fontWeight: 600 }}>Limite de 4 photos atteinte</p>
              )}
            </label>
            <input
              id="photo-input-field"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />

            {form.photos.length > 0 && (
              <div className="photo-upload__preview">
                {form.photos.map((photo, index) => (
                  <div key={index} className="photo-preview">
                    <img src={photo} alt={`Photo ${index + 1}`} />
                    <button
                      type="button"
                      className="photo-preview__remove"
                      onClick={() => removePhoto(index)}
                      aria-label={`Supprimer photo ${index + 1}`}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* En vedette & Vendu */}
          <div className="form-group form-group--full" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label className="beautiful-toggle">
              <input
                id="toggle-enVedette"
                name="enVedette"
                type="checkbox"
                checked={form.enVedette}
                onChange={(e) => updateField('enVedette', e.target.checked)}
              />
              <div className="beautiful-toggle__slider"></div>
              <span className="beautiful-toggle__label" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color:'#e07090' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Coup de Cœur
              </span>
            </label>

            <label className="beautiful-toggle">
              <input
                id="toggle-vendu"
                name="vendu"
                type="checkbox"
                checked={form.vendu}
                onChange={(e) => updateField('vendu', e.target.checked)}
              />
              <div className="beautiful-toggle__slider"></div>
              <span className="beautiful-toggle__label" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0e9f9f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Marquer comme vendu
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline" onClick={onCancel}>Annuler</button>
            <button type="submit" className="btn btn--primary">
              {isEditing ? 'Enregistrer' : 'Créer l\'article'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────
// Formulaire Paramètres Généraux
// ──────────────────────────────────────────────
function SiteConfigForm({
  config,
  onSave,
  onInjectSamples,
  onDirtyChange,
}: {
  config: SiteConfig;
  onSave: (c: SiteConfig) => void;
  onInjectSamples: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [form, setForm] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'pages' | 'about' | 'testimonials' | 'maintenance'>('general');
  const isDirtyRef = useRef(false);

  // Sync si la config change depuis l'extérieur (ex: import JSON)
  useEffect(() => {
    setForm(config);
  }, [config]);

  useBeforeUnload(isDirtyRef);

  const handleChange = (field: keyof SiteConfig, value: unknown) => {
    setForm(prev => {
      if (!isDirtyRef.current) {
        isDirtyRef.current = true;
        onDirtyChange?.(true);
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    isDirtyRef.current = false;
    onDirtyChange?.(false);
    onSave(form);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const b64 = await compressImageToBase64(file, 1200, 0.80);
        handleChange(field, b64);
      } catch {
        alert('Erreur de chargement d\'image');
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'Général & SEO', icon: '' },
    { id: 'hero', label: 'Accueil & CTA', icon: '' },
    { id: 'pages', label: 'Gestion du Contenu', icon: '' },
    { id: 'about', label: 'À Propos', icon: '' },
    { id: 'testimonials', label: 'Avis Clients', icon: '' },
    { id: 'maintenance', label: 'Maintenance', icon: '' },
  ] as const;

  return (
    <div className="admin-form">
      {/* Sous-Menu Navigation */}
      <div className="admin-subtabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`admin-subtab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        {/* TAB 1: GENERAL & SEO */}
        {activeTab === 'general' && (
          <>
            <h2>Contact & Réseaux Sociaux</h2>
            <div className="admin-form__grid" style={{ marginBottom: '2rem' }}>
              <div className="form-group">
                <label htmlFor="config-nomMarque">Nom de la Marque</label>
                <input id="config-nomMarque" name="nomMarque" type="text" value={form.nomMarque} onChange={e => handleChange('nomMarque', e.target.value)} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-email">Email de contact</label>
                <input id="config-email" name="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-telephone">Téléphone</label>
                <input id="config-telephone" name="telephone" type="text" value={form.telephone} onChange={e => handleChange('telephone', e.target.value)} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-facebook">Lien Facebook</label>
                <input id="config-facebook" name="facebook" type="url" value={form.facebook} onChange={e => handleChange('facebook', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-instagram">Lien Instagram</label>
                <input id="config-instagram" name="instagram" type="url" value={form.instagram} onChange={e => handleChange('instagram', e.target.value)} autoComplete="off" />
              </div>
            </div>

            <h2>Optimisation Moteur de Recherche (SEO)</h2>
            <div className="admin-form__grid">
              <div className="form-group form-group--full">
                <label htmlFor="config-metaTitle">Titre de l'onglet (Meta Title)</label>
                <input id="config-metaTitle" name="metaTitle" type="text" value={form.metaTitle} onChange={e => handleChange('metaTitle', e.target.value)} required autoComplete="off" />
                <small style={{color:'var(--color-gray-500)', marginTop:'4px', display:'block'}}>C'est ce qui s'affiche dans l'onglet du navigateur et tout en haut des résultats Google.</small>
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-metaDescription">Description du site (Meta Description)</label>
                <textarea id="config-metaDescription" name="metaDescription" rows={3} value={form.metaDescription} onChange={e => handleChange('metaDescription', e.target.value)} required autoComplete="off" />
                <small style={{color:'var(--color-gray-500)', marginTop:'4px', display:'block'}}>Un court résumé incitatif (150 caractères idéalement) affiché dans les résultats Google.</small>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: HERO & CTA */}
        {activeTab === 'hero' && (
          <>
            <h2>Visuel du Haut de Page (Accueil)</h2>
            <div className="admin-form__grid" style={{ marginBottom: '2rem' }}>
              <div className="form-group form-group--full">
                <label>Image d'ambiance (Haut de page — Bureau & Défaut)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {form.heroImage && <img src={form.heroImage} alt="Hero" style={{ flexShrink: 0, height: '64px', width: '100px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(201,169,110,0.2)' }} />}
                  <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0 }}>
                    Changer l'image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={e => handleImageUpload(e, 'heroImage')} />
                  </label>
                </div>
              </div>
              <div className="form-group form-group--full">
                <label>Image d'ambiance (Mobile — Format vertical/réduit recommandé)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {form.heroImageMobile && <img src={form.heroImageMobile} alt="Hero Mobile" style={{ flexShrink: 0, height: '64px', width: '64px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(201,169,110,0.2)' }} />}
                  <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0 }}>
                    Changer l'image Mobile
                    <input type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={e => handleImageUpload(e, 'heroImageMobile')} />
                  </label>
                </div>
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-heroSubtitle">Surtitre (Au dessus du titre)</label>
                <input id="config-heroSubtitle" name="heroSubtitle" type="text" value={form.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-heroTitle1">Titre principal (Début en blanc)</label>
                <input id="config-heroTitle1" name="heroTitle1" type="text" value={form.heroTitle1 || ''} onChange={e => handleChange('heroTitle1', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-heroTitle2">Mot accentué (Fin en italique doré)</label>
                <input id="config-heroTitle2" name="heroTitle2" type="text" value={form.heroTitle2 || ''} onChange={e => handleChange('heroTitle2', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-heroDescription">Texte descriptif principal</label>
                <textarea id="config-heroDescription" name="heroDescription" rows={3} value={form.heroDescription || ''} onChange={e => handleChange('heroDescription', e.target.value)} autoComplete="off" />
              </div>
            </div>

            <h2>Bandeau d'Appel à l'action (Bas de page)</h2>
            <div className="admin-form__grid">
              <div className="form-group form-group--full">
                <label htmlFor="config-ctaTitle">Titre d'accroche</label>
                <input id="config-ctaTitle" name="ctaTitle" type="text" value={form.ctaTitle || ''} onChange={e => handleChange('ctaTitle', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-ctaDescription">Texte incitatif (Contactez-nous...)</label>
                <textarea id="config-ctaDescription" name="ctaDescription" rows={2} value={form.ctaDescription || ''} onChange={e => handleChange('ctaDescription', e.target.value)} autoComplete="off" />
              </div>
            </div>
          </>
        )}

        {/* TAB PAGES: HEADERS & BRAND VALUES */}
        {activeTab === 'pages' && (
          <>
            <h2>En-têtes de Pages</h2>
            <div className="admin-form__grid" style={{ marginBottom: '2rem' }}>
              <div className="form-group">
                <label htmlFor="config-shopTitle">Titre Boutique (Nos Créations)</label>
                <input id="config-shopTitle" name="shopTitle" type="text" value={form.shopTitle || ''} onChange={e => handleChange('shopTitle', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-shopSubtitle">Sous-titre Boutique</label>
                <input id="config-shopSubtitle" name="shopSubtitle" type="text" value={form.shopSubtitle || ''} onChange={e => handleChange('shopSubtitle', e.target.value)} autoComplete="off" />
              </div>
              
              <div className="form-group">
                <label htmlFor="config-contactTitle">Titre Contact</label>
                <input id="config-contactTitle" name="contactTitle" type="text" value={form.contactTitle || ''} onChange={e => handleChange('contactTitle', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-contactSubtitle">Sous-titre Contact</label>
                <input id="config-contactSubtitle" name="contactSubtitle" type="text" value={form.contactSubtitle || ''} onChange={e => handleChange('contactSubtitle', e.target.value)} autoComplete="off" />
              </div>

              <div className="form-group">
                <label htmlFor="config-aboutHeroTitle">Surtitre À Propos (Haut de page)</label>
                <input id="config-aboutHeroTitle" name="aboutHeroTitle" type="text" value={form.aboutHeroTitle || ''} onChange={e => handleChange('aboutHeroTitle', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="config-aboutHeroSubtitle">Sous-titre À Propos</label>
                <input id="config-aboutHeroSubtitle" name="aboutHeroSubtitle" type="text" value={form.aboutHeroSubtitle || ''} onChange={e => handleChange('aboutHeroSubtitle', e.target.value)} autoComplete="off" />
              </div>
            </div>

            <h2>L'Âme de l'Atelier (Valeurs Accueil)</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Les 4 valeurs affichées sur la page d'accueil (Atelier Artisanal, Gemmes Sélectionnées...).</p>
            {(form.brandValues || []).map((val, index) => (
              <div key={index} style={{ border: '1px solid rgba(201,169,110,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', position: 'relative', background: 'rgba(250,246,240,0.5)' }}>
                <button type="button" className="btn btn--outline btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'transparent' }} title="Supprimer cette valeur" onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette valeur ?")) {
                    const arr = [...form.brandValues]; arr.splice(index, 1); handleChange('brandValues', arr);
                  }
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
                <div className="admin-form__grid">
                  <div className="form-group form-group--full">
                    <label htmlFor={`brandValue-title-${index}`}>Titre</label>
                    <input id={`brandValue-title-${index}`} name={`brandValue-title-${index}`} type="text" value={val.title} autoComplete="off" onChange={e => {
                      const arr = [...form.brandValues]; arr[index] = { ...arr[index], title: e.target.value }; handleChange('brandValues', arr);
                    }} required />
                  </div>
                  <div className="form-group form-group--full">
                    <label htmlFor={`brandValue-desc-${index}`}>Description</label>
                    <textarea id={`brandValue-desc-${index}`} name={`brandValue-desc-${index}`} rows={2} value={val.description} autoComplete="off" onChange={e => {
                      const arr = [...form.brandValues]; arr[index] = { ...arr[index], description: e.target.value }; handleChange('brandValues', arr);
                    }} required />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleChange('brandValues', [...(form.brandValues || []), { title: 'Nouvelle Valeur', description: '' }])}>+ Ajouter une valeur</button>
          </>
        )}

        {/* TAB 3: ABOUT & PROCESS */}
        {activeTab === 'about' && (
          <>
            <h2>Histoire de la Marque (A Propos)</h2>
            <div className="admin-form__grid" style={{ marginBottom: '2rem' }}>
              <div className="form-group form-group--full">
                <label>Image d'illustration personnelle</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {form.aboutImage && <img src={form.aboutImage} alt="A propos" style={{ flexShrink: 0, height: '64px', width: '64px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(201,169,110,0.2)' }} />}
                  <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0 }}>
                    Changer l'image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={e => handleImageUpload(e, 'aboutImage')} />
                  </label>
                </div>
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-aboutTitle">Titre principal ("À propos")</label>
                <input id="config-aboutTitle" name="aboutTitle" type="text" value={form.aboutTitle || ''} onChange={e => handleChange('aboutTitle', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-aboutText1">Texte descriptif (Paragraphe 1)</label>
                <textarea id="config-aboutText1" name="aboutText1" rows={3} value={form.aboutText1 || ''} onChange={e => handleChange('aboutText1', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="config-aboutText2">Texte descriptif (Paragraphe 2)</label>
                <textarea id="config-aboutText2" name="aboutText2" rows={3} value={form.aboutText2 || ''} onChange={e => handleChange('aboutText2', e.target.value)} autoComplete="off" />
              </div>
            </div>

            <h2>Processus de Création</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Les étapes de fabrication affichées sur la page À propos.</p>
            {(form.processSteps || []).map((step, index) => (
              <div key={index} style={{ border: '1px solid rgba(201,169,110,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', position: 'relative', background: 'rgba(250,246,240,0.5)' }}>
                <button type="button" className="btn btn--outline btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'transparent' }} title="Supprimer cette étape" onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) {
                    const arr = [...form.processSteps]; arr.splice(index, 1); handleChange('processSteps', arr);
                  }
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
                <div className="admin-form__grid">
                  <div className="form-group">
                    <label htmlFor={`processStep-title-${index}`}>Étape N° {index + 1} - Titre</label>
                    <input id={`processStep-title-${index}`} name={`processStep-title-${index}`} type="text" value={step.title} autoComplete="off" onChange={e => {
                      const arr = [...form.processSteps]; arr[index] = { ...arr[index], title: e.target.value }; handleChange('processSteps', arr);
                    }} required />
                  </div>
                  <div className="form-group form-group--full">
                    <label htmlFor={`processStep-desc-${index}`}>Description courte</label>
                    <input id={`processStep-desc-${index}`} name={`processStep-desc-${index}`} type="text" value={step.description} autoComplete="off" onChange={e => {
                      const arr = [...form.processSteps]; arr[index] = { ...arr[index], description: e.target.value }; handleChange('processSteps', arr);
                    }} required />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleChange('processSteps', [...(form.processSteps || []), { number: (form.processSteps?.length || 0) + 1, title: 'Nouvelle Étape', description: '' }])}>+ Ajouter une étape</button>

            <h2 style={{ marginTop: '3rem' }}>L'Âme des Pierres (Lithothérapie)</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Les trois valeurs ou bienfaits des pierres affichés sur la page À propos.</p>
            {(form.lithotherapyValues || []).map((item, index) => (
              <div key={index} style={{ border: '1px solid rgba(201,169,110,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', position: 'relative', background: 'rgba(250,246,240,0.5)' }}>
                <button type="button" className="btn btn--outline btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'transparent' }} title="Supprimer cette valeur" onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette valeur de lithothérapie ?")) {
                    const arr = [...form.lithotherapyValues]; arr.splice(index, 1); handleChange('lithotherapyValues', arr);
                  }
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
                <div className="admin-form__grid">
                  <div className="form-group form-group--full">
                    <label htmlFor={`litho-title-${index}`}>Titre de la valeur</label>
                    <input id={`litho-title-${index}`} name={`litho-title-${index}`} type="text" value={item.title} autoComplete="off" onChange={e => {
                      const arr = [...form.lithotherapyValues]; arr[index] = { ...arr[index], title: e.target.value }; handleChange('lithotherapyValues', arr);
                    }} required />
                  </div>
                  <div className="form-group form-group--full">
                    <label htmlFor={`litho-desc-${index}`}>Description (Bienfaits)</label>
                    <textarea id={`litho-desc-${index}`} name={`litho-desc-${index}`} rows={2} value={item.description} autoComplete="off" onChange={e => {
                      const arr = [...form.lithotherapyValues]; arr[index] = { ...arr[index], description: e.target.value }; handleChange('lithotherapyValues', arr);
                    }} required />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleChange('lithotherapyValues', [...(form.lithotherapyValues || []), { title: 'Nouveau Bienfait', description: '' }])}>+ Ajouter un bienfait</button>
          </>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <>
            <h2>Vos Mots Doux (Avis Clients)</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Saisissez ici les meilleurs retours de vos clients affichés sur la page d'accueil.</p>
            {(form.testimonials || []).map((t, index) => (
              <div key={index} style={{ border: '1px solid rgba(201,169,110,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', position: 'relative', background: 'rgba(250,246,240,0.5)' }}>
                <button type="button" className="btn btn--outline btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'transparent' }} title="Supprimer ce témoignage" onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
                    const arr = [...form.testimonials]; arr.splice(index, 1); handleChange('testimonials', arr);
                  }
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
                <div className="admin-form__grid">
                  <div className="form-group">
                    <label htmlFor={`testimonial-auteur-${index}`}>Auteur</label>
                    <input id={`testimonial-auteur-${index}`} name={`testimonial-auteur-${index}`} type="text" value={t.auteur} autoComplete="off" onChange={e => {
                      const arr = form.testimonials.map((item, i) => i === index ? { ...item, auteur: e.target.value } : item);
                      handleChange('testimonials', arr);
                    }} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`testimonial-note-${index}`}>Note / 5</label>
                    <input id={`testimonial-note-${index}`} name={`testimonial-note-${index}`} type="number" min="1" max="5" value={t.note} onChange={e => {
                      const arr = form.testimonials.map((item, i) => i === index ? { ...item, note: Number(e.target.value) } : item);
                      handleChange('testimonials', arr);
                    }} required />
                  </div>
                  <div className="form-group form-group--full">
                    <label htmlFor={`testimonial-texte-${index}`}>Texte (L'avis)</label>
                    <textarea id={`testimonial-texte-${index}`} name={`testimonial-texte-${index}`} rows={2} value={t.texte} autoComplete="off" onChange={e => {
                      const arr = form.testimonials.map((item, i) => i === index ? { ...item, texte: e.target.value } : item);
                      handleChange('testimonials', arr);
                    }} required />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleChange('testimonials', [...(form.testimonials || []), { id: `t-${Date.now()}`, auteur: 'Nom', note: 5, texte: '' }])}>+ Ajouter un témoignage</button>
          </>
        )}

        {/* TAB 5: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <>
            <h2>Maintenance & Données</h2>
            <div className="maintenance-section" style={{ background: 'rgba(201,169,110,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(201,169,110,0.3)', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                Articles de démonstration
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Si votre boutique est vide, injectez les 12 créations de démonstration pour voir le rendu complet.
              </p>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                style={{ color: 'var(--color-gold-deep)', borderColor: 'var(--color-gold-deep)' }}
                onClick={() => {
                  if (window.confirm("Injecter les 12 articles démo ? (Vos articles actuels ne seront pas supprimés)")) {
                    onInjectSamples();
                  }
                }}
              >
                Injecter 12 articles démo
              </button>
            </div>

            <div className="maintenance-section" style={{ background: 'rgba(201,169,110,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(201,169,110,0.3)', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Réinitialiser les Avis Clients
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Remplace tous les avis actuels par les 9 témoignages modèles pré-écrits et les sauvegarde immédiatement en ligne.
              </p>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                style={{ color: 'var(--color-charcoal)', borderColor: 'rgba(84,74,66,0.4)' }}
                onClick={() => {
                  if (window.confirm("Réinitialiser les avis clients avec les 9 modèles ? Les avis actuels seront remplacés et sauvegardés immédiatement.")) {
                    const newForm = { ...form, testimonials: defaultSiteConfig.testimonials };
                    setForm(newForm);
                    isDirtyRef.current = false;
                    onDirtyChange?.(false);
                    onSave(newForm);
                  }
                }}
              >
                Réinitialiser avec les avis modèles
              </button>
            </div>

            <div className="maintenance-section" style={{ background: 'rgba(201,169,110,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(201,169,110,0.3)', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Sauvegarde et Restauration
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Vous pouvez exporter toute la configuration actuelle de votre site vers un fichier JSON, ou importer un fichier existant pour restaurer une configuration.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form, null, 2));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "perlimpimpon_config_backup.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                >
                  Exporter (Télécharger)
                </button>

                <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0, borderColor: 'var(--color-gray-400)' }}>
                  Importer (Restaurer)
                  <input type="file" accept=".json" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedConfig = JSON.parse(event.target?.result as string);
                        if (window.confirm("Êtes-vous sûr de vouloir écraser la configuration actuelle ? Pensez à sauvegarder avant !")) {
                          setForm(importedConfig);
                          isDirtyRef.current = true;
                          if (onDirtyChange) onDirtyChange(true);
                          alert("Configuration importée avec succès. N'oubliez pas d'Enregistrer.");
                        }
                      } catch {
                        alert("Le fichier JSON est invalide.");
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = '';
                  }} />
                </label>
              </div>
            </div>

            <div className="maintenance-section" style={{ background: 'rgba(201,169,110,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(201,169,110,0.3)', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                Vider le cache du navigateur
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Si vous rencontrez des problèmes d'affichage ou que vos modifications ne semblent pas s'appliquer, vider le cache local peut forcer le site à récupérer les données fraîches depuis le serveur.
              </p>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={() => {
                  if (window.confirm("Êtes-vous sûr ? Cela rafraîchira la page immédiatement.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Vider le cache et rafraîchir
              </button>
            </div>

            <div style={{ background: 'rgba(22, 163, 74, 0.05)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(22, 163, 74, 0.15)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0, paddingTop: '2px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }}></span>
                Cloud actif
              </div>
              <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', margin: 0 }}>
                Vos modifications sont sauvegardées instantanément sur Firestore et visibles 24h/24.
              </p>
            </div>
          </>
        )}

        <div className="admin-form__actions" style={{ marginTop: '2rem', borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: '1.5rem' }}>
          {activeTab !== 'maintenance' && (
            <button type="submit" className="btn btn--primary btn--lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Enregistrer
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────
// Formulaire Catégories
// ──────────────────────────────────────────────
function CategoriesForm({
  config,
  onSave,
  onDirtyChange,
}: {
  config: SiteConfig;
  onSave: (c: SiteConfig) => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [form, setForm] = useState<SiteConfig>(config);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    setForm(config);
  }, [config]);

  useBeforeUnload(isDirtyRef);

  const markDirty = () => {
    if (!isDirtyRef.current) {
      isDirtyRef.current = true;
      onDirtyChange?.(true);
    }
  };

  const updateCategory = (index: number, field: keyof CategoryData, value: string) => {
    markDirty();
    setForm(prev => {
      const newCats = prev.categories.map((cat, i) => i === index ? { ...cat, [field]: value } : cat);
      return { ...prev, categories: newCats };
    });
  };

  const removeCategory = (index: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      markDirty();
      setForm(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
    }
  };

  const addCategory = () => {
    markDirty();
    setForm(prev => ({ ...prev, categories: [...prev.categories, { name: 'Nouvelle catégorie', image: '' }] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    isDirtyRef.current = false;
    onDirtyChange?.(false);
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>Gestion des Catégories</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-lg)' }}>
        Modifiez les noms ou importez une image pour illustrer vos catégories sur la page d'accueil.
      </p>
      <div className="config-categories">
        {form.categories.map((cat, index) => (
          <div key={index} className="category-edit-row">
            {/* Aperçu image à gauche */}
            <div className="category-thumb">
              {cat.image
                ? <img src={cat.image} alt={cat.name} />
                : <span className="category-thumb__placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </span>
              }
            </div>

            <input
              id={`category-name-${index}`}
              name={`category-name-${index}`}
              type="text"
              value={cat.name}
              onChange={e => updateCategory(index, 'name', e.target.value)}
              placeholder="Nom de la catégorie"
              autoComplete="off"
              style={{ flex: '1 1 150px', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid rgba(201,169,110,0.25)', fontFamily: 'inherit', fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.8)' }}
              required
            />

            <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {cat.image ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg> Modifier l'image</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Ajouter une image</>
              )}
              <input id={`category-image-${index}`} name={`category-image-${index}`} type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    // Compression agressive pour catégories (400px, qualité 0.7)
                    const b64 = await compressCategoryImage(file);
                    updateCategory(index, 'image', b64);
                  } catch { /* ignore */ }
                }
              }} />
            </label>

            <button type="button" className="btn btn--sm" style={{ flexShrink: 0, background: 'transparent', borderRadius: '10px', border: '1.5px solid rgba(192,57,43,0.4)', color: 'var(--color-danger)', padding: '8px 12px' }} title="Supprimer cette catégorie" onClick={() => removeCategory(index)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        ))}
        <button type="button" className="btn btn--outline btn--sm" onClick={addCategory} style={{ marginTop: 'var(--space-sm)' }}>+ Ajouter une catégorie</button>
      </div>
      <div className="admin-form__actions" style={{ marginTop: '2rem' }}>
        <button type="submit" className="btn btn--primary">Enregistrer les catégories</button>
      </div>
    </form>
  );
}

// ──────────────────────────────────────────────
// Page Admin principale
// ──────────────────────────────────────────────
type SortOrder = 'date-desc' | 'date-asc' | 'maj-desc' | 'prix-asc' | 'prix-desc';

export default function AdminPage() {
  const { isAuthenticated, authLoading, login, logout } = useAuth();
  const { articles, articlesLoading, addArticle, updateArticle, deleteArticle, replaceAll, forceInjectSamples } = useArticles();
  const { config, configLoading, setConfig } = useConfig();
  const { logs, logsLoading, addLog } = useLogs();
  const toast = useToast();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vendu' | 'enVedette'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  const [adminTab, setAdminTab] = useState<'articles' | 'categories' | 'config' | 'logs'>('articles');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Dirty state pour warning de navigation
  const [isDirty, setIsDirty] = useState(false);
  useBeforeUnload(isDirty);

  // Sélection multiple
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Guard de navigation : vérifie isDirty avant de changer d'onglet
  const guardedTabChange = useCallback((tab: 'articles' | 'categories' | 'config' | 'logs') => {
    if (isDirty) {
      const ok = window.confirm('⚠️ Vous avez des modifications non sauvegardées.\n\nVoulez-vous quitter sans enregistrer ?');
      if (!ok) return;
      setIsDirty(false);
    }
    setAdminTab(tab);
  }, [isDirty]);

  // Guard pour quitter le formulaire article (retour vers liste)
  const guardedReturn = useCallback(() => {
    if (isDirty) {
      const ok = window.confirm('⚠️ Vous avez des modifications non sauvegardées.\n\nVoulez-vous quitter sans enregistrer ?');
      if (!ok) return;
      setIsDirty(false);
    }
    setView('list');
    setEditingArticle(undefined);
  }, [isDirty]);

  // ── Hooks ──────────────────────────────────
  const handleSave = useCallback(async (data: ArticleFormData) => {
    try {
      if (view === 'edit' && editingArticle) {
        await updateArticle(editingArticle.id, data);
        addLog('ARTICLE_UPDATED', `"${data.titre}" modifié`);
      } else {
        await addArticle(data);
        addLog('ARTICLE_CREATED', `"${data.titre}" créé`);
      }
      toast.success('Enregistré !', view === 'edit' ? 'L\'article a été mis à jour.' : 'Le nouvel article a été créé.');
    } catch {
      toast.error('Erreur', 'Une erreur est survenue lors de la sauvegarde.');
    }
    setIsDirty(false);
    setView('list');
    setEditingArticle(undefined);
  }, [view, editingArticle, updateArticle, addArticle, addLog, toast]);

  const handleEdit = useCallback((article: Article) => {
    setEditingArticle(article);
    setView('edit');
    setIsDirty(false);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const article = articles.find(a => a.id === id);
    try {
      await deleteArticle(id);
      addLog('ARTICLE_DELETED', `"${article?.titre ?? id}" supprimé`);
      toast.success('Supprimé', 'L\'article a été supprimé avec succès.');
    } catch {
      toast.error('Erreur', 'Impossible de supprimer cet article.');
    }
    setDeleteConfirm(null);
  }, [deleteArticle, addLog, articles, toast]);

  const handleBulkDelete = useCallback(async () => {
    const count = selectedIds.size;
    try {
      for (const id of selectedIds) {
        await deleteArticle(id);
      }
      addLog('BULK_DELETE', `${count} article(s) supprimé(s) en masse`);
      toast.success(`${count} article(s) supprimé(s)`, 'La sélection a été supprimée.');
      setSelectedIds(new Set());
    } catch {
      toast.error('Erreur', 'Une erreur est survenue lors de la suppression groupée.');
    }
    setBulkDeleteConfirm(false);
  }, [selectedIds, deleteArticle, addLog, toast]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((filteredArticles: Article[]) => {
    if (selectedIds.size === filteredArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredArticles.map(a => a.id)));
    }
  }, [selectedIds]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ articles, config }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perlipimpon-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.info('Backup téléchargé', 'Votre sauvegarde JSON a été générée.');
  }, [articles, config, toast]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed.articles) await replaceAll(parsed.articles);
        if (parsed.config) await setConfig(parsed.config);
        toast.success('Import réussi !', 'Vos données ont été restaurées avec succès.');
      } catch {
        toast.error('Erreur d\'import', 'Vérifiez le fichier JSON et réessayez.');
      }
    };
    input.click();
  }, [replaceAll, setConfig, toast]);

  const handleInjectSamples = useCallback(async () => {
    try {
      await forceInjectSamples();
      addLog('DEMO_INJECTED', '12 articles de démonstration injectés');
      toast.success('Démos injectées', 'Les modèles de créations ont fait leur apparition !');
    } catch {
      toast.error('Erreur', 'Impossible d\'injecter les démos.');
    }
  }, [forceInjectSamples, addLog, toast]);

  const onSaveConfig = useCallback(async (newConfig: SiteConfig) => {
    try {
      await setConfig(newConfig);
      addLog('CONFIG_SAVED', 'Paramètres du site enregistrés');
      toast.success('Paramètres sauvegardés !', 'Les modifications sont en ligne.');
      setIsDirty(false);
    } catch {
      toast.error('Erreur', 'Impossible d\'enregistrer les paramètres.');
    }
  }, [setConfig, addLog, toast]);

  const onSaveCategories = useCallback(async (newConfig: SiteConfig) => {
    try {
      await setConfig(newConfig);
      addLog('CATEGORIES_SAVED', `${newConfig.categories.length} catégorie(s) sauvegardées`);
      toast.success('Catégories sauvegardées !', 'Les modifications sont en ligne.');
      setIsDirty(false);
    } catch {
      toast.error('Erreur', 'Impossible d\'enregistrer les catégories.');
    }
  }, [setConfig, addLog, toast]);

  // Articles filtrés & triés
  const filteredArticles = articles
    .filter(a => filterCategory === 'all' || a.categorie === filterCategory)
    .filter(a => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'vendu') return a.vendu;
      if (filterStatus === 'enVedette') return a.enVedette;
      return true;
    })
    .filter(a => !searchQuery || a.titre.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortOrder) {
        case 'date-asc':
          return new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
        case 'date-desc':
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
        case 'maj-desc':
          return new Date(b.dateMaj).getTime() - new Date(a.dateMaj).getTime();
        case 'prix-asc':
          return a.prix - b.prix;
        case 'prix-desc':
          return b.prix - a.prix;
        default:
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      }
    });

  const soldCount = articles.filter(a => a.vendu).length;
  const featuredCount = articles.filter(a => a.enVedette).length;

  // ──────────────────────────────────────────────
  // Rendu
  // ──────────────────────────────────────────────
  return (
    <>
      {authLoading || configLoading || articlesLoading ? (
        <div className="admin-page">
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite', opacity: 0.7 }}><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 1-10-10"/></svg>
            <p style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Chargement de l'atelier...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <AdminLogin onLogin={login} />
      ) : (view === 'create' || view === 'edit') ? (
        <div className="admin-page">
          <div className="container" style={{ maxWidth: '1400px' }}>
            <ArticleForm
              article={editingArticle}
              categories={config.categories.map(c => c.name)}
              onSave={handleSave}
              onCancel={guardedReturn}
              onDirtyChange={setIsDirty}
            />
          </div>
        </div>
      ) : (
        <div className="admin-layout">
          {/* Top Banner */}
          <header className="admin-top-banner">
            <div className="admin-top-banner__inner">
              <div className="admin-top-banner__brand">
                <div className="admin-header__avatar" style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <div>
                  <h1 style={{ fontSize: 'var(--text-lg)', margin: 0, color: 'var(--color-charcoal)', fontFamily: 'var(--font-display)' }}>Perlimpimpon</h1>
                  <p style={{ fontSize: 'var(--text-xs)', margin: 0, color: 'var(--color-gray-500)' }}>Espace Créatrice</p>
                </div>
              </div>
              
              <nav className="admin-top-banner__nav">
                <button className={`admin-nav__btn ${adminTab === 'articles' ? 'active' : ''}`} onClick={() => guardedTabChange('articles')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <span>Créations</span>
                </button>
                <button className={`admin-nav__btn ${adminTab === 'categories' ? 'active' : ''}`} onClick={() => guardedTabChange('categories')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Catégories</span>
                </button>
                <button className={`admin-nav__btn ${adminTab === 'config' ? 'active' : ''}`} onClick={() => guardedTabChange('config')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
                  <span>Design</span>
                </button>
                <button className={`admin-nav__btn ${adminTab === 'logs' ? 'active' : ''}`} onClick={() => guardedTabChange('logs')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span>Activité</span>
                </button>
              </nav>

              <div className="admin-top-banner__actions">
                <a href="/" target="_blank" rel="noopener noreferrer" className="btn--admin-ghost" style={{ color: 'var(--color-gold-deep)', borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.05)' }} title="Voir le site">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span className="hide-mobile">Voir le site</span>
                </a>
                <button className="btn--admin-ghost btn--admin-ghost--danger" onClick={() => { logout(); window.location.href = '/'; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </div>
          </header>

          <main className="admin-main">
            {/* Header Admin Premium (Dashboard Header) */}
            <div className="admin-header-card">
              <div className="admin-header__brand">
                <div className="admin-header__text">
                  <h2 style={{ color: 'var(--color-cream)', fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-display)' }}>Bonjour, Créatrice.</h2>
                  <p style={{ color: 'rgba(250, 246, 240, 0.7)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Voici un résumé de votre activité aujourd'hui.</p>
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="admin-stats">
              <button className="stat-card stat-card--clickable stat-card--gold" onClick={() => { guardedTabChange('articles'); setFilterStatus('all'); setFilterCategory('all'); }}>
                <div className="stat-card__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{articles.length}</div>
                  <div className="stat-card__label">Créations</div>
                </div>
              </button>
              <button className="stat-card stat-card--clickable stat-card--rose" onClick={() => { guardedTabChange('articles'); setFilterStatus('enVedette'); setFilterCategory('all'); }}>
                <div className="stat-card__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{featuredCount}</div>
                  <div className="stat-card__label">Coups de Cœur</div>
                </div>
              </button>
              <button className="stat-card stat-card--clickable stat-card--teal" onClick={() => { guardedTabChange('articles'); setFilterStatus('vendu'); setFilterCategory('all'); }}>
                <div className="stat-card__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{soldCount}</div>
                  <div className="stat-card__label">Vendus</div>
                </div>
              </button>
              <button className="stat-card stat-card--clickable stat-card--purple" onClick={() => guardedTabChange('categories')}>
                <div className="stat-card__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{config.categories?.length || 0}</div>
                  <div className="stat-card__label">Catégories</div>
                </div>
              </button>
            </div>

          {/* Onglets */}
          {adminTab === 'config' && (
            <SiteConfigForm
              config={config}
              onSave={onSaveConfig}
              onInjectSamples={handleInjectSamples}
              onDirtyChange={setIsDirty}
            />
          )}
          {adminTab === 'categories' && (
            <CategoriesForm
              config={config}
              onSave={onSaveCategories}
              onDirtyChange={setIsDirty}
            />
          )}

          {adminTab === 'articles' && (
            <div className="admin-list">
              {/* En-tête de la liste */}
              <div className="admin-list__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
                  <h2>Vos Créations ({filteredArticles.length}{searchQuery || filterCategory !== 'all' || filterStatus !== 'all' ? ` / ${articles.length}` : ''})</h2>

                  {/* Recherche */}
                  <div className="admin-search">
                    <svg className="admin-search__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                      className="admin-search__input"
                      type="text"
                      placeholder="Rechercher un bijou..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filtres */}
                  <div className="admin-filters">
                    <select
                      id="admin-cat-filter"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="admin-filter-select"
                    >
                      <option value="all">Toutes catégories</option>
                      {config.categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>

                    <select
                      id="admin-status-filter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'vendu' | 'enVedette')}
                      className="admin-filter-select"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="vendu">Vendus</option>
                      <option value="enVedette">Coups de Cœur</option>
                    </select>

                    <select
                      id="admin-sort-filter"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                      className="admin-filter-select"
                    >
                      <option value="date-desc">Date d'ajout ↓ (récent)</option>
                      <option value="date-asc">Date d'ajout ↑ (ancien)</option>
                      <option value="maj-desc">Modifié ↓ (récent)</option>
                      <option value="prix-asc">Prix ↑ (croissant)</option>
                      <option value="prix-desc">Prix ↓ (décroissant)</option>
                    </select>
                  </div>
                </div>

                <button className="btn btn--primary btn--sm" onClick={() => { setIsDirty(false); setView('create'); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nouvel article
                </button>
              </div>

              {/* Barre de sélection groupée */}
              {selectedIds.size > 0 && (
                <div className="admin-bulk-bar">
                  <span className="admin-bulk-bar__count">{selectedIds.size} article(s) sélectionné(s)</span>
                  {bulkDeleteConfirm ? (
                    <>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>Confirmer la suppression ?</span>
                      <button className="btn btn--danger btn--sm" onClick={handleBulkDelete}>Confirmer</button>
                      <button className="btn btn--outline btn--sm" onClick={() => setBulkDeleteConfirm(false)}>Annuler</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn--danger btn--sm" onClick={() => setBulkDeleteConfirm(true)}>
                        🗑️ Supprimer la sélection
                      </button>
                      <button className="btn btn--outline btn--sm" onClick={() => setSelectedIds(new Set())}>
                        Désélectionner tout
                      </button>
                    </>
                  )}
                </div>
              )}

              {articles.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty__icon">🌸</div>
                  <p>Aucune création pour le moment. Commencez à remplir votre atelier !</p>
                  <button className="btn btn--primary" style={{ marginTop: '1rem' }} onClick={() => setView('create')}>Créer votre première pièce</button>
                </div>
              ) : (
                <>
                  <div className="admin-table">
                    {/* En-tête colonne */}
                    {filteredArticles.length > 0 && (
                      <div className="admin-table__header">
                        <input
                          id="select-all-checkbox"
                          name="select-all"
                          type="checkbox"
                          className="article-row__checkbox"
                          checked={selectedIds.size === filteredArticles.length && filteredArticles.length > 0}
                          onChange={() => toggleSelectAll(filteredArticles)}
                          title="Tout sélectionner"
                        />
                        <span>Photo</span>
                        <span>Titre</span>
                        <span>Statut</span>
                        <span>Prix</span>
                        <span>Aperçu</span>
                        <span>Actions</span>
                      </div>
                    )}

                    {filteredArticles.map((article) => (
                      <div key={article.id} className={`article-row ${selectedIds.has(article.id) ? 'selected' : ''}`}>

                        <div className="article-row__check">
                          <input
                            id={`select-article-${article.id}`}
                            name={`select-article-${article.id}`}
                            type="checkbox"
                            className="article-row__checkbox"
                            checked={selectedIds.has(article.id)}
                            onChange={() => toggleSelect(article.id)}
                          />
                        </div>

                        <div className="article-row__thumb">
                          {Array.isArray(article.photos) && article.photos.length > 0
                            ? <img src={article.photos[0]} alt={article.titre} />
                            : '💎'
                          }
                        </div>

                        <div className="article-row__info">
                          <div className="article-row__title">{article.titre}</div>
                          <div className="article-row__meta">{formatDate(article.dateCreation)}</div>
                        </div>

                        <div className="article-row__category">
                          {article.vendu && <span className="badge badge--danger">Vendu</span>}
                          {article.enVedette && <span className="badge" style={{ background: 'rgba(201,169,110,0.12)', color: 'var(--color-gold-deep)', border: '1px solid rgba(201,169,110,0.3)' }}>Coup de Cœur</span>}
                          <span className="badge badge--dark">{article.categorie}</span>
                        </div>

                        <div className="article-row__price">{formatPrice(article.prix)}</div>

                        <div className="article-row__preview">
                          <a href={`/creations/${article.id}`} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm" title="Voir sur le site" style={{ padding: '6px 10px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        </div>

                        <div className="article-row__actions">
                          <button className="btn btn--outline btn--sm" onClick={() => handleEdit(article)}>Modifier</button>
                          {deleteConfirm === article.id ? (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button className="btn btn--danger btn--sm" onClick={() => handleDelete(article.id)}>Confirmer</button>
                              <button className="btn btn--outline btn--sm" onClick={() => setDeleteConfirm(null)}>✕</button>
                            </div>
                          ) : (
                            <button className="btn btn--danger btn--sm" onClick={() => setDeleteConfirm(article.id)}>Supprimer</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredArticles.length === 0 && (
                    <div className="admin-empty">
                      <div className="admin-empty__icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      </div>
                      <p>Aucun article ne correspond à votre recherche.</p>
                    </div>
                  )}

                  {/* Gestion des données */}
                  <div className="admin-data-footer">
                    <button className="btn btn--outline btn--sm" onClick={handleExport}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Sauvegarder (Backup JSON)
                    </button>
                    <button className="btn btn--outline btn--sm" onClick={handleImport}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Importer une sauvegarde JSON
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Onglet Activité / Logs */}
          {adminTab === 'logs' && (
            <div className="admin-form">
              <h2>Historique des Activités</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Les 50 dernières actions effectuées sur votre site, en temps réel.
              </p>
              {logsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gold-deep)', fontStyle: 'italic' }}>Chargement des logs...</div>
              ) : logs.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty__icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <p>Aucune activité enregistrée pour le moment.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginTop: '0.5rem' }}>Les actions (création, modification, suppression) s'afficheront ici automatiquement.</p>
                </div>
              ) : (
                <div className="admin-table">
                  {logs.map((log) => (
                    <div key={log.id} className="log-row">
                      <div className="log-row__icon">
                        {log.action === 'ARTICLE_CREATED' && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        )}
                        {(log.action === 'ARTICLE_UPDATED' || log.action === 'CONFIG_SAVED' || log.action === 'CATEGORIES_SAVED') && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        )}
                        {(log.action === 'ARTICLE_DELETED' || log.action === 'BULK_DELETE') && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        )}
                        {log.action === 'DEMO_INJECTED' && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        )}
                        {(log.action === 'LOGIN' || log.action === 'LOGOUT') && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-charcoal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        )}
                      </div>
                      <div className="log-row__content">
                        <span className="log-row__action">{log.detail}</span>
                        <span className="log-row__date">{new Date(log.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          </main>
        </div>
      )}
    </>
  );
}

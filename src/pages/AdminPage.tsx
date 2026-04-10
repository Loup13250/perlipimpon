/**
 * Page Admin — Dashboard complet avec gestion des articles.
 * Protégée par mot de passe.
 * Vue principale : liste + formulaire d'édition + gestion des données.
 */

import { useState, useCallback, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useArticles } from '../hooks/useArticles';
import { useConfig } from '../hooks/useConfig';
import { formatPrice, formatDate, fileToBase64 } from '../utils/helpers';
import type { Article, ArticleFormData, Category, SiteConfig, CategoryData } from '../types';

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
          <div className="admin-login__icon">🔐</div>
          <h2>Espace Admin</h2>
          <p>Connectez-vous pour gérer vos créations</p>

          {error && <p className="admin-login__error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-email">Adresse e-mail</label>
              <input
                id="admin-email"
                type="email"
                placeholder="Entrez votre e-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="admin-password">Mot de passe</label>
              <input
                id="admin-password"
                type="password"
                placeholder="Entrez le mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
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
}: {
  article?: Article;
  categories: string[];
  onSave: (data: ArticleFormData) => void;
  onCancel: () => void;
}) {
  const isEditing = !!article;

  const [form, setForm] = useState<ArticleFormData>({
    titre: article?.titre || '',
    description: article?.description || '',
    prix: article?.prix || 0,
    categorie: article?.categorie || 'Colliers',
    photos: article?.photos || [],
    enVedette: article?.enVedette || false,
    vendu: article?.vendu || false,
  });

  const updateField = <K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    const newPhotos = [...form.photos];

    for (const file of Array.from(files)) {
      if (newPhotos.length >= 4) break; // Max 4 photos
      try {
        const base64 = await fileToBase64(file);
        newPhotos.push(base64);
      } catch (err) {
        console.error('Erreur upload photo:', err);
      }
    }

    updateField('photos', newPhotos);
  };

  const removePhoto = (index: number) => {
    updateField('photos', form.photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.titre.trim() || form.prix <= 0) return;
    onSave(form);
  };

  return (
    <div className="admin-form">
      <div className="admin-form__header">
        <h2>{isEditing ? 'Modifier l\'article' : 'Nouvel article'}</h2>
        <button className="btn btn--outline btn--sm" onClick={onCancel}>
          ✕ Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form__grid">
          {/* Titre */}
          <div className="form-group">
            <label htmlFor="article-titre">Titre *</label>
            <input
              id="article-titre"
              type="text"
              placeholder="Ex : Collier Éclat de Lune"
              value={form.titre}
              onChange={(e) => updateField('titre', e.target.value)}
              required
            />
          </div>

          {/* Prix */}
          <div className="form-group">
            <label htmlFor="article-prix">Prix (€) *</label>
            <input
              id="article-prix"
              type="number"
              min="0"
              step="0.01"
              placeholder="45.00"
              value={form.prix || ''}
              onChange={(e) => updateField('prix', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {/* Catégorie */}
          <div className="form-group">
            <label htmlFor="article-categorie">Catégorie</label>
            <select
              id="article-categorie"
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
              placeholder="Décrivez ce bijou en détail : matériaux, dimensions, inspiration..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
            />
          </div>


          {/* Upload photos */}
          <div className="photo-upload">
            <label>Photos ({form.photos.length}/4)</label>
            <label className="photo-upload__area" htmlFor="photo-input">
              <div className="photo-upload__area-icon">📷</div>
              <p>
                <span>Cliquez pour ajouter</span> des photos (max 4)
              </p>
              <p>JPG, PNG — 5 Mo max par image</p>
            </label>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoUpload(e.target.files)}
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
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* En vedette & Vendu */}
          <div className="form-group" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <label className="beautiful-toggle">
              <input
                type="checkbox"
                checked={form.enVedette}
                onChange={(e) => updateField('enVedette', e.target.checked)}
              />
              <div className="beautiful-toggle__slider"></div>
              <span className="beautiful-toggle__label">
                Mettre en vedette (Accueil)
              </span>
            </label>

            <label className="beautiful-toggle">
              <input
                type="checkbox"
                checked={form.vendu}
                onChange={(e) => updateField('vendu', e.target.checked)}
              />
              <div className="beautiful-toggle__slider"></div>
              <span className="beautiful-toggle__label">
                Marquer comme "VENDU"
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn btn--primary">
              {isEditing ? 'Enregistrer les modifications' : 'Créer l\'article'}
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
function SiteConfigForm({ config, onSave }: { config: SiteConfig, onSave: (c: SiteConfig) => void }) {
  const [form, setForm] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'about' | 'testimonials'>('general');
  const handleChange = (field: keyof SiteConfig, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSave(form); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const b64 = await fileToBase64(file);
        handleChange(field, b64);
      } catch (err) {
        alert('Erreur de chargement d\'image');
      }
    }
  };

  return (
    <div className="admin-form">
      {/* Sous-Menu Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button type="button" style={{ flex: '1 1 auto', minWidth: '120px' }} className={`btn btn--sm ${activeTab === 'general' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('general')}>🌐 Général & SEO</button>
        <button type="button" style={{ flex: '1 1 auto', minWidth: '120px' }} className={`btn btn--sm ${activeTab === 'hero' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('hero')}>🏠 Accueil & CTA</button>
        <button type="button" style={{ flex: '1 1 auto', minWidth: '120px' }} className={`btn btn--sm ${activeTab === 'about' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('about')}>📖 À Propos & Process</button>
        <button type="button" style={{ flex: '1 1 auto', minWidth: '120px' }} className={`btn btn--sm ${activeTab === 'testimonials' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('testimonials')}>⭐ Avis Clients</button>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* TAB 1: GENERAL & SEO */}
        {activeTab === 'general' && (
          <>
            <h2>Contact & Réseaux Sociaux</h2>
            <div className="admin-form__grid" style={{ marginBottom: '2rem' }}>
              <div className="form-group">
                <label>Nom de la Marque</label>
                <input type="text" value={form.nomMarque} onChange={e => handleChange('nomMarque', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email de contact</label>
                <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="text" value={form.telephone} onChange={e => handleChange('telephone', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Lien Facebook</label>
                <input type="url" value={form.facebook} onChange={e => handleChange('facebook', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Lien Instagram</label>
                <input type="url" value={form.instagram} onChange={e => handleChange('instagram', e.target.value)} />
              </div>
            </div>

            <h2>Optimisation Moteur de Recherche (SEO)</h2>
            <div className="admin-form__grid">
              <div className="form-group form-group--full">
                <label>Titre de l'onglet (Meta Title)</label>
                <input type="text" value={form.metaTitle} onChange={e => handleChange('metaTitle', e.target.value)} required />
                <small style={{color:'var(--color-gray-500)'}}>C'est ce qui s'affiche dans l'onglet du navigateur et tout en haut des résultats Google.</small>
              </div>
              <div className="form-group form-group--full">
                <label>Description du site (Meta Description)</label>
                <textarea rows={3} value={form.metaDescription} onChange={e => handleChange('metaDescription', e.target.value)} required />
                <small style={{color:'var(--color-gray-500)'}}>Un court résumé incitatif (150 caractères idéalement) affiché dans les résultats Google.</small>
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
                <label>Image d'ambiance (Haut de page)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {form.heroImage && <img src={form.heroImage} alt="Hero" style={{ flexShrink: 0, height: '64px', width: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />}
                  <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0 }}>
                    Changer l'image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={e => handleImageUpload(e, 'heroImage')} />
                  </label>
                </div>
              </div>
              <div className="form-group form-group--full">
                <label>Surtitre (Au dessus du titre)</label>
                <input type="text" value={form.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Titre principal (Début en blanc)</label>
                <input type="text" value={form.heroTitle1 || ''} onChange={e => handleChange('heroTitle1', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mot accentué (Fin en italique doré)</label>
                <input type="text" value={form.heroTitle2 || ''} onChange={e => handleChange('heroTitle2', e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label>Texte descriptif principal</label>
                <textarea rows={3} value={form.heroDescription || ''} onChange={e => handleChange('heroDescription', e.target.value)} />
              </div>
            </div>

            <h2>Bandeau d'Appel à l'action (Bas de page)</h2>
            <div className="admin-form__grid">
              <div className="form-group form-group--full">
                <label>Titre d'accroche</label>
                <input type="text" value={form.ctaTitle || ''} onChange={e => handleChange('ctaTitle', e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label>Texte incitatif (Contactez-nous...)</label>
                <textarea rows={2} value={form.ctaDescription || ''} onChange={e => handleChange('ctaDescription', e.target.value)} />
              </div>
            </div>
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
                  {form.aboutImage && <img src={form.aboutImage} alt="A propos" style={{ flexShrink: 0, height: '64px', width: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />}
                  <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0 }}>
                    Changer l'image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={e => handleImageUpload(e, 'aboutImage')} />
                  </label>
                </div>
              </div>
              <div className="form-group form-group--full">
                <label>Titre principal ("À propos")</label>
                <input type="text" value={form.aboutTitle || ''} onChange={e => handleChange('aboutTitle', e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label>Texte descriptif (Paragraphe 1)</label>
                <textarea rows={3} value={form.aboutText1 || ''} onChange={e => handleChange('aboutText1', e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label>Texte descriptif (Paragraphe 2)</label>
                <textarea rows={3} value={form.aboutText2 || ''} onChange={e => handleChange('aboutText2', e.target.value)} />
              </div>
            </div>

            <h2>Processus de Création</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Les étapes de fabrication affichées sur la page À propos.</p>
            {(form.processSteps || []).map((step, index) => (
              <div key={index} style={{ border: '1px solid var(--color-gray-200)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                <button type="button" className="btn btn--danger btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 8px' }} onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) {
                    const arr = [...form.processSteps]; arr.splice(index, 1); handleChange('processSteps', arr);
                  }
                }}>✕</button>
                <div className="admin-form__grid">
                  <div className="form-group">
                    <label>Étape N° {index + 1} - Titre</label>
                    <input type="text" value={step.title} onChange={e => {
                      const arr = [...form.processSteps]; arr[index].title = e.target.value; handleChange('processSteps', arr);
                    }} required />
                  </div>
                  <div className="form-group form-group--full">
                    <label>Description courte</label>
                    <input type="text" value={step.description} onChange={e => {
                      const arr = [...form.processSteps]; arr[index].description = e.target.value; handleChange('processSteps', arr);
                    }} required />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleChange('processSteps', [...(form.processSteps || []), { number: (form.processSteps?.length || 0) + 1, title: 'Nouvelle Étape', description: '' }])}>+ Ajouter une étape</button>
          </>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <>
            <h2>Vos Mots Doux (Avis Clients)</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Saisissez ici les meilleurs retours de vos clients affichés en page Héraut.</p>
            {(form.testimonials || []).map((t, index) => (
              <div key={t.id} style={{ border: '1px solid var(--color-gray-200)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                <button type="button" className="btn btn--danger btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 8px' }} onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
                    const arr = [...form.testimonials]; arr.splice(index, 1); handleChange('testimonials', arr);
                  }
                }}>✕</button>
                <div className="admin-form__grid">
                  <div className="form-group">
                    <label>Auteur</label>
                    <input type="text" value={t.auteur} onChange={e => {
                      const arr = [...form.testimonials]; arr[index].auteur = e.target.value; handleChange('testimonials', arr);
                    }} required />
                  </div>
                  <div className="form-group">
                    <label>Note / 5</label>
                    <input type="number" min="1" max="5" value={t.note} onChange={e => {
                      const arr = [...form.testimonials]; arr[index].note = Number(e.target.value); handleChange('testimonials', arr);
                    }} required />
                  </div>
                  <div className="form-group form-group--full">
                    <label>Texte (L'avis)</label>
                    <textarea rows={2} value={t.texte} onChange={e => {
                      const arr = [...form.testimonials]; arr[index].texte = e.target.value; handleChange('testimonials', arr);
                    }} required />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleChange('testimonials', [...(form.testimonials || []), { id: `t-${Date.now()}`, auteur: 'Nom', note: 5, texte: '' }])}>+ Ajouter un témoignage</button>
          </>
        )}

        <div className="admin-form__actions" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-gray-200)', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn--primary btn--lg">💾 Enregistrer tout le site</button>
        </div>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────
// Formulaire Catégories
// ──────────────────────────────────────────────
function CategoriesForm({ config, onSave }: { config: SiteConfig, onSave: (c: SiteConfig) => void }) {
  const [form, setForm] = useState<SiteConfig>(config);
  const updateCategory = (index: number, field: keyof CategoryData, value: string) => {
    const newCats = [...form.categories];
    newCats[index] = { ...newCats[index], [field]: value };
    setForm(prev => ({ ...prev, categories: newCats }));
  };
  const removeCategory = (index: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      setForm(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
    }
  };
  const addCategory = () => {
    setForm(prev => ({ ...prev, categories: [...prev.categories, { name: 'Nouvelle', image: '', color: '#c8a07a' }] }));
  };
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>Gestion des Catégories</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-lg)' }}>
        Modifiez les noms ou importez une image pour illustrer vos catégories sur la page d'accueil.
      </p>
      <div className="config-categories">
        {form.categories.map((cat, index) => (
          <div key={`cat-${cat.name}-${index}`} className="category-edit-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', alignItems: 'center', background: 'var(--color-white)', padding: '1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              {cat.image ? <img src={cat.image} alt="cat" style={{width: '100%', height:'100%', objectFit:'cover'}} /> : '🌙'}
            </div>
            <input type="text" value={cat.name} onChange={e => updateCategory(index, 'name', e.target.value)} placeholder="Nom de la catégorie" style={{ flex: '1 1 150px', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)' }} required />
            
            {/* Color picker pour le bracelet */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flexShrink: 0 }}>
              <input
                type="color"
                value={cat.color || '#c8a07a'}
                onChange={e => updateCategory(index, 'color', e.target.value)}
                title="Couleur de la perle"
                style={{ width: '40px', height: '40px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '2px', backgroundColor: 'var(--color-white)' }}
              />
              <span style={{ fontSize: '.7rem', color: 'var(--color-gray-500)' }}>Perle</span>
            </div>

            <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0 }}>
              Modifier l'image
              <input type="file" accept="image/*" style={{ display: 'none' }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const b64 = await fileToBase64(file);
                    updateCategory(index, 'image', b64);
                  } catch (err) {}
                }
              }} />
            </label>
            <button type="button" className="btn btn--danger btn--sm" style={{ flexShrink: 0 }} onClick={() => removeCategory(index)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn--outline btn--sm" onClick={addCategory}>+ Ajouter une catégorie</button>
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
export default function AdminPage() {
  const { isAuthenticated, authLoading, login, logout } = useAuth();
  const {
    articles,
    articlesLoading,
    addArticle,
    updateArticle,
    deleteArticle,
    replaceAll,
  } = useArticles();
  const { config, configLoading, setConfig } = useConfig();
  
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [adminTab, setAdminTab] = useState<'articles' | 'categories' | 'config'>('articles');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Hooks Hooks Hooks ──────────────
  const handleSave = useCallback(async (data: ArticleFormData) => {
    if (view === 'edit' && editingArticle) await updateArticle(editingArticle.id, data);
    else await addArticle(data);
    setView('list');
    setEditingArticle(undefined);
  }, [view, editingArticle, updateArticle, addArticle]);

  const handleEdit = useCallback((article: Article) => {
    setEditingArticle(article);
    setView('edit');
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteArticle(id);
    setDeleteConfirm(null);
  }, [deleteArticle]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ articles, config }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perlipimpon-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [articles, config]);

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
        alert('Import réussi !');
      } catch {
        alert('Erreur lors de l\'import. Vérifiez le fichier JSON.');
      }
    };
    input.click();
  }, [replaceAll, setConfig]);

  const onSaveConfigAndAlert = useCallback(async (newConfig: SiteConfig) => {
    await setConfig(newConfig);
    alert('Modifications enregistrées avec succès !');
  }, [setConfig]);



  // ──────────────────────────────────────────────
  // Rendu Unique (No Early Return)
  // ──────────────────────────────────────────────
  return (
    <div className="admin-page">
      {authLoading || configLoading || articlesLoading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Chargement de l'atelier...</p>
        </div>
      ) : !isAuthenticated ? (
        <AdminLogin onLogin={login} />
      ) : (view === 'create' || view === 'edit') ? (
        <div className="container" style={{ maxWidth: '1400px' }}>
          <ArticleForm
            article={editingArticle}
            categories={config.categories.map(c => c.name)}
            onSave={handleSave}
            onCancel={() => { setView('list'); setEditingArticle(undefined); }}
          />
        </div>
      ) : (
        <div className="container" style={{ maxWidth: '1400px' }}>
          {/* Header admin global */}
          <div className="admin-header" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-black)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✨</div>
               <div>
                 <h1 style={{ fontSize: 'var(--text-xl)', margin: 0 }}>Espace Créatrice</h1>
                 <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>Bienvenue dans votre atelier digital</p>
               </div>
            </div>
            <div className="admin-header__actions" style={{ marginTop: '1rem' }}>
               <a href="/" className="btn btn--primary btn--sm">👁️ Voir le site</a>
               <button className="btn btn--outline btn--sm" onClick={() => { logout(); window.location.href = '/'; }}>Déconnexion</button>
            </div>
          </div>

          {/* Navigation Admin */}
          <div className="admin-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', background: 'var(--color-white)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <button style={{ flex: 1, minWidth: '150px' }} className={`btn ${adminTab === 'articles' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setAdminTab('articles')}>📦 Mes Créations</button>
            <button style={{ flex: 1, minWidth: '150px' }} className={`btn ${adminTab === 'categories' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setAdminTab('categories')}>📂 Catégories</button>
            <button style={{ flex: 1, minWidth: '150px' }} className={`btn ${adminTab === 'config' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setAdminTab('config')}>⚙️ Design & Textes</button>
          </div>

          {/* Onglets */}
          {adminTab === 'config' && <SiteConfigForm config={config} onSave={onSaveConfigAndAlert} />}
          {adminTab === 'categories' && <CategoriesForm config={config} onSave={onSaveConfigAndAlert} />}

          {adminTab === 'articles' && (
            <div className="admin-list">
              <div className="admin-list__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <h2 style={{ margin: 0 }}>Vos Créations ({articles.length})</h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="admin-cat-filter" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>Filtrer par :</label>
                    <select 
                      id="admin-cat-filter"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{ 
                        padding: '0.4rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-gray-200)',
                        fontSize: 'var(--text-sm)',
                        background: 'var(--color-white)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all">Toutes les catégories</option>
                      {config.categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn--primary" onClick={() => setView('create')}>+ Nouvel article</button>
                </div>
              </div>

              {articles.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty__icon">💎</div>
                  <p>Aucun article pour le moment.</p>
                  <button className="btn btn--primary" onClick={() => setView('create')}>Créer votre première pièce</button>
                </div>
              ) : (
                <>
                  <div className="admin-table">
                    {articles
                      .filter(a => filterCategory === 'all' || a.categorie === filterCategory)
                      .map((article) => (
                        <div key={article.id} className="article-row">
                      <div className="article-row__thumb">
                        {Array.isArray(article.photos) && article.photos.length > 0 ? (
                          <img src={article.photos[0]} alt={article.titre} />
                        ) : '💎'}
                      </div>
                      <div className="article-row__info">
                        <div className="article-row__title">{article.titre}</div>
                        <div className="article-row__meta">{formatDate(article.dateCreation)}</div>
                      </div>
                      <div className="article-row__category">
                        {article.vendu ? (
                          <span className="badge badge--danger" style={{ marginRight: '0.5rem' }}>Vendu</span>
                        ) : null}
                        <span className="badge badge--dark">{article.categorie}</span>
                      </div>
                      <div className="article-row__price">{formatPrice(article.prix)}</div>
                      <div className="article-row__actions">
                        <button className="btn btn--outline btn--sm" onClick={() => handleEdit(article)}>Modifier</button>
                        {deleteConfirm === article.id ? (
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn btn--danger btn--sm" onClick={() => handleDelete(article.id)}>Confirmer</button>
                            <button className="btn btn--outline btn--sm" onClick={() => setDeleteConfirm(null)}>Annuler</button>
                          </div>
                        ) : (
                          <button className="btn btn--danger btn--sm" onClick={() => setDeleteConfirm(article.id)}>Supprimer</button>
                        )}
                      </div>
                    </div>
                      ))}
                  </div>

                {/* Section Gestion des données en bas */}
                <div className="admin-data-footer" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-gray-100)', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn btn--outline btn--sm" onClick={handleExport}>📥 Sauvegarder (Backup JSON)</button>
                  <button className="btn btn--outline btn--sm" onClick={handleImport}>📤 Importer une sauvegarde JSON</button>
                </div>
                </>
              )}
            </div>
          )}

          {/* Statistiques rapides */}
          <div className="admin-stats" style={{ marginTop: '3rem', borderTop: '1px solid var(--color-gray-300)', paddingTop: '2rem' }}>
            <div className="stat-card">
              <div className="stat-card__icon">📦</div>
              <div className="stat-card__value">{articles.length}</div>
              <div className="stat-card__label">Créations</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">📂</div>
              <div className="stat-card__value">{config.categories?.length || 0}</div>
              <div className="stat-card__label">Catégories</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
import { useToast } from '../components/Toast';
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
          <span className="admin-login__icon">🌸</span>
          <h2>Espace Créatrice</h2>
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
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
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
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter ✦'}
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

  const updateField = <K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotosBase64: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const base64 = await fileToBase64(file);
        newPhotosBase64.push(base64);
      } catch (err) {
        console.error('Erreur upload photo:', err);
      }
    }
    setForm((prev) => {
      const updatedPhotos = [...prev.photos, ...newPhotosBase64].slice(0, 4);
      return { ...prev, photos: updatedPhotos };
    });
    e.target.value = '';
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
        <h2>{isEditing ? '✏️ Modifier l\'article' : '✨ Nouvel article'}</h2>
        <button className="btn btn--outline btn--sm" onClick={onCancel}>✕ Annuler</button>
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
              <p><span>Cliquez pour ajouter</span> des photos (max 4)</p>
              <p>JPG, PNG — 5 Mo max par image</p>
            </label>
            <input
              id="photo-input"
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
                type="checkbox"
                checked={form.enVedette}
                onChange={(e) => updateField('enVedette', e.target.checked)}
              />
              <div className="beautiful-toggle__slider"></div>
              <span className="beautiful-toggle__label">⭐ Coup de Cœur</span>
            </label>

            <label className="beautiful-toggle">
              <input
                type="checkbox"
                checked={form.vendu}
                onChange={(e) => updateField('vendu', e.target.checked)}
              />
              <div className="beautiful-toggle__slider"></div>
              <span className="beautiful-toggle__label">🔴 Marquer comme vendu</span>
            </label>
          </div>

          {/* Actions */}
          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline" onClick={onCancel}>Annuler</button>
            <button type="submit" className="btn btn--primary">
              {isEditing ? '💾 Enregistrer' : '✨ Créer l\'article'}
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

  const tabs = [
    { id: 'general', label: 'Général & SEO', icon: '🌐' },
    { id: 'hero', label: 'Accueil & CTA', icon: '🏠' },
    { id: 'about', label: 'À Propos', icon: '📖' },
    { id: 'testimonials', label: 'Avis Clients', icon: '⭐' },
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
                <small style={{color:'var(--color-gray-500)', marginTop:'4px', display:'block'}}>C'est ce qui s'affiche dans l'onglet du navigateur et tout en haut des résultats Google.</small>
              </div>
              <div className="form-group form-group--full">
                <label>Description du site (Meta Description)</label>
                <textarea rows={3} value={form.metaDescription} onChange={e => handleChange('metaDescription', e.target.value)} required />
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
                <label>Image d'ambiance (Haut de page)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {form.heroImage && <img src={form.heroImage} alt="Hero" style={{ flexShrink: 0, height: '64px', width: '100px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(201,169,110,0.2)' }} />}
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
                  {form.aboutImage && <img src={form.aboutImage} alt="A propos" style={{ flexShrink: 0, height: '64px', width: '64px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(201,169,110,0.2)' }} />}
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
              <div key={index} style={{ border: '1px solid rgba(201,169,110,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', position: 'relative', background: 'rgba(250,246,240,0.5)' }}>
                <button type="button" className="btn btn--outline btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'transparent' }} title="Supprimer cette étape" onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) {
                    const arr = [...form.processSteps]; arr.splice(index, 1); handleChange('processSteps', arr);
                  }
                }}>🗑️</button>
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
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginBottom: '1rem' }}>Saisissez ici les meilleurs retours de vos clients affichés sur la page d'accueil.</p>
            {(form.testimonials || []).map((t, index) => (
              <div key={t.id} style={{ border: '1px solid rgba(201,169,110,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', position: 'relative', background: 'rgba(250,246,240,0.5)' }}>
                <button type="button" className="btn btn--outline btn--sm" style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'transparent' }} title="Supprimer ce témoignage" onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
                    const arr = [...form.testimonials]; arr.splice(index, 1); handleChange('testimonials', arr);
                  }
                }}>🗑️</button>
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

        <div className="admin-form__actions" style={{ marginTop: '2rem', borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn--primary btn--lg">💾 Enregistrer</button>
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
    setForm(prev => ({ ...prev, categories: [...prev.categories, { name: 'Nouvelle', image: '' }] }));
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
          <div key={`cat-${cat.name}-${index}`} className="category-edit-row">
            {/* Aperçu image à gauche */}
            <div className="category-thumb">
              {cat.image
                ? <img src={cat.image} alt={cat.name} />
                : <span className="category-thumb__placeholder">🏷️</span>
              }
            </div>

            <input
              type="text"
              value={cat.name}
              onChange={e => updateCategory(index, 'name', e.target.value)}
              placeholder="Nom de la catégorie"
              style={{ flex: '1 1 150px', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid rgba(201,169,110,0.25)', fontFamily: 'inherit', fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.8)' }}
              required
            />

            <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer', margin: 0, flexShrink: 0 }}>
              {cat.image ? '🔄 Modifier l\'image' : '📷 Ajouter une image'}
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

            <button type="button" className="btn btn--sm" style={{ flexShrink: 0, background: 'transparent', borderRadius: '10px', border: '1.5px solid rgba(192,57,43,0.4)', color: 'var(--color-danger)', padding: '8px 12px' }} title="Supprimer cette catégorie" onClick={() => removeCategory(index)}>🗑️</button>
          </div>
        ))}
        <button type="button" className="btn btn--outline btn--sm" onClick={addCategory} style={{ marginTop: 'var(--space-sm)' }}>+ Ajouter une catégorie</button>
      </div>
      <div className="admin-form__actions" style={{ marginTop: '2rem' }}>
        <button type="submit" className="btn btn--primary">💾 Enregistrer les catégories</button>
      </div>
    </form>
  );
}


// ──────────────────────────────────────────────
// Page Admin principale
// ──────────────────────────────────────────────
export default function AdminPage() {
  const { isAuthenticated, authLoading, login, logout } = useAuth();
  const { articles, articlesLoading, addArticle, updateArticle, deleteArticle, replaceAll } = useArticles();
  const { config, configLoading, setConfig } = useConfig();
  const toast = useToast();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vendu' | 'enVedette'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [adminTab, setAdminTab] = useState<'articles' | 'categories' | 'config'>('articles');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Sélection multiple
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // ── Hooks ──────────────────────────────────
  const handleSave = useCallback(async (data: ArticleFormData) => {
    try {
      if (view === 'edit' && editingArticle) await updateArticle(editingArticle.id, data);
      else await addArticle(data);
      toast.success('Enregistré !', view === 'edit' ? 'L\'article a été mis à jour.' : 'Le nouvel article a été créé.');
    } catch {
      toast.error('Erreur', 'Une erreur est survenue lors de la sauvegarde.');
    }
    setView('list');
    setEditingArticle(undefined);
  }, [view, editingArticle, updateArticle, addArticle, toast]);

  const handleEdit = useCallback((article: Article) => {
    setEditingArticle(article);
    setView('edit');
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteArticle(id);
      toast.success('Supprimé', 'L\'article a été supprimé avec succès.');
    } catch {
      toast.error('Erreur', 'Impossible de supprimer cet article.');
    }
    setDeleteConfirm(null);
  }, [deleteArticle, toast]);

  const handleBulkDelete = useCallback(async () => {
    try {
      for (const id of selectedIds) {
        await deleteArticle(id);
      }
      toast.success(`${selectedIds.size} article(s) supprimé(s)`, 'La sélection a été supprimée.');
      setSelectedIds(new Set());
    } catch {
      toast.error('Erreur', 'Une erreur est survenue lors de la suppression groupée.');
    }
    setBulkDeleteConfirm(false);
  }, [selectedIds, deleteArticle, toast]);

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

  const onSaveConfig = useCallback(async (newConfig: SiteConfig) => {
    try {
      await setConfig(newConfig);
      toast.success('Paramètres sauvegardés !', 'Les modifications sont en ligne.');
    } catch {
      toast.error('Erreur', 'Impossible d\'enregistrer les paramètres.');
    }
  }, [setConfig, toast]);

  // Articles filtrés
  const filteredArticles = articles
    .filter(a => filterCategory === 'all' || a.categorie === filterCategory)
    .filter(a => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'vendu') return a.vendu;
      if (filterStatus === 'enVedette') return a.enVedette;
      return true;
    })
    .filter(a => !searchQuery || a.titre.toLowerCase().includes(searchQuery.toLowerCase()));

  const soldCount = articles.filter(a => a.vendu).length;
  const featuredCount = articles.filter(a => a.enVedette).length;

  // ──────────────────────────────────────────────
  // Rendu
  // ──────────────────────────────────────────────
  return (
    <div className="admin-page">
      {authLoading || configLoading || articlesLoading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>🌸</div>
          <p style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Chargement de l'atelier...</p>
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

          {/* Header Admin Premium */}
          <div className="admin-header-card">
            <div className="admin-header__brand">
              <div className="admin-header__avatar">🌸</div>
              <div className="admin-header__text">
                <h1>Espace Créatrice</h1>
                <p>Bienvenue dans votre atelier digital ✦</p>
              </div>
            </div>
            <div className="admin-header__actions">
              <a href="/" className="btn--admin-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Voir le site
              </a>
              <button className="btn--admin-ghost btn--admin-ghost--danger" onClick={() => { logout(); window.location.href = '/'; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Déconnexion
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-card__icon">💎</div>
              <div className="stat-card__value">{articles.length}</div>
              <div className="stat-card__label">Créations</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">⭐</div>
              <div className="stat-card__value">{featuredCount}</div>
              <div className="stat-card__label">Coups de Cœur</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">🛍️</div>
              <div className="stat-card__value">{soldCount}</div>
              <div className="stat-card__label">Vendus</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">📂</div>
              <div className="stat-card__value">{config.categories?.length || 0}</div>
              <div className="stat-card__label">Catégories</div>
            </div>
          </div>

          {/* Navigation Admin */}
          <div className="admin-nav">
            <button
              className={`admin-nav__btn ${adminTab === 'articles' ? 'active' : ''}`}
              onClick={() => setAdminTab('articles')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              Mes Créations
            </button>
            <button
              className={`admin-nav__btn ${adminTab === 'categories' ? 'active' : ''}`}
              onClick={() => setAdminTab('categories')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Catégories
            </button>
            <button
              className={`admin-nav__btn ${adminTab === 'config' ? 'active' : ''}`}
              onClick={() => setAdminTab('config')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
              Design & Textes
            </button>
          </div>

          {/* Onglets */}
          {adminTab === 'config' && <SiteConfigForm config={config} onSave={onSaveConfig} />}
          {adminTab === 'categories' && <CategoriesForm config={config} onSave={onSaveConfig} />}

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
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="admin-filter-select"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="vendu">Vendus</option>
                      <option value="enVedette">Coups de Cœur</option>
                    </select>
                  </div>
                </div>

                <button className="btn btn--primary btn--sm" onClick={() => setView('create')}>
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
                      <div style={{ display: 'grid', gridTemplateColumns: '32px 72px 3fr 1fr 1fr 1fr auto', alignItems: 'center', gap: 'var(--space-md)', padding: '8px var(--space-xl)', borderBottom: '2px solid rgba(201,169,110,0.15)', background: 'rgba(250,246,240,0.8)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        <input
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
                          {article.enVedette && <span className="badge" style={{ background: 'rgba(201,169,110,0.12)', color: 'var(--color-gold-deep)', border: '1px solid rgba(201,169,110,0.3)' }}>⭐ Coup de Cœur</span>}
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
                      <div className="admin-empty__icon">🔍</div>
                      <p>Aucun article ne correspond à votre recherche.</p>
                    </div>
                  )}

                  {/* Gestion des données */}
                  <div className="admin-data-footer">
                    <button className="btn btn--outline btn--sm" onClick={handleExport}>📥 Sauvegarder (Backup JSON)</button>
                    <button className="btn btn--outline btn--sm" onClick={handleImport}>📤 Importer une sauvegarde JSON</button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

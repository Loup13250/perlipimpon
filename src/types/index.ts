/**
 * Types principaux du site — Bijoux artisanaux
 * Contient les interfaces et types utilisés dans toute l'application.
 */

// Catégories (désormais dynamiques)
export type Category = string;

// Pierres et matériaux
export type Stone =
  | 'Pierre de lune'
  | 'Perle'
  | 'Améthyste'
  | 'Quartz rose'
  | 'Labradorite'
  | 'Aigue-marine'
  | 'Tourmaline'
  | 'Opale'
  | 'Nacre'
  | 'Cristal de roche'
  | string;


// Un article = un bijou dans la boutique
export interface Article {
  id: string;
  titre: string;
  description: string;
  prix: number;
  categorie: Category;
  pierres: Stone[];
  photos: string[];       // URLs en base64 ou chemins relatifs
  dateCreation: string;   // ISO string
  dateMaj: string;        // ISO string — dernière modification
  enVedette: boolean;     // Mis en avant sur la page d'accueil
  vendu?: boolean;        // Si le bijou est vendu
}

// Formulaire de création / édition d'article
export interface ArticleFormData {
  titre: string;
  description: string;
  prix: number;
  categorie: Category;
  pierres: Stone[];
  photos: string[];
  enVedette: boolean;
  vendu?: boolean;
}

export interface CategoryData {
  name: string;
  description?: string;
  image?: string;
  color?: string;  // Couleur hex pour le bracelet filter
}

// Pierre avec couleur personnalisable
export interface StoneData {
  name: string;
  color?: string;  // Couleur hex pour le bracelet filter
}

// Témoignage client
export interface Testimonial {
  id: string;
  auteur: string;
  texte: string;
  note: number; // 1 à 5
}

// Étape du processus de création
export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

// Configuration générale du site
export interface SiteConfig {
  nomMarque: string;
  tagline: string;
  email: string;
  telephone: string;
  instagram: string;
  facebook: string;
  adresse: string;
  metaTitle: string;
  metaDescription: string;
  categories: CategoryData[];
  stones: string[];           // Liste simple (rétro-compat)
  stonesData?: StoneData[];   // Liste enrichie avec couleur
  
  // ABOUT Preview
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutImage: string;

  // HERO (Accueil)
  heroSubtitle: string;
  heroTitle1: string;
  heroTitle2: string; // The italic part
  heroDescription: string;
  heroImage: string;

  // CTA (Bas de page)
  ctaTitle: string;
  ctaDescription: string;

  // Listes dynamiques
  testimonials: Testimonial[];
  processSteps: ProcessStep[];
}

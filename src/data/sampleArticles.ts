/**
 * Données de démonstration pour peupler le site au premier lancement.
 * Ces articles seront insérés dans le localStorage s'il est vide.
 */

import type { Article, Testimonial, SiteConfig } from '../types';

export const defaultSiteConfig: SiteConfig = {
  nomMarque: 'Perlipimpon',
  tagline: 'Créatrice de bijoux fantaisies & co — Pièces uniques faites main',
  email: 'contact@perlipimpon.fr',
  telephone: '06 65 74 90 80',
  instagram: 'https://instagram.com/perlipimpon',
  facebook: 'https://www.facebook.com/profile.php?id=61554767849530',
  adresse: '',
  metaTitle: 'Perlipimpon — Créatrice de bijoux fantaisies, énergies et pierres naturelles',
  metaDescription: 'Perlipimpon vous propose des bijoux artisanaux faits main, inspirés par la lune et les énergies. Créations uniques en pierres naturelles.',
  categories: [
    { name: 'Colliers', description: 'Colliers en pierres naturelles', image: '/images/moonstone_necklace.png' },
    { name: 'Bracelets', description: 'Bracelets énergétiques', image: '/images/pearl_bracelet.png' },
    { name: 'Bagues', description: 'Bagues serties et ajustables', image: '/images/rose_quartz_ring.png' },
    { name: 'Boucles d\'oreilles', description: 'Boucles et puces', image: '/images/moonstone_necklace.png' },
    { name: 'Pendentifs', description: 'Pendentifs en pierres brutes', image: '/images/moonstone_necklace.png' },
    { name: 'Ensembles', description: 'Parures complètes', image: '/images/pearl_bracelet.png' }
  ],
  stones: [
    'Pierre de lune', 'Perle', 'Améthyste', 'Quartz rose',
    'Labradorite', 'Aigue-marine', 'Tourmaline', 'Opale',
    'Nacre', 'Cristal de roche'
  ],
  stonesData: [],
  aboutTitle: 'Fait main, fait avec cœur',
  aboutText1: 'Bienvenue chez Perlipimpon ! Chaque bijou est une création unique, façonnée à la main avec patience et passion. Des pierres de lune aux perles d\'eau douce, chaque matériau est choisi pour sa beauté et son énergie.',
  aboutText2: 'Que ce soit pour vous faire plaisir ou pour offrir, nos bijoux fantaisies apportent une touche d\'élégance naturelle à chaque tenue.',
  aboutImage: '/images/moonstone_necklace.png',
  
  heroSubtitle: '✦ bijoux artisanaux ✦',
  heroTitle1: 'L\'art de la ',
  heroTitle2: 'création',
  heroDescription: 'Des bijoux fantaisies uniques, fabriqués à la main avec des pierres naturelles soigneusement sélectionnées. Chaque pièce raconte une histoire.',
  heroImage: '/images/hero_bg.png',

  ctaTitle: 'Une pièce vous fait envie ?',
  ctaDescription: 'Contactez-nous pour toute question ou commande personnalisée. Chaque bijou peut être adapté selon vos envies !',

  testimonials: [
    {
      id: 't-1',
      auteur: 'Sophie M.',
      texte: "Des bijoux magnifiques ! On sent vraiment l'amour et la passion mis dans chaque création. Mon pendentif en labradorite ne me quitte plus.",
      note: 5
    },
    {
      id: 't-2',
      auteur: 'Camille T.',
      texte: "J'ai commandé une bague sur mesure, le résultat a dépassé mes espérances. Finitions parfaites et pierre magnifique.",
      note: 5
    },
    {
      id: 't-3',
      auteur: 'Élodie L.',
      texte: "Une très belle découverte locale. Les boucles d'oreilles sont légères et élégantes. Envoi rapide et soigné",
      note: 4
    }
  ],

  processSteps: [
    { number: 1, title: 'Inspiration', description: 'Observer la nature, les pierres, imaginer la pièce finale.' },
    { number: 2, title: 'Sélection', description: 'Choisir les pierres et matériaux avec attention.' },
    { number: 3, title: 'Création', description: 'Assembler, tresser, sertir avec précision.' },
    { number: 4, title: 'Finitions', description: 'Polir, ajuster chaque détail pour la perfection.' }
  ]
};

export const sampleArticles: Article[] = [
  {
    id: 'demo-001',
    titre: 'Collier Éclat de Lune',
    description:
      'Un collier délicat en argent 925 serti d\'une pierre de lune aux reflets bleutés. ' +
      'La pierre, taillée en cabochon ovale, capte la lumière avec une douceur envoûtante. ' +
      'Chaîne fine réglable de 40 à 45 cm. Pièce unique fabriquée entièrement à la main.',
    prix: 89,
    categorie: 'Colliers',
    pierres: ['Pierre de lune'],
    photos: ['/images/moonstone_necklace.png'],
    dateCreation: '2026-01-15T10:00:00Z',
    dateMaj: '2026-01-15T10:00:00Z',
    enVedette: true,
  },
  {
    id: 'demo-002',
    titre: 'Bracelet Perles d\'Eau Douce',
    description:
      'Bracelet composé de perles d\'eau douce naturelles, montées sur un fil doré. ' +
      'Chaque perle est unique par sa forme et son orient nacré. Fermoir en plaqué or. ' +
      'Un bijou classique et intemporel, parfait pour toutes les occasions.',
    prix: 65,
    categorie: 'Bracelets',
    pierres: ['Perle'],
    photos: ['/images/pearl_bracelet.png'],
    dateCreation: '2026-02-03T14:30:00Z',
    dateMaj: '2026-02-03T14:30:00Z',
    enVedette: true,
    vendu: true,
  },
  {
    id: 'demo-003',
    titre: 'Boucles d\'oreilles Cascade Améthyste',
    description:
      'Boucles d\'oreilles pendantes ornées de petites améthystes taillées en gouttes. ' +
      'Le violet profond de la pierre contraste élégamment avec la monture en argent. ' +
      'Crochets hypoallergéniques. Longueur totale : 4 cm.',
    prix: 52,
    categorie: 'Boucles d\'oreilles',
    pierres: ['Améthyste'],
    photos: ['/images/moonstone_necklace.png'],
    dateCreation: '2026-02-20T09:15:00Z',
    dateMaj: '2026-02-20T09:15:00Z',
    enVedette: false,
  },
  {
    id: 'demo-004',
    titre: 'Bague Quartz Rose Solitaire',
    description:
      'Bague solitaire en argent massif, couronnée d\'un quartz rose poli en cabochon rond. ' +
      'La pierre de l\'amour par excellence, dans un écrin minimaliste et raffiné. ' +
      'Taille ajustable grâce à l\'anneau ouvert.',
    prix: 45,
    categorie: 'Bagues',
    pierres: ['Quartz rose'],
    photos: ['/images/rose_quartz_ring.png'],
    dateCreation: '2026-03-01T16:45:00Z',
    dateMaj: '2026-03-01T16:45:00Z',
    enVedette: true,
  },
  {
    id: 'demo-005',
    titre: 'Pendentif Labradorite Mystique',
    description:
      'Pendentif en forme de larme serti d\'une labradorite aux reflets irisés bleu-vert. ' +
      'Chaque pierre est sélectionnée pour l\'intensité de sa labradorescence. ' +
      'Monture enroulée en fil d\'argent. Livré avec une chaîne de 50 cm.',
    prix: 72,
    categorie: 'Pendentifs',
    pierres: ['Labradorite'],
    photos: ['/images/moonstone_necklace.png'],
    dateCreation: '2026-03-10T11:20:00Z',
    dateMaj: '2026-03-10T11:20:00Z',
    enVedette: false,
  },
  {
    id: 'demo-006',
    titre: 'Ensemble Lune & Perle',
    description:
      'Parure assortie composée d\'un collier et de boucles d\'oreilles, associant pierre de lune ' +
      'et perles d\'eau douce. Un duo harmonieux qui sublime chaque tenue. ' +
      'Présentée dans un écrin cadeau en velours.',
    prix: 135,
    categorie: 'Ensembles',
    pierres: ['Pierre de lune', 'Perle'],
    photos: ['/images/pearl_bracelet.png'],
    dateCreation: '2026-03-25T08:00:00Z',
    dateMaj: '2026-03-25T08:00:00Z',
    enVedette: true,
  },
  {
    id: 'demo-007',
    titre: 'Bague Lueur Stellaire',
    description: 'Une bague majestueuse ornée d\'une opale arc-en-ciel. Idéale pour capter la lumière des étoiles.',
    prix: 55,
    categorie: 'Bagues',
    pierres: ['Opale'],
    photos: ['/images/rose_quartz_ring.png'],
    dateCreation: '2026-03-26T08:00:00Z',
    dateMaj: '2026-03-26T08:00:00Z',
    enVedette: false,
  },
  {
    id: 'demo-008',
    titre: 'Collier Solstice',
    description: 'Collier ras du cou avec une belle améthyste brute. Un bijou protecteur et apaisant.',
    prix: 95,
    categorie: 'Colliers',
    pierres: ['Améthyste'],
    photos: ['/images/moonstone_necklace.png'],
    dateCreation: '2026-03-27T08:00:00Z',
    dateMaj: '2026-03-27T08:00:00Z',
    enVedette: false,
  },
  {
    id: 'demo-009',
    titre: 'Bracelet Énergie Douce',
    description: 'Mélange de quartz rose et de nacre. Apporte douceur et réconfort au quotidien.',
    prix: 60,
    categorie: 'Bracelets',
    pierres: ['Quartz rose', 'Nacre'],
    photos: ['/images/pearl_bracelet.png'],
    dateCreation: '2026-03-28T08:00:00Z',
    dateMaj: '2026-03-28T08:00:00Z',
    enVedette: false,
  },
  {
    id: 'demo-010',
    titre: 'Pendentif Cristal Protecteur',
    description: 'Pendentif facetté en cristal de roche monté sur fil d\'argent. Élégant et pur.',
    prix: 48,
    categorie: 'Pendentifs',
    pierres: ['Cristal de roche'],
    photos: ['/images/moonstone_necklace.png'],
    dateCreation: '2026-03-29T08:00:00Z',
    dateMaj: '2026-03-29T08:00:00Z',
    enVedette: false,
  },
];

export const sampleTestimonials: Testimonial[] = [];

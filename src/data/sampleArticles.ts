/**
 * Données de démonstration pour peupler le site au premier lancement.
 */

import type { Article, SiteConfig } from '../types';

export const defaultSiteConfig: SiteConfig = {
  nomMarque: 'Perlipimpon',
  tagline: 'Créatrice de bijoux fantaisie & co — Pièces uniques faites main',
  email: 'contact@perlipimpon.fr',
  telephone: '06 65 74 90 80',
  instagram: 'https://instagram.com/perlipimpon',
  facebook: 'https://www.facebook.com/profile.php?id=61554767849530',
  adresse: '',
  metaTitle: 'Perlipimpon — Créatrice de bijoux fantaisie, énergies et pierres naturelles',
  metaDescription: 'Perlipimpon vous propose des bijoux artisanaux faits main, inspirés par la lune et les énergies. Créations uniques en pierres naturelles.',
  categories: [
    { name: 'Colliers', description: 'Colliers en pierres naturelles' },
    { name: 'Bracelets', description: 'Bracelets énergétiques' },
    { name: 'Bagues', description: 'Bagues serties et ajustables' },
    { name: "Boucles d'oreilles", description: 'Boucles et puces' },
    { name: 'Pendentifs', description: 'Pendentifs en pierres brutes' },
    { name: 'Ensembles', description: 'Parures complètes' }
  ],
  aboutTitle: "L'Éclat des Pierres, l'Énergie du Corps",
  aboutText1: "Chaque gemme est sélectionnée pour sa vibration unique. Chez Perlipimpon, nous croyons que la beauté d'un bijou réside autant dans son éclat que dans les bienfaits qu'il procure à l'âme.",
  aboutText2: "De l'apaisement du Quartz Rose à la force protectrice de l'Améthyste, nous créons des talismans modernes pensés pour harmoniser vos énergies et vos humeurs au quotidien.",
  aboutImage: '/images/about_workshop.png',
  heroSubtitle: '— bijoux artisanaux —',
  heroTitle1: "L'art de la ",
  heroTitle2: 'création',
  heroDescription: 'Des bijoux fantaisie uniques, fabriqués à la main avec des pierres naturelles soigneusement sélectionnées.',
  heroImage: '/images/hero_bg.png',
  heroImageMobile: '/images/hero_bg_mobile.jpg',
  ctaTitle: 'Une pièce vous fait envie ?',
  ctaDescription: 'Contactez-nous pour toute question ou commande personnalisée.',
  testimonials: [
    {
      id: 't-001',
      auteur: 'Sophie M.',
      note: 5,
      texte: "J'ai reçu mon bracelet et je suis sous le charme. Le travail est d'une finesse remarquable, chaque perle est soigneusement choisie. On sent vraiment le soin et la passion mis dans chaque création. Je reviendrai avec plaisir !"
    },
    {
      id: 't-002',
      auteur: 'Élise R.',
      note: 5,
      texte: "Un cadeau pour ma mère qui a fait fondre toute la famille. La bague est magnifique, la pierre de lune est envoûtante. Emballage soigné, livraison rapide. Une artisane talentueuse et à l'écoute, je recommande vivement !"
    },
    {
      id: 't-003',
      auteur: 'Marie-Claire B.',
      note: 5,
      texte: "Je cherchais quelque chose d'unique pour mes fiançailles — j'ai trouvé bien plus que ça. Ce collier en améthyste est une œuvre d'art. Chaque fois que je le porte, je reçois des compliments. Merci du fond du cœur !"
    },
    {
      id: 't-004',
      auteur: 'Thomas L.',
      note: 5,
      texte: "J'ai offert une parure pour l'anniversaire de ma compagne et elle n'en revenait pas. La qualité est exceptionnelle pour ce prix. On voit immédiatement que c'est fait main, avec amour. Une vraie découverte !"
    },
    {
      id: 't-005',
      auteur: 'Nathalie P.',
      note: 5,
      texte: "Ces boucles d'oreilles sont devenues mes préférées. Légères, élégantes, elles s'accordent à tout. J'ai aussi commandé un bracelet sur mesure et le résultat était parfait. Service client adorable et très réactif."
    },
    {
      id: 't-006',
      auteur: 'Camille D.',
      note: 5,
      texte: "Un vrai coup de cœur pour cette boutique ! Je suis fidèle depuis deux ans maintenant. Chaque nouvelle création est une surprise magnifique. La créatrice est passionnée et ça se ressent dans chacune de ses pièces."
    },
    {
      id: 't-007',
      auteur: 'Isabelle F.',
      note: 5,
      texte: "La bague en labradorite que j'ai reçue est tout simplement éblouissante. Les reflets bleutés changent selon la lumière, c'est magique ! La finition est impeccable et le colis était emballé avec beaucoup d'attention. Une adresse à chérir."
    },
    {
      id: 't-008',
      auteur: 'Aurélie G.',
      note: 5,
      texte: "J'ai commandé un collier en malachite pour l'anniversaire de ma sœur et elle était aux larmes ! La pierre est d'une beauté rare et la chaîne est fine et solide. Vous avez une nouvelle cliente fidèle, merci infiniment !"
    },
    {
      id: 't-009',
      auteur: 'Lucie B.',
      note: 5,
      texte: "Mes nouvelles boucles d'oreilles en améthyste sont parfaites — légères, bien finies, exactement comme sur les photos. J'adore le fait que chaque pièce soit unique. On ressent vraiment le travail artisanal derrière chaque création."
    }
  ],
  processSteps: [
    { number: 1, title: "L'inspiration", description: "Chaque pièce naît d'une rencontre : une pierre, une couleur, une émotion. Je m'inspire de la nature, des saisons et de mes voyages." },
    { number: 2, title: 'La sélection des matières', description: 'Je choisis avec soin chaque perle, pierre naturelle et apprêt. Qualité et authenticité sont mes priorités absolues.' },
    { number: 3, title: 'La création à la main', description: "Fil par fil, perle par perle, chaque bijou prend vie entre mes mains. Pas de machine, pas de série — juste du savoir-faire artisanal." },
    { number: 4, title: 'Les finitions & contrôle', description: "Avant de vous parvenir, chaque pièce est soigneusement inspectée, nettoyée et emballée avec amour dans son écrin." }
  ]
};

export const sampleArticles: Article[] = [
  {
    "id": "auto-001",
    "titre": "Boucles d'oreilles Festives",
    "description": "Boucles d'oreilles élégantes avec motifs de cœurs et triangles texturés, parfaites pour vos soirées.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/472982678_122200623278158928_4769343512706442374_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-002",
    "titre": "Boucles d'oreilles Croisette",
    "description": "Modèle Croisette arborant un motif léopard chic sur une monture dorée arrondie.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473133716_122200623524158928_1134493933837433129_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-003",
    "titre": "Boucles d'oreilles Pépites Léopard",
    "description": "Design léopard moderne pour ces Boucles d'oreilles originales et tendance.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473235429_122200623032158928_7900813755815264754_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-004",
    "titre": "Boucles d'oreilles Papyrus",
    "description": "Boucles d'oreilles ornées d'une pierre fine verte facettée pour un look naturel.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473256849_122200623230158928_352825919811860710_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-005",
    "titre": "Boucles d'oreilles Ophélie",
    "description": "Alliance de la perle blanche à des anneaux dorés ciselés pour un raffinement extrême.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473340799_122201328548158928_2038345838962049893_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-006",
    "titre": "Bague Labradorite Royale",
    "description": "Bague majestueuse sertie d'une Labradorite aux reflets bleutés envoûtants.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473341420_122201328206158928_2828597019880718112_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-007",
    "titre": "Bague Malachite Profonde",
    "description": "Bague artisanale mettant en valeur une Malachite au vert profond et strié.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473354677_122201328566158928_8956090328562457149_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-008",
    "titre": "Bague Lapis-Lazuli Stellaire",
    "description": "Une bague d'exception ornée d'un Lapis-Lazuli bleu nuit tacheté de pyrite dorée.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473361588_122200622984158928_7222519572489594492_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-009",
    "titre": "Bague Améthyste Mystique",
    "description": "Bague mystique sertie d'une Améthyste violette, symbole de sérénité.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473372466_122201328656158928_2029604001262488220_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-010",
    "titre": "Bague Turquoise Bohème",
    "description": "Bague d'exception ornée d'une Turquoise naturelle au style bohème unique.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473416119_122200623500158928_2828826237480628351_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-011",
    "titre": "Boucles d'oreilles Izia Silver",
    "description": "Boucles d'oreilles en acier inoxydable avec cœurs martelés, un design chic et intemporel.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473446929_122201328674158928_9018583340865346271_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-012",
    "titre": "Boucles d'oreilles Cosmos Spring",
    "description": "Boucles d'oreilles fleuries d'inspiration cosmique, avec un petit détail vert émeraude.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473451986_122201328692158928_6029920932440069154_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": true
  },
  {
    "id": "auto-013",
    "titre": "Présentoir Boucles d'Éclat",
    "description": "Une collection variée de Boucles d'oreilles artisanales pour toutes les occasions.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473540051_122201328176158928_9044289977160164845_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-014",
    "titre": "Boucles Gouttes d'Or",
    "description": "Boucles d'oreilles pendantes dorées avec un design fin et élégant.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473548589_122201328956158928_8011913272615711629_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-015",
    "titre": "Boucles Disques Solaires",
    "description": "Boucles d'oreilles en forme de disques rayonnants, captant la lumière.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473553972_122201340260158928_8520475929549074176_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-016",
    "titre": "Créoles Perles de Nuit",
    "description": "Boucles d'oreilles créoles ornées de perles sombres et mystérieuses.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473578908_122201328644158928_1047448953646046309_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-017",
    "titre": "Boucles Cœurs d'Argent",
    "description": "Délicates Boucles d'oreilles en forme de cœur avec une finition argentée.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473588856_122201328188158928_3169717433946904198_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-018",
    "titre": "Boucles Fleurs de Cristal",
    "description": "Boucles d'oreilles florales ornées de cristaux étincelants.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473621819_122201340230158928_1983232468118663258_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-019",
    "titre": "Boucles Losanges Ethniques",
    "description": "Boucles d'oreilles au design géométrique et inspiration ethnique.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473622828_122201328194158928_5025500798329435390_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-020",
    "titre": "Boucles Spirales d'Orient",
    "description": "Boucles d'oreilles en spirale évoquant les motifs orientaux traditionnels.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473622997_122201328170158928_5248674625730901904_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-021",
    "titre": "Boucles Gouttes Perlées",
    "description": "Boucles d'oreilles en forme de gouttes délicatement perlées.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473628139_122201328620158928_8135132925769878247_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-022",
    "titre": "Bague Ambre & Or",
    "description": "Bague imposante avec une pierre d'ambre translucide montée sur or.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473807272_122202536282158928_6513503047436518843_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-023",
    "titre": "Boucles Pastilles Dorées",
    "description": "Petites Boucles d'oreilles discrètes en forme de pastilles martelées.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/473897990_122202536168158928_5467220022455649728_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-024",
    "titre": "Bague Œil de Tigre",
    "description": "Bague protectrice ornée d'un magnifique Œil de Tigre aux reflets chatoyants.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473992585_122202536324158928_1929385231506832589_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-025",
    "titre": "Bague Pierre de Soleil",
    "description": "Bague chaleureuse mettant en valeur l'éclat pailleté de la Pierre de Soleil.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/473999733_122202536810158928_6342491970675731491_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-026",
    "titre": "Bague Onyx Mystique",
    "description": "Bague élégante sertie d'un Onyx noir profond pour un look sophistiqué.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474018545_122202536234158928_7108235809866976410_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-027",
    "titre": "Bague Nacre Douce",
    "description": "Bague délicate ornée de nacre naturelle aux reflets irisés.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474025830_122202536408158928_2408782160577514405_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-028",
    "titre": "Bague Amazonite Givrée",
    "description": "Bague rafraîchissante avec une Amazonite aux nuances vert d'eau.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474030815_122202536192158928_2266108943471238193_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-029",
    "titre": "Boucles Gouttes Azur",
    "description": "Boucles d'oreilles pendantes avec des gouttes bleues translucides.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/474030830_122202536852158928_2889122137508406518_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-030",
    "titre": "Bague Quartz Fumé",
    "description": "Bague sobre et mystérieuse avec un Quartz fumé facetté.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474038531_122202536210158928_2393958096423151133_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-031",
    "titre": "Bague Cornaline Ardente",
    "description": "Bague pleine d'énergie ornée d'une Cornaline d'un orange vibrant.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474038531_122202536816158928_3565357174295410012_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-032",
    "titre": "Boucles Pampilles Argent",
    "description": "Boucles d'oreilles avec de multiples pampilles argentées mobiles.",
    "prix": 35,
    "categorie": "Boucles d'oreilles",
    "photos": ["/images/creations/474038694_122202536162158928_510954882395770702_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-033",
    "titre": "Bague Topaze Bleue",
    "description": "Bague lumineuse sertie d'une Topaze bleue claire et pure.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474050030_122202536414158928_7623025863111960861_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-034",
    "titre": "Bague Grenat Passion",
    "description": "Bague envoûtante ornée d'un Grenat rouge profond.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474067360_122202537008158928_7779281431957026996_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-035",
    "titre": "Bague Péridot Printemps",
    "description": "Bague fraîche avec un Péridot vert olive éclatant.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474068627_122202536648158928_6168960549888235370_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-036",
    "titre": "Bague Citrine Solaire",
    "description": "Bague rayonnante mettant en valeur une Citrine jaune dorée.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474073415_122202536762158928_5270765036021272470_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-037",
    "titre": "Bague Hématite Force",
    "description": "Bague au design moderne avec une Hématite aux reflets métalliques.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474085302_122202536186158928_8177287603919219394_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-038",
    "titre": "Bague Jaspe Rouge",
    "description": "Bague ancrée avec un Jaspe rouge aux tons terreux et naturels.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474105068_122202536888158928_260107995910757901_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-039",
    "titre": "Bague Sodalite Sagesse",
    "description": "Bague apaisante ornée d'une Sodalite bleue veinée de blanc.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474135951_122202536144158928_5117788262173145538_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-040",
    "titre": "Bague Unakite Nature",
    "description": "Bague originale combinant le vert et le rose de l'Unakite.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474137838_122202536594158928_3276680666977018168_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-041",
    "titre": "Bague Obsidienne Noire",
    "description": "Bague intense sertie d'une Obsidienne noire protectrice.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474139143_122202536378158928_7767449053865933548_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-042",
    "titre": "Bague Calcédoine Bleue",
    "description": "Bague douce avec une Calcédoine d'un bleu pastel délicat.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474143934_122202536744158928_223690050841474990_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-043",
    "titre": "Bague Rhodonite Tendresse",
    "description": "Bague rose tendre ornée d'une Rhodonite veinée de noir.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474146896_122202536882158928_8214072194493370941_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-044",
    "titre": "Bague Aventurine Prospère",
    "description": "Bague au vert tendre, symbole de chance et de prospérité.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474162800_122202536720158928_5764662690346226503_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-045",
    "titre": "Bague Jade Impérial",
    "description": "Bague précieuse sertie d'un Jade vert intense et symbolique.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474164566_122202536624158928_615655267435086183_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-046",
    "titre": "Bague Fluorite Arc-en-ciel",
    "description": "Bague colorée avec une Fluorite aux multiples nuances de violet et vert.",
    "prix": 35,
    "categorie": "Bagues",
    "photos": ["/images/creations/474177940_122202536708158928_3484378336419254563_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-047",
    "titre": "Bracelet Maillons Léopard",
    "description": "Bracelet tendance avec des maillons en acrylique au motif léopard.",
    "prix": 35,
    "categorie": "Bracelets",
    "photos": ["/images/creations/474188349_122202711638158928_307615407925336821_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-048",
    "titre": "Bracelet Maillons Ambre",
    "description": "Bracelet chaleureux avec des maillons ambrés et dorés.",
    "prix": 35,
    "categorie": "Bracelets",
    "photos": ["/images/creations/474189407_122202711626158928_2074019437738859462_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-049",
    "titre": "Bracelet Maillons Nacre",
    "description": "Bracelet raffiné avec des maillons nacrés et métallisés.",
    "prix": 35,
    "categorie": "Bracelets",
    "photos": ["/images/creations/474200707_122202711824158928_6827775833202492470_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  },
  {
    "id": "auto-050",
    "titre": "Bracelet Maillons Onyx",
    "description": "Bracelet chic combinant des maillons noirs et argentés.",
    "prix": 35,
    "categorie": "Bracelets",
    "photos": ["/images/creations/474209168_122202711770158928_1795518133227929054_n.jpg"],
    "dateCreation": "2026-04-10T02:18:36Z",
    "dateMaj": "2026-04-10T02:18:36Z",
    "enVedette": false
  }
];

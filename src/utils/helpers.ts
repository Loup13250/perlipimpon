/**
 * Utilitaires divers — fonctions pures réutilisables.
 */

/**
 * Génère un ID unique basé sur le timestamp + random.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/**
 * Formate un prix en euros.
 */
export function formatPrice(prix: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(prix);
}

/**
 * Formate une date ISO en format lisible français.
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Tronque un texte à la longueur donnée, ajoute "…" si nécessaire.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Convertit un fichier image en chaîne base64.
 * Utilisé dans l'admin pour l'upload de photos.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compresse et redimensionne une image via canvas avant stockage Firestore.
 * Réduit drastiquement la taille base64 (ex: 800 Ko → ~25 Ko).
 * @param file - Le fichier image d'origine
 * @param maxSizePx - Largeur/hauteur max en pixels (défaut 800)
 * @param quality - Qualité JPEG 0-1 (défaut 0.75)
 */
export function compressImageToBase64(
  file: File,
  maxSizePx = 800,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Redimensionner si nécessaire (garde les proportions)
        if (width > maxSizePx || height > maxSizePx) {
          if (width > height) {
            height = Math.round((height * maxSizePx) / width);
            width = maxSizePx;
          } else {
            width = Math.round((width * maxSizePx) / height);
            height = maxSizePx;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresse une image pour les catégories (700px max, qualité correcte pour affichage homepage).
 * Compromis : bonne qualité visuelle tout en restant dans la limite Firestore 1 Mo.
 */
export function compressCategoryImage(file: File): Promise<string> {
  return compressImageToBase64(file, 700, 0.82);
}

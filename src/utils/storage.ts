/**
 * Helpers pour la gestion du localStorage.
 * Toutes les opérations de lecture/écriture passent par ici
 * pour centraliser la logique et faciliter une future migration
 * vers un vrai backend.
 */

const STORAGE_PREFIX = 'bijoux_';

/**
 * Lit une valeur depuis le localStorage et la parse en JSON.
 * Renvoie `fallback` si la clé n'existe pas ou si le JSON est invalide.
 */
export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[storage] Erreur lecture clé "${key}", valeur par défaut utilisée.`);
    return fallback;
  }
}

/**
 * Écrit une valeur dans le localStorage après serialisation JSON.
 */
export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`[storage] Erreur écriture clé "${key}":`, err);
  }
}

/**
 * Supprime une clé du localStorage.
 */
export function storageRemove(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * Exporte toutes les données du site (clés avec le préfixe) en JSON.
 */
export function exportAllData(): string {
  const data: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i);
    if (fullKey && fullKey.startsWith(STORAGE_PREFIX)) {
      const shortKey = fullKey.slice(STORAGE_PREFIX.length);
      try {
        data[shortKey] = JSON.parse(localStorage.getItem(fullKey) || '');
      } catch {
        data[shortKey] = localStorage.getItem(fullKey);
      }
    }
  }

  return JSON.stringify(data, null, 2);
}

/**
 * Importe des données depuis un JSON exporté précédemment.
 * Écrase les données existantes pour les clés présentes dans le JSON.
 */
export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;

    Object.entries(data).forEach(([key, value]) => {
      storageSet(key, value);
    });

    return true;
  } catch (err) {
    console.error('[storage] Erreur import données:', err);
    return false;
  }
}

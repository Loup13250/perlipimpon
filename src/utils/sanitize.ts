/**
 * Supprime récursivement les propriétés 'undefined' d'un objet.
 * Utile pour Firebase qui lève une erreur si une valeur est undefined.
 */
export function removeUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as unknown as T;
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as any)[key];
      if (value !== undefined) {
        newObj[key] = removeUndefined(value);
      }
    }
  }

  return newObj as T;
}

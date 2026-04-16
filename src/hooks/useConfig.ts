import { useState, useCallback, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { removeUndefined } from '../utils/sanitize';
import { defaultSiteConfig } from '../data/sampleArticles';
import type { SiteConfig } from '../types';

const CONFIG_DOC = 'main';

/**
 * Hook useConfig — Gestion de la configuration du site.
 * Supprime les automatismes et migrations pour une synchro 100% cloud.
 */
export function useConfig() {
  const [config, setConfigState] = useState<SiteConfig>(defaultSiteConfig);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'config', CONFIG_DOC);
    
    // Écoute en temps réel de la configuration
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<SiteConfig>;
        
        // Merge avec les valeurs par défaut pour éviter les erreurs sur les nouveaux champs
        const merged: SiteConfig = {
          ...defaultSiteConfig,
          ...data,
          // Fallbacks pour les tableaux pour éviter les erreurs de mapping
          categories: data.categories?.length ? data.categories : defaultSiteConfig.categories,
          testimonials: data.testimonials || [],
          processSteps: data.processSteps || [],
        };
        
        setConfigState(merged);
      } else {
        // Le document n'existe pas encore (premier lancement après reset base)
        console.warn('[Firebase] Config "main" introuvable. Utilisation des valeurs par défaut.');
        setConfigState(defaultSiteConfig);
      }
      setConfigLoading(false);
    }, (error) => {
      console.error('[Firebase] Erreur Config Sync:', error);
      setConfigLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Enregistre la configuration dans Firestore
   */
  const setConfig = useCallback(async (newConfig: SiteConfig) => {
    try {
      const sanitized = removeUndefined(newConfig);
      const docRef = doc(db, 'config', CONFIG_DOC);
      await setDoc(docRef, sanitized);
    } catch (e) {
      console.error("[Firebase] Erreur sauvegarde config:", e);
    }
  }, []);

  return {
    config,
    configLoading,
    setConfig,
  };
}

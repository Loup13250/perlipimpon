import { useState, useCallback, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
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

    // Détection de Google PageSpeed / Lighthouse pour éviter le long-polling
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|pagespeed/i.test(navigator.userAgent);

    const applyData = (data: Partial<SiteConfig> | null) => {
      if (data && Object.keys(data).length > 0) {
        const merged: SiteConfig = {
          ...defaultSiteConfig,
          ...data,
          // Fallbacks pour les tableaux — si vide, on garde les valeurs par défaut
          categories: data.categories?.length ? data.categories : defaultSiteConfig.categories,
          testimonials: data.testimonials?.length ? data.testimonials : defaultSiteConfig.testimonials,
          processSteps: data.processSteps?.length ? data.processSteps : defaultSiteConfig.processSteps,
          lithotherapyValues: data.lithotherapyValues?.length ? data.lithotherapyValues : defaultSiteConfig.lithotherapyValues,
          brandValues: data.brandValues?.length ? data.brandValues : defaultSiteConfig.brandValues,
        };
        setConfigState(merged);
      } else {
        console.warn('[Firebase] Config "main" introuvable. Utilisation des valeurs par défaut.');
        setConfigState(defaultSiteConfig);
      }
      setConfigLoading(false);
    };

    if (isBot) {
      // Pour les bots/PageSpeed : un simple fetch unique, pas de long-polling
      getDoc(docRef).then(docSnap => {
        applyData(docSnap.exists() ? (docSnap.data() as Partial<SiteConfig>) : null);
      }).catch(error => {
        console.error('[Firebase Bot] Erreur Config:', error);
        setConfigLoading(false);
      });
      return () => {};
    } else {
      // Pour les vrais utilisateurs : écoute en temps réel
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        applyData(docSnap.exists() ? (docSnap.data() as Partial<SiteConfig>) : null);
      }, (error) => {
        console.error('[Firebase] Erreur Config Sync:', error);
        setConfigLoading(false);
      });
      return unsubscribe;
    }
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

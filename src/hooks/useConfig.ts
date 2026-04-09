import { useState, useCallback, useEffect } from 'react';
import type { SiteConfig } from '../types';
import { defaultSiteConfig } from '../data/sampleArticles';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const CONFIG_DOC = 'main';

export function useConfig() {
  const [config, setConfigState] = useState<SiteConfig>(defaultSiteConfig);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'config', CONFIG_DOC);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const existing = docSnap.data() as Partial<SiteConfig>;
        const merged = { ...defaultSiteConfig, ...existing };
        merged.categories = existing.categories || defaultSiteConfig.categories;
        merged.stones = existing.stones || defaultSiteConfig.stones;
        merged.stonesData = existing.stonesData || undefined;
        merged.testimonials = existing.testimonials || defaultSiteConfig.testimonials;
        merged.processSteps = existing.processSteps || defaultSiteConfig.processSteps;
        if (!existing.heroTitle2) merged.heroTitle2 = defaultSiteConfig.heroTitle2;
        if (!existing.heroImage) merged.heroImage = defaultSiteConfig.heroImage;
        if (!existing.ctaTitle) merged.ctaTitle = defaultSiteConfig.ctaTitle;
        setConfigState(merged as SiteConfig);
      } else {
        // Auto-migration: essayer de récupérer la config depuis localStorage
        const LOCAL_KEY = 'perlipimpon_config_v2';
        try {
          const localData = localStorage.getItem(LOCAL_KEY);
          if (localData) {
            const localConfig: Partial<SiteConfig> = JSON.parse(localData);
            const merged = { ...defaultSiteConfig, ...localConfig };
            console.info('[Migration] Config trouvée en localStorage. Migration vers Firestore...');
            await setDoc(docRef, merged);
            setConfigState(merged as SiteConfig);
          } else {
            await setDoc(docRef, defaultSiteConfig);
            setConfigState(defaultSiteConfig);
          }
        } catch (e) {
          console.warn('[Migration] Erreur config migration:', e);
          await setDoc(docRef, defaultSiteConfig);
          setConfigState(defaultSiteConfig);
        }
        // Sécurité : débloquer le loading après le déclenchement de la migration
        setTimeout(() => setConfigLoading(false), 2000);
      }
      setConfigLoading(false);
    }, (error) => {
      console.error('Firebase Config Error', error);
      setConfigLoading(false);
    });

    return unsubscribe;
  }, []);

  const setConfig = useCallback(async (newConfig: SiteConfig) => {
    try {
      const docRef = doc(db, 'config', CONFIG_DOC);
      await setDoc(docRef, newConfig);
    } catch (e) {
      console.error("Error saving config", e);
    }
  }, []);

  return {
    config,
    configLoading,
    setConfig,
  };
}

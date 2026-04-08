import { useState, useCallback, useEffect } from 'react';
import type { Article, ArticleFormData } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, query } from 'firebase/firestore';
import { generateId } from '../utils/helpers';
import { sampleArticles } from '../data/sampleArticles';

const ARTICLES_COLLECTION = 'articles';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, ARTICLES_COLLECTION));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      // Auto-migration: si Firestore est vide et qu'il y a des données en localStorage, on les migre
      if (snapshot.empty) {
        const LOCAL_KEY = 'perlipimpon_articles_v2';
        try {
          const localData = localStorage.getItem(LOCAL_KEY);
          if (localData) {
            const localArticles: Article[] = JSON.parse(localData);
            if (localArticles.length > 0) {
              console.info(`[Migration] ${localArticles.length} articles trouvés en localStorage. Migration vers Firestore...`);
              for (const article of localArticles) {
                if (!article.id) article.id = generateId();
                await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
              }
              console.info('[Migration] Articles migrés avec succès !');
              return; // onSnapshot se rechargera automatiquement
            }
          }
          // Si localStorage vide aussi → injecter données de démo
          for (const article of sampleArticles) {
            await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
          }
        } catch (e) {
          console.warn('[Migration] Erreur lors de la migration locale:', e);
          // Si erreur JSON, injecter les samples quand même
          for (const article of sampleArticles) {
            await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
          }
        }
        setTimeout(() => setArticlesLoading(false), 2000);
        return;
      }

      const updatedArticles = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          pierres: data.pierres || [], 
          photos: data.photos || []
        };
      }) as Article[];

      updatedArticles.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());

      setArticles(updatedArticles);
      setArticlesLoading(false);
    }, (error) => {
      console.error('Firebase Articles Error', error);
      setArticlesLoading(false);
    });

    return unsubscribe;
  }, []);

  const visibleArticles = useMemo(() => articles, [articles]);
  const featuredArticles = useMemo(() => articles.filter((a) => a.enVedette), [articles]);

  const getArticle = useCallback(
    (id: string): Article | undefined => {
      return articles.find((a) => a.id === id);
    },
    [articles]
  );

  const addArticle = useCallback(async (data: ArticleFormData): Promise<Article | null> => {
    const now = new Date().toISOString();
    const newId = generateId();
    const newArticle: Article = {
      ...data,
      id: newId,
      dateCreation: now,
      dateMaj: now,
    };

    try {
      await setDoc(doc(db, ARTICLES_COLLECTION, newId), newArticle);
      return newArticle;
    } catch (e) {
      console.error("Error adding article", e);
      return null;
    }
  }, []);

  const updateArticle = useCallback(
    async (id: string, data: Partial<ArticleFormData>): Promise<boolean> => {
      try {
        await updateDoc(doc(db, ARTICLES_COLLECTION, id), {
          ...data,
          dateMaj: new Date().toISOString(),
        });
        return true;
      } catch (e) {
         console.error("Error updating article", e);
         return false;
      }
    },
    []
  );

  const deleteArticle = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, ARTICLES_COLLECTION, id));
    } catch (e) {
      console.error("Error deleting article", e);
    }
  }, []);

  const resetToSample = useCallback(async (): Promise<void> => {
    try {
      // Supprimer tous les articles actuels d'abord (simplifié pour cet exemple : on ajoute juste par dessus)
      for (const article of sampleArticles) {
        await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
      }
    } catch (e) {
       console.error("Error resetting", e);
    }
  }, []);

  const replaceAll = useCallback(async (newArticles: Article[]): Promise<void> => {
     try {
       for (const article of newArticles) {
         if (!article.id) article.id = generateId();
         await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
       }
     } catch(e) {
       console.error("Error replacing items", e);
     }
  }, []);

  return {
    articles,
    articlesLoading,
    visibleArticles,
    featuredArticles,
    getArticle,
    addArticle,
    updateArticle,
    deleteArticle,
    resetToSample,
    replaceAll,
  };
}

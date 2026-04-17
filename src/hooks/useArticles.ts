import { useState, useCallback, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, query } from 'firebase/firestore';
import { generateId } from '../utils/helpers';
import { sampleArticles } from '../data/sampleArticles';
import type { Article, ArticleFormData } from '../types';

const ARTICLES_COLLECTION = 'articles';

/**
 * Hook useArticles — Gestion 100% cloud des créations.
 * La base de données Firestore est l'unique source de vérité.
 */
export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, ARTICLES_COLLECTION));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setArticles([]);
        setArticlesLoading(false);
        return;
      }

      const updatedArticles = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          photos: Array.isArray(data.photos) ? data.photos : []
        };
      }) as Article[];

      // Tri par date de création (plus récent en premier)
      const getTime = (iso: string) => iso ? new Date(iso).getTime() : 0;
      updatedArticles.sort((a, b) => getTime(b.dateCreation) - getTime(a.dateCreation));

      setArticles(updatedArticles);
      setArticlesLoading(false);
    }, (error) => {
      console.error('[Firebase] Erreur Articles Sync:', error);
      setArticlesLoading(false);
    });

    return unsubscribe;
  }, []);

  const featuredArticles = useMemo(() => articles.filter((a) => a.enVedette), [articles]);

  const getArticle = useCallback(
    (id: string): Article | undefined => articles.find((a) => a.id === id),
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
      console.error('[Firebase] Erreur ajout article:', e);
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
        console.error('[Firebase] Erreur modification article:', e);
        return false;
      }
    },
    []
  );

  const deleteArticle = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, ARTICLES_COLLECTION, id));
    } catch (e) {
      console.error('[Firebase] Erreur suppression article:', e);
    }
  }, []);

  /**
   * Injecte les données de démonstration dans Firestore
   */
  const forceInjectSamples = useCallback(async (): Promise<void> => {
    try {
      setArticlesLoading(true);
      for (const article of sampleArticles) {
        await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
      }
      setArticlesLoading(false);
    } catch (e) {
      console.error('[Firebase] Erreur injection démos:', e);
      setArticlesLoading(false);
    }
  }, []);

  /**
   * Remplace tous les articles par une nouvelle liste (upsert par ID)
   */
  const replaceAll = useCallback(async (newArticles: Article[]): Promise<void> => {
    try {
      for (const article of newArticles) {
        const id = article.id || generateId();
        await setDoc(doc(db, ARTICLES_COLLECTION, id), { ...article, id });
      }
    } catch (e) {
      console.error('[Firebase] Erreur remplacement global:', e);
    }
  }, []);

  return {
    articles,
    articlesLoading,
    featuredArticles,
    getArticle,
    addArticle,
    updateArticle,
    deleteArticle,
    forceInjectSamples,
    replaceAll,
  };
}

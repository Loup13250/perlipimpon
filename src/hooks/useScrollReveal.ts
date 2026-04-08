/**
 * Hook pour les animations d'apparition au scroll.
 * Utilise l'IntersectionObserver pour déclencher une classe CSS
 * quand un élément entre dans le viewport.
 */

import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;    // Pourcentage de visibilité avant déclenchement (0-1)
  rootMargin?: string;   // Marge autour du viewport
  once?: boolean;        // Ne déclencher qu'une seule fois
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { threshold = 0.15, rootMargin = '0px', once = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('revealed');
          if (once) observer.unobserve(element);
        } else if (!once) {
          element.classList.remove('revealed');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * Version pour plusieurs éléments à la fois.
 * Applique l'observation sur tous les enfants d'un conteneur
 * ayant la classe `.reveal-item`.
 */
export function useScrollRevealGroup(
  options: ScrollRevealOptions = {},
  dependencies: any[] = []
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Petit délai pour laisser le DOM se mettre à jour après le rendu Firebase
    const timer = setTimeout(() => {
      const items = container.querySelectorAll('.reveal-item');
      if (!items.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              if (once) observer.unobserve(entry.target);
            }
          });
        },
        { threshold, rootMargin }
      );

      items.forEach((item) => {
        // Si l'élément est déjà dans le viewport, le révéler immédiatement
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          item.classList.add('revealed');
        } else {
          observer.observe(item);
        }
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [threshold, rootMargin, once, ...dependencies]);

  return containerRef;
}

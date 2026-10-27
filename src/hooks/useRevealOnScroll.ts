import { useEffect } from 'react';

/**
 * Revela elementos com [data-reveal] quando entram na tela.
 * A classe `js-reveal` só é aplicada quando o observador existe; sem ele,
 * todo o conteúdo permanece visível.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('js-reveal');

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            reveal.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      // Elementos já visíveis na carga não são escondidos (evita piscar o conteúdo).
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-revealed');
      else reveal.observe(el);
    });

    return () => {
      reveal.disconnect();
      root.classList.remove('js-reveal');
    };
  }, []);
}

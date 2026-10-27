import { useEffect } from 'react';

/**
 * Ao chegar de outra página com um endereço como `…/#sobre`, a seção ainda não existe
 * quando o navegador tenta rolar até ela (a página é montada pelo React). Rola depois
 * da primeira renderização.
 */
export function useInitialHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
}

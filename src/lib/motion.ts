// Leitura dos tokens de movimento definidos em src/styles/tokens.css,
// para que CSS e JavaScript compartilhem as mesmas durações e curvas.

const cssVar = (name: string) =>
  typeof window === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const duration = (name: string, fallback: number) => {
  const raw = cssVar(name);
  const value = raw.endsWith('ms') ? parseFloat(raw) : raw.endsWith('s') ? parseFloat(raw) * 1000 : NaN;
  return Number.isFinite(value) ? value : fallback;
};

export const easing = (name: string, fallback: string) => cssVar(name) || fallback;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

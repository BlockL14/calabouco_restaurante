// Funções comuns aos geradores da parede (make-brick-texture.mjs) e do arco
// (make-arch.mjs): aleatoriedade determinística, curvas e a paleta dos tijolos,
// calibrada nas fotos da fachada e do corredor.

// ---------- Aleatoriedade determinística ----------

export function hash(x, y, seed) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export const mod = (a, n) => ((a % n) + n) % n;
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const smoothstep = (a, b, x) => smooth(clamp01((x - a) / (b - a)));

// ---------- Cor ----------

export function hsl(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

/** Cor-base de cada tijolo: terracota, ocre e alguns queimados (mais escuros). */
export function brickColor(col, row) {
  const r = hash(col, row, 7);
  const j1 = hash(col, row, 11);
  const j2 = hash(col, row, 13);
  if (r < 0.09) return hsl(12 + j1 * 6, 0.4 + j2 * 0.08, 0.17 + j2 * 0.04); // queimado
  if (r < 0.2) return hsl(22 + j1 * 5, 0.42 + j2 * 0.08, 0.29 + j2 * 0.04); // ocre claro
  return hsl(15 + j1 * 7, 0.46 + j2 * 0.1, 0.25 + j2 * 0.05); // terracota
}

export const MORTAR = [0.4, 0.35, 0.29];

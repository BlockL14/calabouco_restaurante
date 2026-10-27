// Gera a textura de fundo do site: pedra quase preta, com manchas e veios discretos,
// como o fundo da interface aprovada. Procedimental e determinística: o mesmo código
// sempre produz o mesmo arquivo. A ladrilha é contínua nas quatro bordas (os ruídos
// “dão a volta”), então se repete sem emenda visível.
//
//   npm run texture
//
// As cores já saem no tom final (quase preto); o CSS só escurece algumas faixas.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { clamp01, hash, hsl, lerp, mod, smooth, smoothstep } from './texture-common.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, 'src', 'assets', 'textures');

// Ladrilha de 960 × 960 px de CSS (ver --wall-size em src/styles/tokens.css).
// pedra: telas a partir de 700px, em 1,25× para telas densas; pedra-p: celulares, mais leve.
const TILE = 960;
const OUTPUTS = [
  { name: 'pedra', scale: 1.25 },
  { name: 'pedra-p', scale: 0.75 },
];

/** Ruído de valor periódico: a grade tem n × n células e “dá a volta” na ladrilha. */
function valueNoise(x, y, n, seed) {
  const u = (x / TILE) * n;
  const v = (y / TILE) * n;
  const x0 = Math.floor(u);
  const y0 = Math.floor(v);
  const sx = smooth(u - x0);
  const sy = smooth(v - y0);
  const i0 = mod(x0, n);
  const i1 = mod(x0 + 1, n);
  const j0 = mod(y0, n);
  const j1 = mod(y0 + 1, n);
  return lerp(lerp(hash(i0, j0, seed), hash(i1, j0, seed), sx), lerp(hash(i0, j1, seed), hash(i1, j1, seed), sx), sy);
}

/** Soma de oitavas (fBm) com célula inicial de ~`cell` px de CSS. Resultado em [0, 1]. */
function fbm(x, y, cell, octaves, seed) {
  let n = Math.max(1, Math.round(TILE / cell));
  let amp = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(x, y, n, seed + o * 101) * amp;
    norm += amp;
    amp *= 0.5;
    n *= 2;
  }
  return sum / norm;
}

/** Veios: ruído “dobrado” (1 no fio do veio, 0 longe dele). */
function veins(x, y, cell, seed) {
  // Distorce as coordenadas para os veios não seguirem a grade
  const wx = x + (fbm(x, y, cell * 1.6, 3, seed + 7) - 0.5) * cell * 0.9;
  const wy = y + (fbm(x, y, cell * 1.6, 3, seed + 9) - 0.5) * cell * 0.9;
  const r = 1 - Math.abs(2 * fbm(wx, wy, cell, 4, seed) - 1);
  return r ** 7;
}

async function render({ name, scale }) {
  const W = Math.round(TILE * scale);
  const height = new Float32Array(W * W);
  const tone = new Float32Array(W * W);

  for (let py = 0; py < W; py++) {
    const y = (py + 0.5) / scale;
    for (let px = 0; px < W; px++) {
      const x = (px + 0.5) / scale;
      const i = py * W + px;
      const large = fbm(x, y, 260, 4, 11);
      const mid = fbm(x, y, 64, 4, 23);
      const rock = fbm(x, y, 16, 3, 29);
      const grain = fbm(x, y, 2.2, 2, 37);
      const crack = veins(x, y, 170, 51);
      const fine = veins(x, y, 52, 67) * 0.6;
      // Superfície áspera: manchas grandes e médias, rugosidade e fissuras rebaixadas
      height[i] = large * 0.5 + mid * 0.35 + rock * 0.25 + (grain - 0.5) * 0.08 - crack * 0.25 - fine * 0.12;
      // Tom: manchas claras (pedra mais lisa), rugosidade e veios levemente claros
      const patch = smoothstep(0.52, 0.85, large * 0.5 + mid * 0.5);
      tone[i] = 0.6 + patch * 2.5 + (rock - 0.5) * 1.3 + (grain - 0.5) * 0.5 + crack * 1.7 + fine * 1;
    }
  }

  // Luz rasante de cima, à esquerda: revela o relevo sem criar brilho
  const L = [-0.4, -0.6, 0.7];
  const ln = Math.hypot(...L);
  const RELIEF = 6 * scale;
  const out = Buffer.alloc(W * W * 3);
  for (let py = 0; py < W; py++) {
    for (let px = 0; px < W; px++) {
      const i = py * W + px;
      const hx = height[py * W + mod(px + 1, W)] - height[py * W + mod(px - 1, W)];
      const hy = height[mod(py + 1, W) * W + px] - height[mod(py - 1, W) * W + px];
      const nx = -hx * RELIEF;
      const ny = -hy * RELIEF;
      const nl = Math.hypot(nx, ny, 1);
      const diffuse = Math.max(0, (nx * L[0] + ny * L[1] + L[2]) / (nl * ln));
      const shade = 0.55 + 0.6 * diffuse;
      // Pedra cinza-amarronzada no escuro: quase preta, com manchas e veios até ~12%
      const l = clamp01(0.021 * tone[i] * shade);
      const [r, g, b] = hsl(24, 0.16, l);
      out[i * 3] = Math.round(clamp01(r) * 255);
      out[i * 3 + 1] = Math.round(clamp01(g) * 255);
      out[i * 3 + 2] = Math.round(clamp01(b) * 255);
    }
  }

  const img = sharp(out, { raw: { width: W, height: W, channels: 3 } });
  await img.clone().avif({ quality: 66, effort: 6, chromaSubsampling: '4:4:4' }).toFile(path.join(OUT, `${name}.avif`));
  await img.clone().webp({ quality: 84, effort: 6 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(`✓ ${name} (${W}×${W}, exibida a ${TILE}px)`);
}

await mkdir(OUT, { recursive: true });
for (const o of OUTPUTS) await render(o);

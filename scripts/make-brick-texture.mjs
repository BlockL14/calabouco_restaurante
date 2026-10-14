// Gera a textura de parede de tijolos usada como fundo (telas largas).
// Procedimental e determinística: o mesmo código sempre produz o mesmo arquivo.
// A ladrilha é contínua nas quatro bordas (fiadas, juntas e ruídos “dão a volta”),
// então se repete sem emenda visível.
//
//   npm run texture
//
// Cores calibradas nos tijolos aparentes das fotos da casa (fachada ocre e
// corredor avermelhado), já em tom de penumbra. O escurecimento final e a “luz”
// de cada seção ficam no CSS, por cima da textura.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, 'src', 'assets', 'textures');
const PREVIEW = process.argv.includes('--preview') ? process.argv[process.argv.indexOf('--preview') + 1] : null;

// Geometria em px de CSS (aparelho 1x). SCALE define a resolução do arquivo.
const COLS = 8; // tijolos por fiada
const ROWS = 16; // fiadas
const PITCH_X = 132; // tijolo + junta
const PITCH_Y = 46;
const JOINT = 9; // largura da junta de argamassa
const SCALE = Number(process.env.BRICK_SCALE || 1.5);

const W_CSS = COLS * PITCH_X;
const H_CSS = ROWS * PITCH_Y;
const W = Math.round(W_CSS * SCALE);
const H = Math.round(H_CSS * SCALE);

// ---------- Aleatoriedade determinística ----------

function hash(x, y, seed) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const mod = (a, n) => ((a % n) + n) % n;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smoothstep = (a, b, x) => smooth(clamp01((x - a) / (b - a)));

/** Ruído de valor periódico: a grade tem nx × ny células e “dá a volta” na ladrilha. */
function valueNoise(x, y, nx, ny, seed) {
  const u = (x / W_CSS) * nx;
  const v = (y / H_CSS) * ny;
  const x0 = Math.floor(u);
  const y0 = Math.floor(v);
  const sx = smooth(u - x0);
  const sy = smooth(v - y0);
  const i0 = mod(x0, nx);
  const i1 = mod(x0 + 1, nx);
  const j0 = mod(y0, ny);
  const j1 = mod(y0 + 1, ny);
  return lerp(
    lerp(hash(i0, j0, seed), hash(i1, j0, seed), sx),
    lerp(hash(i0, j1, seed), hash(i1, j1, seed), sx),
    sy,
  );
}

/** Soma de oitavas (fBm) com célula inicial de ~`cell` px de CSS. Resultado em [0, 1]. */
function fbm(x, y, cell, octaves, seed) {
  let nx = Math.max(1, Math.round(W_CSS / cell));
  let ny = Math.max(1, Math.round(H_CSS / cell));
  let amp = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(x, y, nx, ny, seed + o * 101) * amp;
    norm += amp;
    amp *= 0.5;
    nx *= 2;
    ny *= 2;
  }
  return sum / norm;
}

// ---------- Cor ----------

function hsl(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

/** Cor-base de cada tijolo: terracota, ocre e alguns queimados (mais escuros). */
function brickColor(col, row) {
  const r = hash(col, row, 7);
  const j1 = hash(col, row, 11);
  const j2 = hash(col, row, 13);
  if (r < 0.09) return hsl(12 + j1 * 6, 0.4 + j2 * 0.08, 0.17 + j2 * 0.04); // queimado
  if (r < 0.2) return hsl(22 + j1 * 5, 0.42 + j2 * 0.08, 0.29 + j2 * 0.04); // ocre claro
  return hsl(15 + j1 * 7, 0.46 + j2 * 0.1, 0.25 + j2 * 0.05); // terracota
}

const MORTAR = [0.4, 0.35, 0.29];

// ---------- Geometria dos tijolos ----------

/** Deslocamento lateral de cada fiada: assentamento “a cada meio tijolo”, com pequena irregularidade. */
const rowOffset = (row) => (row % 2) * (PITCH_X / 2) + (hash(row, 0, 3) - 0.5) * 10;

/**
 * Distância (px de CSS) até a borda do tijolo mais próximo: negativa dentro dele.
 * Considera a célula do ponto e as vizinhas, porque bordas irregulares podem invadir a junta.
 */
function brickAt(x, y) {
  const row = Math.floor(y / PITCH_Y);
  const ly = y - row * PITCH_Y - PITCH_Y / 2;
  const off = rowOffset(mod(row, ROWS));
  const xs = mod(x - off, W_CSS);
  const col = Math.floor(xs / PITCH_X);
  const lx = xs - col * PITCH_X - PITCH_X / 2;

  const id = mod(col, COLS);
  const rid = mod(row, ROWS);
  const hx = (PITCH_X - JOINT) / 2 + (hash(id, rid, 17) - 0.5) * 2.4;
  const hy = (PITCH_Y - JOINT) / 2 + (hash(id, rid, 19) - 0.5) * 1.6;
  const r = 1.4 + hash(id, rid, 23) * 2.6;
  // Leve inclinação de cada tijolo (assentamento manual)
  const tilt = (hash(id, rid, 29) - 0.5) * 0.012;
  const ly2 = ly - lx * tilt;

  const qx = Math.abs(lx) - hx + r;
  const qy = Math.abs(ly2) - hy + r;
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const d = outside + Math.min(Math.max(qx, qy), 0) - r;
  return { d, col: id, row: rid, lx, ly: ly2, hx, hy };
}

// ---------- Renderização ----------

const height = new Float32Array(W * H);
const albedo = new Float32Array(W * H * 3);
const isBrick = new Uint8Array(W * H);

for (let py = 0; py < H; py++) {
  const y = (py + 0.5) / SCALE;
  for (let px = 0; px < W; px++) {
    const x = (px + 0.5) / SCALE;
    const i = py * W + px;
    const b = brickAt(x, y);

    // Borda irregular + lascas nos cantos e arestas
    let d = b.d + (fbm(x, y, 14, 2, 41) - 0.5) * 3 + (fbm(x, y, 3.5, 2, 43) - 0.5) * 0.7;
    // Lascas: mais frequentes nos cantos
    const chip = valueNoise(x, y, Math.round(W_CSS / 7), Math.round(H_CSS / 7), 53);
    const cornerness = smoothstep(0.55, 0.95, Math.abs(b.lx) / b.hx) * smoothstep(0.2, 0.9, Math.abs(b.ly) / b.hy);
    const nearEdge = 1 - smoothstep(-6, 0, -Math.abs(b.d + 2));
    const chipT = 0.8 - cornerness * 0.16;
    if (chip > chipT) d += (chip - chipT) * 34 * Math.max(nearEdge, cornerness);

    let h;
    let c;
    if (d < 0) {
      isBrick[i] = 1;
      const bevel = smoothstep(0, 3.2, -d);
      const bumps = fbm(x, y, 9, 4, 61);
      h = 0.4 + 0.6 * bevel + (bumps - 0.5) * 0.14;

      const base = brickColor(b.col, b.row);
      // Manchas grandes (queima irregular), grão fino e poros
      const mott = fbm(x, y, 26, 3, 71);
      const mott2 = fbm(x, y, 7, 2, 73);
      const grain = fbm(x, y, 1.1, 2, 83);
      const pore = fbm(x, y, 1.2, 2, 97);
      // Um lado do tijolo um pouco mais escuro (fogo do forno)
      const side = hash(b.col, b.row, 31) < 0.5 ? b.lx / b.hx : -b.lx / b.hx;
      let k = 0.74 + mott * 0.4 + (mott2 - 0.5) * 0.16;
      k *= 1 + (grain - 0.5) * 0.2;
      k *= 1 - Math.max(0, side) * 0.18 * hash(b.col, b.row, 37);
      if (pore > 0.8) k *= 0.74;
      // Fuligem nas arestas
      k *= 0.86 + 0.14 * bevel;
      c = [base[0] * k, base[1] * k, base[2] * k];
    } else {
      const grain = fbm(x, y, 1.2, 2, 109);
      const dirt = fbm(x, y, 14, 3, 113);
      h = 0.14 + (grain - 0.5) * 0.1 - smoothstep(0, JOINT / 2, d) * 0.04;
      const k = (0.72 + dirt * 0.42) * (1 + (grain - 0.5) * 0.36);
      c = [MORTAR[0] * k, MORTAR[1] * k, MORTAR[2] * k];
    }
    height[i] = h;
    albedo[i * 3] = c[0];
    albedo[i * 3 + 1] = c[1];
    albedo[i * 3 + 2] = c[2];
  }
}

// Luz quente vinda de cima e um pouco da esquerda (como de uma tocha na parede)
const L = (() => {
  const v = [-0.32, -0.72, 0.62];
  const n = Math.hypot(...v);
  return v.map((a) => a / n);
})();
const RELIEF = 0.9 * SCALE; // inclinação por diferença de altura entre pixels vizinhos
const shadowReach = Math.max(1, Math.round(3.2 * SCALE));

const out = Buffer.alloc(W * H * 3);
for (let py = 0; py < H; py++) {
  for (let px = 0; px < W; px++) {
    const i = py * W + px;
    const hl = height[py * W + mod(px - 1, W)];
    const hr = height[py * W + mod(px + 1, W)];
    const hu = height[mod(py - 1, H) * W + px];
    const hd = height[mod(py + 1, H) * W + px];
    let nx = -(hr - hl) * RELIEF;
    let ny = -(hd - hu) * RELIEF;
    let nz = 1;
    const nl = Math.hypot(nx, ny, nz);
    nx /= nl;
    ny /= nl;
    nz /= nl;
    const diffuse = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]) / L[2];
    let shade = 0.25 + 0.75 * diffuse;

    if (!isBrick[i]) {
      // Sombra projetada pelo tijolo de cima e oclusão no fundo da junta
      let occ = 0;
      for (let t = 1; t <= shadowReach; t++) {
        if (isBrick[mod(py - t, H) * W + mod(px - Math.round(t * 0.4), W)]) {
          occ = Math.max(occ, 1 - (t - 1) / shadowReach);
        }
      }
      shade *= 1 - occ * 0.45;
      shade *= 0.82;
    }

    for (let ch = 0; ch < 3; ch++) {
      const v = albedo[i * 3 + ch] * shade;
      out[i * 3 + ch] = Math.max(0, Math.min(255, Math.round(Math.pow(clamp01(v), 1 / 1.08) * 255)));
    }
  }
}

const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
if (PREVIEW) {
  await img.clone().png().toFile(PREVIEW);
  console.log(`prévia: ${PREVIEW} (${W}×${H})`);
} else {
  await mkdir(OUT, { recursive: true });
  const avif = await img.clone().avif({ quality: 50, effort: 7 }).toFile(path.join(OUT, 'tijolos.avif'));
  const webp = await img.clone().webp({ quality: 72, effort: 6 }).toFile(path.join(OUT, 'tijolos.webp'));
  console.log(`tijolos ${W}×${H} (exibido a ${W_CSS}×${H_CSS} px): avif ${(avif.size / 1024).toFixed(1)} KB, webp ${(webp.size / 1024).toFixed(1)} KB`);
}

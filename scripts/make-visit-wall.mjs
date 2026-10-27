// Gera a parede de pedra iluminada por um lampião, fundo da ilustração da seção
// “Visite o Calabouço” (o estandarte e o lampião são desenhados em SVG por cima, em
// src/components/Visit/BannerArt.tsx). Procedimental e determinística.
//
//   npm run wall
//
// A luz sai do ponto onde o SVG desenha o vidro do lampião: (705, 320) numa
// prancheta de 800 × 1000. Se mudar um, mude o outro.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { clamp01, hash, hsl, lerp, smooth, smoothstep } from './texture-common.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, 'src', 'assets', 'textures');

const SCALE = 1.05; // pixels por unidade da prancheta
const W = Math.round(800 * SCALE);
const H = Math.round(1000 * SCALE);
const LIGHT = { x: 705 * SCALE, y: 320 * SCALE, z: 150 * SCALE };

/** Ruído de valor suave (não periódico) e soma de oitavas. */
function noise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = smooth(x - xi);
  const ty = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
}

function fbm(x, y, seed, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq, seed + i * 17);
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum;
}

// ---------- Assentamento das pedras: fiadas de alturas variadas, blocos irregulares ----------

const rows = [];
for (let y = -40, r = 0; y < H + 40; r++) {
  const h = (78 + hash(r, 0, 3) * 46) * SCALE;
  const stones = [];
  for (let x = -60 - hash(r, 1, 5) * 120, c = 0; x < W + 60; c++) {
    const w = (120 + hash(r, c, 9) * 120) * SCALE;
    stones.push({ x0: x, x1: x + w, id: r * 97 + c });
    x += w;
  }
  rows.push({ y0: y, y1: y + h, stones, r });
  y += h;
}

const JOINT = 9 * SCALE;
const height = new Float32Array(W * H);
const albedo = new Float32Array(W * H * 3);

for (let py = 0; py < H; py++) {
  for (let px = 0; px < W; px++) {
    // Bordas irregulares: desloca a amostra com ruído antes de achar a pedra
    const wx = px + (fbm(px / 30, py / 30, 21) - 0.5) * 26 * SCALE;
    const wy = py + (fbm(px / 30, py / 30, 37) - 0.5) * 20 * SCALE;
    const row = rows.find((rw) => wy >= rw.y0 && wy < rw.y1) ?? rows[rows.length - 1];
    const stone = row.stones.find((s) => wx >= s.x0 && wx < s.x1) ?? row.stones[row.stones.length - 1];
    // Distância até a borda de um retângulo de cantos arredondados (pedras gastas)
    const halfW = (stone.x1 - stone.x0) / 2 - JOINT / 2;
    const halfH = (row.y1 - row.y0) / 2 - JOINT / 2;
    const R = (14 + hash(stone.id, 3, 47) * 16) * SCALE;
    const qx = Math.abs(wx - (stone.x0 + stone.x1) / 2) - halfW + R;
    const qy = Math.abs(wy - (row.y0 + row.y1) / 2) - halfH + R;
    const sdf = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - R;
    const edge = -sdf;

    // Pedra “almofadada”: sobe da junta, achata no meio, com textura áspera e lascas
    const u = (wx - stone.x0) / (stone.x1 - stone.x0) - 0.5;
    const v = (wy - row.y0) / (row.y1 - row.y0) - 0.5;
    const pillow = 1 - (u * u + v * v) * 1.1;
    const rough = fbm(px / 7, py / 7, stone.id, 4);
    const pits = smoothstep(0.62, 0.75, fbm(px / 16, py / 16, stone.id + 9, 3));
    const coarse = fbm(px / 46, py / 46, stone.id + 5, 3);
    const inside = smoothstep(0, (16 + coarse * 18) * SCALE, edge);
    const h = inside * (0.5 + 0.3 * pillow + 0.45 * coarse - pits * 0.18) + rough * 0.2 + (1 - inside) * 0.04;
    const i = py * W + px;
    height[i] = h;

    // Cor: pedra cinza-amarronzada, cada bloco num tom; juntas mais escuras
    const j1 = hash(stone.id, 1, 41);
    const j2 = hash(stone.id, 2, 43);
    const stoneColor = hsl(24 + j1 * 10, 0.08 + j2 * 0.08, 0.27 + j2 * 0.09 + (coarse - 0.5) * 0.1);
    const mortarColor = hsl(26, 0.08, 0.13);
    const t = inside;
    for (let k = 0; k < 3; k++) albedo[i * 3 + k] = lerp(mortarColor[k], stoneColor[k], t) * (0.85 + rough * 0.3);
  }
}

// ---------- Luz do lampião: difusa, com queda pela distância ----------

const out = Buffer.alloc(W * H * 3);
const RELIEF = 22 * SCALE;
const LIGHT_COLOR = [1, 0.66, 0.36];

for (let py = 0; py < H; py++) {
  for (let px = 0; px < W; px++) {
    const i = py * W + px;
    const hx = height[py * W + Math.min(W - 1, px + 1)] - height[py * W + Math.max(0, px - 1)];
    const hy = height[Math.min(H - 1, py + 1) * W + px] - height[Math.max(0, py - 1) * W + px];
    let nx = -hx * RELIEF * 0.5;
    let ny = -hy * RELIEF * 0.5;
    let nz = 1;
    const nl = Math.hypot(nx, ny, nz);
    nx /= nl;
    ny /= nl;
    nz /= nl;

    const lx = LIGHT.x - px;
    const ly = LIGHT.y - py;
    const lz = LIGHT.z - height[i] * RELIEF;
    const dist = Math.hypot(lx, ly, lz);
    const diffuse = Math.max(0, (nx * lx + ny * ly + nz * lz) / dist);
    const falloff = 1 / (1 + (dist / (190 * SCALE)) ** 2.2);

    for (let k = 0; k < 3; k++) {
      const lit = albedo[i * 3 + k] * (0.025 + diffuse * falloff * LIGHT_COLOR[k] * 3.4);
      // compressão suave dos realces
      out[i * 3 + k] = Math.round(clamp01(1 - Math.exp(-lit * 1.6)) * 255);
    }
  }
}

await mkdir(OUT, { recursive: true });
const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
await img.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, 'parede-visita.avif'));
await img.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(OUT, 'parede-visita.webp'));
console.log(`✓ parede-visita (${W}×${H})`);

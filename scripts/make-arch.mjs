// Gera o arco de tijolos da seção “Visite” (imagem com transparência).
// Procedimental e determinístico, com a mesma paleta e o mesmo modelo de luz da
// parede (scripts/make-brick-texture.mjs), para que arco e parede pareçam da mesma
// obra — como o arco real da fachada: aduelas radiais com a profundidade de um
// tijolo e ombreiras em fiadas que se encaixam na parede.
//
//   npm run arch
//
// Geometria em unidades em que o vão da porta mede 1000 × 800 (meio círculo de raio
// 500 sobre ombreiras de 300). A imagem inclui o anel e as ombreiras ao redor do vão:
// o CSS a posiciona com as mesmas proporções (ver .visit__arch em Visit.css).
// O vão fica transparente (o interior da porta é desenhado no HTML) e, do lado de
// fora, uma sombra suave escurece a parede onde o arco encosta nela.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { MORTAR, brickColor, clamp01, hash, lerp, smooth, smoothstep } from './brick-common.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, 'src', 'assets', 'textures');
const PREVIEW = process.argv.includes('--preview') ? process.argv[process.argv.indexOf('--preview') + 1] : null;

const R_IN = 500; // raio do vão
const T = 164; // profundidade do anel e largura das ombreiras (≈ comprimento de um tijolo da parede)
const W_U = 1000 + 2 * T;
const H_U = 800 + T;
const CX = T + 500; // centro do arco = meio do vão, na linha de nascença
const CY = T + 500;
const N = 35; // aduelas da largura de um tijolo deitado (ímpar: a do meio é a pedra-chave)
const STEP = Math.PI / N;
const COURSE = 62; // fiada das ombreiras: tijolo de 50 + junta de 12
const OVERLAP = 3; // os tijolos avançam um pouco sobre o vão e escondem a borda do HTML

// Saídas: telas largas (até ~680 px de vão em densidade 2x) e celulares
const OUTPUTS = [
  { name: 'arco', scale: 1.2 },
  { name: 'arco-p', scale: 0.7 },
];

/** Ruído de valor (não periódico) com célula de `cell` unidades. */
function noise(x, y, cell, seed) {
  const u = x / cell;
  const v = y / cell;
  const x0 = Math.floor(u);
  const y0 = Math.floor(v);
  const sx = smooth(u - x0);
  const sy = smooth(v - y0);
  return lerp(
    lerp(hash(x0, y0, seed), hash(x0 + 1, y0, seed), sx),
    lerp(hash(x0, y0 + 1, seed), hash(x0 + 1, y0 + 1, seed), sx),
    sy,
  );
}

const fbm = (x, y, cell, oct, seed) => {
  let s = 0;
  let n = 0;
  for (let o = 0, a = 1, c = cell; o < oct; o++, a *= 0.5, c /= 2) {
    s += noise(x, y, c, seed + o * 31) * a;
    n += a;
  }
  return s / n;
};

/** Distância a um retângulo de cantos arredondados (negativa dentro). */
function roundBox(px, py, hx, hy, r) {
  const qx = Math.abs(px) - hx + r;
  const qy = Math.abs(py) - hy + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/**
 * O que há no ponto (x, y): { brick: distância ao tijolo mais próximo (negativa dentro),
 * env: distância ao contorno da alvenaria (negativa dentro), open: está no vão,
 * id: identificação do tijolo, edge: distância à borda do vão }.
 */
function sample(x, y) {
  if (y < CY) {
    // Anel de aduelas
    const dx = x - CX;
    const dy = CY - y;
    const r = Math.hypot(dx, dy);
    const th = Math.atan2(dy, dx); // 0 (direita) … π (esquerda)
    const open = r < R_IN - OVERLAP;
    const k = Math.min(N - 1, Math.max(0, Math.floor(th / STEP)));
    const ri = R_IN - OVERLAP - 1 + (hash(k, 1, 5) - 0.5) * 3;
    const ro = R_IN + T - 7 + (hash(k, 2, 5) - 0.5) * 16;
    const joint = 9 + ((r - R_IN) / T) * 7; // juntas mais largas por fora (arco de tijolos retos)
    const tilt = (hash(k, 3, 5) - 0.5) * 0.03;
    const u = r - (ri + ro) / 2;
    const t = r * (th - (k + 0.5) * STEP) + u * tilt;
    const hw = (r * STEP) / 2 - joint / 2;
    const brick = roundBox(u, t, (ro - ri) / 2, Math.max(hw, 1), 3.5);
    const band = Math.max(R_IN - OVERLAP - 1 - r, r - (R_IN + T - 4));
    return { brick, env: Math.min(band, brick), open, id: [k, 100], edge: r - R_IN, ro };
  }
  // Ombreiras: fiadas alternando tijolo longo e curto (encaixe na parede)
  const left = x < CX;
  const dxo = left ? T - x : x - (T + 1000); // distância para fora a partir da borda do vão
  const n = Math.floor((y - CY) / COURSE);
  const ly = y - CY - n * COURSE - COURSE / 2;
  const long = n % 2 === 0;
  const len = (long ? T + 30 : T * 0.6) + (hash(n, left ? 1 : 2, 9) - 0.5) * 10;
  const open = dxo < -OVERLAP;
  const hx = (len + OVERLAP) / 2;
  const brick = roundBox(dxo - (len - OVERLAP) / 2 + 2, ly, hx - 6, 25 + (hash(n, left ? 3 : 4, 9) - 0.5) * 2, 3.5);
  const band = Math.max(-OVERLAP - 1 - dxo, dxo - (len - 4), Math.abs(ly) - COURSE / 2 - 0.5);
  return { brick, env: Math.min(band, brick), open, id: [n, left ? 200 : 300], edge: dxo };
}

async function render({ name, scale }) {
  const W = Math.round(W_U * scale);
  const H = Math.round(H_U * scale);
  const height = new Float32Array(W * H);
  const albedo = new Float32Array(W * H * 3);
  const info = new Float32Array(W * H * 3); // cobertura, sombra externa, borda do vão

  for (let py = 0; py < H; py++) {
    const y = (py + 0.5) / scale;
    for (let px = 0; px < W; px++) {
      const x = (px + 0.5) / scale;
      const i = py * W + px;
      const s = sample(x, y);
      // Bordas irregulares e lascas, como nos tijolos da parede
      const brick = s.brick + (fbm(x, y, 22, 2, 41) - 0.5) * 4 + (fbm(x, y, 6, 2, 43) - 0.5) * 1.2;
      const env = Math.min(s.env, brick);
      const cover = s.open ? 0 : clamp01(0.5 - env * scale);
      info[i * 3] = cover;
      info[i * 3 + 1] = s.open || env <= 0 ? 0 : 0.6 * Math.exp(-env / 20);
      info[i * 3 + 2] = s.edge;

      let h;
      let c;
      if (brick < 0) {
        const bevel = smoothstep(0, 6, -brick);
        h = 0.4 + 0.6 * bevel + (fbm(x, y, 14, 3, 61) - 0.5) * 0.14;
        const base = brickColor(s.id[0] + 17, s.id[1]);
        let k = 0.76 + fbm(x, y, 40, 3, 71) * 0.38 + (fbm(x, y, 10, 2, 73) - 0.5) * 0.14;
        k *= 1 + (noise(x, y, 1.6, 83) - 0.5) * 0.2;
        if (noise(x, y, 2, 97) > 0.82) k *= 0.74;
        k *= 0.86 + 0.14 * bevel;
        c = [base[0] * k, base[1] * k, base[2] * k];
      } else {
        h = 0.14 + (noise(x, y, 2, 109) - 0.5) * 0.1;
        const k = (0.72 + fbm(x, y, 22, 3, 113) * 0.42) * (1 + (noise(x, y, 1.8, 117) - 0.5) * 0.36);
        c = [MORTAR[0] * k, MORTAR[1] * k, MORTAR[2] * k];
      }
      height[i] = h;
      albedo.set(c, i * 3);
    }
  }

  // Luz: a mesma luz fraca da parede (de cima, à esquerda) e a luz quente do forno,
  // que sai pelo vão e pega as faces voltadas para ele, mais forte embaixo.
  const LA = [-0.32, -0.72, 0.62];
  const la = Math.hypot(...LA);
  const relief = 0.55 * scale;
  const glowAt = [CX, H_U * 0.95];
  const out = Buffer.alloc(W * H * 4);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const i = py * W + px;
      const cover = info[i * 3];
      const halo = info[i * 3 + 1];
      let rgb = [0, 0, 0];
      if (cover > 0) {
        const at = (xx, yy) => height[Math.min(H - 1, Math.max(0, yy)) * W + Math.min(W - 1, Math.max(0, xx))];
        let nx = -(at(px + 1, py) - at(px - 1, py)) * relief;
        let ny = -(at(px, py + 1) - at(px, py - 1)) * relief;
        let nz = 1;
        const nl = Math.hypot(nx, ny, nz);
        nx /= nl;
        ny /= nl;
        nz /= nl;
        const ambient = 0.25 + 0.75 * (Math.max(0, (nx * LA[0] + ny * LA[1] + nz * LA[2]) / la) / (LA[2] / la));

        const x = (px + 0.5) / scale;
        const y = (py + 0.5) / scale;
        const gx = glowAt[0] - x;
        const gy = glowAt[1] - y;
        const gl = Math.hypot(gx, gy) || 1;
        const lg = [(gx / gl) * 0.75, (gy / gl) * 0.75, 0.66];
        const lgl = Math.hypot(...lg);
        const facing = Math.max(0, (nx * lg[0] + ny * lg[1] + nz * lg[2]) / lgl);
        const edge = Math.max(0, info[i * 3 + 2]);
        const low = smoothstep(0, H_U, y);
        const glow = Math.exp(-edge / 110) * (0.35 + 0.65 * low) * facing;

        // Sombra no fundo das juntas (tijolo logo acima)
        let occ = 0;
        if (height[i] < 0.3) {
          const reach = Math.max(1, Math.round(4 * scale));
          for (let t = 1; t <= reach; t++) if (height[Math.max(0, py - t) * W + px] > 0.6) occ = Math.max(occ, 1 - (t - 1) / reach);
        }
        const dim = (1 - occ * 0.45) * (height[i] < 0.3 ? 0.82 : 1);
        // A parte de cima do arco fica na penumbra da seção, como a parede ao redor
        const amb = lerp(0.3, 0.5, low) * ambient;
        const warm = [1, 0.62, 0.34];
        rgb = [0, 1, 2].map((ch) => albedo[i * 3 + ch] * dim * (amb + 1.25 * glow * warm[ch]));
      }
      // Composição: alvenaria por cima da sombra que ela projeta na parede
      const a = cover + (1 - cover) * halo;
      for (let ch = 0; ch < 3; ch++) {
        const v = a > 0 ? (rgb[ch] * cover) / a : 0;
        out[i * 4 + ch] = Math.round(Math.pow(clamp01(v), 1 / 1.08) * 255);
      }
      out[i * 4 + 3] = Math.round(clamp01(a) * 255);
    }
  }

  const img = sharp(out, { raw: { width: W, height: H, channels: 4 } });
  if (PREVIEW) {
    await img.png().toFile(PREVIEW);
    console.log(`prévia: ${PREVIEW} (${W}×${H})`);
    return;
  }
  await mkdir(OUT, { recursive: true });
  const avif = await img.clone().avif({ quality: 55, effort: 7 }).toFile(path.join(OUT, `${name}.avif`));
  const webp = await img.clone().webp({ quality: 78, alphaQuality: 90, effort: 6 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(`${name} ${W}×${H}: avif ${(avif.size / 1024).toFixed(1)} KB, webp ${(webp.size / 1024).toFixed(1)} KB`);
}

for (const o of PREVIEW ? OUTPUTS.slice(0, 1) : OUTPUTS) await render(o);

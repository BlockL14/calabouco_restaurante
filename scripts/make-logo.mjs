// Prepara a logo oficial (assets-src/originais/logo-calabouco.png, fundo branco) para o
// site de fundo escuro, sem redesenhar nada:
// - brasão (escudo e espadas): cores originais; só o branco de FORA do desenho vira
//   transparente (o branco do escudo e das lâminas continua branco);
// - nome e “restaurante & pizzaria”: a tinta preta passa a creme, para ler no escuro.
// Gera em public/logo/: logo-escuro-* (logo completa), brasao-{96,192} (só o brasão) e
// nome-* (só o nome), em PNG e WebP, na resolução original e em 2x.
//
//   npm run logo

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(root, 'assets-src', 'originais', 'logo-calabouco.png');
const OUT = path.join(root, 'public', 'logo');

await mkdir(OUT, { recursive: true });

const CREAM = [243, 233, 220];
/** Linha (px do original) que separa o brasão do nome. */
const SPLIT_Y = 280;

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 3;
const lum = (i) => (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
const isRed = (i) => data[i] - Math.max(data[i + 1], data[i + 2]) > 50;

// Fundo do brasão: branco ligado à borda da área do brasão (preenchimento por inundação)
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push([x, 0], [x, SPLIT_Y - 1]);
for (let y = 0; y < SPLIT_Y; y++) stack.push([0, y], [W - 1, y]);
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= SPLIT_Y) continue;
  const k = y * W + x;
  if (bg[k]) continue;
  const i = px(x, y);
  if (isRed(i) || lum(i) < 0.8) continue;
  bg[k] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}
// Faixa de 2 px junto ao fundo: pixels de borda (cinza do serrilhado) viram tinta translúcida
const near = (x, y) => {
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < W && yy < SPLIT_Y && bg[yy * W + xx]) return true;
    }
  return false;
};

const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = px(x, y);
    const o = (y * W + x) * 4;
    const L = lum(i);
    if (y >= SPLIT_Y) {
      // Nome: tinta preta → creme, branco → transparente
      const a = Math.max(0, Math.min(1, (1 - L) * 1.15));
      out.set([...CREAM, Math.round(a * 255)], o);
    } else if (bg[y * W + x]) {
      out.set([0, 0, 0, 0], o);
    } else if (!isRed(i) && near(x, y) && L > 0.25) {
      const a = Math.max(0, Math.min(1, 1 - L));
      out.set([0, 0, 0, Math.round(a * 255)], o);
    } else {
      out.set([data[i], data[i + 1], data[i + 2], 255], o);
    }
  }
}

const full = sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 });
const fullBuf = await full.png().toBuffer();
const meta = await sharp(fullBuf).metadata();
for (const scale of [1, 2]) {
  const w = meta.width * scale;
  const img = sharp(fullBuf).resize({ width: w, kernel: 'lanczos3' });
  await img.clone().png({ compressionLevel: 9 }).toFile(path.join(OUT, `logo-escuro-${w}.png`));
  await img.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, `logo-escuro-${w}.webp`));
}

// Só o brasão (acima do nome), recortado
const emblem = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: 0, top: 0, width: W, height: SPLIT_Y })
  .png()
  .toBuffer();
const emblemTrim = await sharp(emblem).trim({ threshold: 1 }).png().toBuffer();
for (const h of [96, 192]) {
  const img = sharp(emblemTrim).resize({ height: h, kernel: 'lanczos3' });
  await img.clone().png({ compressionLevel: 9 }).toFile(path.join(OUT, `brasao-${h}.png`));
  await img.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, `brasao-${h}.webp`));
}
// Só o nome (“Calabouço” e “restaurante & pizzaria”), para o cabeçalho
const name = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: 0, top: SPLIT_Y, width: W, height: H - SPLIT_Y })
  .png()
  .toBuffer();
const nameTrim = await sharp(name).trim({ threshold: 1 }).png().toBuffer();
const nm = await sharp(nameTrim).metadata();
for (const scale of [1, 2]) {
  const img = sharp(nameTrim).resize({ width: nm.width * scale, kernel: 'lanczos3' });
  await img.clone().png({ compressionLevel: 9 }).toFile(path.join(OUT, `nome-${nm.width * scale}.png`));
  await img.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, `nome-${nm.width * scale}.webp`));
}
console.log(`✓ nome (${nm.width}×${nm.height})`);
const em = await sharp(emblemTrim).metadata();
console.log(`✓ logo-escuro (${meta.width}×${meta.height}, 1x e 2x) e brasão (${em.width}×${em.height} → 96 e 192 px de altura)`);

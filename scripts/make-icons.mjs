// Gera os ícones do site a partir do brasão da logo oficial (public/logo/brasao-192.png,
// gerado por `npm run logo`), sobre o fundo escuro do site:
// favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
// e o manifesto site.webmanifest, todos em public/.
//
//   npm run logo && npm run icons

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC = path.join(root, 'public');
const EMBLEM = path.join(PUBLIC, 'logo', 'brasao-192.png');
const BG = '#211813';

/** Brasão centrado num quadrado de `size` px; `inset` é a margem (fração do lado). */
const icon = async (size, inset, radius = 0) => {
  const inner = Math.round(size * (1 - inset * 2));
  const emblem = await sharp(EMBLEM).resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' }).toBuffer();
  const meta = await sharp(emblem).metadata();
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/></svg>`,
  );
  return sharp(bg)
    .composite([{ input: emblem, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const write = async (buf, file) => {
  await writeFile(path.join(PUBLIC, file), buf);
  console.log(`✓ ${file}`);
};

await write(await icon(32, 0.04, 6), 'favicon-32.png');
// iOS e Android aplicam a própria máscara: quadrado cheio, brasão dentro da área segura
await write(await icon(180, 0.16), 'apple-touch-icon.png');
await write(await icon(192, 0.16), 'icon-192.png');
await write(await icon(512, 0.16), 'icon-512.png');

// favicon.svg: a imagem de 64 px embutida (o brasão é uma imagem, não um vetor)
const png64 = await icon(64, 0.04, 12);
await writeFile(
  path.join(PUBLIC, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image width="64" height="64" href="data:image/png;base64,${png64.toString('base64')}"/></svg>\n`,
);

const manifest = JSON.parse(await readFile(path.join(PUBLIC, 'site.webmanifest'), 'utf8'));
Object.assign(manifest, { background_color: BG, theme_color: BG });
await writeFile(path.join(PUBLIC, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('✓ favicon.svg, site.webmanifest');

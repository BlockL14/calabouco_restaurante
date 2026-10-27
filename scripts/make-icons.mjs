// Gera os ícones do site a partir da coroa da marca (a mesma do cabeçalho):
// favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
// e o manifesto site.webmanifest, todos em public/.
//
//   npm run icons

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC = path.join(root, 'public');

const GOLD = '#c9a46a';
const BG = '#120d0b';

// Coroa da marca (src/components/Icons.tsx → CrownMark), grade de 48 × 30
const crown = `
  <path d="M8.5 22 5 10.5l6.4 4.6L15.5 7l4.6 7.4L24 5.5l3.9 8.9L32.5 7l4.1 8.1 6.4-4.6L39.5 22Z"
    fill="${GOLD}" fill-opacity="0.32" stroke="${GOLD}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M9 22.6h30v4.4H9Z" fill="${GOLD}" fill-opacity="0.55" stroke="${GOLD}" stroke-width="1.2"/>
  <path d="M24 0.6v4.6M21.9 2.4h4.2" stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="5" cy="10.5" r="1.8" fill="${GOLD}"/>
  <circle cx="15.5" cy="7" r="1.6" fill="${GOLD}"/>
  <circle cx="32.5" cy="7" r="1.6" fill="${GOLD}"/>
  <circle cx="43" cy="10.5" r="1.8" fill="${GOLD}"/>`;

/** Coroa centrada num quadrado; `inset` é a margem (fração do lado) e `radius` o arredondamento. */
const icon = ({ inset, radius }) => {
  const size = 64;
  const w = size * (1 - inset * 2);
  const scale = w / 48;
  const h = 30 * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2 + scale; // leve ajuste óptico para baixo
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/>
  <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="${Math.max(0, radius - 2)}" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="1"/>
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})">${crown}</g>
</svg>`;
};

const favicon = icon({ inset: 0.12, radius: 14 });
await writeFile(path.join(PUBLIC, 'favicon.svg'), `${favicon}\n`);

const png = async (svg, size, file) => {
  await sharp(Buffer.from(svg), { density: 72 * (size / 64) * 2 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, file));
  console.log(`✓ ${file}`);
};

await png(favicon, 32, 'favicon-32.png');
// iOS e Android aplicam a própria máscara: quadrado cheio, coroa dentro da área segura
const square = icon({ inset: 0.2, radius: 0 });
await png(square, 180, 'apple-touch-icon.png');
await png(square, 192, 'icon-192.png');
await png(square, 512, 'icon-512.png');

const manifest = {
  name: 'Calabouço Restaurante e Pizzaria',
  short_name: 'Calabouço',
  description: 'Restaurante e pizzaria à luz de velas no Centro Cívico de Curitiba, desde 1991.',
  lang: 'pt-BR',
  start_url: './',
  scope: './',
  display: 'browser',
  background_color: '#090706',
  theme_color: '#090706',
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
};
await writeFile(path.join(PUBLIC, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('✓ favicon.svg, site.webmanifest');

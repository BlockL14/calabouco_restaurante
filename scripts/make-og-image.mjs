// Gera a imagem de compartilhamento (Open Graph, 1200 × 630) em public/og-calabouco.jpg:
// foto real da abertura à direita, coroa e nome da casa nas fontes do site à esquerda.
// Renderiza com o Chromium do Playwright para usar exatamente as fontes e o CSS do site.
//
//   npm run og        (requer: npm i -D playwright && npx playwright install chromium)

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Este script precisa do Playwright: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TYPES = { woff2: 'font/woff2', webp: 'image/webp' };
// Recursos embutidos como data: — a página é montada em memória, sem servidor
const file = (p) => `data:${TYPES[p.split('.').pop()]};base64,${readFileSync(path.join(root, p)).toString('base64')}`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<style>
  @font-face { font-family: Cinzel; src: url('${file('node_modules/@fontsource-variable/cinzel/files/cinzel-latin-wght-normal.woff2')}') format('woff2'); font-weight: 400 900; }
  @font-face { font-family: Poppins; src: url('${file('node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2')}') format('woff2'); font-weight: 400; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #090706 url('${file('src/assets/textures/pedra.webp')}') 0 0 / 720px; color: #ecdcc6; }
  .photo { position: absolute; top: 0; right: 0; width: 700px; height: 630px; object-fit: cover; object-position: 50% 22%;
    -webkit-mask-image: linear-gradient(90deg, transparent 0, rgb(0 0 0 / .35) 18%, rgb(0 0 0 / .85) 38%, #000 52%), linear-gradient(180deg, #000 70%, transparent 100%);
    -webkit-mask-composite: source-in; mask-composite: intersect; }
  .frame { position: absolute; inset: 22px; border: 1px solid rgb(160 96 74 / .55); }
  .content { position: absolute; left: 92px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
  .crown { width: 74px; color: #c9a46a; margin-bottom: 18px; }
  h1 { font-family: Cinzel; font-weight: 500; font-size: 92px; line-height: 1; letter-spacing: .03em; }
  .sub { margin-top: 14px; font-family: Cinzel; font-weight: 500; font-size: 23px; letter-spacing: .26em; color: #bf946f; }
  .rule { width: 120px; height: 7px; margin: 34px 0 30px; background: #a0604a;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 7' preserveAspectRatio='none'%3E%3Cpath d='M0 3.5 6.5.6 5 3.5l1.5 2.9Z'/%3E%3Cpath d='M4.5 3h75.5v1H4.5Z'/%3E%3C/svg%3E") center / 100% 100% no-repeat; }
  p { font-family: Poppins; font-size: 27px; line-height: 1.5; color: #d7ccbe; }
</style></head>
<body>
  <img class="photo" src="${file('public/images/queijo-1020.webp')}" alt="" />
  <div class="frame"></div>
  <div class="content">
    <svg class="crown" viewBox="0 0 48 30" aria-hidden="true">
      <path d="M8.5 22 5 10.5l6.4 4.6L15.5 7l4.6 7.4L24 5.5l3.9 8.9L32.5 7l4.1 8.1 6.4-4.6L39.5 22Z" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M9 22.6h30v4.4H9Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.1"/>
      <path d="M24 .6v4.6M21.9 2.4h4.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="7" r="1.4" fill="currentColor"/>
      <circle cx="32.5" cy="7" r="1.4" fill="currentColor"/><circle cx="43" cy="10.5" r="1.5" fill="currentColor"/>
    </svg>
    <h1>CALABOUÇO</h1>
    <div class="sub">RESTAURANTE E PIZZARIA</div>
    <div class="rule"></div>
    <p>Centro Cívico · Curitiba<br />Desde 1991</p>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate('document.fonts.ready');
await page.screenshot({ path: path.join(root, 'public', 'og-calabouco.jpg'), type: 'jpeg', quality: 86 });
await browser.close();
console.log('✓ public/og-calabouco.jpg (1200×630)');

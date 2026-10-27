// Gera a imagem de compartilhamento (Open Graph, 1200 × 630) em public/og-calabouco.jpg,
// no visual do site: fundo creme, nome e título nas fontes do site (Fraunces e Manrope)
// à esquerda, a foto real da abertura à direita com o selo “desde 1991”.
// Renderiza com o Chromium do Playwright para usar exatamente as fontes do site.
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

// Mesmas cores de src/styles/tokens.css
const C = { cream: '#f6efe6', ink: '#1e1613', ink3: '#6b5d54', brick: '#a3361d' };

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<style>
  @font-face { font-family: Fraunces; src: url('${file('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: Manrope; src: url('${file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}') format('woff2'); font-weight: 200 800; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: ${C.cream}; color: ${C.ink}; font-family: Manrope; }
  .content { position: absolute; left: 80px; top: 0; bottom: 0; width: 580px; display: flex; flex-direction: column; justify-content: center; }
  .brand { display: flex; align-items: center; gap: 18px; }
  .crown { width: 66px; color: ${C.brick}; }
  .name { font-family: Fraunces; font-weight: 650; font-size: 50px; line-height: 1; letter-spacing: -0.01em; }
  .sub { margin-top: 6px; font-size: 15px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${C.ink3}; }
  h1 { margin-top: 52px; font-family: Fraunces; font-weight: 600; font-size: 72px; line-height: .98; letter-spacing: -0.03em; }
  h1 b { display: block; font-weight: inherit; text-wrap: balance; }
  h1 span { display: block; color: ${C.brick}; }
  .place { margin-top: 34px; font-size: 23px; font-weight: 600; color: ${C.ink3}; }
  .photo { position: absolute; top: 40px; right: 40px; width: 470px; height: 550px; border-radius: 30px; object-fit: cover; object-position: 40% 30%;
    box-shadow: 0 2px 4px rgb(30 22 19 / .08), 0 24px 48px -20px rgb(30 22 19 / .45); }
  .seal { position: absolute; left: 642px; bottom: 70px; width: 150px; transform: rotate(-8deg); filter: drop-shadow(0 10px 20px rgb(30 22 19 / .3)); }
  .seal .t { fill: ${C.cream}; font-family: Manrope; font-weight: 700; }
  .seal .y { fill: ${C.cream}; font-family: Fraunces; font-weight: 600; }
</style></head>
<body>
  <img class="photo" src="${file('public/images/queijo-1020.webp')}" alt="" />
  <svg class="seal" viewBox="0 0 120 120" aria-hidden="true">
    <defs><path id="c" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
    <circle cx="60" cy="60" r="58" fill="${C.brick}" />
    <circle cx="60" cy="60" r="31" fill="none" stroke="${C.cream}" stroke-opacity=".45" />
    <text class="t" font-size="10" letter-spacing="1.89"><textPath href="#c">CALABOUÇO · CENTRO CÍVICO · CURITIBA ·</textPath></text>
    <text class="t" x="60" y="55" text-anchor="middle" font-size="10" letter-spacing="1.5">DESDE</text>
    <text class="y" x="60" y="77" text-anchor="middle" font-size="22">1991</text>
  </svg>
  <div class="content">
    <div class="brand">
      <svg class="crown" viewBox="0 0 48 30" aria-hidden="true">
        <path d="M8.5 22 5 10.5l6.4 4.6L15.5 7l4.6 7.4L24 5.5l3.9 8.9L32.5 7l4.1 8.1 6.4-4.6L39.5 22Z" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M9 22.6h30v4.4H9Z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M24 .6v4.6M21.9 2.4h4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="5" cy="10.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="7" r="1.6" fill="currentColor"/>
        <circle cx="32.5" cy="7" r="1.6" fill="currentColor"/><circle cx="43" cy="10.5" r="1.7" fill="currentColor"/>
      </svg>
      <div>
        <div class="name">Calabouço</div>
        <div class="sub">Restaurante e Pizzaria</div>
      </div>
    </div>
    <h1><b>Pizza, massas e vinho</b> <span>à luz de velas</span></h1>
    <p class="place">Rua Mateus Leme, 1000 · Centro Cívico, Curitiba</p>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate('document.fonts.ready');
await page.screenshot({ path: path.join(root, 'public', 'og-calabouco.jpg'), type: 'jpeg', quality: 86 });
await browser.close();
console.log('✓ public/og-calabouco.jpg (1200×630)');

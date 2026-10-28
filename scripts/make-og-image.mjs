// Gera a imagem de compartilhamento (Open Graph, 1200 × 630) em public/og-calabouco.jpg,
// no visual do site: fundo escuro, logo oficial, título na fonte do cardápio e a pizza
// grande da abertura. Renderiza com o Chromium do Playwright para usar as fontes do site.
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
const C = { bg: '#211813', text: '#f3e9dc', text2: '#d8cab8', accent: '#f08a72', brick: '#b8312a' };
const TYPES2 = { png: 'image/png' };
const png = (p) => `data:${TYPES2.png};base64,${readFileSync(path.join(root, p)).toString('base64')}`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<style>
  @font-face { font-family: Pirata; src: url('${file('node_modules/@fontsource/pirata-one/files/pirata-one-latin-400-normal.woff2')}') format('woff2'); }
  @font-face { font-family: Texturina; src: url('${file('node_modules/@fontsource-variable/texturina/files/texturina-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; color: ${C.text}; font-family: Texturina;
    background: radial-gradient(60% 70% at 80% 70%, rgb(184 49 42 / .28), transparent 70%), ${C.bg}; }
  .pizza { position: absolute; right: -330px; bottom: 20px; width: 960px; height: auto;
    -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 16%, #000 86%, transparent 100%), linear-gradient(90deg, transparent 0, #000 14%);
    -webkit-mask-composite: source-in; }
  .content { position: absolute; left: 72px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; }
  .logo { width: 300px; height: auto; }
  h1 { margin-top: 26px; font-family: Pirata; font-weight: 400; font-size: 66px; line-height: .98; }
  h1 span { display: block; color: ${C.accent}; }
  .place { margin-top: 24px; font-size: 23px; font-weight: 600; color: ${C.text2}; }
</style></head>
<body>
  <img class="pizza" src="${file('public/images/pizza-1020.webp')}" alt="" />
  <div class="content">
    <img class="logo" src="${png('public/logo/logo-escuro-738.png')}" alt="" />
    <h1>Pizza, massas e vinho <span>à luz de velas</span></h1>
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

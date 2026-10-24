// Gera cópias otimizadas (AVIF + WebP) a partir dos originais em assets-src/originais.
// Os originais nunca são alterados. Para trocar ou acrescentar uma foto:
//   1. coloque o arquivo em assets-src/originais/
//   2. registre-o em JOBS abaixo (recorte opcional e larguras desejadas)
//   3. rode `npm run images`
// O script também grava src/content/image-manifest.json com as dimensões reais,
// usado pelos componentes para reservar espaço e evitar saltos de layout.

import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(root, 'assets-src', 'originais');
const OUT = path.join(root, 'public', 'images');
const MANIFEST = path.join(root, 'src', 'content', 'image-manifest.json');

const QUALITY = { avif: 56, webp: 80 };

/**
 * name: nome de saída (usado no código)
 * source: arquivo em assets-src/originais
 * crop: recorte em pixels do original (opcional)
 * flop: espelha na horizontal (opcional) — só em fotos sem texto legível
 * grade: tratamento de cor (opcional, ver `grade()` abaixo)
 * widths: larguras geradas. Valores acima da largura nativa são ampliados com
 *         Lanczos e nitidez leve — apenas para telas densas, sem inventar detalhes.
 */
const JOBS = [
  {
    name: 'corredor',
    source: 'arte-corredor-abra-as-portas.webp',
    // Recorte só da fotografia: remove a frase da arte, mantém o crédito @gabrielmessine.
    crop: { left: 0, top: 0, width: 683, height: 664 },
    grade: { pull: 0.45, reds: 0.4, saturation: 0.88, gamma: 1.42, exposure: 0.86, vignette: 0.32 },
    widths: [360, 420, 683, 1020],
  },
  {
    // Arte original, sem tratamento: aparece inteira na galeria.
    name: 'corredor-arte',
    source: 'arte-corredor-abra-as-portas.webp',
    widths: [400, 683],
  },
  {
    name: 'queijo',
    source: 'foto-queijo-puxado.webp',
    // Espelhada para o queijo ficar do lado de fora da página, como na interface aprovada.
    // O recorte tira da borda o fragmento de letreiro (“…uço”), que ficaria invertido.
    crop: { left: 34, top: 0, width: 646, height: 849 },
    flop: true,
    grade: { pull: 0.4, reds: 0.45, saturation: 0.95, gamma: 1.22, exposure: 0.96, vignette: 0.28 },
    widths: [360, 420, 646, 1020],
  },
  {
    // Arte original, sem tratamento: aparece inteira na galeria.
    name: 'arte-fachada',
    source: 'arte-fachada-tradicao-curitibana.webp',
    widths: [400, 686],
  },
  {
    name: 'pizza',
    source: 'arte-pizza-desde-1991.webp',
    // Apenas a pizza, abaixo do texto “Desde 1991”.
    crop: { left: 0, top: 535, width: 684, height: 320 },
    grade: { pull: 0.3, reds: 0.2, saturation: 0.82, gamma: 1.55, exposure: 0.78, vignette: 0.48 },
    widths: [420, 684, 1020],
  },
  {
    name: 'letreiro',
    source: 'arte-fachada-tradicao-curitibana.webp',
    // Letreiro e arco da entrada, acima da faixa gráfica “Tradição curitibana”.
    crop: { left: 0, top: 0, width: 686, height: 366 },
    grade: { pull: 0.55, reds: 0.1, saturation: 0.78, gamma: 1.6, exposure: 0.8, vignette: 0.4 },
    widths: [420, 686, 1020],
  },
  {
    name: 'velas',
    source: 'foto-queijo-puxado.webp',
    // Fundo desfocado da foto: velas sobre as mesas e parede de tijolos.
    crop: { left: 436, top: 128, width: 244, height: 400 },
    grade: { pull: 0.45, reds: 0.4, saturation: 0.95, gamma: 1.1, exposure: 1, vignette: 0 },
    widths: [244],
  },
];

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Tratamento de cor para aproximar as fotos do tom da interface (fundo quase preto,
 * luz âmbar de vela). Não altera forma nem conteúdo, apenas cor e luz:
 * - pull: puxa vermelhos e amarelos para o âmbar (28°)
 * - reds: tira saturação dos vermelhos intensos (a luz vermelha das paredes)
 * - saturation: saturação geral
 * - gamma / exposure: escurece médios e sombras, preservando os pontos de luz
 * - vignette: escurece as bordas
 */
const AMBER = 28;

async function grade(buffer, g) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const r = data[i] / 255;
      const gr = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, gr, b);
      const min = Math.min(r, gr, b);
      const l = (max + min) / 2;
      let s = 0;
      let h = 0;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((gr - b) / d + (gr < b ? 6 : 0)) * 60;
        else if (max === gr) h = ((b - r) / d + 2) * 60;
        else h = ((r - gr) / d + 4) * 60;
      }
      // Diferença angular até o âmbar, de -180° a 180°
      const delta = ((h - AMBER + 540) % 360) - 180;
      const warmBand = 1 - smoothstep(45, 75, Math.abs(delta));
      h = (h - delta * g.pull * warmBand + 360) % 360;
      const dist = Math.min(h, 360 - h);
      const redness = (1 - smoothstep(10, 24, dist)) * smoothstep(0.35, 0.75, s);
      s *= g.saturation * (1 - g.reds * redness);
      const nx = x / width - 0.5;
      const ny = y / height - 0.5;
      const vig = 1 - g.vignette * smoothstep(0.2, 0.75, Math.sqrt(nx * nx + ny * ny) * 1.25);
      let nl = Math.pow(l, g.gamma) * g.exposure * vig;
      nl = Math.min(1, Math.max(0, nl));
      // HSL → RGB
      const q = nl < 0.5 ? nl * (1 + s) : nl + s - nl * s;
      const p = 2 * nl - q;
      const hk = h / 360;
      const ch = (t) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
      };
      const rgb = s === 0 ? [nl, nl, nl] : [ch(hk + 1 / 3), ch(hk), ch(hk - 1 / 3)];
      out[i] = Math.round(rgb[0] * 255);
      out[i + 1] = Math.round(rgb[1] * 255);
      out[i + 2] = Math.round(rgb[2] * 255);
    }
  }
  return sharp(out, { raw: info }).png().toBuffer();
}

async function encode(pipeline, file) {
  const base = path.join(OUT, file);
  await pipeline.clone().avif({ quality: QUALITY.avif, effort: 6, chromaSubsampling: '4:4:4' }).toFile(`${base}.avif`);
  await pipeline.clone().webp({ quality: QUALITY.webp, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
}

async function run() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  const manifest = {};

  for (const job of JOBS) {
    let base = sharp(path.join(SRC, job.source));
    if (job.crop) base = base.extract(job.crop);
    if (job.flop) base = base.flop();
    let buffer = await base.png().toBuffer();
    if (job.grade) buffer = await grade(buffer, job.grade);
    const meta = await sharp(buffer).metadata();
    const widths = [];

    for (const w of job.widths) {
      const upscale = w > meta.width;
      let p = sharp(buffer).resize({ width: w, kernel: 'lanczos3', withoutEnlargement: false });
      if (upscale) p = p.sharpen({ sigma: 0.6 });
      await encode(p, `${job.name}-${w}`);
      widths.push(w);
    }

    manifest[job.name] = { width: meta.width, height: meta.height, widths };
    console.log(`✓ ${job.name} (${meta.width}×${meta.height}) → ${widths.join(', ')}`);
  }

  // Imagem de compartilhamento (og:image): o recorte do corredor, em JPEG.
  await sharp(path.join(SRC, 'arte-corredor-abra-as-portas.webp'))
    .extract({ left: 0, top: 0, width: 683, height: 664 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, 'og-calabouco.jpg'));

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Manifesto: ${path.relative(root, MANIFEST)}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

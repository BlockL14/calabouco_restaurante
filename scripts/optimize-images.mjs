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
 * widths: larguras geradas (420 atende os cartões da abertura em celulares de alta densidade). Valores acima da largura nativa são ampliados com
 *         Lanczos e nitidez leve — apenas para telas densas, sem inventar detalhes.
 * glow: gera também uma miniatura desfocada para a luz ambiente da abertura
 */
const JOBS = [
  {
    name: 'corredor',
    source: 'arte-corredor-abra-as-portas.webp',
    // Recorte só da fotografia: remove a frase da arte, mantém o crédito @gabrielmessine.
    crop: { left: 0, top: 0, width: 683, height: 664 },
    widths: [360, 420, 683, 1020],
    glow: true,
  },
  {
    name: 'corredor-arte',
    source: 'arte-corredor-abra-as-portas.webp',
    widths: [400, 683],
  },
  {
    name: 'queijo',
    source: 'foto-queijo-puxado.webp',
    widths: [360, 420, 680, 1020],
    glow: true,
  },
  {
    name: 'arte-pizza',
    source: 'arte-pizza-desde-1991.webp',
    widths: [360, 420, 684, 1020],
    glow: true,
  },
  {
    name: 'arte-fachada',
    source: 'arte-fachada-tradicao-curitibana.webp',
    widths: [360, 420, 686, 1020],
    glow: true,
  },
  {
    name: 'pizza',
    source: 'arte-pizza-desde-1991.webp',
    // Apenas a pizza, abaixo do texto “Desde 1991”.
    crop: { left: 0, top: 535, width: 684, height: 320 },
    widths: [420, 684],
  },
  {
    name: 'letreiro',
    source: 'arte-fachada-tradicao-curitibana.webp',
    // Letreiro e arco da entrada, acima da faixa gráfica “Tradição curitibana”.
    crop: { left: 0, top: 0, width: 686, height: 366 },
    widths: [420, 686],
  },
  {
    name: 'velas',
    source: 'foto-queijo-puxado.webp',
    // Fundo desfocado da foto: velas sobre as mesas e parede de tijolos.
    crop: { left: 436, top: 128, width: 244, height: 400 },
    widths: [244],
  },
];

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
    const buffer = await base.toBuffer();
    const meta = await sharp(buffer).metadata();
    const widths = [];

    for (const w of job.widths) {
      const upscale = w > meta.width;
      let p = sharp(buffer).resize({ width: w, kernel: 'lanczos3', withoutEnlargement: false });
      if (upscale) p = p.sharpen({ sigma: 0.6 });
      await encode(p, `${job.name}-${w}`);
      widths.push(w);
    }

    if (job.glow) {
      // Miniatura muito pequena e desfocada: vira luz ambiente quando ampliada via CSS.
      await sharp(buffer).resize({ width: 24 }).blur(1.2).webp({ quality: 60 }).toFile(path.join(OUT, `${job.name}-glow.webp`));
    }

    manifest[job.name] = { width: meta.width, height: meta.height, widths, glow: Boolean(job.glow) };
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

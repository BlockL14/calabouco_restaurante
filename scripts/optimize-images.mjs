// Gera cópias otimizadas (AVIF + WebP) a partir dos originais em assets-src/originais,
// sem tratamento de cor: as fotos aparecem como a casa as publicou.
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
 * widths: larguras geradas. Valores acima da largura nativa são ampliados com
 *         Lanczos e nitidez leve — apenas para telas densas, sem inventar detalhes.
 */
const JOBS = [
  {
    name: 'queijo',
    source: 'foto-queijo-puxado.webp',
    // O recorte tira da borda esquerda o fragmento de letreiro (“…uço”) no avental.
    crop: { left: 34, top: 0, width: 646, height: 849 },
    widths: [420, 646, 1020],
  },
  {
    name: 'corredor',
    source: 'arte-corredor-abra-as-portas.webp',
    // Recorte só da fotografia: remove a frase da arte, mantém o crédito @gabrielmessine.
    crop: { left: 0, top: 0, width: 683, height: 664 },
    widths: [360, 420, 683, 1020],
  },
  {
    name: 'letreiro',
    source: 'arte-fachada-tradicao-curitibana.webp',
    // Letreiro e arco da entrada, acima da faixa gráfica “Tradição curitibana”.
    crop: { left: 0, top: 0, width: 686, height: 366 },
    widths: [420, 686, 1020],
  },
  {
    name: 'pizza',
    source: 'arte-pizza-desde-1991.webp',
    // Apenas a pizza, abaixo do texto “Desde 1991”: a pizza grande da abertura.
    crop: { left: 0, top: 535, width: 684, height: 320 },
    widths: [420, 684, 1020, 1368],
  },
  {
    // Arte da casa inteira (entrada com o letreiro e a faixa “Tradição curitibana”).
    name: 'arte-fachada',
    source: 'arte-fachada-tradicao-curitibana.webp',
    widths: [400, 686],
  },
  {
    name: 'velas',
    source: 'foto-queijo-puxado.webp',
    // Fundo da foto: velas sobre as mesas e parede de tijolos.
    crop: { left: 436, top: 128, width: 244, height: 400 },
    widths: [244, 420],
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
    const buffer = await base.png().toBuffer();
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

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Manifesto: ${path.relative(root, MANIFEST)}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

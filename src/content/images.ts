import manifest from './image-manifest.json';

// Registro central das imagens publicadas.
// - `alt`: texto alternativo (descreve o que se vê, sem nomear pratos não confirmados)
// - `position`: object-position por breakpoint (base = celular, md ≥ 700px, lg ≥ 1024px)
// - `credit`: crédito visível quando a imagem traz marca de autoria
// Arquivos gerados por `npm run images` (ver scripts/optimize-images.mjs).

export type ImagePosition = { base: string; md?: string; lg?: string };

export type ImageAsset = {
  key: keyof typeof manifest;
  width: number;
  height: number;
  widths: readonly number[];
  alt: string;
  position: ImagePosition;
  credit?: string;
};

type ImageMeta = Omit<ImageAsset, 'key' | 'width' | 'height' | 'widths'>;

const meta: Record<keyof typeof manifest, ImageMeta> = {
  corredor: {
    alt: 'Corredor de tijolos aparentes com arcos sucessivos, grades de ferro, uma tocha acesa e um escudo pendurado no portão ao fundo.',
    // Mantém o crédito do fotógrafo (borda direita) visível.
    position: { base: '50% 50%' },
    credit: '@gabrielmessine',
  },
  queijo: {
    alt: 'Massa assada e dourada, com orégano por cima, sendo servida com o queijo derretido se esticando; ao fundo, paredes de tijolo e velas acesas.',
    position: { base: '40% 30%' },
  },
  'arte-fachada': {
    alt: 'Arte do Calabouço: entrada em arco de tijolos sob o letreiro “Calabouço — restaurante, pizzaria”, com a faixa “Tradição curitibana”.',
    position: { base: '50% 50%' },
  },
  pizza: {
    alt: 'Pizza servida em forma escura: metade com rodelas de tomate, azeitonas pretas e manjericão; metade com cebola e azeitonas verdes.',
    position: { base: '50% 55%' },
  },
  letreiro: {
    alt: 'Letreiro de madeira com o nome Calabouço, “restaurante” e “pizzaria”, sobre o arco de tijolos da entrada.',
    position: { base: '50% 45%' },
  },
  velas: {
    alt: 'Velas acesas sobre as mesas e luz avermelhada nas paredes de tijolo, desfocadas ao fundo do salão.',
    position: { base: '50% 50%' },
  },
};

export const images = Object.fromEntries(
  (Object.keys(manifest) as (keyof typeof manifest)[]).map((key) => [
    key,
    { key, ...manifest[key], ...meta[key] },
  ]),
) as unknown as Record<keyof typeof manifest, ImageAsset>;

export type ImageKey = keyof typeof images;

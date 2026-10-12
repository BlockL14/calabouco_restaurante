import type { CSSProperties } from 'react';
import type { ImageAsset } from '../content/images';

const BASE = import.meta.env.BASE_URL;

export const assetUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;

const file = (image: ImageAsset, width: number | 'glow', ext: 'avif' | 'webp') =>
  assetUrl(`images/${image.key}-${width}.${ext}`);

export const srcSet = (image: ImageAsset, ext: 'avif' | 'webp') =>
  image.widths.map((w) => `${file(image, w, ext)} ${w}w`).join(', ');

/** Variante WebP na largura nativa (ou a maior disponível sem ampliação). */
export const fallbackSrc = (image: ImageAsset) => {
  const native = image.widths.filter((w) => w <= image.width).pop() ?? image.widths[0];
  return file(image, native, 'webp');
};

export const glowSrc = (image: ImageAsset) => (image.glow ? file(image, 'glow', 'webp') : undefined);

/** Variáveis CSS de enquadramento por breakpoint (consumidas pela classe .obj). */
export const positionStyle = (image: ImageAsset): CSSProperties =>
  ({
    '--pos-base': image.position.base,
    '--pos-md': image.position.md,
    '--pos-lg': image.position.lg,
  }) as CSSProperties;

/**
 * Cria um <picture> fora do React, idêntico ao renderizado pelo componente Picture.
 * Usado no clone da transição da abertura e no pré-carregamento.
 */
export function createPictureElement(image: ImageAsset, sizes: string, alt = '') {
  const picture = document.createElement('picture');
  (['avif', 'webp'] as const).forEach((ext) => {
    const source = document.createElement('source');
    source.type = `image/${ext}`;
    source.srcset = srcSet(image, ext);
    source.sizes = sizes;
    picture.appendChild(source);
  });
  const img = document.createElement('img');
  img.alt = alt;
  img.width = image.width;
  img.height = image.height;
  img.className = 'obj';
  img.decoding = 'async';
  Object.entries(positionStyle(image)).forEach(([prop, value]) => {
    if (value) img.style.setProperty(prop, String(value));
  });
  img.src = fallbackSrc(image);
  picture.appendChild(img);
  return { picture, img };
}

const decodeCache = new Map<string, Promise<void>>();

/** Baixa e decodifica a imagem antes de usá-la numa transição (com tempo limite). */
export function preloadImage(image: ImageAsset, sizes: string, timeout = 1600): Promise<void> {
  const key = `${image.key}|${sizes}`;
  let pending = decodeCache.get(key);
  if (!pending) {
    const { img } = createPictureElement(image, sizes);
    pending = img.decode().catch(() => {
      decodeCache.delete(key);
    });
    decodeCache.set(key, pending);
  }
  return Promise.race([pending, new Promise<void>((resolve) => window.setTimeout(resolve, timeout))]);
}

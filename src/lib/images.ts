import type { CSSProperties } from 'react';
import type { ImageAsset } from '../content/images';

const BASE = import.meta.env.BASE_URL;

export const assetUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;

const file = (image: ImageAsset, width: number, ext: 'avif' | 'webp') =>
  assetUrl(`images/${image.key}-${width}.${ext}`);

export const srcSet = (image: ImageAsset, ext: 'avif' | 'webp') =>
  image.widths.map((w) => `${file(image, w, ext)} ${w}w`).join(', ');

/** Variante WebP na largura nativa (ou a maior disponível sem ampliação). */
export const fallbackSrc = (image: ImageAsset) => {
  const native = image.widths.filter((w) => w <= image.width).pop() ?? image.widths[0];
  return file(image, native, 'webp');
};

/** Variáveis CSS de enquadramento por breakpoint (consumidas pela classe .obj). */
export const positionStyle = (image: ImageAsset): CSSProperties =>
  ({
    '--pos-base': image.position.base,
    '--pos-md': image.position.md,
    '--pos-lg': image.position.lg,
  }) as CSSProperties;

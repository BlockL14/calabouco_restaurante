import type { Ref } from 'react';
import { images, type ImageKey } from '../content/images';
import { fallbackSrc, positionStyle, srcSet } from '../lib/images';

type PictureProps = {
  image: ImageKey;
  sizes: string;
  /** Texto alternativo; use '' para imagens decorativas ou duplicadas. */
  alt?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  imgRef?: Ref<HTMLImageElement>;
};

/** <picture> com AVIF + WebP, dimensões reservadas e enquadramento por breakpoint. */
export function Picture({ image, sizes, alt, priority = false, className, imgClassName, imgRef }: PictureProps) {
  const asset = images[image];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(asset, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(asset, 'webp')} sizes={sizes} />
      <img
        ref={imgRef}
        src={fallbackSrc(asset)}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={['obj', imgClassName].filter(Boolean).join(' ')}
        style={positionStyle(asset)}
        draggable={false}
      />
    </picture>
  );
}

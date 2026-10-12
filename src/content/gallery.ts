import type { ImageKey } from './images';

// Galeria da seção “A experiência”. Apenas fotos reais da casa.
// `layout` define a posição na composição (ver Experience.css).

export type GalleryItem = {
  id: string;
  image: ImageKey;
  caption: string;
  layout: 'main' | 'tall' | 'wide';
};

export const gallery: GalleryItem[] = [
  { id: 'corredor', image: 'corredor-arte', caption: 'O corredor de arcos', layout: 'main' },
  { id: 'velas', image: 'velas', caption: 'Luz de velas no salão', layout: 'tall' },
  { id: 'letreiro', image: 'letreiro', caption: 'O letreiro da entrada', layout: 'wide' },
];

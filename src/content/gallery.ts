import type { ImageKey } from './images';

// Galeria aberta pelo link da seção Ambiente. Apenas fotos e artes reais da casa.

export type GalleryItem = {
  id: string;
  image: ImageKey;
  caption: string;
};

export const gallery: GalleryItem[] = [
  { id: 'corredor', image: 'corredor-arte', caption: 'O corredor de arcos' },
  { id: 'velas', image: 'velas', caption: 'Luz de velas no salão' },
  { id: 'letreiro', image: 'letreiro', caption: 'O letreiro da entrada' },
  { id: 'fachada', image: 'arte-fachada', caption: 'A entrada da casa' },
];

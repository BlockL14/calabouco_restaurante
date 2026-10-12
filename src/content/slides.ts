import { sectionIds } from './business';
import type { MenuCategoryId } from './menu';
import type { ImageKey } from './images';

// Destaques da abertura. A ordem define a numeração (01, 02...).
// Só entram imagens com associação segura: a foto do prato com queijo não é
// identificada como “Coroa Real” porque o nome não está confirmado na imagem.

export type Slide = {
  id: string;
  /** Rótulo curto exibido no cartão. */
  label: string;
  title: string;
  /** Trecho final do título exibido em itálico (opcional; deve existir em `title`). */
  emphasis?: string;
  description: string;
  cta: { label: string; href: string; menuCategory?: MenuCategoryId };
  image: ImageKey;
};

export const slides: Slide[] = [
  {
    id: 'ambiente',
    label: 'Ambiente',
    title: 'Uma noite fora do comum.',
    emphasis: 'fora do comum.',
    description: 'Pizzas, massas e vinhos à luz de velas no Centro Cívico de Curitiba.',
    cta: { label: 'Explore os sabores', href: `#${sectionIds.flavors}` },
    image: 'corredor',
  },
  {
    id: 'cozinha',
    label: 'Da cozinha',
    title: 'Sabor que se estende.',
    emphasis: 'se estende.',
    description: 'Pizzas, massas e pratos da casa servidos à mesa, entre tijolos e velas acesas.',
    cta: { label: 'Ver pratos especiais', href: `#${sectionIds.flavors}`, menuCategory: 'especiais' },
    image: 'queijo',
  },
  {
    id: 'pizzas',
    label: 'Pizzas',
    title: 'Tradicionais e da casa.',
    emphasis: 'da casa.',
    description: 'Dos clássicos às receitas com nome de castelo, como Cavaleiro Negro e Guarda do Castelo.',
    cta: { label: 'Ver as pizzas', href: `#${sectionIds.flavors}`, menuCategory: 'pizzas' },
    image: 'arte-pizza',
  },
  {
    id: 'casa',
    label: 'A casa',
    title: 'No Centro Cívico, desde 1991.',
    emphasis: 'desde 1991.',
    description: 'Restaurante e pizzaria à la carte na Rua Mateus Leme, em Curitiba.',
    cta: { label: 'Como chegar', href: `#${sectionIds.visit}` },
    image: 'arte-fachada',
  },
];

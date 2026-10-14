import { sectionIds } from './business';
import type { MenuCategoryId } from './menu';
import type { ImageKey } from './images';

// Destaques da abertura. A ordem define a numeração (01, 02...).
// Só entram imagens com associação segura: a foto do prato com queijo não é
// identificada como “Coroa Real” porque o nome não está confirmado na imagem.

export type Slide = {
  id: string;
  /** Pequeno texto acima do título (com o traço dourado). */
  eyebrow: string;
  /** Título exibido no cartão. */
  label: string;
  /** Linha curta acima do título no cartão. */
  kicker: string;
  /** Título em duas linhas: o trecho `emphasis` (final do título) vai para a segunda linha. */
  title: string;
  emphasis: string;
  description: string;
  cta: { label: string; href: string; menuCategory?: MenuCategoryId };
  image: ImageKey;
  /** 'poster': a imagem é uma arte com texto próprio; a abertura escurece a faixa dos cartões. */
  tone?: 'poster';
};

export const slides: Slide[] = [
  {
    id: 'ambiente',
    eyebrow: 'Calabouço · Restaurante e Pizzaria',
    label: 'Ambiente',
    kicker: 'Luz de velas',
    title: 'Uma noite fora do comum.',
    emphasis: 'fora do comum.',
    description: 'Pizzas, massas e vinhos à luz de velas no Centro Cívico de Curitiba.',
    cta: { label: 'Explore os sabores', href: `#${sectionIds.flavors}` },
    image: 'corredor',
  },
  {
    id: 'cozinha',
    eyebrow: 'Da cozinha',
    label: 'Da cozinha',
    kicker: 'Sabores',
    title: 'Sabor que se estende.',
    emphasis: 'se estende.',
    description: 'Pizzas, massas e pratos da casa servidos à mesa, entre tijolos e velas acesas.',
    cta: { label: 'Ver pratos especiais', href: `#${sectionIds.flavors}`, menuCategory: 'especiais' },
    image: 'queijo',
  },
  {
    id: 'pizzas',
    eyebrow: 'Pizzaria à la carte',
    label: 'Pizzas',
    kicker: 'Cardápio',
    title: 'Tradicionais e da casa.',
    emphasis: 'da casa.',
    description: 'Dos clássicos às receitas com nome de castelo, como Cavaleiro Negro e Guarda do Castelo.',
    cta: { label: 'Ver as pizzas', href: `#${sectionIds.flavors}`, menuCategory: 'pizzas' },
    image: 'arte-pizza',
    tone: 'poster',
  },
  {
    id: 'casa',
    eyebrow: 'Centro Cívico · Curitiba',
    label: 'A casa',
    kicker: 'Desde 1991',
    title: 'Tradição desde 1991.',
    emphasis: 'desde 1991.',
    description: 'Restaurante e pizzaria à la carte na Rua Mateus Leme, no Centro Cívico de Curitiba.',
    cta: { label: 'Como chegar', href: `#${sectionIds.visit}` },
    image: 'arte-fachada',
    tone: 'poster',
  },
];

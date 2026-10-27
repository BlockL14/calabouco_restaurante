// Textos das seções. Apenas fatos dos materiais da casa (ver README, “Decisões de
// conteúdo”): nada de horários, avaliações, prêmios ou ingredientes não confirmados.

import type { ImageKey } from './images';

export const hero = {
  eyebrow: 'Centro Cívico · Curitiba · desde 1991',
  /** Título em duas partes: a segunda ganha destaque em terracota. */
  title: ['Pizza, massas e vinho', 'à luz de velas'] as const,
  text: 'Desde 1991, o Calabouço recebe Curitiba entre arcos de tijolos, grades de ferro e velas acesas. Pizzas da casa com nomes de castelo, massas, mignon e uma carta de vinhos.',
  primary: 'Ver o cardápio',
  secondary: 'Como chegar',
};

export type ReasonIcon = 'arch' | 'pizza' | 'crown';

/** Por que vir: três motivos, logo abaixo da abertura. */
export const reasons: { icon: ReasonIcon; title: string; text: string }[] = [
  { icon: 'arch', title: 'Ambiente medieval', text: 'Arcos de tijolos, grades de ferro, tochas e velas acesas no salão.' },
  { icon: 'pizza', title: 'Pizzas da casa', text: 'Receitas com nomes de castelo, como Cavaleiro Negro e Guarda do Castelo.' },
  { icon: 'crown', title: 'Desde 1991', text: 'Tradição curitibana no Centro Cívico, à la carte.' },
];

export const menuText = {
  kicker: 'Cardápio',
  title: 'Escolha antes de chegar',
  text: 'Pizzas da casa com nomes de castelo, tradicionais e calzones, entradas, mignon, massas, sobremesas e bebidas.',
};

export const ambience = {
  kicker: 'Ambiente',
  title: 'Entre arcos, grades e velas',
  text: 'O salão tem inspiração medieval: tijolos aparentes, portões de ferro, tochas e velas acesas sobre as mesas.',
  photos: [
    { image: 'corredor' as ImageKey, caption: 'O corredor de arcos' },
    { image: 'velas' as ImageKey, caption: 'Velas sobre as mesas' },
    { image: 'letreiro' as ImageKey, caption: 'O letreiro da entrada' },
    { image: 'arte-fachada' as ImageKey, caption: 'A entrada da casa' },
  ],
};

export const visit = {
  kicker: 'Visite',
  title: 'Nossa história e como chegar',
  story: [
    'O Calabouço abriu as portas em 1991 no Centro Cívico de Curitiba e, desde então, serve à la carte pizzas, massas e pratos entre arcos de tijolos e luz de velas.',
    'As pizzas da casa levam nomes de castelo, a sugestão da casa é a Coroa Real e a carta reúne vinhos para acompanhar a noite.',
  ],
  hours: 'Consulte os dias e horários pelo telefone.',
};

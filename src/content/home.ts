import type { ImageKey } from './images';

// Textos das seções da página. A estrutura segue a interface aprovada; os fatos vêm
// apenas dos materiais da casa (ver README, “Decisões de conteúdo”): nada de história
// dos fundadores, horários, endereço, telefone ou ingredientes não confirmados.

export const hero = {
  eyebrow: 'Sabor, história e boa companhia',
  title: ['Uma experiência', 'além da pizza'],
  text: 'No Calabouço, cada detalhe conta uma história: pizzas, massas e vinhos à luz de velas, em um ambiente de inspiração medieval no Centro Cívico de Curitiba.',
  primary: 'Explorar cardápio',
  secondary: 'Conhecer o ambiente',
  image: 'queijo' as ImageKey,
};

export const about = {
  eyebrow: 'Sobre nós',
  title: ['Tradição', 'em cada detalhe'],
  text: 'Desde 1991, o Calabouço recebe Curitiba entre arcos de tijolos, grades de ferro e velas acesas. Restaurante e pizzaria à la carte, com pizzas de nomes de castelo, massas, pratos especiais e vinhos.',
  link: 'Venha nos visitar',
  image: 'letreiro' as ImageKey,
};

export type FeatureIcon = 'crown' | 'pizza' | 'candle' | 'scroll';

export const features: { icon: FeatureIcon; title: string; text: string }[] = [
  { icon: 'crown', title: 'Desde 1991', text: 'Tradição curitibana no Centro Cívico.' },
  { icon: 'pizza', title: 'Pizzaria à la carte', text: 'Receitas da casa com nomes de castelo.' },
  { icon: 'candle', title: 'Ambiente medieval', text: 'Arcos de tijolos e luz de velas.' },
  { icon: 'scroll', title: 'Cardápio variado', text: 'Entradas, pizzas, massas, pratos, sobremesas e vinhos.' },
];

export const menuIntro = {
  eyebrow: 'Cardápio',
  title: ['Sabores', 'que marcam'],
  text: 'Dos clássicos às receitas da casa com nome de castelo, como Cavaleiro Negro e Guarda do Castelo, além de massas, pratos especiais, sobremesas e vinhos.',
  button: 'Ver cardápio completo',
  image: 'pizza' as ImageKey,
};

export const signature = {
  link: 'Ver no cardápio',
};

export const ambience = {
  eyebrow: 'Ambiente',
  title: ['Mais que um restaurante,', 'uma experiência'],
  text: 'Arcos de tijolos, grades de ferro, tochas e velas acesas criam uma atmosfera de inspiração medieval para acompanhar o jantar.',
  link: 'Conheça o ambiente',
  image: 'corredor' as ImageKey,
};

export const visit = {
  eyebrow: 'Visite o Calabouço',
  title: 'Nosso endereço',
  text: 'Estamos no Centro Cívico de Curitiba. Para saber os dias e horários de funcionamento, ligue para a casa.',
  hoursLabel: 'Horário de funcionamento',
  hoursText: 'Consulte pelo telefone',
  button: 'Como chegar',
};

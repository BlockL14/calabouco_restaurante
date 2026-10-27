// Cardápio — transcrito da foto do cardápio da casa (assets-src/referencias), apenas
// dos trechos legíveis. Sem preços, gramaturas ou tamanhos: há versões do cardápio com
// valores diferentes. Itens com leitura incerta ficaram de fora; a grafia segue a do
// cardápio (por exemplo, “alici”, “caipira”). Para editar, altere as listas abaixo.

export type MenuCategoryId = 'pizzas' | 'entradas' | 'pratos' | 'sobremesas' | 'bebidas';

/** `featured`: item em destaque na página (a Coroa Real). */
export type MenuItem = { name: string; note?: string; featured?: boolean };
export type MenuGroup = { title: string; items: MenuItem[] };

export type MenuCategory = {
  id: MenuCategoryId;
  label: string;
  intro: string;
  /** Quantos itens aparecem na prévia da página inicial. */
  preview: number;
  groups: MenuGroup[];
};

const list = (...names: string[]): MenuItem[] => names.map((name) => ({ name }));

export const featuredDish = {
  /** Âncora do destaque na página do cardápio completo. */
  id: 'coroa-real',
  eyebrow: 'Sugestão da casa',
  name: 'Coroa Real',
  description: 'Massa assada recheada com mignon em tiras, muçarela, catupiry, molho de tomate e orégano.',
};

export const menuNote = 'Consulte a casa sobre valores e disponibilidade.';

export const menuCategories: MenuCategory[] = [
  {
    id: 'pizzas',
    label: 'Pizzas',
    intro: 'Receitas da casa com nomes de castelo, sabores tradicionais e calzones.',
    preview: 9,
    groups: [
      {
        title: 'Pizzas da casa',
        items: list(
          'Calabouço',
          'Cavaleiro Negro',
          'Da Corte',
          'Della Rosa',
          'Di Cuore',
          'Dos Arqueiros',
          'Dos Escudeiros',
          'Família Real',
          'Guarda do Castelo',
        ),
      },
      {
        title: 'Tradicionais',
        items: list(
          'Alho e óleo',
          'Alici',
          'Atum',
          'Australiana',
          'Bacon',
          'Brócolis com bacon',
          'Calabresa',
          'Califórnia',
          'Caprese',
          'Catupiry',
          'Champignon',
          'Cinco queijos',
          'Escarola',
          'Frango com catupiry',
          'Funghi',
          'Gorgonzola',
          'Lombo com catupiry',
          'Lombo com champignon',
          'Marguerita',
          'Mediterrânea',
          'Milho com bacon',
          'Muçarela',
          'Napolitana',
          'Palmito com catupiry',
          'Paulista',
          'Pepperoni',
          'Portuguesa',
          'Quatro queijos',
          'Rúcula e tomate seco',
        ),
      },
      { title: 'Calzones', items: list('Atum', 'Calabouço', 'Escarola', 'Frango com catupiry', 'Quatro queijos') },
    ],
  },
  {
    id: 'entradas',
    label: 'Entradas',
    intro: 'Para começar a noite: antepastos, provolone ao forno, frios e sopas.',
    preview: 9,
    groups: [
      {
        title: 'Para começar',
        items: list(
          'Bolinho de parmesão',
          'Bruschetta',
          'Burrata com rúcula e pesto genovese',
          'Carpaccio',
          'Carpaccio com tomate seco',
          'Mignon aperitivo',
          'Provolone ao forno',
          'Provolone ao forno com alici',
          'Provolone ao forno com tomate seco',
          'Tostadas',
          'Travessa de frios',
        ),
      },
      { title: 'Sopas', items: list('Creme de milho', 'Creme de palmito', 'Sopa de cebola') },
    ],
  },
  {
    id: 'pratos',
    label: 'Pratos',
    intro: 'A sugestão da casa, mignon, frango, salmão e massas, com acompanhamentos.',
    preview: 10,
    groups: [
      {
        title: 'Sugestão da casa',
        items: [{ name: 'Coroa Real', note: 'Massa assada recheada com mignon em tiras', featured: true }],
      },
      { title: 'Mignon especial', items: list('Calabouço', 'Grelhado com massa') },
      {
        title: 'Mignon',
        items: list(
          'Acebolado',
          'Alho e óleo',
          'Ao pesto',
          'Chateaubriand',
          'Com legumes ao creme',
          'Com molho de mostarda',
          'Medalhão',
          'Parmegiana',
          'Quatro queijos',
          'Suíço',
        ),
      },
      { title: 'Frango', items: list('Grelhado', 'Medalhão com molho de mostarda', 'Parmegiana') },
      { title: 'Salmão', items: list('Na manteiga com legumes', 'Na manteiga com requeijão') },
      {
        title: 'Spaghetti, tagliarini ou penne',
        items: list('Alho e óleo', 'Bolonhesa', 'Carbonara', 'Funghi', 'Quatro queijos', 'Sugo'),
      },
      { title: 'Lasanhas', items: list('Ao sugo', 'Bolonhesa', 'De frango com catupiry', 'Quatro queijos') },
      {
        title: 'Canelones',
        items: list(
          'De carne à bolonhesa',
          'De queijo e presunto à quatro queijos',
          'De ricota com gorgonzola e nozes',
          'De ricota e tomate seco à quatro queijos',
          'De frango com catupiry ao sugo',
        ),
      },
      { title: 'Capeletti', items: list('De frango com cream cheese', 'De ricota e nozes') },
      {
        title: 'Acompanhamentos',
        items: list(
          'Arroz',
          'Arroz à grega',
          'Batata frita',
          'Salada de palmito',
          'Salada simples',
          'Salada caprese',
          'Salada Calabouço',
        ),
      },
    ],
  },
  {
    id: 'sobremesas',
    label: 'Sobremesas',
    intro: 'Para fechar a noite, incluindo pizzas doces da casa.',
    preview: 9,
    groups: [
      {
        title: 'Sobremesas',
        items: list(
          'Abóbora assada com creme',
          'Brownie com sorvete de creme',
          'Mousse de chocolate',
          'Mousse de maracujá',
          'Petit gâteau com sorvete de creme',
          'Pudim de leite',
        ),
      },
      { title: 'Pizzas doces', items: list('Cappuccino', 'Cavaleiro Negro', 'Guarda do Castelo') },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    intro: 'Vinhos da carta da casa, caipiras, aperitivos, cervejas, destilados, sucos, café e chá.',
    preview: 9,
    groups: [
      {
        title: 'Vinhos',
        items: list(
          '99 Rosas Viognier Chardonnay',
          '99 Rosas Rosé',
          '99 Rosas Tempranillo',
          'Alambrado Pinot',
          'Alfredo Roca Malbec',
          'Alfredo Roca Pinot',
          'Algairen Tempranillo',
          'Altura Cabernet Franc',
          'Casillero del Diablo Cabernet',
          'Céfiro Cool Reserve Carménère',
          'Ceppaiano Alle Viole IGT',
          'Corbelli Primitivo',
          'Côtes-du-Rhône Abel Pinchard',
          'Estelar 37 Merlot',
          'Gran Alambrado Malbec',
          'Jacob’s Creek Shiraz',
        ),
      },
      {
        title: 'Caipiras e batidas',
        items: list(
          'Batida de coco',
          'Batida de maracujá',
          'Caipira de cachaça',
          'Caipira de maracujá',
          'Caipira de morango',
          'Caipira de rum',
          'Caipira de saquê',
          'Caipira de Smirnoff',
          'Caipira de steinhaeger',
        ),
      },
      {
        title: 'Aperitivos',
        items: list(
          'Alexander',
          'Cachaça',
          'Campari',
          'Conhaque Macieira',
          'Cuba-libre',
          'Gin',
          'Gin-tônica',
          'Malibu',
          'Martini',
          'Rum',
          'Steinhaeger',
          'Underberg',
          'Vodka',
        ),
      },
      {
        title: 'Cervejas',
        items: [
          ...list('Heineken', 'Original', 'Serramalte', 'Stella Artois', 'Sem álcool'),
          { name: 'Cervejas especiais', note: 'Sob consulta' },
        ],
      },
      {
        title: 'Whiskies',
        items: list('Ballantine’s Finest', 'Jack Daniel’s', 'Johnnie Walker Red Label', 'Johnnie Walker Black Label'),
      },
      { title: 'Licores', items: list('Amarula', 'Cointreau', 'Frangelico') },
      {
        title: 'Refrigerantes e sucos',
        items: list(
          'Água mineral',
          'H2OH!',
          'Ice tea',
          'Refrigerantes',
          'Soda italiana',
          'Suco de laranja',
          'Suco de uva',
          'Limonada suíça',
        ),
      },
      { title: 'Café e chá', items: list('Café Nespresso', 'Chá Twinings') },
    ],
  },
];

export const countItems = (category: MenuCategory) =>
  category.groups.reduce((total, group) => total + group.items.length, 0);

export const totalItems = menuCategories.reduce((total, category) => total + countItems(category), 0);

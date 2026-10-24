// Seleção do cardápio — transcrita apenas dos trechos legíveis dos materiais.
// Sem preços, gramaturas ou tamanhos: há versões do cardápio com valores diferentes.
// Itens com leitura incerta ficaram de fora. Para editar, altere as listas abaixo.

export type MenuCategoryId = 'pizzas' | 'entradas' | 'pratos' | 'sobremesas' | 'vinhos';

/** `featured`: item em destaque na página (a Coroa Real). */
export type MenuItem = { name: string; note?: string; featured?: boolean };
export type MenuGroup = { title: string; items: MenuItem[] };

export type MenuCategory = {
  id: MenuCategoryId;
  label: string;
  intro: string;
  /** Quantos itens aparecem antes de “Ver todos”. */
  preview: number;
  groups: MenuGroup[];
};

const list = (...names: string[]): MenuItem[] => names.map((name) => ({ name }));

export const featuredDish = {
  eyebrow: 'Sugestão da casa',
  name: 'Coroa Real',
  description: 'Massa assada recheada com mignon em tiras, muçarela, catupiry, molho de tomate e orégano.',
  components: ['Massa assada', 'Mignon em tiras', 'Muçarela', 'Catupiry', 'Molho de tomate', 'Orégano'],
};

export const menuNote = 'Consulte a casa sobre valores e disponibilidade.';

export const menuCategories: MenuCategory[] = [
  {
    id: 'pizzas',
    label: 'Pizzas',
    intro: 'Receitas da casa com nomes de castelo, sabores tradicionais e calzones.',
    preview: 12,
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
          'Marguerita',
          'Calabresa',
          'Quatro queijos',
          'Pepperoni',
          'Rúcula e tomate seco',
          'Alho e óleo',
          'Atum',
          'Australiana',
          'Bacon',
          'Brócolis com bacon',
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
          'Mediterrânea',
          'Milho com bacon',
          'Muçarela',
          'Napolitana',
          'Palmito com catupiry',
          'Paulista',
          'Portuguesa',
        ),
      },
      { title: 'Calzones', items: list('Calabouço', 'Atum', 'Escarola', 'Frango com catupiry', 'Quatro queijos') },
    ],
  },
  {
    id: 'entradas',
    label: 'Entradas',
    intro: 'Para começar a noite: antepastos, queijos ao forno e sopas.',
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
          'Provolone ao forno com tomate seco',
          'Travessa de frios',
        ),
      },
      { title: 'Sopas', items: list('Creme de milho', 'Creme de palmito', 'Sopa de cebola') },
    ],
  },
  {
    id: 'pratos',
    label: 'Pratos',
    intro: 'Massas, mignon, frango e salmão — e a sugestão da casa, a Coroa Real.',
    preview: 12,
    groups: [
      {
        title: 'Sugestão da casa',
        items: [{ name: 'Coroa Real', note: 'Massa assada recheada com mignon em tiras', featured: true }],
      },
      {
        title: 'Massas: espaguete, talharim ou penne',
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
      { title: 'Mignon especial', items: list('Mignon Calabouço', 'Mignon grelhado com massa') },
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
        title: 'Acompanhamentos',
        items: list(
          'Arroz',
          'Arroz à grega',
          'Batata frita',
          'Salada simples',
          'Salada caprese',
          'Salada de palmito',
          'Salada Calabouço',
        ),
      },
    ],
  },
  {
    id: 'sobremesas',
    label: 'Sobremesas',
    intro: 'Para fechar a noite, incluindo pizzas servidas como sobremesa.',
    preview: 8,
    groups: [
      {
        title: 'Sobremesas',
        items: list(
          'Petit gâteau com sorvete de creme',
          'Brownie com sorvete de creme',
          'Mousse de chocolate',
          'Mousse de maracujá',
          'Pudim de leite',
        ),
      },
      { title: 'Pizzas de sobremesa', items: list('Cappuccino', 'Cavaleiro Negro', 'Guarda do Castelo') },
    ],
  },
  {
    id: 'vinhos',
    label: 'Vinhos',
    intro: 'Alguns dos rótulos que aparecem na carta da casa.',
    preview: 10,
    groups: [
      {
        title: 'Tintos',
        items: list(
          'Alfredo Roca Malbec',
          'Alfredo Roca Pinot',
          'Altura Cabernet Franc',
          'Casillero del Diablo Cabernet',
          'Céfiro Cool Reserve Carménère',
          'Ceppaiano Alle Viole IGT',
          'Corbelli Primitivo',
          'Côtes-du-Rhône Abel Pinchard',
          'Gran Alambrado Malbec',
          'Jacob’s Creek Shiraz',
          '99 Rosas Tempranillo',
        ),
      },
      { title: 'Brancos e rosés', items: list('99 Rosas Viognier Chardonnay', '99 Rosas Rosé') },
    ],
  },
];

export const countItems = (category: MenuCategory) =>
  category.groups.reduce((total, group) => total + group.items.length, 0);

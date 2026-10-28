// Cardápio — transcrito da foto do cardápio impresso da casa (assets-src/referencias),
// com a grafia original (“alici”, “caipira”).
//
// Preços: os valores legíveis na foto, em reais. A coluna da direita da foto (mignon,
// frango, salmão, lasanhas, capeletti, acompanhamentos, sobremesas, café e chá) está
// cortada, e alguns itens de bebidas estão apagados: esses ficam sem preço (“consulte”).
// Itens marcados com “conferir” tiveram leitura incerta (dígitos borrados) — confirme
// com o cardápio atual da casa antes de publicar.
//
// Descrições: só o que o nome do prato já diz (ou a definição do prato clássico). A foto
// não traz ingredientes; nas receitas da casa e nas tradicionais cuja composição varia de
// pizzaria para pizzaria, o texto pede ao cliente que pergunte à casa.

export type MenuCategoryId = 'pizzas' | 'entradas' | 'pratos' | 'sobremesas' | 'bebidas';

/** `price` em reais; sem `price`, a página mostra “consulte”. `featured`: a Coroa Real. */
export type MenuItem = { name: string; description: string; price?: number; featured?: boolean };
/** `note`: observação do grupo (por exemplo, o tamanho das pizzas). */
export type MenuGroup = { title: string; note?: string; items: MenuItem[] };

export type MenuCategory = {
  id: MenuCategoryId;
  label: string;
  intro: string;
  groups: MenuGroup[];
};

const item = (name: string, price: number | undefined, description: string): MenuItem => ({
  name,
  description,
  ...(price !== undefined ? { price } : {}),
});

/** Receitas da casa e tradicionais de composição variável: o texto convida a perguntar. */
const ASK = 'Pergunte ao garçom os ingredientes.';
const HOUSE = `Receita exclusiva da casa. ${ASK}`;
const CLASSIC = `Tradicional do cardápio; a composição varia de casa para casa. ${ASK}`;

export const featuredDish = {
  id: 'coroa-real',
  eyebrow: 'Sugestão da casa',
  name: 'Coroa Real',
  description: 'Massa assada recheada com mignon em tiras, muçarela, catupiry, molho de tomate e orégano.',
  price: 165.8,
};

export const menuNote =
  'Valores do cardápio impresso da casa, sujeitos a alteração; pizzas e calzones no tamanho médio. Não incluem a taxa de serviço de 10%. Nos itens sem valor, consulte a casa.';

export const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const MEDIA = 'Tamanho médio';

export const menuCategories: MenuCategory[] = [
  {
    id: 'pizzas',
    label: 'Pizzas',
    intro: 'Receitas da casa com nomes de castelo, sabores tradicionais e calzones.',
    groups: [
      {
        title: 'Pizzas da casa',
        note: MEDIA,
        items: [
          item('Calabouço', 98.4, `A pizza que leva o nome da casa. ${ASK}`),
          item('Cavaleiro Negro', 82.7, `Receita da casa, também servida em versão doce. ${ASK}`),
          item('Da Corte', 82.7, HOUSE),
          item('Della Rosa', 90.9, HOUSE),
          item('Di Cuore', 95.1, HOUSE),
          item('Dos Arqueiros', 82.7, HOUSE), // conferir: 82,70 ou 92,70
          item('Dos Escudeiros', 82.7, HOUSE),
          item('Família Real', 86.7, HOUSE),
          item('Guarda do Castelo', 73.9, `Receita da casa, também servida em versão doce. ${ASK}`),
        ],
      },
      {
        title: 'Tradicionais',
        note: MEDIA,
        items: [
          item('Alho e óleo', 70.5, 'Alho e azeite: o sabor simples e marcante de um clássico.'),
          item('Alici', 73, 'Com alici, a anchova curada de sabor salgado e intenso.'), // conferir: 73,00 ou 73,90
          item('Atum', 73.9, 'Coberta com atum.'),
          item('Australiana', 86.7, CLASSIC),
          item('Bacon', 73.9, 'Coberta com bacon.'),
          item('Brócolis com bacon', 75.2, 'Brócolis e bacon.'),
          item('Calabresa', 73, 'Coberta com calabresa fatiada.'), // conferir: 73,00 ou 73,90
          item('Califórnia', 82.7, CLASSIC),
          item('Caprese', 86.7, 'Como a salada italiana: tomate, muçarela e manjericão.'),
          item('Catupiry', 82.7, 'Coberta com catupiry.'),
          item('Champignon', 82.7, 'Com champignon.'),
          item('Cinco queijos', 86.7, 'Cinco queijos combinados.'),
          item('Escarola', 73.9, 'Com escarola.'),
          item('Frango com catupiry', 82.7, 'Frango e catupiry.'),
          item('Funghi', 86.7, 'Com funghi, o cogumelo seco de sabor intenso.'),
          item('Gorgonzola', 82.7, 'Com gorgonzola, o queijo azul de sabor marcante.'),
          item('Lombo com catupiry', 82.7, 'Lombo e catupiry.'),
          item('Lombo com champignon', 82.7, 'Lombo e champignon.'),
          item('Marguerita', 70.7, 'A clássica italiana: tomate, muçarela e manjericão.'),
          item('Mediterrânea', 98.1, CLASSIC),
          item('Milho com bacon', 75.2, 'Milho e bacon.'),
          item('Muçarela', 69.4, 'Coberta com muçarela.'), // conferir: 69,40 ou 60,40
          item('Napolitana', 70.7, CLASSIC),
          item('Palmito com catupiry', 86.7, 'Palmito e catupiry.'),
          item('Paulista', 82.7, CLASSIC),
          item('Pepperoni', 82.7, 'Com pepperoni, o salame levemente picante.'),
          item('Portuguesa', 73.9, CLASSIC),
          item('Quatro queijos', 82.7, 'Quatro queijos combinados.'),
          item('Rúcula e tomate seco', 86.7, 'Rúcula fresca e tomate seco.'),
        ],
      },
      {
        title: 'Calzones',
        note: MEDIA,
        items: [
          item('Atum', 113.2, 'Pizza fechada, recheada com atum.'),
          item('Calabouço', 116.3, `O calzone que leva o nome da casa. ${ASK}`),
          item('Escarola', 105.1, 'Pizza fechada, recheada com escarola.'),
          item('Frango com catupiry', 123.2, 'Pizza fechada, recheada com frango e catupiry.'),
          item('Quatro queijos', 114.4, 'Pizza fechada, recheada com quatro queijos.'),
        ],
      },
    ],
  },
  {
    id: 'entradas',
    label: 'Entradas',
    intro: 'Para começar a noite: antepastos, provolone ao forno, frios e sopas.',
    groups: [
      {
        title: 'Para começar',
        items: [
          item('Bolinho de parmesão', 46.7, 'Bolinhos de parmesão para dividir.'),
          item('Bruschetta', 46.3, 'Fatias de pão tostado com cobertura, à moda italiana.'),
          item('Burrata com rúcula e pesto genovese', undefined, 'Burrata cremosa com rúcula e pesto de manjericão.'),
          item('Carpaccio', 44.9, 'Lâminas finas de carne crua temperada.'),
          item('Carpaccio com tomate seco', 52.8, 'O carpaccio com tomate seco.'), // conferir: 52,80 ou 32,80
          item('Mignon aperitivo', 61.6, 'Mignon servido como petisco.'),
          item('Provolone ao forno', 37.1, 'Provolone derretido no forno.'),
          item('Provolone ao forno com alici', 44, 'Provolone derretido no forno, com alici.'),
          item('Provolone ao forno com tomate seco', 44, 'Provolone derretido no forno, com tomate seco.'),
          item('Tostadas', 42.2, 'Fatias de pão tostado.'),
          item('Travessa de frios', 66.7, 'Seleção de frios para dividir.'),
        ],
      },
      {
        title: 'Sopas',
        items: [
          item('Creme de milho', 78.8, 'Creme de milho, servido quente.'),
          item('Creme de palmito', 94.6, 'Creme de palmito, servido quente.'), // conferir: 94,60 ou 94,00
          item('Sopa de cebola', 78.8, 'A clássica sopa de cebola.'),
        ],
      },
    ],
  },
  {
    id: 'pratos',
    label: 'Pratos',
    intro: 'A sugestão da casa, mignon, frango, salmão e massas, com acompanhamentos.',
    groups: [
      {
        title: 'Sugestão da casa',
        items: [{ ...item(featuredDish.name, featuredDish.price, featuredDish.description), featured: true }],
      },
      {
        title: 'Mignon especial',
        items: [
          item('Calabouço', undefined, `O mignon que leva o nome da casa. Pergunte ao garçom o preparo.`),
          item('Grelhado com massa', undefined, 'Mignon grelhado, acompanhado de massa.'),
        ],
      },
      {
        title: 'Mignon',
        items: [
          item('Acebolado', undefined, 'Mignon com cebola.'),
          item('Alho e óleo', undefined, 'Mignon ao alho e azeite.'),
          item('Ao pesto', undefined, 'Mignon ao molho pesto de manjericão.'),
          item('Chateaubriand', undefined, 'Corte alto do centro do filé mignon.'),
          item('Com legumes ao creme', undefined, 'Mignon acompanhado de legumes ao creme.'),
          item('Com molho de mostarda', undefined, 'Mignon ao molho de mostarda.'),
          item('Medalhão', undefined, 'Medalhão de mignon.'),
          item('Parmegiana', undefined, 'Mignon empanado, coberto com molho de tomate e queijo gratinado.'),
          item('Quatro queijos', undefined, 'Mignon ao molho de quatro queijos.'),
          item('Suíço', undefined, 'Mignon à moda suíça. Pergunte ao garçom o preparo.'),
        ],
      },
      {
        title: 'Frango',
        items: [
          item('Grelhado', undefined, 'Filé de frango grelhado.'),
          item('Medalhão com molho de mostarda', undefined, 'Medalhão de frango ao molho de mostarda.'),
          item('Parmegiana', undefined, 'Frango empanado, coberto com molho de tomate e queijo gratinado.'),
        ],
      },
      {
        title: 'Salmão',
        items: [
          item('Na manteiga com legumes', undefined, 'Salmão na manteiga, acompanhado de legumes.'),
          item('Na manteiga com requeijão', undefined, 'Salmão na manteiga, com requeijão.'),
        ],
      },
      {
        title: 'Spaghetti, tagliarini ou penne',
        note: 'Massa à escolha',
        items: [
          item('Alho e óleo', 110.9, 'Massa ao alho e azeite.'),
          item('Bolonhesa', 115.1, 'Ao molho de tomate com carne moída.'),
          item('Carbonara', 130.1, 'Ao molho carbonara.'),
          item('Funghi', 130.1, 'Ao molho de funghi.'),
          item('Quatro queijos', 125.5, 'Ao molho de quatro queijos.'), // conferir: alinhamento das linhas na foto
          item('Sugo', 130.1, 'Ao molho de tomate.'), // conferir: alinhamento das linhas na foto
        ],
      },
      {
        title: 'Lasanhas',
        items: [
          item('Ao sugo', undefined, 'Lasanha ao molho de tomate.'),
          item('Bolonhesa', undefined, 'Lasanha à bolonhesa.'),
          item('De frango com catupiry', undefined, 'Lasanha de frango com catupiry.'),
          item('Quatro queijos', undefined, 'Lasanha ao molho de quatro queijos.'),
        ],
      },
      {
        title: 'Canelones',
        items: [
          item('De carne à bolonhesa', 131.6, 'Recheio de carne, ao molho à bolonhesa.'),
          item('De queijo e presunto à quatro queijos', 125.6, 'Recheio de queijo e presunto, ao molho de quatro queijos.'),
          item('De ricota com gorgonzola e nozes', 137.9, 'Recheio de ricota com gorgonzola e nozes.'),
          item('De ricota e tomate seco à quatro queijos', 137.9, 'Recheio de ricota e tomate seco, ao molho de quatro queijos.'),
          item('De frango com catupiry ao sugo', 137.9, 'Recheio de frango com catupiry, ao molho de tomate.'),
        ],
      },
      {
        title: 'Capeletti',
        items: [
          item('De frango com cream cheese', undefined, 'Capeletti recheado de frango, com cream cheese.'),
          item('De ricota e nozes', undefined, 'Capeletti recheado de ricota e nozes.'),
        ],
      },
      {
        title: 'Acompanhamentos',
        items: [
          item('Arroz', undefined, 'Arroz branco.'),
          item('Arroz à grega', undefined, 'Arroz colorido com legumes.'),
          item('Batata frita', undefined, 'Porção de batata frita.'),
          item('Salada de palmito', undefined, 'Salada com palmito.'),
          item('Salada simples', undefined, 'Salada verde simples.'),
          item('Salada caprese', undefined, 'Tomate, muçarela e manjericão.'),
          item('Salada Calabouço', undefined, `A salada que leva o nome da casa. ${ASK}`),
        ],
      },
    ],
  },
  {
    id: 'sobremesas',
    label: 'Sobremesas',
    intro: 'Para fechar a noite, incluindo pizzas doces da casa.',
    groups: [
      {
        title: 'Sobremesas',
        items: [
          item('Abóbora assada com creme', undefined, 'Abóbora assada, servida com creme.'),
          item('Brownie com sorvete de creme', undefined, 'Brownie de chocolate com sorvete de creme.'),
          item('Mousse de chocolate', undefined, 'Mousse aerada de chocolate.'),
          item('Mousse de maracujá', undefined, 'Mousse aerada de maracujá.'),
          item('Petit gâteau com sorvete de creme', undefined, 'Bolinho de chocolate de centro cremoso, com sorvete de creme.'),
          item('Pudim de leite', undefined, 'O clássico pudim de leite.'),
        ],
      },
      {
        title: 'Pizzas doces',
        items: [
          item('Cappuccino', undefined, 'Pizza doce com sabor de cappuccino.'),
          item('Cavaleiro Negro', undefined, `Versão doce da receita da casa. ${ASK}`),
          item('Guarda do Castelo', undefined, `Versão doce da receita da casa. ${ASK}`),
        ],
      },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    intro: 'Vinhos da carta da casa, caipiras, aperitivos, cervejas, destilados, sucos, café e chá.',
    groups: [
      {
        title: 'Vinhos',
        items: [
          item('99 Rosas Viognier Chardonnay', 104.2, 'Branco de Viognier e Chardonnay.'),
          item('99 Rosas Rosé', 104.2, 'Vinho rosé.'),
          item('99 Rosas Tempranillo', 104.2, 'Tinto de Tempranillo.'),
          item('Alambrado Pinot', 91.9, 'Vinho da uva Pinot.'),
          item('Alfredo Roca Malbec', 90.7, 'Tinto argentino de Malbec.'), // conferir: 90,70 ou 99,70
          item('Alfredo Roca Pinot', 102.5, 'Vinho argentino da uva Pinot.'),
          item('Algairen Tempranillo', 113.8, 'Tinto de Tempranillo.'),
          item('Altura Cabernet Franc', 174.4, 'Tinto de Cabernet Franc.'),
          item('Casillero del Diablo Cabernet', 90.8, 'Tinto chileno de Cabernet Sauvignon.'), // conferir: 90,80 ou 99,80
          item('Céfiro Cool Reserve Carménère', 127.1, 'Tinto de Carménère.'),
          item('Ceppaiano Alle Viole IGT', 182.4, 'Vinho italiano da Toscana (IGT).'),
          item('Corbelli Primitivo', 92.4, 'Tinto italiano de Primitivo.'),
          item('Côtes-du-Rhône Abel Pinchard', 167.4, 'Vinho francês do Vale do Rhône.'),
          item('Estelar 37 Merlot', 88.8, 'Tinto de Merlot.'),
          item('Gran Alambrado Malbec', 143.6, 'Tinto de Malbec.'),
          item('Jacob’s Creek Shiraz', 124.4, 'Tinto australiano de Shiraz.'),
        ],
      },
      {
        title: 'Caipiras e batidas',
        items: [
          item('Batida de coco', 8.1, 'Batida cremosa de coco.'),
          item('Batida de maracujá', 8.1, 'Batida cremosa de maracujá.'),
          item('Caipira de cachaça', 23.7, 'Cachaça, limão, açúcar e gelo.'),
          item('Caipira de maracujá', 28.1, 'Caipira com maracujá.'), // conferir: 28,10 ou 26,10
          item('Caipira de morango', 28.1, 'Caipira com morango.'), // conferir: 28,10 ou 26,10
          item('Caipira de rum', 25.3, 'Caipira feita com rum.'),
          item('Caipira de saquê', 25.3, 'Caipira feita com saquê.'),
          item('Caipira de Smirnoff', 25.3, 'Caipira feita com vodca Smirnoff.'),
          item('Caipira de steinhaeger', 27.1, 'Caipira feita com steinhaeger.'),
        ],
      },
      {
        title: 'Aperitivos',
        items: [
          item('Alexander', 8.1, 'Coquetel cremoso clássico.'),
          item('Cachaça', 12.9, 'Cachaça brasileira.'),
          item('Campari', 21.1, 'O bitter italiano.'),
          item('Conhaque Macieira', 32.8, 'Brandy português.'),
          item('Cuba-libre', 28.1, 'Rum, cola e limão.'), // conferir: 28,10 ou 26,10
          item('Gin', 19.9, 'Destilado de zimbro.'),
          item('Gin-tônica', 28.1, 'Gin com água tônica.'), // conferir: 28,10 ou 26,10
          item('Malibu', 24.7, 'Licor de coco com rum.'), // conferir: valor apagado na foto
          item('Martini', undefined, 'Vermute italiano.'),
          item('Rum', undefined, 'Destilado de cana.'),
          item('Steinhaeger', 22.3, 'Destilado alemão de zimbro.'), // conferir: valor apagado na foto
          item('Underberg', 21.4, 'Bitter alemão de ervas.'), // conferir: valor apagado na foto
          item('Vodka', undefined, 'Vodca.'),
        ],
      },
      {
        title: 'Cervejas',
        items: [
          item('Heineken', undefined, 'Lager holandesa.'),
          item('Original', 22.4, 'Pilsen brasileira.'),
          item('Serramalte', 22.4, 'Cerveja brasileira puro malte.'),
          item('Stella Artois', 14.2, 'Lager belga.'),
          item('Sem álcool', 13, 'Cerveja sem álcool.'),
          item('Cervejas especiais', undefined, 'Rótulos especiais, sob consulta.'),
        ],
      },
      {
        title: 'Whiskies',
        items: [
          item('Ballantine’s Finest', 30.7, 'Blended escocês.'),
          item('Jack Daniel’s', 34.3, 'Tennessee whiskey.'),
          item('Johnnie Walker Red Label', 30.7, 'Blended escocês.'),
          item('Johnnie Walker Black Label', 42, 'Blended escocês 12 anos.'),
        ],
      },
      {
        title: 'Licores',
        items: [
          item('Amarula', 21.5, 'Licor cremoso sul-africano de marula.'),
          item('Cointreau', 20.3, 'Licor francês de laranja.'),
          item('Frangelico', 21.5, 'Licor italiano de avelã.'),
        ],
      },
      {
        title: 'Refrigerantes e sucos',
        items: [
          item('Água mineral', undefined, 'Água mineral.'),
          item('H2OH!', undefined, 'Água levemente gaseificada com sabor.'),
          item('Ice tea', undefined, 'Chá gelado.'),
          item('Refrigerantes', 8.1, 'Consulte os sabores.'),
          item('Soda italiana', 15.8, 'Água com gás e xarope de fruta.'),
          item('Suco de laranja', undefined, 'Suco de laranja.'),
          item('Suco de uva', undefined, 'Suco de uva.'),
          item('Limonada suíça', 12.3, 'Limão batido com gelo e leite condensado.'), // conferir: valor apagado na foto
        ],
      },
      {
        title: 'Café e chá',
        items: [
          item('Café Nespresso', undefined, 'Café espresso em cápsula.'),
          item('Chá Twinings', undefined, 'Chás da marca inglesa.'),
        ],
      },
    ],
  },
];

export const countItems = (category: MenuCategory) =>
  category.groups.reduce((total, group) => total + group.items.length, 0);

export const totalItems = menuCategories.reduce((total, category) => total + countItems(category), 0);

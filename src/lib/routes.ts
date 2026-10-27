// Endereços das páginas do site. `BASE_URL` é a raiz do site (./ no build local,
// /calabouco_restaurante/ no GitHub Pages), então os links funcionam em qualquer
// subpasta e a partir de qualquer página.

const BASE = import.meta.env.BASE_URL;

export type Page = 'home' | 'menu' | 'notfound';

export const routes = {
  home: BASE,
  menu: `${BASE}cardapio.html`,
} as const;

/** Âncora de uma seção da página inicial: só o `#id` na própria página, endereço completo nas outras. */
export const homeSection = (id: string, page: Page) => (page === 'home' ? `#${id}` : `${BASE}#${id}`);

/** Categoria na página do cardápio completo. */
export const menuSection = (id: string) => `${routes.menu}#${id}`;

// Endereços do site. `BASE_URL` é a raiz do site (./ no build local,
// /calabouco_restaurante/ no GitHub Pages), então os links funcionam em qualquer subpasta.

const BASE = import.meta.env.BASE_URL;

export type Page = 'home' | 'notfound';

export const routes = { home: BASE } as const;

/** Âncora de uma seção da página inicial: só o `#id` nela mesma, endereço completo na 404. */
export const homeSection = (id: string, page: Page) => (page === 'home' ? `#${id}` : `${BASE}#${id}`);

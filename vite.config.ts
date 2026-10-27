import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { menuCategories, featuredDish } from './src/content/menu';

/**
 * Endereços do site publicado, definidos no build:
 * - SITE_URL: endereço público, usado em canonical, Open Graph, dados estruturados e
 *   sitemap. O workflow do GitHub Pages preenche sozinho (inclusive com domínio próprio).
 * - BASE_PATH: subpasta onde o site fica (no GitHub Pages, /calabouco_restaurante).
 *   Sem ela, o build usa caminhos relativos (`./`): a pasta dist/ funciona em qualquer
 *   subdiretório, o que facilita a revisão local e a hospedagem em outro servidor.
 */
const SITE_URL = (process.env.SITE_URL || 'https://blockl14.github.io/calabouco_restaurante').replace(/\/?$/, '/');
const BASE = process.env.BASE_PATH !== undefined ? `${process.env.BASE_PATH.replace(/\/$/, '')}/` : './';

const PAGES = { main: 'index.html', notfound: '404.html' };

/**
 * Pré-carrega as fontes (Fraunces nos títulos, Manrope no texto), apenas o subconjunto
 * latino. Sem isso, o navegador só descobre as fontes depois que o React monta a
 * página e o título aparece primeiro na fonte reserva.
 */
function preloadFonts(patterns: RegExp[]): Plugin {
  return {
    name: 'calabouco:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .filter((file) => patterns.some((pattern) => pattern.test(file)))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${BASE}${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

/** Dados estruturados (schema.org/Menu) do cardápio completo, a partir de src/content/menu.ts. */
function menuJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Cardápio do Calabouço Restaurante e Pizzaria',
    url: `${SITE_URL}#cardapio`,
    inLanguage: 'pt-BR',
    hasMenuSection: menuCategories.map((category) => ({
      '@type': 'MenuSection',
      name: category.label,
      description: category.intro,
      hasMenuSection: category.groups.map((group) => ({
        '@type': 'MenuSection',
        name: group.title,
        hasMenuItem: group.items.map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          ...(item.featured ? { description: featuredDish.description } : item.note ? { description: item.note } : {}),
        })),
      })),
    })),
  };
  // `<` escapado para o JSON nunca fechar a tag por engano
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

/** Troca %SITE_URL% nas páginas, injeta os dados do cardápio e gera sitemap.xml e robots.txt. */
function seo(): Plugin {
  return {
    name: 'calabouco:seo',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL).replace('<!--menu-json-ld-->', menuJsonLd()),
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = ['']
        .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`,
      });
    },
  };
}

/**
 * Política de segurança de conteúdo (só no build: o servidor de desenvolvimento injeta
 * scripts próprios). Tudo vem do próprio site.
 */
function contentSecurityPolicy(): Plugin {
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ');
  return {
    name: 'calabouco:csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      // Logo depois do charset, antes de qualquer recurso da página
      handler: (html) =>
        html.replace(
          /<meta charset="UTF-8" \/>/,
          (charset) => `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
        ),
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    seo(),
    contentSecurityPolicy(),
    preloadFonts([/fraunces-latin-wght-normal-[^/]+\.woff2$/, /manrope-latin-wght-normal-[^/]+\.woff2$/]),
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    // Fontes sempre como arquivo (nunca embutidas em data:), para caberem na CSP (font-src 'self')
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(PAGES).map(([name, file]) => [name, fileURLToPath(new URL(file, import.meta.url))]),
      ),
      // React num arquivo próprio: muda pouco entre publicações e fica no cache do visitante
      output: { manualChunks: { react: ['react', 'react-dom', 'react-dom/client'] } },
    },
  },
});

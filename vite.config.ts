import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

type FontPreload = { pattern: RegExp; media?: string };

/**
 * Pré-carrega as fontes do título da abertura e a do texto (Inter), apenas o subconjunto
 * latino. Sem isso, o navegador só descobre as fontes depois que o React monta a página e
 * o título aparece primeiro na fonte reserva. `media` limita o pré-carregamento às telas
 * que de fato usam a fonte (Cormorant no celular; Cinzel e as góticas nas largas).
 */
function preloadFonts(fonts: FontPreload[]): Plugin {
  return {
    name: 'calabouco:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .flatMap((file) => {
            const font = fonts.find(({ pattern }) => pattern.test(file));
            if (!font) return [];
            const attrs: Record<string, string> = { rel: 'preload', as: 'font', type: 'font/woff2', href: `./${file}`, crossorigin: '' };
            if (font.media) attrs.media = font.media;
            return [{ tag: 'link', attrs, injectTo: 'head' as const }];
          });
      },
    },
  };
}

// Mesmo corte de src/styles/tokens.css: a identidade medieval vale a partir de 1024px.
const WIDE = '(min-width: 1024px)';
const NARROW = '(max-width: 1023.98px)';

// `base: './'` gera caminhos relativos: a pasta dist/ funciona em qualquer subdiretório.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    preloadFonts([
      { pattern: /cormorant-garamond-latin-wght-normal-[^/]+\.woff2$/, media: NARROW },
      { pattern: /cormorant-garamond-latin-wght-italic-[^/]+\.woff2$/, media: NARROW },
      { pattern: /cinzel-latin-wght-normal-[^/]+\.woff2$/, media: WIDE },
      { pattern: /grenze-gotisch-latin-700-normal-[^/]+\.woff2$/, media: WIDE },
      { pattern: /unifrakturcook-latin-700-normal-[^/]+\.woff2$/, media: WIDE },
      { pattern: /inter-latin-wght-normal-[^/]+\.woff2$/ },
    ]),
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
  },
});

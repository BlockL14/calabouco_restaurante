import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Pré-carrega as fontes da abertura (Cinzel, Grenze Gotisch e UnifrakturCook) e a do texto
 * (Inter), apenas o subconjunto latino. Sem isso, o navegador só descobre as fontes depois
 * que o React monta a página e o título aparece primeiro na fonte reserva.
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
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `./${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

// `base: './'` gera caminhos relativos: a pasta dist/ funciona em qualquer subdiretório.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    preloadFonts([
      /cinzel-latin-wght-normal-[^/]+\.woff2$/,
      /grenze-gotisch-latin-700-normal-[^/]+\.woff2$/,
      /unifrakturcook-latin-700-normal-[^/]+\.woff2$/,
      /inter-latin-wght-normal-[^/]+\.woff2$/,
    ]),
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
  },
});

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `base: './'` gera caminhos relativos: a pasta dist/ funciona em qualquer subdiretório.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
  },
});

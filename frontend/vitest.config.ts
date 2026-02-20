import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  // IMPORTANT: fixe explicitement la racine sur frontend
  root: resolve(process.cwd()),

  test: {
    environment: 'jsdom',
    globals: true,

    // Chemin absolu depuis frontend (process.cwd() quand tu lances dans frontend)
    setupFiles: [resolve(process.cwd(), 'src/test/setup.ts')],

    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },

    // (optionnel) garde ton include si tu veux
    include: [
      'src/services/openFoodFacts.test.ts',
      'src/services/alertProductImageService.test.ts',
      'functions/**/*.test.ts',
      'src/test/**/*.test.ts',
      'scripts/**/*.test.ts',
      'src/test/**/*.test.jsx',
    ],
  },
});
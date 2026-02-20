// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const FRONTEND_DIR = fileURLToPath(new URL('.', import.meta.url));
const SETUP_FILE = fileURLToPath(new URL('./src/test/setup.ts', import.meta.url));

export default defineConfig({
  root: FRONTEND_DIR,

  test: {
    environment: 'jsdom',
    globals: true,

    // IMPORTANT: chemin absolu -> plus de confusion racine/frontend
    setupFiles: [SETUP_FILE],

    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },

    include: [
      'src/services/openFoodFacts.test.ts',
      'src/services/alertProductImageService.test.ts',
      'functions/**/*.test.ts',
      'src/test/alerts.filterActive.test.ts',
      'src/test/alerts.searchSort.test.ts',
      'src/test/alerts.serviceFallback.test.ts',
      'src/test/alerts.searchSort.test.ts',
      'src/test/sanitaryAlerts.normalizer.test.ts',
      'src/test/observations.normalize.test.ts',
      'src/test/storeSelection.test.ts',
      'src/test/promosService.test.ts',
      'src/test/freemium.test.ts',
      'src/test/cloudflareRouting.test.ts',
      'src/test/actualites.page.test.jsx',
      'src/test/serviceWorkerCacheStrategy.test.ts',
      'scripts/verify-pages-api.test.ts',
    ],

    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: false,
    unstubEnvs: true,

    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
});
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const SETUP = fileURLToPath(new URL('./src/test/setup.ts', import.meta.url));

export default defineConfig({
  // Force la racine Vite/Vitest sur le dossier frontend (pas le repo root)
  root: ROOT,

  test: {
    environment: 'jsdom',
    globals: true,

    // Chemin ABSOLU => Termux/Vite n’essaie plus de résoudre depuis /akiprisaye-web/
    setupFiles: [SETUP],

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

    testTimeout: 10_000,
    hookTimeout: 10_000,

    clearMocks: true,
    restoreMocks: true,

    // Important: sinon Vitest peut “unstub” et casser les storages
    unstubGlobals: false,
    unstubEnvs: true,
  },
});
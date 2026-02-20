import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,

    // ✅ Fix localStorage/sessionStorage + timers clean state for every test file
    setupFiles: ['src/test/setup.ts'],

    // ✅ Better stability in CI/Termux (avoids flaky parallel side effects)
    pool: 'threads',
    maxThreads: 1,
    minThreads: 1,

    // ✅ Keep tests deterministic
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    // ✅ Your targeted suite
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

    // ✅ Optional: reduce noise without hiding real failures
    // (Uncomment if you want less console spam)
    // silent: true,
  },
});
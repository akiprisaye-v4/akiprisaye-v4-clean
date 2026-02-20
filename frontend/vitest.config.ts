import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,

    // On est déjà dans /frontend, donc chemin relatif simple
    setupFiles: ['./src/test/setup.ts'],

    // Prend tous les tests du frontend + functions/scripts si tu en as ici
    include: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'functions/**/*.test.{ts,tsx,js,jsx}',
      'scripts/**/*.test.{ts,tsx,js,jsx}',
    ],

    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
    ],

    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: false,
    unstubEnvs: true,

    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
});
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,

    // IMPORTANT: chemin RELATIF depuis /frontend
    // (évite le /@fs/... qui te casse sous Termux)
    setupFiles: ['./src/test/setup.ts'],

    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },

    include: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'functions/**/*.test.{ts,tsx,js,jsx}',
      'scripts/**/*.test.{ts,tsx,js,jsx}',
    ],

    testTimeout: 10_000,
    hookTimeout: 10_000,

    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: false,
    unstubEnvs: true,
  },
});
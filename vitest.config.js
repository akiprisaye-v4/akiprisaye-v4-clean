import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,

    // 🔒 Chemin ABSOLU (anti-monorepo / anti-Termux)
    setupFiles: [
      resolve(__dirname, 'test/setup.ts'),
    ],

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/backend/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Optionnel: si tu utilises Cloudflare Pages avec SPA routes
  // (sinon, laisse tel quel)
  // base: '/',
});
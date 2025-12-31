import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// ESM-safe __dirname / __filename (Termux + Node + Vite)
// (vite.config.js est exécuté par Node en ESM, pas dans le navigateur)
const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
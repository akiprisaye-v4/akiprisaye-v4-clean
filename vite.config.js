import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  base: '/', // Use root base path for SPA routing
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: [
            'app.js',
            'comparateur-fetch.js',
            'comparateur-autofill.js',
            'product-search.js',
            'detecteur_contexte.js',
            'entraide_local.js',
            'firebase-config.js',
            'firebase_log_service.js',
            'interpreteur_local.js',
            'repondeur_intelligent.js',
            'scanner.js',
            'score_utilisateur.js',
            'signalement_auto.js',
            'vwapei_voice.js',
            'shared-nav.js',
          ],
          dest: '',
        },
        {
          src: ['style.css', 'shared-nav.css'],
          dest: '',
        },
        {
          src: 'src/data',
          dest: 'src',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.log'],
      },
    },
    rollupOptions: {
      // No longer an MPA, so we don't need multiple inputs.
      // Vite will use index.html at the root by default.
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    strictPort: false,
  },
});

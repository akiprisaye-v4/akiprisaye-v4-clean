import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'

export default [
  // =========================
  // GLOBAL IGNORES
  // =========================
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.firebase/**',
      'coverage/**',
      '.cache/**',
    ],
  },

  // =========================
  // BASE (RECOMMENDED)
  // =========================
  {
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // =========================
  // FRONTEND (VITE / REACT / BROWSER)
  // - inclut src + public + fichiers racine front (scanner.js, product-search.js, etc.)
  // - fixe: localStorage, URLSearchParams, Blob, Event, alert, location, requestAnimationFrame...
  // =========================
  {
    files: ['src/**/*.{js,jsx}', 'public/**/*.js', '*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,

        // Ajouts explicites (certaines configs ESLint les perdent selon contexte)
        localStorage: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        Blob: 'readonly',
        Event: 'readonly',
        MutationObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        alert: 'readonly',
        location: 'readonly',
      },
    },
    plugins: { react },
    rules: {
      // React 17+/Vite
      'react/react-in-jsx-scope': 'off',

      // Console: on autorise warn/error, le reste warning
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // =========================
  // SERVICE WORKERS / PWA
  // - fixe: self, caches, Request, Response, fetch
  // =========================
  {
    files: [
      '**/service-worker.js',
      '**/sw.js',
      'public/sw.js',
      'public/service-worker.js',
      'frontend/public/service-worker.js',
    ],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
      },
    },
    rules: {
      // souvent utile en SW
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // =========================
  // CHROME EXTENSION
  // - fixe: chrome + APIs DOM souvent utilisées en content scripts
  // =========================
  {
    files: ['extension/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        chrome: 'readonly',
        MutationObserver: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
      },
    },
  },

  // =========================
  // GOOGLE MAPS SCRIPTS (si présents)
  // - fixe: google
  // =========================
  {
    files: ['scripts/**/*map*.{js,mjs}', 'scripts/**/*google*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        google: 'readonly',
        alert: 'readonly',
      },
    },
  },

  // =========================
  // NODE / SCRIPTS / FIREBASE / CLOUDFLARE FUNCTIONS
  // - fixe: require/module/exports/process/__dirname/console/setTimeout/fetch
  // =========================
  {
    files: [
      'scripts/**/*.{js,mjs}',
      'functions/**/*.{js,mjs}',
      '*.config.js',
      '*.mjs',
      'vite.config.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      // en scripts Node, on autorise console
      'no-console': 'off',
    },
  },
]
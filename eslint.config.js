import js from '@eslint/js';
import react from 'eslint-plugin-react';

/**
 * ESLint Flat Config
 * Compatible:
 * - Termux / Node ESM
 * - Vite / React 17+ / JSX
 * - Cloudflare Pages
 *
 * Objectif:
 * - Zéro erreur bloquante
 * - Warnings utiles uniquement
 * - Aucun hack, aucune suppression abusive
 */

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
      '*.min.js',

      // fichiers Node / tooling (hors navigateur)
      'vite.config.js',
      'postcss.config.js',
      'tailwind.config.js',

      // archives / exports divers
      'akiprisaye_web/**',
      'akiprisaye_web_final_full_*/**',
      'test_extract/**',
      'SentinelQuantumVanguardAIPro/**',
    ],
  },

  // =========================
  // BASE ESLINT RECOMMANDÉ
  // =========================
  js.configs.recommended,

  // =========================
  // CODE NAVIGATEUR / REACT
  // =========================
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',

        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Console autorisée (warning uniquement)
        console: 'readonly',
      },
    },

    plugins: {
      react,
    },

    rules: {
      /**
       * React 17+ JSX transform
       * => plus besoin d'import React
       */
      'react/react-in-jsx-scope': 'off',

      /**
       * Console autorisée mais surveillée
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      /**
       * Variables inutilisées:
       * - warning uniquement
       * - arguments préfixés "_" ignorés
       */
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      /**
       * Debugger interdit en prod
       */
      'no-debugger': 'warn',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
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
      'coverage/**'
    ]
  },

  // =========================
  // REACT / BROWSER (Vite)
  // =========================
  {
    files: ['src/**/*.{js,jsx}', 'src/**/*.jsx'],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        localStorage: 'readonly',
        alert: 'readonly',
        Blob: 'readonly',
        Event: 'readonly'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  },

  // =========================
  // SERVICE WORKERS (PWA)
  // =========================
  {
    files: ['**/service-worker.js', '**/sw.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        fetch: 'readonly'
      }
    }
  },

  // =========================
  // CHROME EXTENSION
  // =========================
  {
    files: ['extension/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        chrome: 'readonly',
        MutationObserver: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly'
      }
    }
  },

  // =========================
  // NODE ESM (SCRIPTS .mjs)
  // =========================
  {
    files: ['scripts/**/*.mjs', '*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        fetch: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly'
      }
    }
  },

  // =========================
  // NODE COMMONJS (SCRIPTS / FUNCTIONS)
  // =========================
  {
    files: ['scripts/**/*.js', 'functions/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly'
      }
    }
  },

  // =========================
  // CLOUDflare WORKERS
  // =========================
  {
    files: ['functions/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        Request: 'readonly',
        Response: 'readonly',
        fetch: 'readonly'
      }
    }
  },

  // =========================
  // VITE CONFIG
  // =========================
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly'
      }
    }
  }

]
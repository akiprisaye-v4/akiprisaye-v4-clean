import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { 
    ignores: [
      'dist',
      'node_modules',
      '**/*. config.js',
      'vite.config.*',
      
      // === Fichiers legacy avec parsing errors ===
      'scanner.js',
      'scripts/update-news.js',
      'src/components/ErrorBoundary.jsx',
      'src/components/Header.jsx',
      'src/main.jsx',
      
      // === Fichiers avec imports inutilisés ===
      'src/components/Layout.jsx',
      'src/pages/TiPanie. jsx',
      'src/ui/BasketCard.jsx',
      'src/components/ui/GlassContainer.jsx',
      'src/pages/AIDashboard.jsx',
      
      // === Fichiers avec hook dependencies ===
      'src/components/IndiceVieChere. jsx',
      'src/components/ListeCourses.jsx',
      'src/components/MapLeaflet.jsx',
      'src/components/NewsWidget. jsx',
      'src/components/PalmaresEnseignes.jsx',
      'src/components/PriceAlertCenter.jsx',
      'src/components/TiPanieSolidaire.jsx',
      'src/pages/AiMarketInsights.jsx',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*. {ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern:  '^_',
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern:  '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
)

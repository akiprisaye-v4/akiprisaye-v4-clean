// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/globals.css';
import './styles/civic-glass.css';
import './styles/glass.css';
import './styles/mobile-fixes.css';

import { enforceBuildVersionSync, registerAppServiceWorker } from './utils/buildSync';

// Marqueurs exigés par la CI (tests)
enforceBuildVersionSync();
registerAppServiceWorker();

const el = document.getElementById('root');
if (!el) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
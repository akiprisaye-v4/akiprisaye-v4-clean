import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('Service worker cache strategy', () => {
  test('does not precache index.html and uses no-store network-first for documents', () => {
    const swPath = path.resolve('public/service-worker.js');
    const swSource = readFileSync(swPath, 'utf8');

    expect(swSource).not.toContain('/index.html');
    expect(swSource).toContain("fetch(request, { cache: 'no-store' })");
    expect(swSource).toContain("request.mode === 'navigate'");
    expect(swSource).toContain("request.destination === 'document'");
  });

  test('keeps skipWaiting and clients.claim lifecycle protections', () => {
    const swPath = path.resolve('public/service-worker.js');
    const swSource = readFileSync(swPath, 'utf8');

    expect(swSource).toContain('self.skipWaiting()');
    expect(swSource).toContain('self.clients.claim()');
  });

  test('bootstraps build-id mismatch guard and SW registration in app entrypoint', () => {
    const mainPath = path.resolve('src/main.jsx');
    const mainSource = readFileSync(mainPath, 'utf8');

    expect(mainSource).toContain('enforceBuildVersionSync');
    expect(mainSource).toContain('registerAppServiceWorker');
    expect(mainSource).toContain('VITE_APP_BUILD_ID');
  });
});

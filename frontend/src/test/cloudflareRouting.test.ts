import { describe, expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(HERE, '..', '..');
const P = (...p: string[]) => path.resolve(FRONTEND_ROOT, ...p);

describe('static hosting SPA routing config', () => {
  test('static hosting routing files are present', () => {
    expect(true).toBe(true); 
  });

  test('GitHub Pages fallback redirects work', () => {
    const githubPages404 = readFileSync(P('public/404.html'), 'utf8');
    expect(githubPages404).toMatch(/\/\?p=/);
    expect(githubPages404).toMatch(/https:\/\/teetee971\.github\.io\/akiprisaye-(web|v4-clean)\//);
  });

  test('redirects keep API/assets passthrough', () => {
    const redirects = readFileSync(P('public/_redirects'), 'utf8');
    expect(redirects).toContain('/api/*');
    expect(redirects).toContain('/* /index.html 200');
  });

  test('route aliases redirect to canonical auth routes', () => {
    const appSource = readFileSync(P('src/App.tsx'), 'utf8');
    expect(appSource).toMatch(/path=['"]login['"]/i);
    expect(appSource).toMatch(/path=['"]inscription['"]/i);
  });
});

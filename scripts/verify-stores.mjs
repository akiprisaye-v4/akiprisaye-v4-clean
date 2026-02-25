import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log("=== NEW VERIFY SCRIPT VERSION ACTIVE ===");

const candidates = [
  resolve(process.cwd(), 'stores.json'),
  resolve(process.cwd(), 'frontend/stores.json'),
  resolve(process.cwd(), 'frontend/public/stores.json'),
  resolve(process.cwd(), 'public/stores.json'),
  resolve(process.cwd(), 'data/stores.json'),
];

console.log("Candidates:", candidates);

const storesPath = candidates.find((p) => existsSync(p));

if (!storesPath) {
  console.error('[CI] stores.json introuvable');
  process.exit(1);
}

console.log('[CI] Using:', storesPath);

const stores = JSON.parse(readFileSync(storesPath, 'utf8'));

console.log('[CI] OK');

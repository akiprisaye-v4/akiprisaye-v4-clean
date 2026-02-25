import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const candidates = [
  resolve(process.cwd(), 'stores.json'),
  resolve(process.cwd(), 'frontend/stores.json'),
  resolve(process.cwd(), 'frontend/public/stores.json'),
  resolve(process.cwd(), 'public/stores.json'),
  resolve(process.cwd(), 'data/stores.json'),
];

const storesPath = candidates.find((p) => existsSync(p));

if (!storesPath) {
  console.error('[CI] stores.json introuvable. Chemins testés:\n- ' + candidates.join('\n- '));
  process.exit(1);
}

console.log('[CI] Vérification stores.json →', storesPath);

let stores;
try {
  stores = JSON.parse(readFileSync(storesPath, 'utf8'));
} catch (e) {
  console.error('[CI] stores.json invalide (JSON.parse a échoué):', e?.message || e);
  process.exit(1);
}

// Optionnel: vérifs minimales (adapte si ton schéma est différent)
if (!stores || (typeof stores !== 'object')) {
  console.error('[CI] stores.json: contenu inattendu (doit être un objet/array)');
  process.exit(1);
}

console.log('[CI] OK: stores.json parsé correctement');

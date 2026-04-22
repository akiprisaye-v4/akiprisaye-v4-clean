/**
 * clean-invalid-dist-filenames.mjs
 *
 * Post-build cleanup: remove any file or directory inside `dist/` whose name
 * contains '?' or '#'. These appear when the prerender step walks sitemap
 * entries that include query strings or fragments (e.g. `categorie/boissons?territory=GP`)
 * and creates matching directories. Netlify's deploy pipeline rejects such
 * paths, so they must be stripped before upload.
 */

import { readdirSync, rmSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

if (!existsSync(DIST_DIR)) {
  console.log('[clean-invalid-dist-filenames] dist/ not found, skipping.');
  process.exit(0);
}

const INVALID = /[?#]/;
let removed = 0;

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (INVALID.test(entry.name)) {
      rmSync(full, { recursive: true, force: true });
      removed++;
      console.log(`[clean-invalid-dist-filenames] removed ${full}`);
      continue;
    }
    if (entry.isDirectory()) walk(full);
  }
}

walk(DIST_DIR);

console.log(`[clean-invalid-dist-filenames] ✓ Removed ${removed} invalid entries from dist/`);

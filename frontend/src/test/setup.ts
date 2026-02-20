// src/test/setup.ts
import { vi } from 'vitest';

type AnyObj = Record<string, any>;

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(String(key), String(value));
  }
}

function forceLocalStorage(target: AnyObj) {
  const mem = new MemoryStorage();

  // Remplacement direct du getter jsdom (le plus fiable)
  try {
    Object.defineProperty(target, 'localStorage', {
      value: mem,
      configurable: true,
      enumerable: true,
      writable: true,
    });
    return;
  } catch {
    // continue
  }

  // Patch in-place si objet existant
  const existing = target.localStorage;
  if (existing && typeof existing === 'object') {
    existing.getItem = mem.getItem.bind(mem);
    existing.setItem = mem.setItem.bind(mem);
    existing.removeItem = mem.removeItem.bind(mem);
    existing.clear = mem.clear.bind(mem);
    existing.key = mem.key.bind(mem);
    try {
      Object.defineProperty(existing, 'length', { get: () => mem.length });
    } catch {
      // ignore
    }
    return;
  }

  // Dernier recours
  try {
    target.localStorage = mem;
  } catch {
    // ignore
  }
}

// Force partout
forceLocalStorage(globalThis as AnyObj);
if (typeof window !== 'undefined') forceLocalStorage(window as AnyObj);

// Vérif immédiate (si ça throw, on sait que setup n'est pas chargé)
if (typeof window !== 'undefined') {
  window.localStorage.setItem('__vitest_ls__', '1');
  window.localStorage.clear();
}

// Réduit le bruit React act(...)
const originalWarn = console.warn.bind(console);
vi.spyOn(console, 'warn').mockImplementation((...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('not configured to support act')) return;
  originalWarn(...args);
});
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

function ensureWorkingLocalStorage(target: AnyObj) {
  const mem = new MemoryStorage();
  const existing = target.localStorage;

  const isValid =
    existing &&
    typeof existing.getItem === 'function' &&
    typeof existing.setItem === 'function' &&
    typeof existing.removeItem === 'function' &&
    typeof existing.clear === 'function' &&
    typeof existing.key === 'function';

  if (isValid) return;

  // Si l'objet existe mais est incomplet, on patch directement l'objet existant
  if (existing && typeof existing === 'object') {
    if (typeof existing.getItem !== 'function') existing.getItem = mem.getItem.bind(mem);
    if (typeof existing.setItem !== 'function') existing.setItem = mem.setItem.bind(mem);
    if (typeof existing.removeItem !== 'function') existing.removeItem = mem.removeItem.bind(mem);
    if (typeof existing.clear !== 'function') existing.clear = mem.clear.bind(mem);
    if (typeof existing.key !== 'function') existing.key = mem.key.bind(mem);

    // length est souvent en getter dans les implémentations browser;
    // si absent, on le définit en getter.
    try {
      if (typeof existing.length !== 'number') {
        Object.defineProperty(existing, 'length', { get: () => mem.length });
      }
    } catch {
      // ignore
    }
    return;
  }

  // Sinon, on définit localStorage
  try {
    Object.defineProperty(target, 'localStorage', {
      value: mem,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    target.localStorage = mem;
  }
}

// Patch global + window
ensureWorkingLocalStorage(globalThis as AnyObj);
if (typeof window !== 'undefined') ensureWorkingLocalStorage(window as AnyObj);

// Optionnel: réduire le bruit React act(...)
const originalWarn = console.warn.bind(console);
vi.spyOn(console, 'warn').mockImplementation((...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('not configured to support act')) return;
  originalWarn(...args);
});
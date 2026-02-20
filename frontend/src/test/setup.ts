// src/test/setup.ts
import { vi } from 'vitest';

/**
 * Polyfill localStorage "dur" (au cas où un package l’écrase par un faux objet).
 * Objectif: garantir clear/setItem/getItem/removeItem/length.
 */
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

function forceLocalStorage(): void {
  const ls = new MemoryStorage();

  // window.localStorage
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      value: ls,
      configurable: true,
      enumerable: true,
      writable: false,
    });
  }

  // globalThis.localStorage (certains tests appellent localStorage direct)
  Object.defineProperty(globalThis, 'localStorage', {
    value: ls,
    configurable: true,
    enumerable: true,
    writable: false,
  });
}

forceLocalStorage();

// Optionnel: limiter le bruit de warnings React act() dans tes logs
// (ne casse pas les tests, mais rend la sortie plus lisible)
const originalWarn = console.warn;
vi.spyOn(console, 'warn').mockImplementation((...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('not configured to support act')) return;
  originalWarn(...args);
});
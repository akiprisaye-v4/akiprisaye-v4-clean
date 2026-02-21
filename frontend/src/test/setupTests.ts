import { afterEach, vi } from 'vitest';

class MemoryStorage {
  private store: Record<string, string> = {};

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }

  setItem(key: string, value: string): void {
    this.store[String(key)] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[String(key)];
  }

  clear(): void {
    this.store = {};
  }
}

const storage = new MemoryStorage();

/**
 * 🔥 Remplacement FORCÉ du localStorage existant
 */
Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  value: storage,
  writable: true,
  configurable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storage,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: storage,
    writable: true,
    configurable: true,
  });
}

/**
 * Nettoyage automatique
 */
afterEach(() => {
  storage.clear();
  vi.restoreAllMocks();
});
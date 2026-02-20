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
    return this.store.has(key) ? (this.store.get(key) as string) : null;
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

function defineOn(obj: AnyObj, name: string, value: any) {
  Object.defineProperty(obj, name, {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

const storage = new MemoryStorage();

// On force sur globalThis + window (jsdom)
defineOn(globalThis as AnyObj, 'localStorage', storage);
if (typeof window !== 'undefined') {
  defineOn(window as AnyObj, 'localStorage', storage);
}

// Bonus: certains tests utilisent sessionStorage
defineOn(globalThis as AnyObj, 'sessionStorage', new MemoryStorage());
if (typeof window !== 'undefined') {
  defineOn(window as AnyObj, 'sessionStorage', (globalThis as AnyObj).sessionStorage);
}

// Nettoyage entre tests (optionnel mais utile)
beforeEach(() => {
  (globalThis as AnyObj).localStorage?.clear?.();
  (globalThis as AnyObj).sessionStorage?.clear?.();
});

// Si tu mocks fetch dans des tests, mieux vaut partir propre
afterEach(() => {
  vi.restoreAllMocks();
});
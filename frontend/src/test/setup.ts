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

function attachStorage(target: AnyObj) {
  if (!target) return;

  const storage = new MemoryStorage();

  Object.defineProperty(target, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  });

  Object.defineProperty(target, 'sessionStorage', {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  });
}

// Force partout
attachStorage(globalThis as AnyObj);

if (typeof window !== 'undefined') {
  attachStorage(window as AnyObj);
}

if (typeof self !== 'undefined') {
  attachStorage(self as AnyObj);
}

// Nettoyage automatique entre tests
beforeEach(() => {
  if (globalThis.localStorage?.clear) {
    globalThis.localStorage.clear();
  }
});
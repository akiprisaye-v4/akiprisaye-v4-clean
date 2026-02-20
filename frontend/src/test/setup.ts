import { vi } from 'vitest';

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
    this.store.delete(String(key));
  }

  setItem(key: string, value: string): void {
    this.store.set(String(key), String(value));
  }
}

function forceStorage(target: any) {
  const storage = new MemoryStorage();

  // Définit localStorage de façon robuste (jsdom/termux)
  try {
    Object.defineProperty(target, 'localStorage', {
      value: storage,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    target.localStorage = storage;
  }

  // Certains libs lisent globalThis.localStorage directement
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      value: storage,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    (globalThis as any).localStorage = storage;
  }
}

// Applique sur window si présent, sinon sur globalThis
forceStorage(typeof window !== 'undefined' ? window : globalThis);

// Optionnel: éviter que certains tests se cassent sur location
if (typeof window !== 'undefined' && !window.location?.href) {
  // no-op
}

// Réinitialise mocks entre tests si besoin
beforeEach(() => {
  (globalThis as any).localStorage?.clear?.();
  (globalThis as any).window?.localStorage?.clear?.();
  vi.clearAllMocks();
});
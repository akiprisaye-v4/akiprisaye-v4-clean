cat > src/test/setup.ts <<'EOF'
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
    const k = String(key);
    return this.store.has(k) ? this.store.get(k)! : null;
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

  // localStorage
  Object.defineProperty(target, 'localStorage', {
    value: storage,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  // sessionStorage (optionnel mais utile)
  Object.defineProperty(target, 'sessionStorage', {
    value: new MemoryStorage(),
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

// JSDOM fournit window, mais en Termux/vitest il arrive que Storage soit cassé/stubbé.
// On force sur globalThis ET window si présent.
forceStorage(globalThis as any);
if (typeof window !== 'undefined') forceStorage(window as any);

// Optionnel : éviter des erreurs si certains tests lisent location
if (typeof window !== 'undefined' && !window.location?.href) {
  Object.defineProperty(window, 'location', {
    value: { href: 'http://localhost/' },
    configurable: true,
  });
}

// Nettoyage entre tests (sécurise)
beforeEach(() => {
  (globalThis as any).localStorage?.clear?.();
  (globalThis as any).sessionStorage?.clear?.();
  vi.restoreAllMocks();
});
EOF
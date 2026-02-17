const BUILD_ID_STORAGE_KEY = 'akiprisaye-build-id';

async function clearServiceWorkerState(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ('caches' in window) {
    const cacheStorage = window.caches;
    const cacheKeys = await cacheStorage.keys();
    await Promise.all(cacheKeys.map((cacheKey) => cacheStorage.delete(cacheKey)));
  }
}

export async function enforceBuildVersionSync(buildId: string): Promise<boolean> {
  if (typeof window === 'undefined' || !buildId) {
    return false;
  }

  const storedBuildId = window.localStorage.getItem(BUILD_ID_STORAGE_KEY);

  if (!storedBuildId) {
    window.localStorage.setItem(BUILD_ID_STORAGE_KEY, buildId);
    return false;
  }

  if (storedBuildId === buildId) {
    return false;
  }

  window.localStorage.setItem(BUILD_ID_STORAGE_KEY, buildId);
  await clearServiceWorkerState();
  window.location.reload();
  return true;
}

export function registerAppServiceWorker(): void {
  if (!import.meta.env.PROD || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        const requestImmediateActivation = () => {
          registration.waiting?.postMessage('SKIP_WAITING');
        };

        if (registration.waiting) {
          requestImmediateActivation();
        }

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) {
            return;
          }

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              requestImmediateActivation();
            }
          });
        });
      })
      .catch(() => {
        // Ignore service worker registration errors in production.
      });
  });
}

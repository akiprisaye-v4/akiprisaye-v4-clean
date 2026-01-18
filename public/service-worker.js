// Service Worker simple pour cache
const CACHE_NAME = "akiprisaye-v1";
const urlsToCache = [
  "/",
  "/manifest.json"
  // Ajoute ici les assets/images/logo/icon si besoin
];
// On install, cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
// On fetch, serve cache puis réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});

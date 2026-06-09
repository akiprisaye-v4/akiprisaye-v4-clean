const CACHE_NAME = "aki-horizon-v241";

const STATIC_ASSETS = [
  "/manifest.json",
  "/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "Hors ligne" }), {
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && !url.pathname.match(/\.html?$/)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, url } = event.data;
    self.registration.showNotification(title || "A ki pri sa yé", {
      body: body || "Alerte prix déclenchée",
      icon: icon || "/favicon.svg",
      badge: "/favicon.svg",
      tag: "aki-alerte-prix",
      renotify: true,
      data: { url: url || "/alertes" },
      vibrate: [200, 100, 200],
    });
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "A ki pri sa yé", body: "Nouvelle alerte prix !", url: "/alertes" };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch { /* ignore */ }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "aki-alerte-prix",
      renotify: true,
      data: { url: data.url || "/alertes" },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/alertes";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

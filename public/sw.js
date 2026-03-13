const CACHE_VERSION = "v1";
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE_ASSETS = ["/", OFFLINE_URL];

// ---------------------------------------------------------------------------
// Install – precache shell assets
// ---------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ---------------------------------------------------------------------------
// Activate – purge old caches
// ---------------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ---------------------------------------------------------------------------
// Fetch – network-first for navigation, cache-first for static assets
// ---------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first, fall back to /offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a copy of the navigated page
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.match(OFFLINE_URL))
            .then((cached) => cached || Response.error())
        )
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images): cache-first
  if (
    ["style", "script", "font", "image", "worker"].includes(
      request.destination
    )
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
  }
});

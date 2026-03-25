const CACHE_VERSION = "v2";
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";

// ---------------------------------------------------------------------------
// Install – skip waiting to activate immediately
// ---------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

// ---------------------------------------------------------------------------
// Activate – purge ALL old caches
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
// Fetch – network-first for everything, only cache offline page
// ---------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first, fall back to /offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.match(OFFLINE_URL))
          .then((cached) => cached || Response.error())
      )
    );
    return;
  }

  // All other requests: network-only (no caching)
  // Let the browser handle them normally
});

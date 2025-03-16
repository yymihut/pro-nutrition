/* eslint-disable no-restricted-globals */

// self se referă la ServiceWorkerGlobalScope
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  // Poți adăuga logică de caching aici, dacă vrei
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  // Poți adăuga logică de curățare a vechilor cache-uri aici
});

self.addEventListener("fetch", (event) => {
  // Poți intercepta request-urile și să le răspunzi din cache
  // exemplu minimal
  event.respondWith(fetch(event.request));
});

const CACHE_NAME = "pro-nutrition-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/main.css",
  "/bundle.js",
  "/optimized/picture1.webp",
  "/optimized/picture2.webp",
  "/optimized/picture3.webp",
  "/optimized/picture4.webp",
  "/optimized/picture5.webp",
  "/optimized/picture6.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
      caches.open("image-cache").then((cache) => {
          return cache.match(event.request).then((response) => {
              return response || fetch(event.request).then((networkResponse) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
              });
          });
      })
  );
});


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
  
const CACHE_NAME = 'turnos-tattoo-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch handler to satisfy PWA requirements
  // We are not aggressively caching assets to avoid conflicts with Vite's dynamic nature
  event.respondWith(fetch(event.request));
});

const CACHE_NAME = 'turnos-tattoo-pwa-v2';

self.addEventListener('install', (event) => {
  // Force the new service worker to take over immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear any old caches and take control of all pages immediately
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) return;
  
  // ALWAYS fetch HTML from the network to ensure we get the latest Vite JS bundles
  // This completely bypasses the browser's HTTP cache for the index.html
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => fetch(event.request)) // fallback if no-store fails for some reason
    );
    return;
  }

  // Pass-through fetch handler for images/JS/CSS to allow normal browser caching
  event.respondWith(fetch(event.request));
});

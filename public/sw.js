const CACHE_NAME = 'turnos-tattoo-pwa-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
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
  // Do not intercept external APIs or Firebase traffic
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com') || url.hostname.includes('firebase')) return;
  
  // Always fetch latest HTML for navigation so users immediately get updated builds
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => fetch(event.request))
    );
    return;
  }
  // Let other requests (JS bundles, CSS, assets) pass directly to native browser fetch
  // to avoid artificial failures when waking the device from sleep
});

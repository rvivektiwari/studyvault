const CACHE = 'studyvault-v2';
const ASSETS = [
  '/', 
  '/index.html', 
  '/manifest.json',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      try {
        const validAssets = ASSETS.filter(Boolean);
        await c.addAll(validAssets);
      } catch (error) {
        console.error('Service Worker cache.addAll failed:', error);
      }
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

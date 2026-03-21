/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

registerRoute(
  ({ request, url }) => request.destination === 'style' && url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts-stylesheets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })
    ]
  })
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 })
    ]
  })
);

registerRoute(
  ({ url }) => /^https:\/\/.*\.supabase\.co\/rest\/.*/i.test(url.href),
  new NetworkFirst({
    cacheName: 'supabase-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 })
    ]
  })
);

const navigationHandler = createHandlerBoundToURL('/index.html');
registerRoute(new NavigationRoute(navigationHandler, {
  denylist: [/^\/api\//, /^\/functions\//]
}));

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};

  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const hasVisibleClient = windowClients.some((client) => client.visibilityState === 'visible' || client.focused);

    if (hasVisibleClient) {
      windowClients.forEach((client) => {
        client.postMessage({ type: 'studyvault-push-received', payload });
      });
      return;
    }

    const title = payload.title || 'StudyVault';
    const options = {
      body: payload.body || 'You have a new notification.',
      icon: payload.icon || '/web-app-manifest-192x192.png',
      badge: payload.badge || '/web-app-manifest-192x192.png',
      data: {
        url: payload.url || '/',
        entryId: payload.entryId || null
      },
      tag: payload.tag || 'studyvault-push',
      renotify: true
    };

    await self.registration.showNotification(title, options);
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destinationUrl = new URL(event.notification.data?.url || '/', self.location.origin).toString();

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      const clientUrl = new URL(client.url);
      if (clientUrl.origin === self.location.origin) {
        if ('navigate' in client) {
          await client.navigate(destinationUrl);
        }
        client.focus();
        client.postMessage({ type: 'studyvault-notification-click', url: destinationUrl });
        return;
      }
    }
    await clients.openWindow(destinationUrl);
  })());
});

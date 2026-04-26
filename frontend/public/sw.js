// Use a timestamp-based cache name so new deployments create a new cache
const CACHE_NAME = 'ghp-v-' + (new Date().getTime());
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests
  if (req.method !== 'GET') return;

  // Skip API requests - always go to network (bypass service worker cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  // Skip unsupported schemes
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // Skip chrome-extension, data, blob, and internal browser URLs
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:' || url.protocol === 'blob:') return;
  if (url.hostname === 'localhost' && url.port === '5174' && url.pathname.startsWith('/__vite')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const cached = await cache.match(req);
        if (cached) return cached;

        const response = await fetch(req);

        // Cache only successful basic/cors responses
        if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
          try {
            await cache.put(req, response.clone());
          } catch (cacheErr) {
            console.warn('SW cache.put skipped:', req.url);
          }
        }

        return response;
      } catch (err) {
        const offlineResponse = await cache.match(OFFLINE_URL);
        return offlineResponse || new Response('Offline', { status: 503 });
      }
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Green Hybrid Power';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: data.url || '/'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
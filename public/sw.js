/* ───────────────────────────────────────────
   Open Heavens – Service Worker (PWA)
   Cache strategies: cache-first (assets), network-first (API)
   ─────────────────────────────────────────── */

const CACHE_STATIC = 'oh-static-v1';
const CACHE_API = 'oh-api-v1';

// Static assets: cache-first
const STATIC_EXT = /\.(js|css|html|woff2?|ttf|ico|png|jpg|jpeg|gif|webp|svg)$/i;

// API paths: network-first
function isApiRequest(url) {
  try {
    const u = new URL(url);
    return u.pathname.startsWith('/api/') || u.origin.includes('ohapi.weserve.one');
  } catch {
    return false;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_STATIC && k !== CACHE_API).map((k) => caches.delete(k))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // API: network-first
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response('{}', { status: 503 })))
    );
    return;
  }

  // Static assets: cache-first
  if (request.method === 'GET' && STATIC_EXT.test(url)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then((cache) => cache.put(request, clone));
          return res;
        })
      )
    );
    return;
  }

  // HTML (SPA fallback): network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Open Heavens Church';
  const options = {
    body: data.body || '',
    icon: 'https://cdn.weserve.one/church-app/default/4b9a2c45-4dae-4778-8945-a692a12d7f8a.png',
    badge: 'https://cdn.weserve.one/church-app/default/4b9a2c45-4dae-4778-8945-a692a12d7f8a.png',
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

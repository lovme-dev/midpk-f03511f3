// Service Worker with Push Notification Support for iOS PWA
// This file is used with injectManifest strategy (custom SW)

// NOTE: Cache names are versioned. Bump these when changing caching logic
// to force clients to drop old cached modules that can cause blank screens.
const CACHE_NAME = 'midasbuy-v9';
const RUNTIME_CACHE = 'midasbuy-runtime-v4';
const IMAGE_CACHE = 'midasbuy-images-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/c4afc4e9-db3f-48ee-ab7b-94e006da0712.png',
  '/lovable-uploads/f8cfbdd1-232a-419f-a7a8-c1d633416f6b.png',
  '/lovable-uploads/73046b56-aa40-49a4-adb2-8aba93c96a76.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch((error) => {
          console.log('Cache addAll failed:', error);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Never cache Vite dev / module graph requests.
  // Caching these can lead to stale or truncated JS ("Unexpected end of script").
  const isViteDevModule =
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('/.vite/') ||
    url.pathname.startsWith('/@vite') ||
    url.pathname.startsWith('/@react-refresh') ||
    url.pathname.startsWith('/@id/') ||
    url.pathname.startsWith('/@fs/') ||
    url.pathname.startsWith('/__vite') ||
    url.pathname.startsWith('/__') ||
    url.pathname.startsWith('/vite') ||
    url.pathname === '/@vite/client';

  // Skip cross-origin requests (API calls, analytics, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Network-only for Vite dev modules
  if (isViteDevModule) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // Fast app-shell for navigations (skip OAuth callback routes)
  if (request.mode === 'navigate') {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/~oauth')) {
      return; // Let the browser handle OAuth redirects directly
    }
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = (await cache.match('/index.html')) || (await cache.match('/'));
      const preload = await event.preloadResponse;
      try {
        // Network-first to avoid serving stale HTML that references old chunks.
        const network = await (preload || fetch(request));
        return network;
      } catch (_) {
        return cached || preload;
      }
    })());
    return;
  }

  // Images: cache-first with long-term storage
  if (url.pathname.startsWith('/lovable-uploads/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/i)) {
    event.respondWith((async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        return cached || new Response('Image not available', { status: 503 });
      }
    })());
    return;
  }

  // JavaScript/CSS: network-first for reliability
  // - /assets/* is production build output
  // - anything else that is a script/style should also be network-first
  const isScriptOrStyle = request.destination === 'script' || request.destination === 'style';
  if (url.pathname.startsWith('/assets/') || isScriptOrStyle) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
        throw error;
      }
    })());
    return;
  }

  // Default cache-first for all other same-origin requests
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    return (
      cached || fetch(request).then(async (res) => {
        if (res && res.status === 200) {
          cache.put(request, res.clone());
        }
        return res;
      }).catch(() => cached)
    );
  })());
});

// Clean up old caches and enable navigation preload
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
    } catch (e) {}

    // Clear ALL old caches to prevent stale module errors
    const cacheNames = await caches.keys();
    const validCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
    await Promise.all(
      cacheNames.map((cacheName) =>
        !validCaches.includes(cacheName) ? caches.delete(cacheName) : Promise.resolve()
      )
    );

    // Take control immediately and notify open tabs
    await self.clients.claim();
    const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    windowClients.forEach((client) => {
      client.postMessage({ type: 'CACHE_UPDATED' });
    });
  })());
});

// Push notifications (iOS 16.4+ PWA compatible)
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', {
    hasData: !!event.data,
    dataType: event.data ? typeof event.data : null,
  });

  let data = {
    title: 'Midasbuy',
    body: 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    url: '/',
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      console.log('[SW] Push payload:', payload);
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        url: payload.url || data.url,
      };
    }
  } catch (e) {
    console.log('[SW] Error parsing push data:', e);
    try {
      if (event.data) {
        const text = event.data.text();
        data.body = text;
      }
    } catch (_) {
      // ignore
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: 'midasbuy-' + Date.now(),
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url,
      timestamp: Date.now(),
    },
    vibrate: [100, 50, 100],
    silent: false,
  };

  event.waitUntil(
    (async () => {
      try {
        await self.registration.showNotification(data.title, options);
        const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        windowClients.forEach((client) => {
          client.postMessage({ type: 'PUSH_RECEIVED', payload: data });
        });
      } catch (err) {
        console.error('[SW] Failed to display notification:', err);
      }
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

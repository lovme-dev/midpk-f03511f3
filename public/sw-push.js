// Push notification service worker for Midasbuy
// Optimized for iOS 16.4+ PWA and all other browsers

self.addEventListener('install', (event) => {
  console.log('[SW-Push] Installing service worker...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW-Push] Activating service worker...');
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clean up old caches if any
      caches.keys().then(keys => 
        Promise.all(keys.filter(key => key.startsWith('sw-push-')).map(key => caches.delete(key)))
      )
    ])
  );
});

self.addEventListener('push', (event) => {
  console.log('[SW-Push] Push event received:', {
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
      console.log('[SW-Push] Payload:', payload);
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        url: payload.url || data.url,
      };
    }
  } catch (e) {
    console.log('[SW-Push] Error parsing push data:', e);
    try {
      if (event.data) {
        const text = event.data.text();
        console.log('[SW-Push] Raw text:', text);
        data.body = text;
      }
    } catch (_) {
      // ignore
    }
  }

  // iOS-compatible notification options
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: 'midasbuy-notification-' + Date.now(), // Unique tag for iOS
    renotify: true,
    requireInteraction: false,
    // iOS-specific: include actions if supported
    actions: [],
    data: { 
      url: data.url,
      timestamp: Date.now()
    },
    // Vibration pattern for supported devices
    vibrate: [100, 50, 100],
    // Silent notification support
    silent: false
  };

  console.log('[SW-Push] Showing notification:', data.title, options);

  event.waitUntil(
    (async () => {
      try {
        await self.registration.showNotification(data.title, options);
        console.log('[SW-Push] Notification displayed successfully');
        
        // Notify open windows (for debugging and in-app handling)
        const windowClients = await self.clients.matchAll({ 
          type: 'window', 
          includeUncontrolled: true 
        });
        
        windowClients.forEach((client) => {
          client.postMessage({ 
            type: 'PUSH_RECEIVED', 
            payload: data 
          });
        });
      } catch (err) {
        console.error('[SW-Push] Failed to display notification:', err);
      }
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW-Push] Notification clicked:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Navigate existing window
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('[SW-Push] Notification closed:', event);
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('[SW-Push] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/// <reference lib="webworker" />
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Extend ServiceWorkerRegistration to include pushManager
declare global {
  interface ServiceWorkerRegistration {
    pushManager: PushManager;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray as Uint8Array<ArrayBuffer>;
}

// Fetch VAPID public key from server
async function fetchVapidPublicKey(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-vapid-public-key');
    if (error) {
      console.error('[Push] Error fetching VAPID key:', error);
      return null;
    }
    return data?.vapid_public_key || null;
  } catch (error) {
    console.error('[Push] Error fetching VAPID key:', error);
    return null;
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isiOS, setIsiOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const checkSubscription = useCallback(async () => {
    try {
      if (!('serviceWorker' in navigator)) return;

      const registration =
        (await navigator.serviceWorker.getRegistration()) ||
        (await navigator.serviceWorker.getRegistration('/'));

      if (!registration) {
        setIsSubscribed(false);
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
      console.log('[Push] Subscription check:', {
        subscribed: !!subscription,
        sw: registration.active?.scriptURL,
      });
    } catch (error) {
      console.error('[Push] Error checking subscription:', error);
      setIsSubscribed(false);
    }
  }, []);

  useEffect(() => {
    // Detect iOS (including iPad with iPadOS)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsiOS(isIOSDevice);

    // Detect PWA mode (standalone)
    const isPWAMode = window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    setIsPWA(isPWAMode);

    const debug = `iOS: ${isIOSDevice}, PWA: ${isPWAMode}, SW: ${'serviceWorker' in navigator}, Push: ${'PushManager' in window}, Notif: ${'Notification' in window}`;
    setDebugInfo(debug);
    console.log('[Push] Init:', debug);

    // Check support
    const checkSupport = () => {
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasPushManager = 'PushManager' in window;
      const hasNotification = 'Notification' in window;

      // On iOS Safari (not PWA), push is NOT supported
      if (isIOSDevice && !isPWAMode) {
        console.log('[Push] iOS detected but not in PWA mode - push not supported');
        setIsSupported(false);
        return;
      }

      const supported = hasServiceWorker && hasPushManager && hasNotification;
      console.log('[Push] Support check:', { hasServiceWorker, hasPushManager, hasNotification, supported });
      setIsSupported(supported);
    };

    checkSupport();

    if ('Notification' in window) {
      setPermission(Notification.permission);
      console.log('[Push] Current permission:', Notification.permission);
    }

    checkSubscription();
  }, [checkSubscription]);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported on this device. Please install the app first.');
    }

    setIsLoading(true);

    try {
      console.log('[Push] Starting subscription process...');

      // 1. Fetch VAPID public key from server
      const vapidPublicKey = await fetchVapidPublicKey();
      if (!vapidPublicKey) {
        throw new Error('Failed to fetch VAPID public key from server. Please try again.');
      }
      console.log('[Push] Got VAPID public key from server');

      // 2. Permission request MUST be from user gesture
      const currentPermission = await Notification.requestPermission();
      setPermission(currentPermission);
      console.log('[Push] Permission result:', currentPermission);

      if (currentPermission !== 'granted') {
        throw new Error('Notification permission was denied. Please enable notifications in your device settings.');
      }

      // 3. Ensure main service worker is registered
      console.log('[Push] Ensuring service worker registration (/sw.js)...');
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('[Push] Registered /sw.js');
      }

      // Wait until the SW is ready/active
      if (registration.installing) {
        await new Promise<void>((resolve) => {
          const sw = registration!.installing!;
          sw.addEventListener('statechange', () => {
            if (sw.state === 'activated') resolve();
          });
          setTimeout(() => resolve(), 8000);
        });
      }

      await navigator.serviceWorker.ready;
      console.log('[Push] Service worker ready:', registration.active?.scriptURL);

      // 4. Remove existing subscription to ensure fresh one with correct key
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('[Push] Removing old subscription to resubscribe with correct key...');
        await existingSubscription.unsubscribe();
        
        // Also remove from database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', existingSubscription.endpoint);
        }
      }

      // 5. Subscribe to push with server's VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      console.log('[Push] Subscribing with server VAPID key...');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      console.log('[Push] Subscription created:', subscription.endpoint);

      // Extract keys
      const p256dhKey = subscription.getKey('p256dh');
      const authKey = subscription.getKey('auth');

      if (!p256dhKey || !authKey) {
        throw new Error('Failed to get subscription keys');
      }

      // Convert to base64url format (required by Web Push protocol)
      // This ensures compatibility with both iOS and Android
      const uint8ArrayToBase64Url = (bytes: Uint8Array): string => {
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      };

      const p256dh = uint8ArrayToBase64Url(new Uint8Array(p256dhKey));
      const auth = uint8ArrayToBase64Url(new Uint8Array(authKey));

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Store subscription in database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh,
          auth
        }, {
          onConflict: 'user_id,endpoint'
        });

      if (error) {
        console.error('[Push] Error storing subscription:', error);
        throw error;
      }

      setIsSubscribed(true);
      console.log('[Push] Successfully subscribed to push notifications');

    } catch (error) {
      console.error('[Push] Error subscribing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);

    try {
      const registration =
        (await navigator.serviceWorker.getRegistration()) ||
        (await navigator.serviceWorker.getRegistration('/'));

      if (!registration) {
        setIsSubscribed(false);
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Remove from database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint);
        }
      }

      setIsSubscribed(false);
      console.log('[Push] Successfully unsubscribed from push notifications');

    } catch (error) {
      console.error('[Push] Error unsubscribing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    isiOS,
    isPWA,
    debugInfo,
    subscribe,
    unsubscribe,
    checkSubscription
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extend window to include global PWA prompt
declare global {
  interface Window {
    __pwaInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

const isAndroidInAppBrowser = (ua: string) => {
  // Common in-app browsers that typically don't support the native PWA install prompt
  return /(wv|fbav|fban|instagram|line|twitter|tiktok|snapchat|micromessenger|wechat|pinterest|linkedin)/i.test(ua);
};

export const usePWAInstall = () => {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isBrowser, setIsBrowser] = useState(true);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent;
    const userAgentLower = userAgent.toLowerCase();
    const iOS = /ipad|iphone|ipod/.test(userAgentLower) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /android/.test(userAgentLower);

    setIsIOS(iOS);
    setIsAndroid(android);
    setIsInAppBrowser(android ? isAndroidInAppBrowser(userAgent) : false);

    // Check if running as standalone (installed PWA)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // If we previously stored "installed" but we're not actually in standalone,
    // clear it so UI doesn't get stuck hiding install actions.
    if (!standalone && localStorage.getItem('pwa-installed') === 'true') {
      localStorage.removeItem('pwa-installed');
    }

    setIsStandalone(standalone);
    setIsBrowser(!standalone);

    // Check for globally captured prompt first (from index.html)
    if (window.__pwaInstallPrompt) {
      console.log('[PWA] Using globally captured install prompt');
      setDeferredPrompt(window.__pwaInstallPrompt);
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      // Also store globally
      window.__pwaInstallPrompt = e;
    };

    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setDeferredPrompt(null);
      window.__pwaInstallPrompt = null;
      setIsInstallable(false);
      setIsStandalone(true);
      setIsBrowser(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    // iOS Safari: we can show install instructions
    if (!standalone && iOS) {
      setIsInstallable(true);
    }

    // Listen for display-mode changes
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      setIsBrowser(!e.matches);
    };
    displayModeQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      displayModeQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    // iOS Safari instructions
    if (isIOS) {
      toast({
        title: 'Install App on iOS',
        description: "Tap the Share button, then select 'Add to Home Screen' to install this app.",
        duration: 8000,
      });
      return;
    }

    // Use local state OR global prompt (whichever is available)
    const promptToUse = deferredPrompt || window.__pwaInstallPrompt;

    // Android/desktop with deferred prompt
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;

        if (outcome === 'accepted') {
          toast({
            title: 'App Installing',
            description: 'The app is being installed on your device!',
          });
          // Wait for the real appinstalled event before marking as standalone
          setIsInstallable(false);
        }


        setDeferredPrompt(null);
        window.__pwaInstallPrompt = null;
      } catch (error) {
        console.error('Error during PWA installation:', error);
        toast({
          title: 'Installation Error',
          description: 'There was an issue installing the app. Please try using your browser menu.',
          variant: 'destructive',
        });
      }
      return;
    }

    // No native prompt available (common in Android in-app browsers)
    if (isAndroid) {
      toast({
        title: 'One‑tap install not available',
        description: isInAppBrowser
          ? "You're using an in‑app browser. Open this page in Chrome, then tap Install again."
          : "Please open in Chrome and refresh the page, then tap Install again.",
        duration: 8000,
      });
      return;
    }

    // Generic fallback
    toast({
      title: 'Install App',
      description: "To install this app, use your browser's 'Add to Home Screen' option from the menu.",
      duration: 5000,
    });
  }, [deferredPrompt, isIOS, isAndroid, isInAppBrowser, toast]);

  return {
    isInstallable,
    isIOS,
    isAndroid,
    isStandalone,
    isBrowser,
    isInAppBrowser,
    handleInstall,
  };
};

export default usePWAInstall;

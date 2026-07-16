import { useState, useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from './ui/button';
import OptimizedImage from './OptimizedImage';
import usePWAInstall from '@/hooks/usePWAInstall';

const AppInstallNotification = () => {
  const { isInstallable, isBrowser, isStandalone, handleInstall } = usePWAInstall();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const showTimeoutRef = useRef<number | null>(null);
  const reshowTimeoutRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (reshowTimeoutRef.current) {
      clearTimeout(reshowTimeoutRef.current);
      reshowTimeoutRef.current = null;
    }
  };

  const SHOW_DURATION_MS = 5000;
  const RESHOW_MS = 240000; // 4 minutes

  const scheduleNextShow = (delayMs: number) => {
    const snoozeUntil = Date.now() + delayMs;
    localStorage.setItem('pwa-install-snooze-until', snoozeUntil.toString());
    if (reshowTimeoutRef.current) clearTimeout(reshowTimeoutRef.current);
    reshowTimeoutRef.current = window.setTimeout(() => {
      const installed = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone || localStorage.getItem('pwa-installed') === 'true';
      if (!installed) {
        // Show for 5 seconds, then hide and schedule the next cycle
        setShowNotification(true);
        setNotificationCount(prev => prev + 1);
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = window.setTimeout(() => {
          setShowNotification(false);
          scheduleNextShow(RESHOW_MS);
        }, SHOW_DURATION_MS);
      }
    }, delayMs);
  };

  useEffect(() => {
    // Remove legacy dismissal key
    localStorage.removeItem('pwa-install-dismissed');

    if (!isStandalone && isBrowser) {
      const snoozeStr = localStorage.getItem('pwa-install-snooze-until');
      const now = Date.now();
      const snoozeUntil = snoozeStr ? parseInt(snoozeStr, 10) : 0;

      if (!snoozeStr || now >= snoozeUntil) {
        // Show immediately and auto-hide after 5 seconds, then snooze
        setShowNotification(true);
        setNotificationCount(1);

        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = window.setTimeout(() => {
          setShowNotification(false);
          scheduleNextShow(RESHOW_MS);
        }, SHOW_DURATION_MS);
      } else {
        // Schedule next show when snooze ends
        const delay = Math.max(0, snoozeUntil - now);
        scheduleNextShow(delay);
      }
    }

    return () => {
      clearTimers();
    };
  }, [isStandalone, isBrowser]);

  const handleLater = () => {
    setShowNotification(false);
  };

  const handleDismiss = () => {
    setShowNotification(false);
    scheduleNextShow(RESHOW_MS);
  };

  const onInstallClick = async () => {
    await handleInstall();
    setShowNotification(false);
  };

  // Don't show in standalone (installed PWA) mode
  if (isStandalone || !isBrowser) {
    return null;
  }

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-sm animate-fade-in">
      <div className="bg-gradient-to-r from-midasbuy-navy to-midasbuy-darkBlue border border-midasbuy-blue/30 rounded-lg p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <OptimizedImage 
              src="/lovable-uploads/f8cfbdd1-232a-419f-a7a8-c1d633416f6b.png" 
              alt="App Logo" 
              className="w-10 h-10 rounded-lg"
              width={40}
              height={40}
              quality={50}
              displayWidth={40}
              priority={true}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Install Midasbuy App
            </h3>
            <p className="text-gray-300 text-xs mb-3">
              Get faster access and better experience with our mobile app!
            </p>
            <div className="flex gap-2">
              <Button
                onClick={onInstallClick}
                size="sm"
                className="bg-midasbuy-blue hover:bg-blue-600 text-white text-xs px-3 py-1 h-auto"
              >
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
              <Button
                onClick={handleLater}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white text-xs px-2 py-1 h-auto"
              >
                Later
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppInstallNotification;
import { useState, useEffect, useCallback } from 'react';

interface CacheInfo {
  sizeInMB: string;
  sizeInBytes: number;
  isLoading: boolean;
}

export const useCacheSize = (): CacheInfo & { clearCache: () => Promise<void> } => {
  const [sizeInBytes, setSizeInBytes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const calculateCacheSize = useCallback(async () => {
    setIsLoading(true);
    let totalSize = 0;

    try {
      // Check if Cache API is available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          for (const request of requests) {
            try {
              const response = await cache.match(request);
              if (response) {
                const blob = await response.clone().blob();
                totalSize += blob.size;
              }
            } catch (e) {
              // Skip this entry if there's an error
            }
          }
        }
      }

      // Add localStorage size estimation
      if (typeof localStorage !== 'undefined') {
        let localStorageSize = 0;
        for (const key of Object.keys(localStorage)) {
          const value = localStorage.getItem(key);
          if (value) {
            localStorageSize += key.length + value.length;
          }
        }
        // Each character is 2 bytes in JavaScript
        totalSize += localStorageSize * 2;
      }

      // Add sessionStorage size estimation
      if (typeof sessionStorage !== 'undefined') {
        let sessionStorageSize = 0;
        for (const key of Object.keys(sessionStorage)) {
          const value = sessionStorage.getItem(key);
          if (value) {
            sessionStorageSize += key.length + value.length;
          }
        }
        totalSize += sessionStorageSize * 2;
      }

      setSizeInBytes(totalSize);
    } catch (error) {
      console.error('Error calculating cache size:', error);
      setSizeInBytes(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear localStorage (except auth and essential items to prevent logout)
      const essentialPatterns = [
        'selectedCountry',
        'supabase',
        'sb-',
        'auth',
        'token',
        'session',
        'user'
      ];
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !essentialPatterns.some(pattern => key.toLowerCase().includes(pattern.toLowerCase()))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Recalculate cache size
      await calculateCacheSize();

      // Force reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback: just reload
      window.location.reload();
    }
  }, [calculateCacheSize]);

  useEffect(() => {
    calculateCacheSize();
  }, [calculateCacheSize]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb < 0.01) {
      const kb = bytes / 1024;
      return `${kb.toFixed(2)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return {
    sizeInMB: formatSize(sizeInBytes),
    sizeInBytes,
    isLoading,
    clearCache,
  };
};

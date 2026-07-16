// Image optimization utilities for better performance

export const preloadCriticalImages = (imageSrcs: string[], quality = 85) => {
  return Promise.all(
    imageSrcs.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Add quality parameters for Lovable uploads
        if (src.includes('lovable-uploads')) {
          const url = new URL(src, window.location.origin);
          url.searchParams.set('q', quality.toString());
          url.searchParams.set('f', 'webp');
          img.src = url.toString();
        } else {
          img.src = src;
        }
        
        img.loading = 'eager';
        img.onload = resolve;
        img.onerror = reject;
      });
    })
  );
};

export const createOptimizedImageUrl = (src: string, quality = 80, format = 'webp') => {
  if (!src.includes('lovable-uploads')) {
    return src;
  }
  
  try {
    const url = new URL(src, window.location.origin);
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('f', format);
    return url.toString();
  } catch {
    return src;
  }
};

export const addImagePerformanceHints = () => {
  // Add preload hints for critical images
  const criticalImages = [
    { src: '/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png', quality: 90 }, // Logo
    { src: '/lovable-uploads/1056750c-b137-4d77-9ee7-0b0da0eef470.png', quality: 85 }, // Mobile PUBG Banner
    { src: '/lovable-uploads/0d9b0111-17db-4849-ac7d-173eeafc2a91.png', quality: 70, width: 2800 }, // Desktop PUBG Banner (LCP)
  ];

  criticalImages.forEach(({ src, quality, width }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    let url = createOptimizedImageUrl(src, quality);
    if (width) {
      const urlObj = new URL(url, window.location.origin);
      urlObj.searchParams.set('w', width.toString());
      url = urlObj.toString();
    }
    link.href = url;
    document.head.appendChild(link);
  });
};

// Lazy load images that are not in viewport
export const createIntersectionObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01,
  });
};
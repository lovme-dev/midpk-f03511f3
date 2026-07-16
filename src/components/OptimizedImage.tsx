import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  displayWidth?: number; // Target display width for CDN optimization
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false, 
  quality = 80,
  displayWidth
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Create optimized image URL with quality and format parameters
    let optimizedSrc = src;
    
    // For Lovable uploads, we can add quality parameters
    if (src.includes('lovable-uploads')) {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('f', 'webp');
      
      // Add width parameter for better CDN optimization
      if (displayWidth) {
        url.searchParams.set('w', (displayWidth * 2).toString()); // 2x for retina
      }
      
      optimizedSrc = url.toString();
    }

    // Preload the image
    const img = new Image();
    img.src = optimizedSrc;
    
    if (priority) {
      img.loading = 'eager';
    }
    
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      // Fallback to original image if optimized version fails
      const fallbackImg = new Image();
      fallbackImg.src = src;
      fallbackImg.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      fallbackImg.onerror = () => {
        setIsError(true);
      };
    };
  }, [src, priority, quality, displayWidth]);

  if (isError) {
    return (
      <div className={`bg-gray-700 flex items-center justify-center text-gray-400 text-sm ${className}`}>
        Image failed to load
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        ...(width && height && { aspectRatio: `${width}/${height}` })
      }}
    />
  );
};

export default OptimizedImage;
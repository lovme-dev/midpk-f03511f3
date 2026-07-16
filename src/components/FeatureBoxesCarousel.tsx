
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import videoBannerBg from '@/assets/video-banner-bg.png';
import ageOfEmpiresLiveBanner from '@/assets/age-of-empires-live-banner.mp4';
import ageOfEmpiresLivePoster from '@/assets/age-of-empires-live-banner-poster.jpeg';


interface FeatureBoxesCarouselProps {
  className?: string;
  showHeading?: boolean;
  onSlideChange?: (index: number) => void;
}

interface CarouselSlide {
  type: 'video' | 'image';
  src: string;
  descriptionKey: string;
  descriptionFallback: string;
  mobileOnly?: boolean; // If true, skip on desktop
  fullVideo?: boolean; // If true, show full video without background/scaling
  posterSrc?: string;
}

const FeatureBoxesCarousel: React.FC<FeatureBoxesCarouselProps> = ({ className, showHeading = false, onSlideChange }) => {
  const isMobile = useMobile();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false); // Track if video is ready to play
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get slides based on device - skip mobileOnly videos on desktop
  const getActiveSlides = useCallback(() => {
    const allSlides: CarouselSlide[] = [
      // IMPORTANT: Age of Empires LIVE must be #1 on both mobile + desktop
      {
        type: 'video',
        src: ageOfEmpiresLiveBanner,
        mobileOnly: false,
        fullVideo: true,
        posterSrc: ageOfEmpiresLivePoster,
        descriptionKey: 'banners.ageOfEmpiresLive',
        descriptionFallback: 'Midasbuy X Age of Empires Mobile Spring Festival Carnival Live'
      },
      // 8-ball must remain mobile-only
      {
        type: 'video',
        src: '/videos/8ball-promo.mov',
        mobileOnly: true,
        descriptionKey: 'banners.8ball',
        descriptionFallback: 'Play 8 ball at Midasbuy!'
      },
      { type: 'image', src: '/lovable-uploads/58ab0999-9b9a-4134-99be-0ed63f5b99d5.png', descriptionKey: 'banners.freefire', descriptionFallback: 'Free Fire diamonds at best prices - Instant delivery guaranteed!' },
      { type: 'image', src: '/lovable-uploads/banner-pubg-recharge.jpeg', descriptionKey: 'banners.pubgRecharge', descriptionFallback: 'PUBG Mobile Total Recharge rewards - Get 60 UC bonus!' },
      { type: 'image', src: '/lovable-uploads/banner-delta-force-blue.jpeg', descriptionKey: 'banners.deltaBlue', descriptionFallback: 'Delta Force Blue Camo Collection - Premium weapon skins!' },
      { type: 'image', src: '/lovable-uploads/banner-delta-force-gold.jpeg', descriptionKey: 'banners.deltaGold', descriptionFallback: 'Delta Force Gold Edition - Exclusive coins & rewards!' },
      { type: 'image', src: '/lovable-uploads/banner-age-empires-topup.jpeg', descriptionKey: 'banners.ageOfEmpires', descriptionFallback: 'Age of Empires Monthly First Top Up - Special offers!' },
      { type: 'image', src: '/lovable-uploads/banner-delta-force-fire.jpeg', descriptionKey: 'banners.deltaFire', descriptionFallback: 'Delta Force Fire Edition - Limited time soldier pack!' },
      { type: 'image', src: '/lovable-uploads/banner-delta-force-pink.jpeg', descriptionKey: 'banners.deltaPink', descriptionFallback: 'Delta Force Pink Collection - Unique weapon skin!' },
      { type: 'image', src: '/lovable-uploads/banner-honor-kings.jpeg', descriptionKey: 'banners.honorOfKings', descriptionFallback: 'Honor of Kings - Invite friends & get 4000 tokens!' },
      { type: 'image', src: '/lovable-uploads/banner-apex-coin.jpeg', descriptionKey: 'banners.apexCoin', descriptionFallback: 'Apex Coin Bonanza - First buy, 2x value!' },
      { type: 'image', src: '/lovable-uploads/banner-pubg-uc-drops.jpeg', descriptionKey: 'banners.pubgUcDrops', descriptionFallback: 'PUBG Mobile Daily UC Drops - 3x Squad help, 3000 UC max!' },
      { type: 'image', src: '/lovable-uploads/banner-pubg-free.jpeg', descriptionKey: 'banners.pubgFree', descriptionFallback: 'PUBG Mobile Free Rewards - Get free UC, outfit & gun skin!' }
    ];
    
    // On desktop, skip the mobileOnly video slides
    if (!isMobile) {
      return allSlides.filter(slide => !(slide.type === 'video' && slide.mobileOnly));
    }
    return allSlides;
  }, [isMobile]);

  const carouselSlides = getActiveSlides();

  // If slide count changes (e.g. switching between mobile/desktop), keep index valid
  useEffect(() => {
    if (activeIndex >= carouselSlides.length) {
      setActiveIndex(0);
      onSlideChange?.(0);
    }
  }, [activeIndex, carouselSlides.length, onSlideChange]);


  // Get video slide indices
  const getVideoSlideIndices = useCallback(() => {
    return carouselSlides
      .map((slide, index) => slide.type === 'video' ? index : -1)
      .filter(index => index !== -1);
  }, [carouselSlides]);

  const videoSlideIndices = getVideoSlideIndices();

  // Handle video end - move to next slide
  const handleVideoEnd = useCallback(() => {
    setIsVideoPlaying(false);
    const newIndex = (activeIndex + 1) % carouselSlides.length;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
  }, [activeIndex, carouselSlides.length, onSlideChange]);

  // Play video when it becomes active - immediately on page load
  useEffect(() => {
    const currentSlide = carouselSlides[activeIndex];
    if (currentSlide?.type === 'video' && videoRef.current) {
      // For first slide, play immediately without resetting
      if (activeIndex === 0 && videoRef.current.readyState >= 2) {
        // Video already has enough data
        setVideoLoaded(true);
        setIsVideoPlaying(true);
      } else {
        videoRef.current.currentTime = 0;
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
      }
      
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
            setNeedsUserPlay(false);
          })
          .catch(() => {
            // Silent fail - video will auto-retry on canPlay event
            setIsVideoPlaying(false);
          });
      }
    } else {
      setIsVideoPlaying(false);
    }
  }, [activeIndex, carouselSlides]);

  // Preload first video immediately on mount
  useEffect(() => {
    if (videoRef.current && carouselSlides[0]?.type === 'video') {
      videoRef.current.load();
    }
  }, []);

  // Preload images
  useEffect(() => {
    setImagesLoaded(false);
    let loadedCount = 0;
    const imageSlides = carouselSlides.filter(s => s.type === 'image');
    const totalImages = imageSlides.length;
    
    imageSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
    });
  }, [carouselSlides]);

  // Auto rotate carousel - skip if video is playing
  useEffect(() => {
    if (!imagesLoaded) return;
    
    // Don't auto-rotate if current slide is a video and playing
    const currentSlide = carouselSlides[activeIndex];
    if (currentSlide?.type === 'video' && isVideoPlaying) {
      return;
    }
    
    autoRotateRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % carouselSlides.length;
        onSlideChange?.(newIndex);
        return newIndex;
      });
    }, 5000);
    
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [carouselSlides, imagesLoaded, onSlideChange, activeIndex, isVideoPlaying]);

  // Notify parent on initial load
  useEffect(() => {
    onSlideChange?.(activeIndex);
  }, []);

  // Manual navigation
  const goToPrevious = () => {
    const newIndex = activeIndex === 0 ? carouselSlides.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = (activeIndex + 1) % carouselSlides.length;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  // Indicator dots for navigation
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    onSlideChange?.(index);
  };

  const activeSlide = carouselSlides[activeIndex];
  const activeDescription = activeSlide
    ? (t(activeSlide.descriptionKey, activeSlide.descriptionFallback) as string)
    : '';

  return (
    <div className={`w-full -mt-[7%] md:mt-0 ${className}`}>
      <div className="max-w-5xl mx-auto relative">
        {/* Rainbow gradient glow behind banner - Mobile */}
        <div 
          className="md:hidden absolute -inset-8 opacity-90 blur-3xl pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 40%, rgba(59, 130, 246, 0.9) 0%, transparent 45%), radial-gradient(ellipse at 50% 20%, rgba(6, 182, 212, 0.75) 0%, transparent 50%), radial-gradient(ellipse at 50% 60%, rgba(99, 102, 241, 0.65) 0%, transparent 50%)',
          }}
        />
        {/* Rainbow gradient glow behind banner - PC (blue at top-left corner, cyan extends down) */}
        <div 
          className="hidden md:block absolute -inset-x-16 -top-12 -bottom-48 lg:-bottom-56 opacity-90 blur-3xl pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 0% 0%, rgba(59, 130, 246, 1) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 50% 20%, rgba(6, 182, 212, 0.75) 0%, transparent 50%), radial-gradient(ellipse 100% 80% at 50% 80%, rgba(6, 182, 212, 0.45) 0%, transparent 55%)',
          }}
        />
        {/* Left Arrow - touches left edge */}
        <button 
          onClick={goToPrevious}
          className="absolute left-0 top-[40%] -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white px-0.5 py-2.5 md:px-1 md:py-3 rounded-r-lg transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-5 md:w-5 md:h-6" />
        </button>

        {/* Right Arrow - touches right edge */}
        <button 
          onClick={goToNext}
          className="absolute right-0 top-[40%] -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white px-0.5 py-2.5 md:px-1 md:py-3 rounded-l-lg transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-5 md:w-5 md:h-6" />
        </button>

        {/* Preload video element - positioned off-screen but not display:none so it loads */}
        <video
          ref={videoRef}
          src={ageOfEmpiresLiveBanner}
          className="absolute w-1 h-1 opacity-0 pointer-events-none"
          style={{ top: '-9999px', left: '-9999px' }}
          preload="auto"
          muted
          playsInline
          autoPlay
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
              if (activeIndex === 0) {
                setVideoLoaded(true);
              }
            }
          }}
          onPlaying={() => {
            setVideoLoaded(true);
            setIsVideoPlaying(true);
          }}
          onEnded={handleVideoEnd}
        />

        {/* Banner Container - top corners 5% round, bottom corners slightly more round */}
        <div className="relative z-10 w-full h-[140px] md:h-[280px] lg:h-[320px] overflow-hidden" style={{ borderRadius: '8px 8px 12px 12px' }}>
          {/* First slide (Age of Empires video) - rendered separately for reliable video loading */}
          {carouselSlides[0]?.type === 'video' && carouselSlides[0]?.fullVideo && (
            <div 
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${activeIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="w-full h-full relative overflow-hidden bg-black" style={{ borderRadius: '8px 8px 0 0' }}>
                {/* Video - always try to play */}
                <video
                  ref={videoRef}
                  src={carouselSlides[0].src}
                  className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${
                    videoLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  preload="auto"
                  autoPlay
                  playsInline
                  muted
                  loop={false}
                  onLoadedData={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onCanPlay={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onPlaying={() => {
                    setVideoLoaded(true);
                    setIsVideoPlaying(true);
                  }}
                  onEnded={handleVideoEnd}
                />
                {/* Poster image - fallback, fades out when video plays */}
                {carouselSlides[0].posterSrc && (
                  <img
                    src={carouselSlides[0].posterSrc}
                    alt="Video poster"
                    className={`absolute inset-0 w-full h-full object-cover z-5 pointer-events-none transition-opacity duration-500 ${
                      videoLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ 
                      objectPosition: isMobile ? 'center 30%' : 'center center',
                      transform: isMobile ? 'scale(1.1)' : 'scale(1.0)'
                    }}
                    loading="eager"
                    fetchPriority="high"
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Other slides */}
          {carouselSlides.map((slide, index) => {
            // Skip first slide as it's rendered above
            if (index === 0 && slide.type === 'video' && slide.fullVideo) return null;
            
            return (
              <div 
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {slide.type === 'video' ? (
                  slide.fullVideo ? (
                    // Full video without background blur (Age of Empires style)
                    <div className="w-full h-full relative overflow-hidden bg-black" style={{ borderRadius: '8px 8px 0 0' }}>
                      {/* Poster image */}
                      {slide.posterSrc && (
                        <img
                          src={slide.posterSrc}
                          alt="Video poster"
                          className="absolute inset-0 w-full h-full object-cover z-5 pointer-events-none"
                          style={{ 
                            objectPosition: isMobile ? 'center 30%' : 'center center',
                            transform: isMobile ? 'scale(1.1)' : 'scale(1.0)'
                          }}
                          loading="eager"
                        />
                      )}
                      {/* Video */}
                      <video
                        src={slide.src}
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        autoPlay
                        playsInline
                        muted
                        loop={false}
                        onEnded={handleVideoEnd}
                      />
                    </div>
                  ) : (
                    // 8ball style - only visible on mobile with background blur
                    <div className="block md:hidden w-full h-full relative overflow-hidden" style={{ borderRadius: '8px 8px 0 0' }}>
                      <img 
                        src={videoBannerBg}
                        alt="Video background"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                      />
                      <video
                        src={slide.src}
                        className="absolute inset-0 w-auto h-full mx-auto object-contain z-10"
                        style={{ transform: 'scale(1.41)' }}
                        preload="metadata"
                        autoPlay
                        playsInline
                        muted
                        onEnded={handleVideoEnd}
                      />
                    </div>
                  )
                ) : (
                  <img 
                    ref={el => {
                      if (el) imageRefs.current[index] = el;
                    }}
                    src={slide.src} 
                    alt={`Feature ${index + 1}`} 
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Description bar with inverted top corners (curving upward toward image) */}
        <div className="relative z-0">
          {/* Background extension behind banner (goes upward under the image) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-3 md:-top-4 h-3 md:h-4 z-0"
            style={{
              background: 'linear-gradient(90deg, hsl(192 81% 51%) 0%, hsl(222 84% 43%) 100%)',
            }}
          />

          {/* Left inverted corner */}
          <div 
            className="absolute top-0 left-0 z-10 w-3 h-3 md:w-4 md:h-4"
            style={{
              background: 'radial-gradient(circle at 0% 0%, transparent 100%, transparent 0%), radial-gradient(circle at 100% 100%, hsl(192 81% 51%) 100%, transparent 0%)',
              backgroundSize: '100% 100%',
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                background: 'radial-gradient(circle at 0% 0%, transparent 12px, hsl(192 81% 51%) 12px)',
              }}
            />
          </div>
          
          {/* Right inverted corner */}
          <div 
            className="absolute top-0 right-0 z-10 w-3 h-3 md:w-4 md:h-4"
            style={{
              background: 'radial-gradient(circle at 100% 0%, transparent 100%, transparent 0%)',
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                background: 'radial-gradient(circle at 100% 0%, transparent 12px, hsl(222 84% 43%) 12px)',
              }}
            />
          </div>
          
          <div
            className="relative z-10 px-3 py-2 md:px-4 md:py-2.5 flex items-center justify-between mt-0"
            style={{
              background: 'linear-gradient(90deg, hsl(192 81% 51%) 0%, hsl(222 84% 43%) 100%)',
              borderRadius: '0 0 8px 8px',
            }}
          >
            <p className="text-white text-xs md:text-base font-medium flex-1 pr-2 md:pr-3">
              {activeDescription}
            </p>
            <button className="bg-white text-primary font-semibold px-2.5 py-0.5 md:px-4 md:py-1 rounded-full text-xs md:text-sm hover:bg-gray-100 transition-colors shrink-0">
              GO
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation dots - 5% smaller with black background on each dot */}
      <div className="flex justify-center space-x-1 py-1.5 max-w-5xl mx-auto">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`rounded-full transition-all duration-300 bg-black ${
              activeIndex === index 
                ? 'w-3.5 h-1' 
                : 'w-1 h-1 hover:opacity-80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className={`block rounded-full w-full h-full ${
              activeIndex === index ? 'bg-white' : 'bg-white/40'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureBoxesCarousel;

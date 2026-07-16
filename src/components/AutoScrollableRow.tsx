import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import GameCardBadge from './GameCardBadge';

interface Game {
  id: string;
  name: string;
  image: string;
  tag: string;
  tagColor: string;
  icon?: 'like' | 'fire';
  hideBadge?: boolean;
  variant?: 'orange' | 'red' | 'green';
  badgeImage?: string;
}

export interface AutoScrollableRowRef {
  scrollTo: (scrollLeft: number) => void;
  getScrollLeft: () => number;
  getMaxScroll: () => number;
}

interface AutoScrollableRowProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  autoScrollSpeed?: number;
  onScroll?: (scrollLeft: number, maxScroll: number) => void;
}

const AutoScrollableRow = forwardRef<AutoScrollableRowRef, AutoScrollableRowProps>(({
  games,
  onGameClick,
  autoScrollSpeed = 20,
  onScroll
}, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const autoScrollRef = useRef<number>();
  const maxScrollRef = useRef<number>(0);
  const isExternalScrollRef = useRef(false);

  // Expose scroll methods to parent
  useImperativeHandle(ref, () => ({
    scrollTo: (scrollLeft: number) => {
      if (scrollRef.current) {
        isExternalScrollRef.current = true;
        scrollRef.current.scrollLeft = scrollLeft;
        setTimeout(() => {
          isExternalScrollRef.current = false;
        }, 50);
      }
    },
    getScrollLeft: () => scrollRef.current?.scrollLeft || 0,
    getMaxScroll: () => maxScrollRef.current
  }));

  // Cache max scroll value to prevent forced reflows
  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollRef.current) {
        maxScrollRef.current = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      }
    };
    
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [games]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isUserInteracting && !isDragging) {
      const startAutoScroll = () => {
        if (scrollRef.current) {
          const scroll = () => {
            if (scrollRef.current && !isUserInteracting && !isDragging) {
              const currentScroll = scrollRef.current.scrollLeft;
              
              if (currentScroll >= maxScrollRef.current) {
                // Reset to beginning smoothly
                scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
              } else {
                scrollRef.current.scrollLeft += 1;
              }
              
              autoScrollRef.current = requestAnimationFrame(scroll);
            }
          };
          autoScrollRef.current = requestAnimationFrame(scroll);
        }
      };

      const timeout = setTimeout(startAutoScroll, 2000);
      
      return () => {
        clearTimeout(timeout);
        if (autoScrollRef.current) {
          cancelAnimationFrame(autoScrollRef.current);
        }
      };
    }

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [isUserInteracting, isDragging]);

  // Touch and mouse event handlers
  const handleInteractionStart = () => {
    setIsUserInteracting(true);
    setIsDragging(true);
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
    }
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsUserInteracting(false), 3000);
  };

  const handleMouseEnter = () => {
    setIsUserInteracting(true);
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => setIsUserInteracting(false), 1000);
  };

  const handleScroll = () => {
    setIsUserInteracting(true);
    // Only notify parent if this is a user scroll, not external
    if (!isExternalScrollRef.current && onScroll && scrollRef.current) {
      onScroll(scrollRef.current.scrollLeft, maxScrollRef.current);
    }
  };

  return (
    <div 
      ref={scrollRef}
      className="flex gap-[2%] pb-4 overflow-x-auto scrollbar-hide scroll-smooth px-0"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onScroll={handleScroll}
    >
      {games.map((game) => {
        const cardContent = (
          <div className="flex flex-col items-center flex-shrink-0 w-[27vw]">
            {/* Image Container - 5% bigger for mobile */}
            <div className="relative w-full overflow-visible transition-transform group-hover:scale-105 group-active:scale-95" style={{ height: '115%', paddingTop: '4%' }}>
              <img 
                src={game.image} 
                alt={game.name} 
                className="w-full aspect-square rounded-md scale-[1.103] translate-x-[9%]"
                style={{
                  boxShadow: 'none',
                  background: 'transparent'
                }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
              {/* Custom Badge - inside clickable area */}
              {!game.hideBadge && (
                <GameCardBadge text={game.tag || 'EXTRA DISCOUNT'} icon={game.icon || 'like'} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} />
              )}
            </div>
            {/* Game Name below the card */}
            <h3 className="text-white text-[9px] font-bold text-center mt-4 uppercase tracking-wide leading-tight">{game.name}</h3>
          </div>
        );

        return game.name === "PUBG MOBILE" ? (
          <Link 
            key={game.id} 
            to={`/midasbuy/${(JSON.parse(localStorage.getItem('selectedCountry') || '{"code":"us"}')?.code || 'us').toLowerCase()}/buy/pubgm`}
            className="cursor-pointer group flex-shrink-0 block w-[27vw]"
          >
            {cardContent}
          </Link>
        ) : (
          <div 
            key={game.id} 
            className="cursor-pointer group flex-shrink-0 w-[27vw]"
            onClick={() => onGameClick(game)}
          >
            {cardContent}
          </div>
        );
      })}
    </div>
  );
});

AutoScrollableRow.displayName = 'AutoScrollableRow';

export default AutoScrollableRow;
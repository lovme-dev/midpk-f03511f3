import React from 'react';

interface GameCardBadgeProps {
  text: string;
  size?: 'default' | 'slim';
  icon?: 'like' | 'fire';
  hideBadge?: boolean;
  variant?: 'orange' | 'red' | 'green';
  isDesktop?: boolean;
  badgeImage?: string;
}

const GameCardBadge: React.FC<GameCardBadgeProps> = ({ 
  text, 
  size = 'default', 
  icon = 'like', 
  hideBadge = false,
  variant = 'orange',
  isDesktop = false,
  badgeImage
}) => {
  if (hideBadge) return null;
  
  const isSlim = size === 'slim';

  // If badgeImage is provided, render as image
  if (badgeImage) {
    const desktopBadgeWidth = isDesktop ? 'w-[102.4%]' : 'w-[108.7%]';
    const desktopLeft = isDesktop ? 'left-[-3.8%]' : 'left-[-3.4%]';
    const slimWidth = isDesktop ? 'w-[112.2%]' : 'w-[114.7%]';
    const slimLeftShift = isDesktop ? 'left-[-8.2%]' : 'left-1/2 -translate-x-[51.4%]';

    return (
      <div className={`absolute z-20 pointer-events-none ${isSlim ? `-bottom-2 ${slimLeftShift} ${slimWidth}` : `-bottom-1.5 ${desktopLeft} ${desktopBadgeWidth}`}`}>
        <img 
          src={badgeImage} 
          alt={text} 
          className="w-full h-auto object-contain"
          style={{
            filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.3))',
            maxHeight: isSlim ? (isDesktop ? '30px' : '27px') : '25px'
          }}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          draggable={false}
        />
      </div>
    );
  }

  // Fallback: original CSS-based badge
  // Custom SVG for the "Like" icon (thumbs up)
  const LikeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
    </svg>
  );

  const FireIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.18 1.85-6.44 3.46-8.85.76-1.14 1.54-2.15 2.16-2.95.28-.36.53-.67.73-.92.2-.25.5-.28.73-.28.45 0 .8.21 1 .53.07.11.13.24.17.39.16.55.22 1.24.22 1.89 0 1.02-.22 1.94-.64 2.63-.14.23-.3.44-.47.62.26-.05.52-.08.79-.08 1.49 0 2.85.59 3.87 1.55.64-.83 1.03-1.87 1.03-3 0-.32-.03-.63-.08-.93-.03-.18.03-.37.16-.51.13-.14.31-.22.5-.22.24 0 .46.12.58.32C19.35 7.47 21 10.56 21 14c0 4.97-4.03 9-9 9zm0-2c3.86 0 7-2.69 7-6 0-2.12-.89-4.18-2.44-5.86-.08.83-.36 1.61-.8 2.29-.47.73-1.12 1.33-1.88 1.72-.36.19-.78.1-1.05-.21-.27-.31-.32-.76-.13-1.12.45-.85.68-1.82.68-2.82 0-.56-.06-1.08-.17-1.52-.48.55-1.04 1.23-1.61 2-.94 1.27-1.87 2.77-2.47 4.2-.4.95-.62 1.85-.62 2.62 0 2.49 1.79 4.7 4.49 4.7z"/>
    </svg>
  );

  const IconComponent = icon === 'fire' ? FireIcon : LikeIcon;
  
  const getGradient = () => {
    switch (variant) {
      case 'red':
        return 'linear-gradient(90deg, #f56047, #f25a45, #ef5543)';
      case 'green':
        return 'linear-gradient(90deg, #5ef048, #52eb43, #47e63e)';
      case 'orange':
      default:
        return 'linear-gradient(90deg, hsl(var(--game-badge-from)), hsl(var(--game-badge-mid)), hsl(var(--game-badge-to)))';
    }
  };
  
  const getShadowColor = () => {
    switch (variant) {
      case 'red':
        return 'hsla(0, 75%, 40%, 0.4)';
      case 'green':
        return 'hsla(145, 60%, 35%, 0.4)';
      case 'orange':
      default:
        return 'hsl(var(--game-badge-shadow) / 0.4)';
    }
  };
  
  const desktopBadgeWidth = isDesktop ? 'w-[63%]' : 'w-[93%]';
  const desktopLeft = isDesktop ? 'left-[18.5%]' : 'left-[2.5%]';
  const slimWidth = isDesktop ? 'w-[76%]' : 'w-[100%]';
  const slimLeftShift = isDesktop ? 'left-[9.5%]' : 'left-1/2 -translate-x-1/2';
  
  return (
    <div className={`absolute z-20 pointer-events-none ${isSlim ? `-bottom-2 ${slimLeftShift} ${slimWidth}` : `-bottom-1.5 ${desktopLeft} ${desktopBadgeWidth}`}`}>
      <div 
        className="relative w-full"
        style={{
          filter: `drop-shadow(0 4px 4px ${getShadowColor()})`,
          transform: 'skewX(-12deg)',
          transformOrigin: 'bottom'
        }}
      >
        <div 
          className="relative overflow-hidden rounded-b-[3px]"
          style={{
            clipPath: 'polygon(0% 100%, 0% 0%, 1.5% 10%, 4% 18%, 9% 20%, 96% 12%, 98% 10%, 99.5% 5%, 100% 0%, 100% 100%)',
            backgroundImage: getGradient(),
            paddingTop: isSlim ? (isDesktop ? '0.55rem' : '0.9rem') : '0.4rem',
            paddingBottom: isSlim ? (isDesktop ? '0.28rem' : '0.45rem') : '0.2rem'
          }}
        >
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 mix-blend-overlay pointer-events-none"></div>
          <div 
            className="relative flex items-center justify-center px-1.5 gap-1"
            style={{ transform: 'skewX(12deg)' }}
          >
            <IconComponent className={`text-white drop-shadow-sm ${isSlim ? 'w-2.5 h-2.5' : 'w-2.5 h-2.5'}`} />
            <span className={`text-white font-bold tracking-wide uppercase drop-shadow-sm font-sans whitespace-nowrap ${isSlim ? 'text-[8px]' : 'text-[7px]'}`}>
              {text}
            </span>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default GameCardBadge;

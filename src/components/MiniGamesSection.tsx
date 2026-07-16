import { useResponsive } from "@/hooks/use-mobile";
import { ShoppingCart, Gamepad2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import eightBallGameplay from "@/assets/8ball-gameplay.gif";
import eightBallBackground from "@/assets/8ball-background.png";
import eightBallLogoGlow from "@/assets/8ball-logo-glow.png";
import ludoWorldBg from "@/assets/ludo-world-bg.gif";
import eightBallIcon from "@/assets/8ball-icon.png";
import ludoWorldIconNew from "@/assets/ludo-world-icon.png";

// Ludo World logo from existing uploads (for mobile)
const ludoWorldLogo = "/lovable-uploads/f3b06fa9-aaf6-4c08-a872-7fe40a355215.png";

// Preload critical GIFs
const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

interface MiniGamesSectionProps {
  className?: string;
}

const MiniGamesSection = ({ className = "" }: MiniGamesSectionProps) => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();

  // Preload GIFs on component mount
  useEffect(() => {
    preloadImage(ludoWorldBg);
    preloadImage(eightBallGameplay);
  }, []);

  const handlePlayNow = (gameUrl: string) => {
    window.open(gameUrl, "_blank");
  };

  const handleShop = (shopUrl: string) => {
    window.open(shopUrl, "_blank");
  };

  return (
    <div className={`mb-8 ${className}`}>
      {/* Section Header */}
      <h2 className="text-xl md:text-2xl text-white font-bold tracking-wide mb-3">
        {t('miniGames.title', 'MINI GAMES')}
      </h2>
      
      {/* Description text with More Details link */}
      <p className="text-gray-400 text-[11px] md:text-sm mb-6">
        {t('miniGames.description', 'Please note that the mini games available on the Midasbuy website are operated by third party providers and not by Midasbuy.')}{" "}
        <a 
          href="https://www.midasbuy.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          {t('miniGames.moreDetails', 'More Details')}
        </a>
      </p>

      {/* Pool City - 8 Ball Card */}
      <div 
        className="relative overflow-hidden mb-4"
        style={{
          borderRadius: "6px",
          background: "rgba(15, 20, 35, 1)",
        }}
      >
        {/* Content overlay */}
        <div className="relative z-10">
          {isMobile ? (
            // Mobile Layout - matching reference exactly
            <div>
              {/* Top section with background - icon and text only */}
              <div className="relative p-3 pr-3 pb-2">
                {/* Background image - full width, covers icon and text area */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${eightBallBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                
                {/* Bottom edge blur on background image - 5% more height, 90% blur */}
                <div 
                  className="absolute left-0 right-0 z-[5]"
                  style={{
                    bottom: "0",
                    height: "14px",
                    background: "linear-gradient(to top, rgba(15, 20, 35, 0.95) 0%, rgba(15, 20, 35, 0.8) 50%, transparent 100%)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                />
                
                {/* Gradient overlay - only 30% blur, 70% visible */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(20, 25, 50, 0.25) 0%, rgba(40, 20, 60, 0.3) 50%, rgba(15, 20, 40, 0.35) 100%)",
                    backdropFilter: "blur(0.8px)",
                  }}
                />
                
                {/* Bottom blur gradient - behind Play button area, not overlapping */}
                <div 
                  className="absolute left-0 right-0 h-10 z-0"
                  style={{
                    bottom: "-40px",
                    background: "linear-gradient(to bottom, transparent 0%, rgba(15, 20, 35, 0.5) 40%, rgba(15, 20, 35, 0.9) 100%)",
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                  }}
                />
                
                {/* Mini Games tag - 10% smaller, corner touch, 1% round */}
                <div 
                  className="absolute top-0 right-0 text-[8px] font-semibold px-1.5 py-0.5 flex items-center gap-0.5 z-20"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#000",
                    borderBottomLeftRadius: "3px",
                  }}
                >
                  {/* Gamepad icon - black filled with two white dots */}
                  <svg 
                    width="10" 
                    height="10" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    {/* Gamepad body - black filled */}
                    <rect x="2" y="6" width="20" height="12" rx="3" fill="#000" />
                    {/* Left white dot */}
                    <circle cx="8" cy="12" r="1.5" fill="#fff" />
                    {/* Right white dot */}
                    <circle cx="16" cy="12" r="1.5" fill="#fff" />
                  </svg>
                  {t('miniGames.tag', 'Mini Games')}
                </div>
                
                {/* Icon and Text row */}
                <div className="relative flex items-start pt-1">
                  {/* 8 Ball Logo with glow effect - corner touch, 6% more up */}
                  <div className="relative w-24 h-24 flex-shrink-0 -ml-5 -mt-5">
                    <img 
                      src={eightBallLogoGlow} 
                      alt="8 Ball Glow"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={eightBallIcon} 
                        alt="8 Ball Pool"
                        className="w-[45%] h-[45%] object-contain"
                        style={{
                          borderRadius: "18%",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                          transform: "rotate(-5deg)",
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Text content - 5% smaller and more left */}
                  <div className="flex-1 pt-4 -ml-1">
                    <h3 className="text-white text-base font-bold leading-tight">POOL CITY - 8 BALL</h3>
                    <p className="text-gray-300 text-xs mt-1 leading-snug">
                      {t('miniGames.noDownload', 'No app download needed! Play instantly on Midasbuy!')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Buttons section - glass effect 5% blur */}
              <div 
                className="relative p-3 pt-3"
                style={{
                  background: "rgba(255, 255, 255, 0.01)",
                  backdropFilter: "blur(1px)",
                  WebkitBackdropFilter: "blur(1px)",
                }}
              >
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShop("https://www.midasbuy.com/midasbuy/pk/buy/poolcity8ball")}
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
                    style={{
                      background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                      boxShadow: "0 4px 12px rgba(0, 114, 255, 0.4)",
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handlePlayNow("https://www.midasbuy.com/midasbuy/pk/buy/poolcity8ball")}
                    className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-white transition-all hover:brightness-110"
                    style={{
                      background: "linear-gradient(180deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
                      boxShadow: "0 4px 16px rgba(249, 115, 22, 0.4)",
                    }}
                  >
                    <Gamepad2 className="w-5 h-5" />
                    {t('miniGames.playNow', 'Play Now')}
                  </button>
                </div>
              </div>
              
              {/* Gameplay GIF - same glass effect 5% blur */}
              <div 
                className="p-3 pt-3"
                style={{
                  background: "rgba(255, 255, 255, 0.01)",
                  backdropFilter: "blur(1px)",
                  WebkitBackdropFilter: "blur(1px)",
                }}
              >
                <div 
                  className="overflow-hidden"
                  style={{ borderRadius: "10px" }}
                >
                  <img 
                    src={eightBallGameplay} 
                    alt="8 Ball Pool Gameplay"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Desktop & Tablet Layout - matching reference exactly
            <div className="flex items-center py-8 px-8">
              {/* Left - 8 Ball Logo with glow - icon with proper rounded corners */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <img 
                  src={eightBallLogoGlow} 
                  alt="8 Ball Glow"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={eightBallIcon} 
                    alt="8 Ball Pool"
                    className="w-[55%] h-[55%] object-contain"
                    style={{
                      borderRadius: "18%",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
                    }}
                  />
                </div>
              </div>
              
              {/* Center - Text and Buttons */}
              <div className="flex-1 px-8">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white text-2xl font-bold tracking-wide">POOL CITY - 8 BALL</h3>
                  <div 
                    className="text-black text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {/* Gamepad icon - larger, black body with white dots */}
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                    >
                      {/* Gamepad body - black filled */}
                      <rect x="2" y="6" width="20" height="12" rx="3" fill="#000" />
                      {/* Left white dot */}
                      <circle cx="8" cy="12" r="1.5" fill="#fff" />
                      {/* Right white dot */}
                      <circle cx="16" cy="12" r="1.5" fill="#fff" />
                    </svg>
                    {t('miniGames.tag', 'Mini Games')}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-5">
                  {t('miniGames.noDownloadDesktop', 'No app download needed! Play instantly on')} <span className="text-blue-400">Midasbuy!</span>
                </p>
                
                {/* Buttons matching reference exactly */}
                <div className="flex gap-3 items-center">
                  {/* Shop Button - Navigation gradient like Ludo World Play Now */}
                  <button
                    onClick={() => handleShop("https://www.midasbuy.com/midasbuy/pk/buy/poolcity8ball")}
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
                    style={{
                      background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                      boxShadow: "0 4px 12px rgba(0, 114, 255, 0.4)",
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </button>
                  
                  {/* Play Now Button - Orange gradient, wide */}
                  <button
                    onClick={() => handlePlayNow("https://www.midasbuy.com/midasbuy/pk/buy/poolcity8ball")}
                    className="px-20 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-white transition-all hover:brightness-110"
                    style={{
                      background: "linear-gradient(180deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
                      boxShadow: "0 4px 16px rgba(249, 115, 22, 0.4)",
                    }}
                  >
                    <Gamepad2 className="w-5 h-5" />
                    {t('miniGames.playNow', 'Play Now')}
                  </button>
                </div>
              </div>
              
              {/* Right - Gameplay GIF with special corner design like reference */}
              {/* Left corners less rounded, right corners more rounded with decorative frame */}
              <div 
                className="w-80 h-44 flex-shrink-0 overflow-hidden relative"
                style={{
                  borderRadius: "8px 20px 20px 8px",
                  border: "3px solid rgba(139, 92, 246, 0.4)",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)",
                }}
              >
                {/* Corner decorations */}
                <div 
                  className="absolute top-0 right-0 w-8 h-8 z-10"
                  style={{
                    background: "linear-gradient(135deg, transparent 50%, rgba(234, 179, 8, 0.6) 50%)",
                    borderRadius: "0 17px 0 0",
                  }}
                />
                <div 
                  className="absolute bottom-0 right-0 w-8 h-8 z-10"
                  style={{
                    background: "linear-gradient(45deg, transparent 50%, rgba(234, 179, 8, 0.6) 50%)",
                    borderRadius: "0 0 17px 0",
                  }}
                />
                <img 
                  src={eightBallGameplay} 
                  alt="8 Ball Pool Gameplay"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ludo World Card - Width reduced by 20% from right, ending after Play button */}
      <div 
        className={`relative rounded-xl overflow-hidden ${isMobile ? 'w-full' : 'w-[42%]'}`}
      >
        {/* Background GIF image - full visible */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${ludoWorldBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Glass blur overlay - PC version */}
        {!isMobile && (
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(30, 45, 70, 0.5) 0%, rgba(60, 50, 100, 0.4) 50%, rgba(120, 100, 60, 0.35) 100%)",
              backdropFilter: "blur(1px)",
            }}
          />
        )}
        
        {/* Mobile: Dark blue gradient from left to center, background 1-2% visible */}
        {isMobile && (
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(10, 22, 40, 0.92) 0%, rgba(15, 30, 55, 0.85) 40%, rgba(20, 35, 60, 0.4) 70%, transparent 100%)",
              backdropFilter: "blur(0.5px)",
            }}
          />
        )}
        
        <div className="relative z-10 flex items-center p-4">
          {/* Ludo World Logo - new icon for PC, old for mobile */}
          <div className="w-14 h-14 flex-shrink-0 mr-4">
            <img 
              src={isMobile ? ludoWorldLogo : ludoWorldIconNew} 
              alt="Ludo World"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          
          {/* Text and Buttons */}
          <div className="flex-1">
            <h3 className="text-white text-base font-bold mb-2">LUDO WORLD</h3>
            
            <div className="flex gap-2">
              {/* Shop Button - with navigation gradient border */}
              <button
                onClick={() => handleShop("https://www.midasbuy.com/midasbuy/pk/shop/ludo")}
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all hover:brightness-110"
                style={{
                  background: "rgba(30, 40, 60, 0.8)",
                  border: "1px solid #00c6ff",
                  color: "#00c6ff",
                }}
              >
                <ShoppingCart className="w-4 h-4" style={{ color: "#00c6ff" }} />
                {t('miniGames.shop', 'Shop')}
              </button>
              
              {/* Play Now Button - Navigation gradient */}
              <button
                onClick={() => handlePlayNow("https://www.midasbuy.com/midasbuy/pk/shop/ludo")}
                className="px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                  boxShadow: "0 4px 12px rgba(0, 114, 255, 0.3)",
                }}
              >
                <Gamepad2 className="w-4 h-4" />
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGamesSection;

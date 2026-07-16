import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useResponsive } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import "./DiscoverOtherRegionGames.css";

// Import game icons
import whiteoutSurvival from "@/assets/region-games/whiteout-survival.png";
import crystalGame from "@/assets/region-games/crystal-game.png";
import sniperGame from "@/assets/region-games/sniper-game.png";
import animeGirl from "@/assets/region-games/anime-girl.png";
import civEras from "@/assets/region-games/civ-eras.png";
import jooxMusic from "@/assets/region-games/joox-music.png";
import saturnPlanet from "@/assets/region-games/saturn-planet.png";
import crossfire from "@/assets/region-games/crossfire.jpeg";
import wetv from "@/assets/region-games/wetv.png";
import animeGirl2 from "@/assets/region-games/anime-girl-2.png";

// New region games data with uploaded icons + Free Fire and BGMI
const otherRegionGames = [
  { id: "region-ff", name: "Free Fire", image: "/lovable-uploads/free-fire-logo.webp" },
  { id: "region-bgmi", name: "BGMI", image: "/lovable-uploads/5b1c2388-538d-4898-9cfa-21f6551e25ef.png" },
  { id: "region-1", name: "Whiteout Survival", image: whiteoutSurvival },
  { id: "region-2", name: "Crystal Game", image: crystalGame },
  { id: "region-3", name: "Sniper Game", image: sniperGame },
  { id: "region-4", name: "Anime Character", image: animeGirl },
  { id: "region-5", name: "CIV Eras & Allies", image: civEras },
  { id: "region-6", name: "JOOX Music", image: jooxMusic },
  { id: "region-7", name: "Saturn Planet", image: saturnPlanet },
  { id: "region-8", name: "CrossFire", image: crossfire },
  { id: "region-9", name: "WeTV", image: wetv },
  { id: "region-10", name: "Anime Girl 2", image: animeGirl2 },
];

const DiscoverOtherRegionGames = () => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleViewAllClick = () => {
    console.log("View all region games");
  };

  return (
    <div className="relative mb-6" dir="ltr">
      {/* Main container */}
      <div 
        className="relative rounded-xl overflow-hidden z-10"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Blue corner glow effect - intense glow from top-left corner */}
        <div 
          className="absolute -top-4 -left-4 w-32 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.4) 30%, rgba(59, 130, 246, 0.15) 60%, transparent 85%)",
            filter: "blur(12px)",
          }}
        />
        
        <div className={`relative ${isMobile ? 'p-3' : 'p-4 py-5'}`}>
          {/* Title - smaller on mobile */}
          <h3 className={`text-white font-bold uppercase tracking-wide ${isMobile ? 'text-[11px] mb-2.5' : 'text-base mb-4'}`}>
            {t('discoverOtherRegionGames', 'DISCOVER OTHER REGION GAMES')}
          </h3>
          
          {/* Scrollable games row with "X Games" indicator */}
          <div className="flex items-center gap-2">
            {/* CSS-based auto-scrollable container (same as payment icons) */}
            <div 
              ref={scrollContainerRef}
              className="discover-games-container flex-1"
            >
              <div className={`discover-games-scroll ${isMobile ? 'gap-2' : 'gap-3'}`}>
                {/* Duplicate games for seamless loop */}
                {[...otherRegionGames, ...otherRegionGames].map((game, index) => (
                  <div 
                    key={`${game.id}-${index}`}
                    className={`discover-game-icon flex-shrink-0 cursor-pointer transition-transform hover:scale-105 ${
                      isMobile ? 'w-[52px] h-[52px]' : 'w-16 h-16'
                    }`}
                  >
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Games count indicator - vertical layout on mobile with arrow on right of 15 */}
            <button 
              onClick={handleViewAllClick}
              className={`flex-shrink-0 flex hover:opacity-80 transition-opacity ${
                isMobile ? 'flex-col items-center gap-0 ml-0' : 'flex-row items-center gap-1.5'
              }`}
            >
              {/* 15 with arrow on its right (centered vertically) */}
              <div className="flex items-center gap-0.5">
                <span 
                  className={`font-bold ${isMobile ? 'text-lg leading-none' : 'text-3xl'}`}
                  style={{ 
                    color: "hsl(43 85% 45%)",
                    textShadow: "0 0 10px hsla(43 85% 45% / 0.45)",
                  }}
                >
                  15
                </span>
                {/* Arrow - 7% bigger, positioned to right of 15 */}
                <ChevronRight 
                  className={`${isMobile ? 'w-[14px] h-[14px]' : 'w-5 h-5'}`} 
                  style={{ color: "hsl(220 10% 60%)" }} 
                />
              </div>
              {/* Games text below */}
              <span className={`${isMobile ? 'text-[10px]' : 'text-sm'}`} style={{ color: "hsl(220 10% 60%)" }}>{t('games', 'Games')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverOtherRegionGames;

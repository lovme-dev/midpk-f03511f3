import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useResponsive } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import { useRef, useCallback } from "react";

import AutoScrollableRow, { AutoScrollableRowRef } from "@/components/AutoScrollableRow";
import GameCardBadge from "@/components/GameCardBadge";
import bgmiGameIcon from "@/assets/bgmi-game-icon.png";
import freeFireGameIcon from "@/assets/free-fire-game-icon.png";
import robloxGameIcon from "@/assets/roblox-game-icon.png";
import valorantGameIcon from "@/assets/valorant-game-icon.png";
import PromotionCarouselBanner from "@/components/PromotionCarouselBanner";
const popularGames = [
  {
    id: "pubg-001",
    name: "PUBG MOBILE",
    image: "/lovable-uploads/1ebc2015-cced-4512-97ef-41ea5b45cbb3.png",
    tag: "EXTRA DISCOUNT",
    tagColor: "bg-yellow-500",
    icon: "like" as const,
    variant: "orange" as const,
    badgeImage: "/images/extra-discount-badge.png"
  },
  {
    id: "bgmi-001",
    name: "BGMI",
    image: bgmiGameIcon,
    tag: "EXTRA BONUS",
    tagColor: "bg-blue-500",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "free-fire-001",
    name: "FREE FIRE",
    image: freeFireGameIcon,
    tag: "EXTRA BONUS",
    tagColor: "bg-red-500",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "roblox-015",
    name: "ROBLOX",
    image: robloxGameIcon,
    tag: "EXTRA DISCOUNT",
    tagColor: "bg-green-500",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-discount-badge.png"
  },
  {
    id: "valorant-001",
    name: "VALORANT POINTS",
    image: valorantGameIcon,
    tag: "EXTRA BONUS",
    tagColor: "bg-red-600",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "honor-001",
    name: "HONOR OF KINGS",
    image: "/lovable-uploads/856ab158-628e-4ea5-bc2a-cbef604d4450.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-orange-500",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/hok"
  },
  {
    id: "delta-002",
    name: "DELTA FORCE",
    image: "/lovable-uploads/2fea52fa-bb64-449a-a621-4676c8ca5893.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-green-500",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/dfm"
  },
  {
    id: "warpath-004",
    name: "DRAGONHEIR: SILENT GODS",
    image: "/lovable-uploads/6e36d4af-addb-4da8-8c62-7f707ea5352c.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-red-500",
    icon: "fire" as const,
    variant: "green" as const,
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/dragonheir-silent-gods?from=self.midasbuy_saas"
  },
  {
    id: "assasin-007",
    name: "UNDAWN",
    image: "/lovable-uploads/5b12ff1d-7fe9-4289-960b-9473171ba2db.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-green-600",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/undawngl"
  },
  {
    id: "pubg-008",
    name: "ARENA BREAKOUT",
    image: "/lovable-uploads/65f01d50-4fcd-42e6-b557-d74154b5fc40.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-indigo-500",
    icon: "fire" as const,
    variant: "red" as const,
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/uamo#/pages/shop/currency"
  },
  {
    id: "huang-010",
    name: "HUANG",
    image: "/lovable-uploads/902150dc-2450-4a9d-9038-9af359a67315.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-blue-400",
    icon: "fire" as const,
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "air-command-011",
    name: "AIR COMMAND",
    image: "/lovable-uploads/b5182d46-5cf8-490f-b0c2-35d4566044a6.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-amber-600",
    icon: "fire" as const,
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "nba-live-013",
    name: "NBA INFINITE",
    image: "/lovable-uploads/ff4286e3-719a-4084-a7b0-05a04b251171.png",
    tag: "",
    tagColor: "bg-blue-500",
    icon: "fire" as const,
    hideBadge: true,
    link: "https://www.midasbuy.com/midasbuy/pk/buy/nba?from=self.midasbuy_saas"
  }
];

interface ShopTabContentProps {
  onTabChange?: (tab: "purchase") => void;
}

const ShopTabContent = ({ onTabChange }: ShopTabContentProps) => {
  const { isMobile } = useResponsive();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Refs for synchronized scrolling
  const row1Ref = useRef<AutoScrollableRowRef>(null);
  const row2Ref = useRef<AutoScrollableRowRef>(null);

  // Synchronized scroll handlers
  const handleRow1Scroll = useCallback((scrollLeft: number, maxScroll: number) => {
    if (row2Ref.current) {
      const row2MaxScroll = row2Ref.current.getMaxScroll();
      const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      row2Ref.current.scrollTo(scrollRatio * row2MaxScroll);
    }
  }, []);

  const handleRow2Scroll = useCallback((scrollLeft: number, maxScroll: number) => {
    if (row1Ref.current) {
      const row1MaxScroll = row1Ref.current.getMaxScroll();
      const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      row1Ref.current.scrollTo(scrollRatio * row1MaxScroll);
    }
  }, []);

  const handleGameClick = (game: typeof popularGames[0]) => {
    if (game.name === "PUBG MOBILE") {
      onTabChange?.("purchase");
    } else if (game.name === "BGMI") {
      navigate("/bgmi");
    } else if (game.name === "FREE FIRE") {
      navigate("/free-fire");
    } else if (game.name === "ROBLOX") {
      navigate("/roblox");
    } else if (game.name === "VALORANT POINTS") {
      navigate("/valorant");
    } else if (game.link) {
      window.location.href = game.link;
    } else {
      toast({
        title: t('shopTab.gameSelected', '{{name}} Selected', { name: game.name }),
        description: t('shopTab.notAvailableYet', 'This product is not available yet. Coming soon!'),
        variant: "default",
      });
    }
  };

  return (
    <div className="py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Promotional Banner Carousel - Same as Purchase tab */}
        <PromotionCarouselBanner className="mb-6" />
        
        <div className="mb-6 mt-[8%]">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl text-white font-bold uppercase">{t('shopTab.popularGames', 'POPULAR GAMES')}</h2>
          </div>
          
          {/* Mobile Layout - Two horizontal scrollable rows with synchronized scroll */}
          {isMobile ? (
            <div className="space-y-4">
              <AutoScrollableRow 
                ref={row1Ref}
                games={popularGames.slice(0, 6)}
                onGameClick={handleGameClick}
                autoScrollSpeed={20}
                onScroll={handleRow1Scroll}
              />
              
              <AutoScrollableRow 
                ref={row2Ref}
                games={popularGames.slice(6, 12)}
                onGameClick={handleGameClick}
                autoScrollSpeed={25}
                onScroll={handleRow2Scroll}
              />
            </div>
          ) : (
            /* Desktop Layout - Grid with same badge style as mobile */
            <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {popularGames.slice(0, 8).map((game) => (
                  <div 
                    key={game.id} 
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => handleGameClick(game)}
                  >
                    {/* Image Container - shifted 2% right for PC */}
                    <div className="relative w-full overflow-visible pl-[2%]" style={{ paddingBottom: '8px' }}>
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full aspect-square object-cover rounded-[1.2rem] rounded-br-[2rem] rounded-tl-[2rem] transition-transform group-hover:scale-105"
                        style={{
                          boxShadow: '0 8px 25px -6px rgba(0, 0, 0, 0.5)'
                        }}
                      />
                      {/* Custom Badge - narrower and thinner for desktop */}
                      {!game.hideBadge && (
                        <GameCardBadge text={game.tag} size="slim" icon={game.icon || 'like'} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} isDesktop={true} />
                      )}
                    </div>
                    {/* Game Name below the card */}
                    <h3 className="text-white text-xs font-black text-center mt-3 uppercase tracking-wide">{game.name}</h3>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {popularGames.slice(8, 13).map((game) => (
                  <div 
                    key={game.id} 
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => handleGameClick(game)}
                  >
                    {/* Image Container - shifted 2% right for PC */}
                    <div className="relative w-full overflow-visible pl-[2%]" style={{ paddingBottom: '8px' }}>
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full aspect-square object-cover rounded-[1.2rem] rounded-br-[2rem] rounded-tl-[2rem] transition-transform group-hover:scale-105"
                        style={{
                          boxShadow: '0 8px 25px -6px rgba(0, 0, 0, 0.5)'
                        }}
                      />
                      {/* Custom Badge - narrower and thinner for desktop */}
                      {!game.hideBadge && (
                        <GameCardBadge text={game.tag} size="slim" icon={game.icon || 'like'} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} isDesktop={true} />
                      )}
                    </div>
                    {/* Game Name below the card */}
                    <h3 className="text-white text-xs font-black text-center mt-3 uppercase tracking-wide">{game.name}</h3>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopTabContent;

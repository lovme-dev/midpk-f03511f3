import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useResponsive } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PromotionBanner from "@/components/PromotionBanner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCurrencyFromURL } from "@/utils/urlCurrencyDetector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";

import MiniGamesSection from "@/components/MiniGamesSection";
import DiscoverOtherRegionGames from "@/components/DiscoverOtherRegionGames";
import FeatureBoxesCarousel from "@/components/FeatureBoxesCarousel";
import AutoScrollableRow, { AutoScrollableRowRef } from "@/components/AutoScrollableRow";
import GameCardBadge from "@/components/GameCardBadge";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import InternationalSEOHelmet from "@/components/SEO/InternationalSEOHelmet";
import MidasbuyVideoSection from "@/components/MidasbuyVideoSection";
import AllGamesPopup from "@/components/AllGamesPopup";
import NewsGameFilterPopup from "@/components/NewsGameFilterPopup";



import bgmiGameIcon from "@/assets/bgmi-game-icon.png";
import freeFireGameIcon from "@/assets/free-fire-game-icon.png";
import robloxGameIcon from "@/assets/roblox-game-icon.png";
import valorantGameIcon from "@/assets/valorant-game-icon.png";
import LoadingScreen from "@/components/LoadingScreen";

interface GamingShopProps {
  onLogout: () => void;
  disableSeo?: boolean;
  beforeFooterSlot?: React.ReactNode;
}

type GameBadgeIcon = 'like' | 'fire';

interface PopularGame {
  id: string;
  name: string;
  image: string;
  tag: string;
  tagColor: string;
  link?: string;
  icon?: GameBadgeIcon;
  hideBadge?: boolean;
  variant?: 'orange' | 'red' | 'green';
  badgeImage?: string;
}

const popularGames: PopularGame[] = [
  {
    id: "pubg-001",
    name: "PUBG MOBILE",
    image: "/lovable-uploads/1ebc2015-cced-4512-97ef-41ea5b45cbb3.png",
    tag: "EXTRA DISCOUNT",
    tagColor: "bg-yellow-500",
    icon: "like",
    variant: "orange",
    badgeImage: "/images/extra-discount-badge.png"
  },
  {
    id: "bgmi-001",
    name: "BGMI",
    image: bgmiGameIcon,
    tag: "EXTRA BONUS",
    tagColor: "bg-blue-500",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "free-fire-001",
    name: "FREE FIRE",
    image: freeFireGameIcon,
    tag: "EXTRA BONUS",
    tagColor: "bg-red-500",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "roblox-015",
    name: "ROBLOX",
    image: robloxGameIcon,
    tag: "EXTRA DISCOUNT",
    tagColor: "bg-green-500",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-discount-badge.png"
  },
  {
    id: "valorant-001",
    name: "VALORANT POINTS",
    image: valorantGameIcon,
    tag: "EXTRA BONUS",
    tagColor: "bg-red-600",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "honor-001",
    name: "HONOR OF KINGS",
    image: "/lovable-uploads/856ab158-628e-4ea5-bc2a-cbef604d4450.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-orange-500",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/hok"
  },
  {
    id: "delta-002",
    name: "DELTA FORCE",
    image: "/lovable-uploads/2fea52fa-bb64-449a-a621-4676c8ca5893.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-green-500",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/dfm"
  },
  {
    id: "warpath-004",
    name: "DRAGONHEIR: SILENT GODS",
    image: "/lovable-uploads/6e36d4af-addb-4da8-8c62-7f707ea5352c.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-red-500",
    icon: "fire",
    variant: "green",
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/dragonheir-silent-gods?from=self.midasbuy_saas"
  },
  {
    id: "assasin-007",
    name: "UNDAWN",
    image: "/lovable-uploads/5b12ff1d-7fe9-4289-960b-9473171ba2db.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-green-600",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/undawngl"
  },
  {
    id: "pubg-008",
    name: "ARENA BREAKOUT",
    image: "/lovable-uploads/65f01d50-4fcd-42e6-b557-d74154b5fc40.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-indigo-500",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/buy/uamo#/pages/shop/currency"
  },
  {
    id: "huang-010",
    name: "HUANG",
    image: "/lovable-uploads/902150dc-2450-4a9d-9038-9af359a67315.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-blue-400",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "air-command-011",
    name: "AIR COMMAND",
    image: "/lovable-uploads/b5182d46-5cf8-490f-b0c2-35d4566044a6.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-amber-600",
    icon: "fire",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png"
  },
  {
    id: "nba-live-013",
    name: "NBA INFINITE",
    image: "/lovable-uploads/ff4286e3-719a-4084-a7b0-05a04b251171.png",
    tag: "",
    tagColor: "bg-blue-500",
    icon: "fire",
    hideBadge: true,
    link: "https://www.midasbuy.com/midasbuy/pk/buy/nba?from=self.midasbuy_saas"
  },
  {
    id: "ludo-world-014",
    name: "LUDO WORLD",
    image: "/lovable-uploads/f3b06fa9-aaf6-4c08-a872-7fe40a355215.png",
    tag: "EXTRA BONUS",
    tagColor: "bg-yellow-500",
    variant: "red",
    badgeImage: "/images/extra-bonus-badge.png",
    link: "https://www.midasbuy.com/midasbuy/pk/shop/ludo?from=self.midasbuy_saas#/pages/shop/items"
  }
];

// Generate dynamic dates based on current date
const generateNewsDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNewsItems = (t: any) => [
  {
    id: "news-001",
    title: t('news.nikkeBonus', 'Get extra 100% NIKKE bonus on first top-up!'),
    image: "/lovable-uploads/dfb25af0-bb1f-4633-96bd-82035761c5b8.png",
    date: generateNewsDate(-5),
    endDate: generateNewsDate(25),
    publisher: "Midasbuy",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-002",
    title: t('news.registerFreeSkin', 'Register to get free skin'),
    image: "/lovable-uploads/ccdccbbc-23f6-4c12-8ce8-2e6c870ef1ac.png",
    date: generateNewsDate(-7),
    endDate: generateNewsDate(23),
    publisher: "Arena Breakout",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-004",
    title: t('news.madDogGames', 'Mad Dog Games Lucky Treasure Hunt'),
    image: "/lovable-uploads/70aa4e1a-aaa1-4c17-86df-b193db69edda.png",
    date: generateNewsDate(-14),
    endDate: generateNewsDate(16),
    publisher: "Arena Breakout",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-005",
    title: t('news.hokPointsLottery', 'Honor of Kings Points Lottery'),
    image: "/lovable-uploads/58cd039f-6539-4372-b355-7e539896a7b2.png",
    date: generateNewsDate(-16),
    endDate: generateNewsDate(14),
    publisher: "Honor of Kings",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-006",
    title: t('news.apexCoinBonanza', 'Apex Coin Bonanza: First Buy, 2x Value!'),
    image: "/lovable-uploads/efcede1b-7e48-4ba0-81b9-875826d9b87a.png",
    date: generateNewsDate(-19),
    endDate: generateNewsDate(11),
    publisher: "Age of Empires",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-007",
    title: t('news.pubgVipBenefits', 'PUBG MOBILE VIP Benefits'),
    image: "/lovable-uploads/93d886d7-d872-4c31-850e-9938cfb8da17.png",
    date: generateNewsDate(-24),
    endDate: generateNewsDate(6),
    publisher: "PUBG MOBILE",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-008",
    title: t('news.purchaseBonus', 'Purchase Bonus'),
    image: "/lovable-uploads/949a4bdb-d126-4908-bf41-15b6af918ea8.png",
    date: generateNewsDate(-29),
    endDate: generateNewsDate(1),
    publisher: "PUBG MOBILE",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-009",
    title: t('news.extraBonus45', 'EXTRA BONUS ONLY ON MIDASBUY ENJOY UP TO 45% BONUS NOW'),
    image: "/lovable-uploads/2a70916a-be50-4ce2-a7ef-882b961fe54d.png",
    date: generateNewsDate(-34),
    endDate: generateNewsDate(-4),
    publisher: "Delta Force",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  },
  {
    id: "news-010",
    title: t('news.aoeDaily', 'Age of Empires Daily Packs'),
    image: "/lovable-uploads/cbd92d2e-e670-4c2c-b5dd-4edd925ea8c4.png",
    date: generateNewsDate(-39),
    endDate: generateNewsDate(-9),
    publisher: "Age of Empires",
    link: "https://www.midasbuy.com/pagedoo-s/one?s=1VeMe1443Oa&adtag=banner.promotions#/"
  }
];

const getNavigationTabs = (t: (key: string, options?: { defaultValue?: string }) => string) => [
  { id: "popular-games", label: t('popularGames', { defaultValue: 'POPULAR GAMES' }) },
  { id: "mini-games", label: t('miniGames', { defaultValue: 'MINI GAMES' }) },
  { id: "midasbuy-video", label: t('header.midasbuyVideo', { defaultValue: 'MIDASBUY VIDEO' }) },
  { id: "latest-news", label: t('latestNews', { defaultValue: 'LATEST NEWS' }) },
  { id: "about-midasbuy", label: t('aboutMidasbuy', { defaultValue: 'ABOUT MIDASBUY' }) },
];

const GamingShopPage = ({ onLogout, disableSeo = false, beforeFooterSlot }: GamingShopProps) => {
  const { t } = useTranslation();
  const { countryCode } = useParams<{ countryCode: string }>();
  const isIndia = countryCode?.toLowerCase() === 'in';
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [showAllGamesPopup, setShowAllGamesPopup] = useState(false);
  const [showNewsFilterPopup, setShowNewsFilterPopup] = useState(false);
  const [selectedNewsGame, setSelectedNewsGame] = useState("All");
  const [activeSection, setActiveSection] = useState("popular-games");
  const [showNavigation, setShowNavigation] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter BGMI - only visible for India
  const filteredGames = isIndia ? popularGames : popularGames.filter(g => g.id !== 'bgmi-001');
  
  // Section refs for scroll tracking
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for synchronized scrolling in ALL GAMES mobile rows
  const allGamesRow1Ref = useRef<AutoScrollableRowRef>(null);
  const allGamesRow2Ref = useRef<AutoScrollableRowRef>(null);
  
  // Synchronized scroll handlers for ALL GAMES mobile rows
  const handleAllGamesRow1Scroll = useCallback((scrollLeft: number, maxScroll: number) => {
    if (allGamesRow2Ref.current) {
      const row2MaxScroll = allGamesRow2Ref.current.getMaxScroll();
      const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      allGamesRow2Ref.current.scrollTo(scrollRatio * row2MaxScroll);
    }
  }, []);

  const handleAllGamesRow2Scroll = useCallback((scrollLeft: number, maxScroll: number) => {
    if (allGamesRow1Ref.current) {
      const row1MaxScroll = allGamesRow1Ref.current.getMaxScroll();
      const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      allGamesRow1Ref.current.scrollTo(scrollRatio * row1MaxScroll);
    }
  }, []);
  
  // Get localized navigation tabs
  const navigationTabs = getNavigationTabs(t);
  
  // Get localized news items
  const newsItems = getNewsItems(t);
  
  // Automatically set currency based on URL country code (for country-specific home pages)
  useCurrencyFromURL();

  // Handle scroll to detect active section and show navigation when header scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header
      const scrollY = window.scrollY;
      
      // Show navigation only when scrolled down (when header becomes sticky)
      setShowNavigation(scrollY > 50);
      
      let currentSection = "popular-games";
      
      // Use static IDs for scroll tracking (don't need translation here)
      const tabIds = ["popular-games", "mini-games", "midasbuy-video", "latest-news", "about-midasbuy"];
      
      for (const tabId of tabIds) {
        const element = sectionRefs.current[tabId];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = tabId;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = isMobile ? 110 : 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, [isMobile]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Midasbuy Gaming Shop - Game Currency Store",
    "description": "Your ultimate gaming destination for PUBG UC, Free Fire diamonds, and more game currencies. Secure, instant delivery with 24/7 support.",
    "url": "https://www.middasbuy.com/gaming-shop",
    "publisher": {
      "@type": "Organization",
      "name": "Midasbuy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.middasbuy.com/og-image.png"
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Get current country code for routing
  const getCountryCode = () => {
    try {
      const stored = localStorage.getItem('selectedCountry');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.code?.toLowerCase() || 'pk';
      }
    } catch {
      return 'pk';
    }
    return 'pk';
  };

  const handleGameClick = (game: typeof popularGames[0]) => {
    const countryCode = getCountryCode();
    
    if (game.name === "PUBG MOBILE") {
      navigate("/pubg-mobile");
    } else if (game.name === "BGMI") {
      navigate("/bgmi");
    } else if (game.name === "FREE FIRE") {
      navigate("/free-fire");
    } else if (game.name === "ROBLOX") {
      navigate("/roblox");
    } else if (game.name === "VALORANT POINTS") {
      navigate("/valorant");
    } else if (game.name === "HONOR OF KINGS") {
      navigate(`/midasbuy/${countryCode}/game/honorofkings`);
    } else if (game.name === "DELTA FORCE") {
      navigate(`/midasbuy/${countryCode}/game/deltaforce`);
    } else if (game.name === "DRAGONHEIR: SILENT GODS") {
      navigate(`/midasbuy/${countryCode}/game/dragonheir`);
    } else if (game.name === "UNDAWN") {
      navigate(`/midasbuy/${countryCode}/game/undawn`);
    } else if (game.name === "ARENA BREAKOUT") {
      navigate(`/midasbuy/${countryCode}/game/arenabreakout`);
    } else if (game.name === "NBA INFINITE") {
      navigate(`/midasbuy/${countryCode}/game/nba`);
    } else if (game.name === "LUDO WORLD") {
      navigate(`/midasbuy/${countryCode}/game/ludo`);
    } else if (game.link) {
      // Fallback for any other games with links - open externally
      window.location.href = game.link;
    } else {
      toast({
        title: `${game.name} Selected`,
        description: "This product is not available yet. Coming soon!",
        variant: "default",
      });
    }
  };

  const handlePlayerIdClick = () => {
    navigate("/player-id");
  };

  const handleNewsClick = (newsItem: typeof newsItems[0]) => {
    if (newsItem.link) {
      window.location.href = newsItem.link;
    }
  };

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      {!disableSeo && (
        <InternationalSEOHelmet 
          title="Gaming Shop - Buy Game Credits & Currency | Midasbuy Official Store"
          description="Buy game credits for all popular games - PUBG UC, Free Fire Diamonds, BGMI UC & more | Instant delivery | Lowest prices | 100% safe | Official Midasbuy Gaming Shop"
          keywords="gaming shop, game credits, buy game currency, midasbuy shop"
          pageType="gaming"
          canonicalUrl="/"
          ogImage="/og-gaming-shop.jpeg"
        />
      )}
      
      {/* Corner light effect removed */}
      
      <div className={isMobile ? 'mobile-header' : ''}>
        <Header 
          onLogout={onLogout} 
          showNavigation={showNavigation}
          activeSection={activeSection}
          onNavigationClick={handleTabClick}
        />
      </div>
      
      <main className={`pb-20 relative ${isMobile ? 'mobile-content mobile-main-container' : 'z-10 pt-16'}`}>
        <div className="w-full max-w-5xl mx-auto px-4">
          {isLoading ? (
            <LoadingScreen fullScreen={false} message="loading..." />
          ) : (
            <>
              {/* Feature Boxes Banner with integrated description */}
              <div className="mb-4 mt-4 md:mt-6">
                <FeatureBoxesCarousel className="" />
              </div>
              
              {/* POPULAR GAMES Section */}
              <div 
                ref={(el) => (sectionRefs.current["popular-games"] = el)}
                id="popular-games"
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-base md:text-xl text-white font-bold uppercase whitespace-nowrap">Midasbuy — {t('allGames', 'ALL GAMES')}</h1>
                    {/* Official recharge store text - hidden on mobile */}
                    {!isMobile && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span>We are the official recharge store by Tencent</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowAllGamesPopup(true)}
                    className="bg-midasbuy-navy/60 text-gray-300 text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 rounded-full flex items-center gap-1 hover:bg-midasbuy-navy transition-colors whitespace-nowrap"
                  >
                    {t('seeAll', 'See All')}
                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
                
                
                {/* Mobile Layout - Single unified scrollable container with 2-row grid */}
                {isMobile ? (
                  <div 
                    className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    dir="ltr"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    <div className="grid grid-rows-2 gap-y-4 gap-x-[2%]" style={{ gridTemplateColumns: 'repeat(7, 27vw)', width: 'max-content' }}>
                      {/* First Row - 7 games */}
                      {filteredGames.slice(0, 7).map((game) => (
                        game.name === "PUBG MOBILE" ? (
                          <Link 
                            key={game.id} 
                            to={`/midasbuy/${(JSON.parse(localStorage.getItem('selectedCountry') || '{"code":"us"}')?.code || 'us').toLowerCase()}/buy/pubgm`}
                            className="cursor-pointer group block"
                          >
                            <div className="flex flex-col items-center">
                              <div className="relative w-full overflow-visible transition-transform group-hover:scale-105 group-active:scale-95" style={{ height: '115%', paddingTop: '4%' }}>
                                <img 
                                  src={game.image} 
                                  alt={game.name} 
                                  className="w-full aspect-square rounded-md scale-[1.103] translate-x-[9%]"
                                  style={{ boxShadow: 'none', background: 'transparent' }}
                                  loading="eager"
                                  draggable={false}
                                />
                                {!game.hideBadge && (
                                  <GameCardBadge text={game.tag || 'EXTRA DISCOUNT'} icon={game.icon || 'like'} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} />
                                )}
                              </div>
                              <h3 className="text-white text-[9px] font-bold text-center mt-4 uppercase tracking-wide leading-tight">{game.name}</h3>
                            </div>
                          </Link>
                        ) : (
                          <div 
                            key={game.id} 
                            className="cursor-pointer group"
                            onClick={() => handleGameClick(game)}
                          >
                            <div className="flex flex-col items-center">
                              <div className="relative w-full overflow-visible transition-transform group-hover:scale-105 group-active:scale-95" style={{ height: '115%', paddingTop: '4%' }}>
                                <img 
                                  src={game.image} 
                                  alt={game.name} 
                                  className="w-full aspect-square rounded-md scale-[1.103] translate-x-[9%]"
                                  style={{ boxShadow: 'none', background: 'transparent' }}
                                  loading="eager"
                                  draggable={false}
                                />
                                {!game.hideBadge && (
                                  <GameCardBadge text={game.tag || 'EXTRA DISCOUNT'} icon={game.icon || 'like'} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} />
                                )}
                              </div>
                              <h3 className="text-white text-[9px] font-bold text-center mt-4 uppercase tracking-wide leading-tight">{game.name}</h3>
                            </div>
                          </div>
                        )
                      ))}
                      {/* Second Row - remaining games */}
                      {filteredGames.slice(7, 13).map((game) => (
                        <div 
                          key={game.id} 
                          className="cursor-pointer group"
                          onClick={() => handleGameClick(game)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-full overflow-visible transition-transform group-hover:scale-105 group-active:scale-95" style={{ height: '115%', paddingTop: '4%' }}>
                              <img 
                                src={game.image} 
                                alt={game.name} 
                                className="w-full aspect-square rounded-md scale-[1.103] translate-x-[9%]"
                                style={{ boxShadow: 'none', background: 'transparent' }}
                                loading="eager"
                                draggable={false}
                              />
                              {!game.hideBadge && (
                                <GameCardBadge text={game.tag || 'EXTRA DISCOUNT'} icon={game.icon || 'like'} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} />
                              )}
                            </div>
                            <h3 className="text-white text-[9px] font-bold text-center mt-4 uppercase tracking-wide leading-tight">{game.name}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Desktop Layout - Grid: 6 columns per row */
                  <div dir="ltr">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {filteredGames.slice(0, 6).map((game) => (
                        game.name === "PUBG MOBILE" ? (
                          <Link 
                            key={game.id} 
                            to="/pubg-mobile"
                            className="flex flex-col items-center cursor-pointer group block"
                          >
                            <div className="relative w-full pl-[13%] transition-transform group-hover:scale-105 group-active:scale-95">
                              <img 
                                src={game.image} 
                                alt={game.name} 
                                className="w-full aspect-square object-contain rounded-[1rem] rounded-br-[1.5rem] rounded-tl-[1.5rem]"
                              />
                              {/* Custom Badge - slim for desktop, 15% narrower */}
                              <GameCardBadge text={game.tag} size="slim" icon={game.icon} hideBadge={game.hideBadge} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} isDesktop={true} />
                            </div>
                            <h3 className="text-white text-xs font-black text-center mt-3 uppercase tracking-wide">{game.name}</h3>
                          </Link>
                        ) : (
                          <div 
                            key={game.id} 
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => handleGameClick(game)}
                          >
                            <div className="relative w-full pl-[13%] transition-transform group-hover:scale-105 group-active:scale-95">
                              <img 
                                src={game.image} 
                                alt={game.name} 
                                className="w-full aspect-square object-contain rounded-[1rem] rounded-br-[1.5rem] rounded-tl-[1.5rem]"
                              />
                              {/* Custom Badge - slim for desktop, 15% narrower */}
                              <GameCardBadge text={game.tag} size="slim" icon={game.icon} hideBadge={game.hideBadge} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} isDesktop={true} />
                            </div>
                            <h3 className="text-white text-xs font-black text-center mt-3 uppercase tracking-wide">{game.name}</h3>
                          </div>
                        )
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                      {filteredGames.slice(6, 12).map((game) => (
                        <div 
                          key={game.id} 
                          className="flex flex-col items-center cursor-pointer group"
                          onClick={() => handleGameClick(game)}
                        >
                          <div className="relative w-full pl-[13%] transition-transform group-hover:scale-105 group-active:scale-95">
                            <img 
                              src={game.image} 
                              alt={game.name} 
                              className="w-full aspect-square object-contain rounded-[1rem] rounded-br-[1.5rem] rounded-tl-[1.5rem]"
                            />
                            {/* Custom Badge - slim for desktop, 15% narrower */}
                            <GameCardBadge text={game.tag} size="slim" icon={game.icon} hideBadge={game.hideBadge} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} isDesktop={true} />
                          </div>
                          <h3 className="text-white text-xs font-black text-center mt-3 uppercase tracking-wide">{game.name}</h3>
                        </div>
                      ))}
                    </div>
                    
                    {/* Third row - remaining game */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                      {filteredGames.slice(12, 13).map((game) => (
                        <div 
                          key={game.id} 
                          className="flex flex-col items-center cursor-pointer group"
                          onClick={() => handleGameClick(game)}
                        >
                          <div className="relative w-full pl-[13%] transition-transform group-hover:scale-105 group-active:scale-95">
                            <img 
                              src={game.image} 
                              alt={game.name} 
                              className="w-full aspect-square object-contain rounded-[1rem] rounded-br-[1.5rem] rounded-tl-[1.5rem]"
                            />
                            {/* Custom Badge - slim for desktop, 15% narrower */}
                            <GameCardBadge text={game.tag} size="slim" icon={game.icon} hideBadge={game.hideBadge} variant={game.variant || (game.icon === 'fire' ? 'red' : 'orange')} badgeImage={game.badgeImage} isDesktop={true} />
                          </div>
                          <h3 className="text-white text-xs font-black text-center mt-3 uppercase tracking-wide">{game.name}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* DISCOVER OTHER REGION GAMES Section */}
              <DiscoverOtherRegionGames />
              
              {/* MINI GAMES Section */}
              <div 
                ref={(el) => (sectionRefs.current["mini-games"] = el)}
                id="mini-games"
              >
                <MiniGamesSection />
              </div>
              
              {/* MIDASBUY VIDEO Section */}
              <div 
                ref={(el) => (sectionRefs.current["midasbuy-video"] = el)}
                id="midasbuy-video"
              >
                <MidasbuyVideoSection />
              </div>
              
              {/* LATEST NEWS Section */}
              <div 
                ref={(el) => (sectionRefs.current["latest-news"] = el)}
                id="latest-news"
                className="mb-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl text-white font-bold tracking-wide">{t('latestNews')}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => setShowNewsFilterPopup(true)}
                  >
                    {selectedNewsGame === "All" ? t('all', 'All') : selectedNewsGame}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newsItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="group bg-midasbuy-navy/40 rounded-lg overflow-hidden cursor-pointer hover:bg-midasbuy-navy/60 transition-all duration-300"
                      onClick={() => handleNewsClick(item)}
                    >
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-48 object-cover transform transition-transform group-hover:scale-105 duration-300"
                        />
                        {item.endDate && (
                          <div 
                            className="absolute top-2 left-2 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-lg"
                            style={{
                              background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                            }}
                          >
                            {t('endsIn', 'Ends in')} {format(new Date(item.endDate), "yyyy-MM-dd")}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-white text-lg font-medium mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="font-medium">{item.publisher}</span>
                          <span className="mx-2">•</span>
                          <span>{format(new Date(item.date), "yyyy-MM-dd")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {beforeFooterSlot}
      
      <Footer />
      
      {/* All Games Popup */}
      <AllGamesPopup 
        isOpen={showAllGamesPopup} 
        onClose={() => setShowAllGamesPopup(false)} 
      />
      
      {/* News Game Filter Popup */}
      <NewsGameFilterPopup
        isOpen={showNewsFilterPopup}
        onClose={() => setShowNewsFilterPopup(false)}
        onSelectGame={setSelectedNewsGame}
        selectedGame={selectedNewsGame}
        onOpenAllGames={() => setShowAllGamesPopup(true)}
      />
    </div>
  );
};

export default GamingShopPage;

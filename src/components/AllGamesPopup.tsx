import { X, Flame, ThumbsUp, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import robloxLogo from "@/assets/roblox-logo.jpeg";
import midasbuyLogoPopup from "@/assets/midasbuy-logo-popup.png";
import ludoWorldLogo from "@/assets/ludo-world-logo.png";
import ballPoolLogo from "@/assets/8ball-pool-logo.png";
import dragonheirLogo from "@/assets/dragonheir-logo.png";
import nbaInfiniteLogo from "@/assets/nba-infinite-logo.png";
import arenaOfValorLogo from "@/assets/arena-of-valor-logo.png";
import undawnLogo from "@/assets/undawn-logo.png";
import arenaBreakoutLogo from "@/assets/arena-breakout-logo.png";
import ageOfEmpiresLogo from "@/assets/age-of-empires-logo.png";
import deltaForceLogo from "@/assets/delta-force-logo.png";
import honorOfKingsLogo from "@/assets/honor-of-kings-logo.png";
import pubgMobileLogo from "@/assets/pubg-mobile-logo.png";
import arenaBreakoutInfiniteLogo from "@/assets/arena-breakout-infinite-logo.png";

interface AllGamesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extended games list for the popup - exactly matching reference images
const allGames = [
  {
    id: "pubg-001",
    name: "PUBG MOBILE",
    image: pubgMobileLogo,
    tag: "Extra Discount",
    tagColor: "bg-orange-500",
    tagIcon: "thumbsup",
    route: "/pubg-mobile"
  },
  {
    id: "delta-002",
    name: "Delta Force",
    image: deltaForceLogo,
    tag: "EXTRA BONUS",
    tagColor: "bg-orange-500",
    tagIcon: "thumbsup",
    notAvailable: true
  },
  {
    id: "honor-001",
    name: "Honor of Kings",
    image: honorOfKingsLogo,
    tag: "EXTRA BONUS",
    tagColor: "bg-orange-500",
    tagIcon: "flame",
    notAvailable: true
  },
  {
    id: "bgmi-001",
    name: "BGMI",
    image: "/lovable-uploads/5b1c2388-538d-4898-9cfa-21f6551e25ef.png",
    tag: "Extra Bonus",
    tagColor: "bg-red-500",
    tagIcon: "flame",
    route: "/bgmi"
  },
  {
    id: "free-fire-001",
    name: "FREE FIRE",
    image: "/lovable-uploads/free-fire-logo.webp",
    tag: "Extra Bonus",
    tagColor: "bg-red-500",
    tagIcon: "flame",
    route: "/free-fire"
  },
  {
    id: "roblox-015",
    name: "ROBLOX",
    image: robloxLogo,
    tag: null,
    tagColor: "",
    tagIcon: "",
    route: "/roblox"
  },
  {
    id: "valorant-001",
    name: "VALORANT POINTS",
    image: "/lovable-uploads/valorant-points-logo.webp",
    tag: null,
    tagColor: "",
    tagIcon: "",
    route: "/valorant"
  },
  {
    id: "age-of-empires-001",
    name: "Age of Empires Mobile",
    image: ageOfEmpiresLogo,
    tag: "Extra Bonus",
    tagColor: "bg-red-500",
    tagIcon: "flame",
    notAvailable: true
  },
  {
    id: "arena-breakout-001",
    name: "Arena Breakout",
    image: arenaBreakoutInfiniteLogo,
    tag: "EXTRA BONUS",
    tagColor: "bg-orange-500",
    tagIcon: "flame",
    notAvailable: true
  },
  {
    id: "8ball-pool-001",
    name: "Pool City - 8 Ball",
    image: ballPoolLogo,
    tag: null,
    tagColor: "",
    tagIcon: "",
    notAvailable: true
  },
  {
    id: "arena-of-valor-001",
    name: "Arena of Valor",
    image: arenaOfValorLogo,
    tag: null,
    tagColor: "",
    tagIcon: "",
    notAvailable: true
  },
  {
    id: "undawn-001",
    name: "Undawn",
    image: undawnLogo,
    tag: null,
    tagColor: "",
    tagIcon: "",
    notAvailable: true
  },
  {
    id: "nba-infinite-001",
    name: "NBA INFINITE",
    image: nbaInfiniteLogo,
    tag: null,
    tagColor: "",
    tagIcon: "",
    notAvailable: true
  },
  {
    id: "arena-breakout-infinite-001",
    name: "Arena Breakout: Infinite",
    image: arenaBreakoutInfiniteLogo,
    tag: "Extra Bonus",
    tagColor: "bg-red-500",
    tagIcon: "flame",
    notAvailable: true
  },
  {
    id: "dragonheir-001",
    name: "Dragonheir:Silent Gods",
    image: dragonheirLogo,
    tag: "Extra Bonus",
    tagColor: "bg-red-500",
    tagIcon: "star",
    notAvailable: true
  },
  {
    id: "ludo-world-001",
    name: "Ludo World",
    image: ludoWorldLogo,
    tag: null,
    tagColor: "",
    tagIcon: "",
    notAvailable: true
  }
];

const AllGamesPopup = ({ isOpen, onClose }: AllGamesPopupProps) => {
  const navigate = useNavigate();
  const { countryCode } = useParams<{ countryCode: string }>();
  const { toast } = useToast();

  if (!isOpen) return null;

  const isIndia = countryCode?.toLowerCase() === 'in';
  const filteredAllGames = isIndia ? allGames : allGames.filter(g => g.id !== 'bgmi-001');

  const handleGameClick = (game: typeof allGames[0]) => {
    // Check if game is not available
    if ('notAvailable' in game && game.notAvailable) {
      toast({
        title: `${game.name}`,
        description: "Coming soon! Ye game jaldi available hogi.",
        variant: "default",
      });
      return;
    }
    
    onClose();
    
    if (game.route) {
      navigate(game.route);
    }
  };

  const renderTagIcon = (iconType: string) => {
    switch (iconType) {
      case "flame":
        return <Flame className="w-2.5 h-2.5" />;
      case "thumbsup":
        return <ThumbsUp className="w-2.5 h-2.5" />;
      case "star":
        return <Star className="w-2.5 h-2.5" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden bg-midasbuy-darkBlue"
    >
      {/* Top-left blue glow effect */}
      <div 
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.35) 0%, rgba(37, 99, 235, 0.2) 30%, rgba(30, 64, 175, 0.1) 50%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translate(-20%, -20%)',
        }}
      />
      
      {/* Secondary glow for more intensity */}
      <div 
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '250px',
          height: '250px',
          background: 'radial-gradient(ellipse at top left, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.25) 40%, transparent 70%)',
          filter: 'blur(30px)',
          transform: 'translate(-10%, -10%)',
        }}
      />

      {/* Header - NO separate background color */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* New Midasbuy Logo */}
          <img 
            src={midasbuyLogoPopup} 
            alt="Midasbuy" 
            className="h-6 object-contain"
          />
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title Section */}
      <div className="px-4 py-3 relative z-10">
        <h1 className="text-white text-lg font-bold uppercase tracking-wide">POPULAR GAMES</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Exact same shield icon from checkout modal */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            <path d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0d101e" />
          </svg>
          <span className="text-gray-400 text-[11px]">We are the official recharge store by Tencent</span>
        </div>
      </div>

      {/* Games List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 relative z-10" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <div className="space-y-2">
          {filteredAllGames.map((game) => (
            <div 
              key={game.id}
              className="flex items-center justify-between py-1.5"
            >
              {/* Game Info - 10% smaller */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-medium text-sm truncate">{game.name}</span>
                  {game.tag && (
                    <div 
                      className={`inline-flex items-center gap-0.5 ${game.tagColor} text-white text-[10px] font-semibold px-1.5 py-0.5 mt-0.5 w-fit`}
                      style={{
                        borderRadius: '3px',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 50%, calc(100% - 4px) 100%, 0 100%)'
                      }}
                    >
                      {renderTagIcon(game.tagIcon)}
                      <span>{game.tag}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Go Button - 20% smaller with glass blur effect */}
              <button
                onClick={() => handleGameClick(game)}
                className="flex-shrink-0 text-gray-300 hover:text-white font-medium text-xs px-4 py-1.5 rounded-full transition-all border border-white/20 backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                Go
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllGamesPopup;

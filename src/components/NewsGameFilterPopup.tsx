import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";

// Import logos from AllGamesPopup
import pubgMobileLogo from "@/assets/pubg-mobile-logo.png";
import deltaForceLogo from "@/assets/delta-force-logo.png";
import honorOfKingsLogo from "@/assets/honor-of-kings-logo.png";
import ageOfEmpiresLogo from "@/assets/age-of-empires-logo.png";
import arenaBreakoutInfiniteLogo from "@/assets/arena-breakout-infinite-logo.png";

interface NewsGameFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameName: string) => void;
  selectedGame: string;
  onOpenAllGames: () => void;
}

const gameFilters = [
  {
    name: "All",
    isAllIcon: true,
  },
  {
    name: "PUBG MOBILE",
    image: pubgMobileLogo,
  },
  {
    name: "Delta Force",
    image: deltaForceLogo,
  },
  {
    name: "Honor of Kings",
    image: honorOfKingsLogo,
  },
  {
    name: "Age of Empires Mobile",
    image: ageOfEmpiresLogo,
  },
  {
    name: "Arena Breakout",
    image: arenaBreakoutInfiniteLogo,
  },
];

const NewsGameFilterPopup = ({
  isOpen,
  onClose,
  onSelectGame,
  selectedGame,
  onOpenAllGames,
}: NewsGameFilterPopupProps) => {
  
  const handleGameClick = (game: typeof gameFilters[0]) => {
    if (game.name === "All") {
      onClose();
      onOpenAllGames();
    } else {
      onSelectGame(game.name);
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-[#0a1628] border-0 rounded-t-3xl max-h-[45vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-white font-bold text-lg tracking-wide">CHOOSE GAME</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Game Grid */}
        <div className="px-5 pb-8 overflow-y-auto">
          <div className="grid grid-cols-4 gap-4">
            {gameFilters.map((game) => (
              <button
                key={game.name}
                onClick={() => handleGameClick(game)}
                className="flex flex-col items-center gap-2 p-1 rounded-xl transition-all hover:bg-white/5"
              >
                {/* Icon with conditional border */}
                <div className={`rounded-2xl ${
                  selectedGame === game.name 
                    ? 'ring-2 ring-blue-500' 
                    : ''
                }`}>
                  {game.isAllIcon ? (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-4 h-4 rounded-sm bg-yellow-400"></div>
                        <div className="w-4 h-4 rounded-sm bg-pink-400"></div>
                        <div className="w-4 h-4 rounded-sm bg-purple-400"></div>
                        <div className="w-4 h-4 rounded-sm bg-cyan-400"></div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                  )}
                </div>
                {/* Text without border */}
                <span className="text-white text-xs text-center leading-tight line-clamp-2">
                  {game.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewsGameFilterPopup;

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X, Trash2 } from "lucide-react";

interface OrderFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: { timeRange: string | null; game: string | null }) => void;
  currentFilters: { timeRange: string | null; game: string | null };
}

const TIME_RANGES = [
  { key: '3months', label: 'Within 3 months' },
  { key: '1month', label: 'Within 1 month' },
  { key: '6months', label: 'Within 6 months' },
  { key: '1year', label: 'Within 1 Year' },
];

// Games list - Priority games at top, then others
const GAMES = [
  // Priority games (our supported games)
  'PUBG MOBILE',
  'Free Fire',
  'BGMI',
  'VALORANT',
  'ROBLOX',
  // Other games from Midasbuy
  'PUBG Mobile Lite',
  'PUBG MOBILE: ...',
  'WeTV',
  'Arena of Valor',
  'WeSing',
  'Undawn',
  'Arena Breakout',
  'Whiteout Survival',
  'xgame',
  'SYNCED',
  'NBA INFINITE',
  'Midas-Test Applic...',
  'The Ants',
  'Pokémon Unite',
  'Age of Empires M...',
  'Arena Breakout: In...',
  'Dragonheir:Silent ...',
  'Delta Force',
  'Mecha BREAK',
  'Ludo World',
  'Pure Sniper',
  'Wuthering Waves',
  'Civilization: Eras &...',
  'JOOX',
  'Hiispii',
  'Pool City - 8 Ball',
  'Warframe-allitem',
  'Warframe',
  'Crossfire: Legends',
  '龍息神寂',
  '천애명월도M',
  'GODDESS OF VICT...',
  '勝利女神：妮姬',
  'Honor of Kings',
];

export default function OrderFilterSheet({ 
  open, 
  onOpenChange, 
  onApplyFilters,
  currentFilters 
}: OrderFilterSheetProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(currentFilters.timeRange);
  const [selectedGame, setSelectedGame] = useState<string | null>(currentFilters.game);

  const handleClear = () => {
    setSelectedTimeRange(null);
    setSelectedGame(null);
  };

  const handleConfirm = () => {
    onApplyFilters({
      timeRange: selectedTimeRange,
      game: selectedGame,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="bg-[#0f1a2b] border-t-0 rounded-t-3xl p-0 h-[calc(100vh-80px)] flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1a2b] px-5 pt-5 pb-4 flex items-center justify-between z-10 border-b border-[#1a2a3f]">
          <SheetTitle className="text-white text-lg font-bold uppercase tracking-wide">
            FILTER
          </SheetTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-[#8b9cb8] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Time Range Section */}
          <div className="mb-6">
            <h3 className="text-white text-sm font-medium mb-3">Time Range</h3>
            <div className="grid grid-cols-2 gap-3">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setSelectedTimeRange(
                    selectedTimeRange === range.key ? null : range.key
                  )}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedTimeRange === range.key
                      ? 'text-white'
                      : 'bg-[#1a2a3f] text-[#8b9cb8] hover:bg-[#243448]'
                  }`}
                  style={selectedTimeRange === range.key ? {
                    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                  } : {}}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Game Section */}
          <div className="mb-6">
            <h3 className="text-white text-sm font-medium mb-3">Game</h3>
            <div className="grid grid-cols-2 gap-3">
              {GAMES.map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(
                    selectedGame === game ? null : game
                  )}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 truncate ${
                    selectedGame === game
                      ? 'text-white'
                      : 'bg-[#1a2a3f] text-[#8b9cb8] hover:bg-[#243448]'
                  }`}
                  style={selectedGame === game ? {
                    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                  } : {}}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Clear and Confirm buttons */}
        <div className="sticky bottom-0 bg-[#0f1a2b] px-5 py-4 border-t border-[#1a2a3f] flex items-center gap-4">
          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex flex-col items-center gap-1 text-[#38bdf8] hover:text-[#5bcefa] transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-xs">Clear</span>
          </button>
          
          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
            }}
          >
            Confirm
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import { ChevronDown, Gem } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DiamondFilterDropdownProps {
  onDiamondRangeChange?: (range: string) => void;
  selectedRange?: string;
}

const DiamondFilterDropdown = ({ onDiamondRangeChange, selectedRange = "all" }: DiamondFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const diamondRanges = [
    { value: "all", label: "All Diamonds", description: "Show all packages" },
    { value: "starter", label: "Starter (100-500)", description: "Perfect for beginners" },
    { value: "small", label: "Small (100-1000)", description: "Light purchases" },
    { value: "medium", label: "Medium (1000-3000)", description: "Popular choice" },
    { value: "large", label: "Large (3000+)", description: "Best value" },
  ];

  const handleRangeSelect = (range: string) => {
    onDiamondRangeChange?.(range);
    setIsOpen(false);
  };

  const selectedRangeLabel = diamondRanges.find(range => range.value === selectedRange)?.label || "All Diamonds";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-midasbuy-navy/50 text-white rounded-lg hover:bg-midasbuy-navy/70 transition-colors border border-freefire-primary/20 text-sm">
          <img 
            src="/lovable-uploads/diamond-logo.png" 
            alt="Diamond" 
            className="w-4 h-4"
          />
          <span className="hidden sm:inline">{selectedRangeLabel}</span>
          <span className="sm:hidden">Diamonds</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-midasbuy-navy border border-freefire-primary/20">
        {diamondRanges.map((range) => (
          <DropdownMenuItem
            key={range.value}
            onClick={() => handleRangeSelect(range.value)}
            className={`flex flex-col items-start p-3 cursor-pointer hover:bg-freefire-primary/10 ${
              selectedRange === range.value ? 'bg-freefire-primary/20' : ''
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <img 
                src="/lovable-uploads/diamond-logo.png" 
                alt="Diamond" 
                className="w-4 h-4 flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium text-sm">{range.label}</span>
                <span className="text-gray-400 text-xs">{range.description}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DiamondFilterDropdown;
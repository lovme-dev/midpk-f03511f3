import { Filter, ChevronDown } from "lucide-react";
import FreeFirePaymentChannels from "./FreeFirePaymentChannels";
import DiamondFilterDropdown from "./DiamondFilterDropdown"; 
import FilterDropdown from "./FilterDropdown";

interface FreeFireFilterBarProps {
  onFilterChange?: (filter: string) => void;
  onPaymentMethodChange?: (method: string) => void;
  onDiamondRangeChange?: (range: string) => void;
  selectedFilter?: string;
  selectedDiamondRange?: string;
}

const FreeFireFilterBar = ({ 
  onFilterChange, 
  onPaymentMethodChange, 
  onDiamondRangeChange, 
  selectedFilter,
  selectedDiamondRange 
}: FreeFireFilterBarProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div className="mb-4 sm:mb-0">
        <FreeFirePaymentChannels onPaymentMethodChange={onPaymentMethodChange} />
      </div>
      
      <div className="flex items-center space-x-4">
        <DiamondFilterDropdown 
          onDiamondRangeChange={onDiamondRangeChange}
          selectedRange={selectedDiamondRange}
        />
        
        <FilterDropdown 
          onFilterChange={onFilterChange}
          selectedFilter={selectedFilter}
        />
      </div>
    </div>
  );
};

export default FreeFireFilterBar;
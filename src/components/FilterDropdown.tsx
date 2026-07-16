import { useState } from "react";
import { Filter } from "lucide-react";
import FilterProductSheet from "./FilterProductSheet";

interface FilterDropdownProps {
  onFilterChange?: (filter: string) => void;
  selectedFilter?: string;
}

const FilterDropdown = ({ onFilterChange, selectedFilter }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasActiveFilter, setHasActiveFilter] = useState(false);

  const handleApplyFilter = (filters: { paymentMethod: string | null; minUC: number; maxUC: number }) => {
    // Check if any filter is active
    const isActive = filters.paymentMethod !== null || filters.minUC !== 2000 || filters.maxUC !== 60000;
    setHasActiveFilter(isActive);
    
    // Notify parent component
    if (filters.paymentMethod) {
      onFilterChange?.(`payment_${filters.paymentMethod}`);
    } else {
      onFilterChange?.("default");
    }
  };

  return (
    <>
      <div className="relative">
        {/* Filter icon only - NO background (matching reference) */}
        <button 
          className="p-2 flex items-center hover:opacity-80 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="w-5 h-5 text-gray-300" />
          {hasActiveFilter && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-midasbuy-blue"></div>
          )}
        </button>
      </div>

      <FilterProductSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApplyFilter={handleApplyFilter}
      />
    </>
  );
};

export default FilterDropdown;

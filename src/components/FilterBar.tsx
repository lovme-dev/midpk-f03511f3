import PaymentChannelsDropdown from "./PaymentChannelsDropdown";
import UCFilterDropdown from "./UCFilterDropdown";
import FilterDropdown from "./FilterDropdown";
import PromotionCarouselBanner from "@/components/PromotionCarouselBanner";

interface FilterBarProps {
  onFilterChange?: (filter: string) => void;
  onPaymentMethodChange?: (method: string) => void;
  onUCRangeChange?: (range: string) => void;
  selectedFilter?: string;
  selectedUCRange?: string;
  hidePromotionBanner?: boolean;
  currencyLabel?: string;
}

const FilterBar = ({
  onFilterChange,
  onPaymentMethodChange,
  onUCRangeChange,
  selectedFilter,
  selectedUCRange,
  hidePromotionBanner = false,
  currencyLabel,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-3 mb-6 mt-2 md:mt-4">
      {!hidePromotionBanner && <PromotionCarouselBanner className="mb-2" />}

      {/* Filter Controls Row - Layout: PAYMENT CHANNELS (left) | UC | Filter icon (right) */}
      <div className="flex items-center justify-between gap-2" dir="ltr">
        {/* Left side: Payment Channels + UC (glass blur bg) */}
        <div className="flex items-center gap-2">
          <PaymentChannelsDropdown onPaymentMethodChange={onPaymentMethodChange} />
          <UCFilterDropdown onUCRangeChange={onUCRangeChange} selectedRange={selectedUCRange} currencyLabel={currencyLabel} />
        </div>

        {/* Right side: Filter icon (no background) */}
        <div className="flex items-center">
          <FilterDropdown onFilterChange={onFilterChange} selectedFilter={selectedFilter} />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

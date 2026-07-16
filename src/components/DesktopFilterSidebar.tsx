import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCountryPaymentMethods } from "@/utils/countryPaymentMethods";

interface DesktopFilterSidebarProps {
  onPaymentMethodChange?: (methods: string[]) => void;
  onAmountRangeChange?: (min: number | null, max: number | null) => void;
  onFilterApply?: () => void;
}

const DesktopFilterSidebar = ({
  onPaymentMethodChange,
  onAmountRangeChange,
  onFilterApply,
}: DesktopFilterSidebarProps) => {
  const { t } = useTranslation();
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const paymentMethods = useCountryPaymentMethods();

  const visiblePayments = showAllPayments ? paymentMethods : paymentMethods.slice(0, 6);

  const toggleMethod = (methodId: string) => {
    const newSelected = selectedMethods.includes(methodId)
      ? selectedMethods.filter((id) => id !== methodId)
      : [...selectedMethods, methodId];
    setSelectedMethods(newSelected);
    onPaymentMethodChange?.(newSelected);
  };

  const handleClear = () => {
    setSelectedMethods([]);
    setMinAmount("");
    setMaxAmount("");
    onPaymentMethodChange?.([]);
    onAmountRangeChange?.(null, null);
  };

  const handleFilter = () => {
    const min = minAmount ? parseFloat(minAmount) : null;
    const max = maxAmount ? parseFloat(maxAmount) : null;
    onAmountRangeChange?.(min, max);
    onFilterApply?.();
  };

  return (
    <div className="w-64 flex-shrink-0 bg-[#1a2235] rounded-lg p-4 h-fit sticky top-24">
      {/* Clear button */}
      <button
        onClick={handleClear}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-sm">{t("filters.clear", "Clear")}</span>
      </button>

      {/* Payment Section */}
      <div className="mb-6">
        <h3 className="text-white font-medium text-sm mb-3">
          {t("filters.payment", "Payment")}
        </h3>
        <div className="space-y-2">
          {visiblePayments.map((method) => (
            <label
              key={method.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  selectedMethods.includes(method.id)
                    ? "bg-[#00c6ff] border-[#00c6ff]"
                    : "border-gray-500 group-hover:border-gray-400"
                }`}
              >
                {selectedMethods.includes(method.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                {method.name}
              </span>
            </label>
          ))}
        </div>

        {/* Show all toggle */}
        <button
          onClick={() => setShowAllPayments(!showAllPayments)}
          className="flex items-center gap-1 text-[#00c6ff] text-sm mt-3 hover:underline"
        >
          {showAllPayments ? t("filters.showLess", "Show less") : t("filters.showAll", "Show all")}
          {showAllPayments ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Amount Section */}
      <div className="mb-6">
        <h3 className="text-white font-medium text-sm mb-3">
          {t("filters.amount", "Amount")}
        </h3>
        <button className="flex items-center gap-1 text-[#00c6ff] text-sm mb-3 hover:underline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {t("filters.filterByPrice", "Filter by Price")}
        </button>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mini"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-20 bg-transparent border border-gray-600 rounded px-2 py-1.5 text-white text-sm placeholder-gray-500 focus:border-[#00c6ff] focus:outline-none"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Up to"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-20 bg-transparent border border-gray-600 rounded px-2 py-1.5 text-white text-sm placeholder-gray-500 focus:border-[#00c6ff] focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Button */}
      <button
        onClick={handleFilter}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-all"
        style={{
          background: "linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)",
        }}
      >
        {t("filters.filter", "Filter")}
      </button>
    </div>
  );
};

export default DesktopFilterSidebar;

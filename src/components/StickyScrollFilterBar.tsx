import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Filter, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCountryPaymentMethods } from "@/utils/countryPaymentMethods";
import FilterProductSheet from "./FilterProductSheet";

interface StickyScrollFilterBarProps {
  isVisible: boolean;
  onPaymentMethodChange?: (method: string) => void;
  onUCRangeChange?: (range: string) => void;
  onFilterChange?: (filter: string) => void;
  selectedUCRange?: string;
  selectedFilter?: string;
}

const StickyScrollFilterBar = ({
  isVisible,
  onPaymentMethodChange,
  onUCRangeChange,
  onFilterChange,
  selectedUCRange = "all",
  selectedFilter = "default"
}: StickyScrollFilterBarProps) => {
  const [openPopup, setOpenPopup] = useState<"payment" | "uc" | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  // Payment state
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const countryMethods = useCountryPaymentMethods();

  // UC state
  const [selectedUCRanges, setSelectedUCRanges] = useState<string[]>([]);
  const [minUC, setMinUC] = useState("1870");
  const [maxUC, setMaxUC] = useState("60000");

  const ucRanges = [
    { id: "1870-3350", label: "1870 - 3350 UC" },
    { id: "3830-6720", label: "3830 - 6720 UC" },
    { id: "7000-8000", label: "7000 - 8000 UC" },
    { id: "10000-12000", label: "10000 - 12000 UC" },
    { id: "13000-15000", label: "13000 - 15000 UC" },
    { id: "16000+", label: "16000 UC +" },
  ];

  // Active tab for payment/UC popup
  const [activeTab, setActiveTab] = useState<"payment" | "uc">("payment");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isVisible) setOpenPopup(null);
  }, [isVisible]);

  const overlayZ = 2147483646;
  const popupZ = 2147483647;

  const handleClose = () => setOpenPopup(null);

  const handleClearAll = () => {
    setSelectedPaymentMethods([]);
    setSelectedUCRanges([]);
    setMinUC("1870");
    setMaxUC("60000");
  };

  const handleApplyPayment = () => {
    onPaymentMethodChange?.(selectedPaymentMethods.join(',') || 'all');
    setOpenPopup(null);
  };

  const handleApplyUC = () => {
    onUCRangeChange?.(selectedUCRanges.join(',') || 'all');
    setOpenPopup(null);
  };

  const handleFilterSheetApply = (filters: { paymentMethod: string | null; minUC: number; maxUC: number }) => {
    if (filters.paymentMethod) {
      onFilterChange?.(`payment_${filters.paymentMethod}`);
    } else {
      onFilterChange?.("default");
    }
  };

  const renderPaymentUCPopup = () => (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70"
        style={{ zIndex: overlayZ }}
        onClick={handleClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 bg-[#1a2235] shadow-2xl rounded-b-2xl"
        style={{ zIndex: popupZ }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-2 bg-black">
          <div className="flex items-center gap-3">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase text-white transition-all ${
                activeTab === "payment" ? "bg-[#1a2235] rounded-t-xl -mb-0.5" : "bg-white/5 rounded-xl mb-1"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              {t("filters.paymentChannels", "Payment Channels")}
              {activeTab === "payment" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-white/80" />}
            </button>
            <button
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-white font-medium transition-all ${
                activeTab === "uc" ? "bg-[#1a2235] rounded-t-xl -mb-0.5" : "bg-white/5 rounded-xl mb-1"
              }`}
              onClick={() => setActiveTab("uc")}
            >
              UC
              {activeTab === "uc" ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5 text-white/80" />}
            </button>
          </div>
          <button className="p-1" onClick={handleClose}>
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {activeTab === "payment" ? (
          <div className="p-3 grid grid-cols-2 gap-2">
            {countryMethods.map((method) => (
              <button
                key={method.id}
                className={`px-3 py-2 rounded-lg text-left transition-all text-[10px] font-medium truncate ${
                  selectedPaymentMethods.includes(method.id) ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
                onClick={() => setSelectedPaymentMethods(prev => prev.includes(method.id) ? prev.filter(id => id !== method.id) : [...prev, method.id])}
              >
                {method.name}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="p-3 grid grid-cols-2 gap-2">
              {ucRanges.map((range) => (
                <button
                  key={range.id}
                  className={`px-3 py-2 rounded-lg text-center transition-all text-[10px] font-medium ${
                    selectedUCRanges.includes(range.id) ? "bg-white/20 text-white" : "bg-white/10 text-gray-300 hover:bg-white/15"
                  }`}
                  onClick={() => setSelectedUCRanges(prev => prev.includes(range.id) ? prev.filter(id => id !== range.id) : [...prev, range.id])}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="px-3 pb-3">
              <h4 className="text-white text-xs font-medium mb-2">{t("filters.customize", "Customize")}</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-gray-400 text-[10px]">Mini</span>
                  <input type="text" value={minUC} onChange={(e) => setMinUC(e.target.value)} className="w-full bg-transparent text-white text-xs outline-none" placeholder="1870 UC" />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-gray-400 text-[10px]">Up to</span>
                  <input type="text" value={maxUC} onChange={(e) => setMaxUC(e.target.value)} className="w-full bg-transparent text-white text-xs outline-none" placeholder="60000 UC" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom action bar */}
        <div className="px-3 pb-4 pt-2 flex items-center gap-3">
          <button onClick={handleClearAll} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors px-2">
            <Trash2 className="w-5 h-5" />
            <span className="text-[10px]">{t('filters.clear', 'Clear')}</span>
          </button>
          <button
            onClick={activeTab === "payment" ? handleApplyPayment : handleApplyUC}
            className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm transition-all"
            style={{ background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)' }}
          >
            {t('filters.filter', 'Filter')}
          </button>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-midasbuy-navy/95 backdrop-blur-lg border-b border-gray-700/50 shadow-lg"
          >
            <div className="container mx-auto px-4 py-2.5">
              <div className="flex items-center justify-between" dir="ltr">
                <div className="flex items-center gap-2">
                  {/* Payment Channels */}
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors"
                    onClick={() => { setActiveTab("payment"); setOpenPopup(openPopup === "payment" ? null : "payment"); }}
                  >
                    <span className="text-[10px] text-white font-medium uppercase tracking-wide">
                      {t('filters.paymentChannels', 'Payment Channels')}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/80" />
                  </button>

                  {/* UC */}
                  <button
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors"
                    onClick={() => { setActiveTab("uc"); setOpenPopup(openPopup === "uc" ? null : "uc"); }}
                  >
                    <span className="text-[10px] text-white font-medium">UC</span>
                    <ChevronDown className="w-2.5 h-2.5 text-white/80" />
                  </button>
                </div>

                {/* Filter icon - opens the same FilterProductSheet as the non-sticky bar */}
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  onClick={() => setFilterSheetOpen(true)}
                >
                  <Filter className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal popups for Payment/UC */}
      {mounted && (openPopup === "payment" || openPopup === "uc") && createPortal(
        <AnimatePresence>{renderPaymentUCPopup()}</AnimatePresence>,
        document.body
      )}

      {/* Filter Product bottom sheet - same as non-sticky filter */}
      <FilterProductSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        onApplyFilter={handleFilterSheetApply}
      />
    </>
  );
};

export default StickyScrollFilterBar;

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCountryPaymentMethods } from "@/utils/countryPaymentMethods";

interface PaymentMethod {
  id: string;
  name: string;
  selected: boolean;
}

interface PaymentChannelsDropdownProps {
  onPaymentMethodChange?: (method: string) => void;
}

const PaymentChannelsDropdown = ({ onPaymentMethodChange }: PaymentChannelsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const countryMethods = useCountryPaymentMethods();
  const paymentMethods: PaymentMethod[] = countryMethods.map(m => ({
    ...m,
    selected: false,
  }));

  useEffect(() => {
    // Ensure portal rendering only happens on client
    setMounted(true);
  }, []);

  const toggleMethod = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleClear = () => {
    setSelectedMethods([]);
  };

  const handleFilter = () => {
    onPaymentMethodChange?.(selectedMethods.join(',') || 'all');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const overlayZ = 2147483646;
  const popupZ = 2147483647;

  // Active tab state for switching between Payment Channels and UC
  const [activeTab, setActiveTab] = useState<"payment" | "uc">("payment");

  // UC Filter state
  const [selectedUCRanges, setSelectedUCRanges] = useState<string[]>([]);
  const [minUC, setMinUC] = useState<string>("2000");
  const [maxUC, setMaxUC] = useState<string>("60000");

  const ucRanges = [
    { id: "2000-2500", label: "2000 - 2500 UC" },
    { id: "4000-5000", label: "4000 - 5000 UC" },
    { id: "7000-8000", label: "7000 - 8000 UC" },
    { id: "10000-12000", label: "10000 - 12000 UC" },
    { id: "13000-15000", label: "13000 - 15000 UC" },
    { id: "16000+", label: "16000 UC +" },
  ];

  const toggleUCRange = (rangeId: string) => {
    setSelectedUCRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleClearAll = () => {
    setSelectedMethods([]);
    setSelectedUCRanges([]);
    setMinUC("2000");
    setMaxUC("60000");
  };

  const popup = (
    <>
      {/* Full-screen overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70"
        style={{ zIndex: overlayZ }}
        onClick={handleClose}
      />

      {/* Header-style popup - opens from top with rounded bottom corners */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 bg-[#1a2235] shadow-2xl rounded-b-2xl"
        style={{ zIndex: popupZ }}
      >
        {/* Header row - black background */}
        <div className="flex items-center justify-between px-4 pt-2 bg-black">
          <div className="flex items-center gap-3">
            {/* Payment Channels button */}
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase text-white transition-all ${
                activeTab === "payment"
                  ? "bg-[#1a2235] rounded-t-xl -mb-0.5"
                  : "bg-white/5 rounded-xl mb-1"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              {t("filters.paymentChannels", "Payment Channels")}
              {activeTab === "payment" ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3 text-white/80" />
              )}
            </button>

            {/* UC button */}
            <button
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-white font-medium transition-all ${
                activeTab === "uc"
                  ? "bg-[#1a2235] rounded-t-xl -mb-0.5"
                  : "bg-white/5 rounded-xl mb-1"
              }`}
              onClick={() => setActiveTab("uc")}
            >
              UC
              {activeTab === "uc" ? (
                <ChevronUp className="w-2.5 h-2.5" />
              ) : (
                <ChevronDown className="w-2.5 h-2.5 text-white/80" />
              )}
            </button>
          </div>

          {/* Filter icon */}
          <button className="p-1" onClick={handleClose}>
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>

        {/* Content area - switches based on activeTab */}
        {activeTab === "payment" ? (
          /* Payment methods grid - 2 columns */
          <div className="p-3 grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`px-3 py-2 rounded-lg text-left transition-all text-[10px] font-medium truncate ${
                  selectedMethods.includes(method.id)
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
                onClick={() => toggleMethod(method.id)}
              >
                {method.name}
              </button>
            ))}
          </div>
        ) : (
          /* UC content */
          <>
            <div className="p-3 grid grid-cols-2 gap-2">
              {ucRanges.map((range) => (
                <button
                  key={range.id}
                  className={`px-3 py-2 rounded-lg text-center transition-all text-[10px] font-medium ${
                    selectedUCRanges.includes(range.id)
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/15"
                  }`}
                  onClick={() => toggleUCRange(range.id)}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Customize Section */}
            <div className="px-3 pb-3">
              <h4 className="text-white text-xs font-medium mb-2">
                {t("filters.customize", "Customize")}
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-gray-400 text-[10px]">Mini</span>
                  <input
                    type="text"
                    value={minUC}
                    onChange={(e) => setMinUC(e.target.value)}
                    className="w-full bg-transparent text-white text-xs outline-none"
                    placeholder="60 UC"
                  />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-gray-400 text-[10px]">Up to</span>
                  <input
                    type="text"
                    value={maxUC}
                    onChange={(e) => setMaxUC(e.target.value)}
                    className="w-full bg-transparent text-white text-xs outline-none"
                    placeholder="60000 UC"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom action bar - Clear + Filter button */}
        <div className="px-3 pb-4 pt-2 flex items-center gap-3">
          {/* Clear button */}
          <button
            onClick={handleClearAll}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors px-2"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-[10px]">{t('filters.clear', 'Clear')}</span>
          </button>

          {/* Filter button - cyan-to-blue gradient */}
          <button
            onClick={handleFilter}
            className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm transition-all"
            style={{
              background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)',
            }}
          >
            {t('filters.filter', 'Filter')}
          </button>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <div className="relative">
        {/* Button - shows gradient when open, glass blur when closed */}
        <button 
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors ${
            isOpen 
              ? "text-white" 
              : "backdrop-blur-md bg-white/5 hover:bg-white/10"
          }`}
          style={isOpen ? {
            background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)'
          } : undefined}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[10px] text-white font-medium uppercase tracking-wide">
            {t('filters.paymentChannels', 'Payment Channels')}
          </span>
          {isOpen ? (
            <ChevronUp className="w-3 h-3 text-white" />
          ) : (
            <ChevronDown className="w-3 h-3 text-white/80" />
          )}
        </button>
      </div>

      {/* True portal to body so it cannot be hidden by banner/nav stacking contexts */}
      {mounted && isOpen ? createPortal(popup, document.body) : null}
    </>
  );
};

export default PaymentChannelsDropdown;

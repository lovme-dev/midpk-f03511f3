import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCountryPaymentMethods } from "@/utils/countryPaymentMethods";

interface FilterProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter?: (filters: FilterState) => void;
}

interface FilterState {
  paymentMethod: string | null;
  minUC: number;
  maxUC: number;
}

const FilterProductSheet = ({ isOpen, onClose, onApplyFilter }: FilterProductSheetProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [minUC, setMinUC] = useState<string>("2000");
  const [maxUC, setMaxUC] = useState<string>("60000");
  const { t } = useTranslation();

  const countryPaymentMethods = useCountryPaymentMethods();
  const paymentMethods = countryPaymentMethods.map((m, i) => ({
    ...m,
    enabled: i === 0, // Only first method (Credit/Debit) enabled for now
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClear = () => {
    setSelectedPayment(null);
    setMinUC("2000");
    setMaxUC("60000");
  };

  const handleApply = () => {
    onApplyFilter?.({
      paymentMethod: selectedPayment,
      minUC: parseInt(minUC) || 2000,
      maxUC: parseInt(maxUC) || 60000,
    });
    onClose();
  };

  const handlePaymentClick = (methodId: string, enabled: boolean) => {
    if (!enabled) return;
    setSelectedPayment(selectedPayment === methodId ? null : methodId);
  };

  if (!mounted || !isOpen) return null;

  const overlayZ = 2147483646;
  const sheetZ = 2147483647;

  const content = (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70"
        style={{ zIndex: overlayZ }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-[#0f172a] rounded-t-3xl"
        style={{ zIndex: sheetZ, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-white text-lg font-bold tracking-wide">
            {t("filters.filterProduct", "FILTER PRODUCT")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-4 overflow-y-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
          {/* Payment Section */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-medium mb-3">
              {t("filters.payment", "Payment")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentClick(method.id, method.enabled)}
                  disabled={!method.enabled}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedPayment === method.id
                      ? "text-white"
                      : method.enabled
                      ? "bg-[#1e293b] text-gray-300 hover:bg-[#2a3a52]"
                      : "bg-[#1e293b]/50 text-gray-500 cursor-not-allowed"
                  }`}
                  style={
                    selectedPayment === method.id
                      ? {
                          background:
                            "linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)",
                        }
                      : undefined
                  }
                >
                  {method.name}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">
                {t("filters.amount", "Amount")}
              </h3>
              <button className="flex items-center gap-1 text-cyan-400 text-sm font-medium">
                <ArrowUpDown className="w-4 h-4" />
                {t("filters.filterByPrice", "Filter by Price")}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#1e293b] rounded-xl px-4 py-3">
                <span className="text-gray-500 text-xs">Mini</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={minUC}
                    onChange={(e) => setMinUC(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent text-white text-base font-medium outline-none"
                    placeholder="2000"
                  />
                  <span className="text-gray-400 text-sm">UC</span>
                </div>
              </div>
              <span className="text-gray-500 text-lg">-</span>
              <div className="flex-1 bg-[#1e293b] rounded-xl px-4 py-3">
                <span className="text-gray-500 text-xs">Up to</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={maxUC}
                    onChange={(e) => setMaxUC(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent text-white text-base font-medium outline-none"
                    placeholder="60000"
                  />
                  <span className="text-gray-400 text-sm">UC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Clear & Filter buttons */}
        <div className="px-5 py-4 flex items-center gap-4 border-t border-white/5">
          <button
            onClick={handleClear}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors px-3"
          >
            <Trash2 className="w-6 h-6" />
            <span className="text-xs">{t("filters.clear", "Clear")}</span>
          </button>

          <button
            onClick={handleApply}
            className="flex-1 py-3.5 rounded-xl text-white font-semibold text-base transition-all"
            style={{
              background:
                "linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)",
            }}
          >
            {t("filters.filter", "Filter")}
          </button>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-gray-600 rounded-full" />
        </div>
      </motion.div>
    </>
  );

  return createPortal(content, document.body);
};

export default FilterProductSheet;

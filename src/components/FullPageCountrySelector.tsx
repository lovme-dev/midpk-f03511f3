import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getFlag } from "@/utils/countryFlags";
import OptimizedImage from "./OptimizedImage";
import { 
  SUPPORTED_LANGUAGES, 
  getLanguageForCountry, 
  getLanguageInfo,
  getNativeLanguageForCountry
} from "@/utils/countryLanguageMapping";

export interface Country {
  name: string;
  code: string;
  region: string;
  currency: string;
}

interface FullPageCountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  currentCountry: Country;
  onConfirm: (country: Country, language: string) => void;
}

// Region mapping to match official Midasbuy order
const REGION_ORDER = [
  "Asia Pacific",
  "Middle East And Africa",
  "Europe",
  "Latin American and the Caribbean",
  "North America",
  "Others"
];

// Map our regions to display regions
const mapRegionToDisplay = (region: string): string => {
  const regionMap: Record<string, string> = {
    "Asia": "Asia Pacific",
    "Oceania": "Asia Pacific",
    "Middle East": "Middle East And Africa",
    "Africa": "Middle East And Africa",
    "Europe": "Europe",
    "Latin America & Caribbean": "Latin American and the Caribbean",
    "North America": "North America",
  };
  return regionMap[region] || "Others";
};

const FullPageCountrySelector = ({
  isOpen,
  onClose,
  countries,
  currentCountry,
  onConfirm,
}: FullPageCountrySelectorProps) => {
  const [activeTab, setActiveTab] = useState<"country" | "language">("country");
  const [selectedCountry, setSelectedCountry] = useState<Country>(currentCountry);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [languageTouched, setLanguageTouched] = useState(false);

  // Reset selection and set default language based on country when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedCountry(currentCountry);
      setActiveTab("country");
      setLanguageTouched(false);
      // Set default language based on current country
      const defaultLang = getLanguageForCountry(currentCountry.code);
      setSelectedLanguage(defaultLang);
    }
  }, [isOpen, currentCountry]);

  // When user changes country, default the language to that country's primary language
  // unless user already explicitly picked a language in this modal.
  useEffect(() => {
    if (!isOpen) return;
    if (languageTouched) return;
    const defaultLang = getLanguageForCountry(selectedCountry.code);
    setSelectedLanguage(defaultLang);
  }, [isOpen, selectedCountry.code, languageTouched]);

  // Lock body scroll when open
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

  // Group countries by display region
  const groupedCountries = countries.reduce((acc, country) => {
    const displayRegion = mapRegionToDisplay(country.region);
    if (!acc[displayRegion]) {
      acc[displayRegion] = [];
    }
    acc[displayRegion].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  // Sort countries alphabetically within each region
  Object.keys(groupedCountries).forEach((region) => {
    groupedCountries[region].sort((a, b) => a.name.localeCompare(b.name));
  });

  const handleConfirm = () => {
    onConfirm(selectedCountry, selectedLanguage);
  };

  const getSelectedLanguageName = () => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);
    return lang ? `${lang.nativeName} - ${lang.shortName}` : "English - EN";
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          {/* Modal Content - LOCKED LTR for consistent layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            data-fullpage-country-selector="true"
            onClick={(e) => e.stopPropagation()}
            dir="ltr"
            className={cn(
              // NOTE: Colors are intentionally matched to the reference screenshot.
              "relative z-10 flex flex-col bg-[#0b1020] overflow-hidden",
              // Mobile: Full page
              "w-full h-full",
              // Desktop: Centered modal
              "md:w-[800px] md:max-w-[90vw] md:h-auto md:max-h-[85vh] md:rounded-xl"
            )}
          >
            {/* Header - LTR locked: Logo left, Close right */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-[#121724]">
              <OptimizedImage
                src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png"
                alt="Midasbuy Logo"
                className="h-6 md:h-7"
                priority={true}
                quality={90}
                displayWidth={140}
              />
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#121724]">
              <button
                onClick={() => setActiveTab("country")}
                className={cn(
                  "flex-1 py-4 text-center transition-all relative",
                  activeTab === "country"
                    ? "text-white bg-[#151a28] rounded-t-xl"
                    : "text-gray-500 bg-[#121724]"
                )}
              >
                <span className="text-xs md:text-sm font-bold tracking-wider">
                  COUNTRY/REGION
                </span>
                <div className="text-[#00b4ff] text-xs md:text-sm mt-1">
                  {selectedCountry.name}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("language")}
                className={cn(
                  "flex-1 py-4 text-center transition-all relative",
                  activeTab === "language"
                    ? "text-white bg-[#151a28] rounded-t-xl"
                    : "text-gray-500 bg-[#121724]"
                )}
              >
                <span className="text-xs md:text-sm font-bold tracking-wider">
                  LANGUAGE
                </span>
                <div className="text-[#00b4ff] text-xs md:text-sm mt-1">
                  {getSelectedLanguageName()}
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-[#151a28]">
              {activeTab === "country" ? (
                <div className="space-y-6">
                  {REGION_ORDER.map((region) => {
                    const regionCountries = groupedCountries[region];
                    if (!regionCountries || regionCountries.length === 0) return null;

                    return (
                      <div key={region}>
                        <h3 className="text-white font-bold text-sm md:text-base mb-3">
                          {region}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                          {regionCountries.map((country) => (
                            <button
                              key={country.code}
                              onClick={() => setSelectedCountry(country)}
                              className={cn(
                                "flex items-center gap-3 p-3 md:p-4 rounded-lg transition-all text-left",
                                selectedCountry.code === country.code
                                  ? "bg-[#2a3248] border-2 border-[#00b4ff]"
                                  : "bg-[#2a3248] border-2 border-transparent hover:border-gray-600"
                              )}
                            >
                              <span className="text-xl md:text-2xl flex-shrink-0 select-none">
                                {getFlag(country.code)}
                              </span>
                              <span className="text-white text-xs md:text-sm font-medium truncate">
                                {country.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
              <div className="space-y-2">
                  {/* English first (default), then country's native language second, then others */}
                  {(() => {
                    const nativeLang = getNativeLanguageForCountry(selectedCountry.code);
                    const englishInfo = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
                    const nativeLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === nativeLang);
                    
                    // Build ordered list: English first, native second (if different), then rest
                    const orderedLanguages: typeof SUPPORTED_LANGUAGES = [];
                    
                    // 1. English always first
                    if (englishInfo) orderedLanguages.push(englishInfo);
                    
                    // 2. Native language second (if not English)
                    if (nativeLangInfo && nativeLang !== 'en') {
                      orderedLanguages.push(nativeLangInfo);
                    }
                    
                    // 3. All other languages
                    SUPPORTED_LANGUAGES.forEach(lang => {
                      if (lang.code !== 'en' && lang.code !== nativeLang) {
                        orderedLanguages.push(lang);
                      }
                    });
                    
                    return orderedLanguages.map((language, index) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setLanguageTouched(true);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 p-4 rounded-lg transition-all text-left",
                          selectedLanguage === language.code
                            ? "bg-[#2a3248] border-2 border-[#00b4ff]"
                            : "bg-[#2a3248] border-2 border-transparent hover:border-gray-600"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white text-sm font-medium">
                            {language.nativeName}
                          </span>
                          <span className="text-gray-400 text-xs">
                            ({language.name})
                          </span>
                        </div>
                        {index === 0 && (
                          <span className="text-[#00b4ff] text-xs bg-[#00b4ff]/10 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                        {index === 1 && nativeLang !== 'en' && (
                          <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">
                            Local
                          </span>
                        )}
                      </button>
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* OK Button */}
            <div className="px-4 md:px-6 py-4 border-t border-gray-700/50 bg-[#151a28]">
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 md:py-4 rounded-lg font-semibold text-white text-base md:text-lg bg-gradient-to-r from-[#00b4ff] to-[#0066ff] hover:from-[#00c4ff] hover:to-[#0076ff] transition-all shadow-lg shadow-cyan-500/20"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FullPageCountrySelector;

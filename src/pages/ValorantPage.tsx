import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { valorantPackages, getSelectedCountry } from "@/data/valorantPackages";
import { useMobile, useResponsive } from "@/hooks/use-mobile";
import LoadingScreen from "@/components/LoadingScreen";
import ValorantPackageGrid from "@/components/ValorantPackageGrid";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import { ArrowRight, HelpCircle, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import { generateProductSchema, generateBreadcrumbSchema } from "@/utils/advancedSeoUtils";
import TrustedReviews from "@/components/TrustedReviews";

interface ValorantPageProps {
  onLogout: () => void;
  overrideCountry?: { code: string; currency: string };
  linkQuery?: string;
  disableSeo?: boolean;
}

const ValorantPage = ({ onLogout, overrideCountry, linkQuery, disableSeo = false }: ValorantPageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState("default");
  const [ucRangeFilter, setUcRangeFilter] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState(overrideCountry || getSelectedCountry());
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showPlayerIdModal, setShowPlayerIdModal] = useState(false);
  const [tempRiotId, setTempRiotId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [packageSelectionPrompt, setPackageSelectionPrompt] = useState(false);
  const [scrollToPackages, setScrollToPackages] = useState(false);
  const packagesRef = useRef<HTMLDivElement>(null);
  
  // Valorant specific banner
  const mobileBanner = "/lovable-uploads/valorant-points-logo.webp";
  const desktopBanner = "/lovable-uploads/valorant-points-logo.webp";

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (overrideCountry) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCountry' && e.newValue) {
        try {
          setSelectedCountry(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing country from storage event:', error);
        }
      }
    };

    const handleCountryChanged = () => {
      setSelectedCountry(getSelectedCountry());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('countryChanged', handleCountryChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('countryChanged', handleCountryChanged);
    };
  }, [overrideCountry]);

  const handlePlayerIdClick = () => {
    setTempRiotId("");
    setShowPlayerIdModal(true);
  };

  const handleVerifyRiotId = () => {
    if (!tempRiotId || tempRiotId.length < 3 || !tempRiotId.includes('#')) {
      toast({
        title: "Invalid Riot ID",
        description: "Please enter a valid Riot ID (e.g., Player#1234)",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      localStorage.setItem("valorantRiotId", tempRiotId);
      
      toast({
        title: "Riot ID Verified",
        description: "Riot ID verification successful",
      });
      
      setShowPlayerIdModal(false);
      setPackageSelectionPrompt(true);
      setScrollToPackages(true);
    }, 1500);
  };

  useEffect(() => {
    if (scrollToPackages && packagesRef.current) {
      packagesRef.current.scrollIntoView({ behavior: 'smooth' });
      setScrollToPackages(false);
    }
  }, [scrollToPackages]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const filteredPackages = valorantPackages.sort((a, b) => {
    switch (sortFilter) {
      case "price_low_high":
        return a.price - b.price;
      case "price_high_low":
        return b.price - a.price;
      case "most_popular":
        return b.baseAmount - a.baseAmount;
      case "best_value":
        const aBonus = a.bonusAmount / a.baseAmount;
        const bBonus = b.bonusAmount / b.baseAmount;
        return bBonus - aBonus;
      default:
        return 0;
    }
  });

  // SEO Keywords for Valorant
  const valorantSeoKeywords = [
    "buy valorant points", "valorant vp", "cheap valorant points", "valorant top up",
    "valorant currency", "vp recharge", "valorant points purchase", "get vp",
    "valorant money", "vp online", "buy riot points", "valorant skins",
    "cheapest valorant points", "vp discount", "vp deals", "affordable vp",
    "vp instant delivery", "fast vp delivery", "quick valorant points",
    "secure vp purchase", "trusted valorant store", "midasbuy valorant",
    "buy vp pakistan", "vp india", "vp usa", "vp worldwide",
    "475 vp", "1000 vp", "2050 vp", "3650 vp", "5350 vp", "11000 vp",
    "valorant battle pass", "valorant night market", "valorant bundle"
  ].join(", ");

  const enhancedStructuredData = generateProductSchema({
    name: "Midasbuy - Official Gaming Store for Valorant Points",
    description: "Midasbuy Official - Trusted gaming store for authentic Valorant Points. Trusted by 10M+ gamers worldwide with instant delivery and secure payments.",
    price: "1.99",
    currency: "USD",
    image: "https://middasbuy.com/lovable-uploads/valorant-points-logo.webp",
    category: "Gaming Currency"
  });

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      {!disableSeo && (
        <AdvancedSEOHelmet
          title="Buy Valorant Points | Cheapest VP Top Up | Midasbuy Official Store 2026"
          description="⚡ Buy Valorant Points at the CHEAPEST prices! 💎 Get up to 60% OFF + Bonus VP on every purchase. ✅ Instant 2-min delivery | 🔒 100% Secure | Trusted by 5M+ Valorant players worldwide."
          keywords={valorantSeoKeywords}
          canonicalUrl="/valorant"
          ogImage="https://middasbuy.com/lovable-uploads/valorant-points-logo.webp"
          jsonLdSchema={[enhancedStructuredData]}
          breadcrumbSchema={generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Buy Valorant Points", url: "/valorant" }
          ])}
        />
      )}
      <div className="corner-light-effect"></div>
      
      {/* Valorant Banner with gradient background */}
      <div className="banner-container relative" style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <div className="w-full h-48 md:h-64 bg-gradient-to-r from-red-900 via-red-800 to-red-900 flex items-center justify-center">
          <img 
            src={mobileBanner}
            alt="Valorant Points Banner"
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
        
        {/* Valorant Logo, Title, Official Badge & Subscribe - OVER banner (mobile only) - Always LTR */}
        {isMobile && (
          <div className="absolute bottom-6 left-0 flex items-center gap-2 px-3 z-20" dir="ltr">
            {/* Valorant Logo */}
            <img 
              src="/lovable-uploads/valorant-points-logo.webp" 
              alt="Valorant Logo" 
              className="w-10 h-10 rounded-lg object-cover shadow-lg"
            />
            {/* Title & Badges */}
            <div className="flex flex-col gap-0.5">
              <h2 className="text-white text-base font-bold tracking-wide drop-shadow-lg">VALORANT</h2>
              <div className="flex items-center gap-1.5">
                {/* Official Badge */}
                <div className="flex items-center gap-0.5 bg-white/90 text-gray-900 px-1 h-4 rounded text-[7px] font-semibold shadow-sm">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                  <span>Official</span>
                </div>
                
                {/* Subscribe Button - Custom glass blur style */}
                <div 
                  className="flex items-center gap-0.5 bg-white/15 backdrop-blur-md text-white px-1.5 h-[18px] rounded-full text-[7px] font-semibold cursor-pointer hover:bg-white/25 transition-all"
                  onClick={() => {
                    toast({
                      title: "Subscribe to VALORANT",
                      description: "Sign up to receive updates and exclusive offers!",
                    });
                  }}
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  <span>Subscribe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <Header onLogout={onLogout} />
      </div>
      
      <Dialog open={showPlayerIdModal} onOpenChange={setShowPlayerIdModal}>
        <DialogContent className="w-[95vw] max-w-md md:w-full bg-[#121B2E] border-none text-white p-0 overflow-hidden mx-auto">
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">Enter Your Riot ID</DialogTitle>
              <Button 
                variant="ghost" 
                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setShowPlayerIdModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          
            <div className="py-2">
              <div className="mb-3">
                <div className="bg-red-600 p-2 rounded-t-md text-center text-white text-sm">
                  Please enter your Riot ID to recharge VP
                </div>
                <div className="bg-[#1A1F2E] rounded-b-md p-3 border border-[#182238]">
                  <Input
                    value={tempRiotId}
                    onChange={(e) => setTempRiotId(e.target.value)}
                    placeholder="Enter Riot ID (e.g., Player#1234)"
                    variant="dark"
                    className="h-10 text-base"
                  />
                </div>
              </div>
              
              <Button 
                className="w-full mb-4 bg-red-600 hover:bg-red-700"
                size="lg"
                onClick={handleVerifyRiotId}
                disabled={isVerifying || !tempRiotId}
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  "OK"
                )}
              </Button>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-white font-medium mb-2 flex items-center text-sm">
                    <HelpCircle className="w-4 h-4 mr-1 text-red-500" />
                    How to find your Riot ID?
                  </h5>
                  
                  <div className="ml-5 space-y-2 text-xs text-gray-300">
                    <p>1. Open Valorant and click on your profile</p>
                    <p>2. Your Riot ID is displayed as YourName#Tag</p>
                    <p>3. Copy and paste it in the field above</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <main className={`pt-20 pb-20 relative ${isMobile ? 'mobile-content mobile-main-container' : 'z-10'}`}>
        <div className={`container mx-auto px-4 ${isMobile ? 'mobile-main-container' : ''}`}>
          <div className="flex flex-col md:flex-row items-start mb-6 relative">
            <div className="flex-grow z-10 md:ml-8 md:mt-2">
              <div className={`flex items-center mb-2 ${isMobile ? 'flex-row' : ''}`}>
                <div className={isMobile ? 'flex-1' : ''}>
                  {/* Valorant title and button - hidden initially */}
                  {!isMobile && (
                    <div className="mt-1 ml-16 opacity-0">
                      <button 
                        className="bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-md hover:from-red-500 hover:to-red-600 transition-all shadow-lg flex items-center gap-2 border border-red-500/30 px-5 py-1.5 text-sm"
                        onClick={handlePlayerIdClick}
                      >
                        <span className="font-semibold">Enter Your Riot ID</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {isMobile && (
            <div className="mt-8">
              <div className="flex justify-center mb-4 opacity-0">
                <button 
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-md hover:from-red-500 hover:to-red-600 transition-all shadow-lg flex items-center gap-2 border border-red-500/30 px-3 py-1 text-xs"
                  onClick={handlePlayerIdClick}
                >
                  <span className="font-semibold">Enter Your Riot ID</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
          
          <FilterBar
            onFilterChange={setSortFilter}
            onPaymentMethodChange={setPaymentMethod}
            onUCRangeChange={setUcRangeFilter}
            selectedFilter={sortFilter}
            selectedUCRange={ucRangeFilter}
          />
          
          <div className="mb-4">
            <button className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/10 text-red-400 text-sm hover:bg-red-600/20 transition-colors">
              <span>Try filtering to find product faster!</span>
            </button>
          </div>
          
          {packageSelectionPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-600/10 border border-red-500/30 flex items-start"
            >
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Riot ID verified successfully!</h3>
                <p className="text-gray-300 text-sm">Please select a package below to continue with your purchase.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setPackageSelectionPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          
          <div ref={packagesRef}>
            <ValorantPackageGrid packages={filteredPackages} selectedCountry={selectedCountry} linkQuery={linkQuery} />
          </div>
          
          <TrustedReviews />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ValorantPage;

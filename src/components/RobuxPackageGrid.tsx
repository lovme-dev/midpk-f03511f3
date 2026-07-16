import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimationDuration } from "@/hooks/use-mobile";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import OptimizedImage from "./OptimizedImage";
import robuxCoins from "@/assets/robux-coins.png";
import MidasCheckoutModal from "@/components/checkout/MidasCheckoutModal";
import { UCPackage } from "@/data/ucPackages";

interface Package {
  id: string;
  image: string;
  baseAmount: number;
  bonusAmount: number;
  bonusPercent?: string;
  price: number;
  originalPrice: number;
  discount: string;
}

interface RobuxPackageGridProps {
  packages: Package[];
  selectedCountry?: {
    currency: string;
    [key: string]: any;
  };
  linkQuery?: string;
}

/**
 * Robux Package Grid - Popup Checkout
 * Uses MidasCheckoutModal for checkout instead of page redirect
 */
const RobuxPackageGrid = ({ packages, selectedCountry, linkQuery }: RobuxPackageGridProps) => {
  const slowAnimationDuration = useAnimationDuration('slow');
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(null);
  
  // Use URL-based currency formatting (priority: selectedCountry prop > URL > localStorage)
  const { formatPrice, currencyCode } = useCurrencyFormat(selectedCountry);

  useEffect(() => {
    // Preload the Robux coins image
    const robuxIcon = new Image();
    robuxIcon.src = robuxCoins;
    robuxIcon.onload = () => {
      // Mark all packages as loaded since we use the same image
      const loaded: Record<string, boolean> = {};
      packages.forEach(pkg => {
        loaded[pkg.id] = true;
      });
      setImagesLoaded(loaded);
    };
    
    // Also preload the Midasbuy logo
    const midasbuyLogo = new Image();
    midasbuyLogo.src = "/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png";
  }, [packages]);

  const handlePackageClick = (pkg: Package) => {
    // Convert to UCPackage format for MidasCheckoutModal
    const ucPackage: UCPackage = {
      id: pkg.id,
      image: pkg.image,
      baseAmount: pkg.baseAmount,
      bonusAmount: pkg.bonusAmount,
      bonusPercent: pkg.bonusPercent,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      discount: pkg.discount
    };
    setSelectedPackage(ucPackage);
    setShowCheckoutModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="optimize-animation cursor-pointer"
            onClick={() => handlePackageClick(pkg)}
          >
            <div className="bg-midasbuy-navy rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,145,255,0.3)] border border-midasbuy-navy hover:border-midasbuy-blue/50">
              <div className="p-4 flex justify-center">
                <motion.img 
                  src={robuxCoins}
                  alt="Robux Coins" 
                  className={`object-contain optimize-animation ${['60uc', '300uc'].includes(pkg.id) ? 'h-10 sm:h-12' : ['600uc', '1500uc'].includes(pkg.id) ? 'h-12 sm:h-16' : 'h-16 sm:h-20'} transition-opacity duration-200 ${imagesLoaded[pkg.id] ? 'opacity-100' : 'opacity-0'}`}
                  animate={{ 
                    y: [0, -8, 0, 8, 0] 
                  }}
                  transition={{ 
                    duration: slowAnimationDuration,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  loading="eager"
                />
              </div>
              
              <div className="p-3 sm:p-4 pt-1">
                {pkg.bonusPercent && (
                  <div className="flex justify-end">
                    <div className="inline-block rounded-md bg-[#FFDD33] px-1 sm:px-2 py-0.5 text-xs sm:text-sm font-bold text-black">
                      {pkg.bonusPercent}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="robux-icon mr-1 sm:mr-2">
                    <img 
                      src={robuxCoins}
                      alt="Robux" 
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      width="20"
                      height="20"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">{pkg.baseAmount}</span>
                  {pkg.bonusAmount > 0 && (
                    <span className="text-base sm:text-lg font-semibold text-midasbuy-gold ml-1">+{pkg.bonusAmount}</span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-midasbuy-gold text-xs sm:text-sm">From</span>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-lg font-bold text-white">
                      {formatPrice(pkg.price)}
                    </span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-[#FF9900] text-black font-semibold py-1 px-1 sm:px-3 text-xs sm:text-sm flex items-center">
                  {pkg.discount}
                </div>
                <div className="bg-white text-black font-semibold py-1 px-2 sm:px-3 text-xs sm:text-sm flex-grow flex items-center ml-1 relative">
                  <span className="font-bold text-xs whitespace-nowrap">Midasbuy Only</span>
                  
                  {/* Logo always in right corner for all screen sizes */}
                  <div className="absolute right-1 sm:right-2 flex items-center">
                    <OptimizedImage 
                      src="/lovable-uploads/f4b0c93e-e2ae-4b42-9186-031879f1364f.png" 
                      alt="Logo" 
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      width={24}
                      height={24}
                      quality={40}
                      displayWidth={24}
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Checkout Modal - same as PUBG UC */}
      <MidasCheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        packageData={selectedPackage}
        isBGMI={false}
        isFreeFire={false}
        isPubgCar={false}
        isRoblox={true}
      />
    </>
  );
};

export default RobuxPackageGrid;

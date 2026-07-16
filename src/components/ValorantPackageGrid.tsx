import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";
import { valorantPackages, ValorantPackage } from "@/data/valorantPackages";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import MidasCheckoutModal from "@/components/checkout/MidasCheckoutModal";
import { UCPackage } from "@/data/ucPackages";

interface ValorantPackageGridProps {
  packages?: ValorantPackage[];
  selectedCountry?: { code: string; currency: string };
  linkQuery?: string;
}

/**
 * Valorant Package Grid - Popup Checkout
 * Uses MidasCheckoutModal for checkout instead of page redirect
 */
const ValorantPackageGrid = ({ packages = valorantPackages, selectedCountry, linkQuery }: ValorantPackageGridProps) => {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(null);
  
  // Use URL-based currency formatting (priority: selectedCountry prop > URL > localStorage)
  const { formatPrice, currencyCode } = useCurrencyFormat(selectedCountry);
  
  // Check if Pakistan for display purposes
  const isPakistan = currencyCode === 'PKR';

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePackageSelect = (pkg: ValorantPackage) => {
    // Convert to UCPackage format for MidasCheckoutModal
    const ucPackage: UCPackage = {
      id: pkg.id,
      image: pkg.image,
      baseAmount: pkg.baseAmount,
      bonusAmount: pkg.bonusAmount || 0,
      bonusPercent: pkg.bonusPercent,
      price: pkg.price,
      originalPrice: pkg.originalPrice || pkg.price,
      discount: pkg.discount || '0%'
    };
    setSelectedPackage(ucPackage);
    setShowCheckoutModal(true);
  };

  const handleImageLoad = (pkgId: string) => {
    setImagesLoaded(prev => ({ ...prev, [pkgId]: true }));
  };

  const handleImageError = (pkgId: string) => {
    setImagesLoaded(prev => ({ ...prev, [pkgId]: true }));
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-b from-[#1a2438] to-[#151c2b] rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 border border-[#2a3548]/50 hover:border-red-500/50"
            onClick={() => handlePackageSelect(pkg)}
          >
            <div className="relative p-2 sm:p-3">
              {/* Discount Badge */}
              <div className="absolute top-1 left-1 z-10">
                <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded">
                  {pkg.discount}
                </span>
              </div>
              
              {/* Package Image */}
              <div className="flex justify-center items-center h-16 sm:h-20 md:h-24 mb-2">
                <OptimizedImage
                  src={pkg.image}
                  alt={`Valorant ${pkg.baseAmount} VP`}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                  quality={85}
                />
              </div>
              
              {/* Package Amount */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                    {pkg.baseAmount.toLocaleString()}
                  </span>
                  {pkg.bonusAmount > 0 && (
                    <span className="text-red-400 text-xs sm:text-sm font-medium">
                      +{pkg.bonusAmount.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs">VP</span>
              </div>
              
              {/* Bonus Percentage */}
              {pkg.bonusAmount > 0 && (
                <div className="flex justify-center mt-1">
                  <span className="bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-400 text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-red-500/30">
                    {pkg.bonusPercent} Bonus
                  </span>
                </div>
              )}
              
              {/* Price - now uses URL-based currency */}
              <div className="mt-2 sm:mt-3 text-center">
                <div className="text-red-500 font-bold text-sm sm:text-base md:text-lg">
                  {formatPrice(pkg.price)}
                </div>
                <div className="text-gray-500 line-through text-[10px] sm:text-xs">
                  {formatPrice(pkg.originalPrice)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Checkout Modal - Valorant specific */}
      <MidasCheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        packageData={selectedPackage}
        isBGMI={false}
        isFreeFire={false}
        isPubgCar={false}
        isValorant={true}
      />
    </>
  );
};

export default ValorantPackageGrid;

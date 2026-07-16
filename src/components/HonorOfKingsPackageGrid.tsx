import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimationDuration } from "@/hooks/use-mobile";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import OptimizedImage from "./OptimizedImage";
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

interface HonorOfKingsPackageGridProps {
  packages: Package[];
  selectedCountry: {
    currency: string;
    [key: string]: any;
  };
}

/**
 * Honor of Kings Package Grid - Popup Checkout
 * Uses MidasCheckoutModal for checkout instead of page redirect
 */
const HonorOfKingsPackageGrid = ({ packages, selectedCountry }: HonorOfKingsPackageGridProps) => {
  const slowAnimationDuration = useAnimationDuration('slow');
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const { formatPrice } = useCurrencyFormat();
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(null);

  useEffect(() => {
    // Preload all package images
    packages.forEach(pkg => {
      const img = new Image();
      img.src = pkg.image;
      img.onload = () => {
        setImagesLoaded(prev => ({
          ...prev,
          [pkg.id]: true
        }));
      };
    });

    // Also preload the token icon for better performance
    const tokenIcon = new Image();
    tokenIcon.src = "/lovable-uploads/66f224af-167c-45ac-9981-180dd2bf927d.png";
    
    // And the Midasbuy logo
    const midasbuyLogo = new Image();
    midasbuyLogo.src = "/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png";
    
    // Preload the honor of kings currency icon
    const honorIcon = new Image();
    honorIcon.src = "/lovable-uploads/fc143449-9fb4-4203-8027-be50aebec0eb.png";
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
            onClick={() => handlePackageClick(pkg)}
            className="cursor-pointer optimize-animation"
          >
            <div className="bg-midasbuy-navy rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,145,255,0.3)] border border-midasbuy-navy hover:border-midasbuy-blue/50">
                <div className="p-4 flex justify-center">
                  <motion.img 
                    src={pkg.image}
                    alt="Honor of Kings Tokens" 
                    className={`object-contain optimize-animation ${['8tokens', '16tokens', '23tokens', '80tokens'].includes(pkg.id) ? 'h-10 sm:h-12' : ['240tokens', '400tokens', '560tokens', '800tokens'].includes(pkg.id) ? 'h-12 sm:h-16' : 'h-16 sm:h-20'} transition-opacity duration-200 ${imagesLoaded[pkg.id] ? 'opacity-100' : 'opacity-0'}`}
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
                    <div className="token-icon mr-1 sm:mr-2">
                      <img 
                        src="/lovable-uploads/66f224af-167c-45ac-9981-180dd2bf927d.png" 
                        alt="Token" 
                        className="w-4 h-4 sm:w-5 sm:h-5" 
                        loading="eager"
                      />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-white">{pkg.baseAmount}</span>
                    {pkg.bonusAmount > 0 && (
                      <span className="text-base sm:text-lg font-semibold text-midasbuy-gold ml-1">+{pkg.bonusAmount}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-midasbuy-gold text-xs sm:text-sm">From</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <img 
                          src="/lovable-uploads/fc143449-9fb4-4203-8027-be50aebec0eb.png"
                          alt="Honor of Kings Currency"
                          className="h-4 w-4 mr-1 text-midasbuy-gold"
                        />
                        <span className="text-lg sm:text-xl font-bold text-white">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                    </div>
                    
                    {pkg.originalPrice > pkg.price && (
                      <div className="flex items-center gap-2 ml-5">
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-[#FF9900] text-black font-semibold py-1 px-1 sm:px-3 text-xs sm:text-sm flex items-center">
                    {pkg.discount}
                  </div>
                  <div className="bg-white text-black font-semibold py-1 px-2 sm:px-3 text-xs sm:text-sm flex-grow flex items-center ml-1 justify-between sm:justify-center sm:relative">
                    {/* Default mobile layout */}
                    <div className="flex items-center gap-0.5 sm:justify-center">
                      <span className="font-bold text-xs whitespace-nowrap">Midasbuy Only</span>
                      {/* Mobile layout: logo next to text */}
                      <OptimizedImage 
                        src="/lovable-uploads/f4b0c93e-e2ae-4b42-9186-031879f1364f.png" 
                        alt="Logo" 
                        className="w-5 h-5 sm:hidden [@media(max-width:390px)_and_(-webkit-min-device-pixel-ratio:3)]:hidden"
                        width={24}
                        height={24}
                        quality={40}
                        displayWidth={24}
                        priority={true}
                      />
                    </div>
                    
                    {/* iPhone 14 Pro Max specific: logo in corner */}
                    <div className="hidden [@media(max-width:390px)_and_(-webkit-min-device-pixel-ratio:3)]:absolute [@media(max-width:390px)_and_(-webkit-min-device-pixel-ratio:3)]:right-1 [@media(max-width:390px)_and_(-webkit-min-device-pixel-ratio:3)]:flex [@media(max-width:390px)_and_(-webkit-min-device-pixel-ratio:3)]:items-center">
                      <OptimizedImage 
                        src="/lovable-uploads/f4b0c93e-e2ae-4b42-9186-031879f1364f.png" 
                        alt="Logo" 
                        className="w-4 h-4"
                        width={24}
                        height={24}
                        quality={40}
                        displayWidth={24}
                        priority={true}
                      />
                    </div>
                    
                    {/* Desktop layout: logo in right corner */}
                    <div className="hidden sm:flex items-center absolute right-2">
                      <OptimizedImage 
                        src="/lovable-uploads/f4b0c93e-e2ae-4b42-9186-031879f1364f.png" 
                        alt="Logo" 
                        className="w-6 h-6"
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
      
      {/* Checkout Modal - Honor of Kings specific */}
      <MidasCheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        packageData={selectedPackage}
        isBGMI={false}
        isFreeFire={false}
        isPubgCar={false}
        isHonorOfKings={true}
      />
    </>
  );
};

export default HonorOfKingsPackageGrid;

import { motion } from "framer-motion";
import { useAnimationDuration } from "@/hooks/use-mobile";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OptimizedImage from "./OptimizedImage";
import MidasCheckoutModal from "./checkout/MidasCheckoutModal";
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

interface PackageGridProps {
  packages: Package[];
  selectedCountry: {
    currency: string;
    [key: string]: any;
  };
  linkQuery?: string;
}

const PackageGrid = ({ packages, selectedCountry, linkQuery }: PackageGridProps) => {
  const slowAnimationDuration = useAnimationDuration("slow");
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { t } = useTranslation();
  
  // Use centralized currency formatting
  const { formatPrice, currencyCode } = useCurrencyFormat();

  // Check if BGMI context
  const isBGMI = selectedCountry?.currency === 'INR';

  useEffect(() => {
    // Preload all package images
    packages.forEach((pkg) => {
      const img = new Image();
      img.src = pkg.image;
      img.onload = () => {
        setImagesLoaded((prev) => ({
          ...prev,
          [pkg.id]: true,
        }));
      };
    });

    // Preload critical badge images immediately
    const preloadImages = [
      "/images/vip1-badge.png",
      "/images/bonus-bubble.png",
      "/images/uc-icon.png",
      "/images/assist-value-ticket.png",
      "/images/discount-badge-bg.jpeg",
      "/images/midasbuy-coin-icon.png",
      "/lovable-uploads/f6597fcb-d2eb-4e92-9f21-fe5959fa5360.png",
      "/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png"
    ];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [packages]);

  const handlePackageClick = (pkg: Package) => {
    // Convert Package to UCPackage format for the modal
    const ucPackage: UCPackage = {
      id: pkg.id,
      image: pkg.image,
      baseAmount: pkg.baseAmount,
      bonusAmount: pkg.bonusAmount,
      bonusPercent: pkg.bonusPercent,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      discount: pkg.discount,
    };
    setSelectedPackage(ucPackage);
    setShowCheckoutModal(true);
  };

  return (
    <>
      {/* Grid: 2 columns on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" dir="ltr">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="optimize-animation"
          >
            <div 
              onClick={() => handlePackageClick(pkg)} 
              className="block h-full cursor-pointer"
            >
              <div className="rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,145,255,0.3)] border border-[#1a2744] hover:border-midasbuy-blue/50 relative flex flex-col">

                {/* Popular Tag - only for first 2 packages */}
                {index < 2 && (
                  <div className="absolute top-2 left-0.5 sm:top-3 sm:left-2 z-10">
                    <span
                      className="text-white text-[7px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 block"
                      style={{
                        background: "linear-gradient(135deg, #66CC33 0%, #399966 100%)",
                        borderRadius: "3px 2px 0 2px",
                        clipPath: "polygon(0 0, 92% 0, 97% 4%, 100% 12%, 84% 92%, 82% 96%, 79% 100%, 0 100%)",
                      }}
                    >
                      {t('packageGrid.popular', 'Popular')}
                    </span>
                  </div>
                )}

                {/* Top section - lighter gradient */}
                <div
                  className="p-2 sm:p-3 pb-5 sm:pb-6 flex flex-col relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #1A2540 0%, #1E2D4D 100%)",
                  }}
                >
                  {/* Subtle cyan glow from top-left corner */}
                  <div
                    className="absolute -top-2 -left-2 w-24 h-20 sm:w-32 sm:h-24 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at top left, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.06) 45%, transparent 70%)",
                      filter: "blur(5px)",
                    }}
                  />
                  <div className="flex justify-center items-end relative z-[1]">
                    <motion.img
                      src={pkg.image}
                      alt="UC Coins"
                      className={`object-contain optimize-animation h-[2.6rem] sm:h-[3.5rem] transition-opacity duration-200 ${imagesLoaded[pkg.id] ? "opacity-100" : "opacity-0"}`}
                      animate={{
                        y: [0, -6, 0, 6, 0],
                      }}
                      transition={{
                        duration: slowAnimationDuration,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      loading="eager"
                    />
                  {/* Assist Value Ticket - right of UC image */}
                    <img
                      src="/images/assist-value-ticket.png"
                      alt="Assist Value"
                      className="w-7 h-7 sm:w-9 sm:h-9 object-contain ml-1 -mb-1 -mt-1"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Bottom section - navy with subtle blue tint */}
                <div className="p-2 sm:p-3 pt-1 bg-[#182442] flex-grow">
                  {/* VIP1 Badge with bonus percentage speech bubble behind */}
                  <div className="flex items-center justify-center mb-0.5 -mt-0.5 relative" style={{ transform: 'scale(0.90)', transformOrigin: 'center center' }}>
                    {pkg.bonusPercent && (
                      <div
                        className="absolute flex items-center justify-end"
                        style={{
                          left: '50%',
                          marginLeft: '6px',
                          top: '2px',
                          zIndex: 1,
                          width: '44px',
                          height: '20px',
                        }}
                      >
                        <img
                          src="/images/bonus-bubble.png"
                          alt=""
                          className="absolute inset-0 w-full h-full object-fill sm:hidden"
                          loading="eager"
                          fetchPriority="high"
                        />
                        <img
                          src="/images/bonus-bubble.png"
                          alt=""
                          className="absolute inset-0 hidden sm:block object-fill"
                          style={{ width: '52px', height: '24px', top: '1px', left: '10px' }}
                          loading="eager"
                          fetchPriority="high"
                        />
                        <span className="relative text-white font-bold text-[8px] sm:text-[9px] drop-shadow-sm pr-1 sm:pr-0 sm:mr-[-1px]">
                          <span className="sm:hidden" style={{ marginRight: '1px', position: 'relative', top: '-3px' }}>{pkg.bonusPercent}</span>
                          <span className="hidden sm:inline" style={{ position: 'relative', top: '1px', left: '2px' }}>{pkg.bonusPercent}</span>
                        </span>
                      </div>
                    )}
                    <img
                      src="/images/vip1-badge.png"
                      alt="VIP1"
                      className="h-5 sm:h-6 object-contain relative"
                      style={{ zIndex: 2 }}
                      loading="eager"
                    />
                  </div>
                  {/* UC values centered with icon on left */}
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="uc-icon mr-1.5 sm:mr-2">
                      <img
                        src="/images/uc-icon.png"
                        alt="UC"
                        className="w-5 h-5 sm:w-7 sm:h-7"
                        width="28"
                        height="28"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-white">{pkg.baseAmount}</span>
                    {pkg.bonusAmount > 0 && (
                      <span className="text-sm sm:text-base font-semibold text-midasbuy-gold ml-1">
                        +{pkg.bonusAmount}
                      </span>
                    )}
                  </div>

                  {/* Price centered */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-midasbuy-gold text-xs sm:text-sm">{t('packageGrid.from', 'From')}</span>
                      <span className="text-sm sm:text-lg font-bold text-midasbuy-gold">
                        {formatPrice(pkg.price)}
                      </span>
                    </div>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Orange discount badge with coin icon */}
                  <div className="flex justify-center mt-1.5">
                    <div
                      className="relative flex items-center justify-center px-2 sm:px-3 py-0.5 sm:py-1 rounded overflow-hidden"
                      style={{
                        backgroundImage: "url('/images/discount-badge-bg.jpeg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <img
                        src="/images/midasbuy-coin-icon.png"
                        alt=""
                        className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 object-contain mr-1"
                        loading="eager"
                      />
                      <span className="text-white font-bold text-[9px] sm:text-[11px] drop-shadow-sm">
                        {pkg.discount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Midas Checkout Modal */}
      <MidasCheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        packageData={selectedPackage}
        isBGMI={isBGMI}
      />
    </>
  );
};

export default PackageGrid;

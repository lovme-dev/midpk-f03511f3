import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimationDuration, useResponsive } from "@/hooks/use-mobile";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useTranslation } from "react-i18next";
import OptimizedImage from "./OptimizedImage";
import MidasCheckoutModal from "./checkout/MidasCheckoutModal";
import { UCPackage } from "@/data/ucPackages";
import { DiamondPackage } from "@/data/diamondPackages";

interface DiamondPackageGridProps {
  packages: DiamondPackage[];
  selectedCountry?: { code: string; currency: string };
}

/**
 * Diamond Package Grid - URL-Based Pricing
 * Mirrors the PUBG PackageGrid design with Free Fire-specific assets
 * (diamond icon + chest images instead of UC coins).
 */
const DiamondPackageGrid = ({ packages, selectedCountry }: DiamondPackageGridProps) => {
  const slowAnimationDuration = useAnimationDuration("slow");
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { isMobile } = useResponsive();
  const { t } = useTranslation();

  // URL-based currency formatting (priority: selectedCountry prop > URL > localStorage)
  const { formatPrice, currencyCode } = useCurrencyFormat(selectedCountry);

  useEffect(() => {
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

    // Preload PUBG-style badge assets used in this grid
    const preloadImages = [
      "/images/vip1-badge.png",
      "/images/bonus-bubble.png",
      "/images/free-fire-diamond-icon.jpeg",
      "/images/discount-badge-bg.jpeg",
      "/images/midasbuy-coin-icon.png",
      "/lovable-uploads/ff-diamond-chest-1.webp",
      "/lovable-uploads/ff-diamond-chest-2.webp",
      "/lovable-uploads/ff-diamond-chest-3.webp",
    ];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [packages]);

  const handlePackageClick = (pkg: DiamondPackage) => {
    setSelectedPackage(pkg);
    setShowCheckoutModal(true);
  };

  // Convert DiamondPackage to UCPackage format for MidasCheckoutModal
  const convertToUCPackage = (pkg: DiamondPackage | null): UCPackage | null => {
    if (!pkg) return null;
    return {
      id: pkg.id,
      baseAmount: pkg.baseAmount,
      bonusAmount: pkg.bonusAmount,
      discount: pkg.discount || "",
      price: pkg.price,
      originalPrice: pkg.price,
      bonusPercent: pkg.bonusAmount > 0 ? `${Math.round((pkg.bonusAmount / pkg.baseAmount) * 100)}%` : "0%",
      image: pkg.image,
    };
  };

  // Get the chest image based on package index (Free Fire-specific assets)
  const getChestImage = (index: number): string => {
    if (index === 0) return "/lovable-uploads/ff-diamond-chest-1.webp";
    if (index >= 1 && index <= 5) return "/lovable-uploads/ff-diamond-chest-2.webp";
    return "/lovable-uploads/ff-diamond-chest-3.webp";
  };

  return (
    <>
      {/* Grid: 2 columns on mobile, 3 columns on desktop — same as PUBG */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" dir="ltr">
        {packages.map((pkg, index) => {
          const bonusPercent =
            pkg.bonusAmount > 0
              ? `${Math.round((pkg.bonusAmount / pkg.baseAmount) * 100)}%`
              : null;

          return (
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
                  {/* Popular Tag - only for first 2 packages (matches PUBG shape) */}
                  {index < 2 && (
                    <div className="absolute top-2 left-0.5 sm:top-3 sm:left-2 z-10">
                      <span
                        className="text-white text-[7px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 block"
                        style={{
                          background: "linear-gradient(135deg, #66CC33 0%, #399966 100%)",
                          borderRadius: "3px 2px 0 2px",
                          clipPath:
                            "polygon(0 0, 92% 0, 97% 4%, 100% 12%, 84% 92%, 82% 96%, 79% 100%, 0 100%)",
                        }}
                      >
                        {t("packageGrid.popular", "Popular")}
                      </span>
                    </div>
                  )}

                  {/* Top section - lighter gradient with chest icon (Free Fire asset) */}
                  <div
                    className="p-2 sm:p-3 pb-5 sm:pb-6 flex flex-col relative overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, #1A2540 0%, #1E2D4D 100%)",
                    }}
                  >
                    {/* Subtle cyan glow from top-left corner — same as PUBG */}
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
                        src={getChestImage(index)}
                        alt="Diamond Chest"
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
                    </div>
                  </div>

                  {/* Bottom section - navy with subtle blue tint */}
                  <div className="p-2 sm:p-3 pt-1 bg-[#182442] flex-grow">
                    {/* VIP1 Badge with bonus percentage speech bubble behind — same as PUBG */}
                    <div
                      className="flex items-center justify-center mb-0.5 -mt-0.5 relative"
                      style={{ transform: "scale(0.90)", transformOrigin: "center center" }}
                    >
                      {bonusPercent && (
                        <div
                          className="absolute flex items-center justify-end"
                          style={{
                            left: "50%",
                            marginLeft: "6px",
                            top: "2px",
                            zIndex: 1,
                            width: "44px",
                            height: "20px",
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
                            style={{ width: "52px", height: "24px", top: "1px", left: "10px" }}
                            loading="eager"
                            fetchPriority="high"
                          />
                          <span className="relative text-white font-bold text-[8px] sm:text-[9px] drop-shadow-sm pr-1 sm:pr-0 sm:mr-[-1px]">
                            <span
                              className="sm:hidden"
                              style={{ marginRight: "1px", position: "relative", top: "-3px" }}
                            >
                              {bonusPercent}
                            </span>
                            <span
                              className="hidden sm:inline"
                              style={{ position: "relative", top: "1px", left: "2px" }}
                            >
                              {bonusPercent}
                            </span>
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

                    {/* Diamond values centered with Free Fire diamond icon on left */}
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="mr-1.5 sm:mr-2">
                        <img
                          src="/images/free-fire-diamond-icon.jpeg"
                          alt="Diamond"
                          className="w-5 h-5 sm:w-7 sm:h-7"
                          width="28"
                          height="28"
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {pkg.baseAmount.toLocaleString()}
                      </span>
                      {pkg.bonusAmount > 0 && (
                        <span className="text-sm sm:text-base font-semibold text-midasbuy-gold ml-1">
                          +{pkg.bonusAmount.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Price centered — gold color matching the +bonus text */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-midasbuy-gold text-xs sm:text-sm">
                          {t("packageGrid.from", "From")}
                        </span>
                        <span className="text-sm sm:text-lg font-bold text-midasbuy-gold">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                    </div>

                    {/* Orange discount badge with Midasbuy coin icon — same as PUBG */}
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
          );
        })}
      </div>

      <MidasCheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        packageData={convertToUCPackage(selectedPackage)}
        isFreeFire={true}
      />
    </>
  );
};

export default DiamondPackageGrid;

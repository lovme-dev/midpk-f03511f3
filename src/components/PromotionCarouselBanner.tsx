import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import promoCharacter1 from "@/assets/promo-character-1.png";
import promoUcBox from "@/assets/promo-uc-box.png";
import promoCharacter2 from "@/assets/promo-character-2.png";

interface PromotionCarouselBannerProps {
  className?: string;
}

const PromotionCarouselBanner = ({ className = "" }: PromotionCarouselBannerProps) => {
  const { t } = useTranslation();
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Promotional banner slides with matching backgrounds from reference
  const promoSlides = [
    {
      textKey: "promoBanner.slide1",
      defaultText: "Enter player id to view rewards & unlock exclusive bonuses. Get special discounts on UC purchases!",
      subText: "",
      hasEndDate: false,
      image: promoCharacter1,
      bgGradient: "bg-gradient-to-r from-[#c4a574] via-[#a8865a] to-[#8b6d45]", // Golden/sand color
      isFullBanner: false
    },
    {
      textKey: "promoBanner.slide2",
      defaultText: "Recharge & Spin UC | Friends Get Free Coupons —— 3000UC MAX!",
      subText: "",
      hasEndDate: false,
      image: promoUcBox,
      bgGradient: "bg-gradient-to-br from-[#d4956a] via-[#c47850] to-[#a85a3a]", // Orange gradient
      isFullBanner: false
    },
    {
      textKey: "promoBanner.slide3",
      defaultText: "100% winning rate! Double points on Member Day, Only Today! Come and win the grand prize!",
      subText: "",
      hasEndDate: true,
      endDate: "2026-12-31",
      image: promoCharacter2,
      bgGradient: "bg-gradient-to-r from-[#8ba4b8] via-[#7a94a8] to-[#6a8498]", // Grayish blue
      isFullBanner: false
    },
    {
      textKey: "promoBanner.slide4",
      defaultText: "Redeem Code: Standard Amount → Direct Purchase: More Offers",
      subText: "",
      hasEndDate: false,
      image: "/lovable-uploads/redeem-code-promo-banner.png",
      bgGradient: "", // No gradient, using full banner image
      isFullBanner: true
    }
  ];

  // Auto-rotate promotional banners every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-visible rounded-lg h-14 md:h-20 lg:h-24 ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPromoIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 ${promoSlides[currentPromoIndex].bgGradient} rounded-lg overflow-visible`}
        >
          {/* Full Banner Image Slide */}
          {promoSlides[currentPromoIndex].isFullBanner ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={promoSlides[currentPromoIndex].image}
                alt="Promo Banner"
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center px-3 md:px-6">
              {/* End date badge */}
              {promoSlides[currentPromoIndex].hasEndDate && (
                <div className="absolute -top-2 left-2 md:left-4 bg-white text-gray-800 text-[8px] md:text-[10px] px-1.5 py-0.5 rounded font-semibold shadow-md z-20">
                  {t('endsIn', 'Ends in')} {promoSlides[currentPromoIndex].endDate}
                </div>
              )}

              {/* Character Image - Right corner on mobile, Left on PC */}
              <div className="absolute right-0 md:right-auto md:left-0 bottom-0 h-[120%] md:h-[130%] w-16 md:w-24 lg:w-32 pointer-events-none z-10">
                <img
                  src={promoSlides[currentPromoIndex].image}
                  alt="Promo Character"
                  className="w-full h-full object-contain object-bottom drop-shadow-2xl"
                />
              </div>

              {/* Text Content - Left on mobile, after icon on PC */}
              <div className="ml-0 mr-16 md:ml-24 md:mr-0 lg:ml-36 flex-1 pr-0 md:pr-12">
                <p className="text-white text-[10px] md:text-xs lg:text-sm font-bold leading-tight drop-shadow-lg">
                  {t(promoSlides[currentPromoIndex].textKey, promoSlides[currentPromoIndex].defaultText)}
                </p>
              </div>

              {/* GO Button - Visible on all devices, overlaps icon slightly on mobile */}
              <button className="absolute right-10 md:right-4 bg-white text-gray-800 font-bold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg z-20">
                GO
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Carousel Indicators - Far right side vertical, outside banner */}
      <div className="absolute -right-2 md:-right-3 lg:-right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {promoSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPromoIndex(index)}
            className={`w-1.5 md:w-2 rounded-full transition-all shadow-sm ${
              index === currentPromoIndex ? "bg-white h-4 md:h-5" : "bg-white/50 h-1.5 md:h-2"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PromotionCarouselBanner;

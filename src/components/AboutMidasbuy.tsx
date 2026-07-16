
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/use-mobile';
import FeatureBoxesCarousel from './FeatureBoxesCarousel';
import OptimizedImage from './OptimizedImage';

const AboutMidasbuy = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { isMobile } = useResponsive();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the background image with higher priority
    const img = new Image();
    img.src = "/lovable-uploads/decafc18-49f3-42c9-83f5-64a5c5f9c3c7.png";
    img.onload = () => setIsImageLoaded(true);
    img.loading = "eager"; // Browser hint to load this image with high priority
    
    // Also preload the Tencent logo
    const logoImg = new Image();
    logoImg.src = "/lovable-uploads/edac9bb3-e3c4-4e95-b6ac-a20ef2194d6f.png";
    logoImg.loading = "eager";
  }, []);

  return (
    <div className="py-12 relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Use picture element for better loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isImageLoaded ? 0.25 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <OptimizedImage 
            src="/lovable-uploads/decafc18-49f3-42c9-83f5-64a5c5f9c3c7.png" 
            alt="Games Background" 
            className="w-full h-full object-cover"
            quality={75}
          />
        </motion.div>
        <div className="absolute inset-0 bg-midasbuy-navy/70"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl text-white font-bold">ABOUT MIDASBUY</h2>
          
          <div className="mt-8">
            <div className="bg-gradient-to-br from-midasbuy-navy/80 to-midasbuy-navy/40 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-3xl md:text-4xl text-white font-bold mb-6">
                PAY SAFE, FAST AND FUN WITH MIDASBUY.
              </h3>
              
              <div className="flex items-center justify-center mb-6">
                <span className="text-xl text-white font-semibold mr-2">TENCENT</span>
                <span className="mx-2 text-white">|</span>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <OptimizedImage 
                    src="/lovable-uploads/edac9bb3-e3c4-4e95-b6ac-a20ef2194d6f.png" 
                    alt="Tencent Logo" 
                    className="h-6"
                    priority={true}
                    quality={90}
                  />
                </motion.div>
              </div>
              
              <p className="text-gray-300 text-lg mb-4">
                Midasbuy is the official recharge store by Tencent. We have established official partnerships with <span className="text-white font-semibold">30</span> game companies and game studios around the world to jointly create a safe and convenient recharge store for <span className="text-white font-semibold">ten of millions</span> players.
              </p>
              
              <div className="bg-midasbuy-navy/60 rounded-lg p-4 border border-midasbuy-blue/20">
                <h4 className="text-white font-bold mb-2">Our Website & Platform Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Secure digital purchases for gaming currency and items</li>
                  <li>• Multiple payment methods including mobile payments</li>
                  <li>• Instant delivery of purchased content to your game account</li>
                  <li>• 24/7 customer support via WhatsApp and email</li>
                  <li>• PCI DSS compliant payment processing</li>
                  <li>• Official partnerships with PUBG Mobile, Honor of Kings, and more</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <FeatureBoxesCarousel showHeading={true} />
        </div>
      </div>
    </div>
  );
};

export default AboutMidasbuy;

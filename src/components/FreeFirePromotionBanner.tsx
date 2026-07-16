import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import OptimizedImage from "./OptimizedImage";

interface FreeFirePromotionBannerProps {
  onClose: () => void;
}

const FreeFirePromotionBanner = ({ onClose }: FreeFirePromotionBannerProps) => {
  const futureDate = addDays(new Date(), 10);
  const formattedDate = format(futureDate, "yyyy-MM-dd");

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-gradient-to-r from-orange-500/15 to-red-500/10 rounded-lg overflow-hidden relative"
    >
      {/* Free Fire Banner Image */}
      <div className="relative">
        <OptimizedImage 
          src="/lovable-uploads/4fa42d96-1385-4147-9ed0-56b3410ef53e.png"
          alt="Free Fire Promotion Banner"
          className="w-full h-32 md:h-40 object-cover"
          quality={90}
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/20 flex items-center">
          <div className="absolute top-2 left-2 text-xs text-black font-medium bg-orange-400 py-1 px-2 rounded-br-md">
            Ends in {formattedDate}
          </div>
          
          <div className="flex-grow px-4 py-2 mt-6">
            <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
              <span className="text-orange-300 font-bold">Recharging 100, 520, or 1080 Diamonds</span> will get you exclusive Free Fire rewards! Limited time offer.
            </p>
          </div>
          
          <button className="flex-shrink-0 bg-white text-orange-600 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 hover:bg-orange-100 transition-colors">
            GO
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-orange-200 bg-black/30 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default FreeFirePromotionBanner;

import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { useTranslation } from "react-i18next";

interface PromotionBannerProps {
  onClose: () => void;
}

const PromotionBanner = ({ onClose }: PromotionBannerProps) => {
  const { t } = useTranslation();
  
  // Calculate a future date 10 days from now
  const futureDate = addDays(new Date(), 10);
  const formattedDate = format(futureDate, "yyyy-MM-dd");

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-gradient-to-r from-midasbuy-darkGold/15 to-midasbuy-gold/10 rounded-lg p-3 flex items-center relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 text-xs text-black font-medium bg-midasbuy-gold py-1 px-2 rounded-br-md">
        {t('endsIn', 'Ends in')} {formattedDate}
      </div>
      
      <div className="ml-8 flex-grow py-2">
        <p className="text-gray-200 font-medium text-sm">
          <span className="text-midasbuy-gold font-bold">Recharging 60UC, 300UC, or 600UC</span> will get you the Classic Crate Voucher (30 UC). One purchase per day, three times in total.
        </p>
      </div>
      
      <button className="flex-shrink-0 bg-white text-midasbuy-navy font-bold rounded-full h-8 w-8 flex items-center justify-center">
        GO
      </button>
      
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </motion.div>
  );
};

export default PromotionBanner;

import { motion } from "framer-motion";
import { User, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventsTabContent = () => {
  const { t } = useTranslation();
  
  return (
    <div className="py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-effect rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <User className="w-6 h-6 mr-2 text-midasbuy-gold" />
                {t('eventsTab.title', 'PUBG Mobile Events')}
              </h2>
              <div className="bg-midasbuy-navy/50 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center">
                <Shield className="w-3 h-3 mr-1 text-midasbuy-blue" />
                {t('eventsTab.liveEvents', 'Live Events')}
              </div>
            </div>
            
            <div className="bg-midasbuy-navy/30 p-6 rounded-lg border border-midasbuy-blue/20">
              <h3 className="text-xl font-bold text-white mb-4">{t('eventsTab.upcomingEvents', 'Upcoming Events')}</h3>
              
              <div className="bg-midasbuy-navy/40 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-midasbuy-gold font-semibold">{t('eventsTab.ucBonusEvent', 'UC Bonus Event')}</h4>
                      <p className="text-gray-300 text-sm mt-1">{t('eventsTab.ucBonusDesc', 'Get extra UC on all purchases')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-xs">{t('eventsTab.endsIn', 'Ends in')}</div>
                      <div className="text-midasbuy-gold font-bold">{t('eventsTab.threeDays', '3 days')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-midasbuy-gold font-semibold">{t('eventsTab.royalPassSeason', 'Royal Pass Season')}</h4>
                      <p className="text-gray-300 text-sm mt-1">{t('eventsTab.royalPassDesc', 'New season starting soon')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-xs">{t('eventsTab.startsIn', 'Starts in')}</div>
                      <div className="text-midasbuy-gold font-bold">{t('eventsTab.fiveDays', '5 days')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-midasbuy-gold font-semibold">{t('eventsTab.limitedTimeOffer', 'Limited Time Offer')}</h4>
                      <p className="text-gray-300 text-sm mt-1">{t('eventsTab.limitedTimeDesc', 'Special discounts on selected items')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-xs">{t('eventsTab.availableFor', 'Available for')}</div>
                      <div className="text-midasbuy-gold font-bold">{t('eventsTab.twentyFourHours', '24 hours')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsTabContent;

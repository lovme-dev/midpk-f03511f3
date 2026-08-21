
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, HelpCircle, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import { useTranslation } from "react-i18next";
import { useLocalization } from "@/contexts/LocalizationContext";

interface HelpCenterPageProps {
  onLogout: () => void;
}

const HelpCenterPage = ({ onLogout }: HelpCenterPageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHelmet 
        title="Midasbuy Help Center - Customer Support & FAQ"
        description="Get help and support for your Midasbuy orders. 24/7 customer support, live chat, email, and WhatsApp assistance for all gaming credit purchases."
        keywords="Midasbuy help, customer support, live chat, gaming credits support, PUBG UC help, Free Fire diamonds support"
        canonicalUrl="/help-center"
        ogImage="/og-image.png"
        ogType="website"
      />
      <Header onLogout={onLogout} />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              <span>{t('backToHome')}</span>
            </Link>
          </div>
          
          <div className="glass-effect p-8 rounded-xl mb-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-12 h-12 text-midasbuy-blue" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('pages.helpCenter.title')}</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {t('pages.helpCenter.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-effect p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-midasbuy-gold`} />
                  {t('pages.helpCenter.contactByPhone')}
                </h2>
                <p className="text-gray-300 mb-4">
                  {t('pages.helpCenter.phoneDescription')}
                </p>
                <div className="p-4 bg-midasbuy-navy/30 rounded-lg space-y-3">
                  <div>
                    <p className="font-medium text-white">{t('pages.helpCenter.customerSupport')}:</p>
                    <a href="https://wa.me/14502324500" className="text-midasbuy-gold text-lg hover:underline">+1 450 232 4500</a>
                    <p className="text-sm text-gray-400 mt-1">{t('pages.helpCenter.clickToChat')}</p>
                  </div>
                </div>
                <a 
                  href="https://wa.me/14502324500" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0d7d6e] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-[#25D366]/30 hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                  </svg>
                  {t('pages.helpCenter.chatWithAgent')}
                </a>
              </div>
              
              <div className="glass-effect p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Mail className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-midasbuy-gold`} />
                  {t('pages.helpCenter.emailSupport')}
                </h2>
                <p className="text-gray-300 mb-4">
                  {t('pages.helpCenter.emailDescription')}
                </p>
                <div className="p-4 bg-midasbuy-navy/30 rounded-lg">
                  <p className="font-medium text-white">{t('pages.helpCenter.supportEmail')}:</p>
                  <p className="text-midasbuy-gold text-lg">help@midasbuy.com.pk</p>
                  <p className="text-sm text-gray-400 mt-1">{t('pages.helpCenter.responseTime')}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 glass-effect p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <MessageCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-midasbuy-gold`} />
                {t('pages.helpCenter.liveChat')}
              </h2>
              <p className="text-gray-300 mb-4">
                {t('pages.helpCenter.liveChatDescription')}
              </p>
              <div className="text-center mt-4">
                <Button className="bg-midasbuy-blue hover:bg-blue-600 px-8">
                  {t('pages.helpCenter.startLiveChat')}
                </Button>
                <p className="text-sm text-gray-400 mt-2">{t('pages.helpCenter.available247')}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>{t('pages.helpCenter.stillHaveQuestions')} <Link to="/faqs" className="text-midasbuy-blue hover:underline">{t('faqs')}</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenterPage;


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copyright, Shield } from "lucide-react";
import Header from "@/components/Header";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import { useTranslation } from "react-i18next";
import { useLocalization } from "@/contexts/LocalizationContext";

interface CopyrightNoticePageProps {
  onLogout: () => void;
}

const CopyrightNoticePage = ({ onLogout }: CopyrightNoticePageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHelmet 
        title="Midasbuy Copyright Notice | Legal Rights & Content Policy"
        description="Read the official Midasbuy Copyright Notice to understand our legal rights, content ownership, and usage policy. Protecting digital products, templates, and customer trust."
        keywords="midasbuy, copyright, notice, midasbuy copyright, midasbuy notice, midasbuy copyright notice, copyright notice midasbuy, midasbuy legal notice, midasbuy content policy"
        canonicalUrl="/copyright-notice"
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
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Copyright className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('pages.copyrightNotice.title')}</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pages.copyrightNotice.subtitle')}
            </p>
          </div>
          
          <div className="glass-effect p-8 rounded-xl mb-6">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.copyrightProtection.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.copyrightProtection.content1')}
                </p>
                <p className="mt-2">
                  {t('pages.copyrightNotice.sections.copyrightProtection.content2')}
                </p>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.trademarks.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.trademarks.content1')}
                </p>
                <div className="mt-4 p-4 bg-midasbuy-navy/30 rounded-lg">
                  <div className="flex items-start">
                    <Shield className={`w-5 h-5 text-purple-500 mt-0.5 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} />
                    <p className="text-sm">
                      {t('pages.copyrightNotice.sections.trademarks.notice')}
                    </p>
                  </div>
                </div>
                <p className="mt-3">
                  {t('pages.copyrightNotice.sections.trademarks.content2')}
                </p>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.useOfContent.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.useOfContent.intro')}
                </p>
                <ul className={`list-disc ${isRTL ? 'pr-5' : 'pl-5'} mt-3 space-y-2`}>
                  {(t('pages.copyrightNotice.sections.useOfContent.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3">
                  {t('pages.copyrightNotice.sections.useOfContent.termination')}
                </p>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.userGeneratedContent.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.userGeneratedContent.content1')}
                </p>
                <p className="mt-2">
                  {t('pages.copyrightNotice.sections.userGeneratedContent.content2')}
                </p>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.copyrightInfringement.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.copyrightInfringement.intro')}
                </p>
                <ul className={`list-disc ${isRTL ? 'pr-5' : 'pl-5'} mt-3 space-y-2`}>
                  {(t('pages.copyrightNotice.sections.copyrightInfringement.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                
                <div className="mt-4 p-4 bg-midasbuy-navy/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">{t('pages.copyrightNotice.sections.copyrightInfringement.contactTitle')}</h4>
                  <p className="whitespace-pre-line">{t('pages.copyrightNotice.sections.copyrightInfringement.contactInfo')}</p>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.dmca.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.dmca.content1')}
                </p>
                <p className="mt-2">
                  {t('pages.copyrightNotice.sections.dmca.content2')}
                </p>
                <ul className={`list-disc ${isRTL ? 'pr-5' : 'pl-5'} mt-2 space-y-1`}>
                  {(t('pages.copyrightNotice.sections.dmca.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.changes.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.changes.content')}
                </p>
              </section>
              
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.copyrightNotice.sections.contactUs.title')}</h2>
                <p>
                  {t('pages.copyrightNotice.sections.contactUs.intro')}
                </p>
                <div className="mt-2 p-4 bg-midasbuy-navy/30 rounded-lg">
                  <p className="whitespace-pre-line">{t('pages.copyrightNotice.sections.contactUs.contactInfo')}</p>
                </div>
              </section>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">{t('pages.copyrightNotice.lastUpdated')}</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p className="mb-3">{t('pages.copyrightNotice.relatedPolicies')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/terms-of-service" className="text-midasbuy-blue hover:underline">{t('termsOfService')}</Link>
              <Link to="/privacy-policy" className="text-midasbuy-blue hover:underline">{t('privacyPolicy')}</Link>
              <Link to="/refund-policy" className="text-midasbuy-blue hover:underline">{t('refundPolicy')}</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CopyrightNoticePage;

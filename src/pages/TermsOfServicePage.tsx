import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import { useLocalization } from "@/contexts/LocalizationContext";

interface TermsOfServicePageProps {
  onLogout: () => void;
}

const TermsOfServicePage = ({ onLogout }: TermsOfServicePageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHelmet 
        title={`${t('pages.termsOfService.title', 'Terms of Service')} - Midasbuy | UC Purchase Terms & Conditions`}
        description={t('pages.termsOfService.intro', 'Read Midasbuy Terms of Service for PUBG Mobile UC purchases. Learn about refund eligibility, delivery times, user responsibilities, and service policies.')}
        keywords="midasbuy terms, terms of service, UC purchase policy, refund policy, PUBG UC terms, gaming purchase terms"
        canonicalUrl="/terms-of-service"
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
              <ArrowLeft className="w-5 h-5 me-2" />
              <span>{t('backToHome', 'Back to Home')}</span>
            </Link>
          </div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-midasbuy-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('pages.termsOfService.title', 'Terms of Service')} – Midasbuy</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pages.termsOfService.intro', 'By using Midasbuy, you agree to these terms. Refunds only if undelivered within 24 hours.')}
            </p>
          </div>
          
          <div className="glass-effect p-8 rounded-xl mb-6">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.termsOfService.sections.serviceOverview.title', '1. Service Overview')}</h2>
                <p>
                  {t('pages.termsOfService.sections.serviceOverview.content', 'Midasbuy sells UC packages for PUBG Mobile and similar in-game credits through secure online transactions.')}
                </p>
              </section>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.termsOfService.sections.userResponsibilities.title', '2. User Responsibilities')}</h2>
                <ul className="list-disc ps-5 space-y-2">
                  <li>{t('pages.termsOfService.sections.userResponsibilities.items.0', 'Provide accurate PUBG ID and payment details.')}</li>
                  <li>{t('pages.termsOfService.sections.userResponsibilities.items.1', 'Ensure you have permission to make purchases using the selected payment method.')}</li>
                  <li>{t('pages.termsOfService.sections.userResponsibilities.items.2', 'Avoid fraudulent or abusive use of our services.')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.termsOfService.sections.delivery.title', '3. Delivery')}</h2>
                <ul className="list-disc ps-5 space-y-2">
                  <li>{t('pages.termsOfService.sections.delivery.items.0', 'UC purchases are usually delivered instantly, but in rare cases may take up to 30 minutes.')}</li>
                  <li>{t('pages.termsOfService.sections.delivery.items.1', 'If delivery is delayed beyond the stated time, you may contact our support team.')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.termsOfService.sections.refundPolicy.title', '4. Refund Policy')}</h2>
                <ul className="list-disc ps-5 space-y-2">
                  <li>{t('pages.termsOfService.sections.refundPolicy.items.0', 'Refunds must be requested within 24 hours of purchase if UC has not been delivered.')}</li>
                  <li>{t('pages.termsOfService.sections.refundPolicy.items.1', 'No refunds will be issued after 24 hours, even if UC is undelivered due to account errors caused by the customer.')}</li>
                  <li>{t('pages.termsOfService.sections.refundPolicy.items.2', 'All refunds are subject to our Refund Policy.')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.termsOfService.sections.changesToTerms.title', '5. Changes to Terms')}</h2>
                <p>
                  {t('pages.termsOfService.sections.changesToTerms.content', 'We may update these terms at any time. Continued use of our website means you accept the updated terms.')}
                </p>
              </section>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">{t('pages.termsOfService.lastUpdated', 'Last Updated: January 2025')}</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>{t('pages.termsOfService.acknowledgment', 'By using Midasbuy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

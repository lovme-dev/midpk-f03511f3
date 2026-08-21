import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import { useLocalization } from "@/contexts/LocalizationContext";

interface RefundPolicyPageProps {
  onLogout: () => void;
}

const RefundPolicyPage = ({ onLogout }: RefundPolicyPageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHelmet 
        title={`${t('pages.refundPolicy.title', 'Refund Policy')} - Midasbuy | UC Refund Terms & Conditions`}
        description={t('pages.refundPolicy.intro', 'Midasbuy refund policy for PUBG Mobile UC purchases. Refunds within 24 hours if UC undelivered. Learn about eligibility, non-refundable cases, and refund process.')}
        keywords="midasbuy refund policy, UC refund, PUBG UC refund, gaming refund policy, refund terms, UC purchase refund"
        canonicalUrl="/refund-policy"
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
            <div className="w-20 h-20 bg-midasbuy-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-midasbuy-gold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('pages.refundPolicy.title', 'Refund Policy')} – Midasbuy</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pages.refundPolicy.intro', 'No refunds after 24 hours; refunds only if UC is undelivered within the promised time.')}
            </p>
          </div>
          
          <div className="glass-effect p-8 rounded-xl mb-6">
            <div className="space-y-6 text-gray-300">
              <p>
                {t('pages.refundPolicy.description', 'At Midasbuy, we aim to provide fast and reliable UC delivery. Please read this policy before making your purchase.')}
              </p>

              <div className="mt-2 text-sm text-gray-400">
                <p>{t('effectiveDate', 'Effective Date')}: January 2025</p>
                <p>
                  {t('contactEmail', 'Contact Email')}: <a href="mailto:help@midasbuy.com.pk" className="text-midasbuy-blue hover:underline">help@midasbuy.com.pk</a>
                </p>
              </div>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.refundPolicy.sections.eligibility.title', '1. Eligibility for Refunds')}</h2>
                <ul className="list-disc ps-5 space-y-2">
                  <li>{t('pages.refundPolicy.sections.eligibility.items.0', 'Refunds are only available if UC has not been delivered within the promised delivery time.')}</li>
                  <li>{t('pages.refundPolicy.sections.eligibility.items.1', 'Refund requests must be made within 24 hours of purchase.')}</li>
                  <li>{t('pages.refundPolicy.sections.eligibility.items.2', 'If the UC has already been delivered to your account, refunds are not possible.')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.refundPolicy.sections.nonRefundable.title', '2. Non-Refundable Cases')}</h2>
                <ul className="list-disc ps-5 space-y-2">
                  <li>{t('pages.refundPolicy.sections.nonRefundable.items.0', 'UC successfully delivered to the correct account.')}</li>
                  <li>{t('pages.refundPolicy.sections.nonRefundable.items.1', 'Wrong PUBG ID or details provided by the customer.')}</li>
                  <li>{t('pages.refundPolicy.sections.nonRefundable.items.2', 'Refund request made after 24 hours of purchase.')}</li>
                  <li>{t('pages.refundPolicy.sections.nonRefundable.items.3', 'Change of mind after payment.')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-white font-bold mb-3">{t('pages.refundPolicy.sections.process.title', '3. Refund Process')}</h2>
                <p>{t('pages.refundPolicy.sections.process.content', 'To request a refund, email us with:')} <a href="mailto:midassbuy@outlook.com" className="text-midasbuy-blue hover:underline">midassbuy@outlook.com</a></p>
                <ul className="list-disc ps-5 mt-2 space-y-1">
                  <li>{t('pages.refundPolicy.sections.process.items.0', 'Your order ID')}</li>
                  <li>{t('pages.refundPolicy.sections.process.items.1', 'Payment proof')}</li>
                  <li>{t('pages.refundPolicy.sections.process.items.2', 'Reason for the refund request')}</li>
                </ul>
                <p className="mt-3">{t('pages.refundPolicy.sections.process.timeline', 'Once approved, refunds will be sent to your original payment method within 7–14 working days.')}</p>
              </section>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">{t('pages.refundPolicy.lastUpdated', 'Last Updated: January 2025')}</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-400 mb-3">{t('needHelp', 'Need help with a purchase?')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-midasbuy-blue hover:bg-blue-600 px-8">
                  {t('contactSupport', 'Contact Support')}
                </Button>
              </Link>
              <Link to="/payment-issues">
                <Button variant="outline" className="bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                  {t('paymentIssuesHelp', 'Payment Issues Help')}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;

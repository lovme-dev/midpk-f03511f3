
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, CheckCircle, HelpCircle, CreditCard, RefreshCw, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import { useTranslation } from "react-i18next";
import { useLocalization } from "@/contexts/LocalizationContext";

interface PaymentIssuesPageProps {
  onLogout: () => void;
}

const PaymentIssuesPage = ({ onLogout }: PaymentIssuesPageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  const paymentDeclinedItems = t("pages.paymentIssues.paymentDeclinedItems", {
    returnObjects: true,
  }) as string[];
  const paymentDeclinedSteps = t("pages.paymentIssues.paymentDeclinedSteps", {
    returnObjects: true,
  }) as string[];

  const ucNotReceivedItems = t("pages.paymentIssues.ucNotReceivedItems", {
    returnObjects: true,
  }) as string[];
  const ucNotReceivedSteps = t("pages.paymentIssues.ucNotReceivedSteps", {
    returnObjects: true,
  }) as string[];

  const multipleChargesItems = t("pages.paymentIssues.multipleChargesItems", {
    returnObjects: true,
  }) as string[];
  const multipleChargesSteps = t("pages.paymentIssues.multipleChargesSteps", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white" dir={isRTL ? "rtl" : "ltr"}>
      <SEOHelmet 
        title="Payment Issues - Midasbuy | Resolve UC Payment Problems"
        description="Troubleshoot payment issues for PUBG Mobile UC purchases. Solutions for declined payments, failed transactions, missing UC, and refund requests. 24/7 support available."
        keywords="payment issues, UC payment problem, PUBG payment declined, midasbuy payment help, UC not received, payment failed"
        canonicalUrl="/payment-issues"
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
              <ArrowLeft className={`w-5 h-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              <span>{t("backToHome")}</span>
            </Link>
          </div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("pages.paymentIssues.title")}</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t("pages.paymentIssues.subtitle")}
            </p>
          </div>
          
          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">{t("pages.paymentIssues.commonIssues")}</h2>
            
            <div className="space-y-8">
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-start">
                  <div className="bg-orange-500/20 p-2 rounded-full mr-4 flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">{t("pages.paymentIssues.paymentDeclined")}</h3>
                    <p className="text-gray-300 mb-4">
                      {t("pages.paymentIssues.paymentDeclinedReasons")}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {paymentDeclinedItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 bg-midasbuy-navy/50 p-4 rounded-lg">
                      <h4 className="font-medium text-white flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {t("pages.paymentIssues.howToResolve")}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                        {paymentDeclinedSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-start">
                  <div className="bg-orange-500/20 p-2 rounded-full mr-4 flex-shrink-0">
                    <RefreshCw className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">{t("pages.paymentIssues.ucNotReceived")}</h3>
                    <p className="text-gray-300 mb-4">
                      {t("pages.paymentIssues.ucNotReceivedReasons")}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {ucNotReceivedItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 bg-midasbuy-navy/50 p-4 rounded-lg">
                      <h4 className="font-medium text-white flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {t("pages.paymentIssues.howToResolve")}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                        {ucNotReceivedSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-start">
                  <div className="bg-orange-500/20 p-2 rounded-full mr-4 flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">{t("pages.paymentIssues.multipleCharges")}</h3>
                    <p className="text-gray-300 mb-4">
                      {t("pages.paymentIssues.multipleChargesReasons")}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {multipleChargesItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 bg-midasbuy-navy/50 p-4 rounded-lg">
                      <h4 className="font-medium text-white flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {t("pages.paymentIssues.howToResolve")}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                        {multipleChargesSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-midasbuy-gold" />
              {t("pages.paymentIssues.needMoreHelp")}
            </h2>
            <p className="text-gray-300 mb-4">
              {t("pages.paymentIssues.needMoreHelpDesc")}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/contact-us">
                <Button className="w-full bg-midasbuy-blue hover:bg-blue-600">
                  {t("contactSupport")}
                </Button>
              </Link>
              <Link to="/help-center">
                <Button variant="outline" className="w-full bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                  {t("pages.paymentIssues.visitHelpCenter")}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>{t("pages.paymentIssues.paymentNote")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentIssuesPage;

import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Gift, Crosshair, Star, Shield, CheckCircle, HelpCircle } from "lucide-react";
import { ucPackages } from "@/data/ucPackages";
import { getTranslatedContent, isRtlLanguage, getLanguageFromCountry } from "@/data/descriptionFaqsTranslations";
import { getCountryCurrency } from "@/utils/countryConfigs";
import { getCurrencySymbol } from "@/utils/urlCurrencyDetector";
import { EXCHANGE_RATES } from "@/utils/exchangeRates";

const PubgUCDescriptionFAQs = () => {
  const { countryCode } = useParams<{ countryCode?: string }>();
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Get translated content based on URL country code
  const activeCountry = countryCode?.toUpperCase() || 'US';
  const content = getTranslatedContent(countryCode || 'us');
  const isRtl = isRtlLanguage(countryCode || 'us');
  
  // Get currency info for price table
  const currencyCode = getCountryCurrency(activeCountry);
  const currencySymbol = getCurrencySymbol(currencyCode);
  const exchangeRate = EXCHANGE_RATES[currencyCode] || 1;
  const pkrRate = EXCHANGE_RATES.PKR || 278.50;
  
  // Convert PKR price to target currency
  const convertPrice = useMemo(() => {
    return (pkrPrice: number): string => {
      // Convert PKR to USD first, then to target currency
      const usdPrice = pkrPrice / pkrRate;
      const convertedPrice = usdPrice * exchangeRate;
      
      // Format based on currency
      if (['JPY', 'KRW', 'VND', 'IDR'].includes(currencyCode)) {
        return `${currencySymbol}${Math.round(convertedPrice).toLocaleString()}`;
      }
      return `${currencySymbol}${convertedPrice.toFixed(2)}`;
    };
  }, [currencyCode, currencySymbol, exchangeRate, pkrRate]);

  // Icons for unlockable content
  const unlockIcons = [
    <Gift className="w-5 h-5" key="gift1" />,
    <Crosshair className="w-5 h-5" key="crosshair" />,
    <Star className="w-5 h-5" key="star" />,
    <Gift className="w-5 h-5" key="gift2" />,
    <Shield className="w-5 h-5" key="shield" />
  ];

  const ucCosts = [
    `${ucPackages[0]?.baseAmount}+${ucPackages[0]?.bonusAmount} UC`,
    "300–1,200 UC",
    "600–1,200 UC",
    "60–3,000 UC",
    "60–600 UC"
  ];

  const paymentMethods = [
    "PayPal", "Visa", "MasterCard", "Apple Pay", "Google Pay", "JazzCash", "Easypaisa", "Bank Transfer"
  ];

  return (
    <section className="w-full bg-gradient-to-b from-midasbuy-darkBlue to-[#0a1628] py-6 md:py-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Collapsible Accordion Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setDescriptionOpen(!descriptionOpen)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              descriptionOpen
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-md shadow-yellow-500/30'
                : 'bg-midasbuy-navy/60 text-gray-300 hover:bg-midasbuy-navy hover:text-white border border-gray-600'
            }`}
          >
            📖 Description
            {descriptionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setFaqsOpen(!faqsOpen)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              faqsOpen
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-md shadow-yellow-500/30'
                : 'bg-midasbuy-navy/60 text-gray-300 hover:bg-midasbuy-navy hover:text-white border border-gray-600'
            }`}
          >
            ❓ FAQs
            {faqsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {descriptionOpen && (
            <motion.div
              key="description"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 overflow-hidden"
            >
              {/* Main Title */}
              <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 mb-4">
                  {content.mainTitle}
                </h2>
                <p className="text-gray-300 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
                  {content.mainDescription}
                </p>
              </div>

              {/* What Can You Unlock Section */}
              <div className="bg-midasbuy-navy/40 rounded-2xl p-6 md:p-8 border border-yellow-500/20">
                <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                  {content.unlockTitle}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 text-yellow-400 font-semibold">{content.tableHeaders.content}</th>
                        <th className="py-3 px-4 text-yellow-400 font-semibold">{content.tableHeaders.examples}</th>
                        <th className="py-3 px-4 text-yellow-400 font-semibold">{content.tableHeaders.avgCost}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.unlockables.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-800 hover:bg-midasbuy-navy/30 transition-colors">
                          <td className="py-4 px-4 flex items-center gap-3 text-white">
                            <span className="text-yellow-400">{unlockIcons[idx]}</span>
                            {item.name}
                          </td>
                          <td className="py-4 px-4 text-gray-300">{item.description}</td>
                          <td className="py-4 px-4 text-green-400 font-semibold">{ucCosts[idx]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* UC Price Table */}
              <div className="bg-midasbuy-navy/40 rounded-2xl p-6 md:p-8 border border-green-500/20">
                <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                  {content.priceTableTitle}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 text-green-400 font-semibold">{content.tableHeaders.price}</th>
                        <th className="py-3 px-4 text-green-400 font-semibold">{content.tableHeaders.ucAmount}</th>
                        <th className="py-3 px-4 text-green-400 font-semibold">{content.tableHeaders.bonus}</th>
                        <th className="py-3 px-4 text-green-400 font-semibold">{content.tableHeaders.discount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ucPackages.slice(0, 10).map((pkg, idx) => (
                        <tr key={idx} className={`border-b border-gray-800 hover:bg-midasbuy-navy/30 transition-colors ${idx === 2 ? 'bg-yellow-500/10' : ''}`}>
                          <td className="py-4 px-4 text-white font-semibold">{convertPrice(pkg.price)}</td>
                          <td className="py-4 px-4 text-yellow-400 font-bold">{pkg.baseAmount.toLocaleString()} UC</td>
                          <td className="py-4 px-4 text-green-400">+{pkg.bonusAmount.toLocaleString()} UC</td>
                          <td className="py-4 px-4 text-orange-400 font-semibold">{pkg.discount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-center text-yellow-400 font-semibold mt-4 text-sm md:text-base">
                  {content.bestValueText.replace('{ucAmount}', `${ucPackages[2]?.baseAmount}+${ucPackages[2]?.bonusAmount}`)}
                </p>
              </div>

              {/* How to Buy Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-midasbuy-navy/40 rounded-2xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    {content.howToBuyTitle}
                  </h3>
                  <ol className="space-y-3 text-gray-300">
                    {content.howToBuySteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-midasbuy-navy/40 rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    {content.redeemCodeTitle}
                  </h3>
                  <ol className="space-y-3 text-gray-300">
                    {content.redeemSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Common Errors Section */}
              <div className="bg-red-500/10 rounded-2xl p-6 md:p-8 border border-red-500/30">
                <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                  {content.commonErrorsTitle}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.errors.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">{item.error} →</span>
                      <span className="text-gray-300">{item.fix}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Delivery & Payment Methods */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-midasbuy-navy/40 rounded-2xl p-6 border border-green-500/20">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    {content.codeDeliveryTitle}
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    {content.codeDeliveryPoints.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-midasbuy-navy/40 rounded-2xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    {content.paymentMethodsTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method, idx) => (
                      <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {method}
                      </span>
                    ))}
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">& 700+ more</span>
                  </div>
                </div>
              </div>

              {/* Refund & Protection */}
              <div className="bg-midasbuy-navy/40 rounded-2xl p-6 border border-yellow-500/20">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  {content.refundTitle}
                </h3>
                <ul className="space-y-3 text-gray-300">
                  {content.refundPoints.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Buy From Middasbuy */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 md:p-8 border border-yellow-500/30">
                <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                  {content.whyBuyTitle}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.whyBuyPoints.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Shops Links */}
              <div className="bg-midasbuy-navy/40 rounded-2xl p-6 border border-blue-500/20 text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center justify-center gap-2">
                  {content.globalShopsTitle}
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="/midasbuy/tr/buy/pubgm" className="text-yellow-400 hover:text-yellow-300 transition-colors">PUBG Mobile UC Turkey Shop</a>
                  <span className="text-gray-600">|</span>
                  <a href="/midasbuy/global/buy/pubgm" className="text-yellow-400 hover:text-yellow-300 transition-colors">PUBG Mobile UC Global Shop</a>
                  <span className="text-gray-600">|</span>
                  <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">PUBG Mobile Main Shop</a>
                </div>
              </div>
            </motion.div>
          )}

          {faqsOpen && (
            <motion.div
              key="faqs"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto overflow-hidden mt-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 mb-8">
                {content.faqsTitle}
              </h2>
              
              <div className="space-y-3">
                {content.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`bg-midasbuy-navy/60 rounded-xl border transition-all duration-300 ${
                      openFaqIndex === index ? 'border-yellow-500/50' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                    >
                      <span className="flex items-center gap-3 text-white font-medium pr-4">
                        <HelpCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                        {faq.question}
                      </span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-yellow-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 md:px-5 pb-4 md:pb-5 text-gray-300 leading-relaxed border-t border-gray-700/50 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Schema markup for FAQs - visible to Google */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": content.faqs.map(faq => ({
                      "@type": "Question",
                      "name": faq.question,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                      }
                    }))
                  })
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PubgUCDescriptionFAQs;

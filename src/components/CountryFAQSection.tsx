import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface FAQ {
  question: string;
  answer: string;
}

interface CountryFAQSectionProps {
  countryName: string;
  faqs: FAQ[];
}

const CountryFAQSection = ({ countryName, faqs }: CountryFAQSectionProps) => {
  const [sectionOpen, setSectionOpen] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  return (
    <div className="py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Simple clickable text line - no background */}
        <button
          onClick={() => setSectionOpen(!sectionOpen)}
          className="w-full flex items-center justify-between py-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xs md:text-sm font-medium text-gray-300 whitespace-nowrap">
            {t('countryFaq.header', { country: countryName, defaultValue: `FAQs - PUBG UC ${countryName}` })}
          </span>
          <ChevronRight 
            className={`w-3.5 h-3.5 text-[#00c6ff] transition-transform flex-shrink-0 ${
              sectionOpen ? 'rotate-90' : ''
            }`}
          />
        </button>
        
        <AnimatePresence>
          {sectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 mt-3">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-midasbuy-navy/50 border border-[#00c6ff]/20 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-midasbuy-navy/70 transition-colors"
                    >
                      <h3 className="text-xs md:text-sm font-medium text-white pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-[#00c6ff] transition-transform flex-shrink-0 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="px-3 pb-3 text-xs text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15">
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {t('countryFaq.whyBuyTitle', { country: countryName, defaultValue: `Why Buy PUBG UC from Midasbuy in ${countryName}?` })}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {t('countryFaq.whyBuyDesc', { country: countryName, defaultValue: `Midasbuy is the official and most trusted PUBG Mobile UC top-up platform in ${countryName}. We offer the cheapest UC prices with exclusive discounts up to 60% OFF plus extra VIP bonus on bulk purchases. Our instant delivery system ensures your UC reaches your account within 2-5 minutes. With 24/7 customer support and secure payment processing, millions of ${countryName} gamers trust us for their PUBG Mobile UC needs.` })}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CountryFAQSection;

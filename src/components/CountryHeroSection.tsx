import { motion } from "framer-motion";

interface CountryHeroSectionProps {
  countryName: string;
  currency: string;
  currencySymbol: string;
  paymentMethods: string[];
  language?: string;
}

const CountryHeroSection = ({ 
  countryName, 
  currency, 
  currencySymbol, 
  paymentMethods,
  language 
}: CountryHeroSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-midasbuy-navy/80 to-midasbuy-blue/60 border-b border-midasbuy-gold/20 py-4 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Country-specific headline - unique per country for SEO */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 text-center">
          Buy PUBG Mobile UC in {countryName} | 60% OFF + VIP Bonus
        </h1>
        
        {/* Country-specific description */}
        <p className="text-sm md:text-base text-gray-300 text-center mb-4 max-w-3xl mx-auto">
          Official Midasbuy store for {countryName} gamers. Get cheapest PUBG UC prices in {currency} 
          with instant 2-5 minute delivery. Trusted by millions of players in {countryName}.
        </p>

        {/* Payment methods badges - visible and unique per country */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <span className="text-xs text-gray-400">Pay with:</span>
          {paymentMethods.slice(0, 4).map((method, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 bg-midasbuy-navy/60 border border-midasbuy-gold/30 rounded text-xs text-midasbuy-gold"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Currency and country indicator */}
        <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Prices in {currencySymbol} {currency}
          </span>
          <span>•</span>
          <span>Region: {countryName}</span>
          <span>•</span>
          <span>Instant Delivery</span>
        </div>
      </div>
    </motion.section>
  );
};

export default CountryHeroSection;

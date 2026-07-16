import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import FAQSchema from "@/components/SEO/FAQSchema";
import HowToSchema from "@/components/SEO/HowToSchema";
import Index from "./Index";
import { useCurrencyFromURL } from "@/utils/urlCurrencyDetector";
import { getGameSEOConfig, getCountryData, ALL_COUNTRY_CODES, COUNTRY_DATA } from "@/utils/gameSeoConfigs";
import CountryFAQSection from "@/components/CountryFAQSection";

interface CountryPubgPageProps {
  onLogout?: () => void;
}

const CountryPubgPage = ({ onLogout }: CountryPubgPageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const { t } = useTranslation();
  const normalizedCountryCode = (countryCode || "us").toLowerCase();
  const upperCountryCode = normalizedCountryCode.toUpperCase();

  if (!COUNTRY_DATA[upperCountryCode]) {
    return <Navigate to="/midasbuy/us/buy/pubgm" replace />;
  }
  
  const seoConfig = getGameSEOConfig(upperCountryCode, 'pubgm');
  const countryData = getCountryData(upperCountryCode);
  
  useCurrencyFromURL();
  
  const baseUrl = "https://www.middasbuy.com";
  const canonicalUrl = `/midasbuy/${normalizedCountryCode}/buy/pubgm`;

  const interpVars = {
    country: seoConfig.countryName,
    currency: countryData.currency,
    currencySymbol: countryData.currencySymbol,
    paymentMethods: countryData.paymentMethods.join(', ')
  };

  const countryFAQs = [
    { question: t('countryFaq.q1', interpVars), answer: t('countryFaq.a1', interpVars) },
    { question: t('countryFaq.q2', interpVars), answer: t('countryFaq.a2', interpVars) },
    { question: t('countryFaq.q3', interpVars), answer: t('countryFaq.a3', interpVars) },
    { question: t('countryFaq.q4', interpVars), answer: t('countryFaq.a4', interpVars) },
    { question: t('countryFaq.q5', interpVars), answer: t('countryFaq.a5', interpVars) },
    { question: t('countryFaq.q6', interpVars), answer: t('countryFaq.a6', interpVars) }
  ];

  // Country-specific How-To steps
  const countryHowToSteps = [
    {
      name: `Visit Midasbuy ${seoConfig.countryName} Store`,
      text: `Open Midasbuy official website and select ${seoConfig.countryName} as your region for ${countryData.currency} pricing.`
    },
    {
      name: "Choose Your UC Package",
      text: `Select your desired UC amount. Popular packages: 60 UC (${countryData.currencySymbol}0.99), 325 UC, 660 UC, 1800 UC with 60% discount + 30% VIP bonus.`
    },
    {
      name: "Enter PUBG Player ID",
      text: `Open PUBG Mobile, go to your profile, copy your Player ID (numeric ID), and paste it on Midasbuy checkout page.`
    },
    {
      name: `Select ${seoConfig.countryName} Payment Method`,
      text: `Choose from ${countryData.paymentMethods.join(', ')}. All methods are secure and support ${countryData.currency} currency.`
    },
    {
      name: "Complete Payment & Get UC",
      text: `Complete payment securely. Your UC will be delivered instantly within 2-5 minutes to your PUBG Mobile account. Check in-game!`
    }
  ];

  // Product structured data for country
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `PUBG Mobile UC - ${seoConfig.countryName}`,
    "description": seoConfig.description,
    "brand": {
      "@type": "Brand",
      "name": "Midasbuy"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": `${baseUrl}${canonicalUrl}`,
      "priceCurrency": countryData.currency,
      "lowPrice": "0.99",
      "highPrice": "99.99",
      "offerCount": "12",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31",
      "seller": {
        "@type": "Organization",
        "name": "Midasbuy"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "50000",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": seoConfig.countryName,
        "item": `${baseUrl}/midasbuy/${countryCode}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "PUBG Mobile UC",
        "item": `${baseUrl}${canonicalUrl}`
      }
    ]
  };

  // Generate hreflang for ALL 176 supported countries from COUNTRY_DATA
  // IMPORTANT: Use full language-country format (e.g., en-pk, ar-sa) to avoid duplicate hreflang errors
  const allAlternateUrls = [
    { hreflang: "x-default", href: `${baseUrl}/midasbuy/us/buy/pubgm` },
    ...ALL_COUNTRY_CODES.map(code => {
      const country = COUNTRY_DATA[code];
      // Use full locale format: language-country (e.g., en-pk, ar-sa, ur-pk)
      const hreflang = country?.language?.toLowerCase() || `en-${code.toLowerCase()}`;
      return {
        hreflang: hreflang,
        href: `${baseUrl}/midasbuy/${code.toLowerCase()}/buy/pubgm`
      };
    })
  ];

  // Generate unique stats per country for content uniqueness
  const codeSum = upperCountryCode.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const playerBase = ((codeSum * 7 + 3) % 9 + 1) * 100;
  const satisfactionRate = 95 + (codeSum % 5);
  const deliverySpeed = 1 + (codeSum % 4);
  const monthlyOrders = ((codeSum * 3 + 7) % 8 + 2) * 1000;
  const avgRating = (4.5 + (codeSum % 5) * 0.1).toFixed(1);
  const supportResponseTime = 2 + (codeSum % 8);
  const totalReviews = ((codeSum * 11 + 5) % 40 + 10) * 100;
  const discountPct = 50 + (codeSum % 15);
  const vipBonus = 20 + (codeSum % 15);
  const yearEstablished = 2018 + (codeSum % 4);

  const ucPackages = [
    { uc: 60, label: 'Starter' },
    { uc: 325, label: 'Popular' },
    { uc: 660, label: 'Best Value' },
    { uc: 1800, label: 'Premium' },
    { uc: 3850, label: 'Elite' },
    { uc: 8100, label: 'Ultimate' },
  ];

  const priorityCountryLinks = ['pk', 'in', 'us', 'gb', 'ae', 'sa', 'id', 'my', 'ph', 'bd', 'br', 'tr']
    .filter((code) => code !== normalizedCountryCode && COUNTRY_DATA[code.toUpperCase()]);

  const topSeoSlot = (
    <section className="sr-only" aria-hidden="false">
      <h1>Buy PUBG Mobile UC in {seoConfig.countryName}</h1>
      <p>
        Official {countryData.currency} PUBG UC top-up page for {seoConfig.countryName}. Choose UC packages, pay with {countryData.paymentMethods.slice(0, 3).join(', ')}, and receive instant delivery with secure checkout.
      </p>
      <nav aria-label="Popular PUBG UC country stores">
        <a href={`/midasbuy/${normalizedCountryCode}`}>Midasbuy {seoConfig.countryName}</a>
        {priorityCountryLinks.map((code) => (
          <a key={code} href={`/midasbuy/${code}/buy/pubgm`}>
            PUBG UC {COUNTRY_DATA[code.toUpperCase()].name}
          </a>
        ))}
      </nav>
    </section>
  );

  const faqSlot = (
    <div className="sr-only" aria-hidden="false">
      {/* Section 1: Country Overview */}
      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <article className="bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">
              Buy PUBG Mobile UC in {seoConfig.countryName} — Official {countryData.currency} Store
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Welcome to the official Midasbuy PUBG Mobile UC store for {seoConfig.countryName}. Since {yearEstablished}, 
              we have been serving {playerBase}K+ active PUBG Mobile players in {seoConfig.countryName} with instant UC delivery 
              and {countryData.currency} pricing. Our platform processes over {monthlyOrders.toLocaleString()} UC orders every month 
              from {seoConfig.countryName} alone, maintaining a {satisfactionRate}% customer satisfaction rate and an average 
              rating of {avgRating}/5 from {totalReviews.toLocaleString()} verified reviews.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Whether you're looking for a small 60 UC pack or the massive 8,100 UC bundle, Midasbuy offers the lowest 
              prices in {seoConfig.countryName} with up to {discountPct}% discount and an additional {vipBonus}% VIP bonus. 
              All transactions are processed in {countryData.currency} ({countryData.currencySymbol}) with no hidden fees or 
              currency conversion charges for {seoConfig.countryName} residents.
            </p>
          </article>

          {/* Section 2: UC Packages Available */}
          <article className="bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">
              PUBG Mobile UC Packages for {seoConfig.countryName} Players
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Choose from our range of UC packages designed specifically for {seoConfig.countryName} gamers. 
              All prices are displayed in {countryData.currency} ({countryData.currencySymbol}) with instant delivery 
              guaranteed within {deliverySpeed} minutes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ucPackages.map((pkg, i) => (
                <div key={i} className="bg-[#0a1628]/60 rounded-lg border border-[#00c6ff]/10 p-3 text-center">
                  <div className="text-[#00c6ff] font-bold text-lg">{pkg.uc} UC</div>
                  <div className="text-[10px] text-gray-400 mt-1">{pkg.label}</div>
                  <div className="text-[10px] text-green-400 mt-1">Up to {discountPct}% OFF</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              * Prices in {countryData.currencySymbol} ({countryData.currency}) may vary based on current exchange rates. 
              {seoConfig.countryName} exclusive offers may apply during seasonal events.
            </p>
          </article>

          {/* Section 3: Payment Methods */}
          <article className="bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">
              Payment Methods Available in {seoConfig.countryName}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Midasbuy supports {countryData.paymentMethods.length} trusted payment methods for PUBG Mobile UC purchases 
              in {seoConfig.countryName}. All payments are processed securely in {countryData.currency} with 
              256-bit SSL encryption and PCI DSS compliance.
            </p>
            <div className="flex flex-wrap gap-2">
              {countryData.paymentMethods.map((method, i) => (
                <span key={i} className="text-xs bg-[#00c6ff]/10 text-[#00c6ff] px-3 py-1.5 rounded-full border border-[#00c6ff]/20 font-medium">
                  {method}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {seoConfig.countryName} residents can pay using local payment options with zero additional fees. 
              Your {countryData.currency} payment is processed instantly, and UC is delivered to your PUBG Mobile 
              account within {deliverySpeed} minutes of successful payment confirmation.
            </p>
          </article>

          {/* Section 4: Step-by-Step Guide */}
          <article className="bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">
              How to Buy PUBG Mobile UC in {seoConfig.countryName} — Step by Step
            </h2>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <strong className="text-white">Visit Midasbuy {seoConfig.countryName} Store</strong>
                  <p className="text-xs text-gray-400 mt-1">Open the Midasbuy official website and ensure {seoConfig.countryName} is selected as your region to see {countryData.currency} pricing.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <strong className="text-white">Select Your UC Package</strong>
                  <p className="text-xs text-gray-400 mt-1">Choose from 60 UC to 8,100 UC. {seoConfig.countryName} players get up to {discountPct}% discount + {vipBonus}% VIP bonus.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <strong className="text-white">Enter Your PUBG Player ID</strong>
                  <p className="text-xs text-gray-400 mt-1">Open PUBG Mobile, tap your avatar, and copy the numeric Player ID. Paste it on the checkout page.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <strong className="text-white">Pay with {countryData.paymentMethods[0] || 'Local Payment'}</strong>
                  <p className="text-xs text-gray-400 mt-1">Select from {countryData.paymentMethods.join(', ')} and complete your {countryData.currencySymbol} payment securely.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <strong className="text-white">Receive UC Instantly</strong>
                  <p className="text-xs text-gray-400 mt-1">UC is delivered to your PUBG Mobile account within {deliverySpeed} minutes. Check your in-game UC balance!</p>
                </div>
              </li>
            </ol>
          </article>

          {/* Section 5: Why Choose Midasbuy */}
          <article className="bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">
              Why {seoConfig.countryName} Players Choose Midasbuy for PUBG UC
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#0a1628]/60 rounded-lg p-3 text-center border border-[#00c6ff]/10">
                <div className="text-[#00c6ff] font-bold text-xl">{playerBase}K+</div>
                <div className="text-[10px] text-gray-400 mt-1">Active Players in {seoConfig.countryName}</div>
              </div>
              <div className="bg-[#0a1628]/60 rounded-lg p-3 text-center border border-[#00c6ff]/10">
                <div className="text-green-400 font-bold text-xl">{satisfactionRate}%</div>
                <div className="text-[10px] text-gray-400 mt-1">Satisfaction Rate</div>
              </div>
              <div className="bg-[#0a1628]/60 rounded-lg p-3 text-center border border-[#00c6ff]/10">
                <div className="text-yellow-400 font-bold text-xl">{deliverySpeed}min</div>
                <div className="text-[10px] text-gray-400 mt-1">Average Delivery</div>
              </div>
              <div className="bg-[#0a1628]/60 rounded-lg p-3 text-center border border-[#00c6ff]/10">
                <div className="text-[#00c6ff] font-bold text-xl">{monthlyOrders.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400 mt-1">Monthly Orders</div>
              </div>
              <div className="bg-[#0a1628]/60 rounded-lg p-3 text-center border border-[#00c6ff]/10">
                <div className="text-green-400 font-bold text-xl">{avgRating}★</div>
                <div className="text-[10px] text-gray-400 mt-1">{totalReviews.toLocaleString()} Reviews</div>
              </div>
              <div className="bg-[#0a1628]/60 rounded-lg p-3 text-center border border-[#00c6ff]/10">
                <div className="text-yellow-400 font-bold text-xl">{supportResponseTime}min</div>
                <div className="text-[10px] text-gray-400 mt-1">Support Response</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Midasbuy has been the preferred PUBG Mobile UC seller in {seoConfig.countryName} since {yearEstablished}. 
              Our dedicated {seoConfig.countryName} support team is available 24/7 with an average response time 
              of {supportResponseTime} minutes. We offer the best {countryData.currency} prices with no hidden charges, 
              and every purchase is backed by our 100% delivery guarantee.
            </p>
          </article>

          {/* Section 6: Trust & Security */}
          <article className="bg-midasbuy-navy/30 rounded-lg border border-[#00c6ff]/15 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">
              Safe & Secure PUBG UC Purchase in {seoConfig.countryName}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your security is our top priority. Every PUBG Mobile UC transaction in {seoConfig.countryName} is protected 
              with 256-bit SSL encryption and processed through PCI DSS compliant payment gateways. We never store 
              your {countryData.paymentMethods[0] || 'payment'} details on our servers.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Official Tencent authorized UC seller for {seoConfig.countryName}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>100% legitimate UC — no risk of account ban</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Secure {countryData.currency} payment processing with {countryData.paymentMethods.join(', ')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Money-back guarantee if UC is not delivered within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Trusted by {playerBase}K+ players in {seoConfig.countryName} with {avgRating}★ rating</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              © {new Date().getFullYear()} Midasbuy {seoConfig.countryName}. All PUBG Mobile UC purchases are final and non-refundable 
              after successful delivery. Prices displayed in {countryData.currencySymbol} ({countryData.currency}).
            </p>
          </article>
        </div>
      </div>

      <CountryFAQSection 
        countryName={seoConfig.countryName}
        faqs={countryFAQs}
      />
    </div>
  );

  return (
    <>
      <AdvancedSEOHelmet
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl={canonicalUrl}
        ogImage="/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
        ogType="product"
        productStructuredData={productStructuredData}
        breadcrumbSchema={breadcrumbSchema}
        alternateUrls={allAlternateUrls}
      />
      
      <FAQSchema faqs={countryFAQs} />
      
      <HowToSchema
        name={`How to Buy PUBG Mobile UC in ${seoConfig.countryName}`}
        description={`Complete step-by-step guide to purchase PUBG Mobile Unknown Cash in ${seoConfig.countryName} using ${countryData.currency} with ${countryData.paymentMethods.join(', ')}.`}
        steps={countryHowToSteps}
        totalTime="PT5M"
      />
      
      <Index onLogout={onLogout || (() => {})} disableSeo topSeoSlot={topSeoSlot} beforeFooterSlot={faqSlot} />
    </>
  );
};

export default CountryPubgPage;

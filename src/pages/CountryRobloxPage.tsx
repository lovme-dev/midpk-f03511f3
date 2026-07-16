import { useParams } from "react-router-dom";
import RobloxPage from "./RobloxPage";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import FAQSchema from "@/components/SEO/FAQSchema";
import HowToSchema from "@/components/SEO/HowToSchema";
import { getGameSEOConfig, COUNTRY_DATA, generateAlternateUrls } from "@/utils/gameSeoConfigs";

interface CountryRobloxPageProps {
  onLogout?: () => void;
}

const CountryRobloxPage = ({ onLogout }: CountryRobloxPageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const countryCodeUpper = (countryCode || 'US').toUpperCase();
  
  // Get country-specific SEO config
  const seoConfig = getGameSEOConfig(countryCodeUpper, 'roblox');
  const countryData = COUNTRY_DATA[countryCodeUpper] || COUNTRY_DATA['US'];
  
  const baseUrl = 'https://www.middasbuy.com';
  const canonicalUrl = `${baseUrl}/midasbuy/${countryCode?.toLowerCase()}/buy/roblox`;
  
  // Country-specific FAQs
  const countryFAQs = [
    {
      question: `How to buy Robux in ${seoConfig.countryName}?`,
      answer: `Visit Midasbuy ${seoConfig.countryName}, enter your Roblox username, select Robux package, pay via ${countryData.paymentMethods.slice(0, 3).join(', ')}, and receive instant delivery.`
    },
    {
      question: `What is the cheapest Robux price in ${seoConfig.countryName}?`,
      answer: `Robux starts from ${seoConfig.currencySymbol}4.99 in ${seoConfig.countryName} with up to 50% discount and bonus Robux on Midasbuy.`
    },
    {
      question: `Is buying Robux safe in ${seoConfig.countryName}?`,
      answer: `Yes! Midasbuy is the official authorized Robux seller in ${seoConfig.countryName} with secure payment and instant delivery.`
    },
    {
      question: `What payment methods for Robux in ${seoConfig.countryName}?`,
      answer: `We accept ${countryData.paymentMethods.join(', ')} for Robux purchase in ${seoConfig.countryName}.`
    },
    {
      question: `How long for Robux delivery in ${seoConfig.countryName}?`,
      answer: `Robux delivery in ${seoConfig.countryName} is instant (2-5 minutes) after payment confirmation.`
    }
  ];
  
  // Country-specific How-To steps
  const countryHowToSteps = [
    { name: `Visit Midasbuy ${seoConfig.countryName}`, text: `Go to Midasbuy official Robux store for ${seoConfig.countryName}` },
    { name: 'Enter Roblox Username', text: 'Enter your Roblox username correctly' },
    { name: 'Select Robux Package', text: `Choose your Robux amount with ${seoConfig.countryName} pricing` },
    { name: `Pay with ${countryData.paymentMethods[0]}`, text: `Complete payment using ${countryData.paymentMethods.slice(0, 2).join(' or ')}` },
    { name: 'Receive Robux Instantly', text: 'Robux delivered to your account in 2-5 minutes' }
  ];
  
  // Product structured data
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Robux - ${seoConfig.countryName}`,
    "description": seoConfig.description,
    "brand": { "@type": "Brand", "name": "Roblox" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": countryData.currency,
      "lowPrice": "4.99",
      "highPrice": "199.99",
      "offerCount": "15",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Midasbuy" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "125000"
    }
  };
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Roblox", "item": `${baseUrl}/roblox` },
      { "@type": "ListItem", "position": 3, "name": `Robux ${seoConfig.countryName}`, "item": canonicalUrl }
    ]
  };
  
  // Generate all alternate URLs for hreflang
  const allAlternateUrls = generateAlternateUrls('roblox', baseUrl);
  
  return (
    <>
      <AdvancedSEOHelmet
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl={`/midasbuy/${countryCode?.toLowerCase()}/buy/roblox`}
        ogImage="https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png"
        ogType="product"
        jsonLdSchema={[productStructuredData, breadcrumbSchema]}
        alternateUrls={allAlternateUrls}
      />
      <FAQSchema faqs={countryFAQs} />
      <HowToSchema
        name={`How to Buy Robux in ${seoConfig.countryName}`}
        description={`Complete guide to purchase Robux in ${seoConfig.countryName} with ${countryData.paymentMethods[0]}`}
        steps={countryHowToSteps}
        totalTime="PT5M"
      />
      <RobloxPage 
        onLogout={onLogout || (() => {})} 
        overrideCountry={{ code: countryCodeUpper, currency: countryData.currency }}
        disableSeo
      />
    </>
  );
};

export default CountryRobloxPage;

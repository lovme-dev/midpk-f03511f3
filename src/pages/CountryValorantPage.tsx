import { useParams } from "react-router-dom";
import ValorantPage from "./ValorantPage";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import FAQSchema from "@/components/SEO/FAQSchema";
import HowToSchema from "@/components/SEO/HowToSchema";
import { getGameSEOConfig, COUNTRY_DATA, generateAlternateUrls } from "@/utils/gameSeoConfigs";

interface CountryValorantPageProps {
  onLogout?: () => void;
}

const CountryValorantPage = ({ onLogout }: CountryValorantPageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const countryCodeUpper = (countryCode || 'US').toUpperCase();
  
  // Get country-specific SEO config
  const seoConfig = getGameSEOConfig(countryCodeUpper, 'valorant');
  const countryData = COUNTRY_DATA[countryCodeUpper] || COUNTRY_DATA['US'];
  
  const baseUrl = 'https://www.middasbuy.com';
  const canonicalUrl = `${baseUrl}/midasbuy/${countryCode?.toLowerCase()}/buy/valorant`;
  
  // Country-specific FAQs
  const countryFAQs = [
    {
      question: `How to buy Valorant Points in ${seoConfig.countryName}?`,
      answer: `Visit Midasbuy ${seoConfig.countryName}, enter your Riot ID, select VP package, pay via ${countryData.paymentMethods.slice(0, 3).join(', ')}, and receive instant delivery.`
    },
    {
      question: `What is the cheapest VP price in ${seoConfig.countryName}?`,
      answer: `Valorant Points starts from ${seoConfig.currencySymbol}4.99 in ${seoConfig.countryName} with up to 40% discount and bonus VP on Midasbuy.`
    },
    {
      question: `Is buying VP safe in ${seoConfig.countryName}?`,
      answer: `Yes! Midasbuy is the official authorized VP seller in ${seoConfig.countryName} with secure payment and instant delivery.`
    },
    {
      question: `What payment methods for VP in ${seoConfig.countryName}?`,
      answer: `We accept ${countryData.paymentMethods.join(', ')} for Valorant Points purchase in ${seoConfig.countryName}.`
    },
    {
      question: `How long for VP delivery in ${seoConfig.countryName}?`,
      answer: `Valorant Points delivery in ${seoConfig.countryName} is instant (2-5 minutes) after payment confirmation.`
    }
  ];
  
  // Country-specific How-To steps
  const countryHowToSteps = [
    { name: `Visit Midasbuy ${seoConfig.countryName}`, text: `Go to Midasbuy official VP store for ${seoConfig.countryName}` },
    { name: 'Enter Riot ID', text: 'Enter your Riot ID (e.g., Player#1234) correctly' },
    { name: 'Select VP Package', text: `Choose your VP amount with ${seoConfig.countryName} pricing` },
    { name: `Pay with ${countryData.paymentMethods[0]}`, text: `Complete payment using ${countryData.paymentMethods.slice(0, 2).join(' or ')}` },
    { name: 'Receive VP Instantly', text: 'Valorant Points delivered to your account in 2-5 minutes' }
  ];
  
  // Product structured data
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Valorant Points - ${seoConfig.countryName}`,
    "description": seoConfig.description,
    "brand": { "@type": "Brand", "name": "Riot Games" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": countryData.currency,
      "lowPrice": "4.99",
      "highPrice": "99.99",
      "offerCount": "10",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Midasbuy" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "85000"
    }
  };
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Valorant", "item": `${baseUrl}/valorant` },
      { "@type": "ListItem", "position": 3, "name": `VP ${seoConfig.countryName}`, "item": canonicalUrl }
    ]
  };
  
  // Generate all alternate URLs for hreflang
  const allAlternateUrls = generateAlternateUrls('valorant', baseUrl);
  
  return (
    <>
      <AdvancedSEOHelmet
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl={`/midasbuy/${countryCode?.toLowerCase()}/buy/valorant`}
        ogImage="https://www.middasbuy.com/lovable-uploads/valorant-points-logo.webp"
        ogType="product"
        jsonLdSchema={[productStructuredData, breadcrumbSchema]}
        alternateUrls={allAlternateUrls}
      />
      <FAQSchema faqs={countryFAQs} />
      <HowToSchema
        name={`How to Buy Valorant Points in ${seoConfig.countryName}`}
        description={`Complete guide to purchase VP in ${seoConfig.countryName} with ${countryData.paymentMethods[0]}`}
        steps={countryHowToSteps}
        totalTime="PT5M"
      />
      <ValorantPage 
        onLogout={onLogout || (() => {})} 
        overrideCountry={{ code: countryCodeUpper, currency: countryData.currency }}
        disableSeo
      />
    </>
  );
};

export default CountryValorantPage;

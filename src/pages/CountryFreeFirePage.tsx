import { useParams } from "react-router-dom";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import FAQSchema from "@/components/SEO/FAQSchema";
import HowToSchema from "@/components/SEO/HowToSchema";
import FreeFire from "./FreeFire";
import { useCurrencyFromURL } from "@/utils/urlCurrencyDetector";
import { getGameSEOConfig, getCountryData } from "@/utils/gameSeoConfigs";

interface CountryFreeFirePageProps {
  onLogout?: () => void;
}

const CountryFreeFirePage = ({ onLogout }: CountryFreeFirePageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const upperCountryCode = countryCode?.toUpperCase() || 'US';
  
  const seoConfig = getGameSEOConfig(upperCountryCode, 'freefire');
  const countryData = getCountryData(upperCountryCode);
  
  useCurrencyFromURL();
  
  const baseUrl = "https://www.middasbuy.com";
  const canonicalUrl = `/midasbuy/${countryCode?.toLowerCase()}/buy/freefire`;

  const countryFAQs = [
    {
      question: `How to buy Free Fire Diamonds in ${seoConfig.countryName}?`,
      answer: `Visit Midasbuy, select FF Diamond package, enter your Free Fire ID, choose ${countryData.paymentMethods.join(', ')} payment. Diamonds delivered in 2-5 minutes.`
    },
    {
      question: `What is cheapest Free Fire Diamonds price in ${seoConfig.countryName}?`,
      answer: `Midasbuy offers cheapest FF Diamonds starting ${countryData.currencySymbol}0.99. Get 60% discount + 30% VIP bonus.`
    },
    {
      question: `Is Midasbuy safe for Free Fire in ${seoConfig.countryName}?`,
      answer: `Yes! 100% safe and trusted by 10M+ FF players. Official Garena partner with secure payments.`
    }
  ];

  const countryHowToSteps = [
    { name: `Visit Midasbuy ${seoConfig.countryName}`, text: `Open Midasbuy and select ${seoConfig.countryName} region.` },
    { name: "Select Diamond Package", text: `Choose FF Diamond amount with discounts.` },
    { name: "Enter Free Fire ID", text: `Copy your Player ID from game profile.` },
    { name: `Pay with ${countryData.currency}`, text: `Select from ${countryData.paymentMethods.slice(0,3).join(', ')}.` },
    { name: "Get Diamonds Instantly", text: `Diamonds delivered in 2-5 minutes.` }
  ];

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Free Fire Diamonds - ${seoConfig.countryName}`,
    "description": seoConfig.description,
    "brand": { "@type": "Brand", "name": "Garena Free Fire" },
    "offers": {
      "@type": "AggregateOffer",
      "url": `${baseUrl}${canonicalUrl}`,
      "priceCurrency": countryData.currency,
      "lowPrice": "0.99",
      "highPrice": "99.99",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": seoConfig.countryName, "item": `${baseUrl}/midasbuy/${countryCode}` },
      { "@type": "ListItem", "position": 3, "name": "Free Fire Diamonds", "item": `${baseUrl}${canonicalUrl}` }
    ]
  };

  // All country hreflang tags for proper Google indexing
  const allCountryCodes = ['PK', 'IN', 'BD', 'NP', 'LK', 'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'AT', 'CH', 'BE', 'IE', 'PT', 'GR', 'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY', 'TR', 'SA', 'AE', 'EG', 'JO', 'LB', 'KW', 'QA', 'BH', 'OM', 'AU', 'MY', 'ID', 'PH', 'SG', 'TH', 'VN', 'JP', 'KR', 'TW', 'HK', 'ZA', 'NG', 'KE', 'GH', 'MA', 'TN', 'DZ', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'PY', 'BO', 'EC'];
  
  const hreflangMap: Record<string, string> = {
    PK: 'ur-pk', IN: 'hi-in', BD: 'bn-bd', NP: 'ne-np', LK: 'si-lk', US: 'en-us', CA: 'en-ca', GB: 'en-gb', DE: 'de-de', FR: 'fr-fr', ES: 'es-es', IT: 'it-it', NL: 'nl-nl', SE: 'sv-se', NO: 'no-no', DK: 'da-dk', FI: 'fi-fi', PL: 'pl-pl', CZ: 'cs-cz', HU: 'hu-hu', RO: 'ro-ro', BG: 'bg-bg', AT: 'de-at', CH: 'de-ch', BE: 'nl-be', IE: 'en-ie', PT: 'pt-pt', GR: 'el-gr', HR: 'hr-hr', SI: 'sl-si', SK: 'sk-sk', EE: 'et-ee', LV: 'lv-lv', LT: 'lt-lt', LU: 'de-lu', MT: 'mt-mt', CY: 'el-cy', TR: 'tr-tr', SA: 'ar-sa', AE: 'ar-ae', EG: 'ar-eg', JO: 'ar-jo', LB: 'ar-lb', KW: 'ar-kw', QA: 'ar-qa', BH: 'ar-bh', OM: 'ar-om', AU: 'en-au', MY: 'ms-my', ID: 'id-id', PH: 'en-ph', SG: 'en-sg', TH: 'th-th', VN: 'vi-vn', JP: 'ja-jp', KR: 'ko-kr', TW: 'zh-tw', HK: 'zh-hk', ZA: 'en-za', NG: 'en-ng', KE: 'en-ke', GH: 'en-gh', MA: 'ar-ma', TN: 'ar-tn', DZ: 'ar-dz', BR: 'pt-br', MX: 'es-mx', AR: 'es-ar', CL: 'es-cl', CO: 'es-co', PE: 'es-pe', VE: 'es-ve', UY: 'es-uy', PY: 'es-py', BO: 'es-bo', EC: 'es-ec'
  };
  
  const allAlternateUrls = [
    { hreflang: "x-default", href: `${baseUrl}/midasbuy/us/buy/freefire` },
    ...allCountryCodes.map(code => ({ hreflang: hreflangMap[code] || `en-${code.toLowerCase()}`, href: `${baseUrl}/midasbuy/${code.toLowerCase()}/buy/freefire` }))
  ];

  return (
    <>
      <AdvancedSEOHelmet
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl={canonicalUrl}
        ogImage="/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png"
        ogType="product"
        productStructuredData={productStructuredData}
        breadcrumbSchema={breadcrumbSchema}
        alternateUrls={allAlternateUrls}
      />
      
      <FAQSchema faqs={countryFAQs} />
      
      <HowToSchema
        name={`How to Buy Free Fire Diamonds in ${seoConfig.countryName}`}
        description={`Complete guide to purchase Free Fire Diamonds in ${seoConfig.countryName} using ${countryData.currency}.`}
        steps={countryHowToSteps}
        totalTime="PT5M"
      />
      
      <FreeFire onLogout={onLogout} disableSeo />
    </>
  );
};

export default CountryFreeFirePage;

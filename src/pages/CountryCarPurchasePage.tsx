import { useParams } from "react-router-dom";
import CarPurchasePage from "./CarPurchasePage";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import FAQSchema from "@/components/SEO/FAQSchema";
import HowToSchema from "@/components/SEO/HowToSchema";
import { COUNTRY_DATA } from "@/utils/gameSeoConfigs";

interface CountryCarPurchasePageProps {
  onLogout?: () => void;
}

const CountryCarPurchasePage = ({ onLogout }: CountryCarPurchasePageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const countryCodeUpper = (countryCode || 'US').toUpperCase();
  const countryData = COUNTRY_DATA[countryCodeUpper] || COUNTRY_DATA['US'];
  
  const seoTitle = `Buy PUBG Mobile Car Skins ${countryData.name} | Premium Vehicles ${countryData.currencySymbol} | Midasbuy`;
  const seoDescription = `Buy PUBG Mobile premium car skins in ${countryData.name}. ⚡ Porsche, McLaren, Lamborghini vehicles at best ${countryData.currency} prices. Instant delivery via ${countryData.paymentMethods.slice(0, 2).join(', ')}. Official Midasbuy store.`;
  const seoKeywords = `pubg car skins ${countryData.name.toLowerCase()}, pubg vehicles ${countryData.name.toLowerCase()}, pubg mobile car ${countryData.currency}, buy pubg car, midasbuy car skins`;
  
  const countryFAQs = [
    { question: `How to buy PUBG car skins in ${countryData.name}?`, answer: `Visit Midasbuy, browse car collection, pay via ${countryData.paymentMethods[0]}, receive instant delivery.` },
    { question: `What is the price of PUBG car skins in ${countryData.name}?`, answer: `Car skins start from ${countryData.currencySymbol}15 with up to 80% discount.` }
  ];
  
  const countryHowToSteps = [
    { name: 'Visit Midasbuy', text: `Go to PUBG car skins store for ${countryData.name}` },
    { name: 'Select Car', text: 'Choose Porsche, McLaren, or Lamborghini' },
    { name: 'Pay', text: `Complete payment using ${countryData.paymentMethods[0]}` },
    { name: 'Receive', text: 'Get car skin in 5-10 minutes' }
  ];
  
  return (
    <>
      <AdvancedSEOHelmet
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={`/midasbuy/${countryCode?.toLowerCase()}/buy/car`}
        ogImage="https://www.middasbuy.com/lovable-uploads/porsche-cayenne-red.jpeg"
      />
      <FAQSchema faqs={countryFAQs} />
      <HowToSchema 
        name={`How to Buy PUBG Car Skins in ${countryData.name}`}
        description={`Buy PUBG car skins in ${countryData.name}`}
        steps={countryHowToSteps}
      />
      <CarPurchasePage onLogout={onLogout || (() => {})} disableSeo={true} />
    </>
  );
};

export default CountryCarPurchasePage;

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { getCountrySEOConfig, getHreflangTags, getInternationalStructuredData } from "@/utils/internationalSeo";
import { usePageMeta } from "@/hooks/usePageMeta";

interface InternationalSEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  countryCode?: string;
  pageType?: 'homepage' | 'pubg' | 'freefire' | 'gaming' | 'checkout' | 'product';
}

const InternationalSEOHelmet = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl = "/",
  ogImage = "/og-image.png",
  ogType = "website",
  structuredData,
  countryCode,
  pageType = 'homepage'
}: InternationalSEOHelmetProps) => {
  const params = useParams();
  const baseUrl = "https://www.middasbuy.com";
  
  // Fetch meta data from database
  const { metaData } = usePageMeta(canonicalUrl);
  
  // Get country code from URL params if not provided
  const detectedCountryCode = countryCode || params.countryCode?.toUpperCase();
  const countrySEOConfig = getCountrySEOConfig(detectedCountryCode);
  
  // Priority: explicit props > database values > country-specific defaults
  const finalTitle = title || metaData?.meta_title || countrySEOConfig.title;
  const finalDescription = description || metaData?.meta_description || countrySEOConfig.description;
  const finalKeywords = keywords || metaData?.meta_keywords || countrySEOConfig.keywords;
  const finalOgImage = ogImage !== "/og-image.png" ? ogImage : (metaData?.og_image_url || ogImage);
  
  const fullCanonicalUrl = `${baseUrl}${canonicalUrl}`;
  const fullOgImage = finalOgImage.startsWith('http') ? finalOgImage : `${baseUrl}${finalOgImage}`;
  const hreflangTags = getHreflangTags(canonicalUrl);
  
  // Enhanced structured data with international context
  const finalStructuredData = structuredData || getInternationalStructuredData(countrySEOConfig, canonicalUrl);

  // Page-specific enhancements
  const getPageSpecificMeta = () => {
    switch (pageType) {
      case 'pubg':
        return {
          additionalKeywords: ", PUBG Mobile UC, PlayerUnknown's Battlegrounds, battle royale, mobile gaming",
          category: "Gaming Currency"
        };
      case 'freefire':
        return {
          additionalKeywords: ", Garena Free Fire, Free Fire Max, battle royale diamonds, FF diamonds",
          category: "Gaming Currency"
        };
      case 'checkout':
        return {
          additionalKeywords: ", secure checkout, gaming payment, instant delivery",
          category: "E-commerce Checkout"
        };
      default:
        return {
          additionalKeywords: "",
          category: "Gaming Store"
        };
    }
  };

  const pageSpecific = getPageSpecificMeta();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={`${finalKeywords}${pageSpecific.additionalKeywords}`} />
      <meta name="author" content="Midasbuy" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* International SEO - Language and Region */}
      <meta httpEquiv="content-language" content={countrySEOConfig.language} />
      <meta name="language" content={countrySEOConfig.language} />

      {/* Hreflang Tags for International SEO */}
      {hreflangTags.map((tag, index) => (
        <link key={index} rel="alternate" hrefLang={tag.hreflang} href={tag.href} />
      ))}

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Midasbuy Official Store" />
      <meta property="og:locale" content={countrySEOConfig.locale} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1E40AF" />

      {/* Structured Data */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default InternationalSEOHelmet;
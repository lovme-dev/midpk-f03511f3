import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const SEOHelmet = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  structuredData,
  noIndex = false
}: SEOHelmetProps) => {
  const baseUrl = "https://www.middasbuy.com";
  const location = useLocation();
  
  // Use canonicalUrl prop if provided, otherwise use current location pathname
  const currentPath = canonicalUrl || location.pathname;
  
  // Fetch meta data from database
  const { metaData } = usePageMeta(currentPath);
  
  // Priority: explicit props > database values > defaults
  const finalTitle = title || metaData?.meta_title || "Midasbuy - Official Gaming Store | PUBG UC, Free Fire Diamonds";
  const finalDescription = description || metaData?.meta_description || "Midasbuy Official - Trusted gaming store for PUBG Mobile UC, Free Fire Diamonds, and BGMI UC. Instant delivery, secure payments, best prices worldwide.";
  const finalKeywords = keywords || metaData?.meta_keywords || "Midasbuy, midasbuy official, PUBG UC, Free Fire Diamonds, BGMI UC, gaming store, buy PUBG UC, gaming currency, mobile gaming";
  const finalOgImage = ogImage !== "/og-image.png" ? ogImage : (metaData?.og_image_url || ogImage);
  
  const fullCanonicalUrl = currentPath ? `${baseUrl}${currentPath}` : baseUrl;
  const fullOgImage = finalOgImage.startsWith('http') ? finalOgImage : `${baseUrl}${finalOgImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Midasbuy" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      {noIndex && <meta name="googlebot" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Midasbuy Official Store" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1E40AF" />

      {/* Additional SEO Tags */}
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;
import { Helmet } from "react-helmet-async";

interface AdvancedSEOHelmetProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  productStructuredData?: object;
  alternateUrls?: Array<{ hreflang: string; href: string; }>;
  jsonLdSchema?: object[];
  breadcrumbSchema?: object;
  websiteSchema?: object;
  organizationSchema?: object;
}

const AdvancedSEOHelmet = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  structuredData,
  productStructuredData,
  alternateUrls = [],
  jsonLdSchema = [],
  breadcrumbSchema,
  websiteSchema,
  organizationSchema
}: AdvancedSEOHelmetProps) => {
  const baseUrl = "https://www.middasbuy.com";
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  // Enhanced Website Schema
  const defaultWebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Midasbuy",
    "headline": "Midasbuy - Official PUBG Mobile UC Top Up Store",
    "alternateName": ["Midasbuy Official", "Midasbuy Store", "Midasbuy UC", "Middasbuy"],
    "url": baseUrl,
    "identifier": "Midasbuy",
    "description": "Midasbuy is the #1 official PUBG Mobile UC top-up platform. Buy cheap UC, Free Fire Diamonds, Roblox Robux with instant delivery and secure payments.",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ]
  };

  // Enhanced Organization Schema
  const defaultOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Midasbuy",
    "legalName": "Midasbuy",
    "alternateName": ["Midasbuy Official", "Midasbuy Store", "Midasbuy UC", "Midasbuy PUBG Mobile", "Middasbuy"],
    "url": baseUrl,
    "identifier": "Midasbuy",
    "logo": `${baseUrl}/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png`,
    "description": "Midasbuy is the official PUBG Mobile UC top-up platform. Buy cheap UC, Free Fire Diamonds, Roblox Robux with instant delivery. Trusted by 10M+ gamers worldwide.",
    "foundingDate": "2020",
    "sameAs": [
      `${baseUrl}`,
      `${baseUrl}/about-midasbuy`,
      "https://www.facebook.com/midasbuy",
      "https://x.com/middasbuy",
      "https://www.instagram.com/midasbuy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu", "Hindi", "Arabic"],
      "serviceArea": "Worldwide"
    }
  };

  // Combine schemas
  const allSchemas = [
    websiteSchema || defaultWebsiteSchema,
    organizationSchema || defaultOrganizationSchema,
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ...(structuredData ? [structuredData] : []),
    ...(productStructuredData ? [productStructuredData] : []),
    ...jsonLdSchema
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Midasbuy" />
      
      {/* Enhanced CTR Meta Tags */}
      <meta name="abstract" content={description} />
      <meta name="topic" content="Gaming Credits and In-Game Currency" />
      <meta name="summary" content={description} />
      <meta name="Classification" content="Gaming, E-commerce" />
      <meta name="designer" content="Midasbuy Team" />
      <meta name="reply-to" content="support@middasbuy.com" />
      <meta name="owner" content="Midasbuy" />
      <meta name="url" content={fullCanonicalUrl} />
      <meta name="identifier-URL" content={fullCanonicalUrl} />
      <meta name="directory" content="submission" />
      <meta name="category" content="Gaming, PUBG Mobile, Free Fire, BGMI" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="application-name" content="Midasbuy" />
      <meta name="apple-mobile-web-app-title" content="Midasbuy" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link id="canonical-link" rel="canonical" href={fullCanonicalUrl} />

      {/* Enhanced Brand and Publisher Meta */}
      <meta name="application-name" content="Midasbuy" />
      <meta name="apple-mobile-web-app-title" content="Midasbuy" />
      <meta name="publisher" content="Midasbuy Gaming Platform" />
      <meta name="copyright" content="© 2026 Midasbuy. All rights reserved." />
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geographic Targeting */}
      <meta name="geo.region" content="PK;IN;US;BD;AE" />
      <meta name="geo.placename" content="Pakistan;India;United States;Bangladesh;UAE" />
      <meta name="ICBM" content="30.3753,69.3451" />
      <meta name="DC.title" content={title} />

      {/* Open Graph Tags (Enhanced) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta id="og-url-meta" property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Midasbuy Official Store" />
      <meta property="og:locale" content="en_US" />
      <meta property="article:publisher" content="Midasbuy" />

      {/* Twitter Cards (Enhanced) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@middasbuy" />
      <meta name="twitter:creator" content="@middasbuy" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="theme-color" content="#1E40AF" />
      <meta name="msapplication-TileColor" content="#1E40AF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />

      {/* Alternate Language Links */}
      {alternateUrls.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* DNS Prefetch and Preconnect for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//xphijmjxpgkwhtysmcxb.supabase.co" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://xphijmjxpgkwhtysmcxb.supabase.co" crossOrigin="anonymous" />

      {/* Preload LCP Image for Faster Loading */}
      <link 
        rel="preload" 
        as="image" 
        href="/lovable-uploads/0d9b0111-17db-4849-ac7d-173eeafc2a91.png" 
        type="image/png"
      />

      {/* Structured Data (JSON-LD) */}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default AdvancedSEOHelmet;
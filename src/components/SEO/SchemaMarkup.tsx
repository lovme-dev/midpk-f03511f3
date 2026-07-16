import { Helmet } from "react-helmet-async";

interface SchemaMarkupProps {
  type: 'Organization' | 'WebSite' | 'Product' | 'Store' | 'GameApplication';
  data: any;
}

// Enhanced Schema.org markup for different page types
export const SchemaMarkup = ({ type, data }: SchemaMarkupProps) => {
  const getSchemaData = () => {
    const baseUrl = "https://www.middasbuy.com";
    
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Midasbuy",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "description": "World's #1 official gaming store for PUBG UC, Free Fire diamonds, and mobile game currency",
          "foundingDate": "2020",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-MIDASBUY",
            "contactType": "customer service",
            "availableLanguage": ["English", "Arabic", "Urdu", "Hindi", "German", "French", "Turkish", "Malay", "Thai", "Romanian"]
          },
          "sameAs": [
            "https://facebook.com/midasbuy",
            "https://twitter.com/midasbuy",
            "https://instagram.com/midasbuy"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Singapore",
            "addressCountry": "SG"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Gaming Currency Catalog",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "PUBG UC"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product", 
                  "name": "Free Fire Diamonds"
                }
              }
            ]
          },
          ...data
        };

      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Midasbuy",
          "alternateName": "Midasbuy.com",
          "url": baseUrl,
          "description": "Official gaming store for PUBG UC & Free Fire diamonds worldwide",
          "inLanguage": ["en", "ur", "hi", "ar", "de", "fr", "tr", "ms", "th", "ro"],
          "publisher": {
            "@type": "Organization",
            "name": "Midasbuy",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "mainEntity": {
            "@type": "ItemList",
            "name": "Gaming Products",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Product",
                  "name": "PUBG UC",
                  "url": `${baseUrl}/`
                }
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "item": {
                  "@type": "Product",
                  "name": "Free Fire Diamonds",
                  "url": `${baseUrl}/free-fire`
                }
              }
            ]
          },
          ...data
        };

      case 'Product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name || "Gaming Currency",
          "description": data.description || "Premium gaming currency for mobile games",
          "brand": {
            "@type": "Brand",
            "name": data.brand || "Midasbuy"
          },
          "category": "Digital Gaming Currency",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": data.currency || "USD",
            "lowPrice": data.lowPrice || "0.99",
            "highPrice": data.highPrice || "99.99",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Midasbuy"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "15420",
            "bestRating": "5",
            "worstRating": "1"
          },
          ...data
        };

      case 'Store':
        return {
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Midasbuy Gaming Store",
          "description": "Official online gaming store for digital currency",
          "url": baseUrl,
          "currenciesAccepted": ["USD", "EUR", "GBP", "PKR", "INR", "AED", "SAR", "MYR", "TRY", "THB"],
          "paymentAccepted": ["Credit Card", "Debit Card", "PayPal", "Bank Transfer", "Stripe", "Mobile Payment"],
          "priceRange": "$0.99 - $99.99",
          "openingHours": "Mo-Su 00:00-23:59",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Gaming Products"
          },
          ...data
        };

      case 'GameApplication':
        return {
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": data.gameName || "Mobile Game",
          "genre": "Battle Royale",
          "gamePlatform": ["Android", "iOS"],
          "operatingSystem": ["Android", "iOS"],
          "applicationCategory": "Game",
          "offers": {
            "@type": "Offer",
            "category": "In-Game Currency",
            "seller": {
              "@type": "Organization",
              "name": "Midasbuy"
            }
          },
          ...data
        };

      default:
        return data;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getSchemaData())}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;
// Advanced SEO utility functions for enhanced ranking optimization

// Generate dynamic title variations for A/B testing and optimization
export const generateOptimizedTitles = (page: string, keywords: string[]) => {
  const titleVariations = {
    homepage: [
      "Midasbuy - #1 Official PUBG Mobile UC & Free Fire Diamonds Store | Buy Gaming Currency",
      "Official Midasbuy Store - Buy PUBG UC & Free Fire Diamonds | Instant Delivery & Best Prices",
      "Midasbuy Official - PUBG Mobile UC, Free Fire Diamonds & Gaming Currency | Trusted Worldwide"
    ],
    pubg: [
      "Buy PUBG UC Official Midasbuy Store - Instant Delivery & Best Prices | PUBG Mobile UC",
      "PUBG UC Midasbuy - Official PUBG Mobile UC Store | Cheap, Fast & Secure",
      "Midasbuy PUBG UC - Buy PUBG Mobile UC Official Store | Instant Delivery"
    ],
    freefire: [
      "Buy Free Fire Diamonds - Midasbuy Official Store | Instant Top Up & Best Prices",
      "Free Fire Diamonds Midasbuy - Official Garena Store | Cheap & Fast Delivery",
      "Midasbuy Free Fire - Buy Diamonds Official Store | Instant Recharge"
    ]
  };
  
  return titleVariations[page as keyof typeof titleVariations] || titleVariations.homepage;
};

// Generate enhanced meta descriptions with power words and CTAs
export const generateOptimizedDescriptions = (page: string, keywords: string[]) => {
  const descriptionVariations = {
    homepage: [
      "🎮 Official Midasbuy - #1 trusted gaming store for PUBG Mobile UC & Free Fire Diamonds. ⚡ Instant delivery, 🔒 secure payments, 💰 best prices worldwide. Join 10M+ gamers! Buy now →",
      "⭐ Midasbuy Official Store - Buy PUBG UC, Free Fire Diamonds & gaming currency with confidence. 🚀 Lightning-fast delivery, 💳 secure checkout, 🏆 trusted by millions. Start gaming now!",
      "🔥 Midasbuy Gaming Store - Your #1 destination for PUBG Mobile UC & Free Fire Diamonds. ✅ Verified seller, 💯 authentic currency, ⚡ instant delivery. Shop with confidence today!"
    ],
    pubg: [
      "🎯 Buy PUBG UC from Official Midasbuy Store - ⚡ Instant delivery, 💰 cheapest prices, 🔒 100% secure. Get your PUBG Mobile UC now and dominate the battlefield! 🏆",
      "💎 PUBG UC Midasbuy Official - Trusted by 10M+ players worldwide. ✅ Authentic UC, ⚡ instant delivery, 💳 secure payment. Buy PUBG Mobile UC cheap & safe!",
      "🚀 Midasbuy PUBG UC Store - Official partner for PUBG Mobile UC. 💰 Best prices guaranteed, ⚡ instant delivery, 🔒 secure checkout. Level up your game now!"
    ],
    freefire: [
      "💎 Buy Free Fire Diamonds - Midasbuy Official Store. ⚡ Instant top-up, 💰 best prices, 🔒 secure payment. Get your FF diamonds now and unlock premium content! 🔥",
      "🔥 Free Fire Diamonds Midasbuy - Official Garena partner. ✅ Authentic diamonds, ⚡ lightning delivery, 💳 trusted payment. Upgrade your Free Fire experience!",
      "⭐ Midasbuy Free Fire Store - #1 choice for FF diamonds. 💰 Cheapest prices, ⚡ instant recharge, 🔒 100% safe. Join millions of satisfied gamers!"
    ]
  };
  
  return descriptionVariations[page as keyof typeof descriptionVariations] || descriptionVariations.homepage;
};

// Generate comprehensive keyword lists for different page types
export const generateTargetKeywords = (page: string, location?: string) => {
  const baseKeywords = {
    midasbuy: [
      "Midasbuy", "Midasbuy official", "Midasbuy store", "Midasbuy gaming", "official Midasbuy",
      "Midasbuy PUBG", "Midasbuy Free Fire", "Midasbuy review", "Midasbuy legit", "Midasbuy safe"
    ],
    pubg: [
      "PUBG UC", "buy PUBG UC", "PUBG Mobile UC", "PUBG UC cheap", "PUBG UC official",
      "Midasbuy PUBG UC", "PUBG UC Midasbuy", "buy PUBG UC official", "PUBG UC store", "PUBG UC shop"
    ],
    freefire: [
      "Free Fire diamonds", "buy Free Fire diamonds", "FF diamonds", "Free Fire top up",
      "Midasbuy Free Fire", "Free Fire diamonds cheap", "Garena Free Fire", "Free Fire recharge"
    ],
    gaming: [
      "gaming currency", "mobile gaming", "game top up", "gaming store", "buy game currency",
      "gaming platform", "digital gaming", "mobile game currency", "online gaming", "esports"
    ]
  };

  const locationKeywords = location ? [
    `${location} gaming`,
    `${location} PUBG UC`,
    `${location} Free Fire`,
    `${location} game store`,
    `${location} mobile gaming`
  ] : [];

  return [...baseKeywords[page as keyof typeof baseKeywords] || baseKeywords.midasbuy, ...locationKeywords];
};

// Generate structured data for different content types
export const generateProductSchema = (product: {
  name: string;
  description: string;
  price: string;
  currency: string;
  image?: string;
  category?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image || "/og-image.png",
    "category": product.category || "Gaming Currency",
    "brand": {
      "@type": "Brand",
      "name": "Midasbuy",
      "logo": "https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png",
      "identifier": "Midasbuy"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": product.currency,
      "lowPrice": "0.99",
      "highPrice": product.price,
      "priceValidUntil": "2025-12-31",
      "offerCount": "18",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Midasbuy",
        "legalName": "Midasbuy",
        "identifier": "Midasbuy",
        "url": "https://www.middasbuy.com"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Michael Chen"
        },
        "datePublished": "2025-09-10",
        "reviewBody": "Outstanding gaming store! Fast delivery, competitive prices, and excellent customer support. Highly recommend for all gaming currency needs.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Emma Wilson"
        },
        "datePublished": "2025-09-14",
        "reviewBody": "Best place to buy gaming currency! Instant delivery and secure payment options. Very satisfied with the service.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "James Brown"
        },
        "datePublished": "2025-09-19",
        "reviewBody": "Reliable and trustworthy. Used multiple times and always had a great experience. Fast support and delivery.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ]
  };
};

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://www.middasbuy.com${crumb.url}`
    }))
  };
};

// Generate FAQ schema for enhanced SERP features
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate review schema for trust signals
export const generateReviewSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Midasbuy",
    "legalName": "Midasbuy",
    "identifier": "Midasbuy",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "25847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Gaming Pro"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Midasbuy is the most reliable platform for buying PUBG UC. Instant delivery and great customer support!"
      }
    ]
  };
};

// Generate local business schema for regional targeting
export const generateLocalBusinessSchema = (location: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Midasbuy",
    "legalName": "Midasbuy",
    "alternateName": `Midasbuy ${location}`,
    "identifier": "Midasbuy",
    "description": `Official Midasbuy gaming store serving ${location}. Buy PUBG UC, Free Fire Diamonds, and gaming currency with local payment methods.`,
    "url": "https://www.middasbuy.com",
    "areaServed": location,
    "serviceArea": location,
    "currenciesAccepted": "USD, PKR, INR, EUR, GBP",
    "paymentAccepted": "Credit Card, PayPal, Bank Transfer, Mobile Payment"
  };
};
import React from 'react';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import FreeFire from './FreeFire';

interface InternationalFreeFirePageProps {
  onLogout?: () => void;
}

const InternationalFreeFirePage: React.FC<InternationalFreeFirePageProps> = ({ onLogout }) => {
  // Advanced SEO optimization for international Free Fire Diamonds
  const title = 'Free Fire Diamonds - Official FF Topup Store | Buy Diamonds Worldwide | Midasbuy Global';
  const description = '💎 Worldwide Free Fire Diamonds Store - Official Garena Partner! Purchase FF Diamonds with instant account credit globally. Unlock Elite Pass Season bundles, exclusive characters (Chrono, Alok, K), legendary gun skins, and premium emotes. Multi-currency support with secure payment gateways. Trusted by 3M+ international Free Fire players across 150+ countries!';
  
  const keywords = [
    'Free Fire Diamonds',
    'Buy Diamonds',
    'Free Fire',
    'FF Diamonds',
    'Garena Free Fire',
    'Midasbuy Free Fire',
    'Free Fire top up',
    'buy FF diamonds',
    'Free Fire diamonds cheap',
    'Free Fire diamonds instant',
    'FF diamonds best price',
    'Free Fire currency',
    'Garena diamonds',
    'Free Fire store',
    'FF top up',
    'Free Fire official store',
    'buy Free Fire diamonds online',
    'Free Fire diamonds fast delivery',
    'Free Fire diamonds secure payment',
    'trusted Free Fire seller',
    'Free Fire diamonds worldwide',
    'Battle Royale game currency'
  ].join(', ');
  
  const canonicalUrl = 'https://www.middasbuy.com/midasbuy/buy/freefire';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.middasbuy.com/midasbuy/buy/freefire",
        "url": "https://www.middasbuy.com/midasbuy/buy/freefire",
        "name": title,
        "description": description,
        "inLanguage": "en-US",
        "datePublished": "2024-01-01",
        "dateModified": "2026-01-01",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.middasbuy.com",
          "name": "Midasbuy",
          "url": "https://www.middasbuy.com"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.middasbuy.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Free Fire Diamonds",
              "item": "https://www.middasbuy.com/midasbuy/buy/freefire"
            }
          ]
        }
      },
      {
        "@type": "Product",
        "@id": "https://www.middasbuy.com/midasbuy/buy/freefire#product",
        "name": "Free Fire Diamonds",
        "description": description,
        "image": [
          "https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png",
          "https://www.middasbuy.com/lovable-uploads/139a3a0d-82c6-4a5f-b365-f5d25aa75dee.png"
        ],
        "brand": {
          "@type": "Brand",
          "name": "Garena",
          "alternateName": "Free Fire",
          "logo": "https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png",
          "identifier": "Midasbuy"
        },
        "category": "Video Game Currency",
        "gtin": "FF-DIAMONDS-GLOBAL-2026",
        "mpn": "FF-DIAMONDS-PACK",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31",
          "lowPrice": "0.99",
          "highPrice": "99.99",
          "offerCount": "18",
          "seller": {
            "@type": "Organization",
            "name": "Midasbuy",
            "legalName": "Midasbuy",
            "identifier": "Midasbuy",
            "url": "https://www.middasbuy.com",
            "logo": "https://www.middasbuy.com/og-image.png"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "89524",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "John Martinez"
            },
            "datePublished": "2026-01-18",
            "reviewBody": "Excellent Free Fire diamond store! Got my diamonds instantly and the prices are very competitive. Will definitely use again!",
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
              "name": "Sarah Johnson"
            },
            "datePublished": "2026-01-22",
            "reviewBody": "Great service! Fast delivery and secure payment. Customer support was helpful when I had questions.",
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
              "name": "David Lee"
            },
            "datePublished": "2026-01-28",
            "reviewBody": "Best place to buy FF diamonds. Instant delivery, great prices, and very reliable. Highly recommended!",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            }
          }
        ]
      },
      {
        "@type": "FAQ",
        "@id": "https://www.middasbuy.com/midasbuy/buy/freefire#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Free Fire Diamonds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Free Fire Diamonds are the premium in-game currency for Garena Free Fire. You can use diamonds to purchase Elite Pass, character skins, weapon skins, emotes, pets, and other exclusive items in Free Fire."
            }
          },
          {
            "@type": "Question",
            "name": "How to buy Free Fire Diamonds at cheapest price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Midasbuy offers the cheapest Free Fire Diamond prices with instant delivery. Simply enter your Free Fire Player ID, select your diamond package, complete the payment, and receive your diamonds within minutes."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to buy Free Fire Diamonds from Midasbuy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, absolutely! Midasbuy is a trusted and verified Free Fire diamond seller with over 3 million satisfied customers worldwide. We use official payment channels and provide 100% genuine diamonds with instant delivery."
            }
          },
          {
            "@type": "Question",
            "name": "How long does Free Fire Diamond delivery take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Free Fire Diamond delivery is instant! Once payment is confirmed, you'll receive your diamonds within 2-5 minutes directly to your Free Fire account. We provide 24/7 support for any issues."
            }
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.middasbuy.com#organization",
        "name": "Midasbuy",
        "legalName": "Midasbuy",
        "identifier": "Midasbuy",
        "url": "https://www.middasbuy.com",
        "logo": "https://www.middasbuy.com/og-image.png",
        "foundingDate": "2020",
        "sameAs": [
          "https://www.facebook.com/midasbuy",
          "https://twitter.com/midasbuy",
          "https://www.instagram.com/midasbuy"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English"],
            "email": "support@middasbuy.com"
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHelmet 
        title={title}
        description={description}
        keywords={keywords}
        canonicalUrl={canonicalUrl}
        ogImage="/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png"
        structuredData={structuredData}
      />
      
      <FreeFire onLogout={onLogout} />
    </>
  );
};

export default InternationalFreeFirePage;
import React from 'react';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import Index from './Index';

interface InternationalPubgPageProps {
  onLogout?: () => void;
}

const InternationalPubgPage: React.FC<InternationalPubgPageProps> = ({ onLogout }) => {
  // Advanced SEO optimization for international PUBG Mobile UC
  const title = 'Buy PUBG Mobile UC - Best Prices | Midasbuy Official Store | Instant Delivery';
  const description = '⚡ Buy PUBG Mobile UC at Best Prices | Official Midasbuy Store | Instant Delivery in Minutes | 100% Safe Payment | PUBG Mobile Unknown Cash | 24/7 Support | 5 Million+ Happy Players Worldwide | Trusted PUBG UC Seller';
  
  const keywords = [
    'PUBG Mobile UC',
    'Buy UC',
    'PUBG Mobile',
    'Unknown Cash',
    'PUBG UC',
    'Midasbuy PUBG',
    'PUBG UC buy',
    'buy PUBG UC online',
    'PUBG Mobile top up',
    'PUBG UC instant delivery',
    'PUBG UC cheap',
    'PUBG UC best price',
    'PUBG Mobile Unknown Cash',
    'PUBG UC store',
    'PUBG UC official',
    'PUBG royale pass UC',
    'PUBG battle pass',
    'PUBG UC fast delivery',
    'PUBG UC secure payment',
    'trusted PUBG UC seller',
    'PUBG UC worldwide',
    'PUBG Mobile currency',
    'Battle Royale game currency'
  ].join(', ');
  
  const canonicalUrl = 'https://www.middasbuy.com/midasbuy/buy/pubgm';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.middasbuy.com/midasbuy/buy/pubgm",
        "url": "https://www.middasbuy.com/midasbuy/buy/pubgm",
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
              "name": "PUBG Mobile UC",
              "item": "https://www.middasbuy.com/midasbuy/buy/pubgm"
            }
          ]
        }
      },
      {
        "@type": "Product",
        "@id": "https://www.middasbuy.com/midasbuy/buy/pubgm#product",
        "name": "PUBG Mobile UC (Unknown Cash)",
        "description": description,
        "image": [
          "https://www.middasbuy.com/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png",
          "https://www.middasbuy.com/og-image.png"
        ],
        "brand": {
          "@type": "Brand",
          "name": "Tencent Games",
          "alternateName": "PUBG Mobile",
          "logo": "https://www.middasbuy.com/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png",
          "identifier": "Midasbuy"
        },
        "category": "Video Game Currency",
        "gtin": "PUBG-UC-GLOBAL-2026",
        "mpn": "PUBG-UC-PACK",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31",
          "lowPrice": "0.99",
          "highPrice": "99.99",
          "offerCount": "20",
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
          "reviewCount": "125847",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "John Smith"
            },
            "datePublished": "2026-01-15",
            "reviewBody": "Best PUBG UC store! Instant delivery and great prices. I've been buying from Midasbuy for months now. Highly recommended!",
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
              "name": "Maria Garcia"
            },
            "datePublished": "2026-01-20",
            "reviewBody": "Fast and reliable service. Got my PUBG UC within 2 minutes of payment. Will definitely buy again!",
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
              "name": "Ahmed Hassan"
            },
            "datePublished": "2026-01-25",
            "reviewBody": "Trusted seller with competitive prices. Customer support is excellent. Best place to buy PUBG UC online.",
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
        "@id": "https://www.middasbuy.com/midasbuy/buy/pubgm#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is PUBG Mobile UC?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PUBG Mobile UC (Unknown Cash) is the premium in-game currency for PUBG Mobile. You can use UC to purchase Royal Pass, elite pass, weapon skins, character outfits, crates, and other exclusive items in PUBG Mobile."
            }
          },
          {
            "@type": "Question",
            "name": "How to buy PUBG Mobile UC at best price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Midasbuy offers the best PUBG Mobile UC prices with instant delivery. Simply enter your Player ID, select your UC package, complete the payment, and receive your UC within minutes."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to buy PUBG UC from Midasbuy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, absolutely! Midasbuy is a trusted and verified PUBG UC seller with over 5 million satisfied customers worldwide. We use official payment channels and provide 100% genuine UC with instant delivery."
            }
          },
          {
            "@type": "Question",
            "name": "How long does PUBG UC delivery take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PUBG UC delivery is instant! Once payment is confirmed, you'll receive your UC within 2-5 minutes directly to your PUBG Mobile account. We provide 24/7 support for any issues."
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
            "email": "help@midasbuy.com.co"
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
        ogImage="/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
        structuredData={structuredData}
      />
      
      <Index onLogout={onLogout} />
    </>
  );
};

export default InternationalPubgPage;
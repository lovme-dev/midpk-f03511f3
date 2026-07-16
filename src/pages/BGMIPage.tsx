import React from 'react';
import SEOHelmet from '@/components/SEO/SEOHelmet';

import Index from './Index';

interface BGMIPageProps {
  onLogout?: () => void;
}

const BGMIPage: React.FC<BGMIPageProps> = ({ onLogout }) => {
  // Advanced SEO optimization for #1 Google ranking on BGMI searches (India Only) - 2026 Update
  const title = 'Buy BGMI UC 2026 - Cheapest Battlegrounds Mobile India UC ₹83 | 60% OFF Instant Delivery | Midasbuy Official Krafton Partner';
  const description = '🇮🇳 #1 BGMI UC Store India 2026! Buy Battlegrounds Mobile India Unknown Cash from ₹83 | 60% OFF + 30% VIP Bonus | Instant 2-Min Delivery | Royal Pass, M416 Glacier, AWM Skins, Mythic Outfits | UPI/PhonePe/Paytm/GPay/Credit Card | Trusted by 50 Lakh+ Indian Players! Official Krafton Authorized Seller. Cheapest BGMI UC Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata.';
  
  const keywords = [
    // TOP PRIORITY - Ranking #1 Keywords 2026
    'BGMI UC', 'buy BGMI UC', 'BGMI UC India', 'Battlegrounds Mobile India UC', 'BGMI Unknown Cash',
    'cheapest BGMI UC', 'BGMI UC 2026', 'BGMI UC purchase', 'BGMI top up', 'BGMI recharge',
    
    // Midasbuy Brand Keywords
    'Midasbuy BGMI', 'Midasbuy BGMI UC', 'BGMI UC Midasbuy India', 'buy BGMI UC Midasbuy',
    'Midasbuy BGMI store', 'Midasbuy BGMI official', 'middasbuy BGMI UC',
    
    // Action Keywords (High Intent)
    'buy BGMI UC online', 'purchase BGMI UC', 'order BGMI UC', 'get BGMI UC',
    'BGMI UC recharge online', 'BGMI online top up', 'BGMI instant top up', 'BGMI quick recharge',
    
    // Price & Discount Keywords
    'cheap BGMI UC', 'cheapest BGMI UC India', 'BGMI UC low price', 'BGMI UC discount',
    'BGMI UC sale', 'BGMI UC offer', 'BGMI UC promo', 'BGMI UC deals', 'BGMI UC bonus',
    'lowest price BGMI UC', 'best BGMI UC deal', 'BGMI UC combo', 'BGMI UC bundle offer',
    'BGMI UC ₹83', 'BGMI UC 83 rupees', 'BGMI UC cheap price India',
    
    // India Payment Keywords
    'BGMI UC UPI payment', 'BGMI UC Paytm', 'BGMI UC PhonePe', 'BGMI UC GooglePay', 'BGMI UC GPay',
    'BGMI UC rupees payment', 'BGMI UC credit card India', 'BGMI UC debit card', 'BGMI UC net banking',
    'BGMI UC wallet payment', 'BGMI UC RuPay', 'BGMI UC BHIM', 'BGMI UC mobile payment India',
    
    // City-Specific Keywords (Major Indian Cities)
    'BGMI UC Delhi', 'BGMI UC Mumbai', 'BGMI UC Bangalore', 'BGMI UC Bengaluru', 'BGMI UC Hyderabad',
    'BGMI UC Chennai', 'BGMI UC Kolkata', 'BGMI UC Pune', 'BGMI UC Ahmedabad', 'BGMI UC Jaipur',
    'BGMI UC Lucknow', 'BGMI UC Kanpur', 'BGMI UC Nagpur', 'BGMI UC Indore', 'BGMI UC Thane',
    'BGMI UC Bhopal', 'BGMI UC Visakhapatnam', 'BGMI UC Patna', 'BGMI UC Vadodara', 'BGMI UC Ghaziabad',
    'BGMI UC Ludhiana', 'BGMI UC Agra', 'BGMI UC Nashik', 'BGMI UC Faridabad', 'BGMI UC Meerut',
    'BGMI UC Rajkot', 'BGMI UC Varanasi', 'BGMI UC Srinagar', 'BGMI UC Aurangabad', 'BGMI UC Dhanbad',
    
    // Product Keywords (Skins, Items, Pass)
    'BGMI royal pass', 'BGMI M416 Glacier', 'BGMI AWM skin', 'BGMI mythic outfit', 'BGMI gun skins',
    'BGMI weapon skins', 'BGMI character skins', 'BGMI vehicle skins', 'BGMI premium crates',
    'BGMI classic crates', 'BGMI lucky spin', 'BGMI emotes', 'BGMI parachute skins', 'BGMI helmet skins',
    'BGMI backpack skins', 'BGMI pan skins', 'BGMI Kar98 skin', 'BGMI DP skin', 'BGMI AKM skin',
    
    // UC Package Keywords
    'BGMI 60 UC', 'BGMI 120 UC', 'BGMI 300 UC', 'BGMI 600 UC', 'BGMI 1800 UC', 'BGMI 3850 UC',
    'BGMI 8100 UC', 'BGMI UC pack', 'BGMI monthly pass', 'BGMI weekly pass', 'BGMI RP UC',
    
    // Krafton Keywords
    'Krafton BGMI', 'Krafton UC', 'Krafton authorized seller', 'Krafton official partner',
    'Krafton BGMI India', 'Krafton game', 'Krafton store',
    
    // Trust & Safety Keywords
    'safe BGMI UC India', 'secure BGMI UC purchase', 'trusted BGMI UC seller', 'verified BGMI UC dealer',
    'genuine BGMI UC store', 'official BGMI UC retailer', 'BGMI real UC', 'BGMI authentic UC',
    'BGMI fraud protection', 'BGMI money back guarantee', 'legitimate BGMI store',
    
    // Delivery Keywords
    'instant BGMI UC', 'fast BGMI UC delivery', 'BGMI quick processing', 'BGMI automated delivery',
    'BGMI real time top up', 'BGMI 2 minute delivery', 'BGMI instant credit', 'BGMI direct recharge',
    
    // Long-tail Question Keywords
    'how to buy BGMI UC', 'where to buy BGMI UC India', 'best place buy BGMI UC',
    'cheapest way to buy BGMI UC', 'how to top up BGMI', 'how to recharge BGMI UC',
    'is Midasbuy safe for BGMI', 'best BGMI UC website India', 'BGMI UC buying guide',
    
    // Competitor Alternative Keywords
    'codashop BGMI alternative', 'seagm BGMI', 'razer gold BGMI', 'google play BGMI',
    'BGMI top up app', 'BGMI UC purchase app', 'best BGMI top up website India',
    
    // Event & Seasonal Keywords
    'BGMI Diwali offer', 'BGMI Holi sale', 'BGMI new year sale', 'BGMI UC festival',
    'BGMI weekend sale', 'BGMI flash sale', 'BGMI midnight offer', 'BGMI UC rush',
    'BGMI double bonus', 'BGMI triple UC', 'BGMI VIP bonus', 'BGMI special package',
    
    // Esports & Gaming Keywords
    'BGMI esports', 'BGMI tournament', 'BGMI championship', 'BGMI pro league',
    'BGMI India Series', 'BGIS UC', 'BGMI competitive gaming', 'BGMI Masters',
    
    // Hindi Keywords
    'BGMI UC kaise kharide', 'BGMI UC sasta', 'BGMI UC online', 'BGMI UC Hindi',
    
    // 2026 Trending Keywords
    'BGMI UC 2026', 'BGMI top up 2026', 'best BGMI UC prices 2026', 'cheapest BGMI UC 2026',
    'BGMI new update UC', 'BGMI latest UC', 'BGMI trending 2026', 'BGMI 3.0 UC'
  ].join(', ');
  
  const canonicalUrl = 'https://www.middasbuy.com/bgmi';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.middasbuy.com/bgmi",
        "url": "https://www.middasbuy.com/bgmi",
        "name": title,
        "description": description,
        "inLanguage": "en-IN",
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
              "name": "BGMI UC",
              "item": "https://www.middasbuy.com/bgmi"
            }
          ]
        }
      },
      // Import ucPackages at top of file to use here
      ...[
        {
          id: "3250uc",
          baseAmount: 2000,
          bonusAmount: 1250,
          price: 3600,
          image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
        },
        {
          id: "4250uc",
          baseAmount: 3000,
          bonusAmount: 1250,
          price: 8400,
          image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
        },
        {
          id: "10904uc",
          baseAmount: 7000,
          bonusAmount: 3904,
          price: 12350,
          image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
        },
        {
          id: "17668uc",
          baseAmount: 12000,
          bonusAmount: 5668,
          price: 16200,
          image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
        },
        {
          id: "21341uc",
          baseAmount: 15000,
          bonusAmount: 6341,
          price: 18750,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "25014uc",
          baseAmount: 18000,
          bonusAmount: 7014,
          price: 22100,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "28687uc",
          baseAmount: 21000,
          bonusAmount: 7687,
          price: 25750,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "32360uc",
          baseAmount: 24000,
          bonusAmount: 8360,
          price: 28750,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "36033uc",
          baseAmount: 27000,
          bonusAmount: 9033,
          price: 32850,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "39706uc",
          baseAmount: 30000,
          bonusAmount: 9706,
          price: 35900,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "43379uc",
          baseAmount: 33000,
          bonusAmount: 10379,
          price: 39750,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "47052uc",
          baseAmount: 36000,
          bonusAmount: 11052,
          price: 43500,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "50725uc",
          baseAmount: 39000,
          bonusAmount: 11725,
          price: 47250,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "54398uc",
          baseAmount: 42000,
          bonusAmount: 12398,
          price: 51000,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "58071uc",
          baseAmount: 45000,
          bonusAmount: 13071,
          price: 54750,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "61744uc",
          baseAmount: 48000,
          bonusAmount: 13744,
          price: 58500,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "65417uc",
          baseAmount: 51000,
          bonusAmount: 14417,
          price: 62250,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        },
        {
          id: "69090uc",
          baseAmount: 54000,
          bonusAmount: 15090,
          price: 66000,
          image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
        }
      ].map((pkg) => ({
        "@type": "Product",
        "@id": `https://middasbuy.com/bgmi/purchase/${pkg.id}#product`,
        "name": `BGMI ${pkg.baseAmount} UC ${pkg.bonusAmount > 0 ? `+${pkg.bonusAmount} Bonus` : ''}`,
        "description": `Buy ${pkg.baseAmount} UC ${pkg.bonusAmount > 0 ? `with ${pkg.bonusAmount} bonus UC` : ''} for Battlegrounds Mobile India (BGMI) at best price. Instant delivery with secure payment.`,
        "image": pkg.image,
        "sku": `BGMI-${pkg.id}`,
        "brand": {
          "@type": "Brand",
          "name": "Krafton",
          "alternateName": "BGMI"
        },
        "category": "Video Game Currency",
        "offers": {
          "@type": "Offer",
          "url": `https://middasbuy.com/bgmi/purchase/${pkg.id}`,
          "priceCurrency": "INR",
          "price": (pkg.price / 280 * 83).toFixed(0), // Convert PKR to INR
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Midasbuy"
          }
        },
        "audience": {
          "@type": "Audience",
          "geographicArea": {
            "@type": "Country",
            "name": "India"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "52847"
        }
      })),
      {
        "@type": "LocalBusiness",
        "@id": "https://middasbuy.com#localbusiness", 
        "name": "Midasbuy BGMI UC Store",
        "description": "India's #1 BGMI UC Store - Buy BGMI Unknown Cash at lowest prices with instant delivery",
        "url": "https://middasbuy.com/bgmi",
        "telephone": "+44 7476 966269",
        "email": "help@midasbuy.com.co",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN",
          "addressRegion": "Delhi",
          "addressLocality": "New Delhi"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 28.6139,
          "longitude": 77.2090
        },
        "openingHours": "Mo-Su 00:00-24:00",
        "priceRange": "₹83-₹8348",
        "paymentAccepted": ["PayPal", "UPI", "Credit Card", "Debit Card"],
        "currenciesAccepted": "INR",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "52847"
        }
      },
      {
        "@type": "FAQ",
        "@id": "https://middasbuy.com/bgmi#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is BGMI UC?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "BGMI UC (Unknown Cash) is the premium in-game currency for Battlegrounds Mobile India (BGMI). You can use UC to purchase royal pass, premium crates, character skins, weapon skins, and other exclusive items in BGMI."
            }
          },
          {
            "@type": "Question", 
            "name": "How to buy BGMI UC cheapest price in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Midasbuy offers the cheapest BGMI UC prices in India starting from just ₹83. We provide instant delivery within 2 minutes with 100% safe and secure payment methods."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to buy BGMI UC from Midasbuy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, absolutely! Midasbuy is a trusted and verified BGMI UC seller with 50+ lakh satisfied customers. We use official payment channels and provide 100% genuine UC with instant delivery."
            }
          },
          {
            "@type": "Question",
            "name": "How long does BGMI UC delivery take?",
            "acceptedAnswer": {
              "@type": "Answer", 
              "text": "BGMI UC delivery is instant! Once payment is confirmed, you'll receive your UC within 2 minutes directly to your BGMI account. We provide 24/7 support for any issues."
            }
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.middasbuy.com#organization",
        "name": "Midasbuy",
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
            "availableLanguage": ["English", "Hindi"],
            "telephone": "+44 7476 966269",
            "email": "help@midasbuy.com.co"
          },
          {
            "@type": "ContactPoint",
            "contactType": "sales",
            "availableLanguage": ["English", "Hindi"],
            "hoursAvailable": "Mo-Su 00:00-24:00"
          }
        ],
        "areaServed": {
          "@type": "Country",
          "name": "India"
        }
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
        ogImage="/lovable-uploads/5b1c2388-538d-4898-9cfa-21f6551e25ef.png"
        structuredData={structuredData}
      />
      <Index onLogout={onLogout} overrideCountry={{ code: 'in', currency: 'INR' }} linkQuery="?bgmi=1" gameBrand="BGMI" />
    </>
  );
};

export default BGMIPage;
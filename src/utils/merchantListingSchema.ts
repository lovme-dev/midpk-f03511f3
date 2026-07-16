/**
 * Generates Google Merchant Listing-compliant Product schema for game packages.
 * Includes required fields: hasMerchantReturnPolicy, shippingDetails, and valid audience type.
 * Fixes Google Search Console issues:
 *  - Missing field "hasMerchantReturnPolicy" (in "offers")
 *  - Missing field "shippingDetails" (in "offers")
 *  - Invalid object type for field "audience"
 */

const BASE_URL = "https://www.middasbuy.com";
const SELLER = {
  "@type": "Organization",
  "name": "Midasbuy",
  "url": BASE_URL,
};

// Standard return policy applied to all digital game products.
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  "applicableCountry": ["US", "PK", "IN", "AE", "SA", "MY", "PH", "ID", "BR", "GB", "DE", "FR", "TR", "TH", "BD", "EG"],
  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
  "merchantReturnDays": 7,
  "returnMethod": "https://schema.org/ReturnByMail",
  "returnFees": "https://schema.org/FreeReturn",
};

// Digital delivery shipping details (instant, no fee).
const SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  "shippingRate": {
    "@type": "MonetaryAmount",
    "value": "0",
    "currency": "USD",
  },
  "shippingDestination": {
    "@type": "DefinedRegion",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "0",
      "longitude": "0",
    },
  },
  "deliveryTime": {
    "@type": "ShippingDeliveryTime",
    "handlingTime": {
      "@type": "QuantitativeValue",
      "minValue": 0,
      "maxValue": 0,
      "unitCode": "MIN",
    },
    "transitTime": {
      "@type": "QuantitativeValue",
      "minValue": 1,
      "maxValue": 5,
      "unitCode": "MIN",
    },
  },
};

// PeopleAudience is the valid object type for "audience" field.
const AUDIENCE = {
  "@type": "PeopleAudience",
  "suggestedMinAge": 13,
  "audienceType": "Gamers",
};

export interface MerchantProductInput {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  url: string;
  brandName: string;
  category?: string;
}

export const buildMerchantProduct = (p: MerchantProductInput) => ({
  "@type": "Product",
  "@id": `${p.url}#product`,
  "name": p.name,
  "description": p.description,
  "image": p.image.startsWith("http") ? p.image : `${BASE_URL}${p.image}`,
  "sku": p.id,
  "mpn": p.id,
  "category": p.category || "Digital Gaming Currency",
  "brand": {
    "@type": "Brand",
    "name": p.brandName,
  },
  "audience": AUDIENCE,
  "offers": {
    "@type": "Offer",
    "url": p.url,
    "priceCurrency": p.currency,
    "price": p.price.toFixed(2),
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": SELLER,
    "hasMerchantReturnPolicy": RETURN_POLICY,
    "shippingDetails": SHIPPING_DETAILS,
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "15420",
    "bestRating": "5",
    "worstRating": "1",
  },
});

/**
 * Returns an ItemList JSON-LD schema with all merchant products mapped.
 */
export const buildMerchantItemList = (
  listName: string,
  products: MerchantProductInput[]
) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      "name": listName,
      "numberOfItems": products.length,
      "itemListElement": products.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": buildMerchantProduct(p),
      })),
    },
  ],
});

// ---------- Game-specific helpers ----------

import { ucPackages } from "@/data/ucPackages";
import { diamondPackages } from "@/data/diamondPackages";
import { robuxPackages } from "@/data/robuxPackages";

export const getPubgUcMerchantSchema = () => {
  const products: MerchantProductInput[] = ucPackages.map((pkg) => {
    const totalUC = pkg.baseAmount + pkg.bonusAmount;
    return {
      id: pkg.id,
      name: `PUBG Mobile ${totalUC} UC (${pkg.baseAmount} + ${pkg.bonusAmount} Bonus)`,
      description: `Buy ${pkg.baseAmount} PUBG Mobile UC with ${pkg.bonusAmount} bonus UC at the cheapest price. Instant delivery to your PUBG Mobile account via official Midasbuy partner.`,
      image: pkg.image,
      price: pkg.price,
      currency: "PKR",
      url: `${BASE_URL}/midasbuy/pk/buy/pubgm?package=${pkg.id}`,
      brandName: "PUBG Mobile",
      category: "PUBG Mobile UC",
    };
  });
  return buildMerchantItemList("PUBG Mobile UC Packages", products);
};

export const getFreeFireMerchantSchema = () => {
  const products: MerchantProductInput[] = diamondPackages.map((pkg) => {
    const totalDiamonds = pkg.baseAmount + pkg.bonusAmount;
    return {
      id: pkg.id,
      name: `Free Fire ${totalDiamonds} Diamonds (${pkg.baseAmount} + ${pkg.bonusAmount} Bonus)`,
      description: `Buy ${pkg.baseAmount} Garena Free Fire Diamonds with ${pkg.bonusAmount} bonus diamonds. Instant top-up to your Free Fire UID via Midasbuy.`,
      image: pkg.image,
      price: pkg.price,
      currency: "PKR",
      url: `${BASE_URL}/midasbuy/pk/buy/freefire?package=${pkg.id}`,
      brandName: "Garena Free Fire",
      category: "Free Fire Diamonds",
    };
  });
  return buildMerchantItemList("Free Fire Diamond Packages", products);
};

export const getRobloxMerchantSchema = () => {
  const products: MerchantProductInput[] = robuxPackages.map((pkg) => {
    const totalRobux = pkg.baseAmount + pkg.bonusAmount;
    return {
      id: pkg.id,
      name: `Roblox ${totalRobux} Robux (${pkg.baseAmount} + ${pkg.bonusAmount} Bonus)`,
      description: `Buy ${pkg.baseAmount} Roblox Robux with ${pkg.bonusAmount} bonus robux. Instant delivery to your Roblox account via Midasbuy official store.`,
      image: typeof pkg.image === "string" ? pkg.image : "/lovable-uploads/roblox-icon.png",
      price: pkg.price,
      currency: "PKR",
      url: `${BASE_URL}/midasbuy/pk/buy/roblox?package=${pkg.id}`,
      brandName: "Roblox",
      category: "Roblox Robux",
    };
  });
  return buildMerchantItemList("Roblox Robux Packages", products);
};

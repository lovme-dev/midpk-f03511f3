// Independent PUBG Mobile Shop products (Elite Pass / Prime / Growthgift / Weekly Deal).
// These are NOT UC packages — they must never be displayed with UC branding or "1+0" amounts.

import elitePass50 from "@/assets/shop/a18-elite-pass-50.jpeg";
import elitePass100 from "@/assets/shop/a18-elite-pass-100.jpeg";
import elitePassPlus from "@/assets/shop/a18-elite-pass-plus.jpeg";
import firstPurchasePack from "@/assets/shop/first-purchase-pack.jpeg";
import firearmMaterialsPack from "@/assets/shop/firearm-materials-pack.jpeg";
import mythicEmblemPack from "@/assets/shop/mythic-emblem-pack.jpeg";
import prime1Month from "@/assets/shop/prime-1month.jpeg";
import prime3Months from "@/assets/shop/prime-3months.jpeg";
import prime6Months from "@/assets/shop/prime-6months.jpeg";
import prime12Months from "@/assets/shop/prime-12months.jpeg";
import primePlus1Month from "@/assets/shop/prime-plus-1month.jpeg";
import primePlus3Months from "@/assets/shop/prime-plus-3months.jpeg";
import primePlus6Months from "@/assets/shop/prime-plus-6months.jpeg";
import weeklyMythicPack from "@/assets/shop/weekly-mythic-pack.jpeg";
import weeklyDealPack1 from "@/assets/shop/weekly-deal-pack-1.jpeg";
import weeklyDealPack2 from "@/assets/shop/weekly-deal-pack-2.jpeg";

export interface ShopProduct {
  id: string;
  name: string;
  /** Compact title used in order center / checkout summary / admin panel */
  shortTitle: string;
  price: number;
  originalPrice?: number;
  pricePrefix?: string;
  image: string;
  category: string;
  discount?: string;
  badge?: string;
  badgeColor?: string;
}

export const shopProducts: ShopProduct[] = [
  // RP Category - Elite Pass (A18)
  {
    id: "a18-elite-pass-50",
    name: "A18 ELITE PASS (LV1-50)",
    shortTitle: "A18 Elite Pass",
    price: 1499,
    originalPrice: 1619,
    pricePrefix: "From",
    image: elitePass50,
    category: "rp",
    discount: "-7.41%",
  },
  {
    id: "a18-elite-pass-100",
    name: "ELITE PASS (LV1-100)",
    shortTitle: "Elite Pass LV100",
    price: 2999,
    originalPrice: 3239,
    pricePrefix: "From",
    image: elitePass100,
    category: "rp",
    discount: "-7.4%",
  },
  {
    id: "a18-elite-pass-plus",
    name: "ELITE PASS PLUS (LV1-100)",
    shortTitle: "Elite Pass Plus",
    price: 7499,
    originalPrice: 8099,
    pricePrefix: "From",
    image: elitePassPlus,
    category: "rp",
    discount: "-7.4%",
  },
  // Growthgift Category
  {
    id: "first-purchase-pack",
    name: "First Purchase Pack",
    shortTitle: "First Purchase Pack",
    price: 249,
    pricePrefix: "From",
    image: firstPurchasePack,
    category: "growthgift",
    discount: "-50%",
  },
  {
    id: "firearm-materials",
    name: "Upgradable Firearm Materials Pack",
    shortTitle: "Firearm Materials Pack",
    price: 749,
    pricePrefix: "From",
    image: firearmMaterialsPack,
    category: "growthgift",
    discount: "-30%",
  },
  {
    id: "mythic-emblem",
    name: "Mythic Emblem Pack",
    shortTitle: "Mythic Emblem Pack",
    price: 1249,
    pricePrefix: "From",
    image: mythicEmblemPack,
    category: "growthgift",
    discount: "-25%",
  },
  // Subscriptiongift Category - Prime
  {
    id: "prime-1month",
    name: "Prime (1 Month)",
    shortTitle: "Prime 1 Month",
    price: 249,
    pricePrefix: "From",
    image: prime1Month,
    category: "subscriptiongift",
    discount: "-10%",
  },
  {
    id: "prime-3months",
    name: "Prime (3 Months)",
    shortTitle: "Prime 3 Months",
    price: 749,
    pricePrefix: "From",
    image: prime3Months,
    category: "subscriptiongift",
    discount: "-10%",
  },
  {
    id: "prime-6months",
    name: "Prime (6 Months)",
    shortTitle: "Prime 6 Months",
    price: 1499,
    pricePrefix: "From",
    image: prime6Months,
    category: "subscriptiongift",
    discount: "-10%",
  },
  {
    id: "prime-12months",
    name: "Prime (12 Months)",
    shortTitle: "Prime 12 Months",
    price: 2999,
    pricePrefix: "From",
    image: prime12Months,
    category: "subscriptiongift",
    discount: "-10%",
  },
  // Prime Plus
  {
    id: "prime-plus-1month",
    name: "Prime Plus (1 Month)",
    shortTitle: "Prime Plus 1 Month",
    price: 2499,
    pricePrefix: "From",
    image: primePlus1Month,
    category: "subscriptiongift",
    discount: "-15%",
  },
  {
    id: "prime-plus-3months",
    name: "Prime Plus (3 Months)",
    shortTitle: "Prime Plus 3 Months",
    price: 7499,
    pricePrefix: "From",
    image: primePlus3Months,
    category: "subscriptiongift",
    discount: "-15%",
  },
  {
    id: "prime-plus-6months",
    name: "Prime Plus (6 Months)",
    shortTitle: "Prime Plus 6 Months",
    price: 14999,
    pricePrefix: "From",
    image: primePlus6Months,
    category: "subscriptiongift",
    discount: "-15%",
  },
  // Weekly Deal Pack
  {
    id: "weekly-mythic-pack",
    name: "Weekly Mythic Emblem Value Pack",
    shortTitle: "Weekly Mythic Pack",
    price: 749,
    pricePrefix: "From",
    image: weeklyMythicPack,
    category: "weekly-deal",
    discount: "-70%",
  },
  {
    id: "weekly-deal-pack-1",
    name: "Weekly Deal Pack 1",
    shortTitle: "Weekly Deal Pack 1",
    price: 249,
    pricePrefix: "From",
    image: weeklyDealPack1,
    category: "weekly-deal",
    discount: "-75%",
  },
  {
    id: "weekly-deal-pack-2",
    name: "Weekly Deal Pack 2",
    shortTitle: "Weekly Deal Pack 2",
    price: 749,
    pricePrefix: "From",
    image: weeklyDealPack2,
    category: "weekly-deal",
    discount: "-70%",
  },
];

/** Bundled fallback images keyed by product id (used until admin uploads one) */
export const staticShopImages: Record<string, string> = shopProducts.reduce(
  (acc, p) => ({ ...acc, [p.id]: p.image }),
  {} as Record<string, string>
);

/** Live (admin-managed) catalog loaded from the database at runtime */
let liveShopProducts: ShopProduct[] | null = null;

export const setLiveShopProducts = (list: ShopProduct[]) => {
  liveShopProducts = list.length ? list : null;
};

export const getShopProductList = (): ShopProduct[] => liveShopProducts ?? shopProducts;

/** Unit label shown next to the product (Royal Pass / Prime / Pack) */
export const getShopProductLabel = (product: ShopProduct): string => {
  if (product.category === "rp") return "Royal Pass";
  if (product.category === "subscriptiongift") {
    return product.name.includes("Plus") ? "Prime Plus" : "Prime";
  }
  return "Pack";
};

export const getShopProductByCode = (code?: string | null): ShopProduct | undefined => {
  if (!code) return undefined;
  const key = code.toLowerCase().trim();
  return getShopProductList().find((p) => p.id.toLowerCase() === key);
};

export const getShopProductByName = (name?: string | null): ShopProduct | undefined => {
  if (!name) return undefined;
  const key = name.toLowerCase().trim();
  return getShopProductList().find(
    (p) => p.name.toLowerCase() === key || p.shortTitle.toLowerCase() === key
  );
};

/** True when an order is a shop pack (Elite Pass / Prime / Growthgift), not a UC top-up */
export const isShopProductType = (productType?: string | null): boolean => {
  const type = (productType || "").toLowerCase();
  return (
    type.includes("shop_item") ||
    type.includes("pubg_shop") ||
    type.includes("royal_pass") ||
    type.includes("elite_pass")
  );
};

/** Resolve display info for an order row coming from the database */
export const resolveShopOrderDisplay = (order: {
  product_code?: string | null;
  product_name?: string | null;
}): { title: string; label: string; image?: string } => {
  const product =
    getShopProductByCode(order.product_code) || getShopProductByName(order.product_name);
  if (product) {
    return {
      title: product.shortTitle,
      label: getShopProductLabel(product),
      image: product.image,
    };
  }
  return { title: order.product_name || "Shop Item", label: "Pack" };
};

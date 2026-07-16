// International SEO utilities for country-specific optimization
import { COUNTRY_DATA } from './gameSeoConfigs';

export interface CountrySEOConfig {
  title: string;
  description: string;
  keywords: string;
  currency: string;
  language: string;
  locale: string;
  hreflang: string;
  countryName?: string;
  paymentMethods?: string[];
}

// Helper function to get country name from code
// Uses COUNTRY_DATA as the comprehensive source for all 190+ countries
export const getCountryName = (countryCode: string): string => {
  if (COUNTRY_DATA[countryCode]?.name) {
    return COUNTRY_DATA[countryCode].name;
  }
  if (countryCode === "GLOBAL") return "Worldwide";
  return "International";
};

// Helper function to get payment methods by country
// Uses COUNTRY_DATA for comprehensive 190+ country coverage
export const getCountryPaymentMethods = (countryCode: string): string[] => {
  // Check COUNTRY_DATA first for comprehensive coverage
  if (COUNTRY_DATA[countryCode]?.paymentMethods?.length) {
    return COUNTRY_DATA[countryCode].paymentMethods;
  }
  return ["Credit Card", "Debit Card", "PayPal"];
};

// Country-specific SEO configurations with comprehensive 2026 optimization for #1 ranking
export const COUNTRY_SEO_CONFIGS: Record<string, CountrySEOConfig> = {
  // South Asian Countries
  PK: {
    title: "Buy PUBG UC Pakistan 2026 - Cheapest UC | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇵🇰 #1 PUBG UC Store Pakistan 2026! Buy PUBG Mobile UC from Rs.83 | 60% OFF + 30% VIP Bonus | Instant 2-5 Min Delivery | Royal Pass, Glacier M416, AWM Skins | JazzCash, Easypaisa, Bank Transfer | Trusted by 10M+ Pakistani Players! Official Tencent Partner. Cheapest PUBG UC Karachi, Lahore, Islamabad.",
    keywords:
      "pubg uc pakistan, buy pubg uc pakistan, pubg uc pk, cheapest pubg uc pakistan, pubg uc jazzcash, pubg uc easypaisa, pubg uc karachi, pubg uc lahore, pubg uc islamabad, pubg uc rawalpindi, pubg uc faisalabad, pubg uc multan, pubg uc peshawar, pubg top up pakistan, pubg recharge pakistan, midasbuy pakistan, pubg uc rs 83, pubg uc pkr, pubg royal pass pakistan, pubg glacier m416 pakistan, pubg uc instant pakistan, pubg uc 2026 pakistan, safe pubg uc pakistan, trusted pubg uc pakistan, pubg uc bank transfer pakistan, pubg uc discount pakistan, pubg uc sale pakistan, pubg uc offer pakistan, how to buy pubg uc pakistan, best pubg uc website pakistan, pubg 60 uc pakistan, pubg 325 uc pakistan, pubg 660 uc pakistan, pubg 1800 uc pakistan, pubg uc urdu, pubg mobile pakistan, pubg esports pakistan, middasbuy pakistan",
    currency: "PKR",
    language: "ur-PK",
    locale: "ur_PK",
    hreflang: "ur-pk",
  },
  IN: {
    title: "Buy PUBG UC India 2026 - Cheapest UC | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇮🇳 #1 PUBG UC Store India 2026! Buy PUBG Mobile UC from ₹83 | 60% OFF + 30% VIP Bonus | Instant 2-5 Min Delivery | Royal Pass, Glacier M416, AWM Skins | UPI, PhonePe, Paytm, GPay | Trusted by 10M+ Indian Players! Official Tencent Partner. Cheapest PUBG UC Delhi, Mumbai, Bangalore.",
    keywords:
      "pubg uc india, buy pubg uc india, pubg uc inr, cheapest pubg uc india, pubg uc upi, pubg uc paytm, pubg uc phonepe, pubg uc gpay, pubg uc delhi, pubg uc mumbai, pubg uc bangalore, pubg uc hyderabad, pubg uc chennai, pubg uc kolkata, pubg top up india, pubg recharge india, midasbuy india, pubg uc ₹83, bgmi uc india, pubg royal pass india, pubg glacier m416 india, pubg uc instant india, pubg uc 2026 india, safe pubg uc india, trusted pubg uc india, pubg uc discount india, pubg uc sale india, pubg uc offer india, how to buy pubg uc india, best pubg uc website india, pubg 60 uc india, pubg 325 uc india, pubg mobile india, pubg esports india, middasbuy india, pubg uc hindi",
    currency: "INR",
    language: "hi-IN",
    locale: "hi_IN",
    hreflang: "hi-in",
  },
  BD: {
    title: "Buy PUBG UC Bangladesh 2026 - Cheapest UC BDT | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇧🇩 #1 PUBG UC Store Bangladesh 2026! Buy PUBG Mobile UC at cheapest price | 60% OFF + Bonus UC | Instant 2-5 Min Delivery | Royal Pass, Skins | bKash, Nagad, Rocket | Trusted by millions! Official Tencent Partner.",
    keywords:
      "pubg uc bangladesh, buy pubg uc bangladesh, pubg uc bdt, cheapest pubg uc bangladesh, pubg uc bkash, pubg uc nagad, pubg uc rocket, pubg uc dhaka, pubg top up bangladesh, pubg recharge bangladesh, midasbuy bangladesh, pubg royal pass bangladesh, pubg uc instant bangladesh, pubg uc 2026 bangladesh, safe pubg uc bangladesh, pubg mobile bangladesh, middasbuy bangladesh",
    currency: "BDT",
    language: "bn-BD",
    locale: "bn_BD",
    hreflang: "bn-bd",
  },
  NP: {
    title: "Buy PUBG UC Nepal 2026 - Cheapest UC NPR | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇳🇵 #1 PUBG UC Store Nepal 2026! Buy PUBG Mobile UC at cheapest price | 60% OFF + Bonus UC | Instant Delivery | eSewa, Khalti | Trusted by Nepali gamers! Official Tencent Partner.",
    keywords:
      "pubg uc nepal, buy pubg uc nepal, pubg uc npr, cheapest pubg uc nepal, pubg uc esewa, pubg uc khalti, pubg uc kathmandu, pubg top up nepal, pubg recharge nepal, midasbuy nepal, pubg royal pass nepal, pubg uc instant nepal, pubg uc 2026 nepal, safe pubg uc nepal, pubg mobile nepal, middasbuy nepal",
    currency: "NPR",
    language: "ne-NP",
    locale: "ne_NP",
    hreflang: "ne-np",
  },
  LK: {
    title: "Buy PUBG UC Sri Lanka 2026 - Cheapest UC LKR | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇱🇰 #1 PUBG UC Store Sri Lanka 2026! Buy PUBG Mobile UC at cheapest price | 60% OFF + Bonus UC | Instant Delivery | Trusted by Sri Lankan gamers! Official Tencent Partner.",
    keywords:
      "pubg uc sri lanka, buy pubg uc sri lanka, pubg uc lkr, cheapest pubg uc sri lanka, pubg top up sri lanka, pubg recharge sri lanka, midasbuy sri lanka, pubg royal pass sri lanka, pubg uc colombo, pubg mobile sri lanka, middasbuy sri lanka",
    currency: "LKR",
    language: "si-LK",
    locale: "si_LK",
    hreflang: "si-lk",
  },

  // North American Countries
  US: {
    title: "Buy PUBG UC USA 2026 - Cheapest UC USD | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇺🇸 #1 PUBG UC Store USA 2026! Buy PUBG Mobile UC from $0.99 | 60% OFF + 30% VIP Bonus | Instant 2-5 Min Delivery | Royal Pass, Glacier M416, AWM Skins | Visa, MasterCard, PayPal | Trusted by 5M+ American Players! Official Tencent Partner. Cheapest PUBG UC New York, LA, Texas, Florida.",
    keywords:
      "pubg uc usa, buy pubg uc usa, pubg uc usd, cheapest pubg uc usa, pubg uc paypal, pubg uc visa, pubg uc mastercard, pubg uc new york, pubg uc los angeles, pubg uc texas, pubg uc california, pubg uc florida, pubg top up usa, pubg recharge usa, midasbuy usa, pubg royal pass usa, pubg glacier m416 usa, pubg uc instant usa, pubg uc 2026 usa, safe pubg uc usa, pubg mobile usa, pubg esports usa, middasbuy usa, pubg uc america, pubg uc united states",
    currency: "USD",
    language: "en-US",
    locale: "en_US",
    hreflang: "en-us",
  },
  CA: {
    title: "Buy PUBG UC Canada 2026 - Cheapest UC CAD | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇨🇦 #1 PUBG UC Store Canada 2026! Buy PUBG Mobile UC at cheapest price | 60% OFF + Bonus UC | Instant Delivery | Visa, MasterCard | Trusted by Canadian gamers! Official Tencent Partner.",
    keywords:
      "pubg uc canada, buy pubg uc canada, pubg uc cad, cheapest pubg uc canada, pubg top up canada, pubg recharge canada, midasbuy canada, pubg royal pass canada, pubg uc toronto, pubg uc vancouver, pubg mobile canada, middasbuy canada",
    currency: "CAD",
    language: "en-CA",
    locale: "en_CA",
    hreflang: "en-ca",
  },

  // European Countries
  GB: {
    title: "Buy PUBG UC UK 2026 - Cheapest UC GBP | 60% OFF Instant Delivery | Midasbuy Official",
    description:
      "🇬🇧 #1 PUBG UC Store UK 2026! Buy PUBG Mobile UC at cheapest price | 60% OFF + Bonus UC | Instant Delivery | Visa, MasterCard, PayPal | Trusted by British gamers! Official Tencent Partner.",
    keywords:
      "pubg uc uk, buy pubg uc uk, pubg uc gbp, cheapest pubg uc uk, pubg uc britain, pubg uc england, pubg uc london, pubg top up uk, pubg recharge uk, midasbuy uk, pubg royal pass uk, pubg mobile uk, middasbuy uk, pubg uc united kingdom",
    currency: "GBP",
    language: "en-GB",
    locale: "en_GB",
    hreflang: "en-gb",
  },
  DE: {
    title: "PUBG UC Deutschland 2026 kaufen - Günstigste UC EUR | 60% Rabatt | Midasbuy Official",
    description:
      "🇩🇪 #1 PUBG UC Store Deutschland 2026! PUBG Mobile UC zum günstigsten Preis kaufen | 60% Rabatt + Bonus UC | Sofortige Lieferung | Vertrauenswürdig! Official Tencent Partner.",
    keywords:
      "pubg uc deutschland, pubg uc kaufen, pubg uc germany, pubg uc eur, günstigste pubg uc, pubg top up deutschland, pubg aufladen, midasbuy deutschland, pubg royal pass germany, pubg uc berlin, pubg uc münchen, pubg mobile germany, middasbuy deutschland",
    currency: "EUR",
    language: "de-DE",
    locale: "de_DE",
    hreflang: "de-de",
  },
  FR: {
    title: "Acheter PUBG UC France 2026 - UC Pas Cher EUR | 60% Réduction | Midasbuy Official",
    description:
      "🇫🇷 #1 PUBG UC Store France 2026! Achetez PUBG Mobile UC au meilleur prix | 60% Réduction + Bonus UC | Livraison instantanée | De confiance! Official Tencent Partner.",
    keywords:
      "pubg uc france, acheter pubg uc, pubg uc eur, pubg uc pas cher, pubg top up france, pubg recharge france, midasbuy france, pubg royal pass france, pubg uc paris, pubg mobile france, middasbuy france",
    currency: "EUR",
    language: "fr-FR",
    locale: "fr_FR",
    hreflang: "fr-fr",
  },
  ES: {
    title: "Comprar PUBG UC España 2026 - UC Barato EUR | 60% Descuento | Midasbuy Official",
    description:
      "🇪🇸 #1 PUBG UC Store España 2026! Compra PUBG Mobile UC al mejor precio | 60% Descuento + Bonus UC | Entrega instantánea | De confianza! Official Tencent Partner.",
    keywords:
      "pubg uc españa, comprar pubg uc, pubg uc spain, pubg uc eur, pubg uc barato, pubg top up españa, pubg recarga españa, midasbuy españa, pubg royal pass españa, pubg uc madrid, pubg uc barcelona, pubg mobile españa, middasbuy españa",
    currency: "EUR",
    language: "es-ES",
    locale: "es_ES",
    hreflang: "es-es",
  },
  IT: {
    title: "Comprare PUBG UC Italia 2026 - UC Economico EUR | 60% Sconto | Midasbuy Official",
    description:
      "🇮🇹 #1 PUBG UC Store Italia 2026! Acquista PUBG Mobile UC al miglior prezzo | 60% Sconto + Bonus UC | Consegna istantanea | Affidabile! Official Tencent Partner.",
    keywords:
      "pubg uc italia, comprare pubg uc, pubg uc italy, pubg uc eur, pubg uc economico, pubg top up italia, pubg ricarica italia, midasbuy italia, pubg royal pass italia, pubg uc roma, pubg uc milano, pubg mobile italia, middasbuy italia",
    currency: "EUR",
    language: "it-IT",
    locale: "it_IT",
    hreflang: "it-it",
  },
  NL: {
    title: "PUBG Mobile UC Netherlands | Official 5% Bonus | Midasbuy",
    description:
      "Koop PUBG Mobile UC in Nederland met euro betalingen. Directe levering, scherpe prijzen en betrouwbare service voor Nederlandse gamers.",
    keywords: "PUBG Mobile UC Nederland, Midasbuy, UC Netherlands, PUBG opladen, gaming Nederland",
    currency: "EUR",
    language: "nl-NL",
    locale: "nl_NL",
    hreflang: "nl-nl",
  },

  // Other European Countries
  SE: {
    title: "PUBG Mobile UC Sweden | Official 5% Bonus | Midasbuy",
    description:
      "Purchase PUBG Mobile UC in Sweden with SEK payments. Fast delivery, bonus rewards, and trusted gaming service for Swedish players.",
    keywords: "PUBG Mobile UC Sweden, Midasbuy, UC Sverige, PUBG top up, gaming Sweden",
    currency: "SEK",
    language: "sv-SE",
    locale: "sv_SE",
    hreflang: "sv-se",
  },
  NO: {
    title: "PUBG Mobile UC Norway | Official 5% Bonus | Midasbuy",
    description:
      "Buy PUBG Mobile UC in Norway with NOK payments. Instant delivery, competitive pricing, and reliable service for Norwegian gaming community.",
    keywords: "PUBG Mobile UC Norway, Midasbuy, UC Norge, PUBG top up, gaming Norway",
    currency: "NOK",
    language: "no-NO",
    locale: "no_NO",
    hreflang: "no-no",
  },
  DK: {
    title: "PUBG Mobile UC Denmark | Official 5% Bonus | Midasbuy",
    description:
      "Purchase PUBG Mobile UC in Denmark with DKK payments. Quick delivery, affordable rates, and trusted gaming currency service for Danish players.",
    keywords: "PUBG Mobile UC Denmark, Midasbuy, UC Danmark, PUBG top up, gaming Denmark",
    currency: "DKK",
    language: "da-DK",
    locale: "da_DK",
    hreflang: "da-dk",
  },
  FI: {
    title: "PUBG Mobile UC Finland | Official 5% Bonus | Midasbuy",
    description:
      "Buy PUBG Mobile UC in Finland with euro payments. Fast delivery, bonus UC, and reliable gaming service for Finnish esports enthusiasts.",
    keywords: "PUBG Mobile UC Finland, Midasbuy, UC Suomi, PUBG top up, gaming Finland",
    currency: "EUR",
    language: "fi-FI",
    locale: "fi_FI",
    hreflang: "fi-fi",
  },
  PL: {
    title: "PUBG Mobile UC Poland | Official 5% Bonus | Midasbuy",
    description:
      "Purchase PUBG Mobile UC in Poland with PLN payments. Instant delivery, competitive prices, and trusted service for Polish gaming community.",
    keywords: "PUBG Mobile UC Poland, Midasbuy, UC Polska, PUBG top up, gaming Poland",
    currency: "PLN",
    language: "pl-PL",
    locale: "pl_PL",
    hreflang: "pl-pl",
  },
  CZ: {
    title: "PUBG Mobile UC Czech Republic | Official 5% Bonus | Midasbuy",
    description:
      "Purchase PUBG Mobile UC in Czech Republic with CZK payments. Fast delivery, competitive prices, and reliable gaming service for Czech players.",
    keywords: "PUBG Mobile UC Czech Republic, Midasbuy, UC Česká, PUBG top up, gaming Czech",
    currency: "CZK",
    language: "cs-CZ",
    locale: "cs_CZ",
    hreflang: "cs-cz",
  },
  HU: {
    title: "PUBG Mobile UC Hungary | Official 5% Bonus | Midasbuy",
    description:
      "Buy PUBG Mobile UC in Hungary with HUF payments. Quick delivery, affordable pricing, and trusted service for Hungarian gaming community.",
    keywords: "PUBG Mobile UC Hungary, Midasbuy, UC Magyarország, PUBG top up, gaming Hungary",
    currency: "HUF",
    language: "hu-HU",
    locale: "hu_HU",
    hreflang: "hu-hu",
  },
  RO: {
    title: "PUBG Mobile UC Romania | Official 5% Bonus | Midasbuy",
    description:
      "Purchase PUBG Mobile UC in Romania with RON payments. Instant delivery, competitive rates, and reliable gaming service for Romanian players.",
    keywords: "PUBG Mobile UC Romania, Midasbuy, UC România, PUBG top up, gaming Romania",
    currency: "RON",
    language: "ro-RO",
    locale: "ro_RO",
    hreflang: "ro-ro",
  },
  BG: {
    title: "PUBG Mobile UC Bulgaria | Official 5% Bonus | Midasbuy",
    description:
      "Buy PUBG Mobile UC in Bulgaria with BGN payments. Fast delivery, bonus rewards, and trusted gaming service for Bulgarian players and esports enthusiasts.",
    keywords: "PUBG Mobile UC Bulgaria, Midasbuy, UC България, PUBG top up, gaming Bulgaria",
    currency: "BGN",
    language: "bg-BG",
    locale: "bg_BG",
    hreflang: "bg-bg",
  },

  // Middle Eastern Countries
  TR: {
    title: "PUBG Mobile UC Turkey | Official 5% Bonus | Midasbuy",
    description:
      "PUBG Mobile UC satın alın Türkiye'de. TL ile ödeme, hızlı teslimat ve güvenilir hizmet. Türk oyuncular için en iyi UC satış platformu.",
    keywords: "PUBG Mobile UC Türkiye, Midasbuy, UC Turkey, PUBG şarj, gaming Türkiye",
    currency: "TRY",
    language: "tr-TR",
    locale: "tr_TR",
    hreflang: "tr-tr",
  },
  SA: {
    title: "PUBG Mobile UC Saudi Arabia | Official Recharge Store | Midasbuy",
    description:
      "متجر الشحن الرسمي لعبة ببجي موبايل في السعودية. منصة موثوقة مع بيئة شحن متوافقة، مكافآت حصرية، توصيل فوري، وأسعار معقولة. دعم للاعبين السعوديين مع خدمة عملاء متعددة اللغات.",
    keywords:
      "PUBG Mobile UC السعودية, Midasbuy, متجر الشحن الرسمي, UC Saudi Arabia, PUBG شحن, مكافآت حصرية, Player ID, ببجي موبايل, gaming السعودية",
    currency: "SAR",
    language: "ar-SA",
    locale: "ar_SA",
    hreflang: "ar-sa",
  },
  AE: {
    title: "PUBG Mobile UC UAE | Official 5% Bonus | Midasbuy",
    description:
      "شراء UC لعبة ببجي موبايل في الإمارات. دفع بالدرهم الإماراتي، توصيل فوري، وخدمة موثوقة للاعبين الإماراتيين.",
    keywords: "PUBG Mobile UC الإمارات, Midasbuy, UC UAE, PUBG شحن, gaming الإمارات",
    currency: "AED",
    language: "ar-AE",
    locale: "ar_AE",
    hreflang: "ar-ae",
  },
  EG: {
    title: "PUBG Mobile UC Egypt | Official 5% Bonus | Midasbuy",
    description: "شراء UC لعبة ببجي موبايل في مصر. دفع بالجنيه المصري، توصيل فوري، وخدمة موثوقة للاعبين المصريين.",
    keywords: "PUBG Mobile UC مصر, Midasbuy, UC Egypt, PUBG شحن, gaming مصر",
    currency: "EGP",
    language: "ar-EG",
    locale: "ar_EG",
    hreflang: "ar-eg",
  },

  // Asia Pacific Countries
  AU: {
    title: "PUBG Mobile UC Australia | Official 5% Bonus | Midasbuy",
    description:
      "Buy PUBG Mobile UC in Australia with AUD payments. Fast delivery, bonus rewards, and trusted gaming service for Australian players and esports teams.",
    keywords: "PUBG Mobile UC Australia, Midasbuy, UC Australia, PUBG top up, gaming Australia",
    currency: "AUD",
    language: "en-AU",
    locale: "en_AU",
    hreflang: "en-au",
  },
  MY: {
    title: "PUBG Mobile UC Malaysia | Official 5% Bonus | Midasbuy",
    description:
      "Beli UC PUBG Mobile di Malaysia dengan pembayaran ringgit. Penghantaran pantas, harga berpatutan, dan perkhidmatan terpercaya untuk pemain Malaysia.",
    keywords: "PUBG Mobile UC Malaysia, Midasbuy, UC Malaysia, PUBG top up, gaming Malaysia",
    currency: "MYR",
    language: "ms-MY",
    locale: "ms_MY",
    hreflang: "ms-my",
  },
  ID: {
    title: "PUBG Mobile UC Indonesia | Official 5% Bonus | Midasbuy",
    description:
      "Beli UC PUBG Mobile di Indonesia dengan pembayaran rupiah. Pengiriman instan, harga terjangkau, dan layanan terpercaya untuk gamer Indonesia.",
    keywords: "PUBG Mobile UC Indonesia, Midasbuy, UC Indonesia, PUBG top up, gaming Indonesia",
    currency: "IDR",
    language: "id-ID",
    locale: "id_ID",
    hreflang: "id-id",
  },
  PH: {
    title: "PUBG Mobile UC Philippines | Official 5% Bonus | Midasbuy",
    description:
      "Buy PUBG Mobile UC in the Philippines with peso payments. Instant delivery, competitive rates, and reliable gaming service for Filipino players.",
    keywords: "PUBG Mobile UC Philippines, Midasbuy, UC Philippines, PUBG top up, gaming Philippines",
    currency: "PHP",
    language: "en-PH",
    locale: "en_PH",
    hreflang: "en-ph",
  },

  // Default/Global config (Enhanced with SEO Analysis)
  GLOBAL: {
    title: "Midasbuy - #1 PUBG UC Store Worldwide | Buy PUBG Mobile UC | Official Store",
    description:
      "World's #1 PUBG UC store! Buy PUBG Mobile UC at lowest prices with instant delivery worldwide. Official midasbuy trusted by millions of gamers globally. Best UC deals guaranteed!",
    keywords:
      "midasbuy official worldwide, buy PUBG UC global, PUBG Mobile UC cheapest, instant UC delivery worldwide, secure PUBG UC, best UC prices global, official UC store worldwide, PUBG UC top up global, mobile gaming worldwide, battle royale UC, gaming currency global, uc deals worldwide, pubg uc best price",
    currency: "USD",
    language: "en",
    locale: "en_US",
    hreflang: "en",
  },
};

// Get user's country code (this would be enhanced with actual geolocation)
export const getUserCountryCode = (): string => {
  // In a real implementation, you'd use a geolocation service
  // For now, we'll try to detect from browser language or use default
  const language = navigator.language;
  const countryMap: Record<string, string> = {
    // South Asian countries
    "ur-PK": "PK",
    ur: "PK",
    "hi-IN": "IN",
    hi: "IN",
    "bn-BD": "BD",
    bn: "BD",
    "ne-NP": "NP",
    ne: "NP",
    "si-LK": "LK",
    si: "LK",

    // North American countries
    "en-US": "US",
    "en-CA": "CA",

    // European countries
    "en-GB": "GB",
    "de-DE": "DE",
    de: "DE",
    "fr-FR": "FR",
    fr: "FR",
    "es-ES": "ES",
    es: "ES",
    "it-IT": "IT",
    it: "IT",
    "nl-NL": "NL",
    nl: "NL",
    "sv-SE": "SE",
    sv: "SE",
    "no-NO": "NO",
    no: "NO",
    "da-DK": "DK",
    da: "DK",
    "fi-FI": "FI",
    fi: "FI",
    "pl-PL": "PL",
    pl: "PL",
    "cs-CZ": "CZ",
    cs: "CZ",
    "hu-HU": "HU",
    hu: "HU",
    "ro-RO": "RO",
    ro: "RO",
    "bg-BG": "BG",
    bg: "BG",

    // Middle Eastern countries
    "tr-TR": "TR",
    tr: "TR",
    "ar-SA": "SA",
    "ar-AE": "AE",
    "ar-EG": "EG",

    // Asia Pacific countries
    "en-AU": "AU",
    "ms-MY": "MY",
    ms: "MY",
    "id-ID": "ID",
    id: "ID",
    "en-PH": "PH",
  };

  return countryMap[language] || "GLOBAL";
};

// Get country-specific SEO configuration
export const getCountrySEOConfig = (countryCode?: string): CountrySEOConfig => {
  const country = countryCode || getUserCountryCode();
  return COUNTRY_SEO_CONFIGS[country] || COUNTRY_SEO_CONFIGS.GLOBAL;
};

// Generate simplified hreflang tags (only for main markets to avoid spam)
export const getHreflangTags = (canonicalUrl: string) => {
  const baseUrl = "https://www.middasbuy.com";
  const mainMarkets = ["PK", "IN", "US", "GB", "DE", "FR", "TR", "SA", "AU"]; // Only major markets

  const hreflangTags = mainMarkets.map((country) => {
    const config = COUNTRY_SEO_CONFIGS[country];
    return {
      hreflang: config.hreflang,
      href: `${baseUrl}${canonicalUrl}`,
    };
  });

  // Add x-default for global
  hreflangTags.push({
    hreflang: "x-default",
    href: `${baseUrl}${canonicalUrl}`,
  });

  return hreflangTags;
};

// Simplified structured data
export const getInternationalStructuredData = (config: CountrySEOConfig, canonicalUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Midasbuy Official",
    url: `https://www.middasbuy.com${canonicalUrl}`,
    description: config.description,
    inLanguage: config.language,
    author: {
      "@type": "Organization",
      name: "Midasbuy Official",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.middasbuy.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
};

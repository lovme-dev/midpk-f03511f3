// Home Page SEO configurations for each country
// Separate from PUBG UC configs to have unique titles/descriptions for home pages
import { COUNTRY_DATA } from './gameSeoConfigs';

export interface HomePageSEOConfig {
  title: string;
  description: string;
  keywords: string;
}

// Country-specific Home Page SEO configurations
// Format: Gaming Shop {Country} - Buy Game Credits & Currency | Midasbuy Official Store
export const HOME_PAGE_SEO_CONFIGS: Record<string, HomePageSEOConfig> = {
  // South Asian Countries
  PK: {
    title: "Gaming Shop Pakistan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Pakistan's official Midasbuy Gaming Store. Buy PUBG UC, Free Fire Diamonds, Roblox Robux, Valorant Points with JazzCash & Easypaisa. Instant delivery!",
    keywords: "midasbuy pakistan, gaming shop pakistan, pubg uc pakistan, free fire pakistan, roblox pakistan, valorant pakistan",
  },
  IN: {
    title: "Gaming Shop India - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "India's official Midasbuy Gaming Store. Buy PUBG UC, BGMI UC, Free Fire Diamonds, Roblox Robux with UPI & Paytm. Instant delivery!",
    keywords: "midasbuy india, gaming shop india, pubg uc india, bgmi uc india, free fire india, roblox india",
  },
  BD: {
    title: "Gaming Shop Bangladesh - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Bangladesh's official Midasbuy Gaming Store. Buy PUBG UC, Free Fire Diamonds, Roblox Robux with bKash & Nagad. Instant delivery!",
    keywords: "midasbuy bangladesh, gaming shop bangladesh, pubg uc bangladesh, free fire bangladesh, roblox bangladesh",
  },
  NP: {
    title: "Gaming Shop Nepal - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Nepal's official Midasbuy Gaming Store. Buy PUBG UC, Free Fire Diamonds, Roblox Robux with eSewa & Khalti. Instant delivery!",
    keywords: "midasbuy nepal, gaming shop nepal, pubg uc nepal, free fire nepal, roblox nepal",
  },
  LK: {
    title: "Gaming Shop Sri Lanka - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Sri Lanka's official Midasbuy Gaming Store. Buy PUBG UC, Free Fire Diamonds, Roblox Robux, Valorant Points. Instant delivery!",
    keywords: "midasbuy sri lanka, gaming shop sri lanka, pubg uc sri lanka, free fire sri lanka, roblox sri lanka",
  },

  // North American Countries
  US: {
    title: "Gaming Shop USA - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "USA's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds with Visa & PayPal. Instant delivery!",
    keywords: "midasbuy usa, gaming shop usa, pubg uc usa, roblox usa, valorant usa, free fire usa",
  },
  CA: {
    title: "Gaming Shop Canada - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Canada's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant CAD delivery!",
    keywords: "midasbuy canada, gaming shop canada, pubg uc canada, roblox canada, valorant canada, free fire canada",
  },

  // European Countries
  GB: {
    title: "Gaming Shop United Kingdom - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "UK's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant GBP delivery!",
    keywords: "midasbuy uk, gaming shop uk, pubg uc uk, roblox uk, valorant uk, free fire uk",
  },
  DE: {
    title: "Gaming Shop Deutschland - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Deutschlands offizieller Midasbuy Gaming Store. PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds kaufen. Sofortige Lieferung!",
    keywords: "midasbuy deutschland, gaming shop germany, pubg uc germany, roblox germany, valorant germany",
  },
  FR: {
    title: "Gaming Shop France - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Le Gaming Store officiel Midasbuy France. Achetez PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Livraison instantanée!",
    keywords: "midasbuy france, gaming shop france, pubg uc france, roblox france, valorant france",
  },
  ES: {
    title: "Gaming Shop España - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "La tienda Gaming oficial Midasbuy España. Compra PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Entrega instantánea!",
    keywords: "midasbuy españa, gaming shop spain, pubg uc spain, roblox spain, valorant spain",
  },
  IT: {
    title: "Gaming Shop Italia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Il Gaming Store ufficiale Midasbuy Italia. Acquista PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Consegna istantanea!",
    keywords: "midasbuy italia, gaming shop italy, pubg uc italy, roblox italy, valorant italy",
  },
  NL: {
    title: "Gaming Shop Nederland - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Nederlands officiële Midasbuy Gaming Store. Koop PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Directe levering!",
    keywords: "midasbuy nederland, gaming shop netherlands, pubg uc netherlands, roblox netherlands, valorant netherlands",
  },
  SE: {
    title: "Gaming Shop Sweden - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Sweden's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant SEK delivery!",
    keywords: "midasbuy sweden, gaming shop sweden, pubg uc sweden, roblox sweden, valorant sweden",
  },
  NO: {
    title: "Gaming Shop Norway - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Norway's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant NOK delivery!",
    keywords: "midasbuy norway, gaming shop norway, pubg uc norway, roblox norway, valorant norway",
  },
  DK: {
    title: "Gaming Shop Denmark - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Denmark's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant DKK delivery!",
    keywords: "midasbuy denmark, gaming shop denmark, pubg uc denmark, roblox denmark, valorant denmark",
  },
  FI: {
    title: "Gaming Shop Finland - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Finland's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant EUR delivery!",
    keywords: "midasbuy finland, gaming shop finland, pubg uc finland, roblox finland, valorant finland",
  },
  PL: {
    title: "Gaming Shop Poland - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Poland's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant PLN delivery!",
    keywords: "midasbuy poland, gaming shop poland, pubg uc poland, roblox poland, valorant poland",
  },
  CZ: {
    title: "Gaming Shop Czech Republic - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Czech Republic's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points. Instant CZK delivery!",
    keywords: "midasbuy czech, gaming shop czech, pubg uc czech, roblox czech, valorant czech",
  },
  HU: {
    title: "Gaming Shop Hungary - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Hungary's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points. Instant HUF delivery!",
    keywords: "midasbuy hungary, gaming shop hungary, pubg uc hungary, roblox hungary, valorant hungary",
  },
  RO: {
    title: "Gaming Shop Romania - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Romania's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points. Instant RON delivery!",
    keywords: "midasbuy romania, gaming shop romania, pubg uc romania, roblox romania, valorant romania",
  },
  BG: {
    title: "Gaming Shop Bulgaria - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Bulgaria's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points. Instant BGN delivery!",
    keywords: "midasbuy bulgaria, gaming shop bulgaria, pubg uc bulgaria, roblox bulgaria, valorant bulgaria",
  },

  // Middle Eastern Countries
  TR: {
    title: "Gaming Shop Türkiye - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Türkiye'nin resmi Midasbuy Gaming Store. PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds satın alın. Anında teslimat!",
    keywords: "midasbuy türkiye, gaming shop turkey, pubg uc turkey, roblox turkey, valorant turkey",
  },
  SA: {
    title: "Gaming Shop Saudi Arabia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "متجر الألعاب الرسمي Midasbuy السعودية. اشتر PUBG UC، Roblox Robux، Valorant Points، Free Fire Diamonds. توصيل فوري!",
    keywords: "midasbuy السعودية, gaming shop saudi, pubg uc saudi, roblox saudi, valorant saudi",
  },
  AE: {
    title: "Gaming Shop UAE - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "UAE's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant AED delivery!",
    keywords: "midasbuy uae, gaming shop uae, pubg uc uae, roblox uae, valorant uae, dubai gaming",
  },
  EG: {
    title: "Gaming Shop Egypt - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "متجر الألعاب الرسمي Midasbuy مصر. اشتر PUBG UC، Roblox Robux، Valorant Points، Free Fire Diamonds. توصيل فوري!",
    keywords: "midasbuy مصر, gaming shop egypt, pubg uc egypt, roblox egypt, valorant egypt",
  },
  QA: {
    title: "Gaming Shop Qatar - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Qatar's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant QAR delivery!",
    keywords: "midasbuy qatar, gaming shop qatar, pubg uc qatar, roblox qatar, valorant qatar",
  },
  KW: {
    title: "Gaming Shop Kuwait - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Kuwait's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant KWD delivery!",
    keywords: "midasbuy kuwait, gaming shop kuwait, pubg uc kuwait, roblox kuwait, valorant kuwait",
  },
  OM: {
    title: "Gaming Shop Oman - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Oman's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant OMR delivery!",
    keywords: "midasbuy oman, gaming shop oman, pubg uc oman, roblox oman, valorant oman",
  },
  BH: {
    title: "Gaming Shop Bahrain - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Bahrain's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant BHD delivery!",
    keywords: "midasbuy bahrain, gaming shop bahrain, pubg uc bahrain, roblox bahrain, valorant bahrain",
  },

  // Asia Pacific Countries
  AU: {
    title: "Gaming Shop Australia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Australia's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant AUD delivery!",
    keywords: "midasbuy australia, gaming shop australia, pubg uc australia, roblox australia, valorant australia",
  },
  MY: {
    title: "Gaming Shop Malaysia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Malaysia's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant MYR delivery!",
    keywords: "midasbuy malaysia, gaming shop malaysia, pubg uc malaysia, roblox malaysia, valorant malaysia",
  },
  SG: {
    title: "Gaming Shop Singapore - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Singapore's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant SGD delivery!",
    keywords: "midasbuy singapore, gaming shop singapore, pubg uc singapore, roblox singapore, valorant singapore",
  },
  ID: {
    title: "Gaming Shop Indonesia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Toko Gaming resmi Midasbuy Indonesia. Beli PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Pengiriman instan!",
    keywords: "midasbuy indonesia, gaming shop indonesia, pubg uc indonesia, roblox indonesia, valorant indonesia",
  },
  TH: {
    title: "Gaming Shop Thailand - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Thailand's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant THB delivery!",
    keywords: "midasbuy thailand, gaming shop thailand, pubg uc thailand, roblox thailand, valorant thailand",
  },
  PH: {
    title: "Gaming Shop Philippines - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Philippines' official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant PHP delivery!",
    keywords: "midasbuy philippines, gaming shop philippines, pubg uc philippines, roblox philippines, valorant philippines",
  },
  VN: {
    title: "Gaming Shop Vietnam - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Cửa hàng Gaming chính thức Midasbuy Vietnam. Mua PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Giao hàng tức thì!",
    keywords: "midasbuy vietnam, gaming shop vietnam, pubg uc vietnam, roblox vietnam, valorant vietnam",
  },
  JP: {
    title: "Gaming Shop Japan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "日本の公式Midasbuy Gaming Store。PUBG UC、Roblox Robux、Valorant Points、Free Fire Diamondsを購入。即時配信!",
    keywords: "midasbuy japan, gaming shop japan, pubg uc japan, roblox japan, valorant japan",
  },
  KR: {
    title: "Gaming Shop South Korea - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "한국 공식 Midasbuy Gaming Store. PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds 구매. 즉시 배송!",
    keywords: "midasbuy korea, gaming shop korea, pubg uc korea, roblox korea, valorant korea",
  },
  NZ: {
    title: "Gaming Shop New Zealand - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "New Zealand's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points. Instant NZD delivery!",
    keywords: "midasbuy new zealand, gaming shop nz, pubg uc nz, roblox nz, valorant nz",
  },

  // Latin American Countries
  BR: {
    title: "Gaming Shop Brasil - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Loja Gaming oficial Midasbuy Brasil. Compre PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Entrega instantânea!",
    keywords: "midasbuy brasil, gaming shop brazil, pubg uc brazil, roblox brazil, free fire brazil",
  },
  MX: {
    title: "Gaming Shop México - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy México. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Entrega instantánea!",
    keywords: "midasbuy méxico, gaming shop mexico, pubg uc mexico, roblox mexico, free fire mexico",
  },
  AR: {
    title: "Gaming Shop Argentina - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Argentina. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Entrega instantánea!",
    keywords: "midasbuy argentina, gaming shop argentina, pubg uc argentina, roblox argentina, free fire argentina",
  },
  CL: {
    title: "Gaming Shop Chile - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Chile. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Entrega instantánea!",
    keywords: "midasbuy chile, gaming shop chile, pubg uc chile, roblox chile, free fire chile",
  },
  CO: {
    title: "Gaming Shop Colombia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Colombia. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Entrega instantánea!",
    keywords: "midasbuy colombia, gaming shop colombia, pubg uc colombia, roblox colombia, free fire colombia",
  },
  PE: {
    title: "Gaming Shop Perú - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Perú. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Entrega instantánea!",
    keywords: "midasbuy peru, gaming shop peru, pubg uc peru, roblox peru, free fire peru",
  },

  // African Countries
  ZA: {
    title: "Gaming Shop South Africa - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "South Africa's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant ZAR delivery!",
    keywords: "midasbuy south africa, gaming shop south africa, pubg uc south africa, roblox south africa",
  },
  NG: {
    title: "Gaming Shop Nigeria - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Nigeria's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant NGN delivery!",
    keywords: "midasbuy nigeria, gaming shop nigeria, pubg uc nigeria, roblox nigeria, free fire nigeria",
  },
  KE: {
    title: "Gaming Shop Kenya - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Kenya's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant KES delivery!",
    keywords: "midasbuy kenya, gaming shop kenya, pubg uc kenya, roblox kenya, free fire kenya",
  },
  MA: {
    title: "Gaming Shop Morocco - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Morocco's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant MAD delivery!",
    keywords: "midasbuy morocco, gaming shop morocco, pubg uc morocco, roblox morocco, free fire morocco",
  },

  // CIS Countries
  RU: {
    title: "Gaming Shop Russia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Официальный Midasbuy Gaming Store России. Покупайте PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Мгновенная доставка!",
    keywords: "midasbuy russia, gaming shop russia, pubg uc russia, roblox russia, valorant russia",
  },
  UA: {
    title: "Gaming Shop Ukraine - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Ukraine's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant UAH delivery!",
    keywords: "midasbuy ukraine, gaming shop ukraine, pubg uc ukraine, roblox ukraine, valorant ukraine",
  },
  KZ: {
    title: "Gaming Shop Kazakhstan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Kazakhstan's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant KZT delivery!",
    keywords: "midasbuy kazakhstan, gaming shop kazakhstan, pubg uc kazakhstan, roblox kazakhstan, valorant kazakhstan",
  },

  // Other Countries
  IL: {
    title: "Gaming Shop Israel - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Israel's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant ILS delivery!",
    keywords: "midasbuy israel, gaming shop israel, pubg uc israel, roblox israel, valorant israel",
  },
  JO: {
    title: "Gaming Shop Jordan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Jordan's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant JOD delivery!",
    keywords: "midasbuy jordan, gaming shop jordan, pubg uc jordan, roblox jordan, valorant jordan",
  },
  IQ: {
    title: "Gaming Shop Iraq - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Iraq's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant IQD delivery!",
    keywords: "midasbuy iraq, gaming shop iraq, pubg uc iraq, roblox iraq, valorant iraq",
  },
  AT: {
    title: "Gaming Shop Austria - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Austria's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant EUR delivery!",
    keywords: "midasbuy austria, gaming shop austria, pubg uc austria, roblox austria, valorant austria",
  },
  CH: {
    title: "Gaming Shop Switzerland - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Switzerland's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant CHF delivery!",
    keywords: "midasbuy switzerland, gaming shop switzerland, pubg uc switzerland, roblox switzerland, valorant switzerland",
  },
  BE: {
    title: "Gaming Shop Belgium - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Belgium's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant EUR delivery!",
    keywords: "midasbuy belgium, gaming shop belgium, pubg uc belgium, roblox belgium, valorant belgium",
  },
  PT: {
    title: "Gaming Shop Portugal - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Portugal's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant EUR delivery!",
    keywords: "midasbuy portugal, gaming shop portugal, pubg uc portugal, roblox portugal, valorant portugal",
  },
  GR: {
    title: "Gaming Shop Greece - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Greece's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant EUR delivery!",
    keywords: "midasbuy greece, gaming shop greece, pubg uc greece, roblox greece, valorant greece",
  },
  IE: {
    title: "Gaming Shop Ireland - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Ireland's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant EUR delivery!",
    keywords: "midasbuy ireland, gaming shop ireland, pubg uc ireland, roblox ireland, valorant ireland",
  },
  HK: {
    title: "Gaming Shop Hong Kong - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Hong Kong's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Honor of Kings. Instant HKD delivery!",
    keywords: "midasbuy hong kong, gaming shop hong kong, pubg uc hong kong, roblox hong kong, valorant hong kong",
  },
  TW: {
    title: "Gaming Shop Taiwan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Taiwan's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Honor of Kings. Instant TWD delivery!",
    keywords: "midasbuy taiwan, gaming shop taiwan, pubg uc taiwan, roblox taiwan, valorant taiwan",
  },
  MM: {
    title: "Gaming Shop Myanmar - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Myanmar's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant MMK delivery!",
    keywords: "midasbuy myanmar, gaming shop myanmar, pubg uc myanmar, roblox myanmar, free fire myanmar",
  },
  KH: {
    title: "Gaming Shop Cambodia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Cambodia's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant KHR delivery!",
    keywords: "midasbuy cambodia, gaming shop cambodia, pubg uc cambodia, roblox cambodia, free fire cambodia",
  },
  LA: {
    title: "Gaming Shop Laos - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Laos's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds. Instant LAK delivery!",
    keywords: "midasbuy laos, gaming shop laos, pubg uc laos, roblox laos, free fire laos",
  },

  // Central American Countries
  GT: {
    title: "Gaming Shop Guatemala - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Guatemala. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points con Visa y MasterCard. ¡Entrega instantánea!",
    keywords: "midasbuy guatemala, gaming shop guatemala, pubg uc guatemala, free fire guatemala, roblox guatemala, valorant guatemala",
  },
  HN: {
    title: "Gaming Shop Honduras - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Honduras. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea en HNL!",
    keywords: "midasbuy honduras, gaming shop honduras, pubg uc honduras, free fire honduras, roblox honduras",
  },
  SV: {
    title: "Gaming Shop El Salvador - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy El Salvador. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea en USD!",
    keywords: "midasbuy el salvador, gaming shop el salvador, pubg uc el salvador, free fire el salvador, roblox el salvador",
  },
  NI: {
    title: "Gaming Shop Nicaragua - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Nicaragua. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea en NIO!",
    keywords: "midasbuy nicaragua, gaming shop nicaragua, pubg uc nicaragua, free fire nicaragua, roblox nicaragua",
  },
  CR: {
    title: "Gaming Shop Costa Rica - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Costa Rica. Compra PUBG UC, Roblox Robux, Free Fire Diamonds con SINPE y Visa. ¡Entrega instantánea en CRC!",
    keywords: "midasbuy costa rica, gaming shop costa rica, pubg uc costa rica, free fire costa rica, roblox costa rica",
  },
  BZ: {
    title: "Gaming Shop Belize - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Belize's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Instant BZD delivery!",
    keywords: "midasbuy belize, gaming shop belize, pubg uc belize, free fire belize, roblox belize",
  },

  // Caribbean Countries
  JM: {
    title: "Gaming Shop Jamaica - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Jamaica's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Instant JMD delivery!",
    keywords: "midasbuy jamaica, gaming shop jamaica, pubg uc jamaica, free fire jamaica, roblox jamaica",
  },
  TT: {
    title: "Gaming Shop Trinidad & Tobago - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Trinidad & Tobago's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds. Instant TTD delivery!",
    keywords: "midasbuy trinidad, gaming shop trinidad, pubg uc trinidad, free fire trinidad, roblox trinidad",
  },
  BS: {
    title: "Gaming Shop Bahamas - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Bahamas' official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Instant BSD delivery!",
    keywords: "midasbuy bahamas, gaming shop bahamas, pubg uc bahamas, free fire bahamas, roblox bahamas",
  },
  DO: {
    title: "Gaming Shop República Dominicana - Compra Créditos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy República Dominicana. Compra PUBG UC, Roblox Robux, Free Fire Diamonds. ¡Entrega instantánea en DOP!",
    keywords: "midasbuy dominicana, gaming shop dominicana, pubg uc dominicana, free fire dominicana, roblox dominicana",
  },
  HT: {
    title: "Gaming Shop Haïti - Acheter Crédits de Jeux | Midasbuy Official Store",
    description: "Boutique Gaming officielle Midasbuy Haïti. Achetez PUBG UC, Roblox Robux, Free Fire Diamonds via MonCash. Livraison instantanée!",
    keywords: "midasbuy haiti, gaming shop haiti, pubg uc haiti, free fire haiti, roblox haiti",
  },

  // Additional Latin American Countries
  VE: {
    title: "Gaming Shop Venezuela - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Venezuela. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea!",
    keywords: "midasbuy venezuela, gaming shop venezuela, pubg uc venezuela, free fire venezuela, roblox venezuela",
  },
  UY: {
    title: "Gaming Shop Uruguay - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Uruguay. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea en UYU!",
    keywords: "midasbuy uruguay, gaming shop uruguay, pubg uc uruguay, free fire uruguay, roblox uruguay",
  },
  BO: {
    title: "Gaming Shop Bolivia - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Bolivia. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea en BOB!",
    keywords: "midasbuy bolivia, gaming shop bolivia, pubg uc bolivia, free fire bolivia, roblox bolivia",
  },
  EC: {
    title: "Gaming Shop Ecuador - Compra Créditos de Juegos | Midasbuy Official Store",
    description: "Tienda Gaming oficial Midasbuy Ecuador. Compra PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. ¡Entrega instantánea en USD!",
    keywords: "midasbuy ecuador, gaming shop ecuador, pubg uc ecuador, free fire ecuador, roblox ecuador",
  },

  // Additional Middle Eastern Countries
  LB: {
    title: "Gaming Shop Lebanon - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "متجر الألعاب الرسمي Midasbuy لبنان. اشتر PUBG UC، Roblox Robux، Free Fire Diamonds، Valorant Points. توصيل فوري!",
    keywords: "midasbuy lebanon, gaming shop lebanon, pubg uc lebanon, free fire lebanon, roblox lebanon, midasbuy لبنان",
  },

  // Additional African Countries
  GH: {
    title: "Gaming Shop Ghana - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Ghana's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds with MTN Mobile Money. Instant GHS delivery!",
    keywords: "midasbuy ghana, gaming shop ghana, pubg uc ghana, free fire ghana, roblox ghana",
  },
  DZ: {
    title: "Gaming Shop Algeria - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "متجر الألعاب الرسمي Midasbuy الجزائر. اشتر PUBG UC، Roblox Robux، Free Fire Diamonds. توصيل فوري بالدينار الجزائري!",
    keywords: "midasbuy algeria, gaming shop algeria, pubg uc algeria, free fire algeria, roblox algeria, midasbuy الجزائر",
  },
  TN: {
    title: "Gaming Shop Tunisia - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "متجر الألعاب الرسمي Midasbuy تونس. اشتر PUBG UC، Roblox Robux، Free Fire Diamonds. توصيل فوري بالدينار التونسي!",
    keywords: "midasbuy tunisia, gaming shop tunisia, pubg uc tunisia, free fire tunisia, roblox tunisia, midasbuy تونس",
  },

  // Additional South Asian Countries
  AF: {
    title: "Gaming Shop Afghanistan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Afghanistan's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds via M-Paisa. Instant AFN delivery!",
    keywords: "midasbuy afghanistan, gaming shop afghanistan, pubg uc afghanistan, free fire afghanistan, roblox afghanistan",
  },
  BT: {
    title: "Gaming Shop Bhutan - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Bhutan's official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points. Instant BTN delivery!",
    keywords: "midasbuy bhutan, gaming shop bhutan, pubg uc bhutan, free fire bhutan, roblox bhutan",
  },
  MV: {
    title: "Gaming Shop Maldives - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Maldives' official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds via BML. Instant MVR delivery!",
    keywords: "midasbuy maldives, gaming shop maldives, pubg uc maldives, free fire maldives, roblox maldives",
  },

  // Global Default
  GLOBAL: {
    title: "Gaming Shop - Buy Game Credits & Currency | Midasbuy Official Store",
    description: "Official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Valorant Points, Free Fire Diamonds worldwide. Instant delivery, secure payment!",
    keywords: "midasbuy, gaming store, pubg uc, roblox robux, valorant points, free fire diamonds",
  },
};

// Get Home Page SEO config for a country
export const getHomePageSEOConfig = (countryCode: string): HomePageSEOConfig => {
  // Generate the standardized title: "Tencent's official recharge, top-up and redeem {Country}| Midasbuy"
  const getStandardTitle = (countryName: string): string => {
    return `Tencent's official recharge, top-up and redeem ${countryName}| Midasbuy`;
  };

  // Return hardcoded config with new standardized title
  if (HOME_PAGE_SEO_CONFIGS[countryCode]) {
    const config = HOME_PAGE_SEO_CONFIGS[countryCode];
    // Get country name from COUNTRY_DATA or extract from old title
    const countryData = COUNTRY_DATA[countryCode];
    const countryName = countryData?.name || countryCode;
    return {
      ...config,
      title: getStandardTitle(countryName),
    };
  }
  
  // Dynamically generate unique SEO for countries not in the hardcoded list
  const countryData = COUNTRY_DATA[countryCode];
  if (countryData) {
    const payments = countryData.paymentMethods.slice(0, 3).join(', ');
    
    return {
      title: getStandardTitle(countryData.name),
      description: `${countryData.name}'s official Midasbuy Gaming Store. Buy PUBG UC, Roblox Robux, Free Fire Diamonds, Valorant Points with ${payments}. Instant ${countryData.currency} delivery!`,
      keywords: `midasbuy ${countryData.name.toLowerCase()}, gaming shop ${countryData.name.toLowerCase()}, pubg uc ${countryData.name.toLowerCase()}, roblox ${countryData.name.toLowerCase()}, free fire ${countryData.name.toLowerCase()}`,
    };
  }
  
  return HOME_PAGE_SEO_CONFIGS.GLOBAL;
};

// Get all supported country codes for Home Pages
export const getAllHomePageCountryCodes = (): string[] => {
  return Object.keys(HOME_PAGE_SEO_CONFIGS).filter(code => code !== "GLOBAL");
};

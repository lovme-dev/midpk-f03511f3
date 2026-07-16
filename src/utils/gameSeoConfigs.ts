// Dynamic SEO Configuration Generator for All Countries and Games
// This generates unique, country-specific SEO for each game page

import { SUPPORTED_COUNTRIES } from './countryRoutes';

// Complete country data with names, currencies, and payment methods - 176 Countries
export const COUNTRY_DATA: Record<string, {
  name: string;
  currency: string;
  currencySymbol: string;
  language: string;
  paymentMethods: string[];
  locale: string;
}> = {
  // South Asian Countries
  PK: { name: 'Pakistan', currency: 'PKR', currencySymbol: 'Rs.', language: 'ur-PK', paymentMethods: ['JazzCash', 'Easypaisa', 'Bank Transfer', 'Visa', 'MasterCard'], locale: 'ur_PK' },
  IN: { name: 'India', currency: 'INR', currencySymbol: '₹', language: 'hi-IN', paymentMethods: ['UPI', 'PhonePe', 'Paytm', 'GPay', 'Visa', 'MasterCard'], locale: 'hi_IN' },
  BD: { name: 'Bangladesh', currency: 'BDT', currencySymbol: '৳', language: 'bn-BD', paymentMethods: ['bKash', 'Nagad', 'Rocket', 'Bank Transfer'], locale: 'bn_BD' },
  NP: { name: 'Nepal', currency: 'NPR', currencySymbol: 'रू', language: 'ne-NP', paymentMethods: ['eSewa', 'Khalti', 'Bank Transfer'], locale: 'ne_NP' },
  LK: { name: 'Sri Lanka', currency: 'LKR', currencySymbol: 'Rs.', language: 'si-LK', paymentMethods: ['Bank Transfer', 'Visa', 'MasterCard'], locale: 'si_LK' },
  AF: { name: 'Afghanistan', currency: 'AFN', currencySymbol: '؋', language: 'ps-AF', paymentMethods: ['M-Paisa', 'Bank Transfer'], locale: 'ps_AF' },
  BT: { name: 'Bhutan', currency: 'BTN', currencySymbol: 'Nu.', language: 'dz-BT', paymentMethods: ['Bank Transfer', 'Visa'], locale: 'dz_BT' },
  MV: { name: 'Maldives', currency: 'MVR', currencySymbol: 'ރ.', language: 'dv-MV', paymentMethods: ['BML', 'Visa', 'MasterCard'], locale: 'dv_MV' },
  
  // North American Countries
  US: { name: 'United States', currency: 'USD', currencySymbol: '$', language: 'en-US', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Apple Pay'], locale: 'en_US' },
  CA: { name: 'Canada', currency: 'CAD', currencySymbol: 'C$', language: 'en-CA', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Interac'], locale: 'en_CA' },
  
  // Central American Countries
  MX: { name: 'Mexico', currency: 'MXN', currencySymbol: 'MX$', language: 'es-MX', paymentMethods: ['OXXO', 'SPEI', 'Visa', 'MasterCard'], locale: 'es_MX' },
  GT: { name: 'Guatemala', currency: 'GTQ', currencySymbol: 'Q', language: 'es-GT', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_GT' },
  HN: { name: 'Honduras', currency: 'HNL', currencySymbol: 'L', language: 'es-HN', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_HN' },
  SV: { name: 'El Salvador', currency: 'USD', currencySymbol: '$', language: 'es-SV', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_SV' },
  NI: { name: 'Nicaragua', currency: 'NIO', currencySymbol: 'C$', language: 'es-NI', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_NI' },
  CR: { name: 'Costa Rica', currency: 'CRC', currencySymbol: '₡', language: 'es-CR', paymentMethods: ['SINPE', 'Visa', 'MasterCard'], locale: 'es_CR' },
  PA: { name: 'Panama', currency: 'PAB', currencySymbol: 'B/.', language: 'es-PA', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_PA' },
  BZ: { name: 'Belize', currency: 'BZD', currencySymbol: 'BZ$', language: 'en-BZ', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_BZ' },
  
  // Caribbean Countries
  JM: { name: 'Jamaica', currency: 'JMD', currencySymbol: 'J$', language: 'en-JM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_JM' },
  TT: { name: 'Trinidad and Tobago', currency: 'TTD', currencySymbol: 'TT$', language: 'en-TT', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_TT' },
  BB: { name: 'Barbados', currency: 'BBD', currencySymbol: 'Bds$', language: 'en-BB', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_BB' },
  BS: { name: 'Bahamas', currency: 'BSD', currencySymbol: 'B$', language: 'en-BS', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_BS' },
  CU: { name: 'Cuba', currency: 'CUP', currencySymbol: '₱', language: 'es-CU', paymentMethods: ['Bank Transfer'], locale: 'es_CU' },
  DO: { name: 'Dominican Republic', currency: 'DOP', currencySymbol: 'RD$', language: 'es-DO', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_DO' },
  HT: { name: 'Haiti', currency: 'HTG', currencySymbol: 'G', language: 'fr-HT', paymentMethods: ['MonCash', 'Visa', 'Bank Transfer'], locale: 'fr_HT' },
  PR: { name: 'Puerto Rico', currency: 'USD', currencySymbol: '$', language: 'es-PR', paymentMethods: ['Visa', 'MasterCard', 'PayPal'], locale: 'es_PR' },
  
  // European Countries
  GB: { name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', language: 'en-GB', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Apple Pay'], locale: 'en_GB' },
  DE: { name: 'Germany', currency: 'EUR', currencySymbol: '€', language: 'de-DE', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'SEPA'], locale: 'de_DE' },
  FR: { name: 'France', currency: 'EUR', currencySymbol: '€', language: 'fr-FR', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Carte Bancaire'], locale: 'fr_FR' },
  ES: { name: 'Spain', currency: 'EUR', currencySymbol: '€', language: 'es-ES', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bizum'], locale: 'es_ES' },
  IT: { name: 'Italy', currency: 'EUR', currencySymbol: '€', language: 'it-IT', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'PostePay'], locale: 'it_IT' },
  NL: { name: 'Netherlands', currency: 'EUR', currencySymbol: '€', language: 'nl-NL', paymentMethods: ['iDEAL', 'Visa', 'MasterCard', 'PayPal'], locale: 'nl_NL' },
  SE: { name: 'Sweden', currency: 'SEK', currencySymbol: 'kr', language: 'sv-SE', paymentMethods: ['Swish', 'Visa', 'MasterCard', 'Klarna'], locale: 'sv_SE' },
  NO: { name: 'Norway', currency: 'NOK', currencySymbol: 'kr', language: 'no-NO', paymentMethods: ['Vipps', 'Visa', 'MasterCard', 'PayPal'], locale: 'no_NO' },
  DK: { name: 'Denmark', currency: 'DKK', currencySymbol: 'kr', language: 'da-DK', paymentMethods: ['MobilePay', 'Visa', 'MasterCard', 'PayPal'], locale: 'da_DK' },
  FI: { name: 'Finland', currency: 'EUR', currencySymbol: '€', language: 'fi-FI', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'fi_FI' },
  PL: { name: 'Poland', currency: 'PLN', currencySymbol: 'zł', language: 'pl-PL', paymentMethods: ['BLIK', 'Visa', 'MasterCard', 'PayPal'], locale: 'pl_PL' },
  CZ: { name: 'Czech Republic', currency: 'CZK', currencySymbol: 'Kč', language: 'cs-CZ', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'cs_CZ' },
  HU: { name: 'Hungary', currency: 'HUF', currencySymbol: 'Ft', language: 'hu-HU', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'hu_HU' },
  RO: { name: 'Romania', currency: 'RON', currencySymbol: 'lei', language: 'ro-RO', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'ro_RO' },
  BG: { name: 'Bulgaria', currency: 'BGN', currencySymbol: 'лв', language: 'bg-BG', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'bg_BG' },
  AT: { name: 'Austria', currency: 'EUR', currencySymbol: '€', language: 'de-AT', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'EPS'], locale: 'de_AT' },
  CH: { name: 'Switzerland', currency: 'CHF', currencySymbol: 'CHF', language: 'de-CH', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'PostFinance'], locale: 'de_CH' },
  BE: { name: 'Belgium', currency: 'EUR', currencySymbol: '€', language: 'nl-BE', paymentMethods: ['Bancontact', 'Visa', 'MasterCard', 'PayPal'], locale: 'nl_BE' },
  IE: { name: 'Ireland', currency: 'EUR', currencySymbol: '€', language: 'en-IE', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Apple Pay'], locale: 'en_IE' },
  PT: { name: 'Portugal', currency: 'EUR', currencySymbol: '€', language: 'pt-PT', paymentMethods: ['MB Way', 'Visa', 'MasterCard', 'PayPal'], locale: 'pt_PT' },
  GR: { name: 'Greece', currency: 'EUR', currencySymbol: '€', language: 'el-GR', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'el_GR' },
  HR: { name: 'Croatia', currency: 'EUR', currencySymbol: '€', language: 'hr-HR', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'hr_HR' },
  SI: { name: 'Slovenia', currency: 'EUR', currencySymbol: '€', language: 'sl-SI', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'sl_SI' },
  SK: { name: 'Slovakia', currency: 'EUR', currencySymbol: '€', language: 'sk-SK', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'sk_SK' },
  EE: { name: 'Estonia', currency: 'EUR', currencySymbol: '€', language: 'et-EE', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'et_EE' },
  LV: { name: 'Latvia', currency: 'EUR', currencySymbol: '€', language: 'lv-LV', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'lv_LV' },
  LT: { name: 'Lithuania', currency: 'EUR', currencySymbol: '€', language: 'lt-LT', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'lt_LT' },
  LU: { name: 'Luxembourg', currency: 'EUR', currencySymbol: '€', language: 'de-LU', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'de_LU' },
  MT: { name: 'Malta', currency: 'EUR', currencySymbol: '€', language: 'mt-MT', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'mt_MT' },
  CY: { name: 'Cyprus', currency: 'EUR', currencySymbol: '€', language: 'el-CY', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'el_CY' },
  IS: { name: 'Iceland', currency: 'ISK', currencySymbol: 'kr', language: 'is-IS', paymentMethods: ['Visa', 'MasterCard', 'PayPal'], locale: 'is_IS' },
  UA: { name: 'Ukraine', currency: 'UAH', currencySymbol: '₴', language: 'uk-UA', paymentMethods: ['PrivatBank', 'Visa', 'MasterCard'], locale: 'uk_UA' },
  RU: { name: 'Russia', currency: 'RUB', currencySymbol: '₽', language: 'ru-RU', paymentMethods: ['Mir', 'Yandex Pay', 'Bank Transfer'], locale: 'ru_RU' },
  BY: { name: 'Belarus', currency: 'BYN', currencySymbol: 'Br', language: 'be-BY', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'be_BY' },
  MD: { name: 'Moldova', currency: 'MDL', currencySymbol: 'L', language: 'ro-MD', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ro_MD' },
  RS: { name: 'Serbia', currency: 'RSD', currencySymbol: 'дин.', language: 'sr-RS', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'sr_RS' },
  BA: { name: 'Bosnia and Herzegovina', currency: 'BAM', currencySymbol: 'KM', language: 'bs-BA', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'bs_BA' },
  ME: { name: 'Montenegro', currency: 'EUR', currencySymbol: '€', language: 'sr-ME', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'sr_ME' },
  MK: { name: 'North Macedonia', currency: 'MKD', currencySymbol: 'ден', language: 'mk-MK', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'mk_MK' },
  AL: { name: 'Albania', currency: 'ALL', currencySymbol: 'L', language: 'sq-AL', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'sq_AL' },
  XK: { name: 'Kosovo', currency: 'EUR', currencySymbol: '€', language: 'sq-XK', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'sq_XK' },
  
  // Middle Eastern Countries
  TR: { name: 'Turkey', currency: 'TRY', currencySymbol: '₺', language: 'tr-TR', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'tr_TR' },
  SA: { name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'ر.س', language: 'ar-SA', paymentMethods: ['Mada', 'STC Pay', 'Visa', 'MasterCard'], locale: 'ar_SA' },
  AE: { name: 'UAE', currency: 'AED', currencySymbol: 'د.إ', language: 'ar-AE', paymentMethods: ['Visa', 'MasterCard', 'Apple Pay', 'Samsung Pay'], locale: 'ar_AE' },
  EG: { name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', language: 'ar-EG', paymentMethods: ['Fawry', 'Visa', 'MasterCard', 'Vodafone Cash'], locale: 'ar_EG' },
  JO: { name: 'Jordan', currency: 'JOD', currencySymbol: 'د.ا', language: 'ar-JO', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'ar_JO' },
  LB: { name: 'Lebanon', currency: 'LBP', currencySymbol: 'ل.ل', language: 'ar-LB', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Bank Transfer'], locale: 'ar_LB' },
  KW: { name: 'Kuwait', currency: 'KWD', currencySymbol: 'د.ك', language: 'ar-KW', paymentMethods: ['KNET', 'Visa', 'MasterCard', 'Apple Pay'], locale: 'ar_KW' },
  QA: { name: 'Qatar', currency: 'QAR', currencySymbol: 'ر.ق', language: 'ar-QA', paymentMethods: ['Visa', 'MasterCard', 'Apple Pay', 'Samsung Pay'], locale: 'ar_QA' },
  BH: { name: 'Bahrain', currency: 'BHD', currencySymbol: 'د.ب', language: 'ar-BH', paymentMethods: ['BenefitPay', 'Visa', 'MasterCard'], locale: 'ar_BH' },
  OM: { name: 'Oman', currency: 'OMR', currencySymbol: 'ر.ع', language: 'ar-OM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ar_OM' },
  IQ: { name: 'Iraq', currency: 'IQD', currencySymbol: 'ع.د', language: 'ar-IQ', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ar_IQ' },
  SY: { name: 'Syria', currency: 'SYP', currencySymbol: 'ل.س', language: 'ar-SY', paymentMethods: ['Bank Transfer'], locale: 'ar_SY' },
  YE: { name: 'Yemen', currency: 'YER', currencySymbol: '﷼', language: 'ar-YE', paymentMethods: ['Bank Transfer'], locale: 'ar_YE' },
  PS: { name: 'Palestine', currency: 'ILS', currencySymbol: '₪', language: 'ar-PS', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ar_PS' },
  IL: { name: 'Israel', currency: 'ILS', currencySymbol: '₪', language: 'he-IL', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Apple Pay'], locale: 'he_IL' },
  IR: { name: 'Iran', currency: 'IRR', currencySymbol: '﷼', language: 'fa-IR', paymentMethods: ['Bank Transfer', 'Shetab'], locale: 'fa_IR' },
  
  // Asia Pacific Countries
  AU: { name: 'Australia', currency: 'AUD', currencySymbol: 'A$', language: 'en-AU', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Apple Pay'], locale: 'en_AU' },
  NZ: { name: 'New Zealand', currency: 'NZD', currencySymbol: 'NZ$', language: 'en-NZ', paymentMethods: ['Visa', 'MasterCard', 'PayPal', 'Apple Pay'], locale: 'en_NZ' },
  MY: { name: 'Malaysia', currency: 'MYR', currencySymbol: 'RM', language: 'ms-MY', paymentMethods: ['Touch n Go', 'GrabPay', 'Boost', 'Visa', 'MasterCard'], locale: 'ms_MY' },
  ID: { name: 'Indonesia', currency: 'IDR', currencySymbol: 'Rp', language: 'id-ID', paymentMethods: ['GoPay', 'OVO', 'Dana', 'Bank Transfer'], locale: 'id_ID' },
  PH: { name: 'Philippines', currency: 'PHP', currencySymbol: '₱', language: 'en-PH', paymentMethods: ['GCash', 'PayMaya', 'Visa', 'MasterCard'], locale: 'en_PH' },
  SG: { name: 'Singapore', currency: 'SGD', currencySymbol: 'S$', language: 'en-SG', paymentMethods: ['PayNow', 'GrabPay', 'Visa', 'MasterCard'], locale: 'en_SG' },
  TH: { name: 'Thailand', currency: 'THB', currencySymbol: '฿', language: 'th-TH', paymentMethods: ['PromptPay', 'TrueMoney', 'Visa', 'MasterCard'], locale: 'th_TH' },
  VN: { name: 'Vietnam', currency: 'VND', currencySymbol: '₫', language: 'vi-VN', paymentMethods: ['MoMo', 'ZaloPay', 'Visa', 'MasterCard'], locale: 'vi_VN' },
  JP: { name: 'Japan', currency: 'JPY', currencySymbol: '¥', language: 'ja-JP', paymentMethods: ['Visa', 'MasterCard', 'JCB', 'PayPay'], locale: 'ja_JP' },
  KR: { name: 'South Korea', currency: 'KRW', currencySymbol: '₩', language: 'ko-KR', paymentMethods: ['KakaoPay', 'Naver Pay', 'Visa', 'MasterCard'], locale: 'ko_KR' },
  TW: { name: 'Taiwan', currency: 'TWD', currencySymbol: 'NT$', language: 'zh-TW', paymentMethods: ['Visa', 'MasterCard', 'JCB', 'LINE Pay'], locale: 'zh_TW' },
  HK: { name: 'Hong Kong', currency: 'HKD', currencySymbol: 'HK$', language: 'zh-HK', paymentMethods: ['AlipayHK', 'WeChat Pay', 'Visa', 'MasterCard'], locale: 'zh_HK' },
  CN: { name: 'China', currency: 'CNY', currencySymbol: '¥', language: 'zh-CN', paymentMethods: ['Alipay', 'WeChat Pay', 'UnionPay'], locale: 'zh_CN' },
  MO: { name: 'Macau', currency: 'MOP', currencySymbol: 'MOP$', language: 'zh-MO', paymentMethods: ['Alipay', 'WeChat Pay', 'Visa'], locale: 'zh_MO' },
  MM: { name: 'Myanmar', currency: 'MMK', currencySymbol: 'K', language: 'my-MM', paymentMethods: ['Wave Money', 'KBZ Pay', 'Bank Transfer'], locale: 'my_MM' },
  KH: { name: 'Cambodia', currency: 'KHR', currencySymbol: '៛', language: 'km-KH', paymentMethods: ['Wing', 'ABA', 'Visa'], locale: 'km_KH' },
  LA: { name: 'Laos', currency: 'LAK', currencySymbol: '₭', language: 'lo-LA', paymentMethods: ['BCEL', 'Bank Transfer'], locale: 'lo_LA' },
  BN: { name: 'Brunei', currency: 'BND', currencySymbol: 'B$', language: 'ms-BN', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ms_BN' },
  TL: { name: 'Timor-Leste', currency: 'USD', currencySymbol: '$', language: 'pt-TL', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'pt_TL' },
  MN: { name: 'Mongolia', currency: 'MNT', currencySymbol: '₮', language: 'mn-MN', paymentMethods: ['QPay', 'Bank Transfer'], locale: 'mn_MN' },
  KZ: { name: 'Kazakhstan', currency: 'KZT', currencySymbol: '₸', language: 'kk-KZ', paymentMethods: ['Kaspi', 'Visa', 'MasterCard'], locale: 'kk_KZ' },
  UZ: { name: 'Uzbekistan', currency: 'UZS', currencySymbol: 'so\'m', language: 'uz-UZ', paymentMethods: ['Payme', 'Click', 'Bank Transfer'], locale: 'uz_UZ' },
  TJ: { name: 'Tajikistan', currency: 'TJS', currencySymbol: 'ЅМ', language: 'tg-TJ', paymentMethods: ['Bank Transfer'], locale: 'tg_TJ' },
  KG: { name: 'Kyrgyzstan', currency: 'KGS', currencySymbol: 'с', language: 'ky-KG', paymentMethods: ['Bank Transfer'], locale: 'ky_KG' },
  TM: { name: 'Turkmenistan', currency: 'TMT', currencySymbol: 'm', language: 'tk-TM', paymentMethods: ['Bank Transfer'], locale: 'tk_TM' },
  AZ: { name: 'Azerbaijan', currency: 'AZN', currencySymbol: '₼', language: 'az-AZ', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'az_AZ' },
  GE: { name: 'Georgia', currency: 'GEL', currencySymbol: '₾', language: 'ka-GE', paymentMethods: ['TBC', 'BOG', 'Visa', 'MasterCard'], locale: 'ka_GE' },
  AM: { name: 'Armenia', currency: 'AMD', currencySymbol: '֏', language: 'hy-AM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'hy_AM' },
  
  // African Countries
  ZA: { name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', language: 'en-ZA', paymentMethods: ['Visa', 'MasterCard', 'SnapScan', 'Zapper'], locale: 'en_ZA' },
  NG: { name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', language: 'en-NG', paymentMethods: ['Flutterwave', 'Paystack', 'Bank Transfer'], locale: 'en_NG' },
  KE: { name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', language: 'en-KE', paymentMethods: ['M-Pesa', 'Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_KE' },
  GH: { name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', language: 'en-GH', paymentMethods: ['MTN Mobile Money', 'Visa', 'MasterCard'], locale: 'en_GH' },
  MA: { name: 'Morocco', currency: 'MAD', currencySymbol: 'د.م.', language: 'ar-MA', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ar_MA' },
  TN: { name: 'Tunisia', currency: 'TND', currencySymbol: 'د.ت', language: 'ar-TN', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ar_TN' },
  DZ: { name: 'Algeria', currency: 'DZD', currencySymbol: 'د.ج', language: 'ar-DZ', paymentMethods: ['CIB', 'Bank Transfer'], locale: 'ar_DZ' },
  LY: { name: 'Libya', currency: 'LYD', currencySymbol: 'ل.د', language: 'ar-LY', paymentMethods: ['Bank Transfer'], locale: 'ar_LY' },
  SD: { name: 'Sudan', currency: 'SDG', currencySymbol: 'ج.س.', language: 'ar-SD', paymentMethods: ['Bank Transfer'], locale: 'ar_SD' },
  ET: { name: 'Ethiopia', currency: 'ETB', currencySymbol: 'Br', language: 'am-ET', paymentMethods: ['Telebirr', 'Bank Transfer'], locale: 'am_ET' },
  TZ: { name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', language: 'sw-TZ', paymentMethods: ['M-Pesa', 'Tigo Pesa', 'Bank Transfer'], locale: 'sw_TZ' },
  UG: { name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', language: 'en-UG', paymentMethods: ['MTN Mobile Money', 'Airtel Money', 'Bank Transfer'], locale: 'en_UG' },
  RW: { name: 'Rwanda', currency: 'RWF', currencySymbol: 'FRw', language: 'rw-RW', paymentMethods: ['MTN Mobile Money', 'Bank Transfer'], locale: 'rw_RW' },
  ZM: { name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', language: 'en-ZM', paymentMethods: ['MTN Mobile Money', 'Bank Transfer'], locale: 'en_ZM' },
  ZW: { name: 'Zimbabwe', currency: 'ZWL', currencySymbol: 'Z$', language: 'en-ZW', paymentMethods: ['EcoCash', 'Bank Transfer'], locale: 'en_ZW' },
  BW: { name: 'Botswana', currency: 'BWP', currencySymbol: 'P', language: 'en-BW', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_BW' },
  NA: { name: 'Namibia', currency: 'NAD', currencySymbol: 'N$', language: 'en-NA', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_NA' },
  MZ: { name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT', language: 'pt-MZ', paymentMethods: ['M-Pesa', 'Bank Transfer'], locale: 'pt_MZ' },
  AO: { name: 'Angola', currency: 'AOA', currencySymbol: 'Kz', language: 'pt-AO', paymentMethods: ['Multicaixa', 'Bank Transfer'], locale: 'pt_AO' },
  SN: { name: 'Senegal', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-SN', paymentMethods: ['Orange Money', 'Wave', 'Bank Transfer'], locale: 'fr_SN' },
  CI: { name: 'Ivory Coast', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-CI', paymentMethods: ['Orange Money', 'MTN Mobile Money', 'Bank Transfer'], locale: 'fr_CI' },
  CM: { name: 'Cameroon', currency: 'XAF', currencySymbol: 'FCFA', language: 'fr-CM', paymentMethods: ['Orange Money', 'MTN Mobile Money', 'Bank Transfer'], locale: 'fr_CM' },
  MU: { name: 'Mauritius', currency: 'MUR', currencySymbol: '₨', language: 'en-MU', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_MU' },
  
  // Latin American Countries
  BR: { name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', language: 'pt-BR', paymentMethods: ['Pix', 'Boleto', 'Visa', 'MasterCard'], locale: 'pt_BR' },
  AR: { name: 'Argentina', currency: 'ARS', currencySymbol: 'AR$', language: 'es-AR', paymentMethods: ['Mercado Pago', 'Visa', 'MasterCard'], locale: 'es_AR' },
  CL: { name: 'Chile', currency: 'CLP', currencySymbol: 'CLP$', language: 'es-CL', paymentMethods: ['Webpay', 'Visa', 'MasterCard'], locale: 'es_CL' },
  CO: { name: 'Colombia', currency: 'COP', currencySymbol: 'COL$', language: 'es-CO', paymentMethods: ['PSE', 'Nequi', 'Visa', 'MasterCard'], locale: 'es_CO' },
  PE: { name: 'Peru', currency: 'PEN', currencySymbol: 'S/', language: 'es-PE', paymentMethods: ['Yape', 'Plin', 'Visa', 'MasterCard'], locale: 'es_PE' },
  VE: { name: 'Venezuela', currency: 'VES', currencySymbol: 'Bs.', language: 'es-VE', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_VE' },
  UY: { name: 'Uruguay', currency: 'UYU', currencySymbol: '$U', language: 'es-UY', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_UY' },
  PY: { name: 'Paraguay', currency: 'PYG', currencySymbol: '₲', language: 'es-PY', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_PY' },
  BO: { name: 'Bolivia', currency: 'BOB', currencySymbol: 'Bs.', language: 'es-BO', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_BO' },
  EC: { name: 'Ecuador', currency: 'USD', currencySymbol: '$', language: 'es-EC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'es_EC' },
  GY: { name: 'Guyana', currency: 'GYD', currencySymbol: 'G$', language: 'en-GY', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_GY' },
  SR: { name: 'Suriname', currency: 'SRD', currencySymbol: '$', language: 'nl-SR', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'nl_SR' },
  
  // Pacific Island Countries
  FJ: { name: 'Fiji', currency: 'FJD', currencySymbol: 'FJ$', language: 'en-FJ', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_FJ' },
  PG: { name: 'Papua New Guinea', currency: 'PGK', currencySymbol: 'K', language: 'en-PG', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_PG' },
  WS: { name: 'Samoa', currency: 'WST', currencySymbol: 'WS$', language: 'sm-WS', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'sm_WS' },
  TO: { name: 'Tonga', currency: 'TOP', currencySymbol: 'T$', language: 'to-TO', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'to_TO' },
  VU: { name: 'Vanuatu', currency: 'VUV', currencySymbol: 'VT', language: 'en-VU', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_VU' },
  NC: { name: 'New Caledonia', currency: 'XPF', currencySymbol: '₣', language: 'fr-NC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_NC' },
  PF: { name: 'French Polynesia', currency: 'XPF', currencySymbol: '₣', language: 'fr-PF', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_PF' },
  SB: { name: 'Solomon Islands', currency: 'SBD', currencySymbol: 'SI$', language: 'en-SB', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_SB' },
  GU: { name: 'Guam', currency: 'USD', currencySymbol: '$', language: 'en-GU', paymentMethods: ['Visa', 'MasterCard', 'PayPal'], locale: 'en_GU' },
  FM: { name: 'Micronesia', currency: 'USD', currencySymbol: '$', language: 'en-FM', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_FM' },
  MH: { name: 'Marshall Islands', currency: 'USD', currencySymbol: '$', language: 'en-MH', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_MH' },
  PW: { name: 'Palau', currency: 'USD', currencySymbol: '$', language: 'en-PW', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_PW' },
  KI: { name: 'Kiribati', currency: 'AUD', currencySymbol: 'A$', language: 'en-KI', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_KI' },
  TV: { name: 'Tuvalu', currency: 'AUD', currencySymbol: 'A$', language: 'en-TV', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_TV' },
  NR: { name: 'Nauru', currency: 'AUD', currencySymbol: 'A$', language: 'en-NR', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'en_NR' },

  // Additional African Countries
  ML: { name: 'Mali', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-ML', paymentMethods: ['Orange Money', 'Bank Transfer'], locale: 'fr_ML' },
  BF: { name: 'Burkina Faso', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-BF', paymentMethods: ['Orange Money', 'Bank Transfer'], locale: 'fr_BF' },
  NE: { name: 'Niger', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-NE', paymentMethods: ['Orange Money', 'Bank Transfer'], locale: 'fr_NE' },
  TG: { name: 'Togo', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-TG', paymentMethods: ['Flooz', 'T-Money', 'Bank Transfer'], locale: 'fr_TG' },
  BJ: { name: 'Benin', currency: 'XOF', currencySymbol: 'CFA', language: 'fr-BJ', paymentMethods: ['MTN Mobile Money', 'Bank Transfer'], locale: 'fr_BJ' },
  GA: { name: 'Gabon', currency: 'XAF', currencySymbol: 'FCFA', language: 'fr-GA', paymentMethods: ['Airtel Money', 'Bank Transfer'], locale: 'fr_GA' },
  CG: { name: 'Congo', currency: 'XAF', currencySymbol: 'FCFA', language: 'fr-CG', paymentMethods: ['MTN Mobile Money', 'Bank Transfer'], locale: 'fr_CG' },
  CD: { name: 'DR Congo', currency: 'CDF', currencySymbol: 'FC', language: 'fr-CD', paymentMethods: ['M-Pesa', 'Orange Money', 'Bank Transfer'], locale: 'fr_CD' },
  CF: { name: 'Central African Republic', currency: 'XAF', currencySymbol: 'FCFA', language: 'fr-CF', paymentMethods: ['Bank Transfer'], locale: 'fr_CF' },
  TD: { name: 'Chad', currency: 'XAF', currencySymbol: 'FCFA', language: 'fr-TD', paymentMethods: ['Bank Transfer'], locale: 'fr_TD' },
  GN: { name: 'Guinea', currency: 'GNF', currencySymbol: 'FG', language: 'fr-GN', paymentMethods: ['Orange Money', 'Bank Transfer'], locale: 'fr_GN' },
  GW: { name: 'Guinea-Bissau', currency: 'XOF', currencySymbol: 'CFA', language: 'pt-GW', paymentMethods: ['Bank Transfer'], locale: 'pt_GW' },
  SL: { name: 'Sierra Leone', currency: 'SLL', currencySymbol: 'Le', language: 'en-SL', paymentMethods: ['Orange Money', 'Bank Transfer'], locale: 'en_SL' },
  LR: { name: 'Liberia', currency: 'LRD', currencySymbol: 'L$', language: 'en-LR', paymentMethods: ['Bank Transfer'], locale: 'en_LR' },
  GM: { name: 'Gambia', currency: 'GMD', currencySymbol: 'D', language: 'en-GM', paymentMethods: ['Bank Transfer'], locale: 'en_GM' },
  MR: { name: 'Mauritania', currency: 'MRU', currencySymbol: 'UM', language: 'ar-MR', paymentMethods: ['Bank Transfer'], locale: 'ar_MR' },
  CV: { name: 'Cape Verde', currency: 'CVE', currencySymbol: '$', language: 'pt-CV', paymentMethods: ['Visa', 'Bank Transfer'], locale: 'pt_CV' },
  ST: { name: 'Sao Tome and Principe', currency: 'STN', currencySymbol: 'Db', language: 'pt-ST', paymentMethods: ['Bank Transfer'], locale: 'pt_ST' },
  GQ: { name: 'Equatorial Guinea', currency: 'XAF', currencySymbol: 'FCFA', language: 'es-GQ', paymentMethods: ['Bank Transfer'], locale: 'es_GQ' },
  BI: { name: 'Burundi', currency: 'BIF', currencySymbol: 'FBu', language: 'fr-BI', paymentMethods: ['Bank Transfer'], locale: 'fr_BI' },
  DJ: { name: 'Djibouti', currency: 'DJF', currencySymbol: 'Fdj', language: 'fr-DJ', paymentMethods: ['Bank Transfer'], locale: 'fr_DJ' },
  ER: { name: 'Eritrea', currency: 'ERN', currencySymbol: 'Nfk', language: 'ti-ER', paymentMethods: ['Bank Transfer'], locale: 'ti_ER' },
  SO: { name: 'Somalia', currency: 'SOS', currencySymbol: 'S', language: 'so-SO', paymentMethods: ['EVC Plus', 'Bank Transfer'], locale: 'so_SO' },
  SS: { name: 'South Sudan', currency: 'SSP', currencySymbol: '£', language: 'en-SS', paymentMethods: ['Bank Transfer'], locale: 'en_SS' },
  MW: { name: 'Malawi', currency: 'MWK', currencySymbol: 'MK', language: 'en-MW', paymentMethods: ['Airtel Money', 'Bank Transfer'], locale: 'en_MW' },
  LS: { name: 'Lesotho', currency: 'LSL', currencySymbol: 'L', language: 'en-LS', paymentMethods: ['M-Pesa', 'Bank Transfer'], locale: 'en_LS' },
  SZ: { name: 'Eswatini', currency: 'SZL', currencySymbol: 'E', language: 'en-SZ', paymentMethods: ['Bank Transfer'], locale: 'en_SZ' },
  KM: { name: 'Comoros', currency: 'KMF', currencySymbol: 'CF', language: 'fr-KM', paymentMethods: ['Bank Transfer'], locale: 'fr_KM' },
  SC: { name: 'Seychelles', currency: 'SCR', currencySymbol: '₨', language: 'en-SC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_SC' },
  MG: { name: 'Madagascar', currency: 'MGA', currencySymbol: 'Ar', language: 'fr-MG', paymentMethods: ['Orange Money', 'Bank Transfer'], locale: 'fr_MG' },
  RE: { name: 'Reunion', currency: 'EUR', currencySymbol: '€', language: 'fr-RE', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_RE' },
  YT: { name: 'Mayotte', currency: 'EUR', currencySymbol: '€', language: 'fr-YT', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_YT' },

  // European Territories & Microstates
  FO: { name: 'Faroe Islands', currency: 'DKK', currencySymbol: 'kr', language: 'fo-FO', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fo_FO' },
  GL: { name: 'Greenland', currency: 'DKK', currencySymbol: 'kr', language: 'kl-GL', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'kl_GL' },
  GI: { name: 'Gibraltar', currency: 'GIP', currencySymbol: '£', language: 'en-GI', paymentMethods: ['Visa', 'MasterCard', 'PayPal'], locale: 'en_GI' },
  IM: { name: 'Isle of Man', currency: 'GBP', currencySymbol: '£', language: 'en-IM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_IM' },
  JE: { name: 'Jersey', currency: 'GBP', currencySymbol: '£', language: 'en-JE', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_JE' },
  GG: { name: 'Guernsey', currency: 'GBP', currencySymbol: '£', language: 'en-GG', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_GG' },
  LI: { name: 'Liechtenstein', currency: 'CHF', currencySymbol: 'CHF', language: 'de-LI', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'de_LI' },
  AD: { name: 'Andorra', currency: 'EUR', currencySymbol: '€', language: 'ca-AD', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'ca_AD' },
  MC: { name: 'Monaco', currency: 'EUR', currencySymbol: '€', language: 'fr-MC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_MC' },
  SM: { name: 'San Marino', currency: 'EUR', currencySymbol: '€', language: 'it-SM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'it_SM' },
  VA: { name: 'Vatican City', currency: 'EUR', currencySymbol: '€', language: 'it-VA', paymentMethods: ['Visa', 'MasterCard'], locale: 'it_VA' },

  // Caribbean Territories (Additional)
  GF: { name: 'French Guiana', currency: 'EUR', currencySymbol: '€', language: 'fr-GF', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_GF' },
  MQ: { name: 'Martinique', currency: 'EUR', currencySymbol: '€', language: 'fr-MQ', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_MQ' },
  GP: { name: 'Guadeloupe', currency: 'EUR', currencySymbol: '€', language: 'fr-GP', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'fr_GP' },
  AW: { name: 'Aruba', currency: 'AWG', currencySymbol: 'ƒ', language: 'nl-AW', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'nl_AW' },
  CW: { name: 'Curacao', currency: 'ANG', currencySymbol: 'ƒ', language: 'nl-CW', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'nl_CW' },
  VI: { name: 'US Virgin Islands', currency: 'USD', currencySymbol: '$', language: 'en-VI', paymentMethods: ['Visa', 'MasterCard', 'PayPal'], locale: 'en_VI' },
  VG: { name: 'British Virgin Islands', currency: 'USD', currencySymbol: '$', language: 'en-VG', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_VG' },
  KY: { name: 'Cayman Islands', currency: 'KYD', currencySymbol: 'CI$', language: 'en-KY', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_KY' },
  BM: { name: 'Bermuda', currency: 'BMD', currencySymbol: 'BD$', language: 'en-BM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_BM' },
  TC: { name: 'Turks and Caicos', currency: 'USD', currencySymbol: '$', language: 'en-TC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_TC' },
  LC: { name: 'Saint Lucia', currency: 'XCD', currencySymbol: 'EC$', language: 'en-LC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_LC' },
  AG: { name: 'Antigua and Barbuda', currency: 'XCD', currencySymbol: 'EC$', language: 'en-AG', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_AG' },
  GD: { name: 'Grenada', currency: 'XCD', currencySymbol: 'EC$', language: 'en-GD', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_GD' },
  VC: { name: 'Saint Vincent', currency: 'XCD', currencySymbol: 'EC$', language: 'en-VC', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_VC' },
  DM: { name: 'Dominica', currency: 'XCD', currencySymbol: 'EC$', language: 'en-DM', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_DM' },
  KN: { name: 'Saint Kitts and Nevis', currency: 'XCD', currencySymbol: 'EC$', language: 'en-KN', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_KN' },
  AI: { name: 'Anguilla', currency: 'XCD', currencySymbol: 'EC$', language: 'en-AI', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_AI' },
  MS: { name: 'Montserrat', currency: 'XCD', currencySymbol: 'EC$', language: 'en-MS', paymentMethods: ['Visa', 'MasterCard', 'Bank Transfer'], locale: 'en_MS' },
};

// Extended list of all 176 supported country codes
export const ALL_COUNTRY_CODES = Object.keys(COUNTRY_DATA);

// Game-specific SEO configurations
export type GameType = 'pubgm' | 'freefire' | 'roblox' | 'valorant' | 'honorofkings';

interface GameSEOTemplate {
  gameName: string;
  currencyName: string;
  startingPrice: string;
  products: string[];
  bonusText: string;
}

const GAME_TEMPLATES: Record<GameType, GameSEOTemplate> = {
  pubgm: {
    gameName: 'PUBG Mobile UC',
    currencyName: 'UC',
    startingPrice: '0.99',
    products: ['Royal Pass', 'Glacier M416', 'AWM Skin', 'Mythic Outfit', 'Premium Crates'],
    bonusText: '60% OFF + 30% VIP Bonus'
  },
  freefire: {
    gameName: 'Free Fire Diamonds',
    currencyName: 'Diamonds',
    startingPrice: '0.99',
    products: ['Elite Pass', 'DJ Alok', 'Chrono', 'Skyler', 'Weapon Skins'],
    bonusText: '60% OFF + 30% VIP Bonus'
  },
  roblox: {
    gameName: 'Robux',
    currencyName: 'Robux',
    startingPrice: '4.99',
    products: ['Premium', 'Avatar Items', 'Game Passes', 'Limited Items'],
    bonusText: '50% OFF + Extra Robux'
  },
  valorant: {
    gameName: 'Valorant Points',
    currencyName: 'VP',
    startingPrice: '4.99',
    products: ['Battle Pass', 'Skins', 'Agents', 'Bundles'],
    bonusText: '40% OFF + Bonus VP'
  },
  honorofkings: {
    gameName: 'Honor of Kings Tokens',
    currencyName: 'Tokens',
    startingPrice: '0.99',
    products: ['Skins', 'Heroes', 'Battle Pass'],
    bonusText: '50% OFF + Bonus'
  }
};

// Generate country-specific title for a game - MUST stay under 60 chars to avoid Google "..." truncation
export const generateGameTitle = (countryCode: string, game: GameType): string => {
  const country = COUNTRY_DATA[countryCode] || COUNTRY_DATA['US'];
  const template = GAME_TEMPLATES[game];
  
  // Try full format first, then progressively shorten to stay under 60 chars
  const fullTitle = `${template.gameName} ${country.name} | 60% OFF & VIP 30% Extra ${template.currencyName} | Midasbuy`;
  if (fullTitle.length <= 60) return fullTitle;
  
  const medTitle = `${template.gameName} ${country.name} | 60% OFF VIP Bonus | Midasbuy`;
  if (medTitle.length <= 60) return medTitle;
  
  const shortTitle = `${template.gameName} ${country.name} | 60% OFF | Midasbuy`;
  if (shortTitle.length <= 60) return shortTitle;
  
  // Ultra short for very long country names
  return `${template.gameName} ${country.name} | Midasbuy`;
};

// Generate country-specific description for a game
export const generateGameDescription = (countryCode: string, game: GameType): string => {
  const country = COUNTRY_DATA[countryCode] || COUNTRY_DATA['US'];
  const template = GAME_TEMPLATES[game];
  const payments = country.paymentMethods.slice(0, 4).join(', ');
  const products = template.products.slice(0, 3).join(', ');
  
  return `⚡ #1 ${template.gameName} Store ${country.name} 2026! Buy ${template.currencyName} from ${country.currencySymbol}${template.startingPrice} | ${template.bonusText} | Instant 2-5 Min Delivery | ${products} | ${payments} | Trusted by Millions! Official Midasbuy ${country.name}.`;
};

// Generate country-specific keywords for a game
export const generateGameKeywords = (countryCode: string, game: GameType): string => {
  const country = COUNTRY_DATA[countryCode] || COUNTRY_DATA['US'];
  const template = GAME_TEMPLATES[game];
  const countryLower = country.name.toLowerCase();
  const currencyLower = template.currencyName.toLowerCase();
  const gameLower = template.gameName.toLowerCase();
  
  const keywords = [
    // Primary keywords with country
    `${gameLower} ${countryLower}`,
    `buy ${currencyLower} ${countryLower}`,
    `${currencyLower} ${countryLower}`,
    `cheapest ${currencyLower} ${countryLower}`,
    `${gameLower} top up ${countryLower}`,
    `${gameLower} recharge ${countryLower}`,
    
    // Currency specific
    `${currencyLower} ${country.currency}`,
    `${gameLower} ${country.currency}`,
    `buy ${currencyLower} ${country.currency}`,
    
    // Midasbuy brand with country
    `midasbuy ${countryLower}`,
    `midasbuy ${gameLower} ${countryLower}`,
    `middasbuy ${countryLower}`,
    
    // Action keywords
    `buy ${currencyLower} online ${countryLower}`,
    `purchase ${currencyLower} ${countryLower}`,
    `${currencyLower} instant ${countryLower}`,
    `${currencyLower} fast delivery ${countryLower}`,
    
    // Price keywords
    `cheap ${currencyLower} ${countryLower}`,
    `${currencyLower} discount ${countryLower}`,
    `${currencyLower} sale ${countryLower}`,
    `${currencyLower} offer ${countryLower}`,
    `lowest price ${currencyLower} ${countryLower}`,
    
    // Payment method keywords
    ...country.paymentMethods.map(pm => `${currencyLower} ${pm.toLowerCase()} ${countryLower}`),
    
    // Trust keywords
    `safe ${currencyLower} ${countryLower}`,
    `trusted ${currencyLower} seller ${countryLower}`,
    `official ${currencyLower} ${countryLower}`,
    
    // 2026 keywords
    `${currencyLower} 2026 ${countryLower}`,
    `${gameLower} 2026 ${countryLower}`,
    `best ${currencyLower} prices 2026 ${countryLower}`,
  ];
  
  return keywords.join(', ');
};

// Get complete SEO config for a country and game
export interface GameSEOConfig {
  title: string;
  description: string;
  keywords: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  language: string;
  locale: string;
  paymentMethods: string[];
}

export const getGameSEOConfig = (countryCode: string, game: GameType): GameSEOConfig => {
  const country = COUNTRY_DATA[countryCode] || COUNTRY_DATA['US'];
  
  return {
    title: generateGameTitle(countryCode, game),
    description: generateGameDescription(countryCode, game),
    keywords: generateGameKeywords(countryCode, game),
    countryName: country.name,
    currency: country.currency,
    currencySymbol: country.currencySymbol,
    language: country.language,
    locale: country.locale,
    paymentMethods: country.paymentMethods,
  };
};

// Get all supported countries
export const getAllCountries = (): string[] => ALL_COUNTRY_CODES;

// Check if country is configured
export const isCountryConfigured = (countryCode: string): boolean => {
  return countryCode in COUNTRY_DATA;
};

// Get country data
export const getCountryData = (countryCode: string) => {
  return COUNTRY_DATA[countryCode] || COUNTRY_DATA['US'];
};

// Generate hreflang for country
export const getHreflangFromLocale = (countryCode: string): string => {
  const country = COUNTRY_DATA[countryCode];
  if (!country) return 'en';
  return country.language.toLowerCase();
};

// Generate all alternate URLs for a game page
// IMPORTANT: Use full language-country format (e.g., en-pk, ar-sa) to avoid duplicate hreflang errors
export const generateAlternateUrls = (game: string, baseUrl: string = 'https://www.middasbuy.com'): Array<{hreflang: string; href: string}> => {
  const gameSlug = game === 'pubgm' ? 'pubgm' : game === 'freefire' ? 'freefire' : game === 'roblox' ? 'roblox' : game === 'valorant' ? 'valorant' : game === 'car' ? 'car' : 'honorofkings';
  const defaultUrl = `/midasbuy/us/buy/${gameSlug}`;
  
  const alternates: Array<{hreflang: string; href: string}> = [
    { hreflang: 'x-default', href: `${baseUrl}${defaultUrl}` }
  ];
  
  ALL_COUNTRY_CODES.forEach(code => {
    const country = COUNTRY_DATA[code];
    if (country) {
      // Use full locale format: language-country (e.g., en-pk, ar-sa, ur-pk)
      // This prevents duplicate hreflang errors in Google Search Console
      const hreflang = country.language?.toLowerCase() || `en-${code.toLowerCase()}`;
      alternates.push({
        hreflang: hreflang,
        href: `${baseUrl}/midasbuy/${code.toLowerCase()}/buy/${gameSlug}`
      });
    }
  });
  
  return alternates;
};

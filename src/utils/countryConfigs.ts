// Complete country to currency mapping for 176+ countries
// Based on sitemap: https://www.middasbuy.com/sitemap_countries_pubg.xml

export interface CountryConfig {
  name: string;
  currency: string;
  language: string;
  locale: string;
  hreflang: string;
  region: string;
}

// Complete country configurations with currencies
export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  // ============== SOUTH ASIA ==============
  PK: { name: 'Pakistan', currency: 'PKR', language: 'ur-PK', locale: 'ur_PK', hreflang: 'ur-pk', region: 'South Asia' },
  IN: { name: 'India', currency: 'INR', language: 'hi-IN', locale: 'hi_IN', hreflang: 'hi-in', region: 'South Asia' },
  BD: { name: 'Bangladesh', currency: 'BDT', language: 'bn-BD', locale: 'bn_BD', hreflang: 'bn-bd', region: 'South Asia' },
  NP: { name: 'Nepal', currency: 'NPR', language: 'ne-NP', locale: 'ne_NP', hreflang: 'ne-np', region: 'South Asia' },
  LK: { name: 'Sri Lanka', currency: 'LKR', language: 'si-LK', locale: 'si_LK', hreflang: 'si-lk', region: 'South Asia' },
  AF: { name: 'Afghanistan', currency: 'AFN', language: 'fa-AF', locale: 'fa_AF', hreflang: 'fa-af', region: 'South Asia' },
  BT: { name: 'Bhutan', currency: 'BTN', language: 'dz-BT', locale: 'dz_BT', hreflang: 'dz-bt', region: 'South Asia' },
  MV: { name: 'Maldives', currency: 'MVR', language: 'dv-MV', locale: 'dv_MV', hreflang: 'dv-mv', region: 'South Asia' },

  // ============== NORTH AMERICA ==============
  US: { name: 'United States', currency: 'USD', language: 'en-US', locale: 'en_US', hreflang: 'en-us', region: 'North America' },
  CA: { name: 'Canada', currency: 'CAD', language: 'en-CA', locale: 'en_CA', hreflang: 'en-ca', region: 'North America' },
  MX: { name: 'Mexico', currency: 'MXN', language: 'es-MX', locale: 'es_MX', hreflang: 'es-mx', region: 'North America' },

  // ============== WESTERN EUROPE ==============
  GB: { name: 'United Kingdom', currency: 'GBP', language: 'en-GB', locale: 'en_GB', hreflang: 'en-gb', region: 'Europe' },
  DE: { name: 'Germany', currency: 'EUR', language: 'de-DE', locale: 'de_DE', hreflang: 'de-de', region: 'Europe' },
  FR: { name: 'France', currency: 'EUR', language: 'fr-FR', locale: 'fr_FR', hreflang: 'fr-fr', region: 'Europe' },
  IT: { name: 'Italy', currency: 'EUR', language: 'it-IT', locale: 'it_IT', hreflang: 'it-it', region: 'Europe' },
  ES: { name: 'Spain', currency: 'EUR', language: 'es-ES', locale: 'es_ES', hreflang: 'es-es', region: 'Europe' },
  NL: { name: 'Netherlands', currency: 'EUR', language: 'nl-NL', locale: 'nl_NL', hreflang: 'nl-nl', region: 'Europe' },
  BE: { name: 'Belgium', currency: 'EUR', language: 'nl-BE', locale: 'nl_BE', hreflang: 'nl-be', region: 'Europe' },
  CH: { name: 'Switzerland', currency: 'CHF', language: 'de-CH', locale: 'de_CH', hreflang: 'de-ch', region: 'Europe' },
  AT: { name: 'Austria', currency: 'EUR', language: 'de-AT', locale: 'de_AT', hreflang: 'de-at', region: 'Europe' },
  IE: { name: 'Ireland', currency: 'EUR', language: 'en-IE', locale: 'en_IE', hreflang: 'en-ie', region: 'Europe' },
  PT: { name: 'Portugal', currency: 'EUR', language: 'pt-PT', locale: 'pt_PT', hreflang: 'pt-pt', region: 'Europe' },
  LU: { name: 'Luxembourg', currency: 'EUR', language: 'fr-LU', locale: 'fr_LU', hreflang: 'fr-lu', region: 'Europe' },

  // ============== NORTHERN EUROPE ==============
  SE: { name: 'Sweden', currency: 'SEK', language: 'sv-SE', locale: 'sv_SE', hreflang: 'sv-se', region: 'Europe' },
  NO: { name: 'Norway', currency: 'NOK', language: 'no-NO', locale: 'no_NO', hreflang: 'no-no', region: 'Europe' },
  DK: { name: 'Denmark', currency: 'DKK', language: 'da-DK', locale: 'da_DK', hreflang: 'da-dk', region: 'Europe' },
  FI: { name: 'Finland', currency: 'EUR', language: 'fi-FI', locale: 'fi_FI', hreflang: 'fi-fi', region: 'Europe' },
  IS: { name: 'Iceland', currency: 'ISK', language: 'is-IS', locale: 'is_IS', hreflang: 'is-is', region: 'Europe' },
  
  // ============== EASTERN EUROPE ==============
  PL: { name: 'Poland', currency: 'PLN', language: 'pl-PL', locale: 'pl_PL', hreflang: 'pl-pl', region: 'Europe' },
  CZ: { name: 'Czech Republic', currency: 'CZK', language: 'cs-CZ', locale: 'cs_CZ', hreflang: 'cs-cz', region: 'Europe' },
  HU: { name: 'Hungary', currency: 'HUF', language: 'hu-HU', locale: 'hu_HU', hreflang: 'hu-hu', region: 'Europe' },
  RO: { name: 'Romania', currency: 'RON', language: 'ro-RO', locale: 'ro_RO', hreflang: 'ro-ro', region: 'Europe' },
  BG: { name: 'Bulgaria', currency: 'BGN', language: 'bg-BG', locale: 'bg_BG', hreflang: 'bg-bg', region: 'Europe' },
  UA: { name: 'Ukraine', currency: 'UAH', language: 'uk-UA', locale: 'uk_UA', hreflang: 'uk-ua', region: 'Europe' },
  BY: { name: 'Belarus', currency: 'BYN', language: 'be-BY', locale: 'be_BY', hreflang: 'be-by', region: 'Europe' },
  MD: { name: 'Moldova', currency: 'MDL', language: 'ro-MD', locale: 'ro_MD', hreflang: 'ro-md', region: 'Europe' },
  SK: { name: 'Slovakia', currency: 'EUR', language: 'sk-SK', locale: 'sk_SK', hreflang: 'sk-sk', region: 'Europe' },
  SI: { name: 'Slovenia', currency: 'EUR', language: 'sl-SI', locale: 'sl_SI', hreflang: 'sl-si', region: 'Europe' },
  HR: { name: 'Croatia', currency: 'EUR', language: 'hr-HR', locale: 'hr_HR', hreflang: 'hr-hr', region: 'Europe' },
  LT: { name: 'Lithuania', currency: 'EUR', language: 'lt-LT', locale: 'lt_LT', hreflang: 'lt-lt', region: 'Europe' },
  LV: { name: 'Latvia', currency: 'EUR', language: 'lv-LV', locale: 'lv_LV', hreflang: 'lv-lv', region: 'Europe' },
  EE: { name: 'Estonia', currency: 'EUR', language: 'et-EE', locale: 'et_EE', hreflang: 'et-ee', region: 'Europe' },
  
  // ============== BALKANS ==============
  RS: { name: 'Serbia', currency: 'RSD', language: 'sr-RS', locale: 'sr_RS', hreflang: 'sr-rs', region: 'Europe' },
  GR: { name: 'Greece', currency: 'EUR', language: 'el-GR', locale: 'el_GR', hreflang: 'el-gr', region: 'Europe' },
  AL: { name: 'Albania', currency: 'ALL', language: 'sq-AL', locale: 'sq_AL', hreflang: 'sq-al', region: 'Europe' },
  MK: { name: 'North Macedonia', currency: 'MKD', language: 'mk-MK', locale: 'mk_MK', hreflang: 'mk-mk', region: 'Europe' },
  BA: { name: 'Bosnia and Herzegovina', currency: 'BAM', language: 'bs-BA', locale: 'bs_BA', hreflang: 'bs-ba', region: 'Europe' },
  ME: { name: 'Montenegro', currency: 'EUR', language: 'sr-ME', locale: 'sr_ME', hreflang: 'sr-me', region: 'Europe' },
  XK: { name: 'Kosovo', currency: 'EUR', language: 'sq-XK', locale: 'sq_XK', hreflang: 'sq-xk', region: 'Europe' },
  MT: { name: 'Malta', currency: 'EUR', language: 'mt-MT', locale: 'mt_MT', hreflang: 'mt-mt', region: 'Europe' },
  CY: { name: 'Cyprus', currency: 'EUR', language: 'el-CY', locale: 'el_CY', hreflang: 'el-cy', region: 'Europe' },
  
  // ============== RUSSIA & CIS ==============
  RU: { name: 'Russia', currency: 'RUB', language: 'ru-RU', locale: 'ru_RU', hreflang: 'ru-ru', region: 'Europe' },
  KZ: { name: 'Kazakhstan', currency: 'KZT', language: 'kk-KZ', locale: 'kk_KZ', hreflang: 'kk-kz', region: 'Central Asia' },
  UZ: { name: 'Uzbekistan', currency: 'UZS', language: 'uz-UZ', locale: 'uz_UZ', hreflang: 'uz-uz', region: 'Central Asia' },
  TM: { name: 'Turkmenistan', currency: 'TMT', language: 'tk-TM', locale: 'tk_TM', hreflang: 'tk-tm', region: 'Central Asia' },
  KG: { name: 'Kyrgyzstan', currency: 'KGS', language: 'ky-KG', locale: 'ky_KG', hreflang: 'ky-kg', region: 'Central Asia' },
  TJ: { name: 'Tajikistan', currency: 'TJS', language: 'tg-TJ', locale: 'tg_TJ', hreflang: 'tg-tj', region: 'Central Asia' },
  AM: { name: 'Armenia', currency: 'AMD', language: 'hy-AM', locale: 'hy_AM', hreflang: 'hy-am', region: 'Central Asia' },
  AZ: { name: 'Azerbaijan', currency: 'AZN', language: 'az-AZ', locale: 'az_AZ', hreflang: 'az-az', region: 'Central Asia' },
  GE: { name: 'Georgia', currency: 'GEL', language: 'ka-GE', locale: 'ka_GE', hreflang: 'ka-ge', region: 'Central Asia' },

  // ============== MIDDLE EAST ==============
  TR: { name: 'Turkey', currency: 'TRY', language: 'tr-TR', locale: 'tr_TR', hreflang: 'tr-tr', region: 'Middle East' },
  SA: { name: 'Saudi Arabia', currency: 'SAR', language: 'ar-SA', locale: 'ar_SA', hreflang: 'ar-sa', region: 'Middle East' },
  AE: { name: 'United Arab Emirates', currency: 'AED', language: 'ar-AE', locale: 'ar_AE', hreflang: 'ar-ae', region: 'Middle East' },
  EG: { name: 'Egypt', currency: 'EGP', language: 'ar-EG', locale: 'ar_EG', hreflang: 'ar-eg', region: 'Middle East' },
  QA: { name: 'Qatar', currency: 'QAR', language: 'ar-QA', locale: 'ar_QA', hreflang: 'ar-qa', region: 'Middle East' },
  KW: { name: 'Kuwait', currency: 'KWD', language: 'ar-KW', locale: 'ar_KW', hreflang: 'ar-kw', region: 'Middle East' },
  BH: { name: 'Bahrain', currency: 'BHD', language: 'ar-BH', locale: 'ar_BH', hreflang: 'ar-bh', region: 'Middle East' },
  OM: { name: 'Oman', currency: 'OMR', language: 'ar-OM', locale: 'ar_OM', hreflang: 'ar-om', region: 'Middle East' },
  JO: { name: 'Jordan', currency: 'JOD', language: 'ar-JO', locale: 'ar_JO', hreflang: 'ar-jo', region: 'Middle East' },
  LB: { name: 'Lebanon', currency: 'LBP', language: 'ar-LB', locale: 'ar_LB', hreflang: 'ar-lb', region: 'Middle East' },
  IQ: { name: 'Iraq', currency: 'IQD', language: 'ar-IQ', locale: 'ar_IQ', hreflang: 'ar-iq', region: 'Middle East' },
  SY: { name: 'Syria', currency: 'SYP', language: 'ar-SY', locale: 'ar_SY', hreflang: 'ar-sy', region: 'Middle East' },
  YE: { name: 'Yemen', currency: 'YER', language: 'ar-YE', locale: 'ar_YE', hreflang: 'ar-ye', region: 'Middle East' },
  PS: { name: 'Palestine', currency: 'ILS', language: 'ar-PS', locale: 'ar_PS', hreflang: 'ar-ps', region: 'Middle East' },
  IL: { name: 'Israel', currency: 'ILS', language: 'he-IL', locale: 'he_IL', hreflang: 'he-il', region: 'Middle East' },
  IR: { name: 'Iran', currency: 'IRR', language: 'fa-IR', locale: 'fa_IR', hreflang: 'fa-ir', region: 'Middle East' },

  // ============== EAST ASIA ==============
  JP: { name: 'Japan', currency: 'JPY', language: 'ja-JP', locale: 'ja_JP', hreflang: 'ja-jp', region: 'East Asia' },
  KR: { name: 'South Korea', currency: 'KRW', language: 'ko-KR', locale: 'ko_KR', hreflang: 'ko-kr', region: 'East Asia' },
  CN: { name: 'China', currency: 'CNY', language: 'zh-CN', locale: 'zh_CN', hreflang: 'zh-cn', region: 'East Asia' },
  TW: { name: 'Taiwan', currency: 'TWD', language: 'zh-TW', locale: 'zh_TW', hreflang: 'zh-tw', region: 'East Asia' },
  HK: { name: 'Hong Kong', currency: 'HKD', language: 'zh-HK', locale: 'zh_HK', hreflang: 'zh-hk', region: 'East Asia' },
  MN: { name: 'Mongolia', currency: 'MNT', language: 'mn-MN', locale: 'mn_MN', hreflang: 'mn-mn', region: 'East Asia' },

  // ============== SOUTHEAST ASIA ==============
  SG: { name: 'Singapore', currency: 'SGD', language: 'en-SG', locale: 'en_SG', hreflang: 'en-sg', region: 'Southeast Asia' },
  MY: { name: 'Malaysia', currency: 'MYR', language: 'ms-MY', locale: 'ms_MY', hreflang: 'ms-my', region: 'Southeast Asia' },
  TH: { name: 'Thailand', currency: 'THB', language: 'th-TH', locale: 'th_TH', hreflang: 'th-th', region: 'Southeast Asia' },
  ID: { name: 'Indonesia', currency: 'IDR', language: 'id-ID', locale: 'id_ID', hreflang: 'id-id', region: 'Southeast Asia' },
  PH: { name: 'Philippines', currency: 'PHP', language: 'en-PH', locale: 'en_PH', hreflang: 'en-ph', region: 'Southeast Asia' },
  VN: { name: 'Vietnam', currency: 'VND', language: 'vi-VN', locale: 'vi_VN', hreflang: 'vi-vn', region: 'Southeast Asia' },
  MM: { name: 'Myanmar', currency: 'MMK', language: 'my-MM', locale: 'my_MM', hreflang: 'my-mm', region: 'Southeast Asia' },
  KH: { name: 'Cambodia', currency: 'KHR', language: 'km-KH', locale: 'km_KH', hreflang: 'km-kh', region: 'Southeast Asia' },
  LA: { name: 'Laos', currency: 'LAK', language: 'lo-LA', locale: 'lo_LA', hreflang: 'lo-la', region: 'Southeast Asia' },
  BN: { name: 'Brunei', currency: 'BND', language: 'ms-BN', locale: 'ms_BN', hreflang: 'ms-bn', region: 'Southeast Asia' },
  TL: { name: 'Timor-Leste', currency: 'USD', language: 'pt-TL', locale: 'pt_TL', hreflang: 'pt-tl', region: 'Southeast Asia' },

  // ============== OCEANIA ==============
  AU: { name: 'Australia', currency: 'AUD', language: 'en-AU', locale: 'en_AU', hreflang: 'en-au', region: 'Oceania' },
  NZ: { name: 'New Zealand', currency: 'NZD', language: 'en-NZ', locale: 'en_NZ', hreflang: 'en-nz', region: 'Oceania' },
  PG: { name: 'Papua New Guinea', currency: 'PGK', language: 'en-PG', locale: 'en_PG', hreflang: 'en-pg', region: 'Oceania' },
  FJ: { name: 'Fiji', currency: 'FJD', language: 'en-FJ', locale: 'en_FJ', hreflang: 'en-fj', region: 'Oceania' },
  NC: { name: 'New Caledonia', currency: 'XPF', language: 'fr-NC', locale: 'fr_NC', hreflang: 'fr-nc', region: 'Oceania' },

  // ============== SOUTH AMERICA ==============
  BR: { name: 'Brazil', currency: 'BRL', language: 'pt-BR', locale: 'pt_BR', hreflang: 'pt-br', region: 'South America' },
  AR: { name: 'Argentina', currency: 'ARS', language: 'es-AR', locale: 'es_AR', hreflang: 'es-ar', region: 'South America' },
  CL: { name: 'Chile', currency: 'CLP', language: 'es-CL', locale: 'es_CL', hreflang: 'es-cl', region: 'South America' },
  CO: { name: 'Colombia', currency: 'COP', language: 'es-CO', locale: 'es_CO', hreflang: 'es-co', region: 'South America' },
  PE: { name: 'Peru', currency: 'PEN', language: 'es-PE', locale: 'es_PE', hreflang: 'es-pe', region: 'South America' },
  VE: { name: 'Venezuela', currency: 'VES', language: 'es-VE', locale: 'es_VE', hreflang: 'es-ve', region: 'South America' },
  EC: { name: 'Ecuador', currency: 'USD', language: 'es-EC', locale: 'es_EC', hreflang: 'es-ec', region: 'South America' },
  BO: { name: 'Bolivia', currency: 'BOB', language: 'es-BO', locale: 'es_BO', hreflang: 'es-bo', region: 'South America' },
  PY: { name: 'Paraguay', currency: 'PYG', language: 'es-PY', locale: 'es_PY', hreflang: 'es-py', region: 'South America' },
  UY: { name: 'Uruguay', currency: 'UYU', language: 'es-UY', locale: 'es_UY', hreflang: 'es-uy', region: 'South America' },
  GY: { name: 'Guyana', currency: 'GYD', language: 'en-GY', locale: 'en_GY', hreflang: 'en-gy', region: 'South America' },
  SR: { name: 'Suriname', currency: 'SRD', language: 'nl-SR', locale: 'nl_SR', hreflang: 'nl-sr', region: 'South America' },
  GF: { name: 'French Guiana', currency: 'EUR', language: 'fr-GF', locale: 'fr_GF', hreflang: 'fr-gf', region: 'South America' },

  // ============== CENTRAL AMERICA & CARIBBEAN ==============
  GT: { name: 'Guatemala', currency: 'GTQ', language: 'es-GT', locale: 'es_GT', hreflang: 'es-gt', region: 'Central America' },
  HN: { name: 'Honduras', currency: 'HNL', language: 'es-HN', locale: 'es_HN', hreflang: 'es-hn', region: 'Central America' },
  SV: { name: 'El Salvador', currency: 'USD', language: 'es-SV', locale: 'es_SV', hreflang: 'es-sv', region: 'Central America' },
  NI: { name: 'Nicaragua', currency: 'NIO', language: 'es-NI', locale: 'es_NI', hreflang: 'es-ni', region: 'Central America' },
  CR: { name: 'Costa Rica', currency: 'CRC', language: 'es-CR', locale: 'es_CR', hreflang: 'es-cr', region: 'Central America' },
  PA: { name: 'Panama', currency: 'PAB', language: 'es-PA', locale: 'es_PA', hreflang: 'es-pa', region: 'Central America' },
  BZ: { name: 'Belize', currency: 'BZD', language: 'en-BZ', locale: 'en_BZ', hreflang: 'en-bz', region: 'Central America' },
  JM: { name: 'Jamaica', currency: 'JMD', language: 'en-JM', locale: 'en_JM', hreflang: 'en-jm', region: 'Caribbean' },
  TT: { name: 'Trinidad and Tobago', currency: 'TTD', language: 'en-TT', locale: 'en_TT', hreflang: 'en-tt', region: 'Caribbean' },
  BB: { name: 'Barbados', currency: 'BBD', language: 'en-BB', locale: 'en_BB', hreflang: 'en-bb', region: 'Caribbean' },
  BS: { name: 'Bahamas', currency: 'BSD', language: 'en-BS', locale: 'en_BS', hreflang: 'en-bs', region: 'Caribbean' },
  DO: { name: 'Dominican Republic', currency: 'DOP', language: 'es-DO', locale: 'es_DO', hreflang: 'es-do', region: 'Caribbean' },
  CU: { name: 'Cuba', currency: 'CUP', language: 'es-CU', locale: 'es_CU', hreflang: 'es-cu', region: 'Caribbean' },
  HT: { name: 'Haiti', currency: 'HTG', language: 'fr-HT', locale: 'fr_HT', hreflang: 'fr-ht', region: 'Caribbean' },

  // ============== NORTH AFRICA ==============
  DZ: { name: 'Algeria', currency: 'DZD', language: 'ar-DZ', locale: 'ar_DZ', hreflang: 'ar-dz', region: 'Africa' },
  MA: { name: 'Morocco', currency: 'MAD', language: 'ar-MA', locale: 'ar_MA', hreflang: 'ar-ma', region: 'Africa' },
  TN: { name: 'Tunisia', currency: 'TND', language: 'ar-TN', locale: 'ar_TN', hreflang: 'ar-tn', region: 'Africa' },
  LY: { name: 'Libya', currency: 'LYD', language: 'ar-LY', locale: 'ar_LY', hreflang: 'ar-ly', region: 'Africa' },
  SD: { name: 'Sudan', currency: 'SDG', language: 'ar-SD', locale: 'ar_SD', hreflang: 'ar-sd', region: 'Africa' },

  // ============== EAST AFRICA ==============
  KE: { name: 'Kenya', currency: 'KES', language: 'en-KE', locale: 'en_KE', hreflang: 'en-ke', region: 'Africa' },
  ET: { name: 'Ethiopia', currency: 'ETB', language: 'am-ET', locale: 'am_ET', hreflang: 'am-et', region: 'Africa' },
  TZ: { name: 'Tanzania', currency: 'TZS', language: 'sw-TZ', locale: 'sw_TZ', hreflang: 'sw-tz', region: 'Africa' },
  UG: { name: 'Uganda', currency: 'UGX', language: 'en-UG', locale: 'en_UG', hreflang: 'en-ug', region: 'Africa' },
  RW: { name: 'Rwanda', currency: 'RWF', language: 'rw-RW', locale: 'rw_RW', hreflang: 'rw-rw', region: 'Africa' },
  SO: { name: 'Somalia', currency: 'SOS', language: 'so-SO', locale: 'so_SO', hreflang: 'so-so', region: 'Africa' },
  DJ: { name: 'Djibouti', currency: 'DJF', language: 'fr-DJ', locale: 'fr_DJ', hreflang: 'fr-dj', region: 'Africa' },
  ER: { name: 'Eritrea', currency: 'ERN', language: 'ti-ER', locale: 'ti_ER', hreflang: 'ti-er', region: 'Africa' },
  BI: { name: 'Burundi', currency: 'BIF', language: 'fr-BI', locale: 'fr_BI', hreflang: 'fr-bi', region: 'Africa' },

  // ============== SOUTHERN AFRICA ==============
  ZA: { name: 'South Africa', currency: 'ZAR', language: 'en-ZA', locale: 'en_ZA', hreflang: 'en-za', region: 'Africa' },
  ZM: { name: 'Zambia', currency: 'ZMW', language: 'en-ZM', locale: 'en_ZM', hreflang: 'en-zm', region: 'Africa' },
  ZW: { name: 'Zimbabwe', currency: 'ZWL', language: 'en-ZW', locale: 'en_ZW', hreflang: 'en-zw', region: 'Africa' },
  MW: { name: 'Malawi', currency: 'MWK', language: 'en-MW', locale: 'en_MW', hreflang: 'en-mw', region: 'Africa' },
  MZ: { name: 'Mozambique', currency: 'MZN', language: 'pt-MZ', locale: 'pt_MZ', hreflang: 'pt-mz', region: 'Africa' },
  BW: { name: 'Botswana', currency: 'BWP', language: 'en-BW', locale: 'en_BW', hreflang: 'en-bw', region: 'Africa' },
  NA: { name: 'Namibia', currency: 'NAD', language: 'en-NA', locale: 'en_NA', hreflang: 'en-na', region: 'Africa' },
  AO: { name: 'Angola', currency: 'AOA', language: 'pt-AO', locale: 'pt_AO', hreflang: 'pt-ao', region: 'Africa' },
  LS: { name: 'Lesotho', currency: 'LSL', language: 'en-LS', locale: 'en_LS', hreflang: 'en-ls', region: 'Africa' },
  SZ: { name: 'Eswatini', currency: 'SZL', language: 'en-SZ', locale: 'en_SZ', hreflang: 'en-sz', region: 'Africa' },

  // ============== WEST AFRICA ==============
  NG: { name: 'Nigeria', currency: 'NGN', language: 'en-NG', locale: 'en_NG', hreflang: 'en-ng', region: 'Africa' },
  GH: { name: 'Ghana', currency: 'GHS', language: 'en-GH', locale: 'en_GH', hreflang: 'en-gh', region: 'Africa' },
  CI: { name: 'Ivory Coast', currency: 'XOF', language: 'fr-CI', locale: 'fr_CI', hreflang: 'fr-ci', region: 'Africa' },
  SN: { name: 'Senegal', currency: 'XOF', language: 'fr-SN', locale: 'fr_SN', hreflang: 'fr-sn', region: 'Africa' },
  ML: { name: 'Mali', currency: 'XOF', language: 'fr-ML', locale: 'fr_ML', hreflang: 'fr-ml', region: 'Africa' },
  BF: { name: 'Burkina Faso', currency: 'XOF', language: 'fr-BF', locale: 'fr_BF', hreflang: 'fr-bf', region: 'Africa' },
  NE: { name: 'Niger', currency: 'XOF', language: 'fr-NE', locale: 'fr_NE', hreflang: 'fr-ne', region: 'Africa' },
  CM: { name: 'Cameroon', currency: 'XAF', language: 'fr-CM', locale: 'fr_CM', hreflang: 'fr-cm', region: 'Africa' },
  TD: { name: 'Chad', currency: 'XAF', language: 'fr-TD', locale: 'fr_TD', hreflang: 'fr-td', region: 'Africa' },
  GN: { name: 'Guinea', currency: 'GNF', language: 'fr-GN', locale: 'fr_GN', hreflang: 'fr-gn', region: 'Africa' },
  BJ: { name: 'Benin', currency: 'XOF', language: 'fr-BJ', locale: 'fr_BJ', hreflang: 'fr-bj', region: 'Africa' },
  TG: { name: 'Togo', currency: 'XOF', language: 'fr-TG', locale: 'fr_TG', hreflang: 'fr-tg', region: 'Africa' },
  SL: { name: 'Sierra Leone', currency: 'SLE', language: 'en-SL', locale: 'en_SL', hreflang: 'en-sl', region: 'Africa' },
  LR: { name: 'Liberia', currency: 'LRD', language: 'en-LR', locale: 'en_LR', hreflang: 'en-lr', region: 'Africa' },
  MR: { name: 'Mauritania', currency: 'MRU', language: 'ar-MR', locale: 'ar_MR', hreflang: 'ar-mr', region: 'Africa' },
  GM: { name: 'Gambia', currency: 'GMD', language: 'en-GM', locale: 'en_GM', hreflang: 'en-gm', region: 'Africa' },
  GW: { name: 'Guinea-Bissau', currency: 'XOF', language: 'pt-GW', locale: 'pt_GW', hreflang: 'pt-gw', region: 'Africa' },

  // ============== CENTRAL AFRICA ==============
  GA: { name: 'Gabon', currency: 'XAF', language: 'fr-GA', locale: 'fr_GA', hreflang: 'fr-ga', region: 'Africa' },
  CG: { name: 'Congo', currency: 'XAF', language: 'fr-CG', locale: 'fr_CG', hreflang: 'fr-cg', region: 'Africa' },
  CD: { name: 'DR Congo', currency: 'CDF', language: 'fr-CD', locale: 'fr_CD', hreflang: 'fr-cd', region: 'Africa' },
  CF: { name: 'Central African Republic', currency: 'XAF', language: 'fr-CF', locale: 'fr_CF', hreflang: 'fr-cf', region: 'Africa' },
  GQ: { name: 'Equatorial Guinea', currency: 'XAF', language: 'es-GQ', locale: 'es_GQ', hreflang: 'es-gq', region: 'Africa' },
  ST: { name: 'São Tomé and Príncipe', currency: 'STN', language: 'pt-ST', locale: 'pt_ST', hreflang: 'pt-st', region: 'Africa' },

  // ============== ISLAND NATIONS ==============
  MU: { name: 'Mauritius', currency: 'MUR', language: 'en-MU', locale: 'en_MU', hreflang: 'en-mu', region: 'Africa' },
  SC: { name: 'Seychelles', currency: 'SCR', language: 'en-SC', locale: 'en_SC', hreflang: 'en-sc', region: 'Africa' },
  KM: { name: 'Comoros', currency: 'KMF', language: 'ar-KM', locale: 'ar_KM', hreflang: 'ar-km', region: 'Africa' },
  CV: { name: 'Cape Verde', currency: 'CVE', language: 'pt-CV', locale: 'pt_CV', hreflang: 'pt-cv', region: 'Africa' },

  // ============== EUROPEAN TERRITORIES & MICROSTATES ==============
  FO: { name: 'Faroe Islands', currency: 'DKK', language: 'fo-FO', locale: 'fo_FO', hreflang: 'fo-fo', region: 'Europe' },
  GL: { name: 'Greenland', currency: 'DKK', language: 'kl-GL', locale: 'kl_GL', hreflang: 'kl-gl', region: 'Europe' },
  GI: { name: 'Gibraltar', currency: 'GIP', language: 'en-GI', locale: 'en_GI', hreflang: 'en-gi', region: 'Europe' },
  IM: { name: 'Isle of Man', currency: 'GBP', language: 'en-IM', locale: 'en_IM', hreflang: 'en-im', region: 'Europe' },
  JE: { name: 'Jersey', currency: 'GBP', language: 'en-JE', locale: 'en_JE', hreflang: 'en-je', region: 'Europe' },
  GG: { name: 'Guernsey', currency: 'GBP', language: 'en-GG', locale: 'en_GG', hreflang: 'en-gg', region: 'Europe' },
  LI: { name: 'Liechtenstein', currency: 'CHF', language: 'de-LI', locale: 'de_LI', hreflang: 'de-li', region: 'Europe' },
  AD: { name: 'Andorra', currency: 'EUR', language: 'ca-AD', locale: 'ca_AD', hreflang: 'ca-ad', region: 'Europe' },
  MC: { name: 'Monaco', currency: 'EUR', language: 'fr-MC', locale: 'fr_MC', hreflang: 'fr-mc', region: 'Europe' },
  SM: { name: 'San Marino', currency: 'EUR', language: 'it-SM', locale: 'it_SM', hreflang: 'it-sm', region: 'Europe' },
  VA: { name: 'Vatican City', currency: 'EUR', language: 'it-VA', locale: 'it_VA', hreflang: 'it-va', region: 'Europe' },

  // ============== CARIBBEAN TERRITORIES (Additional) ==============
  MQ: { name: 'Martinique', currency: 'EUR', language: 'fr-MQ', locale: 'fr_MQ', hreflang: 'fr-mq', region: 'Caribbean' },
  GP: { name: 'Guadeloupe', currency: 'EUR', language: 'fr-GP', locale: 'fr_GP', hreflang: 'fr-gp', region: 'Caribbean' },
  AW: { name: 'Aruba', currency: 'AWG', language: 'nl-AW', locale: 'nl_AW', hreflang: 'nl-aw', region: 'Caribbean' },
  CW: { name: 'Curacao', currency: 'ANG', language: 'nl-CW', locale: 'nl_CW', hreflang: 'nl-cw', region: 'Caribbean' },
  VI: { name: 'US Virgin Islands', currency: 'USD', language: 'en-VI', locale: 'en_VI', hreflang: 'en-vi', region: 'Caribbean' },
  VG: { name: 'British Virgin Islands', currency: 'USD', language: 'en-VG', locale: 'en_VG', hreflang: 'en-vg', region: 'Caribbean' },
  KY: { name: 'Cayman Islands', currency: 'KYD', language: 'en-KY', locale: 'en_KY', hreflang: 'en-ky', region: 'Caribbean' },
  BM: { name: 'Bermuda', currency: 'BMD', language: 'en-BM', locale: 'en_BM', hreflang: 'en-bm', region: 'Caribbean' },
  TC: { name: 'Turks and Caicos', currency: 'USD', language: 'en-TC', locale: 'en_TC', hreflang: 'en-tc', region: 'Caribbean' },
  LC: { name: 'Saint Lucia', currency: 'XCD', language: 'en-LC', locale: 'en_LC', hreflang: 'en-lc', region: 'Caribbean' },
  AG: { name: 'Antigua and Barbuda', currency: 'XCD', language: 'en-AG', locale: 'en_AG', hreflang: 'en-ag', region: 'Caribbean' },
  GD: { name: 'Grenada', currency: 'XCD', language: 'en-GD', locale: 'en_GD', hreflang: 'en-gd', region: 'Caribbean' },
  VC: { name: 'Saint Vincent', currency: 'XCD', language: 'en-VC', locale: 'en_VC', hreflang: 'en-vc', region: 'Caribbean' },
  DM: { name: 'Dominica', currency: 'XCD', language: 'en-DM', locale: 'en_DM', hreflang: 'en-dm', region: 'Caribbean' },
  KN: { name: 'Saint Kitts and Nevis', currency: 'XCD', language: 'en-KN', locale: 'en_KN', hreflang: 'en-kn', region: 'Caribbean' },
  AI: { name: 'Anguilla', currency: 'XCD', language: 'en-AI', locale: 'en_AI', hreflang: 'en-ai', region: 'Caribbean' },
  MS: { name: 'Montserrat', currency: 'XCD', language: 'en-MS', locale: 'en_MS', hreflang: 'en-ms', region: 'Caribbean' },

  // ============== GLOBAL FALLBACK ==============
  GLOBAL: { name: 'Worldwide', currency: 'USD', language: 'en', locale: 'en_US', hreflang: 'en', region: 'Global' }
};

// Get currency code for a country
export const getCountryCurrency = (countryCode: string): string => {
  const config = COUNTRY_CONFIGS[countryCode.toUpperCase()];
  return config?.currency || 'USD';
};

// Get country name
export const getCountryNameFromConfig = (countryCode: string): string => {
  const config = COUNTRY_CONFIGS[countryCode.toUpperCase()];
  return config?.name || 'International';
};

// Get full config
export const getCountryConfig = (countryCode: string): CountryConfig => {
  return COUNTRY_CONFIGS[countryCode.toUpperCase()] || COUNTRY_CONFIGS.GLOBAL;
};

// List of all supported country codes
export const SUPPORTED_COUNTRY_CODES = Object.keys(COUNTRY_CONFIGS).filter(code => code !== 'GLOBAL');

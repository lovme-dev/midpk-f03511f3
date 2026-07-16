// Country-specific routing utilities for SEO optimization
import { SEO_BASE_URL } from './seoConstants';

// All 176+ supported country codes for international routing - synced with COUNTRY_DATA
export const SUPPORTED_COUNTRIES = [
  // South Asian Countries
  'PK', 'IN', 'BD', 'NP', 'LK', 'AF', 'BT', 'MV',
  
  // North American Countries  
  'US', 'CA',
  
  // Central American Countries
  'MX', 'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'BZ',
  
  // Caribbean Countries
  'JM', 'TT', 'BB', 'BS', 'CU', 'DO', 'HT', 'PR',
  
  // European Countries
  'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 
  'PL', 'CZ', 'HU', 'RO', 'BG', 'AT', 'CH', 'BE', 'IE', 'PT',
  'GR', 'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY',
  'IS', 'UA', 'RU', 'BY', 'MD', 'RS', 'BA', 'ME', 'MK', 'AL', 'XK',
  
  // Middle Eastern Countries
  'TR', 'SA', 'AE', 'EG', 'JO', 'LB', 'KW', 'QA', 'BH', 'OM',
  'IQ', 'SY', 'YE', 'PS', 'IL', 'IR',
  
  // Asia Pacific Countries
  'AU', 'NZ', 'MY', 'ID', 'PH', 'SG', 'TH', 'VN', 'JP', 'KR', 'TW', 'HK',
  'CN', 'MO', 'MM', 'KH', 'LA', 'BN', 'TL', 'MN', 'KZ', 'UZ', 'TJ', 'KG', 'TM', 'AZ', 'GE', 'AM',
  
  // African Countries
  'ZA', 'NG', 'KE', 'GH', 'MA', 'TN', 'DZ', 'LY', 'SD', 'ET', 'TZ', 'UG', 'RW', 'ZM', 'ZW',
  'BW', 'NA', 'MZ', 'AO', 'SN', 'CI', 'CM', 'MU', 'ML', 'BF', 'NE', 'TG', 'BJ', 'GA', 'CG', 'CD',
  'CF', 'TD', 'GN', 'GW', 'SL', 'LR', 'GM', 'MR', 'CV', 'ST', 'GQ', 'BI', 'DJ', 'ER', 'SO', 'SS',
  'MW', 'LS', 'SZ', 'KM', 'SC', 'MG', 'RE', 'YT',
  
  // Latin American Countries  
  'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'PY', 'BO', 'EC', 'GY', 'SR',
  
  // Pacific Island Countries
  'FJ', 'PG', 'WS', 'TO', 'VU', 'NC', 'PF', 'SB', 'GU', 'FM', 'MH', 'PW', 'KI', 'TV', 'NR'
];

// Generate country-specific URLs for PUBG Mobile
export const generatePubgUrls = () => {
  return SUPPORTED_COUNTRIES.map(country => ({
    country,
    url: `/midasbuy/${country.toLowerCase()}/buy/pubgm`,
    fullUrl: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/pubgm`
  }));
};

// Generate country-specific URLs for Free Fire
export const generateFreeFireUrls = () => {
  return SUPPORTED_COUNTRIES.map(country => ({
    country,
    url: `/midasbuy/${country.toLowerCase()}/buy/freefire`,
    fullUrl: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/freefire`
  }));
};

// Generate country-specific home page URLs
export const generateCountryHomeUrls = () => {
  return SUPPORTED_COUNTRIES.map(country => ({
    country,
    url: `/midasbuy/${country.toLowerCase()}`,
    fullUrl: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}`
  }));
};

// Check if country code is supported
export const isCountrySupported = (countryCode: string): boolean => {
  return SUPPORTED_COUNTRIES.includes(countryCode.toUpperCase());
};

// Get country-specific route pattern
export const getCountryRoute = (countryCode: string, game: 'pubgm' | 'freefire'): string => {
  if (!isCountrySupported(countryCode)) {
    return '/gaming-shop';
  }
  return `/midasbuy/${countryCode.toLowerCase()}/buy/${game}`;
};

// Helper function to get country name for titles - 176+ Countries
const getCountryName = (countryCode: string): string => {
  const countryNames: Record<string, string> = {
    // South Asian
    PK: 'Pakistan', IN: 'India', BD: 'Bangladesh', NP: 'Nepal', LK: 'Sri Lanka', AF: 'Afghanistan', BT: 'Bhutan', MV: 'Maldives',
    // North America
    US: 'USA', CA: 'Canada',
    // Central America
    MX: 'Mexico', GT: 'Guatemala', HN: 'Honduras', SV: 'El Salvador', NI: 'Nicaragua', CR: 'Costa Rica', PA: 'Panama', BZ: 'Belize',
    // Caribbean
    JM: 'Jamaica', TT: 'Trinidad and Tobago', BB: 'Barbados', BS: 'Bahamas', CU: 'Cuba', DO: 'Dominican Republic', HT: 'Haiti', PR: 'Puerto Rico',
    // Europe
    GB: 'UK', DE: 'Germany', FR: 'France', ES: 'Spain', IT: 'Italy', NL: 'Netherlands', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
    FI: 'Finland', PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary', RO: 'Romania', BG: 'Bulgaria', AT: 'Austria', CH: 'Switzerland',
    BE: 'Belgium', IE: 'Ireland', PT: 'Portugal', GR: 'Greece', HR: 'Croatia', SI: 'Slovenia', SK: 'Slovakia', EE: 'Estonia',
    LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', CY: 'Cyprus', IS: 'Iceland', UA: 'Ukraine', RU: 'Russia',
    BY: 'Belarus', MD: 'Moldova', RS: 'Serbia', BA: 'Bosnia', ME: 'Montenegro', MK: 'North Macedonia', AL: 'Albania', XK: 'Kosovo',
    // Middle East
    TR: 'Turkey', SA: 'Saudi Arabia', AE: 'UAE', EG: 'Egypt', JO: 'Jordan', LB: 'Lebanon', KW: 'Kuwait', QA: 'Qatar',
    BH: 'Bahrain', OM: 'Oman', IQ: 'Iraq', SY: 'Syria', YE: 'Yemen', PS: 'Palestine', IL: 'Israel', IR: 'Iran',
    // Asia Pacific
    AU: 'Australia', NZ: 'New Zealand', MY: 'Malaysia', ID: 'Indonesia', PH: 'Philippines', SG: 'Singapore', TH: 'Thailand',
    VN: 'Vietnam', JP: 'Japan', KR: 'South Korea', TW: 'Taiwan', HK: 'Hong Kong', CN: 'China', MO: 'Macau', MM: 'Myanmar',
    KH: 'Cambodia', LA: 'Laos', BN: 'Brunei', TL: 'Timor-Leste', MN: 'Mongolia', KZ: 'Kazakhstan', UZ: 'Uzbekistan',
    TJ: 'Tajikistan', KG: 'Kyrgyzstan', TM: 'Turkmenistan', AZ: 'Azerbaijan', GE: 'Georgia', AM: 'Armenia',
    // Africa
    ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya', GH: 'Ghana', MA: 'Morocco', TN: 'Tunisia', DZ: 'Algeria', LY: 'Libya',
    SD: 'Sudan', ET: 'Ethiopia', TZ: 'Tanzania', UG: 'Uganda', RW: 'Rwanda', ZM: 'Zambia', ZW: 'Zimbabwe', BW: 'Botswana',
    NA: 'Namibia', MZ: 'Mozambique', AO: 'Angola', SN: 'Senegal', CI: 'Ivory Coast', CM: 'Cameroon', MU: 'Mauritius',
    ML: 'Mali', BF: 'Burkina Faso', NE: 'Niger', TG: 'Togo', BJ: 'Benin', GA: 'Gabon', CG: 'Congo', CD: 'DR Congo',
    CF: 'Central African Republic', TD: 'Chad', GN: 'Guinea', GW: 'Guinea-Bissau', SL: 'Sierra Leone', LR: 'Liberia',
    GM: 'Gambia', MR: 'Mauritania', CV: 'Cape Verde', ST: 'Sao Tome', GQ: 'Equatorial Guinea', BI: 'Burundi', DJ: 'Djibouti',
    ER: 'Eritrea', SO: 'Somalia', SS: 'South Sudan', MW: 'Malawi', LS: 'Lesotho', SZ: 'Eswatini', KM: 'Comoros',
    SC: 'Seychelles', MG: 'Madagascar', RE: 'Reunion', YT: 'Mayotte',
    // Latin America
    BR: 'Brazil', AR: 'Argentina', CL: 'Chile', CO: 'Colombia', PE: 'Peru', VE: 'Venezuela', UY: 'Uruguay',
    PY: 'Paraguay', BO: 'Bolivia', EC: 'Ecuador', GY: 'Guyana', SR: 'Suriname',
    // Pacific Islands
    FJ: 'Fiji', PG: 'Papua New Guinea', WS: 'Samoa', TO: 'Tonga', VU: 'Vanuatu', NC: 'New Caledonia', PF: 'French Polynesia',
    SB: 'Solomon Islands', GU: 'Guam', FM: 'Micronesia', MH: 'Marshall Islands', PW: 'Palau', KI: 'Kiribati', TV: 'Tuvalu', NR: 'Nauru'
  };
  return countryNames[countryCode] || countryCode;
};

// Generate sitemap entries for all country-specific pages
export const generateCountrySitemapEntries = () => {
  const entries = [];
  
  // PUBG Mobile pages for all countries with proper titles
  const pubgUrls = generatePubgUrls();
  entries.push(...pubgUrls.map(({ fullUrl, country }) => {
    const countryName = getCountryName(country);
    return {
      loc: fullUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: country === 'US' || country === 'GB' || country === 'DE' || country === 'PK' || country === 'IN' ? 0.95 : 0.9,
      title: `Buy PUBG Mobile UC ${countryName} - Midasbuy`,
      description: `Buy PUBG Mobile UC in ${countryName} at best prices. Fast delivery, secure payment methods. Get your UC instantly!`
    };
  }));
  
  return entries;
};

// Get hreflang attribute for country - 176+ Countries
export const getHreflangForCountry = (countryCode: string): string => {
  const hreflangMap: Record<string, string> = {
    // South Asian
    PK: 'ur-pk', IN: 'hi-in', BD: 'bn-bd', NP: 'ne-np', LK: 'si-lk', AF: 'ps-af', BT: 'dz-bt', MV: 'dv-mv',
    // North America
    US: 'en-us', CA: 'en-ca',
    // Central America
    MX: 'es-mx', GT: 'es-gt', HN: 'es-hn', SV: 'es-sv', NI: 'es-ni', CR: 'es-cr', PA: 'es-pa', BZ: 'en-bz',
    // Caribbean
    JM: 'en-jm', TT: 'en-tt', BB: 'en-bb', BS: 'en-bs', CU: 'es-cu', DO: 'es-do', HT: 'fr-ht', PR: 'es-pr',
    // Europe
    GB: 'en-gb', DE: 'de-de', FR: 'fr-fr', ES: 'es-es', IT: 'it-it', NL: 'nl-nl', SE: 'sv-se', NO: 'no-no',
    DK: 'da-dk', FI: 'fi-fi', PL: 'pl-pl', CZ: 'cs-cz', HU: 'hu-hu', RO: 'ro-ro', BG: 'bg-bg', AT: 'de-at',
    CH: 'de-ch', BE: 'nl-be', IE: 'en-ie', PT: 'pt-pt', GR: 'el-gr', HR: 'hr-hr', SI: 'sl-si', SK: 'sk-sk',
    EE: 'et-ee', LV: 'lv-lv', LT: 'lt-lt', LU: 'de-lu', MT: 'mt-mt', CY: 'el-cy', IS: 'is-is', UA: 'uk-ua',
    RU: 'ru-ru', BY: 'be-by', MD: 'ro-md', RS: 'sr-rs', BA: 'bs-ba', ME: 'sr-me', MK: 'mk-mk', AL: 'sq-al', XK: 'sq-xk',
    // Middle East
    TR: 'tr-tr', SA: 'ar-sa', AE: 'ar-ae', EG: 'ar-eg', JO: 'ar-jo', LB: 'ar-lb', KW: 'ar-kw', QA: 'ar-qa',
    BH: 'ar-bh', OM: 'ar-om', IQ: 'ar-iq', SY: 'ar-sy', YE: 'ar-ye', PS: 'ar-ps', IL: 'he-il', IR: 'fa-ir',
    // Asia Pacific
    AU: 'en-au', NZ: 'en-nz', MY: 'ms-my', ID: 'id-id', PH: 'en-ph', SG: 'en-sg', TH: 'th-th', VN: 'vi-vn',
    JP: 'ja-jp', KR: 'ko-kr', TW: 'zh-tw', HK: 'zh-hk', CN: 'zh-cn', MO: 'zh-mo', MM: 'my-mm', KH: 'km-kh',
    LA: 'lo-la', BN: 'ms-bn', TL: 'pt-tl', MN: 'mn-mn', KZ: 'kk-kz', UZ: 'uz-uz', TJ: 'tg-tj', KG: 'ky-kg',
    TM: 'tk-tm', AZ: 'az-az', GE: 'ka-ge', AM: 'hy-am',
    // Africa
    ZA: 'en-za', NG: 'en-ng', KE: 'en-ke', GH: 'en-gh', MA: 'ar-ma', TN: 'ar-tn', DZ: 'ar-dz', LY: 'ar-ly',
    SD: 'ar-sd', ET: 'am-et', TZ: 'sw-tz', UG: 'en-ug', RW: 'rw-rw', ZM: 'en-zm', ZW: 'en-zw', BW: 'en-bw',
    NA: 'en-na', MZ: 'pt-mz', AO: 'pt-ao', SN: 'fr-sn', CI: 'fr-ci', CM: 'fr-cm', MU: 'en-mu', ML: 'fr-ml',
    BF: 'fr-bf', NE: 'fr-ne', TG: 'fr-tg', BJ: 'fr-bj', GA: 'fr-ga', CG: 'fr-cg', CD: 'fr-cd', CF: 'fr-cf',
    TD: 'fr-td', GN: 'fr-gn', GW: 'pt-gw', SL: 'en-sl', LR: 'en-lr', GM: 'en-gm', MR: 'ar-mr', CV: 'pt-cv',
    ST: 'pt-st', GQ: 'es-gq', BI: 'fr-bi', DJ: 'fr-dj', ER: 'ti-er', SO: 'so-so', SS: 'en-ss', MW: 'en-mw',
    LS: 'en-ls', SZ: 'en-sz', KM: 'fr-km', SC: 'en-sc', MG: 'fr-mg', RE: 'fr-re', YT: 'fr-yt',
    // Latin America
    BR: 'pt-br', AR: 'es-ar', CL: 'es-cl', CO: 'es-co', PE: 'es-pe', VE: 'es-ve', UY: 'es-uy', PY: 'es-py',
    BO: 'es-bo', EC: 'es-ec', GY: 'en-gy', SR: 'nl-sr',
    // Pacific Islands
    FJ: 'en-fj', PG: 'en-pg', WS: 'sm-ws', TO: 'to-to', VU: 'en-vu', NC: 'fr-nc', PF: 'fr-pf', SB: 'en-sb',
    GU: 'en-gu', FM: 'en-fm', MH: 'en-mh', PW: 'en-pw', KI: 'en-ki', TV: 'en-tv', NR: 'en-nr'
  };
  
  return hreflangMap[countryCode] || 'en';
};

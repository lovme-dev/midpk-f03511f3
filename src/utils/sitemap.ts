import { SUPPORTED_COUNTRIES } from './countryRoutes';
import { SEO_BASE_URL } from './seoConstants';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  title?: string;
  description?: string;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
}

// Helper function to get country name - 176+ Countries
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

// Get hreflang for country - 176+ Countries
const getHreflangForCountry = (countryCode: string): string => {
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

// Main site pages with their SEO configurations
export const MAIN_PAGES: SitemapUrl[] = [
  {
    loc: `${SEO_BASE_URL}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0,
    title: 'Midasbuy Gaming Shop',
    description: 'Buy PUBG Mobile UC, Free Fire Diamonds & other gaming credits at best prices. Fast delivery, secure payment, 24/7 support.'
  },
  {
    loc: `${SEO_BASE_URL}/midasbuy/buy/pubgm`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.95,
    title: 'Buy PUBG Mobile UC - Official Midasbuy Store',
    description: 'Buy PUBG Mobile UC at best prices worldwide. Instant delivery, secure payment, trusted by millions of players.'
  },
  {
    loc: `${SEO_BASE_URL}/midasbuy/buy/freefire`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.95,
    title: 'Buy Free Fire Diamonds - Official Midasbuy Store',
    description: 'Buy Free Fire Diamonds at best prices. Fast delivery, secure payment methods for Garena Free Fire players.'
  },
  {
    loc: `${SEO_BASE_URL}/midasbuy/buy/roblox`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
    title: 'Buy Roblox Robux - Official Midasbuy Store',
    description: 'Buy Roblox Robux at best prices. Fast delivery, secure payment methods for Roblox players.'
  },
  {
    loc: `${SEO_BASE_URL}/midasbuy/buy/valorant`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
    title: 'Buy Valorant Points VP - Official Midasbuy Store',
    description: 'Buy Valorant Points (VP) at best prices. Fast delivery, secure payment methods for Valorant players.'
  },
  {
    loc: `${SEO_BASE_URL}/midasbuy/buy/bgmi`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
    title: 'Buy BGMI UC - Battlegrounds Mobile India',
    description: 'Buy BGMI UC at lowest prices in India! Instant delivery, 100% safe, 24/7 support.'
  },
  {
    loc: `${SEO_BASE_URL}/midasbuy/buy/honorofkings`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
    title: 'Buy Honor of Kings Tokens - Official Midasbuy Store',
    description: 'Buy Honor of Kings tokens and credits at best prices. Fast delivery, secure payment.'
  },
  {
    loc: `${SEO_BASE_URL}/blogs`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.8,
    title: 'Midasbuy Gaming Blog & News',
    description: 'Latest gaming news, tips, and guides for PUBG Mobile, Free Fire and other popular games.'
  },
  {
    loc: `${SEO_BASE_URL}/about-midasbuy`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6,
    title: 'About Midasbuy - Gaming Credits Provider',
    description: 'Learn about Midasbuy, your trusted gaming credits provider.'
  },
  {
    loc: `${SEO_BASE_URL}/help-center`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.6,
    title: 'Midasbuy Help Center - Support & FAQ',
    description: 'Get help and support for your Midasbuy orders.'
  },
  {
    loc: `${SEO_BASE_URL}/contact-us`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5,
    title: 'Midasbuy Contact Us - Customer Support',
    description: 'Contact Midasbuy customer support team.'
  },
  {
    loc: `${SEO_BASE_URL}/car-purchase`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7,
    title: 'PUBG Mobile Car Skins & Vehicle Purchase',
    description: 'Buy PUBG Mobile car skins and vehicle upgrades.'
  },
  {
    loc: `${SEO_BASE_URL}/partners`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6,
    title: 'Midasbuy Partners - Gaming Partnership Program',
    description: 'Join Midasbuy partners program.'
  },
  {
    loc: `${SEO_BASE_URL}/pubg-accounts`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
    title: 'Buy PUBG Mobile Accounts - Premium Gaming Accounts',
    description: 'Purchase premium PUBG Mobile accounts with high ranks.'
  },
  {
    loc: `${SEO_BASE_URL}/careers`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5,
    title: 'Careers at Midasbuy',
    description: 'Explore career opportunities at Midasbuy.'
  },
  {
    loc: `${SEO_BASE_URL}/faqs`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.6,
    title: 'Midasbuy FAQs',
    description: 'Frequently asked questions about Midasbuy services.'
  }
];

// Generate country-specific PUBG pages
export const generateCountryPubgPages = (): SitemapUrl[] => {
  return SUPPORTED_COUNTRIES.map(country => {
    const countryName = getCountryName(country);
    const isPriorityCountry = ['US', 'GB', 'DE', 'PK', 'IN', 'SA', 'AE', 'AU'].includes(country);
    
    return {
      loc: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/pubgm`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: isPriorityCountry ? 0.9 : 0.8,
      title: `Buy PUBG Mobile UC ${countryName} - Midasbuy Official`,
      description: `Buy PUBG Mobile UC in ${countryName}. Best prices, instant delivery, secure payment. Trusted by millions of players in ${countryName}.`,
      alternates: [
        { hreflang: getHreflangForCountry(country), href: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/pubgm` },
        { hreflang: 'x-default', href: `${SEO_BASE_URL}/midasbuy/buy/pubgm` }
      ]
    };
  });
};

// Generate country-specific Free Fire pages
export const generateCountryFreeFirePages = (): SitemapUrl[] => {
  return SUPPORTED_COUNTRIES.map(country => {
    const countryName = getCountryName(country);
    const isPriorityCountry = ['US', 'BR', 'IN', 'ID', 'TH', 'VN', 'PH'].includes(country);
    
    return {
      loc: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/freefire`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: isPriorityCountry ? 0.9 : 0.8,
      title: `Buy Free Fire Diamonds ${countryName} - Midasbuy Official`,
      description: `Buy Free Fire Diamonds in ${countryName}. Cheapest prices, fast delivery, secure payment. Trusted FF Diamond seller in ${countryName}.`,
      alternates: [
        { hreflang: getHreflangForCountry(country), href: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/freefire` },
        { hreflang: 'x-default', href: `${SEO_BASE_URL}/midasbuy/buy/freefire` }
      ]
    };
  });
};

// Generate country-specific Roblox pages
export const generateCountryRobloxPages = (): SitemapUrl[] => {
  return SUPPORTED_COUNTRIES.map(country => {
    const countryName = getCountryName(country);
    const isPriorityCountry = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'BR'].includes(country);
    
    return {
      loc: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/roblox`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: isPriorityCountry ? 0.9 : 0.8,
      title: `Buy Roblox Robux ${countryName} - Midasbuy Official`,
      description: `Buy Roblox Robux in ${countryName}. Best prices, instant delivery, secure payment. Trusted Robux seller in ${countryName}.`,
      alternates: [
        { hreflang: getHreflangForCountry(country), href: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/roblox` },
        { hreflang: 'x-default', href: `${SEO_BASE_URL}/midasbuy/buy/roblox` }
      ]
    };
  });
};

// Generate country-specific Valorant pages
export const generateCountryValorantPages = (): SitemapUrl[] => {
  return SUPPORTED_COUNTRIES.map(country => {
    const countryName = getCountryName(country);
    const isPriorityCountry = ['US', 'KR', 'JP', 'BR', 'TR', 'DE', 'FR'].includes(country);
    
    return {
      loc: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/valorant`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: isPriorityCountry ? 0.9 : 0.8,
      title: `Buy Valorant Points VP ${countryName} - Midasbuy Official`,
      description: `Buy Valorant Points (VP) in ${countryName}. Best prices, instant delivery, secure payment. Trusted VP seller in ${countryName}.`,
      alternates: [
        { hreflang: getHreflangForCountry(country), href: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/valorant` },
        { hreflang: 'x-default', href: `${SEO_BASE_URL}/midasbuy/buy/valorant` }
      ]
    };
  });
};

// Generate country-specific BGMI pages - INDIA ONLY (BGMI is exclusive to India)
export const generateCountryBGMIPages = (): SitemapUrl[] => {
  // BGMI is only available in India, so we only generate for IN
  return [{
    loc: `${SEO_BASE_URL}/midasbuy/in/buy/bgmi`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily' as const,
    priority: 0.95,
    title: `BGMI UC India | Midasbuy`,
    description: `Buy BGMI UC in India. Battlegrounds Mobile India UC at best prices. Instant INR delivery, secure UPI payment.`,
    alternates: [
      { hreflang: 'en-in', href: `${SEO_BASE_URL}/midasbuy/in/buy/bgmi` },
      { hreflang: 'x-default', href: `${SEO_BASE_URL}/midasbuy/in/buy/bgmi` }
    ]
  }];
};

// Generate country-specific Honor of Kings pages
export const generateCountryHonorOfKingsPages = (): SitemapUrl[] => {
  return SUPPORTED_COUNTRIES.map(country => {
    const countryName = getCountryName(country);
    const isPriorityCountry = ['CN', 'TW', 'HK', 'MY', 'SG', 'TH', 'VN'].includes(country);
    
    return {
      loc: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/honorofkings`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: isPriorityCountry ? 0.9 : 0.75,
      title: `Buy Honor of Kings Tokens ${countryName} - Midasbuy Official`,
      description: `Buy Honor of Kings tokens in ${countryName}. Best prices, instant delivery, secure payment. Trusted HOK seller in ${countryName}.`,
      alternates: [
        { hreflang: getHreflangForCountry(country), href: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}/buy/honorofkings` },
        { hreflang: 'x-default', href: `${SEO_BASE_URL}/midasbuy/buy/honorofkings` }
      ]
    };
  });
};

// Generate country-specific Home pages
export const generateCountryHomePages = (): SitemapUrl[] => {
  return SUPPORTED_COUNTRIES.map(country => {
    const countryName = getCountryName(country);
    const isPriorityCountry = ['US', 'GB', 'DE', 'PK', 'IN', 'SA', 'AE', 'AU', 'BR', 'ID'].includes(country);
    
    return {
      loc: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: isPriorityCountry ? 0.95 : 0.85,
      title: `Midasbuy ${countryName} - Buy Gaming Credits & Top Up`,
      description: `Midasbuy ${countryName} official store. Buy PUBG UC, Free Fire Diamonds, Roblox Robux & more gaming credits at best prices in ${countryName}.`,
      alternates: [
        { hreflang: getHreflangForCountry(country), href: `${SEO_BASE_URL}/midasbuy/${country.toLowerCase()}` },
        { hreflang: 'x-default', href: `${SEO_BASE_URL}/` }
      ]
    };
  });
};

// Generate all sitemap URLs
export const getAllSitemapUrls = (): SitemapUrl[] => {
  return [
    ...MAIN_PAGES,
    ...generateCountryHomePages(),
    ...generateCountryPubgPages(),
    ...generateCountryFreeFirePages(),
    ...generateCountryRobloxPages(),
    ...generateCountryValorantPages(),
    ...generateCountryBGMIPages(),
    ...generateCountryHonorOfKingsPages()
  ];
};

// Generate sitemap XML
export const generateSitemap = (): string => {
  const allUrls = getAllSitemapUrls();
  
  const urlsXml = allUrls.map(page => {
    let alternatesXml = '';
    if (page.alternates && page.alternates.length > 0) {
      alternatesXml = page.alternates.map(alt => 
        `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
      ).join('');
    }
    
    return `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${alternatesXml}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlsXml}
</urlset>`;
};

// Generate robots.txt for better crawling
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SEO_BASE_URL}/sitemap.xml

# Crawl-delay for better server performance
Crawl-delay: 1

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Disallow admin and sensitive areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /auth/
Disallow: /*.json$
Disallow: /*?*`;
};

/**
 * Country to Language Mapping Utility
 * Maps country codes to their primary language codes for automatic website localization
 */

// Country code to primary/default language code mapping
// NOTE: Some countries have LOCAL language as default, others have ENGLISH as default
export const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  // ===== MIDDLE EAST - Most have LOCAL (Arabic) as default =====
  sa: 'ar', // Saudi Arabia - Local Arabic
  ae: 'en', // UAE - English default
  qa: 'ar', // Qatar - Local Arabic
  kw: 'ar', // Kuwait - Local Arabic
  bh: 'ar', // Bahrain - Local Arabic
  om: 'ar', // Oman - Local Arabic
  ye: 'ar', // Yemen - Local Arabic
  iq: 'ar', // Iraq - Local Arabic
  jo: 'ar', // Jordan - Local Arabic
  lb: 'ar', // Lebanon - Local Arabic
  sy: 'ar', // Syria - Local Arabic
  ps: 'ar', // Palestine - Local Arabic
  eg: 'ar', // Egypt - Local Arabic
  ly: 'ar', // Libya - Local Arabic
  tn: 'ar', // Tunisia - Local Arabic
  dz: 'ar', // Algeria - Local Arabic
  ma: 'ar', // Morocco - Local Arabic
  sd: 'ar', // Sudan - Local Arabic
  mr: 'ar', // Mauritania - Arabic
  so: 'ar', // Somalia - Arabic
  dj: 'ar', // Djibouti - Arabic
  
  // ===== SOUTH ASIA - Mostly English default =====
  pk: 'en', // Pakistan - English default
  in: 'en', // India - English default
  bd: 'en', // Bangladesh - English default
  np: 'en', // Nepal - English default
  lk: 'en', // Sri Lanka - English default
  bt: 'en', // Bhutan - English default
  mv: 'en', // Maldives - English default
  af: 'ps', // Afghanistan - Local Pashto
  
  // ===== SOUTHEAST ASIA =====
  id: 'id', // Indonesia - Local Indonesian
  my: 'en', // Malaysia - English default
  sg: 'en', // Singapore - English default
  th: 'th', // Thailand - Local Thai
  vn: 'en', // Vietnam - English default
  ph: 'en', // Philippines - English default
  kh: 'en', // Cambodia - English default
  la: 'en', // Laos - English default
  mm: 'en', // Myanmar/Burma - English default
  bn: 'en', // Brunei - English default
  tl: 'en', // Timor-Leste - English default
  
  // ===== EAST ASIA =====
  cn: 'zh', // China - Local Chinese
  tw: 'zh', // Taiwan - Local Chinese
  hk: 'zh', // Hong Kong - Local Chinese
  mo: 'zh', // Macau - Local Chinese
  jp: 'ja', // Japan - Local Japanese
  kr: 'ko', // South Korea - Local Korean
  kp: 'ko', // North Korea - Local Korean
  mn: 'en', // Mongolia - English default
  
  // ===== CENTRAL ASIA - All LOCAL default =====
  kz: 'kk', // Kazakhstan - Local Kazakh
  uz: 'uz', // Uzbekistan - Local Uzbek
  tm: 'tk', // Turkmenistan - Local Turkmen
  kg: 'ky', // Kyrgyzstan - Local Kyrgyz
  tj: 'tg', // Tajikistan - Local Tajik
  
  // ===== CAUCASUS =====
  am: 'en', // Armenia - English default
  az: 'az', // Azerbaijan - Local Azerbaijani
  ge: 'en', // Georgia - English default
  
  // ===== RUSSIA & CIS =====
  ru: 'ru', // Russia - Local Russian
  by: 'be', // Belarus - Local Belarusian
  ua: 'en', // Ukraine - English default
  md: 'ro', // Moldova - Local Romanian
  
  // ===== TURKEY =====
  tr: 'tr', // Turkey - Local Turkish
  
  // ===== WESTERN EUROPE =====
  gb: 'en', // United Kingdom - English
  ie: 'en', // Ireland - English
  fr: 'fr', // France - Local French
  de: 'de', // Germany - Local German
  at: 'de', // Austria - Local German
  ch: 'de', // Switzerland - Local German
  es: 'es', // Spain - Local Spanish
  pt: 'en', // Portugal - English default
  it: 'en', // Italy - English default
  nl: 'en', // Netherlands - English default
  be: 'en', // Belgium - English default
  lu: 'en', // Luxembourg - English default
  
  // ===== NORTHERN EUROPE =====
  se: 'en', // Sweden - English default
  no: 'en', // Norway - English default
  dk: 'en', // Denmark - English default
  fi: 'en', // Finland - English default
  is: 'en', // Iceland - English default
  
  // ===== EASTERN EUROPE =====
  pl: 'en', // Poland - English default
  cz: 'en', // Czechia - English default
  sk: 'en', // Slovakia - English default
  hu: 'en', // Hungary - English default
  ro: 'en', // Romania - English default
  bg: 'en', // Bulgaria - English default
  hr: 'en', // Croatia - English default
  si: 'en', // Slovenia - English default
  rs: 'sr', // Serbia - Local Serbian
  me: 'en', // Montenegro - English default
  mk: 'en', // North Macedonia - English default
  ba: 'en', // Bosnia - English default
  al: 'en', // Albania - English default
  xk: 'en', // Kosovo - English default
  
  // ===== BALTIC =====
  ee: 'en', // Estonia - English default
  lv: 'lv', // Latvia - Local Latvian
  lt: 'en', // Lithuania - English default
  
  // ===== GREECE & CYPRUS & MALTA =====
  gr: 'en', // Greece - English default
  cy: 'en', // Cyprus - English default
  mt: 'en', // Malta - English default
  
  // ===== ISRAEL =====
  il: 'en', // Israel - English default
  
  // ===== NORTH AMERICA =====
  us: 'en', // United States - English
  ca: 'en', // Canada - English default
  mx: 'es', // Mexico - Local Spanish
  
  // ===== CENTRAL AMERICA =====
  gt: 'es', // Guatemala - Spanish
  bz: 'en', // Belize - English
  sv: 'es', // El Salvador - Spanish
  hn: 'es', // Honduras - Spanish
  ni: 'es', // Nicaragua - Spanish
  cr: 'es', // Costa Rica - Spanish
  pa: 'es', // Panama - Spanish
  
  // ===== CARIBBEAN =====
  cu: 'es', // Cuba - Spanish
  do: 'es', // Dominican Republic - Spanish
  ht: 'fr', // Haiti - French
  jm: 'en', // Jamaica - English
  bs: 'en', // Bahamas - English
  bb: 'en', // Barbados - English
  tt: 'en', // Trinidad - English
  pr: 'es', // Puerto Rico - Spanish
  
  // ===== SOUTH AMERICA =====
  br: 'pt', // Brazil - Local Portuguese
  ar: 'es', // Argentina - Spanish
  cl: 'es', // Chile - Local Spanish
  co: 'es', // Colombia - Local Spanish
  pe: 'en', // Peru - English default
  ve: 'es', // Venezuela - Spanish
  ec: 'es', // Ecuador - Spanish
  bo: 'es', // Bolivia - Spanish
  py: 'es', // Paraguay - Spanish
  uy: 'es', // Uruguay - Spanish
  gy: 'en', // Guyana - English
  sr: 'nl', // Suriname - Dutch
  gf: 'fr', // French Guiana - French
  
  // ===== AFRICA - English Speaking =====
  za: 'en', // South Africa - English default
  ng: 'en', // Nigeria - English default
  ke: 'sw', // Kenya - Local Swahili
  gh: 'en', // Ghana - English
  tz: 'sw', // Tanzania - Swahili
  ug: 'en', // Uganda - English
  zw: 'en', // Zimbabwe - English
  zm: 'en', // Zambia - English
  bw: 'en', // Botswana - English
  na: 'en', // Namibia - English
  rw: 'rw', // Rwanda - Kinyarwanda
  mw: 'en', // Malawi - English
  lr: 'en', // Liberia - English
  sl: 'en', // Sierra Leone - English
  gm: 'en', // Gambia - English
  mu: 'en', // Mauritius - English default
  sc: 'en', // Seychelles - English
  sz: 'en', // Eswatini - English
  ls: 'en', // Lesotho - English
  
  // ===== AFRICA - French Speaking =====
  sn: 'fr', // Senegal - French
  ci: 'fr', // Ivory Coast - French
  ml: 'fr', // Mali - French
  bf: 'fr', // Burkina Faso - French
  ne: 'fr', // Niger - French
  tg: 'fr', // Togo - French
  bj: 'fr', // Benin - French
  gn: 'fr', // Guinea - French
  mg: 'mg', // Madagascar - Malagasy
  cm: 'fr', // Cameroon - French
  cd: 'fr', // DR Congo - French
  cg: 'fr', // Congo - French
  ga: 'fr', // Gabon - French
  td: 'fr', // Chad - French
  cf: 'fr', // Central African Republic - French
  gw: 'fr', // Guinea-Bissau - French
  gq: 'fr', // Equatorial Guinea - French
  bi: 'fr', // Burundi - French
  
  // ===== AFRICA - Portuguese Speaking =====
  ao: 'pt', // Angola - Portuguese
  mz: 'pt', // Mozambique - Portuguese
  cv: 'pt', // Cape Verde - Portuguese
  st: 'pt', // São Tomé - Portuguese
  
  // ===== AFRICA - Other =====
  et: 'am', // Ethiopia - Amharic
  er: 'ti', // Eritrea - Tigrinya
  ss: 'en', // South Sudan - English
  
  // ===== OCEANIA =====
  au: 'en', // Australia - English default
  nz: 'en', // New Zealand - English default
  fj: 'en', // Fiji - English
  pg: 'en', // Papua New Guinea - English
  sb: 'en', // Solomon Islands - English
  vu: 'en', // Vanuatu - English
  ws: 'sm', // Samoa - Samoan
  to: 'to', // Tonga - Tongan
  fm: 'en', // Micronesia - English
  pw: 'en', // Palau - English
  mh: 'en', // Marshall Islands - English
  ki: 'en', // Kiribati - English
  tv: 'en', // Tuvalu - English
  nr: 'en', // Nauru - English
  
  // ===== IRAN =====
  ir: 'fa', // Iran - Local Persian/Farsi
};

// Country's NATIVE language (for showing as 2nd option in language selector)
export const COUNTRY_NATIVE_LANGUAGE: Record<string, string> = {
  // Middle East (Arabic)
  sa: 'ar', ae: 'ar', qa: 'ar', kw: 'ar', bh: 'ar', om: 'ar', ye: 'ar', iq: 'ar',
  jo: 'ar', lb: 'ar', sy: 'ar', ps: 'ar', eg: 'ar', ly: 'ar', tn: 'ar', dz: 'ar',
  ma: 'ar', sd: 'ar', mr: 'ar', so: 'ar', dj: 'ar', km: 'ar',
  
  // South Asia
  pk: 'ur', in: 'hi', bd: 'bn', np: 'ne', lk: 'si', bt: 'dz', mv: 'dv', af: 'ps',
  
  // Southeast Asia
  id: 'id', my: 'ms', sg: 'en', th: 'th', vn: 'vi', ph: 'tl', kh: 'km', la: 'lo',
  mm: 'my', bn: 'ms', tl: 'pt',
  
  // East Asia
  cn: 'zh', tw: 'zh', hk: 'zh', mo: 'zh', jp: 'ja', kr: 'ko', kp: 'ko', mn: 'mn',
  
  // Central Asia (native languages)
  kz: 'kk', uz: 'uz', tm: 'tk', kg: 'ky', tj: 'tg',
  
  // Caucasus (native languages)
  am: 'hy', az: 'az', ge: 'ka',
  
  // Russia & CIS
  ru: 'ru', by: 'be', ua: 'uk', md: 'ro',
  
  // Turkey
  tr: 'tr',
  
  // Western Europe
  gb: 'en', ie: 'en', fr: 'fr', de: 'de', at: 'de', ch: 'de', es: 'es', pt: 'pt',
  it: 'it', nl: 'nl', be: 'nl', lu: 'fr',
  
  // Northern Europe
  se: 'sv', no: 'no', dk: 'da', fi: 'fi', is: 'is',
  
  // Eastern Europe (native languages)
  pl: 'pl', cz: 'cs', sk: 'sk', hu: 'hu', ro: 'ro', bg: 'bg', hr: 'hr', si: 'sl',
  rs: 'sr', me: 'sr', mk: 'mk', ba: 'bs', al: 'sq', xk: 'sq',
  
  // Baltic
  ee: 'et', lv: 'lv', lt: 'lt',
  
  // Greece & Cyprus & Malta
  gr: 'el', cy: 'el', mt: 'mt',
  
  // Israel
  il: 'he',
  
  // North/Central America
  us: 'en', ca: 'en', mx: 'es', gt: 'es', bz: 'en', sv: 'es', hn: 'es', ni: 'es', 
  cr: 'es', pa: 'es',
  
  // Caribbean
  cu: 'es', do: 'es', ht: 'fr', jm: 'en', bs: 'en', bb: 'en', tt: 'en', pr: 'es',
  
  // South America
  br: 'pt', ar: 'es', cl: 'es', co: 'es', pe: 'es', ve: 'es', ec: 'es', bo: 'es',
  py: 'es', uy: 'es', gy: 'en', sr: 'nl', gf: 'fr',
  
  // Africa - English speaking (native is English)
  za: 'en', ng: 'en', ke: 'en', gh: 'en', tz: 'sw', ug: 'en', zw: 'en', zm: 'en',
  bw: 'en', na: 'en', rw: 'rw', mw: 'en', lr: 'en', sl: 'en', gm: 'en', mu: 'en',
  sc: 'en', sz: 'en', ls: 'en',
  
  // Africa - French speaking
  sn: 'fr', ci: 'fr', ml: 'fr', bf: 'fr', ne: 'fr', tg: 'fr', bj: 'fr', gn: 'fr',
  mg: 'mg', cm: 'fr', cd: 'fr', cg: 'fr', ga: 'fr', td: 'fr', cf: 'fr', gw: 'fr',
  gq: 'fr', bi: 'fr',
  
  // Africa - Portuguese speaking
  ao: 'pt', mz: 'pt', cv: 'pt', st: 'pt',
  
  // Africa - Other
  et: 'am', er: 'ti', ss: 'en',
  
  // Oceania
  au: 'en', nz: 'en', fj: 'en', pg: 'en', sb: 'en', vu: 'en', ws: 'sm', to: 'to',
  fm: 'en', pw: 'en', mh: 'en', ki: 'en', tv: 'en', nr: 'en',
  
  // Iran
  ir: 'fa',
};

/**
 * Get the native language for a country (for showing as 2nd option)
 */
export const getNativeLanguageForCountry = (countryCode: string): string => {
  const code = countryCode?.toLowerCase();
  return COUNTRY_NATIVE_LANGUAGE[code] || 'en';
};

// Supported languages in the system with their display names - 100+ global languages
export const SUPPORTED_LANGUAGES = [
  // Global default
  { code: 'en', name: 'English', nativeName: 'English', shortName: 'EN' },
  
  // RTL Languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', shortName: 'AR', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', shortName: 'UR', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', shortName: 'HE', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', shortName: 'FA', rtl: true },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', shortName: 'PS', rtl: true },
  
  // South Asian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', shortName: 'HI' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', shortName: 'BN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', shortName: 'NE' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', shortName: 'SI' },
  { code: 'dz', name: 'Dzongkha', nativeName: 'རྫོང་ཁ', shortName: 'DZ' },
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', shortName: 'DV', rtl: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', shortName: 'TA' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', shortName: 'TE' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', shortName: 'MR' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', shortName: 'GU' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', shortName: 'PA' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', shortName: 'KN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', shortName: 'ML' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', shortName: 'OR' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', shortName: 'AS' },
  
  // East Asian Languages
  { code: 'zh', name: 'Chinese', nativeName: '中文', shortName: 'ZH' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', shortName: 'JA' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', shortName: 'KO' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', shortName: 'MN' },
  
  // Southeast Asian Languages
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', shortName: 'ID' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', shortName: 'MS' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', shortName: 'TH' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', shortName: 'VI' },
  { code: 'tl', name: 'Filipino', nativeName: 'Tagalog', shortName: 'TL' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', shortName: 'KM' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', shortName: 'LO' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', shortName: 'MY' },
  
  // Central Asian Languages
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', shortName: 'KK' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', shortName: 'UZ' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', shortName: 'TK' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', shortName: 'KY' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', shortName: 'TG' },
  
  // Caucasian Languages
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', shortName: 'HY' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', shortName: 'AZ' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', shortName: 'KA' },
  
  // Slavic Languages
  { code: 'ru', name: 'Russian', nativeName: 'Русский', shortName: 'RU' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', shortName: 'UK' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', shortName: 'BE' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', shortName: 'PL' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', shortName: 'CS' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', shortName: 'SK' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', shortName: 'BG' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', shortName: 'HR' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', shortName: 'SR' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', shortName: 'SL' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', shortName: 'MK' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', shortName: 'BS' },
  
  // Western European Languages
  { code: 'de', name: 'German', nativeName: 'Deutsch', shortName: 'DE' },
  { code: 'fr', name: 'French', nativeName: 'Français', shortName: 'FR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', shortName: 'ES' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', shortName: 'PT' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', shortName: 'IT' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', shortName: 'NL' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', shortName: 'CA' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', shortName: 'GL' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', shortName: 'EU' },
  
  // Nordic Languages
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', shortName: 'SV' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', shortName: 'NO' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', shortName: 'DA' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', shortName: 'FI' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', shortName: 'IS' },
  { code: 'fo', name: 'Faroese', nativeName: 'Føroyskt', shortName: 'FO' },
  
  // Baltic Languages
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', shortName: 'ET' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', shortName: 'LV' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', shortName: 'LT' },
  
  // Other European Languages
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', shortName: 'EL' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', shortName: 'SQ' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', shortName: 'RO' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', shortName: 'HU' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', shortName: 'TR' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', shortName: 'MT' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', shortName: 'GA' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', shortName: 'CY' },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', shortName: 'GD' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', shortName: 'LB' },
  
  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', shortName: 'SW' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', shortName: 'AM' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', shortName: 'TI' },
  { code: 'om', name: 'Oromo', nativeName: 'Oromoo', shortName: 'OM' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', shortName: 'SO' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', shortName: 'HA' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', shortName: 'YO' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', shortName: 'IG' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', shortName: 'ZU' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', shortName: 'XH' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', shortName: 'AF' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda', shortName: 'RW' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', shortName: 'MG' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', shortName: 'SN' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', shortName: 'NY' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof', shortName: 'WO' },
  { code: 'ff', name: 'Fulah', nativeName: 'Fulfulde', shortName: 'FF' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála', shortName: 'LN' },
  
  // Oceania Languages
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', shortName: 'MI' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', shortName: 'SM' },
  { code: 'to', name: 'Tongan', nativeName: 'Lea Faka-Tonga', shortName: 'TO' },
  { code: 'fj', name: 'Fijian', nativeName: 'Vosa Vakaviti', shortName: 'FJ' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', shortName: 'HAW' },
  
  // Additional Global Languages
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', shortName: 'EO' },
  { code: 'la', name: 'Latin', nativeName: 'Latina', shortName: 'LA' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', shortName: 'KU' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'سۆرانی', shortName: 'CKB', rtl: true },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', shortName: 'SD', rtl: true },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', shortName: 'UG', rtl: true },
];

/**
 * Get the default language for a country
 * @param countryCode - Two-letter country code (e.g., 'pk', 'sa')
 * @returns Language code (e.g., 'ur', 'ar')
 */
export const getLanguageForCountry = (countryCode: string): string => {
  const code = countryCode?.toLowerCase();
  return COUNTRY_LANGUAGE_MAP[code] || 'en';
};

/**
 * Check if a language uses RTL (Right-to-Left) layout
 * @param languageCode - Two-letter language code
 * @returns boolean
 */
export const isRTLLanguage = (languageCode: string): boolean => {
  const rtlLanguages = ['ar', 'ur', 'he', 'fa', 'ps', 'sd', 'dv', 'ckb', 'ug'];
  return rtlLanguages.includes(languageCode?.toLowerCase());
};

/**
 * Get language display info
 * @param languageCode - Two-letter language code
 * @returns Language info object
 */
export const getLanguageInfo = (languageCode: string) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode) || SUPPORTED_LANGUAGES[0];
};

/**
 * Get all supported languages
 */
export const getSupportedLanguages = () => SUPPORTED_LANGUAGES;

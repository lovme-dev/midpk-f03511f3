// Complete exchange rates for 100+ currencies relative to USD
// Updated with approximate rates - in production, use real-time API

export const EXCHANGE_RATES: Record<string, number> = {
  // Base currency
  USD: 1.00,
  
  // ============== MAJOR CURRENCIES ==============
  EUR: 0.92,     // Euro
  GBP: 0.79,     // British Pound
  JPY: 149.50,   // Japanese Yen
  CHF: 0.88,     // Swiss Franc
  
  // ============== NORTH AMERICA ==============
  CAD: 1.36,     // Canadian Dollar
  MXN: 17.15,    // Mexican Peso
  
  // ============== SOUTH ASIA ==============
  PKR: 278.50,   // Pakistani Rupee
  INR: 83.12,    // Indian Rupee
  BDT: 109.75,   // Bangladeshi Taka
  NPR: 133.20,   // Nepalese Rupee
  LKR: 320.50,   // Sri Lankan Rupee
  AFN: 68.50,    // Afghan Afghani
  BTN: 83.12,    // Bhutanese Ngultrum (pegged to INR)
  MVR: 15.40,    // Maldivian Rufiyaa
  
  // ============== EUROPE ==============
  SEK: 10.45,    // Swedish Krona
  NOK: 10.85,    // Norwegian Krone
  DKK: 6.88,     // Danish Krone
  PLN: 3.98,     // Polish Złoty
  CZK: 22.85,    // Czech Koruna
  HUF: 358.50,   // Hungarian Forint
  RON: 4.58,     // Romanian Leu
  BGN: 1.80,     // Bulgarian Lev
  UAH: 41.25,    // Ukrainian Hryvnia
  BYN: 3.27,     // Belarusian Ruble
  MDL: 17.75,    // Moldovan Leu
  RSD: 107.50,   // Serbian Dinar
  ALL: 92.50,    // Albanian Lek
  MKD: 56.75,    // North Macedonian Denar
  BAM: 1.80,     // Bosnia-Herzegovina Mark
  ISK: 138.50,   // Icelandic Króna
  
  // ============== RUSSIA & CIS ==============
  RUB: 92.50,    // Russian Ruble
  KZT: 450.25,   // Kazakhstani Tenge
  UZS: 12450.00, // Uzbekistani Som
  TMT: 3.50,     // Turkmenistani Manat
  KGS: 89.25,    // Kyrgyzstani Som
  TJS: 10.95,    // Tajikistani Somoni
  AMD: 405.50,   // Armenian Dram
  AZN: 1.70,     // Azerbaijani Manat
  GEL: 2.68,     // Georgian Lari
  
  // ============== MIDDLE EAST ==============
  TRY: 32.25,    // Turkish Lira
  SAR: 3.75,     // Saudi Riyal
  AED: 3.67,     // UAE Dirham
  EGP: 49.50,    // Egyptian Pound
  QAR: 3.64,     // Qatari Riyal
  KWD: 0.31,     // Kuwaiti Dinar
  BHD: 0.38,     // Bahraini Dinar
  OMR: 0.38,     // Omani Rial
  JOD: 0.71,     // Jordanian Dinar
  LBP: 89500.00, // Lebanese Pound
  IQD: 1310.00,  // Iraqi Dinar
  SYP: 13000.00, // Syrian Pound
  YER: 250.25,   // Yemeni Rial
  ILS: 3.62,     // Israeli Shekel
  IRR: 42050.00, // Iranian Rial
  
  // ============== EAST ASIA ==============
  CNY: 7.24,     // Chinese Yuan
  KRW: 1325.50,  // South Korean Won
  TWD: 31.85,    // Taiwan Dollar
  HKD: 7.82,     // Hong Kong Dollar
  MNT: 3450.00,  // Mongolian Tugrik
  
  // ============== SOUTHEAST ASIA ==============
  SGD: 1.34,     // Singapore Dollar
  MYR: 4.47,     // Malaysian Ringgit
  THB: 35.75,    // Thai Baht
  IDR: 15850.00, // Indonesian Rupiah
  PHP: 56.25,    // Philippine Peso
  VND: 24850.00, // Vietnamese Dong
  MMK: 2100.00,  // Myanmar Kyat
  KHR: 4050.00,  // Cambodian Riel
  LAK: 20750.00, // Lao Kip
  BND: 1.34,     // Brunei Dollar
  
  // ============== OCEANIA ==============
  AUD: 1.53,     // Australian Dollar
  NZD: 1.65,     // New Zealand Dollar
  PGK: 3.92,     // Papua New Guinean Kina
  FJD: 2.25,     // Fijian Dollar
  XPF: 109.75,   // CFP Franc
  
  // ============== SOUTH AMERICA ==============
  BRL: 4.95,     // Brazilian Real
  ARS: 875.00,   // Argentine Peso
  CLP: 925.50,   // Chilean Peso
  COP: 3975.00,  // Colombian Peso
  PEN: 3.72,     // Peruvian Sol
  VES: 36.50,    // Venezuelan Bolívar
  BOB: 6.91,     // Bolivian Boliviano
  PYG: 7350.00,  // Paraguayan Guarani
  UYU: 39.75,    // Uruguayan Peso
  GYD: 209.25,   // Guyanese Dollar
  SRD: 37.50,    // Surinamese Dollar
  
  // ============== CENTRAL AMERICA & CARIBBEAN ==============
  GTQ: 7.82,     // Guatemalan Quetzal
  HNL: 24.75,    // Honduran Lempira
  NIO: 36.75,    // Nicaraguan Córdoba
  CRC: 515.50,   // Costa Rican Colón
  PAB: 1.00,     // Panamanian Balboa (pegged to USD)
  BZD: 2.00,     // Belize Dollar
  JMD: 155.75,   // Jamaican Dollar
  TTD: 6.78,     // Trinidad and Tobago Dollar
  BBD: 2.00,     // Barbadian Dollar
  BSD: 1.00,     // Bahamian Dollar
  DOP: 58.75,    // Dominican Peso
  CUP: 24.00,    // Cuban Peso
  HTG: 132.50,   // Haitian Gourde
  XCD: 2.70,     // East Caribbean Dollar
  KYD: 0.83,     // Cayman Islands Dollar
  BMD: 1.00,     // Bermudian Dollar (pegged to USD)
  AWG: 1.79,     // Aruban Florin
  ANG: 1.79,     // Netherlands Antillean Guilder
  GIP: 0.79,     // Gibraltar Pound (pegged to GBP)
  
  // ============== AFRICA ==============
  ZAR: 18.75,    // South African Rand
  NGN: 1650.00,  // Nigerian Naira
  KES: 153.25,   // Kenyan Shilling
  GHS: 15.75,    // Ghanaian Cedi
  ETB: 56.50,    // Ethiopian Birr
  TZS: 2525.00,  // Tanzanian Shilling
  UGX: 3775.00,  // Ugandan Shilling
  DZD: 134.50,   // Algerian Dinar
  MAD: 10.05,    // Moroccan Dirham
  TND: 3.12,     // Tunisian Dinar
  LYD: 4.85,     // Libyan Dinar
  SDG: 601.00,   // Sudanese Pound
  SOS: 571.00,   // Somali Shilling
  RWF: 1275.00,  // Rwandan Franc
  ZMW: 26.75,    // Zambian Kwacha
  ZWL: 13500.00, // Zimbabwean Dollar
  MWK: 1685.00,  // Malawian Kwacha
  MZN: 63.75,    // Mozambican Metical
  BWP: 13.65,    // Botswana Pula
  NAD: 18.75,    // Namibian Dollar
  AOA: 825.50,   // Angolan Kwanza
  XAF: 603.50,   // Central African CFA Franc
  XOF: 603.50,   // West African CFA Franc
  GNF: 8600.00,  // Guinean Franc
  SLE: 22.50,    // Sierra Leonean Leone
  LRD: 192.50,   // Liberian Dollar
  MRU: 39.75,    // Mauritanian Ouguiya
  GMD: 67.50,    // Gambian Dalasi
  CDF: 2750.00,  // Congolese Franc
  MUR: 45.75,    // Mauritian Rupee
  SCR: 13.25,    // Seychellois Rupee
  KMF: 452.50,   // Comorian Franc
  CVE: 101.25,   // Cape Verdean Escudo
  DJF: 177.75,   // Djiboutian Franc
  ERN: 15.00,    // Eritrean Nakfa
  BIF: 2850.00,  // Burundian Franc
  LSL: 18.75,    // Lesotho Loti
  SZL: 18.75,    // Swazi Lilangeni
  STN: 22.50,    // São Tomé and Príncipe Dobra
};

// Get exchange rate for a currency
export const getExchangeRate = (currency: string): number => {
  return EXCHANGE_RATES[currency.toUpperCase()] || 1;
};

// Convert USD to target currency
export const convertUSDTo = (amountUSD: number, targetCurrency: string): number => {
  const rate = getExchangeRate(targetCurrency);
  return amountUSD * rate;
};

// Convert from any currency to USD
export const convertToUSD = (amount: number, fromCurrency: string): number => {
  const rate = getExchangeRate(fromCurrency);
  return amount / rate;
};

// Convert between any two currencies
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const usdAmount = convertToUSD(amount, fromCurrency);
  return convertUSDTo(usdAmount, toCurrency);
};

// Format price with currency
export const formatCurrencyPrice = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unsupported currencies
    return `${currency} ${amount.toFixed(2)}`;
  }
};

// Convert USD price and format for display
export const convertAndFormat = (priceUSD: number, targetCurrency: string): string => {
  const converted = convertUSDTo(priceUSD, targetCurrency);
  return formatCurrencyPrice(converted, targetCurrency);
};

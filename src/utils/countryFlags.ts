/**
 * Country Flag Utilities
 * Uses emoji flags instead of external CDN to avoid "Other error" in Google crawl
 * Emoji flags are universally supported and don't require network requests
 */

// Convert country code to emoji flag
export const getCountryFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) {
    return '🌍'; // Default globe for invalid codes
  }
  
  const code = countryCode.toUpperCase();
  const codePoints = code.split('').map(
    char => 0x1F1E6 + char.charCodeAt(0) - 'A'.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
};

// Map of country codes to their emoji flags (for fallback/reference)
export const COUNTRY_FLAG_MAP: Record<string, string> = {
  // South Asia
  PK: '🇵🇰',
  IN: '🇮🇳',
  BD: '🇧🇩',
  NP: '🇳🇵',
  LK: '🇱🇰',
  AF: '🇦🇫',
  BT: '🇧🇹',
  MV: '🇲🇻',
  
  // North America
  US: '🇺🇸',
  CA: '🇨🇦',
  MX: '🇲🇽',
  
  // Europe
  GB: '🇬🇧',
  DE: '🇩🇪',
  FR: '🇫🇷',
  IT: '🇮🇹',
  ES: '🇪🇸',
  PT: '🇵🇹',
  NL: '🇳🇱',
  BE: '🇧🇪',
  CH: '🇨🇭',
  AT: '🇦🇹',
  PL: '🇵🇱',
  CZ: '🇨🇿',
  SE: '🇸🇪',
  NO: '🇳🇴',
  DK: '🇩🇰',
  FI: '🇫🇮',
  IE: '🇮🇪',
  GR: '🇬🇷',
  RO: '🇷🇴',
  HU: '🇭🇺',
  SK: '🇸🇰',
  BG: '🇧🇬',
  HR: '🇭🇷',
  SI: '🇸🇮',
  RS: '🇷🇸',
  UA: '🇺🇦',
  BY: '🇧🇾',
  RU: '🇷🇺',
  TR: '🇹🇷',
  
  // Middle East
  SA: '🇸🇦',
  AE: '🇦🇪',
  QA: '🇶🇦',
  KW: '🇰🇼',
  BH: '🇧🇭',
  OM: '🇴🇲',
  JO: '🇯🇴',
  LB: '🇱🇧',
  SY: '🇸🇾',
  IQ: '🇮🇶',
  IR: '🇮🇷',
  IL: '🇮🇱',
  EG: '🇪🇬',
  
  // Asia Pacific
  CN: '🇨🇳',
  JP: '🇯🇵',
  KR: '🇰🇷',
  TW: '🇹🇼',
  HK: '🇭🇰',
  SG: '🇸🇬',
  MY: '🇲🇾',
  TH: '🇹🇭',
  VN: '🇻🇳',
  ID: '🇮🇩',
  PH: '🇵🇭',
  AU: '🇦🇺',
  NZ: '🇳🇿',
  
  // Africa
  ZA: '🇿🇦',
  NG: '🇳🇬',
  KE: '🇰🇪',
  GH: '🇬🇭',
  ET: '🇪🇹',
  TZ: '🇹🇿',
  UG: '🇺🇬',
  MA: '🇲🇦',
  DZ: '🇩🇿',
  TN: '🇹🇳',
  
  // Latin America
  BR: '🇧🇷',
  AR: '🇦🇷',
  CO: '🇨🇴',
  CL: '🇨🇱',
  PE: '🇵🇪',
  VE: '🇻🇪',
  EC: '🇪🇨',
  
  // Default
  GLOBAL: '🌍',
};

// Get flag - uses dynamic emoji generation, falls back to map
export const getFlag = (countryCode: string): string => {
  if (!countryCode) return '🌍';
  
  const code = countryCode.toUpperCase();
  
  // Try dynamic generation first
  const dynamicFlag = getCountryFlagEmoji(code);
  if (dynamicFlag && dynamicFlag !== '🌍') {
    return dynamicFlag;
  }
  
  // Fallback to map
  return COUNTRY_FLAG_MAP[code] || COUNTRY_FLAG_MAP.GLOBAL;
};

// Component-ready flag with proper styling class
export const getFlagWithStyle = (countryCode: string): { flag: string; className: string } => {
  return {
    flag: getFlag(countryCode),
    className: 'text-lg leading-none select-none',
  };
};

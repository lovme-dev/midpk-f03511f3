import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { COUNTRY_CONFIGS, getCountryCurrency } from './countryConfigs';
import { triggerCurrencyChangeEvent } from './currencyUtils';

/**
 * URL Currency Detector Hook
 * 
 * This hook extracts the country code from the URL and updates the currency system.
 * This is the PRIMARY method for determining currency in URL-based pricing.
 * 
 * Flow:
 * 1. User visits /midasbuy/pk/buy/pubgm
 * 2. This hook extracts 'pk' from the URL
 * 3. Looks up PKR currency for Pakistan
 * 4. Updates localStorage and triggers events
 * 5. All package grids show PKR prices
 * 
 * This ensures Google can index each country page with its correct prices,
 * since prices are determined by URL, not by IP detection.
 */
export const useCurrencyFromURL = () => {
  const { countryCode } = useParams<{ countryCode: string }>();

  useEffect(() => {
    if (countryCode) {
      const countryCodeUpper = countryCode.toUpperCase();
      const countryConfig = COUNTRY_CONFIGS[countryCodeUpper];
      
      if (countryConfig && countryConfig.currency) {
        // Update localStorage with country and currency from URL
        const countryData = {
          code: countryCode.toLowerCase(),
          currency: countryConfig.currency
        };
        
        localStorage.setItem('selectedCountry', JSON.stringify(countryData));
        
        // Trigger currency change event for reactive components
        triggerCurrencyChangeEvent(countryConfig.currency);
        
        // Dispatch country changed event
        const countryEvent = new CustomEvent('countryChanged');
        window.dispatchEvent(countryEvent);
        
        // Dispatch storage event for other listeners
        const storageEvent = new StorageEvent('storage', {
          key: 'selectedCountry',
          newValue: JSON.stringify(countryData)
        });
        window.dispatchEvent(storageEvent);
        
        console.log(`[URL Pricing] Country: ${countryCodeUpper}, Currency: ${countryConfig.currency}`);
      }
    }
  }, [countryCode]);
  
  // Return current country info for convenience
  return {
    countryCode: countryCode?.toUpperCase() || null,
    currency: countryCode ? COUNTRY_CONFIGS[countryCode.toUpperCase()]?.currency : null,
  };
};

// Get currency code from country code - now uses centralized configs
export const getCurrencyFromCountryCode = (countryCode: string): string => {
  return getCountryCurrency(countryCode);
};

// Complete map of currency symbols for display (100+ currencies)
export const getCurrencySymbol = (currencyCode: string): string => {
  const symbolMap: Record<string, string> = {
    // Major currencies
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CHF: 'CHF',
    
    // North America
    CAD: 'C$',
    MXN: 'MX$',
    
    // South Asia
    PKR: 'Rs',
    INR: '₹',
    BDT: '৳',
    NPR: 'Rs',
    LKR: 'Rs',
    AFN: '؋',
    BTN: 'Nu.',
    MVR: 'Rf',
    
    // Europe
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    UAH: '₴',
    BYN: 'Br',
    MDL: 'L',
    RSD: 'din',
    ALL: 'L',
    MKD: 'ден',
    BAM: 'KM',
    ISK: 'kr',
    
    // Russia & CIS
    RUB: '₽',
    KZT: '₸',
    UZS: "so'm",
    TMT: 'm',
    KGS: 'сом',
    TJS: 'SM',
    AMD: '֏',
    AZN: '₼',
    GEL: '₾',
    
    // Middle East
    TRY: '₺',
    SAR: 'ر.س',
    AED: 'د.إ',
    EGP: 'ج.م',
    QAR: 'ر.ق',
    KWD: 'د.ك',
    BHD: 'د.ب',
    OMR: 'ر.ع',
    JOD: 'د.ا',
    LBP: 'ل.ل',
    IQD: 'ع.د',
    SYP: '£S',
    YER: 'ر.ي',
    ILS: '₪',
    IRR: '﷼',
    
    // East Asia
    CNY: '¥',
    KRW: '₩',
    TWD: 'NT$',
    HKD: 'HK$',
    MNT: '₮',
    
    // Southeast Asia
    SGD: 'S$',
    MYR: 'RM',
    THB: '฿',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    MMK: 'K',
    KHR: '៛',
    LAK: '₭',
    BND: 'B$',
    
    // Oceania
    AUD: 'A$',
    NZD: 'NZ$',
    PGK: 'K',
    FJD: 'FJ$',
    XPF: '₣',
    
    // South America
    BRL: 'R$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    VES: 'Bs',
    BOB: 'Bs',
    PYG: '₲',
    UYU: '$U',
    GYD: 'G$',
    SRD: '$',
    
    // Central America & Caribbean
    GTQ: 'Q',
    HNL: 'L',
    NIO: 'C$',
    CRC: '₡',
    PAB: 'B/.',
    BZD: 'BZ$',
    JMD: 'J$',
    TTD: 'TT$',
    BBD: 'Bds$',
    BSD: 'B$',
    DOP: 'RD$',
    CUP: '₱',
    HTG: 'G',
    
    // Africa
    ZAR: 'R',
    NGN: '₦',
    KES: 'KSh',
    GHS: 'GH₵',
    ETB: 'Br',
    TZS: 'TSh',
    UGX: 'USh',
    DZD: 'د.ج',
    MAD: 'د.م.',
    TND: 'د.ت',
    LYD: 'ل.د',
    SDG: '£SD',
    SOS: 'Sh',
    RWF: 'FRw',
    ZMW: 'ZK',
    ZWL: 'Z$',
    MWK: 'MK',
    MZN: 'MT',
    BWP: 'P',
    NAD: 'N$',
    AOA: 'Kz',
    XAF: 'FCFA',
    XOF: 'CFA',
    GNF: 'FG',
    SLE: 'Le',
    LRD: 'L$',
    MRU: 'UM',
    GMD: 'D',
    CDF: 'FC',
    MUR: '₨',
    SCR: '₨',
    KMF: 'CF',
    CVE: '$',
    DJF: 'Fdj',
    ERN: 'Nfk',
    BIF: 'FBu',
    LSL: 'L',
    SZL: 'E',
    STN: 'Db',
  };
  
  return symbolMap[currencyCode] || currencyCode;
};
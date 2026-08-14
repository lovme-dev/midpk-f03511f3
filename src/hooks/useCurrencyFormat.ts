import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSelectedCountry } from '@/data/ucPackages';
import { EXCHANGE_RATES, getExchangeRate } from '@/utils/exchangeRates';
import { getCurrencySymbol } from '@/utils/urlCurrencyDetector';
import { COUNTRY_CONFIGS, getCountryConfig, getCountryCurrency } from '@/utils/countryConfigs';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

// Convert PKR price to any target currency
export const convertPkrToAnyCurrency = (pkrPrice: number, targetCurrency: string): number => {
  if (targetCurrency === 'PKR') return pkrPrice;
  
  // First convert PKR to USD, then USD to target currency
  const pkrRate = EXCHANGE_RATES['PKR'] || 278.50;
  const usdPrice = pkrPrice / pkrRate;
  
  if (targetCurrency === 'USD') return usdPrice;
  
  const targetRate = EXCHANGE_RATES[targetCurrency] || 1;
  return usdPrice * targetRate;
};

// High value currencies that don't need decimals
const HIGH_VALUE_CURRENCIES = [
  'IDR', 'VND', 'KRW', 'JPY', 'CLP', 'COP', 'UZS', 'LBP', 'IRR', 'IQD', 
  'KHR', 'LAK', 'MMK', 'MNT', 'PYG', 'UGX', 'TZS', 'NGN', 'ZWL', 'BIF', 
  'CDF', 'GNF', 'KMF', 'RWF', 'SYP', 'YER', 'DJF', 'SOS', 'MWK', 'XAF', 'XOF'
];

// Arabic currencies that put symbol after
const POST_SYMBOL_CURRENCIES = [
  'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'LBP', 'IQD', 
  'SYP', 'YER', 'DZD', 'MAD', 'TND', 'LYD'
];

// Format price with proper currency symbol and locale
export const formatPriceWithCurrency = (price: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const decimals = HIGH_VALUE_CURRENCIES.includes(currencyCode) ? 0 : 2;
  
  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  if (POST_SYMBOL_CURRENCIES.includes(currencyCode)) {
    return `${formattedPrice} ${symbol}`;
  }
  
  return `${symbol}${formattedPrice}`;
};

// Full conversion and formatting function
export const convertAndFormatFromPKR = (pkrPrice: number, targetCurrency: string): string => {
  const convertedPrice = convertPkrToAnyCurrency(pkrPrice, targetCurrency);
  return formatPriceWithCurrency(convertedPrice, targetCurrency);
};

/**
 * Get currency from URL country code
 * This is the PRIMARY method for determining currency in URL-based pricing
 */
const getCurrencyFromURL = (urlCountryCode: string | undefined): string | null => {
  if (!urlCountryCode) return null;
  
  const countryCodeUpper = urlCountryCode.toUpperCase();
  const config = COUNTRY_CONFIGS[countryCodeUpper];
  
  if (config?.currency) {
    return config.currency;
  }
  
  return getCountryCurrency(countryCodeUpper);
};

/**
 * Hook for reactive currency formatting
 * 
 * PRIORITY ORDER for determining currency:
 * 1. overrideCountry prop (explicit from parent component)
 * 2. URL country code parameter (/midasbuy/:countryCode/...)
 * 3. localStorage selectedCountry (fallback)
 * 4. Default to PKR
 */
export const useCurrencyFormat = (overrideCountry?: { code?: string; currency?: string; [key: string]: any }) => {
  // Try to get country code from URL
  const params = useParams<{ countryCode?: string }>();
  const urlCountryCode = params.countryCode;
  
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(() => {
    // Priority 1: Override country
    if (overrideCountry?.currency) {
      return {
        code: overrideCountry.currency,
        symbol: getCurrencySymbol(overrideCountry.currency),
        rate: getExchangeRate(overrideCountry.currency),
      };
    }
    
    // Priority 2: URL country code (for SEO-friendly pricing)
    const urlCurrency = getCurrencyFromURL(urlCountryCode);
    if (urlCurrency) {
      return {
        code: urlCurrency,
        symbol: getCurrencySymbol(urlCurrency),
        rate: getExchangeRate(urlCurrency),
      };
    }
    
    // Priority 3: localStorage
    const country = getSelectedCountry();
    return {
      code: country.currency,
      symbol: getCurrencySymbol(country.currency),
      rate: getExchangeRate(country.currency),
    };
  });

  // Update when URL country code or override changes
  useEffect(() => {
    // Priority 1: Override country
    if (overrideCountry?.currency) {
      setCurrencyInfo({
        code: overrideCountry.currency,
        symbol: getCurrencySymbol(overrideCountry.currency),
        rate: getExchangeRate(overrideCountry.currency),
      });
      return;
    }
    
    // Priority 2: URL country code
    const urlCurrency = getCurrencyFromURL(urlCountryCode);
    if (urlCurrency) {
      setCurrencyInfo({
        code: urlCurrency,
        symbol: getCurrencySymbol(urlCurrency),
        rate: getExchangeRate(urlCurrency),
      });
      
      // Also update localStorage for consistency
      const countryData = {
        code: urlCountryCode?.toLowerCase() || 'pk',
        currency: urlCurrency,
      };
      localStorage.setItem('selectedCountry', JSON.stringify(countryData));
      return;
    }
  }, [urlCountryCode, overrideCountry]);

  // Listen for manual country/currency changes
  useEffect(() => {
    const updateCurrency = () => {
      // Don't override URL-based currency
      if (urlCountryCode) return;
      if (overrideCountry?.currency) return;
      
      const country = getSelectedCountry();
      setCurrencyInfo({
        code: country.currency,
        symbol: getCurrencySymbol(country.currency),
        rate: getExchangeRate(country.currency),
      });
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCountry') {
        updateCurrency();
      }
    };

    const handleCountryChanged = () => {
      updateCurrency();
    };

    const handleCurrencyChange = () => {
      updateCurrency();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('countryChanged', handleCountryChanged);
    window.addEventListener('currencyChange', handleCurrencyChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('countryChanged', handleCountryChanged);
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, [urlCountryCode, overrideCountry]);

  // Helper functions bound to current currency
  const formatPrice = (pkrPrice: number): string => {
    return convertAndFormatFromPKR(pkrPrice, currencyInfo.code);
  };

  const convertPrice = (pkrPrice: number): number => {
    return convertPkrToAnyCurrency(pkrPrice, currencyInfo.code);
  };

  return {
    currencyCode: currencyInfo.code,
    currencySymbol: currencyInfo.symbol,
    exchangeRate: currencyInfo.rate,
    formatPrice,
    convertPrice,
    formatPriceWithCurrency,
    convertAndFormatFromPKR,
  };
};

export default useCurrencyFormat;

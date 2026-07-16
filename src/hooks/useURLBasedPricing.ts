import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { COUNTRY_CONFIGS, getCountryCurrency, getCountryConfig } from '@/utils/countryConfigs';
import { EXCHANGE_RATES, getExchangeRate } from '@/utils/exchangeRates';
import { getCurrencySymbol } from '@/utils/urlCurrencyDetector';
import { triggerCurrencyChangeEvent } from '@/utils/currencyUtils';

interface URLPricingConfig {
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  countryName: string;
}

// High value currencies that don't need decimal places
const HIGH_VALUE_CURRENCIES = [
  'IDR', 'VND', 'KRW', 'JPY', 'CLP', 'COP', 'UZS', 'LBP', 'IRR', 'IQD', 
  'KHR', 'LAK', 'MMK', 'MNT', 'PYG', 'UGX', 'TZS', 'NGN', 'ZWL', 'BIF', 
  'CDF', 'GNF', 'KMF', 'RWF', 'SYP', 'YER', 'DJF', 'SOS', 'MWK', 'XAF', 'XOF'
];

// Arabic currencies that put symbol after number
const POST_SYMBOL_CURRENCIES = [
  'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'LBP', 'IQD', 
  'SYP', 'YER', 'DZD', 'MAD', 'TND', 'LYD'
];

/**
 * URL-Based Pricing Hook
 * 
 * This hook determines pricing based on the URL's country code parameter,
 * NOT based on IP detection. This ensures:
 * 1. SEO-friendly - Google can index each country page with correct prices
 * 2. Consistent - Same URL always shows same prices
 * 3. User control - Changing URL/flag changes prices predictably
 * 
 * IP detection is only used for initial redirect to the correct country URL.
 */
export const useURLBasedPricing = (overrideCountry?: { code: string; currency: string }) => {
  const { countryCode: urlCountryCode } = useParams<{ countryCode: string }>();
  
  // Determine the active country code - priority: override > URL > default
  const activeCountryCode = useMemo(() => {
    if (overrideCountry?.code) {
      return overrideCountry.code.toUpperCase();
    }
    if (urlCountryCode) {
      return urlCountryCode.toUpperCase();
    }
    // Fallback to stored country or default
    try {
      const saved = localStorage.getItem('selectedCountry');
      if (saved) {
        const parsed = JSON.parse(saved);
        return (parsed.code || 'US').toUpperCase();
      }
    } catch {
      // Ignore parse errors
    }
    return 'US';
  }, [urlCountryCode, overrideCountry]);

  // Build pricing config from country code
  const pricingConfig = useMemo<URLPricingConfig>(() => {
    const countryConfig = getCountryConfig(activeCountryCode);
    const currencyCode = overrideCountry?.currency || countryConfig.currency || 'USD';
    
    return {
      countryCode: activeCountryCode,
      currencyCode,
      currencySymbol: getCurrencySymbol(currencyCode),
      exchangeRate: getExchangeRate(currencyCode),
      countryName: countryConfig.name || activeCountryCode,
    };
  }, [activeCountryCode, overrideCountry]);

  // Update localStorage and trigger events when URL country changes
  useEffect(() => {
    if (urlCountryCode) {
      const countryData = {
        code: activeCountryCode.toLowerCase(),
        currency: pricingConfig.currencyCode,
      };
      
      localStorage.setItem('selectedCountry', JSON.stringify(countryData));
      triggerCurrencyChangeEvent(pricingConfig.currencyCode);
      
      // Dispatch country changed event for other components
      window.dispatchEvent(new CustomEvent('countryChanged'));
    }
  }, [urlCountryCode, activeCountryCode, pricingConfig.currencyCode]);

  /**
   * Convert PKR price to the URL country's currency
   * Our base prices are in PKR, so we convert to the target currency
   */
  const convertFromPKR = (pkrPrice: number): number => {
    if (pricingConfig.currencyCode === 'PKR') return pkrPrice;
    
    // PKR to USD first
    const pkrRate = EXCHANGE_RATES['PKR'] || 278.50;
    const usdPrice = pkrPrice / pkrRate;
    
    if (pricingConfig.currencyCode === 'USD') return usdPrice;
    
    // USD to target currency
    return usdPrice * pricingConfig.exchangeRate;
  };

  /**
   * Format a price with the URL country's currency symbol
   */
  const formatPrice = (pkrPrice: number): string => {
    const converted = convertFromPKR(pkrPrice);
    const decimals = HIGH_VALUE_CURRENCIES.includes(pricingConfig.currencyCode) ? 0 : 2;
    
    const formattedPrice = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    if (POST_SYMBOL_CURRENCIES.includes(pricingConfig.currencyCode)) {
      return `${formattedPrice} ${pricingConfig.currencySymbol}`;
    }
    
    return `${pricingConfig.currencySymbol}${formattedPrice}`;
  };

  /**
   * Format any amount with currency (already converted)
   */
  const formatWithCurrency = (amount: number): string => {
    const decimals = HIGH_VALUE_CURRENCIES.includes(pricingConfig.currencyCode) ? 0 : 2;
    
    const formattedPrice = amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    if (POST_SYMBOL_CURRENCIES.includes(pricingConfig.currencyCode)) {
      return `${formattedPrice} ${pricingConfig.currencySymbol}`;
    }
    
    return `${pricingConfig.currencySymbol}${formattedPrice}`;
  };

  return {
    // Country info
    countryCode: pricingConfig.countryCode,
    countryName: pricingConfig.countryName,
    
    // Currency info
    currencyCode: pricingConfig.currencyCode,
    currencySymbol: pricingConfig.currencySymbol,
    exchangeRate: pricingConfig.exchangeRate,
    
    // Formatting functions
    formatPrice,           // Takes PKR, returns formatted string
    convertFromPKR,        // Takes PKR, returns number in target currency
    formatWithCurrency,    // Takes already-converted amount, returns formatted string
    
    // Selected country object for backward compatibility
    selectedCountry: {
      code: pricingConfig.countryCode.toLowerCase(),
      currency: pricingConfig.currencyCode,
    },
  };
};

export default useURLBasedPricing;

// Re-export exchange rates from centralized file
import { EXCHANGE_RATES, getExchangeRate, convertUSDTo, formatCurrencyPrice, convertAndFormat } from './exchangeRates';

// Exchange rates for backward compatibility
const exchangeRates = EXCHANGE_RATES;

// Currency display options
const currencyFormatters: Record<string, Intl.NumberFormat> = {};

// Get or create formatter for a currency
const getFormatter = (currency: string): Intl.NumberFormat => {
  if (!currencyFormatters[currency]) {
    currencyFormatters[currency] = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return currencyFormatters[currency];
};

// Convert price from USD to target currency
export const convertPrice = (priceUSD: number, targetCurrency: string): number => {
  const rate = exchangeRates[targetCurrency] || 1;
  return priceUSD * rate;
};

// Format price in the target currency
export const formatPrice = (price: number, currency: string): string => {
  try {
    return getFormatter(currency).format(price);
  } catch (error) {
    console.error(`Error formatting price for currency ${currency}:`, error);
    return `${price.toFixed(2)} ${currency}`;
  }
};

// Full function to convert and format price
export const convertAndFormatPrice = (priceUSD: number, targetCurrency: string): string => {
  const convertedPrice = convertPrice(priceUSD, targetCurrency);
  return formatPrice(convertedPrice, targetCurrency);
};

// Convert PKR to USD for display
export const convertPkrToUsd = (pkrAmount: number): string => {
  const usdAmount = pkrAmount / exchangeRates.PKR;
  return `$${usdAmount.toFixed(2)}`;
};

// Convert PKR amount to INR amount (numeric)
export const convertPkrToInr = (pkrAmount: number): number => {
  const usdAmount = pkrAmount / exchangeRates.PKR;
  const inrAmount = usdAmount * exchangeRates.INR;
  return inrAmount;
};

// Convert INR to USD for display (for BGMI)
export const convertInrToUsd = (inrAmount: number): string => {
  const usdAmount = inrAmount / exchangeRates.INR;
  return `$${usdAmount.toFixed(2)}`;
};

// Function to create a custom event for currency changes
export const triggerCurrencyChangeEvent = (currency: string) => {
  const event = new CustomEvent('currencyChange', { 
    detail: { currency },
    bubbles: true 
  });
  window.dispatchEvent(event);
};

// Listen for currency changes
export const setupCurrencyChangeListener = (callback: (currency: string) => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{currency: string}>;
    callback(customEvent.detail.currency);
  };
  
  window.addEventListener('currencyChange', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('currencyChange', handler);
  };
};

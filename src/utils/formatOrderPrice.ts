// Utility for formatting order prices in their stored currency

// Currency symbols map
const CURRENCY_SYMBOLS: Record<string, string> = {
  PKR: 'Rs.',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'AED',
  SAR: 'SAR',
  JPY: '¥',
  CNY: '¥',
  RUB: '₽',
  TRY: '₺',
  BDT: '৳',
  MYR: 'RM',
  IDR: 'Rp',
  THB: '฿',
  VND: '₫',
  PHP: '₱',
  KRW: '₩',
  SGD: 'S$',
  AUD: 'A$',
  CAD: 'C$',
  NZD: 'NZ$',
  CHF: 'CHF',
  HKD: 'HK$',
  TWD: 'NT$',
  NGN: '₦',
  KES: 'KSh',
  ZAR: 'R',
  EGP: 'E£',
  BRL: 'R$',
  MXN: 'MX$',
  CLP: 'CLP$',
  COP: 'COP$',
  ARS: 'ARS$',
  PEN: 'S/',
};

// Currencies that don't use decimals
const NO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'UGX', 'TZS'];

/**
 * Format price in its stored currency
 * @param amount - The price amount
 * @param currencyCode - The currency code (e.g., 'USD', 'PKR')
 * @returns Formatted price string
 */
export const formatOrderPrice = (amount: number, currencyCode?: string | null): string => {
  const currency = currencyCode?.toUpperCase() || 'PKR';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  // Format based on currency
  if (NO_DECIMAL_CURRENCIES.includes(currency)) {
    return `${symbol} ${Math.round(amount).toLocaleString()}`;
  }
  
  // For most currencies, show 2 decimal places if there are decimals
  const hasDecimals = amount % 1 !== 0;
  if (hasDecimals) {
    return `${symbol} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `${symbol} ${amount.toLocaleString()}`;
};

/**
 * Get currency symbol
 * @param currencyCode - The currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currencyCode?: string | null): string => {
  const currency = currencyCode?.toUpperCase() || 'PKR';
  return CURRENCY_SYMBOLS[currency] || currency;
};

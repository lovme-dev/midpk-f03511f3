// BGMI-specific currency utilities for Indian market
import { convertInrToUsd } from './currencyUtils';

export const getBGMICurrencyData = () => {
  return {
    currency: 'INR',
    symbol: '₹',
    country: 'India',
    region: 'Asia'
  };
};

export const formatBGMIPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const convertBGMIToUSD = (inrAmount: number): string => {
  return convertInrToUsd(inrAmount);
};

export const getBGMIPackagePrices = () => {
  // Convert USD prices to INR for BGMI market
  const exchangeRate = 83.48; // USD to INR from currencyUtils
  
  return {
    pkg1: Math.round(0.99 * exchangeRate), // ~₹83
    pkg2: Math.round(1.99 * exchangeRate), // ~₹166
    pkg3: Math.round(4.99 * exchangeRate), // ~₹417
    pkg4: Math.round(9.99 * exchangeRate), // ~₹834
    pkg5: Math.round(19.99 * exchangeRate), // ~₹1669
    pkg6: Math.round(49.99 * exchangeRate), // ~₹4173
    pkg7: Math.round(99.99 * exchangeRate), // ~₹8348
  };
};
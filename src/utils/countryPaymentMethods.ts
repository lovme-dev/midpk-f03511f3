import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { getCountryData } from '@/utils/gameSeoConfigs';

interface FilterPaymentMethod {
  id: string;
  name: string;
}

/**
 * Maps COUNTRY_DATA payment method names to filter-friendly IDs and display names.
 * Always includes "Credit/ Debit/ Prepaid Card" as first option,
 * then adds country-specific methods from COUNTRY_DATA.
 */
const mapToFilterPaymentMethod = (method: string): FilterPaymentMethod | null => {
  const lower = method.toLowerCase();
  
  // Skip Visa/MasterCard since they're covered by "Credit/ Debit/ Prepaid Card"
  if (lower === 'visa' || lower === 'mastercard') return null;
  
  // Map known payment methods to IDs
  const mapping: Record<string, { id: string; name: string }> = {
    'paypal': { id: 'paypal', name: 'PayPal' },
    'apple pay': { id: 'apple_pay', name: 'Apple Pay' },
    'google pay': { id: 'google_pay', name: 'Google Pay' },
    'gpay': { id: 'google_pay', name: 'Google Pay' },
    'wechat pay': { id: 'wechat_pay', name: 'WeChat Pay微信支付' },
    'klarna': { id: 'klarna', name: 'Klarna' },
    'afterpay': { id: 'afterpay', name: 'Afterpay' },
    'bank transfer': { id: 'bank_transfer', name: 'Bank Transfer' },
    'jazzcash': { id: 'jazzcash', name: 'JazzCash' },
    'easypaisa': { id: 'easypaisa', name: 'Easypaisa' },
    'upi': { id: 'upi', name: 'UPI' },
    'phonepe': { id: 'phonepe', name: 'PhonePe' },
    'paytm': { id: 'paytm', name: 'Paytm' },
    'bkash': { id: 'bkash', name: 'bKash' },
    'nagad': { id: 'nagad', name: 'Nagad' },
    'rocket': { id: 'rocket', name: 'Rocket' },
    'esewa': { id: 'esewa', name: 'eSewa' },
    'khalti': { id: 'khalti', name: 'Khalti' },
    'oxxo': { id: 'oxxo', name: 'OXXO' },
    'spei': { id: 'spei', name: 'SPEI' },
    'interac': { id: 'interac', name: 'Interac' },
    'sinpe': { id: 'sinpe', name: 'SINPE' },
    'moncash': { id: 'moncash', name: 'MonCash' },
    'm-paisa': { id: 'mpaisa', name: 'M-Paisa' },
    'bml': { id: 'bml', name: 'BML' },
    'ideal': { id: 'ideal', name: 'iDEAL' },
    'bancontact': { id: 'bancontact', name: 'Bancontact' },
    'giropay': { id: 'giropay', name: 'Giropay' },
    'sofort': { id: 'sofort', name: 'Sofort' },
    'swish': { id: 'swish', name: 'Swish' },
    'vipps': { id: 'vipps', name: 'Vipps' },
    'mobilepay': { id: 'mobilepay', name: 'MobilePay' },
    'pix': { id: 'pix', name: 'PIX' },
    'mercadopago': { id: 'mercadopago', name: 'MercadoPago' },
    'gcash': { id: 'gcash', name: 'GCash' },
    'grabpay': { id: 'grabpay', name: 'GrabPay' },
    'dana': { id: 'dana', name: 'DANA' },
    'ovo': { id: 'ovo', name: 'OVO' },
    'gopay': { id: 'gopay', name: 'GoPay' },
    'shopeepay': { id: 'shopeepay', name: 'ShopeePay' },
    'truemoney': { id: 'truemoney', name: 'TrueMoney' },
    'promptpay': { id: 'promptpay', name: 'PromptPay' },
    'momo': { id: 'momo', name: 'MoMo' },
    'zalopay': { id: 'zalopay', name: 'ZaloPay' },
    'kakaopay': { id: 'kakaopay', name: 'KakaoPay' },
    'toss': { id: 'toss', name: 'Toss' },
    'stc pay': { id: 'stc_pay', name: 'STC Pay' },
    'mada': { id: 'mada', name: 'Mada' },
    'knet': { id: 'knet', name: 'KNET' },
    'benefit': { id: 'benefit', name: 'Benefit' },
    'fawry': { id: 'fawry', name: 'Fawry' },
    'mpesa': { id: 'mpesa', name: 'M-Pesa' },
    'm-pesa': { id: 'mpesa', name: 'M-Pesa' },
    'airtel money': { id: 'airtel_money', name: 'Airtel Money' },
    'mtn mobile money': { id: 'mtn_momo', name: 'MTN Mobile Money' },
    'wave': { id: 'wave', name: 'Wave' },
    'orange money': { id: 'orange_money', name: 'Orange Money' },
  };

  const found = mapping[lower];
  if (found) return found;

  // Generic fallback - use method name as-is
  return { id: method.toLowerCase().replace(/\s+/g, '_'), name: method };
};

/**
 * Get country-specific payment methods for filter UI
 */
export const getCountryFilterPaymentMethods = (countryCode: string): FilterPaymentMethod[] => {
  const countryData = getCountryData(countryCode.toUpperCase());
  
  // Always start with Credit/Debit/Prepaid Card
  const methods: FilterPaymentMethod[] = [
    { id: 'credit_debit', name: 'Credit/ Debit/ Prepaid Card' }
  ];
  
  // Add unique country-specific methods
  const seenIds = new Set(['credit_debit']);
  
  for (const pm of countryData.paymentMethods) {
    const mapped = mapToFilterPaymentMethod(pm);
    if (mapped && !seenIds.has(mapped.id)) {
      seenIds.add(mapped.id);
      methods.push(mapped);
    }
  }
  
  return methods;
};

/**
 * Hook to get country-specific payment methods from URL
 */
export const useCountryPaymentMethods = (): FilterPaymentMethod[] => {
  const { countryCode } = useParams<{ countryCode: string }>();
  
  return useMemo(() => {
    const code = countryCode?.toUpperCase() || 'US';
    return getCountryFilterPaymentMethods(code);
  }, [countryCode]);
};

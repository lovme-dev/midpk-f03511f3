import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getEmailTranslation, getLanguageFromCountry, EmailTranslation } from "./email-translations.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailCustomizations {
  customSubject?: string;
  customDeliveryMessage?: string;
  customNote?: string;
}

interface OrderEmailRequest {
  userId: string;
  orderId: string;
  emailType: "confirmation" | "refund";
  orderDetails: {
    packageName: string;
    ucAmount: number;
    price: number;
    paymentMethod: string;
    playerId: string;
    transactionId: string;
    // New fields for product type detection
    productType?: string;
    productName?: string;
    productCode?: string;
    productAmount?: string;
    currencyCode?: string;
    // Country code for language detection
    countryCode?: string;
  };
  customizations?: EmailCustomizations;
}

// Product type configuration for dynamic emails
const PRODUCT_CONFIG: Record<string, {
  name: string;
  currencyLabel: string;
  currencyEmoji: string;
  brandColor: string;
  brandGradient: string;
  deliveryMessage: string;
  logo?: string;
}> = {
  'free_fire': {
    name: 'Free Fire',
    currencyLabel: 'Diamonds',
    currencyEmoji: '💎',
    brandColor: '#ff9800',
    brandGradient: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
    deliveryMessage: 'Your Diamonds will be delivered within 24 hours!',
  },
  'freefire': {
    name: 'Free Fire',
    currencyLabel: 'Diamonds',
    currencyEmoji: '💎',
    brandColor: '#ff9800',
    brandGradient: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
    deliveryMessage: 'Your Diamonds will be delivered within 24 hours!',
  },
  'pubg': {
    name: 'PUBG Mobile',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#f59e0b',
    brandGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    deliveryMessage: 'Your UC will be delivered within 24 hours!',
  },
  'pubg_uc': {
    name: 'PUBG Mobile',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#f59e0b',
    brandGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    deliveryMessage: 'Your UC will be delivered within 24 hours!',
  },
  'pubg_car': {
    name: 'PUBG Car Skin',
    currencyLabel: 'Car Skin',
    currencyEmoji: '🚗',
    brandColor: '#f59e0b',
    brandGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    deliveryMessage: 'Your Car Skin will be delivered within 24 hours!',
  },
  'pubg_shop': {
    name: 'PUBG Mobile',
    currencyLabel: '',
    currencyEmoji: '🎁',
    brandColor: '#f59e0b',
    brandGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    deliveryMessage: 'Your order will be processed within 24 hours!',
  },
  'bgmi': {
    name: 'BGMI',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#22c55e',
    brandGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    deliveryMessage: 'Your UC will be delivered within 24 hours!',
  },
  'valorant': {
    name: 'Valorant',
    currencyLabel: 'VP',
    currencyEmoji: '🎯',
    brandColor: '#ff4655',
    brandGradient: 'linear-gradient(135deg, #ff4655 0%, #1f1f1f 100%)',
    deliveryMessage: 'Your Valorant Points will be delivered within 24 hours!',
  },
  'roblox': {
    name: 'Roblox',
    currencyLabel: 'Robux',
    currencyEmoji: '🎮',
    brandColor: '#e2231a',
    brandGradient: 'linear-gradient(135deg, #e2231a 0%, #9b1c1c 100%)',
    deliveryMessage: 'Your Robux will be delivered within 24 hours!',
  },
  'mobile_legends': {
    name: 'Mobile Legends',
    currencyLabel: 'Diamonds',
    currencyEmoji: '💠',
    brandColor: '#1e88e5',
    brandGradient: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
    deliveryMessage: 'Your Diamonds will be delivered within 24 hours!',
  },
  'default': {
    name: 'Midasbuy',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#3b82f6',
    brandGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    deliveryMessage: 'Your order will be delivered within 24 hours!',
  },
};

// Currency symbols map
const CURRENCY_SYMBOLS: Record<string, string> = {
  'PKR': 'Rs.',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'RUB': '₽',
  'INR': '₹',
  'AED': 'AED',
  'SAR': 'SAR',
  'BDT': '৳',
  'MYR': 'RM',
  'IDR': 'Rp',
  'PHP': '₱',
  'THB': '฿',
  'VND': '₫',
  'TRY': '₺',
  'JPY': '¥',
  'CNY': '¥',
  'KRW': '₩',
  'KZT': '₸',
  'BRL': 'R$',
  'ARS': 'AR$',
  'CLP': 'CL$',
  'COP': 'CO$',
  'PEN': 'S/',
  'MXN': 'MX$',
  'ZAR': 'R',
  'NGN': '₦',
  'EGP': 'E£',
  'PLN': 'zł',
  'CZK': 'Kč',
  'HUF': 'Ft',
  'RON': 'lei',
  'BGN': 'лв',
  'UAH': '₴',
  'SEK': 'kr',
  'NOK': 'kr',
  'DKK': 'kr',
  'CHF': 'CHF',
  'SGD': 'S$',
  'HKD': 'HK$',
  'TWD': 'NT$',
  'NZD': 'NZ$',
  'AUD': 'A$',
  'CAD': 'C$',
};

// No decimal currencies
const NO_DECIMAL_CURRENCIES = ['PKR', 'JPY', 'KRW', 'VND', 'IDR', 'INR', 'BDT', 'RUB', 'KZT', 'HUF', 'CLP'];

// Detect product type from order details
function detectProductType(orderDetails: OrderEmailRequest["orderDetails"]): string {
  const productType = orderDetails.productType?.toLowerCase() || '';
  const packageName = orderDetails.packageName?.toLowerCase() || '';
  const productName = orderDetails.productName?.toLowerCase() || '';
  const productCode = orderDetails.productCode?.toLowerCase() || '';
  
  // Check productType first
  if (productType.includes('free_fire') || productType.includes('freefire')) return 'free_fire';
  if (productType.includes('pubg_car') || productType.includes('pubgcar')) return 'pubg_car';
  if (productType.includes('pubg_shop') || productType.includes('shop_item') || productType.includes('royal_pass') || productType.includes('elite_pass') || productType.includes('prime')) return 'pubg_shop';
  if (productType.includes('pubg') || productType === 'uc') return 'pubg';
  if (productType.includes('bgmi')) return 'bgmi';
  if (productType.includes('valorant')) return 'valorant';
  if (productType.includes('roblox')) return 'roblox';
  if (productType.includes('mobile_legends') || productType.includes('mlbb')) return 'mobile_legends';
  
  // Check package/product names
  const combinedName = `${packageName} ${productName} ${productCode}`;
  if (combinedName.includes('free fire') || combinedName.includes('freefire') || combinedName.includes('diamond')) return 'free_fire';
  if (combinedName.includes('car') || combinedName.includes('vehicle')) return 'pubg_car';
  if (combinedName.includes('bgmi')) return 'bgmi';
  if (combinedName.includes('valorant') || combinedName.includes(' vp')) return 'valorant';
  if (combinedName.includes('roblox') || combinedName.includes('robux')) return 'roblox';
  if (combinedName.includes('mobile legends') || combinedName.includes('mlbb')) return 'mobile_legends';
  if (combinedName.includes('pubg') || combinedName.includes(' uc')) return 'pubg';
  
  return 'default';
}

// Format price with correct currency
function formatPrice(price: number, currencyCode?: string): string {
  const currency = currencyCode?.toUpperCase() || 'PKR';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  if (NO_DECIMAL_CURRENCIES.includes(currency)) {
    return `${symbol} ${Math.round(price).toLocaleString()}`;
  }
  return `${symbol}${price.toFixed(2)}`;
}

// Get display amount (ucAmount or productAmount)
function getDisplayAmount(orderDetails: OrderEmailRequest["orderDetails"]): string {
  if (orderDetails.productAmount) {
    return orderDetails.productAmount;
  }
  if (orderDetails.ucAmount) {
    return orderDetails.ucAmount.toString();
  }
  return 'N/A';
}

// Get display package name
function getDisplayPackageName(orderDetails: OrderEmailRequest["orderDetails"], config: typeof PRODUCT_CONFIG['default']): string {
  if (orderDetails.productName) {
    return orderDetails.productName;
  }
  return orderDetails.packageName || `${config.name} Package`;
}

// Determine text direction based on language
function getTextDirection(countryCode?: string): 'rtl' | 'ltr' {
  const rtlCountries = ['SA', 'AE', 'EG', 'JO', 'LB', 'KW', 'QA', 'BH', 'OM', 'IQ', 'SY', 'YE', 'PS', 'IL', 'IR'];
  if (countryCode && rtlCountries.includes(countryCode.toUpperCase())) {
    return 'rtl';
  }
  return 'ltr';
}

const getConfirmationEmailHtml = (
  orderDetails: OrderEmailRequest["orderDetails"], 
  userName: string, 
  customizations?: EmailCustomizations,
  translation?: EmailTranslation
) => {
  const t = translation || getEmailTranslation(orderDetails.countryCode);
  const productType = detectProductType(orderDetails);
  const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];
  const displayAmount = getDisplayAmount(orderDetails);
  const displayPackageName = getDisplayPackageName(orderDetails, config);
  const formattedPrice = formatPrice(orderDetails.price, orderDetails.currencyCode);
  const deliveryMessage = customizations?.customDeliveryMessage || t.deliveryMessage;
  const customNote = customizations?.customNote || '';
  const textDir = getTextDirection(orderDetails.countryCode);
  
  // Escape HTML to prevent injection
  const escapeHtml = (str: string) => str.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c] || c));
  const safeCustomNote = escapeHtml(customNote);
  
  return `
<!DOCTYPE html>
<html dir="${textDir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a1628; direction: ${textDir};">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f1a2e 0%, #1a2744 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
    <!-- Header -->
    <div style="background: ${config.brandGradient}; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${t.confirmTitle}</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">${t.confirmSubtitle}, ${userName}!</p>
      <p style="color: rgba(255,255,255,0.7); margin-top: 5px; font-size: 14px;">${config.name}</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      ${safeCustomNote ? `
      <!-- Custom Note -->
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid rgba(59, 130, 246, 0.3);">
        <p style="color: #93c5fd; margin: 0; font-size: 15px; line-height: 1.6;">${safeCustomNote}</p>
      </div>
      ` : ''}
      
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #60a5fa; margin: 0 0 20px 0; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">${t.orderDetails}</h2>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.gameLable}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${config.name}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.packageLabel}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${displayPackageName}</p>
        </div>
        
        ${productType !== 'pubg_shop' ? `
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.amountLabel}</span>
          <p style="color: #fbbf24; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">${config.currencyEmoji} ${displayAmount} ${config.currencyLabel}</p>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.playerIdLabel}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px; font-family: monospace;">${orderDetails.playerId}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.priceLabel}</span>
          <p style="color: #22c55e; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${formattedPrice}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.paymentMethodLabel}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px;">${orderDetails.paymentMethod}</p>
        </div>
        
        <div>
          <span style="color: #94a3b8; font-size: 14px;">${t.transactionIdLabel}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 14px; font-family: monospace; word-break: break-all;">${orderDetails.transactionId}</p>
        </div>
      </div>
      
      <!-- Status -->
      <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(34, 197, 94, 0.3);">
        <span style="color: #22c55e; font-size: 24px;">✅</span>
        <p style="color: #22c55e; margin: 10px 0 0 0; font-size: 16px; font-weight: 600;">${deliveryMessage}</p>
      </div>
      
      <!-- Footer Note -->
      <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 30px; line-height: 1.6;">
        ${t.contactMessage}<br>
        <a href="mailto:help@midasbuy.com.co" style="color: #60a5fa; text-decoration: none;">help@midasbuy.com.co</a><br>
        ${t.thankYouMessage}
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0; font-size: 12px;">${t.copyright}</p>
    </div>
  </div>
</body>
</html>
`;
};

const getRefundEmailHtml = (
  orderDetails: OrderEmailRequest["orderDetails"], 
  userName: string, 
  customizations?: EmailCustomizations,
  translation?: EmailTranslation
) => {
  const t = translation || getEmailTranslation(orderDetails.countryCode);
  const productType = detectProductType(orderDetails);
  const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];
  const displayAmount = getDisplayAmount(orderDetails);
  const displayPackageName = getDisplayPackageName(orderDetails, config);
  const formattedPrice = formatPrice(orderDetails.price, orderDetails.currencyCode);
  const refundMessage = customizations?.customDeliveryMessage || t.refundNotice;
  const customNote = customizations?.customNote || '';
  const textDir = getTextDirection(orderDetails.countryCode);
  
  // Escape HTML to prevent injection
  const escapeHtml = (str: string) => str.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c] || c));
  const safeCustomNote = escapeHtml(customNote);
  const safeRefundMessage = escapeHtml(refundMessage);
  
  return `
<!DOCTYPE html>
<html dir="${textDir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a1628; direction: ${textDir};">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f1a2e 0%, #1a2744 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${t.refundTitle}</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">${t.refundSubtitle}</p>
      <p style="color: rgba(255,255,255,0.7); margin-top: 5px; font-size: 14px;">${config.name}</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      ${safeCustomNote ? `
      <!-- Custom Note -->
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid rgba(59, 130, 246, 0.3);">
        <p style="color: #93c5fd; margin: 0; font-size: 15px; line-height: 1.6;">${safeCustomNote}</p>
      </div>
      ` : ''}
      
      <!-- Main Message -->
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <p style="color: white; margin: 0 0 15px 0; font-size: 16px; line-height: 1.8;">
          ${t.dearUser} <strong style="color: #60a5fa;">${userName}</strong>,
        </p>
        <p style="color: #e2e8f0; margin: 0 0 15px 0; font-size: 15px; line-height: 1.8;">
          ${productType === 'pubg_shop' 
            ? `${t.refundMessage1} <strong style="color: #fbbf24;">${displayPackageName}</strong> - <strong style="color: #22c55e;">${formattedPrice}</strong>.`
            : `${t.refundMessage1} <strong style="color: #fbbf24;">${config.currencyEmoji} ${displayAmount} ${config.currencyLabel}</strong> (${displayPackageName}) - <strong style="color: #22c55e;">${formattedPrice}</strong>.`
          }
        </p>
        <p style="color: #e2e8f0; margin: 0; font-size: 15px; line-height: 1.8;">
          ${t.refundMessage2}
        </p>
      </div>

      <!-- Order Details -->
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #f87171; margin: 0 0 20px 0; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">${t.cancelledOrderDetails}</h2>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.gameLable}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${config.name}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.packageLabel}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${displayPackageName}</p>
        </div>
        
        ${productType !== 'pubg_shop' ? `
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.amountLabel}</span>
          <p style="color: #fbbf24; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">${config.currencyEmoji} ${displayAmount} ${config.currencyLabel}</p>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 15px;">
          <span style="color: #94a3b8; font-size: 14px;">${t.refundAmountLabel}</span>
          <p style="color: #22c55e; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${formattedPrice}</p>
        </div>
        
        <div>
          <span style="color: #94a3b8; font-size: 14px;">${t.transactionIdLabel}</span>
          <p style="color: white; margin: 5px 0 0 0; font-size: 14px; font-family: monospace; word-break: break-all;">${orderDetails.transactionId}</p>
        </div>
      </div>
      
      <!-- Important Notice -->
      <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(251, 191, 36, 0.3); margin-bottom: 20px;">
        <span style="color: #fbbf24; font-size: 24px;">⏳</span>
        <p style="color: #fbbf24; margin: 10px 0 0 0; font-size: 15px; font-weight: 600;">${safeRefundMessage}</p>
        <p style="color: #fcd34d; margin: 10px 0 0 0; font-size: 14px;">${t.refundNoticeSub}</p>
      </div>
      
      <!-- Contact Info -->
      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 20px; border: 1px solid rgba(59, 130, 246, 0.2);">
        <p style="color: #60a5fa; margin: 0; font-size: 14px; line-height: 1.6;">
          📧 ${t.contactMessage}<br>
          <a href="mailto:help@midasbuy.com.co" style="color: #93c5fd; text-decoration: none; font-weight: 600;">help@midasbuy.com.co</a>
        </p>
      </div>
      
      <!-- Sign Off -->
      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">${t.bestRegards}</p>
        <p style="color: white; font-size: 16px; font-weight: 600; margin: 5px 0 0 0;">${t.teamName}</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0; font-size: 12px;">${t.copyright}</p>
    </div>
  </div>
</body>
</html>
`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, orderId, emailType, orderDetails, customizations }: OrderEmailRequest = await req.json();

    console.log(`Sending ${emailType} email for order:`, orderId);
    console.log('Order details received:', JSON.stringify(orderDetails, null, 2));
    console.log('Country code for language:', orderDetails.countryCode);
    console.log('Customizations:', customizations ? JSON.stringify(customizations) : 'none');

    // Get translation based on country code
    const translation = getEmailTranslation(orderDetails.countryCode);
    const languageCode = getLanguageFromCountry(orderDetails.countryCode);
    console.log(`Using language: ${languageCode} for country: ${orderDetails.countryCode}`);

    // Fetch user email from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.email) {
      console.error("Error fetching user profile:", profileError);
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userName = profile.full_name || "Valued Customer";
    const userEmail = profile.email;
    
    // Detect product type for subject line
    const productType = detectProductType(orderDetails);
    const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];

    console.log(`Sending email to: ${userEmail}, Product type: ${productType}, Game: ${config.name}, Language: ${languageCode}`);

    let subject: string;
    let html: string;

    if (emailType === "confirmation") {
      const subjectTail = productType === 'pubg_shop'
        ? (orderDetails.productName || config.name)
        : `${config.name} ${config.currencyLabel}`;
      subject = customizations?.customSubject || `${translation.confirmTitle} - ${subjectTail} | Midasbuy`;
      html = getConfirmationEmailHtml(orderDetails, userName, customizations, translation);
    } else {
      subject = customizations?.customSubject || `${translation.refundTitle} - ${config.name} | Midasbuy`;
      html = getRefundEmailHtml(orderDetails, userName, customizations, translation);
    }

    const emailResponse = await resend.emails.send({
      from: "Midasbuy <noreply@midasbuy.com.co>",
      replyTo: "help@midasbuy.com.co",
      to: [userEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update order email_sent_at timestamp if orderId is provided
    if (orderId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ email_sent_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (updateError) {
        console.error("Failed to update email_sent_at:", updateError);
      } else {
        console.log("Order email_sent_at updated successfully");
      }
    }

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id, language: languageCode }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

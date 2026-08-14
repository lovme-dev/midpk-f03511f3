import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

interface EmailCustomizations {
  customSubject?: string;
  customDeliveryMessage?: string;
  customNote?: string;
}

interface OrderDetails {
  packageName: string;
  ucAmount: number;
  price: number;
  paymentMethod: string;
  playerId: string;
  transactionId: string;
  productType?: string;
  productName?: string;
  productCode?: string;
  productAmount?: string;
  currencyCode?: string;
  countryCode?: string;
}

const PRODUCT_CONFIG: Record<string, {
  name: string;
  currencyLabel: string;
  currencyEmoji: string;
  brandColor: string;
  brandGradient: string;
  deliveryMessage: string;
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

const CURRENCY_SYMBOLS: Record<string, string> = {
  'PKR': 'Rs.', 'USD': '$', 'EUR': '€', 'GBP': '£', 'RUB': '₽', 'INR': '₹',
  'AED': 'AED', 'SAR': 'SAR', 'BDT': '৳', 'MYR': 'RM', 'IDR': 'Rp', 'PHP': '₱',
  'THB': '฿', 'VND': '₫', 'TRY': '₺', 'JPY': '¥', 'CNY': '¥', 'KRW': '₩',
  'KZT': '₸', 'BRL': 'R$', 'ARS': 'AR$', 'CLP': 'CL$', 'COP': 'CO$', 'PEN': 'S/',
  'MXN': 'MX$', 'ZAR': 'R', 'NGN': '₦', 'EGP': 'E£', 'PLN': 'zł', 'CZK': 'Kč',
  'HUF': 'Ft', 'RON': 'lei', 'BGN': 'лв', 'UAH': '₴', 'SEK': 'kr', 'NOK': 'kr',
  'DKK': 'kr', 'CHF': 'CHF', 'SGD': 'S$', 'HKD': 'HK$', 'TWD': 'NT$', 'NZD': 'NZ$',
  'AUD': 'A$', 'CAD': 'C$',
};

const NO_DECIMAL_CURRENCIES = ['PKR', 'JPY', 'KRW', 'VND', 'IDR', 'INR', 'BDT', 'RUB', 'KZT', 'HUF', 'CLP'];

function detectProductType(orderDetails: OrderDetails): string {
  const productType = orderDetails.productType?.toLowerCase() || '';
  const packageName = orderDetails.packageName?.toLowerCase() || '';
  const productName = orderDetails.productName?.toLowerCase() || '';
  const productCode = orderDetails.productCode?.toLowerCase() || '';

  if (productType.includes('free_fire') || productType.includes('freefire')) return 'free_fire';
  if (productType.includes('pubg_car') || productType.includes('pubgcar')) return 'pubg_car';
  if (productType.includes('pubg_shop') || productType.includes('shop_item') || productType.includes('royal_pass') || productType.includes('elite_pass') || productType.includes('prime')) return 'pubg_shop';
  if (productType.includes('pubg') || productType === 'uc') return 'pubg';
  if (productType.includes('bgmi')) return 'bgmi';
  if (productType.includes('valorant')) return 'valorant';
  if (productType.includes('roblox')) return 'roblox';
  if (productType.includes('mobile_legends') || productType.includes('mlbb')) return 'mobile_legends';

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

function formatPrice(price: number, currencyCode?: string): string {
  const currency = currencyCode?.toUpperCase() || 'PKR';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  if (NO_DECIMAL_CURRENCIES.includes(currency)) {
    return `${symbol} ${Math.round(price).toLocaleString()}`;
  }
  return `${symbol}${price.toFixed(2)}`;
}

function getDisplayAmount(orderDetails: OrderDetails): string {
  if (orderDetails.productAmount) return orderDetails.productAmount;
  if (orderDetails.ucAmount) return orderDetails.ucAmount.toString();
  return 'N/A';
}

function getDisplayPackageName(orderDetails: OrderDetails, config: typeof PRODUCT_CONFIG['default']): string {
  if (orderDetails.productName) return orderDetails.productName;
  return orderDetails.packageName || `${config.name} Package`;
}

function getTextDirection(countryCode?: string): 'rtl' | 'ltr' {
  const rtlCountries = ['SA', 'AE', 'EG', 'JO', 'LB', 'KW', 'QA', 'BH', 'OM', 'IQ', 'SY', 'YE', 'PS', 'IL', 'IR'];
  if (countryCode && rtlCountries.includes(countryCode.toUpperCase())) return 'rtl';
  return 'ltr';
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
}

async function getConfirmationEmailHtml(
  orderDetails: OrderDetails,
  userName: string,
  customizations?: EmailCustomizations,
) {
  const { getEmailTranslation } = await import('./email-translations-server');
  const t = getEmailTranslation(orderDetails.countryCode);
  const productType = detectProductType(orderDetails);
  const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];
  const displayAmount = getDisplayAmount(orderDetails);
  const displayPackageName = getDisplayPackageName(orderDetails, config);
  const formattedPrice = formatPrice(orderDetails.price, orderDetails.currencyCode);
  const deliveryMessage = customizations?.customDeliveryMessage || t.deliveryMessage;
  const customNote = customizations?.customNote || '';
  const textDir = getTextDirection(orderDetails.countryCode);
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
    <div style="background: ${config.brandGradient}; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${t.confirmTitle}</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">${t.confirmSubtitle}, ${userName}!</p>
      <p style="color: rgba(255,255,255,0.7); margin-top: 5px; font-size: 14px;">${config.name}</p>
    </div>
    <div style="padding: 40px 30px;">
      ${safeCustomNote ? `
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
      <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(34, 197, 94, 0.3);">
        <span style="color: #22c55e; font-size: 24px;">✅</span>
        <p style="color: #22c55e; margin: 10px 0 0 0; font-size: 16px; font-weight: 600;">${deliveryMessage}</p>
      </div>
      <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 30px; line-height: 1.6;">
        ${t.contactMessage}<br>
        <a href="mailto:help@midasbuy.com.pk" style="color: #60a5fa; text-decoration: none;">help@midasbuy.com.pk</a><br>
        ${t.thankYouMessage}
      </p>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0; font-size: 12px;">${t.copyright}</p>
    </div>
  </div>
</body>
</html>
`;
}

async function getRefundEmailHtml(
  orderDetails: OrderDetails,
  userName: string,
  customizations?: EmailCustomizations,
) {
  const { getEmailTranslation } = await import('./email-translations-server');
  const t = getEmailTranslation(orderDetails.countryCode);
  const productType = detectProductType(orderDetails);
  const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];
  const displayAmount = getDisplayAmount(orderDetails);
  const displayPackageName = getDisplayPackageName(orderDetails, config);
  const formattedPrice = formatPrice(orderDetails.price, orderDetails.currencyCode);
  const refundMessage = customizations?.customDeliveryMessage || t.refundNotice;
  const customNote = customizations?.customNote || '';
  const textDir = getTextDirection(orderDetails.countryCode);
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
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${t.refundTitle}</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">${t.refundSubtitle}</p>
      <p style="color: rgba(255,255,255,0.7); margin-top: 5px; font-size: 14px;">${config.name}</p>
    </div>
    <div style="padding: 40px 30px;">
      ${safeCustomNote ? `
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid rgba(59, 130, 246, 0.3);">
        <p style="color: #93c5fd; margin: 0; font-size: 15px; line-height: 1.6;">${safeCustomNote}</p>
      </div>
      ` : ''}
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
      <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(251, 191, 36, 0.3); margin-bottom: 20px;">
        <span style="color: #fbbf24; font-size: 24px;">⏳</span>
        <p style="color: #fbbf24; margin: 10px 0 0 0; font-size: 15px; font-weight: 600;">${safeRefundMessage}</p>
        <p style="color: #fcd34d; margin: 10px 0 0 0; font-size: 14px;">${t.refundNoticeSub}</p>
      </div>
      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 20px; border: 1px solid rgba(59, 130, 246, 0.2);">
        <p style="color: #60a5fa; margin: 0; font-size: 14px; line-height: 1.6;">
          📧 ${t.contactMessage}<br>
          <a href="mailto:help@midasbuy.com.pk" style="color: #93c5fd; text-decoration: none; font-weight: 600;">help@midasbuy.com.pk</a>
        </p>
      </div>
      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">${t.bestRegards}</p>
        <p style="color: white; font-size: 16px; font-weight: 600; margin: 5px 0 0 0;">${t.teamName}</p>
      </div>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0; font-size: 12px;">${t.copyright}</p>
    </div>
  </div>
</body>
</html>
`;
}

export const sendOrderEmail = createServerFn({ method: 'POST' })
  .inputValidator((input: {
    userId: string;
    orderId?: string;
    emailType: 'confirmation' | 'refund';
    orderDetails: OrderDetails;
    customizations?: EmailCustomizations;
  }) => input)
  .handler(async ({ data }) => {
    const { userId, orderId, emailType, orderDetails, customizations } = data;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { getEmailTranslation, getLanguageFromCountry } = await import('./email-translations-server');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env['RESEND_API_KEY']);

    try {
      const translation = getEmailTranslation(orderDetails.countryCode);
      const languageCode = getLanguageFromCountry(orderDetails.countryCode);

      const { data: orderRecord } = orderId
        ? await supabaseAdmin
            .from('orders')
            .select('customer_email, customer_name')
            .eq('id', orderId)
            .maybeSingle()
        : { data: null } as any;

      let userEmail = orderRecord?.customer_email as string | undefined;
      let userName = orderRecord?.customer_name as string | undefined;

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name, username')
        .eq('user_id', userId)
        .maybeSingle();

      if (!userEmail) userEmail = profile?.email as string | undefined;
      if (!userName) userName = (profile?.full_name || profile?.username) as string | undefined;

      if (!userEmail || !userName) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (!userEmail) userEmail = authUser?.user?.email ?? undefined;
        if (!userName) {
          const meta: any = authUser?.user?.user_metadata || {};
          userName = meta.full_name || meta.name || (userEmail ? userEmail.split('@')[0] : undefined);
        }
      }

      if (!userEmail) {
        console.error('User email not found for userId:', userId);
        return { error: 'User email not found' };
      }

      userName = userName || 'Valued Customer';

      const productType = detectProductType(orderDetails);
      const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];

      let subject: string;
      let html: string;

      if (emailType === 'confirmation') {
        const subjectTail = productType === 'pubg_shop'
          ? (orderDetails.productName || config.name)
          : `${config.name} ${config.currencyLabel}`;
        subject = customizations?.customSubject || `${translation.confirmTitle} - ${subjectTail} | Midasbuy`;
        html = await getConfirmationEmailHtml(orderDetails, userName, customizations);
      } else {
        subject = customizations?.customSubject || `${translation.refundTitle} - ${config.name} | Midasbuy`;
        html = await getRefundEmailHtml(orderDetails, userName, customizations);
      }

      const emailResponse = await resend.emails.send({
        from: 'Midasbuy <noreply@midasbuy.com.pk>',
        replyTo: 'help@midasbuy.com.pk',
        to: [userEmail],
        subject,
        html,
      });

      if (orderId) {
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ email_sent_at: new Date().toISOString() })
          .eq('id', orderId);
        if (updateError) console.error('Failed to update email_sent_at:', updateError);
      }

      return { success: true, emailId: emailResponse.data?.id, language: languageCode };
    } catch (error: any) {
      console.error('Error sending order email:', error);
      return { error: error?.message || 'Failed to send order email' };
    }
  });

function getStatusNotificationContent(status: string, orderDetails: { packageName?: string; orderId?: string; transactionId?: string }): { title: string; body: string; icon: string } {
  const packageName = orderDetails.packageName || 'Your order';
  const orderId = orderDetails.orderId || '';

  switch (status) {
    case 'completed':
      return { title: '✅ Order Completed!', body: `${packageName} has been delivered to your account. Order #${orderId}`, icon: '/icons/icon-192x192.png' };
    case 'paid':
      return { title: '💳 Payment Received!', body: `Payment confirmed for ${packageName}. Processing your order... #${orderId}`, icon: '/icons/icon-192x192.png' };
    case 'pending':
      return { title: '⏳ Order Pending', body: `${packageName} is awaiting payment. Complete your purchase! #${orderId}`, icon: '/icons/icon-192x192.png' };
    case 'failed':
      return { title: '❌ Payment Failed', body: `Payment for ${packageName} was not completed. Please try again. #${orderId}`, icon: '/icons/icon-192x192.png' };
    case 'cancelled':
      return { title: '🚫 Order Cancelled', body: `Your order for ${packageName} has been cancelled. #${orderId}`, icon: '/icons/icon-192x192.png' };
    case 'refunded':
      return { title: '💰 Refund Processed', body: `Refund for ${packageName} has been initiated. #${orderId}`, icon: '/icons/icon-192x192.png' };
    default:
      return { title: '📦 Order Update', body: `Your order ${packageName} status: ${status}. #${orderId}`, icon: '/icons/icon-192x192.png' };
  }
}

export const sendOrderStatusNotification = createServerFn({ method: 'POST' })
  .inputValidator((input: {
    user_id: string;
    order_id: string;
    new_status: string;
    order_details?: { packageName?: string };
  }) => input)
  .handler(async ({ data }) => {
    const { user_id, order_id, new_status, order_details } = data;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { sendWebPush } = await import('./notifications.server');

    if (!user_id || !new_status) {
      return { error: 'user_id and new_status are required' };
    }

    try {
      const vapidPublicKey = process.env['VAPID_PUBLIC_KEY']!;
      const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY']!;

      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user_id);

      if (subError) {
        console.error('[OrderStatusNotification] Error fetching subscriptions:', subError);
        return { error: 'Failed to fetch subscriptions' };
      }

      if (!subscriptions || subscriptions.length === 0) {
        return { success: true, sent: 0, message: 'No push subscriptions' };
      }

      const notificationContent = getStatusNotificationContent(new_status, {
        packageName: order_details?.packageName,
        orderId: order_id,
      });

      const payload = JSON.stringify({
        title: notificationContent.title,
        body: notificationContent.body,
        icon: notificationContent.icon,
        url: '/profile',
        tag: `order-${order_id}`,
      });

      let successCount = 0;
      const expiredSubscriptions: string[] = [];

      for (const sub of subscriptions) {
        try {
          const response = await sendWebPush(sub.endpoint, sub.p256dh, sub.auth, payload, vapidPublicKey, vapidPrivateKey);
          if (response.status === 201) {
            successCount++;
          } else if (response.status === 404 || response.status === 410 || response.status === 403) {
            expiredSubscriptions.push(sub.id);
          }
        } catch (pushError) {
          console.error('[OrderStatusNotification] Push error:', pushError);
        }
      }

      if (expiredSubscriptions.length > 0) {
        await supabaseAdmin.from('push_subscriptions').delete().in('id', expiredSubscriptions);
      }

      return { success: true, sent: successCount, total: subscriptions.length };
    } catch (error: any) {
      console.error('[OrderStatusNotification] Error:', error);
      return { error: error?.message || 'Failed to send notification' };
    }
  });

export const sendInquiryReply = createServerFn({ method: 'POST' })
  .inputValidator((input: {
    customerEmail: string;
    customerName: string;
    subject: string;
    emailContent: string;
    orderId?: string;
    templateType: string;
  }) => input)
  .handler(async ({ data }) => {
    const { customerEmail, customerName, subject, emailContent, orderId } = data;
    const { getCallerAuth } = await import('./support.server');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env['RESEND_API_KEY']);

    const request = getRequest();
    const authHeader = request?.headers?.get('authorization') ?? null;
    const auth = await getCallerAuth(authHeader);
    if (!auth.userId) return { error: 'Unauthorized' };
    if (!auth.isAdmin) return { error: 'Admin access required' };

    if (!customerEmail || !subject || !emailContent) {
      return { error: 'Missing required fields: customerEmail, subject, or emailContent' };
    }

    try {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a1628;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f1a2e 0%, #1a2744 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Midasbuy Support</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">Customer Support Response</p>
    </div>
    <div style="padding: 30px;">
      <p style="color: white; margin: 0 0 20px 0; font-size: 16px;">
        Dear <strong style="color: #60a5fa;">${customerName || 'Valued Customer'}</strong>,
      </p>
      ${orderId ? `
      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(59, 130, 246, 0.3);">
        <span style="color: #94a3b8; font-size: 13px;">Order Reference:</span>
        <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${orderId}</p>
      </div>
      ` : ''}
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="color: #e2e8f0; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${emailContent}</div>
      </div>
      <div style="background: rgba(34, 197, 94, 0.1); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(34, 197, 94, 0.3);">
        <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">Need further assistance?</p>
        <a href="mailto:help@midasbuy.com.pk" style="color: #22c55e; text-decoration: none; font-size: 16px; font-weight: 600;">help@midasbuy.com.pk</a>
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #e2e8f0; margin: 0; font-size: 15px;">Best Regards,</p>
        <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">Midasbuy Support Team</p>
      </div>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px;">© 2026 Midasbuy. All rights reserved.</p>
      <p style="color: #475569; margin: 0; font-size: 11px;">This email was sent by Midasbuy Customer Support</p>
    </div>
  </div>
</body>
</html>
`;

      const emailResponse = await resend.emails.send({
        from: 'Midasbuy Support <noreply@midasbuy.com.pk>',
        replyTo: 'help@midasbuy.com.pk',
        to: [customerEmail],
        subject: subject,
        html: emailHtml,
      });

      return { success: true, message: 'Email sent successfully', emailId: emailResponse.data?.id };
    } catch (error: any) {
      console.error('Error sending inquiry reply email:', error);
      return { error: error?.message || 'Failed to send inquiry reply' };
    }
  });

export const sendTestEmail = createServerFn({ method: 'POST' })
  .inputValidator((input: { to: string; subject?: string; message?: string }) => input)
  .handler(async ({ data }) => {
    const { to, subject, message } = data;
    const { getCallerAuth } = await import('./support.server');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env['RESEND_API_KEY']);

    const request = getRequest();
    const authHeader = request?.headers?.get('authorization') ?? null;
    const auth = await getCallerAuth(authHeader);
    if (!auth.userId) return { success: false, error: 'Unauthorized' };
    if (!auth.isAdmin) return { success: false, error: 'Admin access required' };

    if (!to) return { success: false, error: "Missing 'to'" };

    try {
      const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#0a1628;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0f1a2e,#1a2744);border-radius:16px;padding:32px;color:#e2e8f0;">
        <h1 style="color:#60a5fa;margin:0 0 16px 0;">✅ Midasbuy Test Email</h1>
        <p style="line-height:1.7;font-size:15px;">${message || 'This is a test email from Midasbuy Admin Panel. If you received this, your email delivery is working correctly.'}</p>
        <p style="margin-top:24px;color:#94a3b8;font-size:13px;">Sent at ${new Date().toISOString()}</p>
      </div></body></html>`;

      const { data: sendData, error } = await resend.emails.send({
        from: 'Midasbuy <noreply@midasbuy.com.pk>',
        replyTo: 'help@midasbuy.com.pk',
        to: [to],
        subject: subject || 'Midasbuy Test Email',
        html,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data: sendData };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send test email' };
    }
  });

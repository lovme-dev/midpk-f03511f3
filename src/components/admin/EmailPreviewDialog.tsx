import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, X, Mail, Package, User, DollarSign, Gamepad2, Edit3, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Email translations for multi-language support
import { EMAIL_TRANSLATIONS, COUNTRY_TO_LANGUAGE, EmailTranslation } from './emailTranslations';

// Currency code to country code mapping for language detection
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  'PKR': 'PK', 'INR': 'IN', 'BDT': 'BD', 'USD': 'US', 'EUR': 'DE', 'GBP': 'GB',
  'RUB': 'RU', 'SAR': 'SA', 'AED': 'AE', 'EGP': 'EG', 'TRY': 'TR', 'IDR': 'ID',
  'MYR': 'MY', 'THB': 'TH', 'VND': 'VN', 'PHP': 'PH', 'JPY': 'JP', 'KRW': 'KR',
  'CNY': 'CN', 'BRL': 'BR', 'MXN': 'MX', 'ARS': 'AR', 'COP': 'CO', 'PEN': 'PE',
  'CLP': 'CL', 'ZAR': 'ZA', 'NGN': 'NG', 'KES': 'KE', 'GHS': 'GH', 'KZT': 'KZ',
  'UAH': 'UA', 'PLN': 'PL', 'CZK': 'CZ', 'HUF': 'HU', 'RON': 'RO', 'BGN': 'BG',
  'SEK': 'SE', 'NOK': 'NO', 'DKK': 'DK', 'CHF': 'CH', 'ILS': 'IL', 'IRR': 'IR',
  'IQD': 'IQ', 'JOD': 'JO', 'KWD': 'KW', 'BHD': 'BH', 'OMR': 'OM', 'QAR': 'QA',
  'LBP': 'LB', 'MAD': 'MA', 'DZD': 'DZ', 'TND': 'TN', 'LYD': 'LY', 'SDG': 'SD',
  'NPR': 'NP', 'LKR': 'LK', 'MMK': 'MM', 'KHR': 'KH', 'LAK': 'LA', 'SGD': 'SG',
  'TWD': 'TW', 'HKD': 'HK', 'AUD': 'AU', 'NZD': 'NZ', 'CAD': 'CA',
};

// Get language flag emoji
const LANGUAGE_FLAGS: Record<string, string> = {
  'ur': '🇵🇰', 'hi': '🇮🇳', 'bn': '🇧🇩', 'en': '🇺🇸', 'de': '🇩🇪', 'fr': '🇫🇷',
  'es': '🇪🇸', 'it': '🇮🇹', 'pt': '🇧🇷', 'ru': '🇷🇺', 'ar': '🇸🇦', 'tr': '🇹🇷',
  'id': '🇮🇩', 'ms': '🇲🇾', 'th': '🇹🇭', 'vi': '🇻🇳', 'ja': '🇯🇵', 'ko': '🇰🇷',
  'zh': '🇨🇳', 'nl': '🇳🇱', 'pl': '🇵🇱', 'uk': '🇺🇦', 'cs': '🇨🇿', 'hu': '🇭🇺',
  'ro': '🇷🇴', 'bg': '🇧🇬', 'el': '🇬🇷', 'he': '🇮🇱', 'fa': '🇮🇷', 'sv': '🇸🇪',
  'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮',
};

// Get language name
const LANGUAGE_NAMES: Record<string, string> = {
  'ur': 'Urdu', 'hi': 'Hindi', 'bn': 'Bengali', 'en': 'English', 'de': 'German',
  'fr': 'French', 'es': 'Spanish', 'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian',
  'ar': 'Arabic', 'tr': 'Turkish', 'id': 'Indonesian', 'ms': 'Malay', 'th': 'Thai',
  'vi': 'Vietnamese', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese', 'nl': 'Dutch',
  'pl': 'Polish', 'uk': 'Ukrainian', 'cs': 'Czech', 'hu': 'Hungarian', 'ro': 'Romanian',
  'bg': 'Bulgarian', 'el': 'Greek', 'he': 'Hebrew', 'fa': 'Persian', 'sv': 'Swedish',
  'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish',
};

// Get translation for currency
function getTranslationForCurrency(currencyCode: string | null | undefined): EmailTranslation {
  const currency = currencyCode?.toUpperCase() || 'USD';
  const countryCode = CURRENCY_TO_COUNTRY[currency] || 'US';
  const langCode = COUNTRY_TO_LANGUAGE[countryCode] || 'en';
  return EMAIL_TRANSLATIONS[langCode] || EMAIL_TRANSLATIONS['en'];
}

function getLanguageInfo(currencyCode: string | null | undefined): { code: string; name: string; flag: string } {
  const currency = currencyCode?.toUpperCase() || 'USD';
  const countryCode = CURRENCY_TO_COUNTRY[currency] || 'US';
  const langCode = COUNTRY_TO_LANGUAGE[countryCode] || 'en';
  return {
    code: langCode,
    name: LANGUAGE_NAMES[langCode] || 'English',
    flag: LANGUAGE_FLAGS[langCode] || '🌐',
  };
}
interface OrderDetails {
  id: string;
  user_id: string;
  price: number;
  player_id: string;
  transaction_id: string;
  currency_code: string | null;
  product_type: string | null;
  product_name: string | null;
  product_code: string | null;
  product_amount: string | null;
  profiles: {
    full_name: string;
    email: string;
  } | null;
  uc_packages: {
    name: string;
    uc_amount: number;
  } | null;
}

export interface EmailCustomizations {
  customSubject?: string;
  customDeliveryMessage?: string;
  customNote?: string;
  customPackageName?: string;
  customAmount?: string;
}

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetails | null;
  emailType: 'confirmation' | 'refund';
  onSendEmail: (customizations: EmailCustomizations) => void;
  isSending?: boolean;
}

// Product type configuration matching edge function
const PRODUCT_CONFIG: Record<string, {
  name: string;
  currencyLabel: string;
  currencyEmoji: string;
  brandColor: string;
  headerGradient: string;
  deliveryMessage: string;
}> = {
  'free_fire': {
    name: 'Free Fire',
    currencyLabel: 'Diamonds',
    currencyEmoji: '💎',
    brandColor: '#ff9800',
    headerGradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    deliveryMessage: 'Your Diamonds will be delivered within 24 hours!',
  },
  'freefire': {
    name: 'Free Fire',
    currencyLabel: 'Diamonds',
    currencyEmoji: '💎',
    brandColor: '#ff9800',
    headerGradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    deliveryMessage: 'Your Diamonds will be delivered within 24 hours!',
  },
  'pubg': {
    name: 'PUBG Mobile',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#f59e0b',
    headerGradient: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    deliveryMessage: 'Your UC will be delivered within 24 hours!',
  },
  'pubg_uc': {
    name: 'PUBG Mobile',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#f59e0b',
    headerGradient: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    deliveryMessage: 'Your UC will be delivered within 24 hours!',
  },
  'pubg_car': {
    name: 'PUBG Car Skin',
    currencyLabel: 'Car Skin',
    currencyEmoji: '🚗',
    brandColor: '#f59e0b',
    headerGradient: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    deliveryMessage: 'Your Car Skin will be delivered within 24 hours!',
  },
  'bgmi': {
    name: 'BGMI',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#22c55e',
    headerGradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
    deliveryMessage: 'Your UC will be delivered within 24 hours!',
  },
  'valorant': {
    name: 'Valorant',
    currencyLabel: 'VP',
    currencyEmoji: '🎯',
    brandColor: '#ff4655',
    headerGradient: 'bg-gradient-to-r from-red-500 to-pink-600',
    deliveryMessage: 'Your Valorant Points will be delivered within 24 hours!',
  },
  'roblox': {
    name: 'Roblox',
    currencyLabel: 'Robux',
    currencyEmoji: '🎮',
    brandColor: '#e2231a',
    headerGradient: 'bg-gradient-to-r from-red-600 to-red-700',
    deliveryMessage: 'Your Robux will be delivered within 24 hours!',
  },
  'mobile_legends': {
    name: 'Mobile Legends',
    currencyLabel: 'Diamonds',
    currencyEmoji: '💠',
    brandColor: '#1e88e5',
    headerGradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    deliveryMessage: 'Your Diamonds will be delivered within 24 hours!',
  },
  'default': {
    name: 'Midasbuy',
    currencyLabel: 'UC',
    currencyEmoji: '🪙',
    brandColor: '#3b82f6',
    headerGradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
    deliveryMessage: 'Your order will be delivered within 24 hours!',
  },
};

// Currency symbols
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
};

const NO_DECIMAL_CURRENCIES = ['PKR', 'JPY', 'KRW', 'VND', 'IDR', 'INR', 'BDT', 'RUB'];

function detectProductType(order: OrderDetails): string {
  const productType = order.product_type?.toLowerCase() || '';
  const packageName = order.uc_packages?.name?.toLowerCase() || '';
  const productName = order.product_name?.toLowerCase() || '';
  const productCode = order.product_code?.toLowerCase() || '';
  
  if (productType.includes('free_fire') || productType.includes('freefire')) return 'free_fire';
  if (productType.includes('pubg_car') || productType.includes('pubgcar')) return 'pubg_car';
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

function formatPrice(price: number, currencyCode?: string | null): string {
  const currency = currencyCode?.toUpperCase() || 'PKR';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  if (NO_DECIMAL_CURRENCIES.includes(currency)) {
    return `${symbol} ${Math.round(price).toLocaleString()}`;
  }
  return `${symbol}${price.toFixed(2)}`;
}

// Parse player ID from JSON string or plain text
function parsePlayerId(playerId: string | null | undefined): string {
  if (!playerId) return 'N/A';
  
  // Try to parse as JSON (handles {"id":"xxx","name":"yyy"} format)
  try {
    const parsed = JSON.parse(playerId);
    if (typeof parsed === 'object' && parsed !== null) {
      // Return formatted: "ID (Name)" or just "ID"
      if (parsed.id && parsed.name) {
        return `${parsed.id} (${parsed.name})`;
      }
      return parsed.id || parsed.name || playerId;
    }
  } catch {
    // Not JSON, return as-is
  }
  
  return playerId;
}

function getDisplayAmount(order: OrderDetails): string {
  if (order.product_amount) {
    return order.product_amount;
  }
  if (order.uc_packages?.uc_amount) {
    return order.uc_packages.uc_amount.toString();
  }
  return 'N/A';
}

function getDisplayPackageName(order: OrderDetails, config: typeof PRODUCT_CONFIG['default']): string {
  if (order.product_name) {
    return order.product_name;
  }
  if (order.uc_packages?.name) {
    return order.uc_packages.name;
  }
  return `${config.name} Package`;
}

export function EmailPreviewDialog({
  open,
  onOpenChange,
  order,
  emailType,
  onSendEmail,
  isSending = false,
}: EmailPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  
  // Editable fields
  const [customSubject, setCustomSubject] = useState('');
  const [customDeliveryMessage, setCustomDeliveryMessage] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [customPackageName, setCustomPackageName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  
  // Get translation based on user's currency - must be before early return
  const translation = useMemo(() => getTranslationForCurrency(order?.currency_code), [order?.currency_code]);
  const langInfo = useMemo(() => getLanguageInfo(order?.currency_code), [order?.currency_code]);

  // Reset form when order changes
  useEffect(() => {
    if (order) {
      const productType = detectProductType(order);
      const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];
      const isConfirmation = emailType === 'confirmation';
      
      setCustomSubject(isConfirmation 
        ? `✅ Order Confirmed - ${config.name} ${config.currencyLabel} | Midasbuy`
        : `🔄 Order Cancelled & Refunded - ${config.name} | Midasbuy`
      );
      setCustomDeliveryMessage(isConfirmation 
        ? config.deliveryMessage 
        : 'Refund may take 2–15 business days to appear in your account.'
      );
      setCustomNote('');
      setCustomPackageName(getDisplayPackageName(order, config));
      setCustomAmount(getDisplayAmount(order));
      setActiveTab('preview');
    }
  }, [order, emailType, open]);

  if (!order) return null;

  const productType = detectProductType(order);
  const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];
  const formattedPrice = formatPrice(order.price, order.currency_code);
  const userName = order.profiles?.full_name || 'Valued Customer';
  const isConfirmation = emailType === 'confirmation';
  
  // Check if RTL language
  const isRTL = ['ar', 'ur', 'he', 'fa'].includes(langInfo.code);

  // Use custom values or defaults
  const displayPackageName = customPackageName || getDisplayPackageName(order, config);
  const displayAmount = customAmount || getDisplayAmount(order);
  const deliveryMessage = customDeliveryMessage || (isConfirmation ? translation.deliveryMessage : translation.refundNotice);

  const handleSend = () => {
    onSendEmail({
      customSubject: customSubject !== (isConfirmation 
        ? `✅ Order Confirmed - ${config.name} ${config.currencyLabel} | Midasbuy`
        : `🔄 Order Cancelled & Refunded - ${config.name} | Midasbuy`) 
        ? customSubject : undefined,
      customDeliveryMessage: customDeliveryMessage !== (isConfirmation 
        ? config.deliveryMessage 
        : 'Refund may take 2–15 business days to appear in your account.')
        ? customDeliveryMessage : undefined,
      customNote: customNote.trim() || undefined,
      customPackageName: customPackageName !== getDisplayPackageName(order, config) 
        ? customPackageName : undefined,
      customAmount: customAmount !== getDisplayAmount(order) 
        ? customAmount : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Preview - {isConfirmation ? 'Order Confirmation' : 'Refund Notification'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'edit')} className="flex-1">
          <div className="px-4 pt-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Content
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="m-0 flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh] md:h-[55vh]">
              {/* Email Preview Container */}
              <div className="p-4">
                {/* Language indicator */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                    <p className="font-medium text-sm">{customSubject}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {langInfo.flag} {langInfo.name}
                  </Badge>
                </div>

                {/* Email Body Preview - Mimics actual email with translations */}
                <div className="border rounded-xl overflow-hidden shadow-lg bg-[#0f1a2e]" dir={isRTL ? 'rtl' : 'ltr'}>
                  {/* Header */}
                  <div className={`${config.headerGradient} p-6 text-center text-white`}>
                    <h1 className="text-xl font-bold mb-1">
                      {isConfirmation ? translation.confirmTitle : translation.refundTitle}
                    </h1>
                    <p className="text-sm opacity-90">
                      {isConfirmation 
                        ? `${translation.confirmSubtitle}, ${userName}!`
                        : translation.refundSubtitle
                      }
                    </p>
                    <p className="text-xs opacity-70 mt-1">{config.name}</p>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Custom Note if added */}
                    {customNote && (
                      <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                        <p className="text-blue-300 text-sm">{customNote}</p>
                      </div>
                    )}

                    {/* Order Details Card */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h3 className="text-blue-400 font-semibold mb-3 text-sm border-b border-white/10 pb-2">
                        {isConfirmation ? translation.orderDetails : translation.cancelledOrderDetails}
                      </h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">{translation.gameLable}</span>
                          <span className="text-white font-medium">{config.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">{translation.packageLabel}</span>
                          <span className="text-white font-medium">{displayPackageName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-slate-400 ${isRTL ? 'mr-6' : 'ml-6'}`}>{translation.amountLabel}</span>
                          <span className="text-yellow-400 font-bold text-base">
                            {formattedPrice}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">{translation.playerIdLabel}</span>
                          <span className="text-white font-mono">{parsePlayerId(order.player_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">{isConfirmation ? translation.priceLabel : translation.refundAmountLabel}</span>
                          <span className="text-green-400 font-bold text-base">{formattedPrice}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-slate-400 ${isRTL ? 'mr-6' : 'ml-6'}`}>{translation.transactionIdLabel}</span>
                          <span className="text-white text-xs font-mono truncate max-w-[200px]" dir="ltr">
                            {order.transaction_id || order.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Message */}
                    {isConfirmation ? (
                      <div className="bg-green-500/20 rounded-lg p-4 text-center border border-green-500/30">
                        <span className="text-2xl">✅</span>
                        <p className="text-green-400 font-semibold text-sm mt-2">
                          {deliveryMessage}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/20 rounded-lg p-4 text-center border border-yellow-500/30">
                        <span className="text-2xl">⏳</span>
                        <p className="text-yellow-400 font-semibold text-sm mt-2">
                          {translation.refundNotice}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-black/30 p-3 text-center border-t border-white/10">
                    <p className="text-slate-500 text-xs">{translation.copyright}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="edit" className="m-0 flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh] md:h-[55vh]">
              <div className="p-4 space-y-4">
                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>

                {/* Package Name */}
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name</Label>
                  <Input
                    id="packageName"
                    value={customPackageName}
                    onChange={(e) => setCustomPackageName(e.target.value)}
                    placeholder="e.g., 60 UC + 5 Bonus"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">{config.currencyLabel} Amount</Label>
                  <Input
                    id="amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`e.g., 60 ${config.currencyLabel}`}
                  />
                </div>

                {/* Delivery/Refund Message */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryMessage">
                    {isConfirmation ? 'Delivery Message' : 'Refund Message'}
                  </Label>
                  <Input
                    id="deliveryMessage"
                    value={customDeliveryMessage}
                    onChange={(e) => setCustomDeliveryMessage(e.target.value)}
                    placeholder={isConfirmation 
                      ? 'Your order will be delivered within 24 hours!'
                      : 'Refund will be processed in 2-15 business days'
                    }
                  />
                </div>

                {/* Custom Note */}
                <div className="space-y-2">
                  <Label htmlFor="note">Custom Note (Optional)</Label>
                  <Textarea
                    id="note"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Add a personal message for the customer..."
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This note will appear at the top of the email content.
                  </p>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomSubject(isConfirmation 
                      ? `✅ Order Confirmed - ${config.name} ${config.currencyLabel} | Midasbuy`
                      : `🔄 Order Cancelled & Refunded - ${config.name} | Midasbuy`
                    );
                    setCustomDeliveryMessage(isConfirmation 
                      ? config.deliveryMessage 
                      : 'Refund may take 2–15 business days to appear in your account.'
                    );
                    setCustomNote('');
                    setCustomPackageName(getDisplayPackageName(order, config));
                    setCustomAmount(getDisplayAmount(order));
                  }}
                  className="w-full"
                >
                  Reset to Defaults
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Summary & Actions */}
        <DialogFooter className="p-4 border-t bg-muted/30 flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Badge className={config.headerGradient + ' text-white'}>
                {config.currencyEmoji} {config.name}
              </Badge>
              <Badge variant="outline">
                {order.currency_code?.toUpperCase() || 'PKR'}
              </Badge>
              {customNote && (
                <Badge variant="secondary" className="text-xs">
                  + Custom Note
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Sending to: <span className="font-medium">{order.profiles?.email}</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending}
              className={isConfirmation 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              <Send className="h-4 w-4 mr-1" />
              {isSending ? 'Sending...' : `Send ${isConfirmation ? 'Confirmation' : 'Refund'} Email`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

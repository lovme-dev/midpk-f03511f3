import { useState, useImperativeHandle, forwardRef } from 'react';
import { PaymentElement, useXpay } from '@xstak/xpay-element-live-v4';
import { motion } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ttqPurchase, ttqIdentify } from "@/utils/tiktokTracking";

export interface XPayCardFormRef {
  submit: () => Promise<void>;
  isReady: boolean;
  isProcessing: boolean;
  isCardComplete: boolean;
}

interface XPayCardFormProps {
  amount: number;
  currency?: string;
  originalAmount?: number;      // User's original amount in their currency
  originalCurrency?: string;    // User's original currency (USD, RUB, EUR etc.)
  customerEmail: string;
  customerPhone: string;
  productName?: string;
  productType?: string;         // Product type for game identification (roblox_robux, freefire_diamonds, etc.)
  productAmount?: string;       // Base+bonus amount format (e.g., "10+5")
  playerId?: string;
  packageId?: string;
  onSuccess: (details: any) => void;
  onError: (error: string) => void;
}

// User-friendly error messages for common payment errors
const getFriendlyErrorMessage = (errorMessage: string, declineCode?: string): string => {
  const lowerError = errorMessage.toLowerCase();
  const lowerDecline = (declineCode || '').toLowerCase();
  
  if (lowerDecline.includes('do_not_honor') || lowerDecline.includes('do not honor')) {
    return 'Your bank declined this transaction. Please call your bank to authorize or use a different card.';
  }
  
  if (lowerDecline.includes('restricted_card') || lowerDecline.includes('restricted')) {
    return 'Your card is restricted for this type of transaction. Please contact your bank or try another card.';
  }
  
  if (lowerDecline.includes('velocity') || lowerDecline.includes('too_many')) {
    return 'Too many payment attempts. Please wait 15-30 minutes before trying again.';
  }
  
  if (lowerDecline.includes('risk') || lowerDecline.includes('fraud')) {
    return 'Transaction flagged by security system. Please try a different card or contact support.';
  }
  
  if (lowerError.includes('access denied') || lowerError.includes('declined') || lowerError.includes('do not honor')) {
    return 'Your card was declined. This could be due to: (1) Online/international transactions disabled, (2) Daily limit reached, (3) Bank security block. Please check your banking app or call your bank.';
  }
  
  if (lowerError.includes('insufficient') || lowerError.includes('balance')) {
    return 'Insufficient funds. Please check your account balance and try again.';
  }
  
  if (lowerError.includes('expired')) {
    return 'Your card has expired. Please use a different card.';
  }
  
  if (lowerError.includes('invalid card') || lowerError.includes('card number')) {
    return 'Invalid card number. Please check and re-enter your card details.';
  }
  
  if (lowerError.includes('cvc') || lowerError.includes('cvv') || lowerError.includes('security code')) {
    return 'Invalid security code (CVV). Please check the 3-digit code on the back of your card.';
  }
  
  if (lowerError.includes('3ds') || lowerError.includes('authentication') || lowerError.includes('otp') || lowerError.includes('verify')) {
    return 'Card verification failed. Please ensure you complete the OTP/3DS verification sent by your bank.';
  }
  
  if (lowerError.includes('network') || lowerError.includes('timeout') || lowerError.includes('connection')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (lowerError.includes('limit') || lowerError.includes('exceeded')) {
    return 'Transaction limit exceeded. Please try a smaller amount or contact your bank.';
  }
  
  if (lowerError.includes('not supported') || lowerError.includes('invalid payment')) {
    return 'This card type is not supported. Please try a different Visa or Mastercard.';
  }
  
  if (errorMessage && errorMessage.length > 0) {
    return `Payment failed: ${errorMessage}. Please try again or use a different card.`;
  }
  
  return 'An unexpected error occurred. Please try again or contact support.';
};

interface XPayCardFormPropsExtended extends XPayCardFormProps {
  saveCard?: boolean;
  userId?: string | null;
  onCardSaved?: () => void;
  onCardComplete?: (isComplete: boolean) => void;
}

const XPayCardFormInner = forwardRef<XPayCardFormRef, XPayCardFormPropsExtended>(({
  amount, 
  currency = "PKR",
  originalAmount,
  originalCurrency,
  customerEmail,
  customerPhone,
  productName = "UC Package",
  productType = "uc_package",
  productAmount,
  playerId,
  packageId,
  onSuccess,
  onError,
  saveCard = false,
  userId,
  onCardSaved,
  onCardComplete
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  const xpay = useXpay();

  // Expose submit function and state to parent via ref
  useImperativeHandle(ref, () => ({
    submit: handlePayment,
    isReady,
    isProcessing: loading,
    isCardComplete,
  }), [isReady, loading, isCardComplete]);

  // Payment options - plain object like the working project
  const paymentOptions = {
    override: true,
    fields: {
      creditCard: {
        placeholder: "1234 1234 1234 1234",
        label: "Card Number",
      },
      exp: {
        placeholder: "MM/YY",
        label: "Expiry Date",
      },
      cvc: {
        placeholder: "CVC",
        label: "Security Code",
      },
    },
    style: {
      ".input": {
        "font-family": "'Inter', sans-serif",
        "font-size": "16px",
        "padding": "14px 16px",
        "border": "1px solid hsl(var(--border))",
        "border-radius": "12px",
        "background": "hsl(var(--background))",
        "color": "hsl(var(--foreground))",
        "transition": "all 0.2s ease",
      },
      ".input:focus": {
        "border-color": "hsl(var(--primary))",
        "box-shadow": "0 0 0 3px hsla(var(--primary), 0.15)",
        "outline": "none",
      },
      ".input:hover": {
        "border-color": "hsl(var(--primary))",
      },
      ".invalid": {
        "border-color": "hsl(var(--destructive))",
      },
      ".label": {
        "font-family": "'Inter', sans-serif",
        "font-size": "14px",
        "font-weight": "500",
        "color": "hsl(var(--foreground))",
        "margin-bottom": "8px",
      },
      "::placeholder": {
        "color": "hsl(var(--muted-foreground))",
      },
    },
  };

  const handlePayment = async () => {
    if (!xpay) {
      setError('Payment system not initialized. Please refresh the page.');
      return;
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      setError('Valid email is required');
      return;
    }

    // Phone is optional - use placeholder if not provided
    const phoneNumber = customerPhone && customerPhone.length >= 10 ? customerPhone : '03001234567';

    setLoading(true);
    setError('');
    setDebugInfo(null);

    let paymentIntentId: string | null = null;

    try {
      // Step 1: Create payment intent via backend function
      console.log('[XPay] Creating payment intent...');
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('💳 [XPay Card Form] Creating payment with:', {
        productName,
        productType,
        amount,
        currency,
        orderId
      });
      
      const { data, error: intentError } = await supabase.functions.invoke('xpay-create-payment', {
        body: {
          amount,
          currency,
          // Pass original user currency for order tracking (Admin Panel display)
          originalAmount: originalAmount || amount,
          originalCurrency: originalCurrency || currency,
          orderId,
          customerEmail,
          customerName: 'Customer',
          customerPhone,
          productName,
          productType,
          productAmount,
          playerId,
          packageId,
          successUrl: `${window.location.origin}/thank-you?orderId=${orderId}`,
          cancelUrl: `${window.location.origin}/payment/failed?orderId=${orderId}&reason=3DS_cancelled`,
        },
      });

      if (intentError) {
        console.error('[XPay] Payment intent invoke failed:', intentError);
        throw new Error(intentError.message || 'Network error while initializing payment');
      }

      if (!data) {
        throw new Error('Payment service returned empty response');
      }

      if (!data.clientSecret || !data.encryptionKey) {
        console.error('[XPay] Payment intent missing fields:', data);
        throw new Error(data.error || 'Payment initialization failed (missing intent data)');
      }

      console.log('[XPay] Payment intent created:', data.orderId, 'PI:', data.paymentIntentId);
      paymentIntentId = data.paymentIntentId;
      const { clientSecret, encryptionKey } = data;

      // Step 2: Confirm payment with XPay SDK (handles 3DS)
      console.log('[XPay] Confirming payment with SDK...');
      const customer = { 
        name: 'Customer',
        email: customerEmail,
        phone: phoneNumber
      };

      const confirmResult = await xpay.confirmPayment(
        "card",
        clientSecret,
        customer,
        encryptionKey
      );

      console.log('[XPay] confirmPayment full result:', confirmResult);

      if (confirmResult.error) {
        console.error('[XPay] Payment confirmation error:', confirmResult.message, confirmResult);
        throw new Error(confirmResult.message || 'Payment failed');
      }

      // Step 3: Payment successful!
      console.log('[XPay] Payment confirmed successfully!');
      
      // TikTok: Track Purchase event on successful card payment
      ttqPurchase({
        contentId: orderId || paymentIntentId || 'card_payment',
        contentName: productName || 'PUBG UC',
        value: amount,
        currency: currency || 'PKR'
      });
      
      // Identify user by email for TikTok
      if (customerEmail) {
        ttqIdentify({ email: customerEmail });
      }
      
      // Card saving has been disabled - cards are no longer stored
      // Users will always use new card flow
      
      onSuccess({
        orderId: paymentIntentId || orderId,
        amount,
        currency,
        paymentMethod: "Credit Card",
        date: new Date().toLocaleString('en-PK', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
        status: "succeeded"
      });

    } catch (err: any) {
      console.error('[XPay] Payment error:', err);
      
      const errorMessage = getFriendlyErrorMessage(err.message || '');
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* XPay Payment Element */}
      <div className="xpay-element-container">
        <PaymentElement 
          options={paymentOptions}
          onReady={(readyEvent: any) => {
            // XPay returns events for each field and 'all' when complete
            // { event: 'ready', ready: true/false, field: 'all'/'card'/'exp'/'cvc' }
            console.log('[XPay] PaymentElement event:', readyEvent);
            
            // Track if all fields are ready (complete)
            if (readyEvent?.field === 'all' || readyEvent?.complete === true) {
              const isFormComplete = readyEvent?.ready === true || readyEvent?.complete === true;
              console.log('[XPay] All fields complete:', isFormComplete);
              setIsReady(isFormComplete);
              setIsCardComplete(isFormComplete);
              onCardComplete?.(isFormComplete);
            } else if (readyEvent?.ready !== undefined) {
              // Individual field events - check if it's incomplete
              if (readyEvent.ready === false) {
                setIsCardComplete(false);
                onCardComplete?.(false);
              }
            }
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
          
          {/* Debug Info Panel */}
          {debugInfo && (
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="w-full px-3 py-2 bg-muted/50 flex items-center justify-between text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                <span>Technical Details (for debugging)</span>
                {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showDebug && (
                <div className="p-3 text-xs font-mono bg-muted/20 space-y-1 max-h-48 overflow-auto">
                  <p><strong>Status:</strong> {debugInfo.status || 'N/A'}</p>
                  <p><strong>Decline Code:</strong> {debugInfo.declineCode || 'N/A'}</p>
                  <p><strong>Decline Message:</strong> {debugInfo.declineMessage || 'N/A'}</p>
                  <p><strong>Requires 3DS:</strong> {debugInfo.requires3DS ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        .xpay-element-container iframe {
          width: 100% !important;
          border: 0 !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
});

XPayCardFormInner.displayName = 'XPayCardFormInner';

export const XPayCardForm = forwardRef<XPayCardFormRef, XPayCardFormPropsExtended>((props, ref) => {
  return <XPayCardFormInner {...props} ref={ref} />;
});

XPayCardForm.displayName = 'XPayCardForm';

export default XPayCardForm;

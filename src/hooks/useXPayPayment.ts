import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useXpay } from '@/components/XPayProvider';

interface PaymentRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  productType: string;
  playerId?: string;
  packageId?: string;
}

interface PaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  orderId?: string;
}

export const useXPayPayment = () => {
  const { confirmPayment, isReady } = useXpay();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const createPaymentIntent = async (request: PaymentRequest) => {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const successUrl = `${window.location.origin}/payment/success?orderId=${orderId}`;
    const cancelUrl = `${window.location.origin}/payment/cancel?orderId=${orderId}`;

    const { data, error } = await supabase.functions.invoke('xpay-create-payment', {
      body: {
        amount: request.amount,
        currency: request.currency,
        orderId,
        customerEmail: request.customerEmail,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        productName: request.productName,
        productType: request.productType,
        playerId: request.playerId,
        packageId: request.packageId,
        successUrl,
        cancelUrl,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to create payment intent');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to create payment intent');
    }

    return {
      clientSecret: data.clientSecret,
      encryptionKey: data.encryptionKey,
      paymentIntentId: data.paymentIntentId,
      orderId: data.orderId,
    };
  };

  const processPayment = async (
    request: PaymentRequest,
    customerName: string,
    savedCardToken?: string
  ): Promise<PaymentResult> => {
    if (!isReady) {
      return {
        success: false,
        error: 'Payment service not ready',
        message: 'Please wait for the payment form to load',
      };
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Step 1: Create payment intent
      console.log('[XPay] Creating payment intent...');
      const { clientSecret, encryptionKey, orderId } = await createPaymentIntent(request);
      console.log('[XPay] Payment intent created:', orderId);

      // Step 2: Confirm payment with XPay SDK
      console.log('[XPay] Confirming payment...');
      const customer = savedCardToken 
        ? { name: customerName, token: savedCardToken }
        : { name: customerName };

      const result = await confirmPayment('card', clientSecret, customer, encryptionKey);
      
      console.log('[XPay] Payment result:', result);

      if (result.error) {
        setPaymentStatus('failed');
        return {
          success: false,
          error: result.error,
          message: result.message || 'Payment failed',
          orderId,
        };
      }

      setPaymentStatus('success');
      return {
        success: true,
        message: result.message || 'Payment successful',
        orderId,
      };

    } catch (error: any) {
      console.error('[XPay] Payment error:', error);
      setPaymentStatus('failed');
      return {
        success: false,
        error: error.message || 'Payment processing failed',
        message: 'An error occurred while processing your payment',
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
    paymentStatus,
    isReady,
  };
};

export default useXPayPayment;

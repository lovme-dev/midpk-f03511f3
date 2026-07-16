import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface XPayContextType {
  isReady: boolean;
  xpay: any;
  confirmPayment: (
    method: string,
    clientSecret: string,
    customer: { name: string; token?: string },
    encryptionKey: string
  ) => Promise<{ error?: string; message?: string }>;
}

const XPayContext = createContext<XPayContextType | null>(null);

export const useXpay = () => {
  const context = useContext(XPayContext);
  if (!context) {
    throw new Error('useXpay must be used within XPayProvider');
  }
  return context;
};

interface XPayProviderProps {
  children: ReactNode;
  publishableKey: string;
  accountId: string;
  hmacSecret: string;
}

export const XPayProvider: React.FC<XPayProviderProps> = ({
  children,
  publishableKey,
  accountId,
  hmacSecret,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [xpayInstance, setXpayInstance] = useState<any>(null);

  useEffect(() => {
    // Check if Xpay is available globally (loaded via script tag)
    const initXpay = () => {
      if (typeof (window as any).Xpay !== 'undefined') {
        try {
          const instance = new (window as any).Xpay(publishableKey, accountId, hmacSecret);
          setXpayInstance(instance);
          setIsReady(true);
          console.log('[XPay] SDK initialized successfully');
        } catch (error) {
          console.error('[XPay] Failed to initialize:', error);
        }
      }
    };

    // Try immediately
    initXpay();

    // Also try after a delay if not ready
    const timer = setTimeout(() => {
      if (!isReady) {
        initXpay();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [publishableKey, accountId, hmacSecret, isReady]);

  const confirmPayment = async (
    method: string,
    clientSecret: string,
    customer: { name: string; token?: string },
    encryptionKey: string
  ) => {
    if (!xpayInstance) {
      return { error: 'XPay not initialized', message: 'Payment service not available' };
    }
    
    try {
      const result = await xpayInstance.confirmPayment(method, clientSecret, customer, encryptionKey);
      return result;
    } catch (error: any) {
      console.error('[XPay] Payment confirmation error:', error);
      return { error: error.message || 'Payment failed', message: error.message };
    }
  };

  return (
    <XPayContext.Provider value={{ isReady, xpay: xpayInstance, confirmPayment }}>
      {children}
    </XPayContext.Provider>
  );
};

export default XPayProvider;

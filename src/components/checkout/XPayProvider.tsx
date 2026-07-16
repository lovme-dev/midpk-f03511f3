import { ReactNode, useState, useEffect } from 'react';
import { XPay } from '@xstak/xpay-element-live-v4';
import { supabase } from "@/integrations/supabase/client";

interface XPayConfig {
  publishableKey: string;
  accountId: string;
  hmacSecret: string;
}

interface XPayProviderProps {
  children: ReactNode;
  email?: string;
  customerName?: string;
}

export const XPayProvider = ({ children, email, customerName }: XPayProviderProps) => {
  const [config, setConfig] = useState<XPayConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  // Check for XPay SDK availability
  useEffect(() => {
    const checkSdk = () => {
      if (typeof window !== 'undefined' && (window as any).Xpay) {
        setSdkReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkSdk()) return;

    // Poll for SDK availability (CDN might still be loading)
    const interval = setInterval(() => {
      if (checkSdk()) {
        clearInterval(interval);
      }
    }, 200);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!sdkReady) {
        setError('Payment SDK failed to load. Please refresh the page.');
        setLoading(false);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sdkReady]);

  // Fetch config once SDK is ready
  useEffect(() => {
    if (!sdkReady) return;

    const fetchConfig = async () => {
      try {
        // Fetch XPay public config from edge function
        const { data, error } = await supabase.functions.invoke('xpay-config');
        
        if (error || !data?.publishableKey) {
          throw new Error('Could not load payment configuration');
        }
        
        console.log('[XPayProvider] Config loaded successfully');
        setConfig({
          publishableKey: data.publishableKey,
          accountId: data.accountId,
          hmacSecret: data.hmacSecret,
        });
      } catch (err: any) {
        console.error('[XPayProvider] Config error:', err);
        setError(err.message || 'Payment system unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [sdkReady]);

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Loading payment form...
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
        {error || 'Payment configuration unavailable'}
      </div>
    );
  }

  return (
    <XPay 
      xpay={{
        publishableKey: config.publishableKey,
        accountId: config.accountId,
        hmacSecret: config.hmacSecret,
        email,
        customerName,
      }}
    >
      {children}
    </XPay>
  );
};

export default XPayProvider;

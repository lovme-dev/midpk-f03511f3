import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethodSetting {
  id: string;
  method_key: string;
  display_name: string;
  description: string | null;
  enabled: boolean;
  sort_order: number;
}

export function usePaymentMethodSettings() {
  const [methods, setMethods] = useState<PaymentMethodSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('payment_method_settings')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setMethods(data as PaymentMethodSetting[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = (supabase as any)
      .channel('payment_method_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_method_settings' },
        () => load()
      )
      .subscribe();
    return () => { (supabase as any).removeChannel(channel); };
  }, [load]);

  const isEnabled = useCallback(
    (key: string) => methods.find((m) => m.method_key === key)?.enabled ?? true,
    [methods]
  );

  return { methods, loading, isEnabled, refresh: load };
}

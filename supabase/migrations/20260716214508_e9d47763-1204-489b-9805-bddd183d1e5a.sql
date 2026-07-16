
CREATE TABLE IF NOT EXISTS public.payment_method_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  method_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_method_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.payment_method_settings TO authenticated;
GRANT ALL ON public.payment_method_settings TO service_role;

ALTER TABLE public.payment_method_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view payment methods" ON public.payment_method_settings;
CREATE POLICY "Anyone can view payment methods"
  ON public.payment_method_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert payment methods" ON public.payment_method_settings;
CREATE POLICY "Admins can insert payment methods"
  ON public.payment_method_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update payment methods" ON public.payment_method_settings;
CREATE POLICY "Admins can update payment methods"
  ON public.payment_method_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete payment methods" ON public.payment_method_settings;
CREATE POLICY "Admins can delete payment methods"
  ON public.payment_method_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.pms_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_pms_updated_at ON public.payment_method_settings;
CREATE TRIGGER trg_pms_updated_at
  BEFORE UPDATE ON public.payment_method_settings
  FOR EACH ROW EXECUTE FUNCTION public.pms_touch_updated_at();

-- Seed default methods
INSERT INTO public.payment_method_settings (method_key, display_name, description, enabled, sort_order) VALUES
  ('jazzcash',      'JazzCash',           'JazzCash mobile wallet',                 true, 10),
  ('easypaisa',     'EasyPaisa',          'EasyPaisa mobile wallet',                true, 20),
  ('stripe_card',   'Credit / Debit Card','Stripe card payments (Visa/Mastercard)', true, 30),
  ('paypro',        'PayPro',             'PayPro gateway',                         true, 40),
  ('xpay',          'XPay',               'XPay gateway',                           true, 50),
  ('binance',       'Binance / Crypto',   'Binance Pay & crypto deposits',          true, 60),
  ('bank_transfer', 'Bank Transfer',      'Direct bank transfer',                   true, 70),
  ('gopayfast',     'GoPayFast',          'GoPayFast gateway',                      true, 80)
ON CONFLICT (method_key) DO NOTHING;

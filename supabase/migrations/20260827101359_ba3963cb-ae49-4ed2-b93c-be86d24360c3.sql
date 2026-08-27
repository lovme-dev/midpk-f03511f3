ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS gateway_payment_id text,
  ADD COLUMN IF NOT EXISTS gateway_order_id text;

CREATE INDEX IF NOT EXISTS idx_orders_gateway_payment_id
  ON public.orders (gateway_payment_id)
  WHERE gateway_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_gateway_order_id
  ON public.orders (gateway_order_id)
  WHERE gateway_order_id IS NOT NULL;

CREATE TABLE public.admin_section_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  section_key text NOT NULL CHECK (section_key IN ('orders', 'redeem_codes')),
  last_viewed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, section_key)
);

GRANT SELECT, INSERT, UPDATE ON public.admin_section_reads TO authenticated;
GRANT ALL ON public.admin_section_reads TO service_role;

ALTER TABLE public.admin_section_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own section read state"
ON public.admin_section_reads
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create own section read state"
ON public.admin_section_reads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update own section read state"
ON public.admin_section_reads
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_admin_section_reads_updated_at
BEFORE UPDATE ON public.admin_section_reads
FOR EACH ROW EXECUTE FUNCTION public.pms_touch_updated_at();
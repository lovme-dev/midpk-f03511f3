
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT;

ALTER TABLE public.orders_archive
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Seed the Test Payment gateway (admin-only visible in UI)
INSERT INTO public.payment_method_settings (method_key, display_name, description, enabled, sort_order)
VALUES ('test_payment', 'Test Payment (Admin Only)', 'Internal test gateway; only visible to admin users on checkout.', true, 999)
ON CONFLICT (method_key) DO NOTHING;

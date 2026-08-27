ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_return_token_hash text;

CREATE INDEX IF NOT EXISTS idx_orders_payment_return_token_hash
ON public.orders (payment_return_token_hash)
WHERE payment_return_token_hash IS NOT NULL;

ALTER TABLE public.orders_archive
ADD COLUMN IF NOT EXISTS payment_return_token_hash text;
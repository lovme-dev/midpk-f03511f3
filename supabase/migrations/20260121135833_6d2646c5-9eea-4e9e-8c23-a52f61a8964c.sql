-- Add currency_code column to orders table to track which currency user paid in
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency_code text DEFAULT 'PKR';

-- Add index for faster transaction_id searches
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON public.orders(transaction_id);

-- Add index for faster user_id + status queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
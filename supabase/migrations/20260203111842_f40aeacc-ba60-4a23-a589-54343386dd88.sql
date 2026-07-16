-- Create orders_archive table to store old pending/failed orders before deletion
CREATE TABLE IF NOT EXISTS public.orders_archive (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    original_id UUID NOT NULL,
    user_id UUID NOT NULL,
    package_id UUID NULL,
    price NUMERIC NULL,
    status TEXT NULL,
    payment_method TEXT NULL,
    transaction_id TEXT NULL,
    player_id TEXT NULL,
    currency_code TEXT NULL,
    email_sent_at TIMESTAMPTZ NULL,
    product_type TEXT NULL,
    product_name TEXT NULL,
    product_code TEXT NULL,
    product_amount TEXT NULL,
    pkr_amount NUMERIC NULL,
    exchange_rate NUMERIC NULL,
    payment_screenshot_url TEXT NULL,
    original_created_at TIMESTAMPTZ NULL,
    original_updated_at TIMESTAMPTZ NULL,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_reason TEXT NULL -- 'pending_timeout', 'failed_timeout', etc.
);

-- Enable RLS
ALTER TABLE public.orders_archive ENABLE ROW LEVEL SECURITY;

-- Only admins can view archived orders
CREATE POLICY "Admins can view archived orders"
ON public.orders_archive FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- Only admins can delete archived orders (cleanup)
CREATE POLICY "Admins can delete archived orders"
ON public.orders_archive FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- Update the delete function to archive orders first
CREATE OR REPLACE FUNCTION public.delete_old_pending_failed_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Archive pending orders older than 1 hour before deleting
  INSERT INTO public.orders_archive (
    original_id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    original_created_at, original_updated_at, archived_reason
  )
  SELECT 
    id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    created_at, updated_at, 'pending_timeout'
  FROM public.orders
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '1 hour';

  -- Delete pending orders older than 1 hour
  DELETE FROM public.orders
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '1 hour';
    
  -- Archive failed orders older than 24 hours before deleting
  INSERT INTO public.orders_archive (
    original_id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    original_created_at, original_updated_at, archived_reason
  )
  SELECT 
    id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    created_at, updated_at, 'failed_timeout'
  FROM public.orders
  WHERE status = 'failed'
    AND created_at < NOW() - INTERVAL '24 hours';

  -- Delete failed orders older than 24 hours
  DELETE FROM public.orders
  WHERE status = 'failed'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$;
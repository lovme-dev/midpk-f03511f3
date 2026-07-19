CREATE OR REPLACE FUNCTION public.delete_old_pending_failed_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.orders
  SET status = 'refund_review', updated_at = NOW()
  WHERE status = 'cancelled'
    AND created_at < NOW() - INTERVAL '30 seconds';

  INSERT INTO public.orders_archive (
    original_id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    original_created_at, original_updated_at, archived_reason
  )
  SELECT id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    created_at, updated_at, 'pending_timeout'
  FROM public.orders
  WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';

  DELETE FROM public.orders
  WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';

  INSERT INTO public.orders_archive (
    original_id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    original_created_at, original_updated_at, archived_reason
  )
  SELECT id, user_id, package_id, price, status, payment_method,
    transaction_id, player_id, currency_code, email_sent_at,
    product_type, product_name, product_code, product_amount,
    pkr_amount, exchange_rate, payment_screenshot_url,
    created_at, updated_at, 'failed_timeout'
  FROM public.orders
  WHERE status = 'failed' AND created_at < NOW() - INTERVAL '24 hours';

  DELETE FROM public.orders
  WHERE status = 'failed' AND created_at < NOW() - INTERVAL '24 hours';
END;
$$;
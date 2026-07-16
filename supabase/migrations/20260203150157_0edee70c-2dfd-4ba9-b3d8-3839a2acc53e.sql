-- Create function to automatically update cancelled orders to refund_review after 1 minute
CREATE OR REPLACE FUNCTION public.auto_update_cancelled_to_refund_review()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update cancelled orders older than 1 minute to refund_review
  UPDATE public.orders
  SET 
    status = 'refund_review',
    updated_at = NOW()
  WHERE status = 'cancelled'
    AND created_at < NOW() - INTERVAL '1 minute';
END;
$$;
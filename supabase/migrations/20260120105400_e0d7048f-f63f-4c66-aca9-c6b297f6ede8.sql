-- Create a function to delete old pending/failed orders (older than 48 hours)
CREATE OR REPLACE FUNCTION public.delete_old_pending_failed_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.orders
  WHERE status IN ('pending', 'processing', 'failed')
    AND created_at < NOW() - INTERVAL '48 hours';
END;
$$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup job to run every hour
SELECT cron.schedule(
  'cleanup-old-pending-failed-orders',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT public.delete_old_pending_failed_orders();$$
);
-- Update the function to delete pending orders after specific time
-- Admin sees orders deleted after 1 hour, but the actual deletion happens at 1 hour
-- (Users will see orders removed from their list after 2 hours via frontend filtering)

CREATE OR REPLACE FUNCTION public.delete_old_pending_failed_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete pending orders older than 1 hour (this affects both admin and user views)
  DELETE FROM public.orders
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '1 hour';
    
  -- Delete failed orders older than 24 hours
  DELETE FROM public.orders
  WHERE status = 'failed'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove existing cron job if exists (to avoid duplicates)
SELECT cron.unschedule('delete-old-pending-orders') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'delete-old-pending-orders'
);

-- Schedule the cleanup job to run every 15 minutes
SELECT cron.schedule(
  'delete-old-pending-orders',
  '*/15 * * * *',
  $$SELECT public.delete_old_pending_failed_orders()$$
);
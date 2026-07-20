-- Enable realtime for orders table so refund_review status updates appear live in admin panel
ALTER TABLE public.orders REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
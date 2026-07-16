-- Enable realtime payloads for updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Ensure the orders table is included in realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'public.orders is already in supabase_realtime publication';
END;
$$;
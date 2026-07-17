
CREATE TABLE IF NOT EXISTS public.redeem_codes_archive (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID,
  player_id TEXT,
  username TEXT,
  redeem_code TEXT UNIQUE,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  archived_by UUID,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.redeem_codes_archive TO authenticated;
GRANT ALL ON public.redeem_codes_archive TO service_role;

ALTER TABLE public.redeem_codes_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage redeem archive" ON public.redeem_codes_archive;
CREATE POLICY "Admins manage redeem archive"
  ON public.redeem_codes_archive
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.redeem_codes REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.redeem_codes;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

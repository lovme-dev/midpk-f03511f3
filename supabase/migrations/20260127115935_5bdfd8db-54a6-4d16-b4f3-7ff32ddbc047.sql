-- 1) Create archive table (was missing, causing submit_redeem_code to fail)
CREATE TABLE IF NOT EXISTS public.redeem_codes_archive (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id uuid NOT NULL,
  player_id text NOT NULL,
  username text,
  redeem_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  archived_at timestamp with time zone NOT NULL DEFAULT now(),
  archived_by uuid
);

ALTER TABLE public.redeem_codes_archive ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'redeem_codes_archive' AND policyname = 'Archived codes viewable by admins'
  ) THEN
    CREATE POLICY "Archived codes viewable by admins"
      ON public.redeem_codes_archive
      FOR SELECT
      USING (has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'redeem_codes_archive' AND policyname = 'Archived codes insertable by admins'
  ) THEN
    CREATE POLICY "Archived codes insertable by admins"
      ON public.redeem_codes_archive
      FOR INSERT
      WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 2) Ensure one-code-one-record (so one notification per unique code)
CREATE UNIQUE INDEX IF NOT EXISTS redeem_codes_redeem_code_uidx
  ON public.redeem_codes (redeem_code);

CREATE UNIQUE INDEX IF NOT EXISTS redeem_codes_archive_redeem_code_uidx
  ON public.redeem_codes_archive (redeem_code);

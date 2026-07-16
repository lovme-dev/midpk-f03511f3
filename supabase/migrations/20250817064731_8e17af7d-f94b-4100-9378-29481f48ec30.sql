-- Enable RLS and add policies for page_views and live_users to fix public tracking and admin access
-- Note: Use USING/WITH CHECK = true for public inserts; restrict SELECT to admins

-- Ensure RLS is enabled
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_users ENABLE ROW LEVEL SECURITY;

-- PAGE VIEWS policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'page_views' AND policyname = 'Public can insert page views'
  ) THEN
    CREATE POLICY "Public can insert page views"
    ON public.page_views
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'page_views' AND policyname = 'Admins can select page views'
  ) THEN
    CREATE POLICY "Admins can select page views"
    ON public.page_views
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- LIVE USERS policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'live_users' AND policyname = 'Public can insert live users'
  ) THEN
    CREATE POLICY "Public can insert live users"
    ON public.live_users
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'live_users' AND policyname = 'Public can update live users'
  ) THEN
    CREATE POLICY "Public can update live users"
    ON public.live_users
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'live_users' AND policyname = 'Admins can select live users'
  ) THEN
    CREATE POLICY "Admins can select live users"
    ON public.live_users
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

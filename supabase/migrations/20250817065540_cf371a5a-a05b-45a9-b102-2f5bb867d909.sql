-- Fix RLS policies for live_users table to ensure proper access
-- Drop existing problematic policies and recreate them correctly

DROP POLICY IF EXISTS "Public can insert live users" ON public.live_users;
DROP POLICY IF EXISTS "Public can update live users" ON public.live_users;
DROP POLICY IF EXISTS "Admins can select live users" ON public.live_users;

-- Create proper policies for live_users table
CREATE POLICY "Anyone can insert live users"
ON public.live_users
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update live users"
ON public.live_users
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can select live users"
ON public.live_users
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also fix page_views policies if needed
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can select page views" ON public.page_views;

CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can select page views"
ON public.page_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
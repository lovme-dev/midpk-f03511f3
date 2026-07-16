-- Fix page_views table structure
ALTER TABLE public.page_views 
  DROP COLUMN IF EXISTS page_path,
  ADD COLUMN IF NOT EXISTS path TEXT;

-- Fix live_users table structure  
ALTER TABLE public.live_users
  DROP COLUMN IF EXISTS page_path,
  ADD COLUMN IF NOT EXISTS path TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Create analytics table that code is looking for
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT,
  date DATE DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Analytics insertable by all" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Analytics viewable by all" ON public.analytics FOR SELECT USING (true);
CREATE POLICY "Analytics updatable by all" ON public.analytics FOR UPDATE USING (true);
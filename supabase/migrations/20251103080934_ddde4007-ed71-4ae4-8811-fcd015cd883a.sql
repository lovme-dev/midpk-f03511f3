-- Add missing columns to page_views table for proper analytics tracking
ALTER TABLE public.page_views 
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS country_name TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT;

-- Add index for better query performance on analytics
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON public.page_views(country_name);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
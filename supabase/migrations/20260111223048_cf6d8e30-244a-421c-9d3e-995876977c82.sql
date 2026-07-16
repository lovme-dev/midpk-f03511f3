-- Add light effect columns to site_banners table
ALTER TABLE public.site_banners
ADD COLUMN IF NOT EXISTS light_intensity integer DEFAULT 45,
ADD COLUMN IF NOT EXISTS light_color text DEFAULT '#003C78',
ADD COLUMN IF NOT EXISTS light_spread integer DEFAULT 70,
ADD COLUMN IF NOT EXISTS light_enabled boolean DEFAULT true;
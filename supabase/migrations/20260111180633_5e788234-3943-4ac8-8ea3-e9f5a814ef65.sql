-- Add zoom_level column to site_banners table
ALTER TABLE public.site_banners ADD COLUMN IF NOT EXISTS zoom_level numeric DEFAULT 100;

-- Update existing banners to have default zoom level
UPDATE public.site_banners SET zoom_level = 100 WHERE zoom_level IS NULL;
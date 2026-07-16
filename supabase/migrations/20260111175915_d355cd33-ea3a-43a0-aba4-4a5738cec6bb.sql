-- Add position columns to site_banners for adjustable image positioning
ALTER TABLE public.site_banners 
ADD COLUMN IF NOT EXISTS position_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS position_y INTEGER DEFAULT 0;

-- Insert default characters image entry
INSERT INTO public.site_banners (banner_key, title, page_name, device_type, image_url, is_active, display_order, position_x, position_y)
VALUES ('pubg_uc_characters', 'PUBG Characters Image (Mobile)', 'PUBG UC', 'mobile', '/assets/pubg-characters-banner.png', true, 2, 0, 0)
ON CONFLICT (banner_key) DO NOTHING;
-- Remove old desktop banner for PUBG UC page
DELETE FROM public.site_banners 
WHERE page_name = 'PUBG UC' AND device_type = 'desktop';

-- Add new desktop banner
INSERT INTO public.site_banners (
  banner_key,
  page_name,
  device_type,
  image_url,
  title,
  description,
  is_active,
  display_order
) VALUES (
  'pubg_uc_desktop',
  'PUBG UC',
  'desktop',
  '/pubg-uc-desktop-banner.jpg',
  'PUBG UC Desktop Banner',
  'Main desktop banner for PUBG UC page',
  true,
  0
);
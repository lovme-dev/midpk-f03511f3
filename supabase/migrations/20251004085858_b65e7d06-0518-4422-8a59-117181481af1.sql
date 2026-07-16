-- Update homepage SEO with strong conversion-focused title and description
UPDATE page_meta 
SET 
  meta_title = 'Midasbuy PUBG Mobile UC Cheap |60% discount & VIP 30% extra UC',
  meta_description = 'As the official PUBG Mobile top-up platform, we''re offering exclusive discounts on UC purchases. Get over 60% off when you buy 3896+ UC packs - this special deal',
  updated_at = now()
WHERE page_id = 'home' AND path = '/';
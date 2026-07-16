-- Update homepage SEO with consistent simple title
UPDATE page_meta 
SET 
  meta_title = 'Midasbuy Official',
  meta_description = 'Official Midasbuy - #1 trusted gaming store for PUBG Mobile UC & Free Fire Diamonds. ⚡ Instant delivery, secure payments, best prices worldwide.',
  updated_at = now()
WHERE page_id = 'home' AND path = '/';
-- Insert BGMI page metadata with correct BGMI-specific information
INSERT INTO page_meta (
  page_id,
  path,
  title,
  meta_title,
  meta_description,
  meta_keywords,
  canonical_url,
  og_image_url
) VALUES (
  'bgmi',
  '/bgmi',
  'BGMI UC',
  'BGMI UC | Buy Battlegrounds Mobile India UC ₹83 - Midasbuy Official | Cheapest BGMI Unknown Cash',
  '⚡ Buy BGMI UC at Lowest Price ₹83 | Official Midasbuy BGMI Store | Instant Delivery in 2 Minutes | 100% Safe Payment | Battlegrounds Mobile India Unknown Cash | Best BGMI UC Deals India | 24/7 Support | 50 Lakh+ Happy BGMI Players',
  'BGMI, BGMI UC, Midasbuy BGMI, buy BGMI UC, Battlegrounds Mobile India, BGMI Unknown Cash, BGMI UC India, cheapest BGMI UC, BGMI UC ₹83',
  '/bgmi',
  '/lovable-uploads/5b1c2388-538d-4898-9cfa-21f6551e25ef.png'
) ON CONFLICT (page_id) 
DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  canonical_url = EXCLUDED.canonical_url,
  og_image_url = EXCLUDED.og_image_url,
  updated_at = NOW();
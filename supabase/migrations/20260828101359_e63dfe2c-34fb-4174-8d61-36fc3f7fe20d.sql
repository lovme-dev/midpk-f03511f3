CREATE TABLE public.shop_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_title TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  price_prefix TEXT DEFAULT 'From',
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'growthgift',
  discount TEXT,
  badge TEXT,
  badge_color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shop_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_products TO authenticated;
GRANT ALL ON public.shop_products TO service_role;

ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shop products"
ON public.shop_products FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert shop products"
ON public.shop_products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shop products"
ON public.shop_products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shop products"
ON public.shop_products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_shop_products_updated_at
BEFORE UPDATE ON public.shop_products
FOR EACH ROW EXECUTE FUNCTION public.pms_touch_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_products;
ALTER TABLE public.shop_products REPLICA IDENTITY FULL;
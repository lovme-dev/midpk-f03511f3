-- Create site_banners table for managing all website banners
CREATE TABLE public.site_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  page_name TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('mobile', 'desktop', 'both')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Anyone can view active banners"
ON public.site_banners
FOR SELECT
USING (is_active = true);

-- Only admins can insert banners
CREATE POLICY "Admins can insert banners"
ON public.site_banners
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update banners
CREATE POLICY "Admins can update banners"
ON public.site_banners
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete banners
CREATE POLICY "Admins can delete banners"
ON public.site_banners
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_site_banners_updated_at
BEFORE UPDATE ON public.site_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert current banners
INSERT INTO public.site_banners (banner_key, title, description, image_url, page_name, device_type, display_order) VALUES
('pubg_uc_mobile', 'PUBG UC Mobile Banner', 'Mobile banner for PUBG UC page', '/pubg-mobile-banner-latest.jpg', 'PUBG UC', 'mobile', 1),
('pubg_uc_desktop', 'PUBG UC Desktop Banner', 'Desktop banner for PUBG UC page', '/lovable-uploads/0d9b0111-17db-4849-ac7d-173eeafc2a91.png', 'PUBG UC', 'desktop', 2),
('honor_of_kings_mobile', 'Honor of Kings Mobile Banner', 'Mobile banner for Honor of Kings page', '/lovable-uploads/b8b7e3d6-09e1-4f74-bd99-8c9e23c4e2e9.png', 'Honor of Kings', 'mobile', 3),
('honor_of_kings_desktop', 'Honor of Kings Desktop Banner', 'Desktop banner for Honor of Kings page', '/lovable-uploads/91e8f16f-be1d-4fb7-961e-3f43cc4085c3.png', 'Honor of Kings', 'desktop', 4);
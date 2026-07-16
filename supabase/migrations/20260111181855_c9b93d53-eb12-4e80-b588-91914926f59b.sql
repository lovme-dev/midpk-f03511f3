-- Enable realtime for site_banners table for live position/zoom updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_banners;
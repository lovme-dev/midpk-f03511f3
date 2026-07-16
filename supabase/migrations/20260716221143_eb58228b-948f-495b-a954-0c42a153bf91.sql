
-- Public read for public buckets
CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Public read assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Public read pubg-accounts" ON storage.objects FOR SELECT USING (bucket_id = 'pubg-accounts');

-- Admin write on site-assets
CREATE POLICY "Admins upload site-assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site-assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site-assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- Admin write on assets
CREATE POLICY "Admins upload assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));

-- Admin write on pubg-accounts
CREATE POLICY "Admins upload pubg-accounts" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pubg-accounts' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update pubg-accounts" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'pubg-accounts' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'pubg-accounts' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete pubg-accounts" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'pubg-accounts' AND public.has_role(auth.uid(), 'admin'));

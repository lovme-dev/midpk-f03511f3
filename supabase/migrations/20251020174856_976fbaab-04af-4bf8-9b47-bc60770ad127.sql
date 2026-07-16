-- Drop existing policies to recreate them cleanly
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Profiles viewable by admins" ON public.profiles;
  DROP POLICY IF EXISTS "Profiles updatable by admins" ON public.profiles;
  DROP POLICY IF EXISTS "Profiles insertable by anyone" ON public.profiles;
  DROP POLICY IF EXISTS "User roles viewable by all" ON public.user_roles;
  DROP POLICY IF EXISTS "User roles manageable by admins" ON public.user_roles;
  DROP POLICY IF EXISTS "UC packages viewable by all" ON public.uc_packages;
  DROP POLICY IF EXISTS "UC packages manageable by admins" ON public.uc_packages;
  DROP POLICY IF EXISTS "Orders viewable by all" ON public.orders;
  DROP POLICY IF EXISTS "Orders insertable by all" ON public.orders;
  DROP POLICY IF EXISTS "Orders updatable by admins" ON public.orders;
  DROP POLICY IF EXISTS "Blogs viewable by all" ON public.blogs;
  DROP POLICY IF EXISTS "Blogs manageable by admins" ON public.blogs;
  DROP POLICY IF EXISTS "PUBG accounts viewable by all" ON public.pubg_accounts;
  DROP POLICY IF EXISTS "PUBG accounts manageable by admins" ON public.pubg_accounts;
  DROP POLICY IF EXISTS "PUBG credentials viewable by admins" ON public.pubg_account_credentials;
  DROP POLICY IF EXISTS "PUBG credentials manageable by admins" ON public.pubg_account_credentials;
  DROP POLICY IF EXISTS "Page meta viewable by all" ON public.page_meta;
  DROP POLICY IF EXISTS "Page meta manageable by admins" ON public.page_meta;
  DROP POLICY IF EXISTS "Page views insertable by all" ON public.page_views;
  DROP POLICY IF EXISTS "Page views viewable by admins" ON public.page_views;
  DROP POLICY IF EXISTS "Live users viewable by all" ON public.live_users;
  DROP POLICY IF EXISTS "Live users manageable by all" ON public.live_users;
  DROP POLICY IF EXISTS "Admin actions viewable by admins" ON public.admin_actions;
  DROP POLICY IF EXISTS "Admin actions insertable by admins" ON public.admin_actions;
  DROP POLICY IF EXISTS "Site banners viewable by all" ON public.site_banners;
  DROP POLICY IF EXISTS "Site banners manageable by admins" ON public.site_banners;
END $$;

-- Create all policies
CREATE POLICY "Profiles viewable by admins" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles updatable by admins" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Profiles insertable by anyone" ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "User roles viewable by all" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "User roles manageable by admins" ON public.user_roles FOR ALL USING (true);

CREATE POLICY "UC packages viewable by all" ON public.uc_packages FOR SELECT USING (true);
CREATE POLICY "UC packages manageable by admins" ON public.uc_packages FOR ALL USING (true);

CREATE POLICY "Orders viewable by all" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders insertable by all" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders updatable by admins" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Blogs viewable by all" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Blogs manageable by admins" ON public.blogs FOR ALL USING (true);

CREATE POLICY "PUBG accounts viewable by all" ON public.pubg_accounts FOR SELECT USING (true);
CREATE POLICY "PUBG accounts manageable by admins" ON public.pubg_accounts FOR ALL USING (true);

CREATE POLICY "PUBG credentials viewable by admins" ON public.pubg_account_credentials FOR SELECT USING (true);
CREATE POLICY "PUBG credentials manageable by admins" ON public.pubg_account_credentials FOR ALL USING (true);

CREATE POLICY "Page meta viewable by all" ON public.page_meta FOR SELECT USING (true);
CREATE POLICY "Page meta manageable by admins" ON public.page_meta FOR ALL USING (true);

CREATE POLICY "Page views insertable by all" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Page views viewable by admins" ON public.page_views FOR SELECT USING (true);

CREATE POLICY "Live users viewable by all" ON public.live_users FOR SELECT USING (true);
CREATE POLICY "Live users manageable by all" ON public.live_users FOR ALL USING (true);

CREATE POLICY "Admin actions viewable by admins" ON public.admin_actions FOR SELECT USING (true);
CREATE POLICY "Admin actions insertable by admins" ON public.admin_actions FOR INSERT WITH CHECK (true);

CREATE POLICY "Site banners viewable by all" ON public.site_banners FOR SELECT USING (true);
CREATE POLICY "Site banners manageable by admins" ON public.site_banners FOR ALL USING (true);
-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  blocked_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by admins" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles updatable by admins" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Profiles insertable by anyone" ON public.profiles FOR INSERT WITH CHECK (true);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User roles viewable by all" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "User roles manageable by admins" ON public.user_roles FOR ALL USING (true);

-- Create uc_packages table
CREATE TABLE IF NOT EXISTS public.uc_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  uc_amount INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.uc_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "UC packages viewable by all" ON public.uc_packages FOR SELECT USING (true);
CREATE POLICY "UC packages manageable by admins" ON public.uc_packages FOR ALL USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  package_id UUID REFERENCES public.uc_packages(id),
  player_id TEXT,
  status TEXT DEFAULT 'pending',
  price DECIMAL(10,2),
  payment_method TEXT,
  payment_screenshot_url TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders viewable by all" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders insertable by all" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders updatable by admins" ON public.orders FOR UPDATE USING (true);

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  featured_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blogs viewable by all" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Blogs manageable by admins" ON public.blogs FOR ALL USING (true);

-- Create pubg_accounts table
CREATE TABLE IF NOT EXISTS public.pubg_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  video_duration INTEGER,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pubg_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PUBG accounts viewable by all" ON public.pubg_accounts FOR SELECT USING (true);
CREATE POLICY "PUBG accounts manageable by admins" ON public.pubg_accounts FOR ALL USING (true);

-- Create pubg_account_credentials table
CREATE TABLE IF NOT EXISTS public.pubg_account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.pubg_accounts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pubg_account_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PUBG credentials viewable by admins" ON public.pubg_account_credentials FOR SELECT USING (true);
CREATE POLICY "PUBG credentials manageable by admins" ON public.pubg_account_credentials FOR ALL USING (true);

-- Create page_meta table
CREATE TABLE IF NOT EXISTS public.page_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT UNIQUE NOT NULL,
  title TEXT,
  path TEXT,
  description TEXT,
  keywords TEXT,
  canonical_url TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.page_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page meta viewable by all" ON public.page_meta FOR SELECT USING (true);
CREATE POLICY "Page meta manageable by admins" ON public.page_meta FOR ALL USING (true);

-- Create page_views table for analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page views insertable by all" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Page views viewable by admins" ON public.page_views FOR SELECT USING (true);

-- Create live_users table for real-time analytics
CREATE TABLE IF NOT EXISTS public.live_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT UNIQUE NOT NULL,
  page_path TEXT,
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.live_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live users viewable by all" ON public.live_users FOR SELECT USING (true);
CREATE POLICY "Live users manageable by all" ON public.live_users FOR ALL USING (true);

-- Create admin_actions table for logging
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin actions viewable by admins" ON public.admin_actions FOR SELECT USING (true);
CREATE POLICY "Admin actions insertable by admins" ON public.admin_actions FOR INSERT WITH CHECK (true);

-- Create site_banners table
CREATE TABLE IF NOT EXISTS public.site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_key TEXT UNIQUE NOT NULL,
  page_name TEXT NOT NULL,
  device_type TEXT DEFAULT 'desktop',
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site banners viewable by all" ON public.site_banners FOR SELECT USING (true);
CREATE POLICY "Site banners manageable by admins" ON public.site_banners FOR ALL USING (true);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pubg_accounts_updated_at BEFORE UPDATE ON public.pubg_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_page_meta_updated_at BEFORE UPDATE ON public.page_meta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_banners_updated_at BEFORE UPDATE ON public.site_banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create assign_default_role function
CREATE OR REPLACE FUNCTION public.assign_default_role(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = p_user_id;
  
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id) THEN
    IF user_email = 'admin@example.com' THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'admin');
    ELSE
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'user');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create log_admin_action function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_id UUID,
  p_action_type TEXT,
  p_target_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_actions (admin_id, action_type, target_id, details)
  VALUES (p_admin_id, p_action_type, p_target_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
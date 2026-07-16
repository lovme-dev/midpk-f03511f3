-- Keep the existing profiles table but restore fields the app expects
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0;

UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
ALTER TABLE public.profiles ALTER COLUMN user_id SET DEFAULT auth.uid();
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key ON public.profiles(user_id);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Public/admin product packages
CREATE TABLE IF NOT EXISTS public.uc_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount INTEGER,
  uc_amount INTEGER NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  currency_code TEXT DEFAULT 'PKR',
  product_type TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.uc_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.uc_packages TO authenticated;
GRANT ALL ON public.uc_packages TO service_role;
ALTER TABLE public.uc_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "UC packages viewable by all" ON public.uc_packages;
DROP POLICY IF EXISTS "UC packages manageable by admins" ON public.uc_packages;
CREATE POLICY "UC packages viewable by all" ON public.uc_packages FOR SELECT TO public USING (true);
CREATE POLICY "UC packages manageable by admins" ON public.uc_packages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  package_id UUID,
  player_id TEXT,
  username TEXT,
  status TEXT DEFAULT 'pending',
  price NUMERIC,
  payment_method TEXT,
  payment_screenshot_url TEXT,
  transaction_id TEXT,
  email_sent_at TIMESTAMPTZ,
  currency_code TEXT DEFAULT 'PKR',
  product_type TEXT,
  product_name TEXT,
  product_code TEXT,
  product_amount TEXT,
  pkr_amount NUMERIC,
  exchange_rate NUMERIC,
  refund_reason TEXT,
  refund_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders and admins all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders and admins all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Users can view own orders and admins all orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own orders and admins all orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Archived orders
CREATE TABLE IF NOT EXISTS public.orders_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id UUID NOT NULL,
  user_id UUID NOT NULL,
  package_id UUID,
  price NUMERIC,
  status TEXT,
  payment_method TEXT,
  transaction_id TEXT,
  player_id TEXT,
  username TEXT,
  currency_code TEXT,
  email_sent_at TIMESTAMPTZ,
  product_type TEXT,
  product_name TEXT,
  product_code TEXT,
  product_amount TEXT,
  pkr_amount NUMERIC,
  exchange_rate NUMERIC,
  payment_screenshot_url TEXT,
  original_created_at TIMESTAMPTZ,
  original_updated_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_reason TEXT
);
GRANT SELECT, INSERT, DELETE ON public.orders_archive TO authenticated;
GRANT ALL ON public.orders_archive TO service_role;
ALTER TABLE public.orders_archive ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage archived orders" ON public.orders_archive;
CREATE POLICY "Admins can manage archived orders" ON public.orders_archive FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Chat history
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_history TO authenticated;
GRANT ALL ON public.chat_history TO service_role;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own chat history" ON public.chat_history;
CREATE POLICY "Users can manage own chat history" ON public.chat_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Customer inquiries and archive
CREATE TABLE IF NOT EXISTS public.customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_inquiries TO authenticated;
GRANT INSERT ON public.customer_inquiries TO anon;
GRANT ALL ON public.customer_inquiries TO service_role;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can submit inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries and admins all inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.customer_inquiries;
CREATE POLICY "Users can submit inquiries" ON public.customer_inquiries FOR INSERT TO public WITH CHECK (user_id IS NULL OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own inquiries and admins all inquiries" ON public.customer_inquiries FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries" ON public.customer_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries" ON public.customer_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.customer_inquiries_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  user_id UUID,
  original_created_at TIMESTAMPTZ,
  original_updated_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT now(),
  archived_by UUID
);
GRANT SELECT, INSERT, DELETE ON public.customer_inquiries_archive TO authenticated;
GRANT ALL ON public.customer_inquiries_archive TO service_role;
ALTER TABLE public.customer_inquiries_archive ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage archived inquiries" ON public.customer_inquiries_archive;
CREATE POLICY "Admins can manage archived inquiries" ON public.customer_inquiries_archive FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Notification tables
CREATE TABLE IF NOT EXISTS public.admin_notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  order_id TEXT,
  package_name TEXT,
  price NUMERIC,
  player_id TEXT,
  sent_to_count INTEGER DEFAULT 0,
  total_admins INTEGER DEFAULT 0,
  currency_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_notification_history TO authenticated;
GRANT ALL ON public.admin_notification_history TO service_role;
ALTER TABLE public.admin_notification_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view admin notification history" ON public.admin_notification_history;
DROP POLICY IF EXISTS "Admin notification history can be inserted" ON public.admin_notification_history;
CREATE POLICY "Admins can view admin notification history" ON public.admin_notification_history FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin notification history can be inserted" ON public.admin_notification_history FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  message TEXT,
  type TEXT DEFAULT 'info',
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  notification_id UUID,
  title TEXT,
  body TEXT,
  message TEXT,
  type TEXT DEFAULT 'info',
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_notifications TO authenticated;
GRANT ALL ON public.user_notifications TO service_role;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.user_notifications;
CREATE POLICY "Users can manage own notifications" ON public.user_notifications FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth TEXT,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Analytics and live users
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT,
  date DATE DEFAULT CURRENT_DATE,
  visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  session_id TEXT,
  user_id UUID,
  path TEXT,
  user_agent TEXT,
  visit_time TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.analytics TO anon, authenticated;
GRANT ALL ON public.analytics TO service_role;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Analytics insertable by all and viewable by admins" ON public.analytics;
CREATE POLICY "Analytics insertable by all and viewable by admins" ON public.analytics FOR ALL TO public USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT,
  user_id UUID,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT ON public.page_views TO anon, authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Page views insertable by all" ON public.page_views;
CREATE POLICY "Page views insertable by all" ON public.page_views FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view page views" ON public.page_views;
CREATE POLICY "Admins can view page views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.live_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID,
  path TEXT,
  user_agent TEXT,
  ip_address TEXT,
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_users TO anon, authenticated;
GRANT ALL ON public.live_users TO service_role;
ALTER TABLE public.live_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Live users accessible" ON public.live_users;
CREATE POLICY "Live users accessible" ON public.live_users FOR ALL TO public USING (true) WITH CHECK (true);

-- Site content and banners
CREATE TABLE IF NOT EXISTS public.site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  banner_key TEXT,
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  desktop_image_url TEXT,
  mobile_image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.site_banners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_banners TO authenticated;
GRANT ALL ON public.site_banners TO service_role;
ALTER TABLE public.site_banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site banners viewable by all" ON public.site_banners;
DROP POLICY IF EXISTS "Site banners manageable by admins" ON public.site_banners;
CREATE POLICY "Site banners viewable by all" ON public.site_banners FOR SELECT TO public USING (true);
CREATE POLICY "Site banners manageable by admins" ON public.site_banners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key TEXT UNIQUE,
  name TEXT,
  file_name TEXT,
  file_url TEXT,
  url TEXT,
  type TEXT,
  mime_type TEXT,
  size INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.site_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_assets TO authenticated;
GRANT ALL ON public.site_assets TO service_role;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site assets viewable by all" ON public.site_assets;
DROP POLICY IF EXISTS "Site assets manageable by admins" ON public.site_assets;
CREATE POLICY "Site assets viewable by all" ON public.site_assets FOR SELECT TO public USING (true);
CREATE POLICY "Site assets manageable by admins" ON public.site_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  block_key TEXT NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_name, block_key)
);
GRANT SELECT ON public.content_blocks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_blocks TO authenticated;
GRANT ALL ON public.content_blocks TO service_role;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Content blocks viewable by all" ON public.content_blocks;
DROP POLICY IF EXISTS "Content blocks manageable by admins" ON public.content_blocks;
CREATE POLICY "Content blocks viewable by all" ON public.content_blocks FOR SELECT TO public USING (true);
CREATE POLICY "Content blocks manageable by admins" ON public.content_blocks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.pubg_uc_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  content_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  desktop_banner_url TEXT,
  mobile_banner_url TEXT,
  characters_image_url TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_name, content_key)
);
GRANT SELECT ON public.pubg_uc_page_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pubg_uc_page_content TO authenticated;
GRANT ALL ON public.pubg_uc_page_content TO service_role;
ALTER TABLE public.pubg_uc_page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "PUBG UC page content viewable by all" ON public.pubg_uc_page_content;
DROP POLICY IF EXISTS "PUBG UC page content manageable by admins" ON public.pubg_uc_page_content;
CREATE POLICY "PUBG UC page content viewable by all" ON public.pubg_uc_page_content FOR SELECT TO public USING (true);
CREATE POLICY "PUBG UC page content manageable by admins" ON public.pubg_uc_page_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Blogs and metadata
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  featured_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published blogs viewable by all" ON public.blogs;
DROP POLICY IF EXISTS "Blogs manageable by admins" ON public.blogs;
CREATE POLICY "Published blogs viewable by all" ON public.blogs FOR SELECT TO public USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Blogs manageable by admins" ON public.blogs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.page_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT UNIQUE,
  page_name TEXT,
  title TEXT,
  path TEXT,
  description TEXT,
  keywords TEXT,
  canonical_url TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.page_meta TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_meta TO authenticated;
GRANT ALL ON public.page_meta TO service_role;
ALTER TABLE public.page_meta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Page meta viewable by all" ON public.page_meta;
DROP POLICY IF EXISTS "Page meta manageable by admins" ON public.page_meta;
CREATE POLICY "Page meta viewable by all" ON public.page_meta FOR SELECT TO public USING (true);
CREATE POLICY "Page meta manageable by admins" ON public.page_meta FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PUBG accounts
CREATE TABLE IF NOT EXISTS public.pubg_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  video_url TEXT,
  thumbnail_url TEXT,
  video_duration INTEGER,
  status TEXT DEFAULT 'available',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.pubg_accounts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pubg_accounts TO authenticated;
GRANT ALL ON public.pubg_accounts TO service_role;
ALTER TABLE public.pubg_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "PUBG accounts viewable by all" ON public.pubg_accounts;
DROP POLICY IF EXISTS "PUBG accounts manageable by admins" ON public.pubg_accounts;
CREATE POLICY "PUBG accounts viewable by all" ON public.pubg_accounts FOR SELECT TO public USING (true);
CREATE POLICY "PUBG accounts manageable by admins" ON public.pubg_accounts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.pubg_account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pubg_account_credentials TO authenticated;
GRANT ALL ON public.pubg_account_credentials TO service_role;
ALTER TABLE public.pubg_account_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "PUBG credentials manageable by admins" ON public.pubg_account_credentials;
CREATE POLICY "PUBG credentials manageable by admins" ON public.pubg_account_credentials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Payments, cards, redeem codes
CREATE TABLE IF NOT EXISTS public.payment_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_key TEXT NOT NULL,
  name TEXT,
  account_title TEXT,
  account_number TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.payment_credentials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.payment_credentials TO authenticated;
GRANT ALL ON public.payment_credentials TO service_role;
ALTER TABLE public.payment_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payment credentials viewable by all" ON public.payment_credentials;
DROP POLICY IF EXISTS "Payment credentials manageable by admins" ON public.payment_credentials;
CREATE POLICY "Payment credentials viewable by all" ON public.payment_credentials FOR SELECT TO public USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Payment credentials manageable by admins" ON public.payment_credentials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.saved_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  card_holder TEXT,
  last_four TEXT,
  card_brand TEXT,
  expiry_month TEXT,
  expiry_year TEXT,
  token TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_cards TO authenticated;
GRANT ALL ON public.saved_cards TO service_role;
ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own saved cards" ON public.saved_cards;
CREATE POLICY "Users can manage own saved cards" ON public.saved_cards FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.redeem_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID,
  order_id UUID,
  status TEXT DEFAULT 'available',
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redeem_codes TO authenticated;
GRANT ALL ON public.redeem_codes TO service_role;
ALTER TABLE public.redeem_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Redeem codes manageable by admins and usable by users" ON public.redeem_codes;
CREATE POLICY "Redeem codes manageable by admins and usable by users" ON public.redeem_codes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id OR user_id IS NULL) WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id OR user_id IS NULL);

-- Game profiles and email log
CREATE TABLE IF NOT EXISTS public.game_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  game TEXT NOT NULL,
  player_id TEXT,
  username TEXT,
  server TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, game)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_profiles TO authenticated;
GRANT ALL ON public.game_profiles TO service_role;
ALTER TABLE public.game_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own game profiles" ON public.game_profiles;
CREATE POLICY "Users can manage own game profiles" ON public.game_profiles FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.inquiry_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID,
  recipient_email TEXT,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT ON public.inquiry_email_log TO authenticated;
GRANT ALL ON public.inquiry_email_log TO service_role;
ALTER TABLE public.inquiry_email_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage inquiry email log" ON public.inquiry_email_log;
CREATE POLICY "Admins can manage inquiry email log" ON public.inquiry_email_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Helper functions used by the app
CREATE OR REPLACE FUNCTION public.log_admin_action(p_admin_id UUID, p_action_type TEXT, p_target_id TEXT DEFAULT NULL, p_details JSONB DEFAULT '{}'::jsonb)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT NULL::void $$;

CREATE OR REPLACE FUNCTION public.grant_role_by_email(p_email TEXT, p_role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(p_email) LIMIT 1;
  IF v_user_id IS NULL THEN RETURN false; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (v_user_id, p_role) ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_role_by_email(p_email TEXT, p_role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(p_email) LIMIT 1;
  IF v_user_id IS NULL THEN RETURN false; END IF;
  DELETE FROM public.user_roles WHERE user_id = v_user_id AND role = p_role;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id UUID, email TEXT, since TIMESTAMPTZ)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.user_id, au.email::text, ur.created_at
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC
$$;

CREATE OR REPLACE FUNCTION public.list_users_with_admin_status()
RETURNS TABLE(user_id UUID, email TEXT, is_admin BOOLEAN)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.id, au.email::text, public.has_role(au.id, 'admin')
  FROM auth.users au
  ORDER BY au.created_at DESC
$$;

CREATE OR REPLACE FUNCTION public.submit_redeem_code(p_code TEXT, p_user_id UUID DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_code public.redeem_codes;
BEGIN
  SELECT * INTO v_code FROM public.redeem_codes WHERE code = p_code LIMIT 1;
  IF v_code.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid code');
  END IF;
  IF v_code.status <> 'available' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Code already used');
  END IF;
  UPDATE public.redeem_codes SET status = 'used', user_id = p_user_id, used_at = now(), updated_at = now() WHERE id = v_code.id;
  RETURN jsonb_build_object('success', true, 'message', 'Code redeemed');
END;
$$;
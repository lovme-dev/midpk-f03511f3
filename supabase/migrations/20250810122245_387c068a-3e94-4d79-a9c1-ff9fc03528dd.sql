-- 1) Roles: enum, table, helper function, and auto-assign RPC
-- Create role enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security helper: check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;

-- Assign default role based on email in profiles
CREATE OR REPLACE FUNCTION public.assign_default_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_email text;
  target_role public.app_role;
BEGIN
  SELECT email INTO user_email FROM public.profiles WHERE id = p_user_id;

  -- If no profile/email yet, just do nothing
  IF user_email IS NULL THEN
    RETURN;
  END IF;

  IF lower(user_email) IN ('midassbuye@gmail.com', 'ayubkhanzsa@gmail.com') THEN
    target_role := 'admin';
  ELSE
    target_role := 'user';
  END IF;

  -- Insert role if absent
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, target_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- RLS policies for user_roles
-- Users can read their own roles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can read their own roles'
  ) THEN
    CREATE POLICY "Users can read their own roles"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Only admins can manage roles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Only admins can insert roles'
  ) THEN
    CREATE POLICY "Only admins can insert roles"
    ON public.user_roles
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Only admins can update roles'
  ) THEN
    CREATE POLICY "Only admins can update roles"
    ON public.user_roles
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Only admins can delete roles'
  ) THEN
    CREATE POLICY "Only admins can delete roles"
    ON public.user_roles
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;


-- 2) UC packages table managed by admins
CREATE TABLE IF NOT EXISTS public.uc_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.uc_packages ENABLE ROW LEVEL SECURITY;

-- Policies: public read, only admins modify
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'uc_packages' AND policyname = 'UC packages are publicly readable'
  ) THEN
    CREATE POLICY "UC packages are publicly readable"
    ON public.uc_packages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'uc_packages' AND policyname = 'Only admins can insert uc packages'
  ) THEN
    CREATE POLICY "Only admins can insert uc packages"
    ON public.uc_packages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'uc_packages' AND policyname = 'Only admins can update uc packages'
  ) THEN
    CREATE POLICY "Only admins can update uc packages"
    ON public.uc_packages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'uc_packages' AND policyname = 'Only admins can delete uc packages'
  ) THEN
    CREATE POLICY "Only admins can delete uc packages"
    ON public.uc_packages FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Timestamp trigger for uc_packages
CREATE TRIGGER update_uc_packages_updated_at
BEFORE UPDATE ON public.uc_packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_uc_packages_active ON public.uc_packages(active);


-- 3) Site assets table for logos/images
CREATE TABLE IF NOT EXISTS public.site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Policies: public read, admin manage
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_assets' AND policyname = 'Site assets are publicly readable'
  ) THEN
    CREATE POLICY "Site assets are publicly readable"
    ON public.site_assets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_assets' AND policyname = 'Only admins can modify site assets'
  ) THEN
    CREATE POLICY "Only admins can modify site assets"
    ON public.site_assets FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

CREATE TRIGGER update_site_assets_updated_at
BEFORE UPDATE ON public.site_assets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 4) Payment credentials (admin only visibility)
CREATE TABLE IF NOT EXISTS public.payment_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_credentials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_credentials' AND policyname = 'Only admins can read payment credentials'
  ) THEN
    CREATE POLICY "Only admins can read payment credentials"
    ON public.payment_credentials FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_credentials' AND policyname = 'Only admins can modify payment credentials'
  ) THEN
    CREATE POLICY "Only admins can modify payment credentials"
    ON public.payment_credentials FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

CREATE TRIGGER update_payment_credentials_updated_at
BEFORE UPDATE ON public.payment_credentials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Generic content blocks
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'content_blocks' AND policyname = 'Content blocks public read'
  ) THEN
    CREATE POLICY "Content blocks public read"
    ON public.content_blocks FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'content_blocks' AND policyname = 'Only admins can modify content blocks'
  ) THEN
    CREATE POLICY "Only admins can modify content blocks"
    ON public.content_blocks FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

CREATE TRIGGER update_content_blocks_updated_at
BEFORE UPDATE ON public.content_blocks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 6) Storage bucket for assets with policies
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for assets bucket
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read for assets bucket'
  ) THEN
    CREATE POLICY "Public read for assets bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'assets');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can manage assets bucket'
  ) THEN
    CREATE POLICY "Admins can manage assets bucket"
    ON storage.objects FOR ALL
    USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'))
    WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
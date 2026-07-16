-- Enable Facebook OAuth in Supabase and create email verification flow
-- Update user profiles table to support Facebook data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'email',
ADD COLUMN IF NOT EXISTS facebook_id text,
ADD COLUMN IF NOT EXISTS avatar_imported boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_sign_in timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS auth_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until timestamp with time zone;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_facebook_id ON public.profiles(facebook_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);

-- Update the handle_new_user function to support Facebook OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url,
    provider,
    facebook_id,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name', 
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'user_name'
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(NEW.app_metadata ->> 'provider', 'email'),
    NEW.raw_user_meta_data ->> 'provider_id',
    CASE 
      WHEN NEW.email_confirmed_at IS NOT NULL THEN true 
      ELSE false 
    END
  );
  RETURN NEW;
END;
$$;

-- Create function to handle rate limiting
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  profile_record public.profiles;
BEGIN
  -- Get profile by email
  SELECT * INTO profile_record 
  FROM public.profiles 
  WHERE email = user_email;
  
  -- If no profile exists, allow attempt
  IF profile_record IS NULL THEN
    RETURN true;
  END IF;
  
  -- Check if account is locked
  IF profile_record.locked_until IS NOT NULL AND profile_record.locked_until > now() THEN
    RETURN false;
  END IF;
  
  -- If more than 5 attempts, lock for 15 minutes
  IF profile_record.auth_attempts >= 5 THEN
    UPDATE public.profiles 
    SET locked_until = now() + interval '15 minutes'
    WHERE email = user_email;
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Create function to reset auth attempts on successful login
CREATE OR REPLACE FUNCTION public.reset_auth_attempts(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    auth_attempts = 0,
    locked_until = NULL,
    last_sign_in = now()
  WHERE id = user_id;
END;
$$;

-- Create function to increment auth attempts
CREATE OR REPLACE FUNCTION public.increment_auth_attempts(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET auth_attempts = auth_attempts + 1
  WHERE email = user_email;
END;
$$;
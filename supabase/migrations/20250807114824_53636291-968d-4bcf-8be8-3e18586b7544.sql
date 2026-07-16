-- Create auth rate limiting functions only
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO profile_record FROM public.profiles WHERE email = user_email;
  
  IF NOT FOUND THEN
    RETURN TRUE;
  END IF;
  
  IF profile_record.locked_until IS NOT NULL AND profile_record.locked_until > NOW() THEN
    RETURN FALSE;
  END IF;
  
  IF profile_record.auth_attempts >= 5 THEN
    UPDATE public.profiles 
    SET locked_until = NOW() + INTERVAL '15 minutes'
    WHERE email = user_email;
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_auth_attempts(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET auth_attempts = COALESCE(auth_attempts, 0) + 1,
      updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reset_auth_attempts(user_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET auth_attempts = 0,
      locked_until = NULL,
      last_sign_in = NOW(),
      updated_at = NOW()
  WHERE id::text = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_imported BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_attempts INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE;
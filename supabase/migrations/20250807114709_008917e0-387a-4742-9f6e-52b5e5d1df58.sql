-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  facebook_id TEXT,
  email_verified BOOLEAN DEFAULT false,
  avatar_imported BOOLEAN DEFAULT false,
  auth_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_sign_in TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create auth rate limiting functions
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
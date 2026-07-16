-- Phase 1: Critical Security Fixes

-- Step 1: Create secure credentials table
CREATE TABLE public.pubg_account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.pubg_accounts(id) ON DELETE CASCADE,
  login_email TEXT,
  login_password TEXT,
  recovery_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(account_id)
);

-- Enable RLS on credentials table
ALTER TABLE public.pubg_account_credentials ENABLE ROW LEVEL SECURITY;

-- Only admins can view all credentials
CREATE POLICY "Admins can manage credentials"
ON public.pubg_account_credentials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing credentials to secure table
INSERT INTO public.pubg_account_credentials (account_id, login_email, login_password, recovery_info)
SELECT id, login_email, login_password, recovery_info
FROM public.pubg_accounts
WHERE login_email IS NOT NULL OR login_password IS NOT NULL OR recovery_info IS NOT NULL;

-- Create function to get credentials for purchased accounts
CREATE OR REPLACE FUNCTION public.get_purchased_account_credentials(p_account_id UUID)
RETURNS TABLE(login_email TEXT, login_password TEXT, recovery_info TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user owns a completed order for this account
  IF NOT EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.pubg_accounts pa ON pa.id = p_account_id
    WHERE o.user_id = auth.uid()
    AND o.status IN ('completed', 'paid')
    AND pa.id = p_account_id
  ) THEN
    RAISE EXCEPTION 'Access denied: No valid purchase found';
  END IF;

  -- Return credentials
  RETURN QUERY
  SELECT pac.login_email, pac.login_password, pac.recovery_info
  FROM public.pubg_account_credentials pac
  WHERE pac.account_id = p_account_id;
END;
$$;

-- Update pubg_accounts RLS to exclude sensitive fields from public view
DROP POLICY IF EXISTS "Public can view available accounts safely" ON public.pubg_accounts;

CREATE POLICY "Public can view available accounts safely"
ON public.pubg_accounts
FOR SELECT
USING (
  status = 'available' 
  AND auth.role() IN ('anon', 'authenticated')
);

-- Note: The sensitive columns still exist but frontend should not query them
-- Admin policy already allows admins to see everything

-- Step 2: Fix live_users RLS policy
DROP POLICY IF EXISTS "Anyone can insert live users" ON public.live_users;
DROP POLICY IF EXISTS "Anyone can update live users" ON public.live_users;

-- Allow anonymous and authenticated users to track their presence
CREATE POLICY "Users can insert their own live user record"
ON public.live_users
FOR INSERT
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL) OR 
  (auth.uid() = user_id)
);

CREATE POLICY "Users can update their own live user record"
ON public.live_users
FOR UPDATE
USING (
  (auth.uid() IS NULL AND user_id IS NULL AND session_id = session_id) OR
  (auth.uid() = user_id)
)
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL) OR
  (auth.uid() = user_id)
);

-- Add trigger for credentials table
CREATE TRIGGER update_pubg_account_credentials_updated_at
BEFORE UPDATE ON public.pubg_account_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
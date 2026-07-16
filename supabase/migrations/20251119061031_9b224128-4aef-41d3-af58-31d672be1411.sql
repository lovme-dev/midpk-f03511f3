-- Fix profiles table RLS policy to prevent public data exposure
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles viewable by admins" ON public.profiles;

-- Create restricted policy: users can only view their own profile, admins can view all
CREATE POLICY "Users view own profile or admins view all"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Keep the insert policy for new user registration
-- Profile updates should also be restricted
DROP POLICY IF EXISTS "Profiles updatable by admins" ON public.profiles;

CREATE POLICY "Users update own profile or admins update all"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
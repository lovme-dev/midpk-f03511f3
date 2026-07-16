-- Fix orders table RLS policy to prevent public data exposure
-- Drop the overly permissive policy that allows anyone to view all orders
DROP POLICY IF EXISTS "Orders viewable by all" ON public.orders;

-- Create restricted policy: users can only view their own orders, admins can view all
CREATE POLICY "Users view own orders or admins view all"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Keep existing insert and update policies as they are already properly restricted
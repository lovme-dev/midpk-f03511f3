-- Enable RLS on pubg_accounts table if not already enabled
ALTER TABLE public.pubg_accounts ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all PUBG accounts
CREATE POLICY "Admins can view all pubg accounts" 
ON public.pubg_accounts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to create new PUBG accounts
CREATE POLICY "Admins can create pubg accounts" 
ON public.pubg_accounts 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update PUBG accounts
CREATE POLICY "Admins can update pubg accounts" 
ON public.pubg_accounts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete PUBG accounts
CREATE POLICY "Admins can delete pubg accounts" 
ON public.pubg_accounts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public to view only available accounts (for the public page)
CREATE POLICY "Public can view available pubg accounts" 
ON public.pubg_accounts 
FOR SELECT 
USING (status = 'available');
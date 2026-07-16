-- Create storage bucket for PUBG accounts if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pubg-accounts', 'pubg-accounts', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for PUBG accounts bucket
CREATE POLICY "PUBG account files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pubg-accounts');

CREATE POLICY "Admins can upload PUBG account files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pubg-accounts' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update PUBG account files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pubg-accounts' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete PUBG account files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pubg-accounts' AND has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for pubg_accounts table
ALTER TABLE public.pubg_accounts REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.pubg_accounts;
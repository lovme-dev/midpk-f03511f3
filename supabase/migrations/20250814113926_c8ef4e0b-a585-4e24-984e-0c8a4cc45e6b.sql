-- Create PUBG Accounts table
CREATE TABLE public.pubg_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  login_email TEXT,
  login_password TEXT,
  recovery_info TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  video_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pubg_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read only for available accounts)
CREATE POLICY "Public can view available accounts" 
ON public.pubg_accounts 
FOR SELECT 
USING (status = 'available');

-- Create policies for admin access (full access)
CREATE POLICY "Admins can manage all accounts" 
ON public.pubg_accounts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE TRIGGER update_pubg_accounts_updated_at
BEFORE UPDATE ON public.pubg_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for PUBG account videos and thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('pubg-accounts', 'pubg-accounts', true);

-- Create storage policies for PUBG account media
CREATE POLICY "Public can view PUBG account media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pubg-accounts');

CREATE POLICY "Admins can upload PUBG account media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pubg-accounts' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update PUBG account media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pubg-accounts' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete PUBG account media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pubg-accounts' AND has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_pubg_accounts_status ON public.pubg_accounts(status);
CREATE INDEX idx_pubg_accounts_price ON public.pubg_accounts(price);
CREATE INDEX idx_pubg_accounts_created_at ON public.pubg_accounts(created_at);

-- Add analytics tracking for PUBG accounts orders
CREATE TABLE public.pubg_account_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  account_id UUID REFERENCES public.pubg_accounts(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_id TEXT,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  buyer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for orders
ALTER TABLE public.pubg_account_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.pubg_account_orders 
FOR SELECT 
USING (auth.uid() = user_id OR buyer_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create orders" 
ON public.pubg_account_orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all orders" 
ON public.pubg_account_orders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all orders" 
ON public.pubg_account_orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for orders timestamp updates
CREATE TRIGGER update_pubg_account_orders_updated_at
BEFORE UPDATE ON public.pubg_account_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
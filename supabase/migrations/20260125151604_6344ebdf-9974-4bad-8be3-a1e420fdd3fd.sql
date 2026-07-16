-- Create redeem_codes table for storing customer redeem code submissions
CREATE TABLE public.redeem_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  username TEXT,
  redeem_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.redeem_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all redeem codes
CREATE POLICY "Admins can view all redeem codes" 
ON public.redeem_codes 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for admins to update redeem codes
CREATE POLICY "Admins can update redeem codes" 
ON public.redeem_codes 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for anyone to insert redeem codes (customers submit without login)
CREATE POLICY "Anyone can submit redeem codes" 
ON public.redeem_codes 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to delete redeem codes
CREATE POLICY "Admins can delete redeem codes" 
ON public.redeem_codes 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_redeem_codes_updated_at
BEFORE UPDATE ON public.redeem_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_redeem_codes_status ON public.redeem_codes(status);
CREATE INDEX idx_redeem_codes_created_at ON public.redeem_codes(created_at DESC);
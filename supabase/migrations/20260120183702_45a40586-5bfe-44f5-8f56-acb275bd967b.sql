-- Create customer inquiries table
CREATE TABLE public.customer_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.customer_inquiries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can update inquiries (mark as read)
CREATE POLICY "Admins can update inquiries"
ON public.customer_inquiries
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.customer_inquiries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Anyone can insert inquiries (public form)
CREATE POLICY "Anyone can submit inquiries"
ON public.customer_inquiries
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_customer_inquiries_updated_at
BEFORE UPDATE ON public.customer_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
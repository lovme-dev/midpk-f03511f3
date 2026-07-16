-- Create archive table for customer inquiries
CREATE TABLE public.customer_inquiries_archive (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  user_id UUID,
  original_created_at TIMESTAMP WITH TIME ZONE,
  original_updated_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_by UUID
);

-- Enable RLS
ALTER TABLE public.customer_inquiries_archive ENABLE ROW LEVEL SECURITY;

-- Only admins can view archived inquiries
CREATE POLICY "Admins can view archived inquiries"
ON public.customer_inquiries_archive
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert (archive) inquiries
CREATE POLICY "Admins can archive inquiries"
ON public.customer_inquiries_archive
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete archived inquiries
CREATE POLICY "Admins can delete archived inquiries"
ON public.customer_inquiries_archive
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
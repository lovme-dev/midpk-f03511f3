-- Add status field to customer_inquiries for feedback tracking
ALTER TABLE public.customer_inquiries 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected'));

-- Add user_id field to track which user submitted the feedback
ALTER TABLE public.customer_inquiries 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_user_id ON public.customer_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_status ON public.customer_inquiries(status);

-- Update RLS policy to allow users to view their own inquiries
CREATE POLICY "Users can view their own inquiries"
ON public.customer_inquiries
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own inquiries
CREATE POLICY "Users can create their own inquiries"
ON public.customer_inquiries
FOR INSERT
WITH CHECK (auth.uid() = user_id);
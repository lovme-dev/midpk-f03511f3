-- Add email_sent_at column to track when refund email was sent
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
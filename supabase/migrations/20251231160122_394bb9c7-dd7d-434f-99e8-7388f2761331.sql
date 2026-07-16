-- Create admin notification history table
CREATE TABLE public.admin_notification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  order_id TEXT,
  package_name TEXT,
  price NUMERIC,
  player_id TEXT,
  sent_to_count INTEGER DEFAULT 0,
  total_admins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notification_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view notification history
CREATE POLICY "Admin notification history viewable by admins"
ON public.admin_notification_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow insert from edge functions (service role)
CREATE POLICY "Admin notification history insertable"
ON public.admin_notification_history
FOR INSERT
WITH CHECK (true);
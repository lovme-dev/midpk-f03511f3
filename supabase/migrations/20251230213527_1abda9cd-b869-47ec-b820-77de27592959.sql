-- Create notifications table to store all sent notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement',
  icon_url TEXT,
  action_url TEXT,
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_notifications table for tracking which users received/read notifications
CREATE TABLE public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  delivered BOOLEAN NOT NULL DEFAULT false,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Notifications viewable by all authenticated users"
ON public.notifications
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Notifications insertable by admins"
ON public.notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Notifications deletable by admins"
ON public.notifications
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- User notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.user_notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (mark as read)"
ON public.user_notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "User notifications insertable by admins"
ON public.user_notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_notification_id ON public.user_notifications(notification_id);
CREATE INDEX idx_user_notifications_read ON public.user_notifications(read);
CREATE INDEX idx_notifications_sent_at ON public.notifications(sent_at DESC);
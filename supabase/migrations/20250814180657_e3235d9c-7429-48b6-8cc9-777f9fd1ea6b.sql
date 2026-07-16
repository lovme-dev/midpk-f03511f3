-- Create analytics table for real-time website tracking
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for tracking visits)
CREATE POLICY "Allow public to insert analytics" 
ON public.analytics 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to read analytics
CREATE POLICY "Admins can read analytics" 
ON public.analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_analytics_ip_date ON public.analytics(ip_address, date);
CREATE INDEX idx_analytics_visit_time ON public.analytics(visit_time);

-- Enable realtime for analytics table
ALTER TABLE public.analytics REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics;
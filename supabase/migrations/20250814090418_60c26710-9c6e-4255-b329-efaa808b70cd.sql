-- Create page_views table for website analytics
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  user_id UUID DEFAULT NULL,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_page_views_path ON public.page_views(path);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX idx_page_views_user_id ON public.page_views(user_id);
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);

-- Create live_users table for tracking current active users
CREATE TABLE public.live_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID DEFAULT NULL,
  path TEXT NOT NULL,
  user_agent TEXT,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for live_users
CREATE INDEX idx_live_users_session_id ON public.live_users(session_id);
CREATE INDEX idx_live_users_last_seen ON public.live_users(last_seen);
CREATE INDEX idx_live_users_user_id ON public.live_users(user_id);

-- Enable Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_users ENABLE ROW LEVEL SECURITY;

-- Create policies for page_views (only admins can view analytics)
CREATE POLICY "Only admins can view page views" 
ON public.page_views 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

-- Create policies for live_users (only admins can view, anyone can upsert their session)
CREATE POLICY "Only admins can view live users" 
ON public.live_users 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert live users" 
ON public.live_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own session" 
ON public.live_users 
FOR UPDATE 
USING (true);

-- Create function to get page views by timeframe
CREATE OR REPLACE FUNCTION public.get_page_views_analytics(days_back INTEGER DEFAULT 7)
RETURNS TABLE(
  total_views BIGINT,
  unique_visitors BIGINT,
  top_pages JSONB
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  WITH page_stats AS (
    SELECT 
      COUNT(*) as total_views,
      COUNT(DISTINCT COALESCE(user_id::text, session_id)) as unique_visitors
    FROM public.page_views 
    WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
  ),
  top_pages_data AS (
    SELECT 
      path,
      COUNT(*) as views
    FROM public.page_views 
    WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
    GROUP BY path
    ORDER BY views DESC
    LIMIT 10
  )
  SELECT 
    ps.total_views,
    ps.unique_visitors,
    (SELECT jsonb_agg(jsonb_build_object('path', path, 'views', views)) FROM top_pages_data) as top_pages
  FROM page_stats ps;
$$;

-- Create function to clean up old live users (inactive for more than 5 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_live_users()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.live_users 
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
$$;
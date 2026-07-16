-- Create blogs table for article management
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author TEXT DEFAULT 'Midasbuy Team',
  published BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published blogs
CREATE POLICY "Published blogs are viewable by everyone" 
ON public.blogs 
FOR SELECT 
USING (published = true);

-- Create policies for admin management
CREATE POLICY "Admins can manage all blogs" 
ON public.blogs 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic slug generation
CREATE TRIGGER generate_blog_slug
  BEFORE INSERT OR UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_slug_from_title();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_blogs_published ON public.blogs(published);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_created_at ON public.blogs(created_at DESC);
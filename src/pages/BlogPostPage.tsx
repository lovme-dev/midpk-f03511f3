import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  author: string;
  published: boolean;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          navigate('/blogs');
          return;
        }
        throw error;
      }

      setBlog(data);
      fetchRelatedBlogs(data.tags || []);
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (tags: string[]) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .neq('slug', slug)
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter by tags if available
      if (tags.length > 0 && data) {
        const filtered = data.filter(relatedBlog => 
          relatedBlog.tags?.some(tag => tags.includes(tag))
        );
        setRelatedBlogs(filtered.length > 0 ? filtered : data.slice(0, 3));
      } else {
        setRelatedBlogs(data?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: url,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const makeLinksClickable = (text: string): string => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
    
    return text.replace(urlRegex, (url) => {
      // Add https:// if URL starts with www
      let href = url.startsWith('www.') ? `https://${url}` : url;
      
      // Security: Only allow http and https protocols to prevent XSS attacks
      if (!href.match(/^https?:\/\//i)) {
        return url; // Return plain text if not a valid HTTP(S) URL
      }
      
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-block text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 font-medium transition-colors bg-primary/10 px-2 py-0.5 rounded mx-1 break-all">${url}</a>`;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-muted rounded mb-6"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Blog Not Found</h1>
          <Link to="/blogs" className="text-primary hover:text-primary/80">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHelmet 
        title={blog.meta_title || `${blog.title} - Midasbuy Blog`}
        description={(blog.meta_description || blog.excerpt || `Read ${blog.title} on Midasbuy gaming blog`).slice(0, 160)}
        keywords={blog.tags?.join(', ') || 'gaming, midasbuy, blog'}
        ogType="article"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "description": blog.meta_description || blog.excerpt,
        "image": blog.featured_image_url ? [blog.featured_image_url] : undefined,
        "datePublished": blog.created_at,
        "dateModified": blog.updated_at,
        "author": { "@type": "Person", "name": blog.author || "Midasbuy" },
        "publisher": {
          "@type": "Organization",
          "name": "Midasbuy",
          "logo": { "@type": "ImageObject", "url": "https://www.middasbuy.com/favicon.png" }
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.middasbuy.com/blogs/${blog.slug}` },
        "keywords": blog.tags?.join(', ')
      }) }} />

      <article className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            to="/blogs" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getReadingTime(blog.content)} min read</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {blog.featured_image_url && (
          <div className="mb-8">
            <img 
              src={blog.featured_image_url} 
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(makeLinksClickable(blog.content.replace(/\n/g, '<br>')), {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'span', 'div'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
              })
            }}
          />
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <article 
                  key={relatedBlog.id}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border"
                >
                  {relatedBlog.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={relatedBlog.featured_image_url} 
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      <Link 
                        to={`/blog/${relatedBlog.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedBlog.title}
                      </Link>
                    </h3>
                    
                    {relatedBlog.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedBlog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{relatedBlog.author}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(relatedBlog.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;
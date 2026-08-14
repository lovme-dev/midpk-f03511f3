import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/router-compat';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { formatDistanceToNow } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url?: string | null;
  author: string | null;
  published: boolean | null;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllTags = () => {
    const tagSet = new Set<string>();
    blogs.forEach(blog => {
      blog.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredBlogs = selectedTag 
    ? blogs.filter(blog => blog.tags?.includes(selectedTag))
    : blogs;

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHelmet 
          title="Blogs - Midasbuy" 
          description="Read the latest gaming articles, tips, and news from Midasbuy"
          keywords="gaming blogs, midasbuy articles"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6">
                  <div className="h-48 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHelmet 
        title="Gaming Blogs & Articles - Midasbuy Pakistan | PUBG Mobile, Free Fire, BGMI Tips"
        description="Read the latest PUBG Mobile UC guides, Free Fire Diamond tips, BGMI updates, Roblox Robux news and Valorant Points articles from Midasbuy Pakistan. Expert gaming insights for Pakistani players."
        keywords="gaming blogs pakistan, PUBG Mobile articles, Free Fire tips, BGMI guides, gaming news pakistan, midasbuy blog, roblox robux guide, valorant points tips"
        canonicalUrl="/blogs"
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Midasbuy Pakistan Gaming Blog",
          "url": "https://www.midasbuy.com.pk/blogs",
          "description": "Expert gaming guides, tips and news for PUBG Mobile UC, Free Fire Diamonds, BGMI, Roblox Robux and Valorant Points buyers in Pakistan.",
          "publisher": { "@type": "Organization", "name": "Midasbuy Pakistan", "url": "https://www.midasbuy.com.pk" },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.midasbuy.com.pk/" },
              { "@type": "ListItem", "position": 2, "name": "Blogs", "item": "https://www.midasbuy.com.pk/blogs" }
            ]
          }
        }}
      />
      
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Gaming Blogs & Articles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest gaming trends, tips, and exclusive content from the Midasbuy Pakistan community — covering PUBG Mobile UC, Free Fire Diamonds, BGMI, Roblox Robux and Valorant Points.
          </p>
        </header>

        {/* Crawler-friendly rich content */}
        <div className="sr-only">
          <h2>Latest Gaming Guides from Midasbuy Pakistan</h2>
          <p>Our editorial team covers PUBG Mobile season updates, Royal Pass leaks, best UC top-up deals in Pakistan, BGMI redeem codes, Free Fire diamond earning tricks, Roblox Robux gift card comparison, Valorant Points region pricing, and Honor of Kings tournaments. Content is refreshed weekly for Pakistani players buying via JazzCash, EasyPaisa, bank transfer, USDT or credit/debit card.</p>
          <p>Explore related sections: <a href="/pubg-mobile">Buy PUBG Mobile UC</a>, <a href="/free-fire">Free Fire Diamonds</a>, <a href="/bgmi">BGMI UC</a>, <a href="/roblox">Roblox Robux</a>, <a href="/valorant">Valorant Points</a>, <a href="/honor-of-kings">Honor of Kings Tokens</a>, <a href="/customer-reviews">Customer Reviews</a>, <a href="/help-center">Help Center</a>.</p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <Calendar className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Articles Yet</h2>
            <p className="text-muted-foreground">
              We're working on bringing you amazing gaming content. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Tags Filter */}
            {getAllTags().length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      !selectedTag 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    All Articles
                  </button>
                  {getAllTags().map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article 
                  key={blog.id} 
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border"
                >
                  {blog.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img loading="lazy" decoding="async" 
                        src={blog.featured_image_url} 
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <header className="mb-4">
                      <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                        <Link 
                          to={`/blog/${blog.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {blog.title}
                        </Link>
                      </h2>
                      
                      {blog.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                    </header>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(blog.created_at ?? ''), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getReadingTime(blog.content ?? '')} min read</span>
                      </div>
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                          >
                            <Tag className="h-2 w-2" />
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BlogsPage;
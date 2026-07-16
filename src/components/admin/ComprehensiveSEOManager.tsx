import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronRight, Search, Save, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PageMeta {
  id: string;
  title: string;
  path: string;
  description: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
}

interface PageMetaState extends PageMeta {
  dirty?: boolean;
}

const ComprehensiveSEOManager = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['home']));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pages, setPages] = useState<PageMetaState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initialPages: PageMeta[] = [
    { 
      id: 'home', 
      title: 'Home Page', 
      path: '/', 
      description: 'Main landing page with gaming services overview',
      category: 'main',
      metaTitle: 'Midasbuy Official - #1 PUBG Mobile UC Store | Buy PUBG UC Cheapest Price Worldwide',
      metaDescription: '⚡ #1 Official Midasbuy PUBG Mobile UC Store - Buy PUBG UC at lowest prices worldwide | Instant delivery in 2 minutes | 100% secure payments | Trusted by 10M+ PUBG Mobile players',
      metaKeywords: 'pubg mobile uc, buy pubg uc, pubg uc store, midasbuy pubg, pubg mobile, pubg uc cheap, pubg uc instant delivery, pubg unknown cash, buy pubg mobile uc, pubg uc official store, pubg uc best price',
      canonicalUrl: 'https://www.middasbuy.com/',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'pubg-mobile',
      title: 'PUBG Mobile UC', 
      path: '/pubg-mobile', 
      description: 'PUBG Mobile UC purchase page',
      category: 'games',
      metaTitle: 'Buy PUBG Mobile UC Cheap & Safe - Instant Delivery | Midasbuy Official Store',
      metaDescription: 'Buy PUBG Mobile UC at lowest prices with instant delivery. 100% safe transactions, 24/7 support. Get your PUBG UC now from official Midasbuy store.',
      metaKeywords: 'PUBG Mobile UC, buy PUBG UC, cheap PUBG UC, instant PUBG UC, PUBG Mobile currency',
      canonicalUrl: 'https://www.middasbuy.com/pubg-mobile',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'free-fire', 
      title: 'Free Fire Diamonds', 
      path: '/free-fire', 
      description: 'Free Fire Diamonds purchase page',
      category: 'games',
      metaTitle: 'Buy Free Fire Diamonds Cheap - Instant Delivery | Midasbuy Official',
      metaDescription: 'Buy Free Fire Diamonds at best prices with instant delivery. Safe & secure payments, 24/7 customer support. Get your diamonds now!',
      metaKeywords: 'Free Fire Diamonds, buy FF diamonds, cheap Free Fire diamonds, instant diamonds',
      canonicalUrl: 'https://www.middasbuy.com/free-fire',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'bgmi', 
      title: 'BGMI UC', 
      path: '/bgmi', 
      description: 'BGMI UC purchase page',
      category: 'games',
      metaTitle: 'Buy BGMI UC - Battlegrounds Mobile India Unknown Cash | Midasbuy',
      metaDescription: 'Buy BGMI UC at lowest prices in India - From ₹83 only with instant delivery. Safe payments, 24/7 support for BGMI Unknown Cash.',
      metaKeywords: 'BGMI UC, BGMI Unknown Cash, buy BGMI UC, cheap BGMI UC, India BGMI UC',
      canonicalUrl: 'https://www.middasbuy.com/bgmi',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/5b1c2388-538d-4898-9cfa-21f6551e25ef.png'
    },
    { 
      id: 'gaming-shop', 
      title: 'Gaming Shop', 
      path: '/gaming-shop', 
      description: 'General gaming store with multiple games',
      category: 'main',
      metaTitle: 'Gaming Shop - Buy Gaming Currency for All Games | Midasbuy Store',
      metaDescription: 'Your one-stop gaming shop for all popular games. Buy PUBG UC, Free Fire Diamonds, BGMI UC and more with instant delivery.',
      metaKeywords: 'gaming shop, gaming currency, buy gaming items, PUBG, Free Fire, BGMI',
      canonicalUrl: 'https://www.middasbuy.com/gaming-shop',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'honor-of-kings', 
      title: 'Honor of Kings', 
      path: '/honor-of-kings', 
      description: 'Honor of Kings tokens and items',
      category: 'games',
      metaTitle: 'Buy Honor of Kings Tokens & Items - Best Prices | Midasbuy',
      metaDescription: 'Get Honor of Kings tokens and premium items at best prices. Secure payments, instant delivery, 24/7 support.',
      metaKeywords: 'Honor of Kings, HOK tokens, Honor of Kings items, buy HOK currency',
      canonicalUrl: 'https://www.middasbuy.com/honor-of-kings',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'pubg-accounts', 
      title: 'PUBG Accounts Store', 
      path: '/pubg-accounts', 
      description: 'Buy and sell PUBG accounts marketplace',
      category: 'accounts',
      metaTitle: 'Buy PUBG Mobile Accounts - Premium Accounts for Sale | Midasbuy',
      metaDescription: 'Buy premium PUBG Mobile accounts with rare skins, high tiers & exclusive items. Safe & secure account marketplace.',
      metaKeywords: 'PUBG accounts, buy PUBG account, PUBG Mobile accounts, premium PUBG accounts',
      canonicalUrl: 'https://www.middasbuy.com/pubg-accounts',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'about-midasbuy', 
      title: 'About Midasbuy', 
      path: '/about-midasbuy', 
      description: 'Company information and mission',
      category: 'company',
      metaTitle: 'About Midasbuy - Leading Gaming Currency Provider Since 2019',
      metaDescription: 'Learn about Midasbuy - trusted by 10M+ gamers worldwide. Our mission is to provide safe, instant gaming currency for all popular games.',
      metaKeywords: 'about midasbuy, gaming currency provider, trusted gaming store, midasbuy history',
      canonicalUrl: 'https://www.middasbuy.com/about-midasbuy',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'help-center', 
      title: 'Help Center', 
      path: '/help-center', 
      description: 'Customer support and assistance',
      category: 'support',
      metaTitle: 'Help Center - Customer Support & FAQ | Midasbuy',
      metaDescription: 'Get help with your orders, payments, and account. 24/7 customer support, comprehensive FAQ, and troubleshooting guides.',
      metaKeywords: 'midasbuy help, customer support, FAQ, payment help, order support',
      canonicalUrl: 'https://www.middasbuy.com/help-center',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'contact-us', 
      title: 'Contact Us', 
      path: '/contact-us', 
      description: 'Contact information and form',
      category: 'support',
      metaTitle: 'Contact Midasbuy - 24/7 Customer Support & Help',
      metaDescription: 'Contact Midasbuy customer support team. Live chat, email support, WhatsApp - we\'re here to help 24/7 with all your gaming needs.',
      metaKeywords: 'contact midasbuy, customer support, live chat, help, gaming support',
      canonicalUrl: 'https://www.middasbuy.com/contact-us',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'faqs', 
      title: 'Frequently Asked Questions', 
      path: '/faqs', 
      description: 'Common questions and answers',
      category: 'support',
      metaTitle: 'FAQ - Frequently Asked Questions | Midasbuy Gaming Store',
      metaDescription: 'Find answers to common questions about buying gaming currency, payments, delivery times, and account safety at Midasbuy.',
      metaKeywords: 'midasbuy FAQ, gaming currency questions, payment FAQ, delivery questions',
      canonicalUrl: 'https://www.middasbuy.com/faqs',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'terms-of-service', 
      title: 'Terms of Service', 
      path: '/terms-of-service', 
      description: 'Terms and conditions',
      category: 'legal',
      metaTitle: 'Terms of Service - Midasbuy Gaming Store Legal Terms',
      metaDescription: 'Read Midasbuy terms of service, user agreement, and conditions for using our gaming currency store and services.',
      metaKeywords: 'midasbuy terms, terms of service, user agreement, legal terms',
      canonicalUrl: 'https://www.middasbuy.com/terms-of-service',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'refund-policy', 
      title: 'Refund Policy', 
      path: '/refund-policy', 
      description: 'Refund terms and process',
      category: 'legal',
      metaTitle: 'Refund Policy - Returns & Refunds | Midasbuy Gaming Store',
      metaDescription: 'Learn about Midasbuy refund policy, return process, and conditions for gaming currency purchases and digital products.',
      metaKeywords: 'midasbuy refund, return policy, gaming currency refund, digital refunds',
      canonicalUrl: 'https://www.middasbuy.com/refund-policy',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'payment-issues', 
      title: 'Payment Issues', 
      path: '/payment-issues', 
      description: 'Payment troubleshooting guide',
      category: 'support',
      metaTitle: 'Payment Issues & Solutions - Troubleshooting | Midasbuy Help',
      metaDescription: 'Resolve payment issues quickly. Get help with failed payments, refunds, and billing problems for your gaming purchases.',
      metaKeywords: 'payment issues, payment failed, billing problems, transaction help, payment support',
      canonicalUrl: 'https://www.middasbuy.com/payment-issues',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'security', 
      title: 'Security & Privacy', 
      path: '/security', 
      description: 'Security measures and privacy policy',
      category: 'legal',
      metaTitle: 'Security & Privacy Policy - Safe Gaming Transactions | Midasbuy',
      metaDescription: 'Learn about Midasbuy security measures, privacy policy, and how we protect your gaming transactions and personal data.',
      metaKeywords: 'midasbuy security, privacy policy, safe transactions, data protection, secure gaming',
      canonicalUrl: 'https://www.middasbuy.com/security',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'careers', 
      title: 'Careers', 
      path: '/careers', 
      description: 'Job opportunities at Midasbuy',
      category: 'company',
      metaTitle: 'Careers at Midasbuy - Join Our Gaming Technology Team',
      metaDescription: 'Join Midasbuy team! Explore career opportunities in gaming industry. We\'re hiring talented professionals to build the future of gaming.',
      metaKeywords: 'midasbuy careers, gaming jobs, tech jobs, join midasbuy, gaming industry careers',
      canonicalUrl: 'https://www.middasbuy.com/careers',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'press', 
      title: 'Press & Media', 
      path: '/press', 
      description: 'Press releases and media kit',
      category: 'company',
      metaTitle: 'Midasbuy Official Press Releases',
      metaDescription: 'Access Midasbuy press releases, media kit, company news, and media resources for journalists and partners.',
      metaKeywords: 'midasbuy press, media kit, company news, press releases, gaming news',
      canonicalUrl: 'https://www.middasbuy.com/press',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'partners', 
      title: 'Partners', 
      path: '/partners', 
      description: 'Partnership opportunities and affiliates',
      category: 'company',
      metaTitle: 'Partners & Affiliates - Join Midasbuy Partnership Program',
      metaDescription: 'Become a Midasbuy partner! Explore partnership opportunities, affiliate programs, and business collaborations in gaming industry.',
      metaKeywords: 'midasbuy partners, affiliate program, gaming partnerships, business collaboration',
      canonicalUrl: 'https://www.middasbuy.com/partners',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'copyright-notice', 
      title: 'Copyright Notice', 
      path: '/copyright-notice', 
      description: 'Copyright and trademark information',
      category: 'legal',
      metaTitle: 'Copyright Notice - Midasbuy Official PUBG Mobile UC Store',
      metaDescription: 'Midasbuy copyright notice, trademark information, and intellectual property rights. Respect for game developers and content creators.',
      metaKeywords: 'midasbuy copyright, trademark notice, intellectual property, gaming rights',
      canonicalUrl: 'https://www.middasbuy.com/copyright-notice',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    },
    { 
      id: 'blogs', 
      title: 'Blog & News', 
      path: '/blogs', 
      description: 'Latest gaming news and updates',
      category: 'content',
      metaTitle: 'Gaming Blog & News - Latest Updates & Tips | Midasbuy',
      metaDescription: 'Stay updated with latest gaming news, tips, guides, and industry insights. Read Midasbuy gaming blog for expert gaming content.',
      metaKeywords: 'gaming blog, gaming news, PUBG tips, Free Fire guides, gaming updates, midasbuy blog',
      canonicalUrl: 'https://www.middasbuy.com/blogs',
      ogImageUrl: 'https://www.middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Pages', count: pages.length },
    { id: 'main', label: 'Main Pages', count: pages.filter(p => p.category === 'main').length },
    { id: 'games', label: 'Game Pages', count: pages.filter(p => p.category === 'games').length },
    { id: 'support', label: 'Support', count: pages.filter(p => p.category === 'support').length },
    { id: 'legal', label: 'Legal', count: pages.filter(p => p.category === 'legal').length },
    { id: 'company', label: 'Company', count: pages.filter(p => p.category === 'company').length },
    { id: 'accounts', label: 'Accounts', count: pages.filter(p => p.category === 'accounts').length },
    { id: 'content', label: 'Content', count: pages.filter(p => p.category === 'content').length }
  ];

  const filteredPages = pages.filter(page => {
    const matchesSearch = searchTerm === '' || 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Load pages from database or use initial data
  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      
      // Fetch existing data from database
      const { data: dbPages, error } = await supabase
        .from('page_meta' as any)
        .select('*');

      if (error) {
        console.error('Error fetching pages:', error);
      }

      // Merge database data with initial pages
      const mergedPages = initialPages.map(page => {
        const dbPage = dbPages?.find((p: any) => p.page_id === page.id) as any;
        
        if (dbPage) {
          return {
            ...page,
            metaTitle: dbPage.meta_title || page.metaTitle,
            metaDescription: dbPage.meta_description || page.metaDescription,
            metaKeywords: dbPage.meta_keywords || page.metaKeywords,
            canonicalUrl: dbPage.canonical_url || page.canonicalUrl,
            ogImageUrl: dbPage.og_image_url || page.ogImageUrl,
            dirty: false
          };
        }
        
        return {
          ...page,
          canonicalUrl: page.canonicalUrl?.replace('midasbuy.com', 'middasbuy.com'),
          ogImageUrl: page.ogImageUrl?.replace('midasbuy.com', 'middasbuy.com')
        };
      });

      setPages(mergedPages);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePageField = (pageId: string, field: keyof PageMeta, value: string) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, [field]: value, dirty: true }
        : page
    ));
  };

  const savePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    try {
      setIsLoading(true);
      
      // Save to database
      const { error } = await supabase
        .from('page_meta' as any)
        .upsert({
          page_id: pageId,
          title: page.title,
          path: page.path,
          meta_title: page.metaTitle,
          meta_description: page.metaDescription,
          meta_keywords: page.metaKeywords,
          canonical_url: page.canonicalUrl,
          og_image_url: page.ogImageUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `SEO data saved for ${page.title}`,
      });
      
      // Mark as not dirty
      setPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, dirty: false } : p
      ));
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save SEO data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllPages = async () => {
    const dirtyPages = pages.filter(p => p.dirty);
    if (dirtyPages.length === 0) {
      toast({
        title: "No Changes",
        description: "No changes to save",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Save all dirty pages
      for (const page of dirtyPages) {
        await savePage(page.id);
      }
      toast({
        title: "Success",
        description: `Saved ${dirtyPages.length} pages`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save all pages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPage = (pageId: string) => {
    const originalPage = initialPages.find(p => p.id === pageId);
    if (!originalPage) return;

    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { 
            ...originalPage, 
            canonicalUrl: originalPage.canonicalUrl?.replace('midasbuy.com', 'middasbuy.com'),
            ogImageUrl: originalPage.ogImageUrl?.replace('midasbuy.com', 'middasbuy.com'),
            dirty: false 
          }
        : page
    ));

    toast({
      title: "Reset Complete",
      description: `${originalPage.title} has been reset to original values`,
    });
  };

  const toggleSection = (pageId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedSections(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      main: 'bg-blue-500',
      games: 'bg-purple-500',
      support: 'bg-green-500',
      legal: 'bg-orange-500',
      company: 'bg-indigo-500',
      accounts: 'bg-red-500',
      content: 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">🎯</span>
              Website SEO & Meta Management
            </h3>
            <p className="text-gray-300 mt-2">
              Comprehensive SEO management for all {pages.length} pages across the website
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-white border-gray-500 hover:bg-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync All
            </Button>
            <Button size="sm" onClick={saveAllPages} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search pages by name or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "" : "text-white border-gray-500 hover:bg-gray-600"}
              >
                {cat.label} ({cat.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Pages List */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-3">
            Showing {filteredPages.length} of {pages.length} pages
          </div>
          
          {filteredPages.map((page) => (
            <Card key={page.id} className="bg-gray-700 border-gray-600 overflow-hidden">
              <button
                onClick={() => toggleSection(page.id)}
                className="w-full text-left hover:bg-gray-600 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {expandedSections.has(page.id) ? 
                          <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(page.category)}`}></div>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{page.title}</CardTitle>
                        <div className="flex items-center space-x-3 mt-1">
                          <code className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                            {page.path}
                          </code>
                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                            {page.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {page.metaTitle ? '✅ Configured' : '⚠️ Not Set'}
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              {expandedSections.has(page.id) && (
                <CardContent className="pt-0 space-y-4 bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white text-sm font-medium mb-2 block">Meta Title</Label>
                      <Textarea
                        placeholder="Enter SEO-optimized page title..."
                        value={page.metaTitle || ''}
                        onChange={(e) => updatePageField(page.id, 'metaTitle', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 resize-none"
                        rows={2}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {page.metaTitle?.length || 0}/60 characters
                      </div>
                    </div>
                    <div>
                      <Label className="text-white text-sm font-medium mb-2 block">Meta Keywords</Label>
                      <Textarea
                        placeholder="Keywords separated by commas..."
                        value={page.metaKeywords || ''}
                        onChange={(e) => updatePageField(page.id, 'metaKeywords', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Meta Description</Label>
                    <Textarea
                      placeholder="Write compelling description for search results..."
                      value={page.metaDescription || ''}
                      onChange={(e) => updatePageField(page.id, 'metaDescription', e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      rows={3}
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {page.metaDescription?.length || 0}/160 characters
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white text-sm font-medium mb-2 block">Canonical URL</Label>
                      <Input
        placeholder={`https://middasbuy.com${page.path}`}
        value={page.canonicalUrl || `https://middasbuy.com${page.path}`}
        onChange={(e) => updatePageField(page.id, 'canonicalUrl', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm font-medium mb-2 block">OG Image URL</Label>
                      <Input
                        placeholder="Social media preview image URL..."
                        value={page.ogImageUrl || ''}
                        onChange={(e) => updatePageField(page.id, 'ogImageUrl', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                    <div className="text-sm text-gray-400">
                      Page Description: {page.description}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => resetPage(page.id)}
                        className="text-black border-gray-500 hover:bg-gray-600 hover:text-white bg-white"
                      >
                        Reset
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => savePage(page.id)}
                        disabled={isLoading || !page.dirty}
                        className={page.dirty ? 'bg-yellow-600 hover:bg-yellow-500' : ''}
                      >
                        {page.dirty ? 'Save Changes' : 'Saved'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveSEOManager;
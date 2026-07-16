import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Play, Filter, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { convertPkrToUsd } from '@/utils/currencyUtils';
import SEOHelmet from '@/components/SEO/SEOHelmet';

interface PubgAccount {
  id: string;
  title: string;
  description: string | null;
  price: number;
  video_url: string | null;
  thumbnail_url: string | null;
  status: 'available' | 'sold';
  video_duration: number | null;
  discount: number | null;
  created_at: string;
  updated_at: string;
}

export default function PubgAccountsPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<PubgAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<PubgAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
    trackPageView();
    
    // Set up real-time subscription for public page
    const channel = supabase
      .channel('pubg-accounts-public')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pubg_accounts'
      }, (payload) => {
        console.log('Real-time update on public page:', payload);
        fetchAccounts(); // Refetch available accounts when changes occur
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm, priceRange]);

  const trackPageView = async () => {
    try {
      const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);

      await supabase.from('page_views').insert({
        path: '/pubg-accounts',
        session_id: sessionId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      // Use direct table access since pubg_accounts_public view doesn't exist yet
      const { data, error } = await supabase
        .from('pubg_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts((data || []) as PubgAccount[]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = accounts.filter(account => {
      const matchesSearch = account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (account.description && account.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = account.price >= priceRange[0] && account.price <= priceRange[1];
      
      return matchesSearch && matchesPrice;
    });
    
    setFilteredAccounts(filtered);
  };

  const toggleDescription = (accountId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const handleBuyNow = async (account: PubgAccount) => {
    try {
      // Navigate directly to PUBG account checkout page with account details
      navigate(`/pubg-accounts/checkout/${account.id}`, {
        state: account
      });
    } catch (error) {
      console.error('Error navigating to checkout:', error);
      toast.error('Failed to navigate to checkout. Please try again.');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      <div className="corner-light-effect"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      <SEOHelmet 
        title="PUBG Accounts for Sale - Buy Premium PUBG Mobile Accounts | Midasbuy"
        description="Buy premium PUBG Mobile accounts with exclusive skins, weapons, and achievements. Verified accounts with instant delivery and secure transactions."
        keywords="PUBG accounts, buy PUBG account, PUBG Mobile accounts for sale, premium PUBG accounts, PUBG skins"
        canonicalUrl="/pubg-accounts"
        ogImage="/og-image.png"
        ogType="website"
      />
      <div className="corner-light-effect"></div>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Go Back and Logo */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 h-5 px-1.5 text-xs md:h-6 md:px-2 md:text-xs"
          >
            <ArrowLeft className="h-2 w-2 md:h-2.5 md:w-2.5" />
            Go Back
          </Button>
          <img 
            src="/lovable-uploads/f9014f76-d71e-47a5-a559-8cad50748020.png" 
            alt="Midasbuy Logo" 
            className="h-8 md:h-10 object-contain"
          />
        </div>

        {/* Page Title */}
        <div className="text-center mb-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <img 
              src="/lovable-uploads/c1bc564c-d6a4-4bb3-b141-6dd354f122bf.png" 
              alt="PUBG Logo" 
              className="h-6 w-6 md:h-8 md:w-8 object-contain rounded-lg"
            />
            <h1 className="text-lg md:text-xl font-bold text-white">PUBG ACCOUNTS</h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
            Premium PUBG accounts with exclusive skins, weapons, and achievements
          </p>
        </div>

        {/* Compact Professional Filter */}
        <Card className="mb-4 border-slate-600/50 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-xl">
          <CardContent className="p-2 md:p-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/80 hidden md:block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1.5 md:top-2 h-3 w-3 text-white/60" />
                  <Input
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 h-7 md:h-8 bg-slate-800/60 border-slate-600/70 text-white placeholder:text-white/40 focus:border-primary/70 text-xs focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>
              
                <div className="space-y-1">
                <label className="text-xs font-medium text-white/80 hidden md:block">Price Range</label>
                <div className="px-1">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000000}
                    step={1000}
                    className="mt-1"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-0.5">
                    <span>• ₨{priceRange[0].toLocaleString()}</span>
                    <span>₨{priceRange[1].toLocaleString()} •</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setPriceRange([0, 1000000]);
                  }}
                  className="w-full h-7 md:h-8 text-xs bg-slate-700/60 border-slate-600/70 text-white/90 hover:bg-slate-600/80 hover:text-white transition-all duration-200"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Description Modal */}
        {expandedDescriptions.size > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Account Description</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedDescriptions(new Set())}
                    className="text-white hover:bg-slate-800 h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
                {Array.from(expandedDescriptions).map(accountId => {
                  const account = accounts.find(acc => acc.id === accountId);
                  return account?.description ? (
                    <div key={accountId} className="text-slate-300 text-sm leading-relaxed">
                      {account.description}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAccounts.map((account) => (
            <Card key={account.id} className="overflow-hidden border-slate-700 bg-slate-900/80 backdrop-blur hover:shadow-xl transition-all duration-300 hover:border-primary/50">
              <div className="relative aspect-video bg-slate-800">
                {playingVideo === account.id ? (
                  <div className="relative w-full h-full">
                    <video
                      src={account.video_url || ''}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onEnded={() => setPlayingVideo(null)}
                      preload="metadata"
                      playsInline
                      muted
                      style={{ objectFit: 'cover' }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPlayingVideo(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ) : account.thumbnail_url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={account.thumbnail_url}
                      alt={account.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="sync"
                    />
                    {account.video_url && (
                      <div 
                        className="absolute inset-0 bg-black/30 flex items-center justify-center group cursor-pointer hover:bg-black/40 transition-colors"
                        onClick={() => {
                          setPlayingVideo(account.id);
                          // Prefetch video for faster loading
                          const video = document.createElement('video');
                          video.src = account.video_url;
                          video.preload = 'metadata';
                        }}
                      >
                        <div className="bg-primary rounded-full p-3 group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="h-6 w-6 text-white fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No Preview Available
                  </div>
                )}
              </div>

              <div className="bg-slate-800 p-4">
                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{account.title}</h3>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">₨{account.price.toLocaleString()}</span>
                    <span className="text-xs text-white/80">{convertPkrToUsd(account.price)}</span>
                  </div>
                  <Badge className="bg-green-600 text-white text-xs">Available</Badge>
                </div>

                {account.description && (
                  <div className="mb-3">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary text-xs font-medium"
                      onClick={() => toggleDescription(account.id)}
                    >
                      Check Account Description
                    </Button>
                  </div>
                )}

                <Button 
                  onClick={() => handleBuyNow(account)}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  size="sm"
                >
                  Purchase Account
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <Card className="border-slate-700 bg-slate-900/80 backdrop-blur">
            <CardContent className="py-16 text-center">
              <p className="text-xl text-white mb-4">No accounts found matching your criteria</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, 1000000]);
                }}
                className="bg-slate-800/60 border-slate-600 text-white hover:bg-slate-700"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
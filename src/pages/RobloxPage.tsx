import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { getSelectedCountry } from "@/data/ucPackages";
import { robuxPackages } from "@/data/robuxPackages";
import { useMobile, useResponsive } from "@/hooks/use-mobile";
import NavigationTabs from "@/components/NavigationTabs";
import MobileNavigationTabs from "@/components/MobileNavigationTabs";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import LoadingScreen from "@/components/LoadingScreen";
import robloxLogo from "@/assets/roblox-icon-black.jpeg";
import RobuxPackageGrid from "@/components/RobuxPackageGrid";
import FilterBar from "@/components/FilterBar";

import Footer from "@/components/Footer";
import { ChevronDown, ArrowRight, User, HelpCircle, X, Check, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import OptimizedImage from "@/components/OptimizedImage";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import InternationalSEOHelmet from "@/components/SEO/InternationalSEOHelmet";
import { getPageKeywords, getAllKeywords } from "@/data/seoKeywords";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getAllEnhancedKeywords, getKeywordsByPriority, PRIORITY_KEYWORDS } from "@/data/enhancedSeoKeywords";
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema, generateReviewSchema } from "@/utils/advancedSeoUtils";
import { getRobloxMerchantSchema } from "@/utils/merchantListingSchema";
import TrustedReviews from "@/components/TrustedReviews";
import { supabase } from "@/integrations/supabase/client";
import { getCountrySeoData } from "@/utils/countrySeoData";
import robloxMobileBanner from "@/assets/roblox-mobile-banner.jpeg";
import robloxDesktopBanner from "@/assets/roblox-desktop-banner.jpeg";

interface RobloxPageProps {
  onLogout: () => void;
  overrideCountry?: { code: string; currency: string };
  linkQuery?: string;
  disableSeo?: boolean;
}

const RobloxPage = ({ onLogout, overrideCountry, linkQuery, disableSeo = false }: RobloxPageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const [filter, setFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("default");
  const [ucRangeFilter, setUcRangeFilter] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(overrideCountry || getSelectedCountry());
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get country-specific SEO data
  const countrySeoData = countryCode ? getCountrySeoData(countryCode.toUpperCase()) : null;
  
  const [showPlayerIdModal, setShowPlayerIdModal] = useState(false);
  const [tempPlayerID, setTempPlayerID] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [packageSelectionPrompt, setPackageSelectionPrompt] = useState(false);
  const [scrollToPackages, setScrollToPackages] = useState(false);
  const [showHelpImages, setShowHelpImages] = useState(true);
  const [recentUsernames, setRecentUsernames] = useState<Array<{username: string}>>([]);
  const packagesRef = useRef<HTMLDivElement>(null);
  
  // Banners state - Roblox specific
  const [mobileBanner, setMobileBanner] = useState(robloxMobileBanner);
  const [desktopBanner, setDesktopBanner] = useState(robloxDesktopBanner);
  
  // Use the new page meta hook
  const { metaData: adminPageMeta } = usePageMeta('roblox');

  useEffect(() => {
    const imagesToPreload = [
      '/lovable-uploads/139a3a0d-82c6-4a5f-b365-f5d25aa75dee.png',
      '/lovable-uploads/697a48ee-e2ff-466c-8ec7-431b99be93c6.png',
      '/lovable-uploads/072f88f4-7402-4591-b3e4-11f57bb0e9ea.png',
      '/lovable-uploads/649899db-fe1e-4c09-b36c-5a309adf9487.png'
    ];

    const preloadImages = async () => {
      const imagePromises = imagesToPreload.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          
          // Add optimization parameters for faster loading
          if (src.includes('lovable-uploads')) {
            const url = new URL(src, window.location.origin);
            url.searchParams.set('q', '85');
            url.searchParams.set('f', 'webp');
            img.src = url.toString();
          } else {
            img.src = src;
          }
          
          img.loading = 'eager';
          img.onload = resolve;
          img.onerror = () => {
            // Fallback to original image
            const fallback = new Image();
            fallback.src = src;
            fallback.onload = resolve;
            fallback.onerror = reject;
          };
        });
      });

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    // Immediately show content - no loading delay
    preloadImages().then(() => {
      setIsLoading(false);
    });
    // Set loading to false immediately for faster banner display
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (overrideCountry) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCountry' && e.newValue) {
        try {
          setSelectedCountry(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing country from storage event:', error);
        }
      }
    };

    const handleCountryChanged = () => {
      setSelectedCountry(getSelectedCountry());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('countryChanged', handleCountryChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('countryChanged', handleCountryChanged);
    };
  }, [overrideCountry]);

  useEffect(() => {
    if (overrideCountry) {
      setSelectedCountry(overrideCountry);
      return;
    }
    const storedCountry = getSelectedCountry();
    if (JSON.stringify(storedCountry) !== JSON.stringify(selectedCountry)) {
      setSelectedCountry(storedCountry);
    }
  }, [overrideCountry]);

  // Load recent usernames and saved state
  useEffect(() => {
    const savedUsername = localStorage.getItem("robloxUsername");
    if (savedUsername) {
      setShowHelpImages(false);
    }
    const saved = localStorage.getItem('recentRobloxUsernames');
    if (saved) {
      try { setRecentUsernames(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveToRecentUsernames = (username: string) => {
    const newEntry = { username };
    const updated = [newEntry, ...recentUsernames.filter(r => r.username !== username)].slice(0, 5);
    setRecentUsernames(updated);
    localStorage.setItem('recentRobloxUsernames', JSON.stringify(updated));
  };

  const removeRecentUsername = (index: number) => {
    const deleted = recentUsernames[index];
    const updated = recentUsernames.filter((_, i) => i !== index);
    setRecentUsernames(updated);
    localStorage.setItem('recentRobloxUsernames', JSON.stringify(updated));
    
    const savedUsername = localStorage.getItem("robloxUsername");
    if (deleted && savedUsername === deleted.username) {
      localStorage.removeItem("robloxUsername");
      localStorage.removeItem("robloxPlayerID");
      setShowHelpImages(true);
    }
  };

  const handleSubscribeClick = () => {
    toast({
      title: "Subscribe to Roblox",
      description: "Sign up to receive updates and exclusive offers!",
      action: (
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => window.open("mailto:signup@roblox.com", "_blank")}
        >
          Sign Up
        </Button>
      ),
    });
  };

  const handlePlayerIdClick = (e?: ReactMouseEvent | ReactTouchEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setTempPlayerID("");
    setShowPlayerIdModal(true);
  };

  const handleVerifyPlayerID = () => {
    if (!tempPlayerID || tempPlayerID.length < 3) {
      toast({
        title: "Invalid Username",
        description: "Please enter a valid Roblox Username",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      
      localStorage.setItem("robloxUsername", tempPlayerID);
      localStorage.setItem("robloxPlayerID", tempPlayerID);
      saveToRecentUsernames(tempPlayerID);
      setShowHelpImages(false);
      
      toast({
        title: "Username Verified",
        description: "Username verification successful",
      });
      
      setShowPlayerIdModal(false);
      setPackageSelectionPrompt(true);
      setScrollToPackages(true);
    }, 1500);
  };

  useEffect(() => {
    if (scrollToPackages && packagesRef.current) {
      packagesRef.current.scrollIntoView({ behavior: 'smooth' });
      setScrollToPackages(false);
    }
  }, [scrollToPackages]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.middasbuy.com/roblox#webpage",
        "url": "https://www.middasbuy.com/roblox",
        "name": "Midasbuy - Roblox Robux Store",
        "description": "Buy Roblox Robux instantly at the best prices. Official Roblox Robux top up service with secure payments and instant delivery.",
        "inLanguage": "en",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.middasbuy.com/#website",
          "name": "Midasbuy"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.middasbuy.com/#website",
        "name": "Midasbuy",
        "url": "https://www.middasbuy.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.middasbuy.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Midasbuy",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.middasbuy.com/og-image.png"
          }
        }
      },
      ...robuxPackages.map((pkg) => ({
        "@type": "Product",
        "@id": `https://www.middasbuy.com/roblox/purchase/${pkg.id}#product`,
        "name": `Roblox ${pkg.baseAmount} Robux ${pkg.bonusAmount > 0 ? `+${pkg.bonusAmount} Bonus` : ''}`,
        "description": `Buy ${pkg.baseAmount} Robux ${pkg.bonusAmount > 0 ? `with ${pkg.bonusAmount} bonus Robux` : ''} for Roblox at best price. Instant delivery with secure payment.`,
        "image": pkg.image,
        "sku": `roblox-${pkg.id}`,
        "brand": {
          "@type": "Brand",
          "name": "Roblox"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.middasbuy.com/roblox/purchase/${pkg.id}`,
          "priceCurrency": "PKR",
          "price": pkg.price,
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Midasbuy"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "850000"
        }
      }))
    ]
  };

  const filteredPackages = robuxPackages.filter(pkg => {
    // UC Range filtering
    if (ucRangeFilter !== "all") {
      if (ucRangeFilter === "small" && (pkg.baseAmount < 3896 || pkg.baseAmount > 600)) return false;
      if (ucRangeFilter === "medium" && (pkg.baseAmount < 7394 || pkg.baseAmount > 6000)) return false;
      if (ucRangeFilter === "large" && pkg.baseAmount < 66946) return false;
      if (ucRangeFilter === "starter" && (pkg.baseAmount < 14788 || pkg.baseAmount > 300)) return false;
      if (ucRangeFilter === "premium" && pkg.baseAmount < 22182) return false;
    }
    
    // Legacy filter support
    if (filter !== "all") {
      if (filter === "small" && pkg.baseAmount > 600) return false;
      if (filter === "medium" && (pkg.baseAmount <= 3896 || pkg.baseAmount > 6000)) return false;
      if (filter === "large" && pkg.baseAmount <= 6000) return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sorting logic
    switch (sortFilter) {
      case "price_low_high":
        return a.price - b.price;
      case "price_high_low":
        return b.price - a.price;
      case "most_popular":
        // Sort by amount (more popular = higher amounts typically)
        return b.baseAmount - a.baseAmount;
      case "best_value":
        // Sort by bonus percentage
        const aBonus = a.bonusAmount / a.baseAmount;
        const bBonus = b.bonusAmount / b.baseAmount;
        return bBonus - aBonus;
      case "discount":
        // Sort by discount percentage
        const aDiscount = parseFloat(a.discount.replace(/[-%]/g, ''));
        const bDiscount = parseFloat(b.discount.replace(/[-%]/g, ''));
        return bDiscount - aDiscount;
      default:
        return 0;
    }
  });

  // Generate enhanced structured data for better SEO performance
  const enhancedStructuredData = generateProductSchema({
    name: "Midasbuy - Official Gaming Store for Roblox Robux",
    description: "Midasbuy Official - Trusted gaming store for authentic Roblox Robux. Trusted by 10M+ gamers worldwide with instant delivery and secure payments.",
    price: "1.99",
    currency: "USD",
    image: "https://middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png",
    category: "Gaming Currency"
  });

  // 100+ SEO Keywords for Roblox Ranking
  const robloxSeoKeywords = [
    // Primary Keywords
    "buy robux", "roblox robux", "cheap robux", "robux top up", "roblox currency", "robux recharge",
    "robux purchase", "get robux", "roblox money", "robux online", "buy roblox currency",
    // Price Keywords
    "cheap robux online", "cheapest robux", "robux discount", "robux deals", "affordable robux",
    "low price robux", "robux offer", "robux sale", "discounted robux", "robux bargain",
    // Transaction Keywords
    "robux instant delivery", "fast robux delivery", "quick robux", "robux now", "instant robux",
    "robux secure payment", "safe robux purchase", "verified robux seller", "trusted robux store",
    // Regional Keywords
    "buy robux pakistan", "robux pk", "robux india", "robux usa", "robux uk", "robux worldwide",
    "robux international", "global robux store", "robux asia", "robux middle east",
    // Amount Keywords
    "400 robux", "800 robux", "1700 robux", "2200 robux", "4500 robux", "10000 robux",
    "22500 robux", "50000 robux", "robux packages", "robux bundles", "bulk robux",
    // Platform Keywords
    "roblox game currency", "roblox in-game currency", "roblox premium", "roblox membership",
    "robux for games", "roblox virtual currency", "roblox credits", "roblox coins",
    // Brand Keywords
    "midasbuy roblox", "midasbuy robux", "official robux store", "authorized robux seller",
    "roblox official partner", "roblox top up store", "roblox recharge center",
    // Action Keywords
    "how to buy robux", "where to buy robux", "best place to buy robux", "robux purchase guide",
    "robux buying tips", "robux recharge online", "top up robux online", "add robux to account",
    // Gaming Keywords
    "roblox gaming", "roblox player", "roblox gamer", "roblox account", "roblox username",
    "roblox avatar", "roblox items", "roblox accessories", "roblox skins", "roblox outfits",
    // Feature Keywords
    "bonus robux", "extra robux", "free robux bonus", "robux with bonus", "robux rewards",
    "robux cashback", "robux promotion", "robux special offer", "limited robux deal",
    // Payment Keywords
    "robux credit card", "robux debit card", "robux paypal", "robux bank transfer",
    "robux mobile payment", "robux easypaisa", "robux jazzcash", "robux gopayfast",
    // Trust Keywords
    "legit robux", "real robux", "genuine robux", "authentic robux", "safe robux",
    "secure robux", "verified robux", "trusted robux", "reliable robux store",
    // Long-tail Keywords
    "buy robux cheap online fast delivery", "cheapest robux with instant delivery",
    "roblox robux top up official store", "best robux deals 2026", "robux discount codes",
    "robux promotional offers", "premium robux packages", "robux gift cards online",
    "roblox currency exchange", "robux for kids", "robux family pack", "robux gift"
  ].join(", ");

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      {!disableSeo && (
        <AdvancedSEOHelmet
          title="Buy Robux | Cheapest Roblox Robux Top Up | Midasbuy Official Store 2026"
          description="⚡ Buy Roblox Robux at the CHEAPEST prices! 💎 Get up to 55% OFF + Bonus Robux on every purchase. ✅ Instant 2-min delivery | 🔒 100% Secure | Trusted by 5M+ Roblox players worldwide. Official Midasbuy Robux Store - #1 Choice for Roblox Currency!"
          keywords={robloxSeoKeywords}
          canonicalUrl="/roblox"
          ogImage="https://middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png"
          jsonLdSchema={[enhancedStructuredData, getRobloxMerchantSchema()]}
          breadcrumbSchema={generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Buy Robux", url: "/roblox" }
          ])}
        />
      )}
      <div className="corner-light-effect"></div>
      
      {isMobile && (
        <div className="banner-container relative" style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          <img 
            src={mobileBanner}
            alt="Roblox Banner"
            className="w-full h-auto object-cover"
            loading="eager"
            decoding="async"
            style={{ display: 'block' }}
          />
          
          {/* Roblox Logo, Title, Official Badge & Subscribe - OVER banner - Always LTR */}
          <div className="absolute bottom-[45%] left-0 flex items-center gap-2 px-3 z-20" dir="ltr">
            {/* Roblox Logo */}
            <img 
              src={robloxLogo} 
              alt="Roblox Logo" 
              className="w-14 h-14 rounded-xl object-cover shadow-lg"
            />
            {/* Title & Badges */}
            <div className="flex flex-col gap-0.5">
              <h2 className="text-white text-base font-bold tracking-wide drop-shadow-lg">ROBLOX</h2>
              <div className="flex items-center gap-1.5">
                {/* Official Badge */}
                <div className="flex items-center gap-0.5 bg-white/90 text-gray-900 px-1 h-4 rounded text-[7px] font-semibold shadow-sm">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                  <span>Official</span>
                </div>
                
                {/* Subscribe Button - Custom glass blur style */}
                <div 
                  className="flex items-center gap-0.5 bg-white/15 backdrop-blur-md text-white px-1.5 h-[18px] rounded-full text-[7px] font-semibold cursor-pointer hover:bg-white/25 transition-all"
                  onClick={() => {
                    toast({
                      title: "Subscribe to ROBLOX",
                      description: "Sign up to receive updates and exclusive offers!",
                    });
                  }}
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  <span>Subscribe</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enter Username Section - overlapping bottom of banner */}
          {(() => {
            const savedUsername = localStorage.getItem("robloxUsername");
            const savedPlayerId = localStorage.getItem("robloxPlayerID");
            
            if (savedPlayerId && savedUsername) {
              return (
                <div 
                  className="absolute bottom-0 left-0 right-0 z-20 cursor-pointer"
                  onClick={(e) => handlePlayerIdClick(e)}
                  onTouchEnd={(e) => handlePlayerIdClick(e)}
                >
                  <div className="relative overflow-hidden rounded-t-2xl backdrop-blur-2xl bg-white/10 border-b border-white/10" style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                    <div className="relative py-2 px-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-white font-medium text-xs">{savedUsername}</span>
                        <span className="text-gray-400 text-xs">({savedPlayerId})</span>
                        <button 
                          className="ml-1 p-1 hover:bg-white/10 rounded transition-colors"
                          onClick={(e) => { e.stopPropagation(); handlePlayerIdClick(e); }}
                        >
                          <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
                          </svg>
                        </button>
                      </div>
                      <div className="h-4 w-px bg-gray-500/60" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 text-xs">Balance:</span>
                        <span className="text-gray-300 text-xs">Unavailable</span>
                        <HelpCircle className="w-3 h-3 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div 
                  className="absolute bottom-0 left-0 right-0 z-20 cursor-pointer rounded-t-2xl overflow-hidden py-2"
                  style={{
                    background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)',
                  }}
                  onClick={(e) => handlePlayerIdClick(e)}
                  onTouchEnd={(e) => handlePlayerIdClick(e)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-white text-sm font-medium">Enter Your Roblox Username Now</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}
      
      {!isMobile && desktopBanner && (
        <div className="banner-container relative" style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          <img 
            src={desktopBanner}
            alt="Roblox Desktop Banner"
            className="w-full object-cover"
            loading="eager"
            decoding="async"
            style={{ display: 'block', maxHeight: '200px' }}
          />
        </div>
      )}
      
      <div>
        <Header onLogout={onLogout} />
      </div>
      
      <Drawer open={showPlayerIdModal} onOpenChange={setShowPlayerIdModal}>
        <DrawerContent 
          className="bg-[#121B2E] border-none text-white p-0 overflow-hidden rounded-t-[20px] h-[75svh] md:h-[85vh] flex flex-col"
          style={{ position: 'fixed', bottom: 0, maxHeight: '75svh' }}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-[#121B2E] flex-shrink-0 px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-[17px] sm:text-lg font-bold text-white uppercase tracking-wide">ENTER YOUR ROBLOX USERNAME NOW</DrawerTitle>
              <Button 
                variant="ghost" 
                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setShowPlayerIdModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-4">
            {/* Username label and help link */}
            <div className="flex items-center justify-between mb-2 mt-2">
              <span className="text-white text-sm font-medium">Roblox Username</span>
              <button 
                onClick={() => setShowHelpImages(!showHelpImages)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: '#00c6ff' }}
              >
                <HelpCircle className="w-3 h-3" style={{ color: '#00c6ff' }} />
                <span className="text-[10px]" style={{ background: 'linear-gradient(90deg, #00c6ff, #006aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Couldn't find your Username?</span>
              </button>
            </div>
            
            {/* Input container with gradient border */}
            <div 
              className="mb-4 overflow-hidden"
              style={{
                borderRadius: '12px',
                border: '1.5px solid transparent',
                background: 'linear-gradient(#0d1320, #0d1320) padding-box, linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%) border-box'
              }}
            >
              {/* Gradient instruction header */}
              <div 
                className="px-3 py-1.5 text-left"
                style={{
                  background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)',
                  borderRadius: '10px 10px 0 0'
                }}
              >
                <span className="text-white text-[10px] whitespace-nowrap">
                  Please enter your Roblox Username you want to recharge.
                </span>
              </div>
              
              {/* Username Input */}
              <div className="px-0 pt-0 pb-0">
                <Input
                  value={tempPlayerID}
                  onChange={(e) => setTempPlayerID(e.target.value)}
                  placeholder="Enter Roblox Username"
                  variant="dark"
                  className="h-11 text-sm bg-[#131a2e] border-none rounded-none"
                />
              </div>
            </div>
            
            {/* OK Button with brand gradient */}
            <button 
              className="w-full py-3 rounded-xl text-white font-semibold text-base mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)'
              }}
              onClick={handleVerifyPlayerID}
              disabled={isVerifying || !tempPlayerID}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </span>
              ) : (
                "OK"
              )}
            </button>
            
            {/* Collapsible Help Section */}
            {showHelpImages && (
              <div className="bg-[#131a2e] rounded-xl p-4 mb-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-3.5 h-3.5" style={{ color: '#00c6ff' }} />
                  <span className="text-white text-[11px] font-medium">Couldn't find your Roblox Username?</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-300 mb-1">1. Open Roblox and log into your account</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 mb-1">2. Click on your profile icon in the top right corner</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 mb-1">3. Your username is displayed at the top of your profile page</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recently used Usernames */}
            {recentUsernames.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-gray-400 text-sm">Recently used Usernames</h5>
                <div className="space-y-2">
                  {recentUsernames.map((recent, index) => (
                    <div 
                      key={index}
                      className="bg-[#1A1F2E] rounded-lg p-3 flex items-center justify-between border border-[#182238] hover:border-[#0099FF]/50 cursor-pointer transition-colors"
                      onClick={() => setTempPlayerID(recent.username)}
                    >
                      <div>
                        <p className="text-white font-medium text-sm">{recent.username}</p>
                      </div>
                      <button 
                        className="text-gray-500 hover:text-white p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentUsername(index);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      
      <main className={`pt-20 pb-20 relative ${isMobile ? 'mobile-content mobile-main-container' : 'z-10'}`}>
        {!isMobile && desktopBanner && (
          <div className="banner-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: '-50px', left: 0, zIndex: 1 }}>
            <img 
              src={desktopBanner}
              alt="Roblox Banner"
              className="w-full h-auto object-cover"
              width={1920}
              height={492}
              loading="eager"
              decoding="async"
            />
          </div>
        )}
        
        <div className={`container mx-auto px-4 ${isMobile ? 'mobile-main-container' : ''}`}>
          <div className="flex flex-col md:flex-row items-start mb-6 relative">
            <div className="flex-grow z-10 md:ml-8 md:mt-2">
              <div className={`flex items-center mb-2 ${isMobile ? 'flex-row' : ''}`}>
                <div className={isMobile ? 'flex-1' : ''}>
                  <div className={`flex items-center ${isMobile ? 'flex-col items-start' : ''}`}>
                  </div>
                  
                  {!isMobile && (
                    <div className={isMobile ? 'mt-1' : 'mt-1 ml-16 opacity-0'}>
                      <button 
                        className={`bg-gradient-to-r from-[#00B06F] to-[#00B06F]/90 text-white font-medium rounded-md hover:from-[#00B06F]/90 hover:to-[#00B06F] transition-all shadow-lg flex items-center gap-2 border border-[#00B06F]/30 ${isMobile ? 'px-3 py-1 text-xs' : 'px-5 py-1.5 text-sm'}`}
                        onClick={handlePlayerIdClick}
                      >
                        <span className="font-semibold">Enter Your Roblox Username</span>
                        <ArrowRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Navigation and Countdown - Mobile positioning */}
          {isMobile ? (
            <div className="mt-8">
              {/* Enter Username Button - Mobile */}
              <div className="flex justify-center mb-4 opacity-0 pointer-events-none" aria-hidden="true">
                <button 
                  className="bg-gradient-to-r from-[#00B06F] to-[#00B06F]/90 text-white font-medium rounded-md hover:from-[#00B06F]/90 hover:to-[#00B06F] transition-all shadow-lg flex items-center gap-2 border border-[#00B06F]/30 px-3 py-1 text-xs"
                  onClick={(e) => handlePlayerIdClick(e)}
                >
                  <span className="font-semibold">Enter Your Roblox Username</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="mb-4 opacity-0 pointer-events-none" aria-hidden="true">
                <MobileNavigationTabs />
              </div>
            </div>
          ) : (
            <>
              {/* Navigation above countdown for PC */}
              {!isMobile && (
                <div className="relative z-20 mb-4 opacity-0 pointer-events-none" aria-hidden="true">
                  <NavigationTabs />
                </div>
              )}
            </>
          )}
          
          {/* Player ID section removed from here - now inside banner */}

          <div className="mt-[15%] md:mt-10">
          <FilterBar
            onFilterChange={setSortFilter}
            onPaymentMethodChange={setPaymentMethod}
            onUCRangeChange={setUcRangeFilter}
            selectedFilter={sortFilter}
            selectedUCRange={ucRangeFilter}
            hidePromotionBanner={true}
            currencyLabel="Robux"
          />
          </div>
          
          
          {packageSelectionPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-[#00B06F]/10 border border-[#00B06F]/30 flex items-start"
            >
              <AlertCircle className="text-[#00B06F] mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Username verified successfully!</h3>
                <p className="text-gray-300 text-sm">Please select a package below to continue with your purchase.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setPackageSelectionPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          
          <div ref={packagesRef}>
            <RobuxPackageGrid packages={filteredPackages} selectedCountry={selectedCountry} linkQuery={linkQuery} />
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
    </div>
  );
};

export default RobloxPage;

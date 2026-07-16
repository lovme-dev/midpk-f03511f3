import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import bgmiLogo from "@/assets/bgmi-logo.jpeg";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { ucPackages, getSelectedCountry } from "@/data/ucPackages";
import { useMobile, useResponsive } from "@/hooks/use-mobile";
import InPageNavigationTabs, { TabType } from "@/components/InPageNavigationTabs";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import LoadingScreen from "@/components/LoadingScreen";
import PromotionBanner from "@/components/PromotionBanner";
import PackageGrid from "@/components/PackageGrid";
import FilterBar from "@/components/FilterBar";
import DesktopFilterSidebar from "@/components/DesktopFilterSidebar";
import StickyScrollFilterBar from "@/components/StickyScrollFilterBar";
import RedeemTabContent from "@/components/tabs/RedeemTabContent";
import EventsTabContent from "@/components/tabs/EventsTabContent";
import ShopTabContent from "@/components/tabs/ShopTabContent";
import ShopProductsContent from "@/components/tabs/ShopProductsContent";
import ScrollToTop from "@/components/ScrollToTop";
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
import { getPubgUcMerchantSchema } from "@/utils/merchantListingSchema";
import TrustedReviews from "@/components/TrustedReviews";
import { supabase } from "@/integrations/supabase/client";

import { getCountrySeoData } from "@/utils/countrySeoData";
import ReviewRatingBadge from "@/components/ReviewRatingBadge";

interface IndexProps {
  onLogout: () => void;
  overrideCountry?: { code: string; currency: string };
  linkQuery?: string;
  gameBrand?: 'PUBG' | 'BGMI';
  disableSeo?: boolean;
  topSeoSlot?: React.ReactNode;
  countryFAQSlot?: React.ReactNode;
  beforeFooterSlot?: React.ReactNode;
}

const Index = ({ onLogout, overrideCountry, linkQuery, gameBrand = 'PUBG', disableSeo = false, topSeoSlot, countryFAQSlot, beforeFooterSlot }: IndexProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [showPromotion, setShowPromotion] = useState(true);
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
  const [tempUsername, setTempUsername] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [packageSelectionPrompt, setPackageSelectionPrompt] = useState(false);
  const [scrollToPackages, setScrollToPackages] = useState(false);
  const [showStickyFilterBar, setShowStickyFilterBar] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("purchase");
  const [showHelpImages, setShowHelpImages] = useState(false); // Will be set based on saved data
  const [recentPlayerIds, setRecentPlayerIds] = useState<Array<{playerId: string; username: string}>>([]);
  const [savedPlayerInfo, setSavedPlayerInfo] = useState<{id: string; username: string} | null>(null);
  const packagesRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  
  // Load saved player info and recent IDs from localStorage on mount
  useEffect(() => {
    const storageKey = gameBrand === 'BGMI' ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
    const playerIdKey = gameBrand === 'BGMI' ? 'bgmiPlayerID' : 'pubgPlayerID';
    const usernameKey = gameBrand === 'BGMI' ? 'bgmiUsername' : 'pubgUsername';
    
    // Load saved player info
    const savedPlayerId = localStorage.getItem(playerIdKey);
    const savedUsername = localStorage.getItem(usernameKey);
    if (savedPlayerId && savedUsername) {
      setSavedPlayerInfo({ id: savedPlayerId, username: savedUsername });
      setShowHelpImages(false); // Close help section if player info exists
    } else {
      setSavedPlayerInfo(null);
      setShowHelpImages(true); // Open help section if no player info
    }
    
    // Load recent IDs
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentPlayerIds(parsed);
      } catch (e) {
        console.error('Failed to parse recent player IDs:', e);
      }
    }
  }, [gameBrand]);
  
  // Listen for localStorage changes from checkout modal (two-way sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const storageKey = gameBrand === 'BGMI' ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
      const playerIdKey = gameBrand === 'BGMI' ? 'bgmiPlayerID' : 'pubgPlayerID';
      const usernameKey = gameBrand === 'BGMI' ? 'bgmiUsername' : 'pubgUsername';
      
      // Update recent IDs if changed
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setRecentPlayerIds(parsed);
        } catch (error) {
          console.error('Failed to parse recent player IDs from storage event:', error);
        }
      }
      
      // Update saved player info if changed
      if (e.key === playerIdKey || e.key === usernameKey) {
        const savedPlayerId = localStorage.getItem(playerIdKey);
        const savedUsername = localStorage.getItem(usernameKey);
        if (savedPlayerId && savedUsername) {
          setSavedPlayerInfo({ id: savedPlayerId, username: savedUsername });
          setShowHelpImages(false);
        } else {
          setSavedPlayerInfo(null);
          setShowHelpImages(true);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [gameBrand]);
  
  // Save player ID to recent list
  const saveToRecentPlayerIds = (playerId: string, username: string) => {
    const storageKey = gameBrand === 'BGMI' ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
    const newEntry = { playerId, username };
    const updated = [newEntry, ...recentPlayerIds.filter(r => r.playerId !== playerId)].slice(0, 5);
    setRecentPlayerIds(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    // Dispatch storage event for cross-component sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updated),
      url: window.location.href
    }));
  };
  
  // Remove player ID from recent list
  const removeRecentPlayerId = (index: number) => {
    const storageKey = gameBrand === 'BGMI' ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
    const gamePrefix = gameBrand === 'BGMI' ? 'bgmi' : 'pubg';
    const playerIdKey = `${gamePrefix}PlayerID`;
    const usernameKey = `${gamePrefix}Username`;
    
    // Get the deleted player info before filtering
    const deletedPlayer = recentPlayerIds[index];
    
    const updated = recentPlayerIds.filter((_, i) => i !== index);
    setRecentPlayerIds(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    // If the deleted ID was the currently saved one, clear saved info
    if (deletedPlayer && savedPlayerInfo && deletedPlayer.playerId === savedPlayerInfo.id) {
      setSavedPlayerInfo(null);
      setShowHelpImages(true); // Show help section when ID is cleared
      // Clear localStorage
      localStorage.removeItem(playerIdKey);
      localStorage.removeItem(usernameKey);
      
      // Dispatch storage events for cross-component sync with checkout modal
      window.dispatchEvent(new StorageEvent('storage', {
        key: playerIdKey,
        newValue: null,
        url: window.location.href
      }));
      window.dispatchEvent(new StorageEvent('storage', {
        key: usernameKey,
        newValue: null,
        url: window.location.href
      }));
    }
    
    // Dispatch storage event for cross-component sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updated),
      url: window.location.href
    }));
  };
  
  // Banners state - loaded from database
  const [mobileBanner, setMobileBanner] = useState<string | null>(null);
  const [mobileBannerStyle, setMobileBannerStyle] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 100 });
  const [desktopBanner, setDesktopBanner] = useState<string | null>("/images/pubg-desktop-banner-new.jpeg");
  const [desktopBannerStyle, setDesktopBannerStyle] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 100 });
  const [charactersImage, setCharactersImage] = useState<string>("/assets/pubg-characters-banner.png");
  const [charactersStyle, setCharactersStyle] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 100 });
  const [bannersLoaded, setBannersLoaded] = useState(false);
  
  // Light effect state for banner
  const [lightEffect, setLightEffect] = useState<{
    enabled: boolean;
    intensity: number;
    color: string;
    spread: number;
  }>({ enabled: true, intensity: 45, color: '#003C78', spread: 70 });
  
  // Use the new page meta hook
  const { metaData: adminPageMeta } = usePageMeta('home');

  // Determine which banner page_name to use based on gameBrand
  const bannerPageName = gameBrand === 'BGMI' ? 'BGMI' : 'PUBG UC';
  const bannerKeyPrefix = gameBrand === 'BGMI' ? 'bgmi' : 'pubg_uc';
  const brandDisplayName = gameBrand === 'BGMI' ? 'BGMI MOBILE' : 'PUBG MOBILE';

  // Fetch banners from database with realtime updates
  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('site_banners')
        .select('*')
        .eq('page_name', bannerPageName)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching banners:', error);
      } else if (data && data.length > 0) {
        updateBannersFromData(data);
      }
      setBannersLoaded(true);
    };
    
    const updateBannersFromData = (data: any[]) => {
      // Find mobile, desktop banners and characters image - use dynamic key prefix
      const mobileKey = gameBrand === 'BGMI' ? 'bgmi_mobile' : 'pubg_uc_mobile';
      const desktopKey = gameBrand === 'BGMI' ? 'bgmi_desktop' : 'pubg_uc_desktop';
      const charactersKey = gameBrand === 'BGMI' ? 'bgmi_characters' : 'pubg_uc_characters';
      
      const mobileBannerData = data.find((b: any) => b.banner_key === mobileKey);
      const desktopBannerData = data.find((b: any) => b.banner_key === desktopKey);
      const charactersData = data.find((b: any) => b.banner_key === charactersKey);
      
      if (mobileBannerData?.image_url) {
        setMobileBanner(mobileBannerData.image_url);
        setMobileBannerStyle({
          x: mobileBannerData.position_x || 0,
          y: mobileBannerData.position_y || 0,
          zoom: mobileBannerData.zoom_level || 100
        });
        // Update light effect from mobile banner data
        setLightEffect({
          enabled: mobileBannerData.light_enabled ?? true,
          intensity: mobileBannerData.light_intensity ?? 45,
          color: mobileBannerData.light_color || '#003C78',
          spread: mobileBannerData.light_spread ?? 70
        });
      }
      if (desktopBannerData?.image_url) {
        setDesktopBanner(desktopBannerData.image_url);
        setDesktopBannerStyle({
          x: desktopBannerData.position_x || 0,
          y: desktopBannerData.position_y || 0,
          zoom: desktopBannerData.zoom_level || 100
        });
      }
      if (charactersData?.image_url) {
        setCharactersImage(charactersData.image_url);
        setCharactersStyle({
          x: charactersData.position_x || 0,
          y: charactersData.position_y || 0,
          zoom: charactersData.zoom_level || 100
        });
      }
    };
    
    fetchBanners();
    
    // Subscribe to realtime updates for live position/zoom changes
    const channel = supabase
      .channel(`banner-updates-${bannerPageName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_banners',
          filter: `page_name=eq.${bannerPageName}`
        },
        async () => {
          // Refetch all banners when any change happens
          const { data } = await supabase
            .from('site_banners')
            .select('*')
            .eq('page_name', bannerPageName)
            .eq('is_active', true);
          
          if (data && data.length > 0) {
            updateBannersFromData(data);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
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

  // Scroll detection for sticky filter bar (mobile only)
  useEffect(() => {
    if (!isMobile) {
      setShowStickyFilterBar(false);
      return;
    }
    
    const handleScroll = () => {
      const filterBar = filterBarRef.current;
      if (filterBar) {
        const rect = filterBar.getBoundingClientRect();
        // Show sticky bar when original filter bar scrolls out of view
        setShowStickyFilterBar(rect.top < 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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

  const handleSubscribeClick = () => {
    toast({
      title: "Subscribe to PUBG Mobile",
      description: "Sign up to receive updates and exclusive offers!",
      action: (
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => window.open("mailto:signup@pubgmobile.com", "_blank")}
        >
          Sign Up
        </Button>
      ),
    });
  };

  const handlePlayerIdClick = () => {
    setTempPlayerID("");
    setTempUsername("");
    setShowPlayerIdModal(true);
  };

  const handleVerifyPlayerID = () => {
    // For BGMI: require 9-17 digits. For PUBG: keep existing 8+ validation
    const minLength = gameBrand === 'BGMI' ? 9 : 8;
    const maxLength = gameBrand === 'BGMI' ? 17 : 15;
    
    if (!tempPlayerID || tempPlayerID.length < minLength || tempPlayerID.length > maxLength) {
      toast({
        title: "Invalid Player ID",
        description: gameBrand === 'BGMI' 
          ? "Please enter a valid Player ID (9-17 digits)" 
          : "Please enter a valid Player ID",
        variant: "destructive",
      });
      return;
    }

    if (!tempUsername || tempUsername.trim().length < 2) {
      toast({
        title: "Invalid Username",
        description: "Please enter a valid username",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      
      // Save both Player ID and Username to localStorage (game-specific keys)
      const gamePrefix = gameBrand === 'BGMI' ? 'bgmi' : 'pubg';
      localStorage.setItem(`${gamePrefix}PlayerID`, tempPlayerID);
      localStorage.setItem(`${gamePrefix}Username`, tempUsername.trim());
      
      // Update saved player info state
      setSavedPlayerInfo({ id: tempPlayerID, username: tempUsername.trim() });
      setShowHelpImages(false); // Close help section after saving
      
      // Save to recent player IDs list
      saveToRecentPlayerIds(tempPlayerID, tempUsername.trim());
      
      // Dispatch storage events for cross-component sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: `${gamePrefix}PlayerID`,
        newValue: tempPlayerID,
        url: window.location.href
      }));
      window.dispatchEvent(new StorageEvent('storage', {
        key: `${gamePrefix}Username`,
        newValue: tempUsername.trim(),
        url: window.location.href
      }));
      
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
        "@id": "https://www.middasbuy.com/#webpage",
        "url": "https://www.middasbuy.com",
        "name": "Midasbuy - PUBG UC Store",
        "description": "Buy PUBG UC instantly at the best prices. Official PUBG Mobile UC top up service with secure payments and instant delivery.",
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
      ...ucPackages.map((pkg) => ({
        "@type": "Product",
        "@id": `https://www.middasbuy.com/purchase/${pkg.id}#product`,
        "name": `PUBG Mobile ${pkg.baseAmount} UC ${pkg.bonusAmount > 0 ? `+${pkg.bonusAmount} Bonus` : ''}`,
        "description": `Buy ${pkg.baseAmount} UC ${pkg.bonusAmount > 0 ? `with ${pkg.bonusAmount} bonus UC` : ''} for PUBG Mobile at best price. Instant delivery with secure payment.`,
        "image": pkg.image,
        "sku": pkg.id,
        "brand": {
          "@type": "Brand",
          "name": "PUBG Mobile"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.middasbuy.com/purchase/${pkg.id}`,
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
          "reviewCount": "1250000"
        }
      }))
    ]
  };

  const filteredPackages = ucPackages.filter(pkg => {
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
    name: "Midasbuy - Official Gaming Store for PUBG Mobile UC & Free Fire Diamonds",
    description: "Midasbuy Official - Trusted gaming store for authentic PUBG Mobile UC, Free Fire Diamonds, and premium gaming currency. Trusted by 10M+ gamers worldwide with instant delivery and secure payments.",
    price: "1.99",
    currency: "USD",
    image: "https://middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png",
    category: "Gaming Currency"
  });

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      {/* Only show international SEO helmet if NOT on BGMI page */}
      {!disableSeo && !linkQuery?.includes('bgmi=1') && (
        <>
          <AdvancedSEOHelmet
            title={countrySeoData?.title || "Buy PUBG Mobile UC - Cheap Top Up & Instant Delivery | Midasbuy"}
            description={countrySeoData?.description || "Buy PUBG Mobile UC from $0.99 on Midasbuy. Up to 60% OFF, instant 2-5 min delivery, secure payments. Trusted by 10M+ players worldwide."}
            keywords={countrySeoData?.keywords || "buy pubg uc, pubg mobile uc, pubg uc cheap, pubg uc 2026, cheapest pubg uc, pubg uc top up, pubg uc recharge, buy pubg uc online, pubg uc purchase, pubg uc instant delivery, pubg uc midasbuy, midasbuy pubg uc, pubg uc pakistan, pubg uc india, pubg uc usa, pubg uc uae, pubg uc malaysia, pubg uc philippines, pubg uc jazzcash, pubg uc easypaisa, pubg uc upi, pubg uc paytm, pubg uc gpay, pubg uc paypal, pubg uc visa, pubg uc mastercard, pubg royal pass, pubg glacier m416, pubg awm skin, pubg mythic outfit, pubg weapon skins, pubg character skins, pubg vehicle skins, pubg premium crates, pubg classic crates, pubg 60 uc, pubg 325 uc, pubg 660 uc, pubg 1800 uc, pubg 3850 uc, pubg 8100 uc, pubg uc pack, pubg monthly pass, pubg weekly pass, tencent pubg, tencent authorized, safe pubg uc, secure pubg uc purchase, trusted pubg uc seller, verified pubg uc dealer, genuine pubg uc, official pubg uc, instant pubg uc, fast pubg uc delivery, pubg uc 2 minute delivery, pubg uc direct recharge, how to buy pubg uc, where to buy pubg uc, best place buy pubg uc, cheapest way buy pubg uc, pubg uc buying guide, codashop pubg alternative, seagm pubg, razer gold pubg, pubg top up app, pubg uc website, pubg battle royale, pubg mobile game, pubg android, pubg ios, pubg esports, pubg tournament, pubg championship, pubg uc karachi, pubg uc lahore, pubg uc delhi, pubg uc mumbai, pubg uc dubai, pubg uc riyadh, pubg uc kuala lumpur, pubg uc manila, pubg uc discount, pubg uc sale, pubg uc offer, pubg uc promo, pubg uc bonus, pubg uc double, pubg uc extra, pubg uc vip bonus, middasbuy pubg, middasbuy uc, midasbuy official, midasbuy store, pubg uc 2026, pubg new update uc, pubg latest uc, pubg trending 2026"}
            canonicalUrl={countryCode ? `/midasbuy/${countryCode}/buy/pubgm` : "/midasbuy/us/buy/pubgm"}
            ogImage="https://middasbuy.com/lovable-uploads/6a2f0c2f-451c-457f-bb64-eabf3e7698e6.png"
            jsonLdSchema={[enhancedStructuredData, getPubgUcMerchantSchema()]}
            breadcrumbSchema={generateBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: countrySeoData?.name || "PUBG Mobile UC", url: countryCode ? `/midasbuy/${countryCode}/buy/pubgm` : "/midasbuy/us/buy/pubgm" }
            ])}
          />
        </>
      )}
      
      {/* Sticky Scroll Filter Bar - Mobile Only */}
      {isMobile && (
        <StickyScrollFilterBar
          isVisible={showStickyFilterBar}
          onPaymentMethodChange={setPaymentMethod}
          onUCRangeChange={setUcRangeFilter}
          onFilterChange={setSortFilter}
          selectedUCRange={ucRangeFilter}
          selectedFilter={sortFilter}
        />
      )}
      
      {/* Header - positioned on top of banner */}
      <div className="relative z-20">
        <Header onLogout={onLogout} />
      </div>
      
      {/* Banner Section - Desktop Only */}
      {!isMobile && desktopBanner && (
        <div className="relative w-full overflow-hidden">
          <img 
            src={desktopBanner}
            alt="PUBG Desktop Banner"
            width={1920}
            height={500}
            className="w-full h-auto object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              aspectRatio: '1920 / 500',
              transform: `translate(${desktopBannerStyle.x}px, ${desktopBannerStyle.y}px) scale(${desktopBannerStyle.zoom / 100})`,
              transformOrigin: 'center center'
            }}
          />
        </div>
      )}
      
      {/* PUBG Characters + Enter Player ID CTA - Mobile Only */}
      {isMobile && (
        <div className="w-full relative z-10">
          {/* Mobile Banner Container with Character overlay */}
          <div className="relative w-full">
            {/* Mobile Banner - show if uploaded from admin */}
            {mobileBanner && (
              <div className={`w-full overflow-hidden relative ${gameBrand === 'BGMI' ? 'max-h-[130px]' : ''}`}>
                <img 
                  src={mobileBanner}
                  alt={gameBrand === 'BGMI' ? "BGMI Banner" : "PUBG Mobile Banner"}
                  width={750}
                  height={400}
                  className={`w-full h-auto object-cover ${gameBrand === 'BGMI' ? 'max-h-[130px]' : ''}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    aspectRatio: gameBrand === 'BGMI' ? '750 / 260' : '750 / 400',
                    transform: `translate(${mobileBannerStyle.x}px, ${mobileBannerStyle.y}px) scale(${mobileBannerStyle.zoom / 100})`,
                    transformOrigin: 'center center'
                  }}
                />
                {/* Dynamic blue light effect covering entire banner - admin controlled */}
                {lightEffect.enabled && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${lightEffect.color}${Math.min(255, Math.round(lightEffect.intensity * 2.5)).toString(16).padStart(2, '0')} 0%, ${lightEffect.color}${Math.min(255, Math.round(lightEffect.intensity * 2.2)).toString(16).padStart(2, '0')} 20%, ${lightEffect.color}${Math.min(255, Math.round(lightEffect.intensity * 1.8)).toString(16).padStart(2, '0')} 40%, ${lightEffect.color}${Math.min(255, Math.round(lightEffect.intensity * 1.4)).toString(16).padStart(2, '0')} 60%, ${lightEffect.color}${Math.min(255, Math.round(lightEffect.intensity * 1.0)).toString(16).padStart(2, '0')} 80%, ${lightEffect.color}${Math.min(255, Math.round(lightEffect.intensity * 0.6)).toString(16).padStart(2, '0')} 100%)`
                    }}
                  />
                )}
              </div>
            )}
            
            {/* Banner placeholder space - maintains layout when no banner */}
            {!mobileBanner && bannersLoaded && (
              <div className={`w-full bg-gradient-to-b from-midasbuy-darkBlue to-midasbuy-darkBlue/80 ${gameBrand === 'BGMI' ? 'h-[100px]' : 'h-[180px]'}`} />
            )}
            
            {/* PUBG Characters Image - positioned OVER banner like reference - ONLY for PUBG, not BGMI */}
            {gameBrand !== 'BGMI' && (
              <img 
                src={charactersImage} 
                alt="PUBG Characters" 
                className="absolute top-0 right-0 w-[65%] h-full object-contain object-right z-10 pointer-events-none"
                style={{ 
                  transform: `translate(${charactersStyle.x}px, ${charactersStyle.y}px) scale(${charactersStyle.zoom / 100})`,
                  transformOrigin: 'right center'
                }}
              />
            )}
            
            {/* PUBG Mobile Logo, Title, Official Badge & Subscribe - OVER banner - SMALLER - Always LTR */}
            <div className={`absolute left-0 flex items-center gap-2 px-3 z-20 ${gameBrand === 'BGMI' ? 'bottom-6' : 'bottom-6'}`} dir="ltr">
              {/* PUBG Mobile Logo - smaller */}
              <img 
                src={gameBrand === 'BGMI' ? bgmiLogo : "/lovable-uploads/pubg-mobile-logo.png"}
                alt={gameBrand === 'BGMI' ? "BGMI Logo" : "PUBG Mobile Logo"}
                className="w-12 h-12 rounded-lg object-cover shadow-lg"
              />
              
              {/* Title and Badges - Always LTR, never translate */}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-white text-base font-bold tracking-wide drop-shadow-lg">Midasbuy {brandDisplayName} UC Top Up</h1>
                <div className="flex items-center gap-1.5">
                  {/* Official Badge - white background with shield icon - thinner like subscribe */}
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
                        title: `Subscribe to ${brandDisplayName}`,
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
          </div>
          
          {/* Player ID Section - Shows user info when logged in, or prompt when not */}
          {(() => {
            const gamePrefix = gameBrand === 'BGMI' ? 'bgmi' : 'pubg';
            const savedPlayerId = localStorage.getItem(`${gamePrefix}PlayerID`);
            const savedUsername = localStorage.getItem(`${gamePrefix}Username`);
            
            if (savedPlayerId && savedUsername) {
              // User has verified Player ID - show the blurred dark info bar
              return (
                <div 
                  className="w-full relative z-20 -mt-3 cursor-pointer"
                  onClick={handlePlayerIdClick}
                >
                  {/* Glass morphism frosted background */}
                  <div className="relative overflow-hidden rounded-t-2xl backdrop-blur-2xl bg-white/10 border-b border-white/10" style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                    
                    {/* Content - Thinner padding, smaller text */}
                    <div className="relative py-2 px-3 flex items-center justify-between">
                      {/* Left side - Username and Player ID */}
                      <div className="flex items-center gap-1">
                        <span className="text-white font-medium text-xs">
                          {savedUsername}
                        </span>
                        <span className="text-gray-400 text-xs">
                          ({savedPlayerId})
                        </span>
                        {/* Switch/Swap icon */}
                        <button 
                          className="ml-1 p-1 hover:bg-white/10 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayerIdClick();
                          }}
                        >
                          <svg 
                            className="w-3.5 h-3.5 text-white/80" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="h-4 w-px bg-gray-500/60" />
                      
                      {/* Right side - Balance section */}
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
              // No Player ID - show the blue prompt button
              return (
                <div 
                  className="w-full py-2 px-4 rounded-t-2xl cursor-pointer relative z-20 -mt-3 overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%), radial-gradient(ellipse at bottom right, rgba(0, 198, 255, 0.12) 0%, transparent 50%)',
                    backgroundBlendMode: 'normal'
                  }}
                  onClick={handlePlayerIdClick}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-white text-sm font-medium">{t('checkout.enterPlayerIdNow', 'Enter Your Player ID Now')}</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}

      {topSeoSlot}
      
      {/* Navigation Tabs - directly below banner */}
      <InPageNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Drawer open={showPlayerIdModal} onOpenChange={setShowPlayerIdModal}>
        <DrawerContent 
          className="bg-[#121B2E] border-none text-white p-0 overflow-hidden rounded-t-[20px] h-[75svh] md:h-[85vh] flex flex-col"
          style={{ position: 'fixed', bottom: 0, maxHeight: '75svh' }}
        >
          {/* Sticky Header - only title stays fixed */}
          <div className="sticky top-0 z-20 bg-[#121B2E] flex-shrink-0 px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-[17px] sm:text-lg font-bold text-white uppercase tracking-wide">{t('checkout.enterPlayerIdNow', 'ENTER YOUR PLAYER ID NOW')}</DrawerTitle>
              <Button 
                variant="ghost" 
                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setShowPlayerIdModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Scrollable Content - scrolls under the header */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-4">
            {/* Player ID label and help link - positioned ABOVE the input container */}
            <div className="flex items-center justify-between mb-2 mt-2">
              <span className="text-white text-sm font-medium">{t('checkout.playerId', 'Player ID')}</span>
              <button 
                onClick={() => setShowHelpImages(!showHelpImages)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: '#00c6ff' }}
              >
                <HelpCircle className="w-3 h-3" style={{ color: '#00c6ff' }} />
                <span className="text-[10px]" style={{ background: 'linear-gradient(90deg, #00c6ff, #006aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('checkout.couldntFindPlayerId', "Couldn't find your Player ID?")}</span>
              </button>
            </div>
            
            {/* Integrated input container with gradient border and rounded top corners */}
            <div 
              className="mb-4 overflow-hidden"
              style={{
                borderRadius: '12px',
                border: '1.5px solid transparent',
                background: 'linear-gradient(#0d1320, #0d1320) padding-box, linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%) border-box'
              }}
            >
              {/* Gradient instruction header with rounded top corners - the gradient fills the rounded area */}
              <div 
                className="px-3 py-1.5 text-left"
                style={{
                  background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)',
                  borderRadius: '10px 10px 0 0'
                }}
              >
                <span className="text-white text-[10px] whitespace-nowrap">
                  {t('checkout.selectPlayerIdToRecharge', 'Please select or fill in your Player ID you want to recharge.')}
                </span>
              </div>
              
              {/* Input section - thinner inputs, flush with header */}
              <div className="px-0 pt-0 pb-0">
                <Input
                  value={tempPlayerID}
                  onChange={(e) => {
                    // Only allow digits, max 17 for BGMI, 15 for PUBG
                    const value = e.target.value.replace(/\D/g, '');
                    const maxLen = gameBrand === 'BGMI' ? 17 : 15;
                    if (value.length <= maxLen) {
                      setTempPlayerID(value);
                    }
                  }}
                  placeholder={t('checkout.enterPlayerId', 'Enter Player ID')}
                  variant="dark"
                  className="h-11 text-sm bg-[#131a2e] border-none rounded-none"
                  style={{ borderBottom: '1px solid #1e2642' }}
                  maxLength={gameBrand === 'BGMI' ? 17 : 15}
                  inputMode="numeric"
                />
                <Input
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder={t('checkout.enterUsername', 'Enter Username')}
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
              disabled={isVerifying || !tempPlayerID || !tempUsername}
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
                  <span className="text-white text-[11px] font-medium">{t('checkout.couldntFindPlayerId', "Couldn't find your Player ID?")}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-300 mb-2">1.1. Enter the game</p>
                    <div className="rounded-lg overflow-hidden">
                      <OptimizedImage 
                        src="/lovable-uploads/d8a0389b-81ee-4c91-bd70-8e9e7b0d765b.png" 
                        alt="Finding Player ID in Game Lobby" 
                        className="w-full rounded-lg"
                        quality={80}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-300 mb-2">2.2. Find your player ID</p>
                    <div className="rounded-lg overflow-hidden">
                      <OptimizedImage 
                        src="/lovable-uploads/a11f7ec0-260b-4785-89db-c8478d536442.png" 
                        alt="Finding Player ID in Profile Page" 
                        className="w-full rounded-lg"
                        quality={80}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recently used Player ID Section */}
            {recentPlayerIds.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-gray-400 text-sm">Recently used Player ID</h5>
                <div className="space-y-2">
                  {recentPlayerIds.map((recent, index) => (
                    <div 
                      key={index}
                      className="bg-[#1A1F2E] rounded-lg p-3 flex items-center justify-between border border-[#182238] hover:border-[#0099FF]/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setTempPlayerID(recent.playerId);
                        setTempUsername(recent.username);
                      }}
                    >
                      <div>
                        <p className="text-white font-medium text-sm">{recent.username}</p>
                        <p className="text-gray-400 text-xs">Player ID: {recent.playerId}</p>
                      </div>
                      <button 
                        className="text-gray-500 hover:text-white p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentPlayerId(index);
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
      
      <main className={`pb-20 relative ${isMobile ? 'mobile-main-container pt-0' : 'z-10 pt-0'}`}>
        
        {/* Tab Content */}
        {activeTab === "purchase" && (
          <div className={`container mx-auto px-4 ${isMobile ? 'mobile-main-container' : ''}`}>
            
            {/* Mobile: FilterBar above packages */}
            {isMobile && (
              <div ref={filterBarRef}>
                <FilterBar
                  onFilterChange={setSortFilter}
                  onPaymentMethodChange={setPaymentMethod}
                  onUCRangeChange={setUcRangeFilter}
                  selectedFilter={sortFilter}
                  selectedUCRange={ucRangeFilter}
                />
              </div>
            )}
            
            {/* Desktop: Sidebar + Packages side by side */}
            <div className={`${!isMobile ? 'flex gap-6 mt-4' : ''}`}>
              {/* Desktop Sidebar Filter */}
              {!isMobile && (
                <DesktopFilterSidebar
                  onPaymentMethodChange={(methods) => setPaymentMethod(methods.join(',') || 'all')}
                  onAmountRangeChange={(min, max) => {
                    // Handle amount range filter if needed
                  }}
                  onFilterApply={() => {
                    // Trigger filter application
                  }}
                />
              )}
              
              {/* Packages Grid */}
              <div ref={packagesRef} className="flex-1">
                <PackageGrid packages={filteredPackages} selectedCountry={selectedCountry} linkQuery={linkQuery} />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "redeem" && <RedeemTabContent gameBrand={gameBrand === 'BGMI' ? 'BGMI' : 'PUBG MOBILE'} onOpenPlayerIdModal={() => setShowPlayerIdModal(true)} savedPlayerInfo={savedPlayerInfo} />}
        
        {activeTab === "shop" && <ShopProductsContent onTabChange={setActiveTab} />}
        
        {activeTab === "events" && <EventsTabContent />}
        
        {/* Description/FAQ sections removed - content is now in footer */}

      </main>

      {beforeFooterSlot}
      
      <Footer showWhyTopUp={true} countryFAQSlot={countryFAQSlot} />
      <ScrollToTop />
      
      {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
    </div>
  );
};

export default Index;

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { diamondPackages, getSelectedCountry } from "@/data/diamondPackages";
import { useResponsive } from "@/hooks/use-mobile";
import FreeFireNavigationTabs from "@/components/FreeFireNavigationTabs";
import FreeFireMobileNavigationTabs from "@/components/FreeFireMobileNavigationTabs";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import LoadingScreen from "@/components/LoadingScreen";
import FreeFirePromotionBanner from "@/components/FreeFirePromotionBanner";
import DiamondPackageGrid from "@/components/DiamondPackageGrid";


import Footer from "@/components/Footer";
import { ChevronDown, ArrowRight, User, HelpCircle, X, Check, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import OptimizedImage from "@/components/OptimizedImage";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import InternationalSEOHelmet from "@/components/SEO/InternationalSEOHelmet";
import { getPageKeywords, getAllKeywords } from "@/data/seoKeywords";
import TrustedReviews from "@/components/TrustedReviews";
// subscribeButton import removed - now using custom glass blur style
import { supabase } from "@/integrations/supabase/client";

interface FreeFireProps {
  onLogout: () => void;
  disableSeo?: boolean;
}

const FreeFire = ({ onLogout, disableSeo = false }: FreeFireProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [showPromotion, setShowPromotion] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("default");
  const [diamondRangeFilter, setDiamondRangeFilter] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getSelectedCountry());
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showPlayerIdModal, setShowPlayerIdModal] = useState(false);
  const [tempPlayerID, setTempPlayerID] = useState("");
  const [playerIdError, setPlayerIdError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [scrollToPackages, setScrollToPackages] = useState(false);
  const [showHelpImages, setShowHelpImages] = useState(true); // Default true, will update after loading recent IDs
  const [recentPlayerIds, setRecentPlayerIds] = useState<Array<{playerId: string}>>([]);
  const packagesRef = useRef<HTMLDivElement>(null);
  
  // Load recent player IDs from localStorage and sync showHelpImages
  useEffect(() => {
    const saved = localStorage.getItem('recentFreeFirePlayerIds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentPlayerIds(parsed);
        // If user has recent IDs, collapse the help section by default
        if (parsed.length > 0) {
          setShowHelpImages(false);
        }
      } catch (e) {
        console.error('Failed to parse recent player IDs:', e);
      }
    }
  }, []);
  
  // Save player ID to recent list
  const saveToRecentPlayerIds = (playerId: string) => {
    const newEntry = { playerId };
    const updated = [newEntry, ...recentPlayerIds.filter(r => r.playerId !== playerId)].slice(0, 5);
    setRecentPlayerIds(updated);
    localStorage.setItem('recentFreeFirePlayerIds', JSON.stringify(updated));
  };
  
  // Remove player ID from recent list
  const removeRecentPlayerId = (index: number) => {
    const deletedPlayer = recentPlayerIds[index];
    const updated = recentPlayerIds.filter((_, i) => i !== index);
    setRecentPlayerIds(updated);
    localStorage.setItem('recentFreeFirePlayerIds', JSON.stringify(updated));
    
    // If the deleted ID was the currently saved one, clear saved info
    const savedPlayerID = localStorage.getItem("freefirePlayerID");
    if (deletedPlayer && savedPlayerID === deletedPlayer.playerId) {
      localStorage.removeItem("freefirePlayerID");
    }
  };
  
  // Banners state - loaded from database
  const [mobileBanner, setMobileBanner] = useState<string | null>(null);
  const [mobileBannerStyle, setMobileBannerStyle] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 100 });
  const [desktopBanner, setDesktopBanner] = useState<string | null>(null);
  const [desktopBannerStyle, setDesktopBannerStyle] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 100 });
  const [charactersImage, setCharactersImage] = useState<string>("/lovable-uploads/624ac7f0-c182-4f1e-b919-938374f4af9d.png");
  const [charactersStyle, setCharactersStyle] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 100 });
  const [bannersLoaded, setBannersLoaded] = useState(false);
  
  // Light effect state for banner
  const [lightEffect, setLightEffect] = useState<{
    enabled: boolean;
    intensity: number;
    color: string;
    spread: number;
  }>({ enabled: true, intensity: 45, color: '#FF6B35', spread: 70 });
  
  // Fetch banners from database with realtime updates
  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('site_banners')
        .select('*')
        .eq('page_name', 'Free Fire')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching banners:', error);
      } else if (data && data.length > 0) {
        updateBannersFromData(data);
      }
      setBannersLoaded(true);
    };
    
    const updateBannersFromData = (data: any[]) => {
      const mobileBannerData = data.find((b: any) => b.banner_key === 'freefire_mobile');
      const desktopBannerData = data.find((b: any) => b.banner_key === 'freefire_desktop');
      const charactersData = data.find((b: any) => b.banner_key === 'freefire_characters');
      
      if (mobileBannerData?.image_url) {
        setMobileBanner(mobileBannerData.image_url);
        setMobileBannerStyle({
          x: mobileBannerData.position_x || 0,
          y: mobileBannerData.position_y || 0,
          zoom: mobileBannerData.zoom_level || 100
        });
        setLightEffect({
          enabled: mobileBannerData.light_enabled ?? true,
          intensity: mobileBannerData.light_intensity ?? 45,
          color: mobileBannerData.light_color || '#FF6B35',
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
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('freefire-banner-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_banners',
          filter: 'page_name=eq.Free Fire'
        },
        async () => {
          const { data } = await supabase
            .from('site_banners')
            .select('*')
            .eq('page_name', 'Free Fire')
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
      '/lovable-uploads/624ac7f0-c182-4f1e-b919-938374f4af9d.png'
    ];

    const preloadImages = async () => {
      const imagePromises = imagesToPreload.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          
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

    Promise.all([
      preloadImages(),
      new Promise(resolve => setTimeout(resolve, 400))
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const storedCountry = getSelectedCountry();
    if (JSON.stringify(storedCountry) !== JSON.stringify(selectedCountry)) {
      setSelectedCountry(storedCountry);
    }
  }, []);

  const handleSubscribeClick = () => {
    toast({
      title: "Subscribe to Free Fire",
      description: "Sign up to receive updates and exclusive offers!",
      action: (
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => window.open("mailto:signup@freefire.com", "_blank")}
        >
          Sign Up
        </Button>
      ),
    });
  };

  const handlePlayerIdClick = () => {
    // Load saved player ID to input field and open modal
    const savedPlayerID = localStorage.getItem("freefirePlayerID");
    setTempPlayerID(savedPlayerID || "");
    setShowPlayerIdModal(true);
  };

  const handleRemovePlayerInfo = () => {
    localStorage.removeItem("freefirePlayerID");
    toast({
      title: "Player Info Removed",
      description: "Player information has been cleared",
    });
  };

  const handleSavePlayerInfo = () => {
    // Free Fire Player ID must be 8-12 digits
    if (!tempPlayerID || tempPlayerID.length < 8 || tempPlayerID.length > 12) {
      setPlayerIdError("Please enter a valid Free Fire ID (8-12 digits)");
      return;
    }
    setPlayerIdError("");

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      localStorage.setItem("freefirePlayerID", tempPlayerID);
      
      // Save to recent player IDs list
      saveToRecentPlayerIds(tempPlayerID);
      
      setShowPlayerIdModal(false);
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
    return <LoadingScreen message="Loading Free Fire..." />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.middasbuy.com/free-fire#webpage",
        "url": "https://www.middasbuy.com/free-fire",
        "name": "Free Fire Diamonds | Buy FF Diamonds Instant Delivery - Midasbuy Official Store",
        "description": "⚡ Buy Free Fire Diamonds at Best Prices | Official Midasbuy FF Diamond Store | Instant Delivery | 100% Safe Payment",
        "inLanguage": "en",
        "datePublished": "2024-01-01",
        "dateModified": "2026-01-01",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.middasbuy.com/#website",
          "name": "Midasbuy",
          "url": "https://www.middasbuy.com"
        }
      },
      ...diamondPackages.map((pkg) => ({
        "@type": "Product",
        "@id": `https://www.middasbuy.com/purchase/free-fire/${pkg.id}#product`,
        "name": `Free Fire ${pkg.baseAmount} Diamonds ${pkg.bonusAmount > 0 ? `+${pkg.bonusAmount} Bonus` : ''}`,
        "description": `Buy ${pkg.baseAmount} Free Fire Diamonds ${pkg.bonusAmount > 0 ? `with ${pkg.bonusAmount} bonus diamonds` : ''} at best price. Instant delivery with secure payment.`,
        "image": pkg.image,
        "sku": pkg.id,
        "mpn": pkg.id,
        "category": "Free Fire Diamonds",
        "brand": {
          "@type": "Brand",
          "name": "Garena Free Fire"
        },
        "audience": {
          "@type": "PeopleAudience",
          "suggestedMinAge": 13,
          "audienceType": "Gamers"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.middasbuy.com/purchase/free-fire/${pkg.id}`,
          "priceCurrency": "PKR",
          "price": pkg.price,
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Midasbuy"
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": ["US", "PK", "IN", "AE", "SA", "MY", "PH", "ID", "BR", "GB", "DE", "FR", "TR", "TH", "BD", "EG"],
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "0",
                "longitude": "0"
              }
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 0,
                "unitCode": "MIN"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 5,
                "unitCode": "MIN"
              }
            }
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "1180000"
        }
      })),
      {
        "@type": "FAQPage",
        "@id": "https://www.middasbuy.com/free-fire#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How to buy Free Fire diamonds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enter your Free Fire Player ID, select diamond package, choose payment method, and complete payment for instant delivery."
            }
          },
          {
            "@type": "Question",
            "name": "Is Midasbuy safe for Free Fire diamonds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Midasbuy is an official and trusted platform for buying Free Fire diamonds with secure payment and instant delivery."
            }
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.middasbuy.com/#organization",
        "name": "Midasbuy",
        "url": "https://www.middasbuy.com",
        "logo": "https://www.middasbuy.com/og-image.png",
        "description": "Official store for Free Fire diamonds and gaming top-ups"
      }
    ]
  };

  const filteredPackages = diamondPackages.filter(pkg => {
    if (diamondRangeFilter !== "all") {
      if (diamondRangeFilter === "small" && (pkg.baseAmount < 100 || pkg.baseAmount > 500)) return false;
      if (diamondRangeFilter === "medium" && (pkg.baseAmount < 500 || pkg.baseAmount > 2000)) return false;
      if (diamondRangeFilter === "large" && pkg.baseAmount < 2000) return false;
      if (diamondRangeFilter === "starter" && (pkg.baseAmount < 100 || pkg.baseAmount > 310)) return false;
      if (diamondRangeFilter === "premium" && pkg.baseAmount < 5000) return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortFilter) {
      case "price_low_high":
        return a.price - b.price;
      case "price_high_low":
        return b.price - a.price;
      case "most_popular":
        return b.baseAmount - a.baseAmount;
      case "best_value":
        const aBonus = a.bonusAmount / a.baseAmount;
        const bBonus = b.bonusAmount / b.baseAmount;
        return bBonus - aBonus;
      case "discount":
        const aDiscount = parseFloat(a.discount.replace(/[-%]/g, ''));
        const bDiscount = parseFloat(b.discount.replace(/[-%]/g, ''));
        return bDiscount - aDiscount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      {!disableSeo && (
        <InternationalSEOHelmet 
          title="Buy Free Fire Diamonds - Cheap FF Top Up | Midasbuy"
          description="Buy Free Fire Diamonds at the cheapest price on Midasbuy. Up to 60% off, instant 3-5 min delivery, secure payments and trusted by 10M+ FF players."
          keywords="buy free fire diamonds, free fire diamond top up, ff diamonds cheap, garena free fire diamonds, free fire recharge, ff diamond purchase, cheapest free fire diamonds, free fire diamonds 2026, buy ff diamonds online, free fire diamond store, free fire top up pakistan, ff diamonds jazzcash, ff diamonds easypaisa, free fire diamond price, ff max diamonds, free fire max top up, garena ff diamonds, free fire diamond sale, ff diamond discount, free fire diamonds instant, buy free fire top up, free fire diamond deals, ff diamond bonus, free fire elite pass, dj alok free fire, chrono free fire, skyler free fire, free fire character unlock, ff weapon skins, free fire bundles, free fire emotes, midasbuy free fire, middasbuy ff diamonds, free fire official store, garena authorized seller, ff diamonds safe, free fire secure payment, free fire diamonds worldwide, ff diamonds global, free fire pakistan, free fire india, free fire malaysia, free fire philippines, free fire indonesia, free fire brazil, free fire europe, free fire americas, ff uid top up, free fire player id recharge, instant ff diamonds, fast free fire delivery, trusted ff diamond seller, verified free fire dealer, genuine ff diamonds, official ff retailer, free fire 100 diamonds, free fire 310 diamonds, free fire 520 diamonds, free fire 1060 diamonds, free fire 2180 diamonds, free fire 5600 diamonds, ff diamond pack, free fire monthly pass, free fire weekly membership, garena shell, garena topup, garena store, free fire game currency, ff in-game currency, buy diamonds free fire, purchase ff diamonds, order free fire diamonds, ff diamond recharge online, free fire diamond website, best free fire diamond site, cheapest ff top up, lowest price ff diamonds, free fire diamond offers, ff diamond promo, free fire diamond coupon, ff diamond code, free fire redeem diamonds, how to buy free fire diamonds, where to buy ff diamonds, best place buy free fire diamonds, free fire diamond app, ff diamond purchase app, free fire top up app, midasbuy ff top up, codashop free fire alternative, seagm free fire, garena free fire max, ff max diamond recharge, free fire max pakistan, ff max india, free fire battle royale, ff survival game, garena mobile game, free fire android, free fire ios, ff mobile top up, free fire smartphone recharge, cheap ff diamonds 2026, discount free fire diamonds 2026, free fire new year sale, ff diamond festival, free fire ramadan offer, free fire eid sale, ff diamond double bonus, free fire triple diamonds, ff vip bonus, free fire membership, ff premium diamonds, free fire season pass, ff royale pass diamonds, free fire skin purchase, ff outfit diamonds, free fire pet diamonds, ff gloo wall skins, free fire vehicle skins, ff backpack diamonds, free fire parachute skins, ff diamond gift, free fire diamonds gift card, ff diamond voucher, free fire topup voucher, garena voucher, free fire esports, ff tournament, free fire championship, ff pro league, free fire world series, ffws diamonds, free fire pakistan server, ff india server, free fire malaysia server, ff singapore server, free fire philippines server, ff europe server, free fire brazil server, ff americas server, ff mena server, free fire middle east, ff africa server, buy ff diamonds cheap price, lowest free fire diamond rate, best ff diamond deal, free fire diamond combo, ff diamond bundle offer, free fire special package, ff limited edition diamonds, free fire exclusive offer, ff flash sale, free fire weekend sale, ff midnight offer, free fire diamond rush, ff bonus diamonds, free fire extra diamonds, ff double up, free fire top up center, ff recharge center, free fire official recharge, ff authorized dealer, free fire genuine seller, ff legitimate store, free fire real diamonds, ff authentic currency, safe ff diamond purchase, secure free fire payment, encrypted ff transaction, free fire fraud protection, ff money back guarantee, free fire customer support, ff 24/7 help, free fire live chat support, ff ticket support, midasbuy customer service, middasbuy support, free fire help center, ff faq, free fire diamond guide, ff top up tutorial, how to recharge free fire, ff uid finder, free fire player id check, ff account top up, free fire direct recharge, ff instant credit, free fire quick delivery, ff fast processing, free fire automated delivery, ff bot delivery, free fire real time top up"
          pageType="freefire"
          canonicalUrl="/free-fire"
          structuredData={structuredData}
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
            alt="Free Fire Desktop Banner"
            className="w-full h-auto object-cover"
            loading="eager"
            decoding="async"
            style={{
              transform: `translate(${desktopBannerStyle.x}px, ${desktopBannerStyle.y}px) scale(${desktopBannerStyle.zoom / 100})`,
              transformOrigin: 'center center'
            }}
          />
        </div>
      )}
      
      {/* Free Fire Characters + Enter Player ID CTA - Mobile Only */}
      {isMobile && (
        <div className="w-full relative z-10">
          {/* Mobile Banner Container - Compact 130px like BGMI */}
          <div className="relative w-full max-h-[130px] overflow-hidden">
            {/* Mobile Banner - show if uploaded from admin */}
            {mobileBanner && (
              <div className="w-full overflow-hidden relative max-h-[130px]">
                <img 
                  src={mobileBanner}
                  alt="Free Fire Mobile Banner"
                  className="w-full h-auto object-cover max-h-[130px]"
                  loading="eager"
                  decoding="async"
                  style={{
                    transform: `translate(${mobileBannerStyle.x}px, ${mobileBannerStyle.y}px) scale(${mobileBannerStyle.zoom / 100})`,
                    transformOrigin: 'center center'
                  }}
                />
                {/* Dynamic orange light effect covering entire banner - admin controlled */}
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
            
            {/* Banner placeholder space - compact height */}
            {!mobileBanner && bannersLoaded && (
              <div className="w-full h-[100px] bg-gradient-to-b from-midasbuy-darkBlue to-midasbuy-darkBlue/80" />
            )}
            
            {/* Free Fire Logo, Title, Official Badge & Subscribe - OVER banner - Always LTR */}
            <div className="absolute bottom-6 left-0 flex items-center gap-2 px-3 z-20" dir="ltr">
              {/* Free Fire Logo */}
              <img 
                src="/lovable-uploads/free-fire-logo.webp"
                alt="Free Fire Logo"
                className="w-12 h-12 rounded-lg object-cover shadow-lg"
              />
              
              {/* Title and Badges */}
              <div className="flex flex-col gap-1.5">
                <h2 className="text-white text-base font-bold tracking-wide drop-shadow-lg">FREE FIRE</h2>
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
                        title: "Subscribe to FREE FIRE",
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
          
          {/* Player ID Section - Shows user info when saved, or prompt when not */}
          {(() => {
            const savedPlayerID = localStorage.getItem("freefirePlayerID");
            
            if (savedPlayerID) {
              // User has verified Player ID - show the blurred dark info bar (like PUBG)
              return (
                <div 
                  className="w-full relative z-20 -mt-3 cursor-pointer"
                  onClick={handlePlayerIdClick}
                >
                  {/* Glass morphism frosted background */}
                  <div className="relative overflow-hidden rounded-t-2xl backdrop-blur-2xl bg-white/10 border-b border-white/10" style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                    
                    {/* Content - Thinner padding, smaller text */}
                    <div className="relative py-2 px-3 flex items-center justify-between">
                      {/* Left side - Player ID */}
                      <div className="flex items-center gap-1">
                        <span className="text-white font-medium text-xs">
                          Player ID:
                        </span>
                        <span className="text-gray-300 text-xs">
                          {savedPlayerID}
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
                  className="w-full py-2.5 px-4 rounded-t-2xl cursor-pointer relative z-20 -mt-3"
                  style={{
                    background: "linear-gradient(to right, #33C3F0 0%, #2196F3 50%, #1976D2 100%)"
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
      
      {/* Mobile Navigation Tabs */}
      <FreeFireMobileNavigationTabs />
      
      <Drawer open={showPlayerIdModal} onOpenChange={setShowPlayerIdModal}>
        <DrawerContent 
          className="bg-[#101426] border-none text-white p-0 overflow-hidden rounded-t-[20px] h-[75svh] md:h-[85vh] flex flex-col"
          style={{ position: 'fixed', bottom: 0, maxHeight: '75svh' }}
        >
          {/* Sticky Header - only title stays fixed */}
          <div className="sticky top-0 z-20 bg-[#101426] flex-shrink-0 px-5 pt-5 pb-2">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-bold text-white uppercase tracking-wide">{t('checkout.enterPlayerIdNow', 'ENTER YOUR PLAYER ID NOW')}</DrawerTitle>
              <Button 
                variant="ghost" 
                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setShowPlayerIdModal(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Scrollable Content - scrolls under the header */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            <div className="mb-3">
              <div className="bg-gradient-to-r from-[#06bdfd] to-[#2d7bf8] px-2 py-1.5 rounded-t-lg border-2 border-[#2d7bf8] border-b-0">
                <p className="text-white text-[10px] font-medium text-center whitespace-nowrap">
                  {t('checkout.selectPlayerIdToRecharge', 'Please fill in your Player ID you want to recharge')}
                </p>
              </div>
              <div className="bg-[#131722] border-2 border-[#2d7bf8] border-t-0 rounded-b-lg p-3">
                <Input
                  value={tempPlayerID}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setTempPlayerID(value);
                    if (playerIdError) setPlayerIdError("");
                  }}
                  placeholder={t('checkout.enterFreeFireId', 'Enter your Free Fire ID')}
                  variant="dark"
                  className={`h-12 text-base bg-transparent border-none placeholder-gray-500 ${playerIdError ? 'ring-1 ring-red-500' : ''}`}
                  maxLength={12}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              {playerIdError && (
                <p className="text-red-500 text-xs mt-1 px-1">{playerIdError}</p>
              )}
            </div>
            
            <Button 
              className="w-full h-14 text-lg font-bold mb-4"
              variant="blue"
              size="lg"
              onClick={handleSavePlayerInfo}
              disabled={isVerifying || !tempPlayerID}
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                "OK"
              )}
            </Button>
            
            {/* Couldn't find your Player ID? - Collapsible Section */}
            <div className="mb-4">
              <button
                onClick={() => setShowHelpImages(!showHelpImages)}
                className="w-full flex items-center justify-center gap-1 text-[#06bdfd] text-sm py-2 hover:text-[#2d7bf8] transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Couldn't find your Player ID?</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showHelpImages ? 'rotate-180' : ''}`} />
              </button>
              
              {showHelpImages && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-400 text-sm mb-3">1. Find your ID in your profile page</p>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src="/assets/freefire-player-id-help.webp" 
                      alt="Finding Player ID in Free Fire Profile" 
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Recently used Player ID Section */}
            {recentPlayerIds.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-gray-400 text-sm">Recently used Player ID</h5>
                <div className="space-y-2">
                  {recentPlayerIds.map((recent, index) => (
                    <div 
                      key={index}
                      className="bg-[#1A1F2E] rounded-lg p-3 flex items-center justify-between border border-[#182238] hover:border-[#06bdfd]/50 cursor-pointer transition-colors"
                      onClick={() => setTempPlayerID(recent.playerId)}
                    >
                      <p className="text-gray-300 text-sm">Player ID: {recent.playerId}</p>
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
      
      <main className={`${isMobile ? 'pt-0' : 'pt-20'} pb-20 relative ${isMobile ? 'mobile-content mobile-main-container' : 'z-10'}`}>
        <div className={`container mx-auto px-4 ${isMobile ? 'mobile-main-container' : ''}`}>
          {/* Desktop Only - Game Logo Section */}
          {!isMobile && (
          <div className="flex flex-col md:flex-row items-start mb-6 relative">
            {/* Game Logo Section Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
              style={{ 
                backgroundImage: `url('/lovable-uploads/00b4e0cc-82b5-404e-ae09-3c71752a2a99.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            
            <div className="flex-grow z-10 md:ml-8 md:mt-2 relative">
              <div className={`flex items-center mb-2`}>
                <OptimizedImage 
                  src="/lovable-uploads/624ac7f0-c182-4f1e-b919-938374f4af9d.png" 
                  alt="Free Fire"
                  className={`rounded-md ${isMobile ? 'w-16 h-16 mr-2' : 'w-[75px] mr-3'}`}
                  priority={true}
                  quality={90}
                />
                <div className={isMobile ? 'flex-1' : ''}>
                  <div className={`flex items-center ${isMobile ? 'flex-col items-start' : ''}`}>
                    <h1 className={`text-white font-bold tracking-wide drop-shadow-lg ${isMobile ? 'text-sm mb-1' : 'text-2xl md:text-3xl'}`} style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0px 0px 20px rgba(0,0,0,0.6)' }}>FREE FIRE</h1>
                    <div className={`flex space-x-2 ${isMobile ? 'mb-1' : 'ml-3'}`}>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full bg-white ${isMobile ? '' : ''}`}>
                        <OptimizedImage 
                          src="/lovable-uploads/4a2161ab-1ca9-4095-a9cd-2f2eee4b8365.png" 
                          alt="Official" 
                          className={`${isMobile ? 'h-4' : 'h-6'} w-auto`}
                          quality={90}
                        />
                      </div>
                      <span 
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-white/10 backdrop-blur-sm text-white cursor-pointer hover:bg-white/20 transition-colors ${isMobile ? 'text-[10px]' : 'text-xs'}`}
                        onClick={handleSubscribeClick}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`mr-1 ${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.44 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Subscribed
                      </span>
                    </div>
                  </div>
                  
                  <div className={`${isMobile ? 'mt-1' : 'mt-2'} ${localStorage.getItem("freefirePlayerID") ? 'flex gap-2 items-center' : ''}`}>
                    <button 
                      className={`bg-gradient-to-r from-freefire-primary to-freefire-secondary text-white font-medium rounded-md hover:from-freefire-secondary hover:to-freefire-accent transition-all shadow-lg flex items-center gap-2 border border-freefire-primary/30 ${isMobile ? 'px-3 py-1 text-xs' : 'px-5 py-1.5 text-sm'}`}
                      onClick={handlePlayerIdClick}
                    >
                      <span className="font-semibold">
                        {localStorage.getItem("freefirePlayerID") ? "Player ID Saved" : "Enter Your Player ID"}
                      </span>
                      <ArrowRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                    </button>
                    {localStorage.getItem("freefirePlayerID") && (
                      <button 
                        className={`bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-all shadow-lg flex items-center gap-1 ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}
                        onClick={handleRemovePlayerInfo}
                        title="Remove Player ID"
                      >
                        <X className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                        {!isMobile && <span>Remove</span>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
          
          {/* Desktop Navigation Tabs - above packages */}
          <FreeFireNavigationTabs />
          
          
          <div ref={packagesRef} className={`${isMobile ? 'mt-3 mb-6' : 'mt-3 mb-8'}`}>
            <DiamondPackageGrid packages={filteredPackages} selectedCountry={selectedCountry} />
          </div>
          
          {/* Description/FAQ section removed - content is now in footer */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FreeFire;
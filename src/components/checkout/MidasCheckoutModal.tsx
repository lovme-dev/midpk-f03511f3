import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  User, 
  Info, 
  CreditCard,
  Ticket,
  HelpCircle,
  Gift,
  Wallet
} from 'lucide-react';
import { 
  EasyPaisaLogo, 
  JazzCashLogo, 
  MidasLogo, 
  UCStackIcon, 
  SingleUCIcon,
  VIPCoinIcon,
  CardPaymentIcons
} from '@/components/checkout/CheckoutIcons';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UCPackage, ucPackages } from "@/data/ucPackages";
import { diamondPackages } from "@/data/diamondPackages";
import { robuxPackages } from "@/data/robuxPackages";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCurrencyFormat, convertPkrToAnyCurrency } from "@/hooks/useCurrencyFormat";
import { getCountryCurrency } from "@/utils/countryConfigs";
import BinanceCryptoPayment from "@/components/BinanceCryptoPayment";
import binanceLogoFull from "@/assets/binance-logo-full.png";
import { GuestEmailDialog } from "@/components/GuestEmailDialog";
import { useNavigate, useParams } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { 
  ttqViewContent, 
  ttqInitiateCheckout, 
  ttqAddPaymentInfo, 
  ttqPlaceAnOrder,
  ttqIdentify
} from "@/utils/tiktokTracking";

interface MidasCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: UCPackage | null;
  isBGMI?: boolean;
  isFreeFire?: boolean;
  isRoblox?: boolean;
  isValorant?: boolean;
  isHonorOfKings?: boolean;
  isPubgCar?: boolean;
  carName?: string;
  carDescription?: string;
  // Shop product (Elite Pass / Prime / Growthgift) — non-UC fixed digital pack
  isShopProduct?: boolean;
  shopProductTitle?: string;   // e.g., "A18 Elite Pass (LV1-50)"
  shopProductImage?: string;   // small icon shown in summary
  shopProductLabel?: string;   // singular unit label, e.g., "Royal Pass", "Prime", "Pack"
}

const MidasCheckoutModal: React.FC<MidasCheckoutModalProps> = ({ 
  open, 
  onOpenChange, 
  packageData,
  isBGMI = false,
  isFreeFire = false,
  isRoblox = false,
  isValorant = false,
  isHonorOfKings = false,
  isPubgCar = false,
  carName = '',
  carDescription = '',
  isShopProduct = false,
  shopProductTitle = '',
  shopProductImage = '',
  shopProductLabel = 'Pack'
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { countryCode: urlCountryCode } = useParams<{ countryCode?: string }>();
  const { openAuthModal } = useAuthModal();
  
  // CRITICAL: Pass URL country code to useCurrencyFormat to ensure correct currency is used
  // This fixes the issue where localStorage fallback was sometimes returning wrong currency
  const urlCountryUpper = urlCountryCode?.toUpperCase();
  const urlCurrency = urlCountryUpper ? getCountryCurrency(urlCountryUpper) : undefined;
  
  const { formatPrice, currencyCode, convertPrice } = useCurrencyFormat(
    urlCurrency ? { code: urlCountryCode, currency: urlCurrency } : undefined
  );
  
  // Use URL country code for consistency
  const countryCode = urlCountryCode;
  
  // Determine if user is in Pakistan based on URL country code (not IP)
  const isPakistan = countryCode?.toLowerCase() === 'pk';
  
  // Dynamic branding based on game type
  const productLabel = isShopProduct
    ? shopProductLabel
    : (isPubgCar ? 'Car Skin' : (isFreeFire ? 'Diamonds' : (isRoblox ? 'Robux' : (isValorant ? 'VP' : (isHonorOfKings ? 'Tokens' : 'UC')))));
  const productType = isShopProduct
    ? 'pubg_shop_item'
    : (isPubgCar 
      ? 'pubg_car' 
      : (isFreeFire 
        ? 'freefire_diamonds' 
        : (isRoblox 
          ? 'roblox_robux' 
          : (isValorant 
            ? 'valorant_vp' 
            : (isHonorOfKings 
              ? 'honorofkings_tokens' 
              : (isBGMI ? 'bgmi_uc' : 'pubg_uc'))))));
  const getItemName = (pkg: UCPackage) => {
    if (isShopProduct && shopProductTitle) {
      return shopProductTitle;
    }
    if (isPubgCar && carName) {
      return `PUBG Car - ${carName}`;
    }
    const label = isFreeFire 
      ? 'Free Fire Diamonds' 
      : (isRoblox 
        ? 'Roblox Robux' 
        : (isValorant 
          ? 'Valorant VP' 
          : (isHonorOfKings 
            ? 'Honor of Kings Tokens' 
            : (isBGMI ? 'BGMI UC' : 'PUBG UC'))));
    return `${label} ${pkg.baseAmount}${pkg.bonusAmount > 0 ? `+${pkg.bonusAmount}` : ''}`;
  };
  
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [showPriceDetails, setShowPriceDetails] = useState<boolean>(false);
  const [showPlayerIdModal, setShowPlayerIdModal] = useState<boolean>(false);
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [showProductDetails, setShowProductDetails] = useState<boolean>(false);
  const [showExtraModal, setShowExtraModal] = useState<boolean>(false);
  const [showPackageDropdown, setShowPackageDropdown] = useState<boolean>(false);

  // Selected package state
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(packageData);

  // User Info State
  const [userInfo, setUserInfo] = useState<{id: string, name: string} | null>(null);
  
  // Recent Player IDs state - synced with banner drawer (uses same localStorage)
  const [recentPlayerIds, setRecentPlayerIds] = useState<{playerId: string, username: string}[]>([]);
  
  // Temporary state for modal inputs
  const [tempId, setTempId] = useState('');
  const [tempName, setTempName] = useState('');

  // Payment states
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  
  // Guest checkout states
  const [showGuestEmailDialog, setShowGuestEmailDialog] = useState(false);
  const [guestUserId, setGuestUserId] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  
  // PK Quick Email Checkout - for non-logged in users selecting PayFast
  const [quickCheckoutEmail, setQuickCheckoutEmail] = useState<string>('');
  const [quickCheckoutEmailError, setQuickCheckoutEmailError] = useState<string>('');

  // Update selected package when prop changes
  useEffect(() => {
    if (packageData) {
      setSelectedPackage(packageData);
    }
  }, [packageData]);

  // TikTok: Track InitiateCheckout when modal opens with package
  useEffect(() => {
    if (open && selectedPackage) {
      const itemName = getItemName(selectedPackage);
      ttqInitiateCheckout({
        contentId: String(selectedPackage.id),
        contentName: itemName,
        value: selectedPackage.price,
        currency: 'PKR'
      });
      
      // Also track ViewContent
      ttqViewContent({
        contentId: String(selectedPackage.id),
        contentName: itemName,
        value: selectedPackage.price,
        currency: 'PKR'
      });
    }
  }, [open, selectedPackage?.id]);

  // Check authentication and load saved player info (and keep it in-sync while modal is open)
  useEffect(() => {
    if (!open) return;

    const applySession = (session: any | null) => {
      // For Free Fire: load from freefirePlayerID directly (no username needed)
      if (isFreeFire) {
        const savedFreeFirePlayerID = localStorage.getItem("freefirePlayerID");
        if (savedFreeFirePlayerID) {
          setUserInfo({ id: savedFreeFirePlayerID, name: '' });
          setTempId(savedFreeFirePlayerID);
          setTempName('');
        }
        
        if (session) {
          setUserEmail(session.user?.email || "");
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
        }
        setRecentPlayerIds([]);
        return;
      }
      
      // For Roblox: load from robloxUsername (username only, no numeric player ID)
      if (isRoblox) {
        const savedRobloxUsername = localStorage.getItem("robloxUsername");
        if (savedRobloxUsername) {
          setUserInfo({ id: savedRobloxUsername, name: savedRobloxUsername });
          setTempId(savedRobloxUsername);
          setTempName(savedRobloxUsername);
        }
        
        if (session) {
          setUserEmail(session.user?.email || "");
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
        }
        
        // Load recent Roblox usernames
        const recentRobloxJson = localStorage.getItem('recentRobloxUsernames');
        if (recentRobloxJson) {
          try {
            const parsed = JSON.parse(recentRobloxJson);
            setRecentPlayerIds(Array.isArray(parsed) ? parsed.map((u: any) => ({ playerId: u.username || u, username: u.username || u })) : []);
          } catch {
            setRecentPlayerIds([]);
          }
        } else {
          setRecentPlayerIds([]);
        }
        return;
      }
      
      // Determine game-specific keys
      const gamePrefix = isBGMI ? 'bgmi' : 'pubg';
      const storageKey = isBGMI ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
      const playerIdKey = `${gamePrefix}PlayerID`;
      const usernameKey = `${gamePrefix}Username`;
      
      if (session) {
        setUserEmail(session.user?.email || "");
        setIsLoggedIn(true);

        // Load recent player IDs
        const recentIdsJson = localStorage.getItem(storageKey);
        if (recentIdsJson) {
          try {
            const parsed = JSON.parse(recentIdsJson);
            setRecentPlayerIds(Array.isArray(parsed) ? parsed : []);
          } catch {
            setRecentPlayerIds([]);
          }
        }

        // Check game-specific saved player info (synced with banner)
        const savedPlayerID = localStorage.getItem(playerIdKey);
        const savedUsername = localStorage.getItem(usernameKey);
        if (savedPlayerID && savedUsername) {
          setUserInfo({ id: savedPlayerID, name: savedUsername });
          setTempId(savedPlayerID);
          setTempName(savedUsername);
        } else if (recentIdsJson) {
          // Auto-fill from first recent ID if no saved info
          try {
            const parsed = JSON.parse(recentIdsJson);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const firstRecent = parsed[0];
              setUserInfo({ id: firstRecent.playerId, name: firstRecent.username });
              setTempId(firstRecent.playerId);
              setTempName(firstRecent.username);
            }
          } catch {}
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
        
        // Load recent player IDs for guest users too
        const recentIdsJson = localStorage.getItem(storageKey);
        let hasRecentIds = false;
        if (recentIdsJson) {
          try {
            const parsed = JSON.parse(recentIdsJson);
            setRecentPlayerIds(Array.isArray(parsed) ? parsed : []);
          } catch {
            setRecentPlayerIds([]);
          }
        } else {
          setRecentPlayerIds([]);
        }
        
        // Check game-specific saved player info (synced with banner)
        const savedPlayerID = localStorage.getItem(playerIdKey);
        const savedUsername = localStorage.getItem(usernameKey);
        if (savedPlayerID && savedUsername) {
          setUserInfo({ id: savedPlayerID, name: savedUsername });
          setTempId(savedPlayerID);
          setTempName(savedUsername);
          hasRecentIds = true;
        } else if (recentIdsJson) {
          // Auto-fill from first recent ID if no saved info
          try {
            const parsed = JSON.parse(recentIdsJson);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const firstRecent = parsed[0];
              setUserInfo({ id: firstRecent.playerId, name: firstRecent.username });
              setTempId(firstRecent.playerId);
              setTempName(firstRecent.username);
              hasRecentIds = true;
            }
          } catch {}
        }

        // For guest users, check if temporary data exists and is not expired (48 hours) - only if no recent IDs
        if (!hasRecentIds) {
          const tempPlayerData = localStorage.getItem("playerID_temp");
          const tempUsernameData = localStorage.getItem("pubgUsername_temp");
          const tempExpiry = localStorage.getItem("playerData_expiry");

          if (tempPlayerData && tempUsernameData && tempExpiry) {
            const expiryTime = parseInt(tempExpiry, 10);
            const now = Date.now();

            if (now < expiryTime) {
              // Data is still valid
              setUserInfo({ id: tempPlayerData, name: tempUsernameData });
              setTempId(tempPlayerData);
              setTempName(tempUsernameData);
            } else {
              // Data expired, remove it
              localStorage.removeItem("playerID_temp");
              localStorage.removeItem("pubgUsername_temp");
              localStorage.removeItem("playerData_expiry");
            }
          }
        }
      }
    };

    // Listener FIRST (fastest updates after login from popup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    // Then fetch current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
   }, [open, isFreeFire, isBGMI, isRoblox]);
  
  // Listen for localStorage changes from banner drawer (bidirectional sync)
  useEffect(() => {
    if (!open || isFreeFire || isRoblox) return;
    
    const gamePrefix = isBGMI ? 'bgmi' : 'pubg';
    const storageKey = isBGMI ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
    const playerIdKey = `${gamePrefix}PlayerID`;
    const usernameKey = `${gamePrefix}Username`;
    
    const handleStorageChange = (e: StorageEvent) => {
      // Update recent IDs if changed from banner
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setRecentPlayerIds(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Failed to parse recent player IDs from storage event:', error);
        }
      }
      
      // Update saved player info if changed from banner
      if (e.key === playerIdKey || e.key === usernameKey) {
        const savedPlayerId = localStorage.getItem(playerIdKey);
        const savedUsername = localStorage.getItem(usernameKey);
        if (savedPlayerId && savedUsername) {
          setUserInfo({ id: savedPlayerId, name: savedUsername });
          setTempId(savedPlayerId);
          setTempName(savedUsername);
        } else {
          setUserInfo(null);
          setTempId('');
          setTempName('');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [open, isFreeFire, isBGMI, isRoblox]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setShowCryptoPayment(false);
      setIsPaymentLoading(false);
      setTempId("");
      setTempName("");
      setShowPlayerIdModal(false);
      setShowCouponModal(false);
      setShowExtraModal(false);
      setShowPriceDetails(false);
      setShowProductDetails(false);
      setShowPackageDropdown(false);
      setSelectedMethod('card');
    }
  }, [open]);

  // After successful login (from popup), keep user on this checkout modal and jump to Player ID step
  useEffect(() => {
    if (!open) return;
    if (isLoggedIn && !userInfo) {
      setShowPlayerIdModal(true);
    }
  }, [open, isLoggedIn, userInfo]);

  // Track if we pushed a history state for sub-modals
  const subModalHistoryPushed = useRef(false);

  // Sticky header state
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky header
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setShowStickyHeader(scrollTop > 80);
    }
  }, []);

  // Handle browser back button for sub-modals (PlayerID/Coupon/Extra)
  useEffect(() => {
    const isAnySubModalOpen = showPlayerIdModal || showCouponModal || showExtraModal;
    
    if (isAnySubModalOpen && !subModalHistoryPushed.current) {
      // Push a history state when sub-modal opens
      window.history.pushState({ subModal: true }, '');
      subModalHistoryPushed.current = true;
    }

    if (!isAnySubModalOpen && subModalHistoryPushed.current) {
      // Reset ref when all sub-modals are closed
      subModalHistoryPushed.current = false;
    }

    const handlePopState = () => {
      // Close only the sub-modal, not the checkout
      if (showPlayerIdModal) {
        setShowPlayerIdModal(false);
      } else if (showCouponModal) {
        setShowCouponModal(false);
      } else if (showExtraModal) {
        setShowExtraModal(false);
      }
      subModalHistoryPushed.current = false;
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showPlayerIdModal, showCouponModal, showExtraModal]);

  // Close sub-modal properly (via history if pushed)
  const closeSubModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (subModalHistoryPushed.current) {
      window.history.back();
    } else {
      setter(false);
    }
  };

  // Prevent background scrolling while checkout is open (mobile-safe)
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const body = document.body;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const [freeFireIdError, setFreeFireIdError] = useState("");

  const handleSavePlayerInfo = () => {
    // For Free Fire, require 8-12 digits
    if (isFreeFire) {
      if (!tempId || tempId.length < 8 || tempId.length > 12) {
        setFreeFireIdError("Please enter a valid Free Fire ID (8-12 digits)");
        return;
      }
      setFreeFireIdError("");
      setUserInfo({ id: tempId, name: '' });
      localStorage.setItem("freefirePlayerID", tempId);
      closeSubModal(setShowPlayerIdModal);
      return;
    }

    // For Roblox, require username only (minimum 3 characters)
    if (isRoblox) {
      if (!tempName || tempName.trim().length < 3) {
        toast({
          title: "Invalid Username",
          description: "Please enter a valid Roblox Username (minimum 3 characters)",
          variant: "destructive",
        });
        return;
      }
      setUserInfo({ id: tempName, name: tempName });
      localStorage.setItem("robloxUsername", tempName);
      localStorage.setItem("robloxPlayerID", tempName);
      
      // Save to recent usernames
      const recentJson = localStorage.getItem('recentRobloxUsernames');
      let recent: Array<{username: string}> = [];
      try { recent = recentJson ? JSON.parse(recentJson) : []; } catch {}
      const filtered = recent.filter(r => r.username !== tempName);
      const updated = [{ username: tempName }, ...filtered].slice(0, 5);
      localStorage.setItem('recentRobloxUsernames', JSON.stringify(updated));
      setRecentPlayerIds(updated.map(u => ({ playerId: u.username, username: u.username })));
      
      closeSubModal(setShowPlayerIdModal);
      return;
    }

    if (!tempId || tempId.length < 8) {
      toast({
        title: "Invalid Player ID",
        description: "Please enter a valid Player ID (minimum 8 digits)",
        variant: "destructive",
      });
      return;
    }

    if (!tempName || tempName.trim().length < 3) {
      toast({
        title: "Invalid Username",
        description: "Please enter a valid username (minimum 3 characters)",
        variant: "destructive",
      });
      return;
    }

    setUserInfo({ id: tempId, name: tempName });
    
    // Determine game-specific keys (BGMI vs PUBG)
    const gamePrefix = isBGMI ? 'bgmi' : 'pubg';
    const playerIdKey = `${gamePrefix}PlayerID`;
    const usernameKey = `${gamePrefix}Username`;
    
    // Save to game-specific keys for sync with banner drawer
    localStorage.setItem(playerIdKey, tempId);
    localStorage.setItem(usernameKey, tempName);
    
    if (isLoggedIn) {
      // For logged-in users, save permanently
      localStorage.setItem("playerID_permanent", tempId);
      localStorage.setItem("pubgUsername_permanent", tempName);
      
      // Add to recent player IDs (avoid duplicates, max 5)
      const storageKey = isBGMI ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
      const newEntry = { playerId: tempId, username: tempName };
      setRecentPlayerIds(prev => {
        const filtered = prev.filter(p => p.playerId !== tempId);
        const updated = [newEntry, ...filtered].slice(0, 5);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        
        // Dispatch storage events for cross-component sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: playerIdKey,
          newValue: tempId,
          url: window.location.href
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: usernameKey,
          newValue: tempName,
          url: window.location.href
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: storageKey,
          newValue: JSON.stringify(updated),
          url: window.location.href
        }));
        
        return updated;
      });
    } else {
      // For guest users, also save to recent IDs for banner drawer sync
      const expiryTime = Date.now() + (48 * 60 * 60 * 1000); // 48 hours
      localStorage.setItem("playerID_temp", tempId);
      localStorage.setItem("pubgUsername_temp", tempName);
      localStorage.setItem("playerData_expiry", String(expiryTime));
      
      // Also add to recent player IDs for guest users
      const storageKey = isBGMI ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
      const newEntry = { playerId: tempId, username: tempName };
      setRecentPlayerIds(prev => {
        const filtered = prev.filter(p => p.playerId !== tempId);
        const updated = [newEntry, ...filtered].slice(0, 5);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        
        // Dispatch storage events for cross-component sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: playerIdKey,
          newValue: tempId,
          url: window.location.href
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: usernameKey,
          newValue: tempName,
          url: window.location.href
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: storageKey,
          newValue: JSON.stringify(updated),
          url: window.location.href
        }));
        
        return updated;
      });
    }
    
    // Close modal without notification
    closeSubModal(setShowPlayerIdModal);
  };
  
  // Delete a recent player ID
  const handleDeleteRecentPlayerId = (playerId: string) => {
    const gamePrefix = isBGMI ? 'bgmi' : 'pubg';
    const storageKey = isBGMI ? 'recentBgmiPlayerIds' : 'recentPubgPlayerIds';
    const playerIdKey = `${gamePrefix}PlayerID`;
    const usernameKey = `${gamePrefix}Username`;
    
    setRecentPlayerIds(prev => {
      // Find the deleted player to check if it's the current one
      const deletedPlayer = prev.find(p => p.playerId === playerId);
      
      const updated = prev.filter(p => p.playerId !== playerId);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      // If deleted player was the currently saved one, clear saved info
      if (deletedPlayer && userInfo && deletedPlayer.playerId === userInfo.id) {
        setUserInfo(null);
        setTempId('');
        setTempName('');
        localStorage.removeItem(playerIdKey);
        localStorage.removeItem(usernameKey);
        
        // Dispatch storage events for cross-component sync
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
      
      // Dispatch storage event for recent IDs list
      window.dispatchEvent(new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify(updated),
        url: window.location.href
      }));
      
      return updated;
    });
  };
  
  // Select a recent player ID
  const handleSelectRecentPlayerId = (player: {playerId: string, username: string}) => {
    setTempId(player.playerId);
    setTempName(player.username);
  };
  
  // Handle Player ID input - numbers only, max 10 for Free Fire, 15 for others
  const handlePlayerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const maxLength = isFreeFire ? 12 : 15;
    if (value.length <= maxLength) {
      setTempId(value);
      if (isFreeFire && freeFireIdError) setFreeFireIdError("");
    }
  };
  
  // Handle Sign In click
  const handleSignInClick = () => {
    closeSubModal(setShowPlayerIdModal);
    openAuthModal();
  };
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle Quick Email change for PK users
  const handleQuickEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuickCheckoutEmail(value);
    if (value && !isValidEmail(value)) {
      setQuickCheckoutEmailError('Please enter a valid email');
    } else {
      setQuickCheckoutEmailError('');
    }
  };
  
  // Handle Quick Pay for PK non-logged users with email only
  const handleQuickPayWithEmail = async () => {
    if (!selectedPackage || !userInfo) {
      setShowPlayerIdModal(true);
      return;
    }
    
    if (!quickCheckoutEmail || !isValidEmail(quickCheckoutEmail)) {
      setQuickCheckoutEmailError('Please enter a valid email');
      return;
    }
    
    // Generate a guest user ID
    const tempUserId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Proceed with payment using the quick email
    handleGoPayFastSubmit(tempUserId, quickCheckoutEmail);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Global payment redirect URLs for first 3 packages
  const globalPaymentRedirectUrls: Record<string, string> = {
    '2250uc': 'https://www.middasbuy.space/checkouts/cn/hWN7UHd4VNWHD8HplzhKF7FS',
    '4870uc': 'https://www.middasbuy.space/checkouts/cn/hWN7UHuuZSvB6ViA39oVvslW',
    '10904uc': 'https://www.middasbuy.space/checkouts/cn/hWN7UI0C6ifeomjTvRWNSE8A',
  };

  const handleGoPayFastSubmit = async (overrideUserId?: string, overrideEmail?: string) => {
    if (!selectedPackage || !userInfo) return;
    
    const effectiveUserId = overrideUserId || guestUserId;
    const effectiveEmail = overrideEmail || guestEmail || userEmail;
    
    if (!userEmail && !effectiveUserId) {
      setShowGuestEmailDialog(true);
      return;
    }
    
    setIsPaymentLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || effectiveUserId || '';
      const emailToUse = user?.email || effectiveEmail || '';
      
      const itemName = getItemName(selectedPackage);
      
      localStorage.setItem('lastPackageName', itemName);
      localStorage.setItem('lastUCAmount', String(selectedPackage.baseAmount + selectedPackage.bonusAmount));
      localStorage.setItem('lastPrice', String(selectedPackage.price));
      localStorage.setItem('lastPaymentMethod', 'GoPayFast');
      
      const response = await supabase.functions.invoke('gopayfast-payment', {
        body: {
          amount: selectedPackage.price,
          item_name: itemName,
          email_address: emailToUse || 'guest@midasbuy.com',
          player_id: userInfo.id,
          username: userInfo.name,
          package_id: String(selectedPackage.id),
          user_id: userId || 'guest',
          product_type: productType,
          product_name: itemName,
          product_amount: `${selectedPackage.baseAmount}+${selectedPackage.bonusAmount}`,
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Payment initialization failed');
      }
      
      const { success, post_url, form_data, error } = response.data;
      
      if (!success || !form_data) {
        throw new Error(error || 'Failed to initialize payment');
      }
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = post_url;
      form.target = '_self';
      
      Object.entries(form_data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('GoPayFast payment error:', error);
      toast({
        title: "Payment Error",
        description: (error as any)?.message || 'Failed to initialize payment. Please try again.',
        variant: "destructive",
      });
      setIsPaymentLoading(false);
    }
  };

  const handleUsdPaymentSubmit = async () => {
    if (!selectedPackage || !userInfo) return;
    
    // For first 3 packages with redirect URLs
    const redirectUrl = globalPaymentRedirectUrls[selectedPackage.id];
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }
    
    setIsPaymentLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || guestUserId || '';
      const emailToUse = user?.email || guestEmail || '';
      
      const itemName = getItemName(selectedPackage);
      const usdPrice = convertPkrToAnyCurrency(selectedPackage.price, 'USD');
      
      localStorage.setItem('lastPackageName', itemName);
      localStorage.setItem('lastUCAmount', String(selectedPackage.baseAmount + selectedPackage.bonusAmount));
      localStorage.setItem('lastPrice', String(usdPrice));
      localStorage.setItem('lastPaymentMethod', 'PayPro');
      
      const response = await supabase.functions.invoke('paypro-payment', {
        body: {
          amount: usdPrice,
          item_name: itemName,
          email_address: emailToUse || 'guest@midasbuy.com',
          player_id: userInfo.id,
          username: userInfo.name,
          package_id: String(selectedPackage.id),
          user_id: userId || 'guest',
          product_type: productType,
          product_name: itemName,
          product_amount: `${selectedPackage.baseAmount}+${selectedPackage.bonusAmount}`,
          return_base_url: window.location.origin,
          currency: 'USD',
          currency_amount: usdPrice,
          is_converted: true,
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Payment initialization failed');
      }
      
      const { success, checkout_url, error } = response.data;
      
      if (!success || !checkout_url) {
        throw new Error(error || 'Payment failed');
      }
      
      window.location.href = checkout_url;
    } catch (error) {
      console.error('PayPro Payment error:', error);
      toast({
        title: "Payment Error",
        description: (error as any)?.message || 'Failed to initialize payment. Please try again.',
        variant: "destructive",
      });
      setIsPaymentLoading(false);
    }
  };

  const handlePaymentMethodClick = (methodId: string) => {
    if (!selectedPackage) return;
    
    // Check if player ID is entered
    if (!userInfo) {
      setShowPlayerIdModal(true);
      toast({
        title: isRoblox ? "Username Required" : "Player ID Required",
        description: isRoblox ? "Please enter your Roblox Username first" : "Please enter your Player ID first",
        variant: "destructive",
      });
      return;
    }

    setSelectedMethod(methodId);

    // TikTok: Track AddPaymentInfo when payment method is selected
    if (selectedPackage) {
      ttqAddPaymentInfo({
        contentId: String(selectedPackage.id),
        contentName: getItemName(selectedPackage),
        value: selectedPackage.price,
        currency: 'PKR'
      });
    }

    if (methodId === 'payfast') {
      handleGoPayFastSubmit();
    } else if (methodId === 'global') {
      handleUsdPaymentSubmit();
    } else if (methodId === 'binance') {
      setShowCryptoPayment(true);
    }
  };

  const handleCryptoPaymentConfirmed = (txId: string) => {
    setShowCryptoPayment(false);
    onOpenChange(false);
    toast({
      title: "Payment Successful!",
      description: `Your crypto payment has been confirmed. TX: ${txId.substring(0, 16)}...`,
    });
    navigate('/thank-you');
  };

  const handlePayNow = () => {
    if (!userInfo) {
      setShowPlayerIdModal(true);
      return;
    }

    // TikTok: Track PlaceAnOrder when user clicks Pay Now
    if (selectedPackage) {
      ttqPlaceAnOrder({
        contentId: String(selectedPackage.id),
        contentName: getItemName(selectedPackage),
        value: selectedPackage.price,
        currency: 'PKR'
      });
      
      // Identify user if email available
      if (userEmail) {
        ttqIdentify({ email: userEmail, externalId: userInfo.id });
      }
    }

    // Trigger payment based on selected method
    if (selectedMethod === 'card') {
      // Generate unique token and redirect to credit card payment page
      const paramsToken = Date.now().toString() + Math.random().toString(36).substring(2, 15);
      
      // Save order info to localStorage for the payment page
      const totalUC = selectedPackage.baseAmount + selectedPackage.bonusAmount;
      
      // Parse discount percentage from string like "-76%" or "35%" to number
      const discountStr = selectedPackage.discount || '';
      const discountPercentage = Math.abs(parseInt(discountStr.replace(/[^0-9-]/g, '')) || 0);
      
      // Find the package index (0-based) in the appropriate packages array
      // Use correct array for each game type
      let packageIndex = -1;
      if (isRoblox) {
        packageIndex = robuxPackages.findIndex(pkg => pkg.id === selectedPackage.id);
      } else if (isFreeFire) {
        packageIndex = diamondPackages.findIndex(pkg => pkg.id === selectedPackage.id);
      } else {
        packageIndex = ucPackages.findIndex(pkg => pkg.id === selectedPackage.id);
      }
      
      // Get PKR amount for payment processing (base price stored in PKR)
      const pkrAmount = selectedPackage.price;
      
      // Get display amount in user's currency
      const displayAmount = convertPrice(selectedPackage.price);
      const displayOriginalPrice = convertPrice(selectedPackage.originalPrice);
      
      // Build product name with base+bonus format for proper display
      const productAmount = `${selectedPackage.baseAmount}+${selectedPackage.bonusAmount}`;
      
      const orderInfo = {
        amount: displayAmount.toFixed(2),
        pkrAmount: pkrAmount, // Original PKR price for payment processing
        currency: currencyCode,
        displayCurrency: currencyCode,
        productName: isFreeFire 
          ? `${productAmount} Diamonds` 
          : (isRoblox 
            ? `${productAmount} Robux` 
            : (isValorant 
              ? `${productAmount} VP` 
              : `${productAmount} UC`)),
        productType: productType, // Product type for game identification
        productAmount: productAmount, // Base+bonus amount for database storage
        playerId: userInfo,
        email: userEmail || '',
        discountPercentage,
        originalPrice: displayOriginalPrice, // Display original price in user's currency
        pkrOriginalPrice: selectedPackage.originalPrice, // Original price in PKR
        packageIndex // Pass the index to check if it's first 4 packages
      };
      
      console.log('🎮 [Checkout Modal] Saving order info to localStorage:', {
        productName: orderInfo.productName,
        productType: orderInfo.productType,
        isRoblox,
        isValorant,
        isFreeFire,
        totalUC
      });
      
      localStorage.setItem('credit_card_order_info', JSON.stringify(orderInfo));
      
      // Redirect to credit card payment page
      navigate(`/pay/card?paramsToken=${paramsToken}`);
    } else if (selectedMethod === 'payfast') {
      // PayFast (GoPayFast) for Pakistan
      handleGoPayFastSubmit();
    } else if (selectedMethod === 'binance') {
      // Show Binance crypto payment section inline
      setShowCryptoPayment(true);
    }
  };

  if (!selectedPackage) return null;

  const totalUC = selectedPackage.baseAmount + selectedPackage.bonusAmount;
  const binanceDiscount = 10;
  const discountedPrice = Math.round(selectedPackage.price * (1 - binanceDiscount / 100));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full h-full max-w-none max-h-none md:w-[95vw] md:h-auto md:max-w-[1100px] md:max-h-[95vh] bg-[#14192b] border-none md:border md:border-[#232942] text-white p-0 overflow-hidden rounded-none md:rounded-xl flex flex-col [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Checkout</DialogTitle>
          </VisuallyHidden>
          
          {/* Blue Spotlight Effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(85% 60% at 0% 0%, #2F6FE4 0%, rgba(47, 111, 228, 0.45) 40%, transparent 85%)',
              opacity: 0.85
            }}
          ></div>
          
          <div className={`relative z-10 flex flex-col h-full ${showPlayerIdModal || showCouponModal || showExtraModal ? 'brightness-50 pointer-events-none' : ''}`}>
            {/* Mobile Header */}
            <header className="flex items-center justify-between px-4 pt-5 pb-2 md:hidden">
              <MidasLogo />
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={26} strokeWidth={1.5} />
              </button>
            </header>

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center p-6 pb-4">
               <MidasLogo />
               <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">English</span>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-300">
                     <User size={18} />
                     <span className="text-sm font-medium">{isLoggedIn ? 'Account' : 'Sign in'}</span>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
               </div>
            </div>

            {/* Mobile Sticky Header - appears on scroll */}
            <div 
              className={`fixed top-0 left-0 right-0 z-50 bg-[#14192b]/95 backdrop-blur-md border-b border-[#232942] transition-all duration-300 md:hidden ${
                showStickyHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
            >
              {/* Header with Logo */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <MidasLogo />
                <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Package Summary */}
              <div className="px-4 pb-2">
                <div 
                  className="flex items-center justify-between py-2"
                  onClick={() => setShowProductDetails(!showProductDetails)}
                >
                  {isShopProduct ? (
                    <div className="flex items-center gap-2">
                      {shopProductImage && (
                        <img src={shopProductImage} alt={shopProductTitle} className="w-7 h-7 object-cover rounded-md" />
                      )}
                      <span className="text-[14px] font-bold text-white truncate max-w-[200px]">{shopProductTitle}</span>
                      <span className="text-[#8b91a0] text-[12px] ml-1">Total: 1 {shopProductLabel}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img src={isRoblox ? selectedPackage?.image : "/images/uc-small-icon.png"} alt={isRoblox ? "Robux" : "UC"} className="w-6 h-5 object-contain" />
                      <span className="text-[16px] font-bold text-white">{selectedPackage.baseAmount}</span>
                      {selectedPackage.bonusAmount > 0 && (
                        <>
                          <span className="text-[14px] font-bold text-[#ffc400]">+{selectedPackage.bonusAmount}</span>
                        </>
                      )}
                      <span className="text-[#8b91a0] text-[12px] ml-1">Total: {totalUC} {productLabel}</span>
                    </div>
                  )}
                  <div className="w-7 h-7 bg-[#252a3d] rounded-lg flex items-center justify-center border border-[#30364d]">
                    <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white transition-transform duration-200 ${showProductDetails ? 'rotate-180' : ''}`}></div>
                  </div>
                </div>
              </div>

              {/* Extra for you */}
              <div className="px-4 pb-2">
                <div 
                  onClick={() => setShowExtraModal(true)}
                  className="cursor-pointer rounded-lg flex items-center justify-between border-t border-t-[#ffffff]/10 border-b border-b-[#000000]/20 py-2 px-3 hover:brightness-110 transition-all active:scale-[0.99]"
                  style={{ 
                    background: 'linear-gradient(90deg, #de8031 0%, #3d251c 32%, #181d33 70%)' 
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Gift size={16} className="text-white fill-white" strokeWidth={1.5} />
                    <span className="text-[12px] font-medium text-white/95">{t('checkout.extraForYou', 'Extra for you')}:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-white font-medium text-[10px] mr-0.5">x20</span>
                      <VIPCoinIcon className="w-5 h-5 -mt-0.5" />
                    </div>
                    <ChevronRight size={14} className="text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Player ID Section */}
              <div className="px-4 pb-3">
                <div 
                  className="flex items-center justify-between py-2 cursor-pointer"
                  onClick={() => setShowPlayerIdModal(true)}
                >
                  {userInfo ? (
                    <>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" fill="currentColor" />
                        <span className="text-[12px] text-gray-300">
                          {isRoblox ? userInfo.name : <>{userInfo.name}<span className="text-gray-500">({userInfo.id})</span></>}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-[#3a7bfd]" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" fill="currentColor" />
                        <span className="text-[#3a7bfd] text-[12px]">{isRoblox ? 'Enter Username to purchase' : t('checkout.enterPlayerIdToPurchase', 'Enter Player ID to purchase')}</span>
                      </div>
                      <ChevronRight size={14} className="text-[#3a7bfd]" />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto pb-28 md:pb-8"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 md:px-6">
                
                {/* LEFT COLUMN */}
                <div className="flex-1">
                   
                   <h2 className="hidden md:block text-white font-bold text-[18px] uppercase tracking-wide mb-5">{t('checkout.securityPayment', 'SECURITY PAYMENT')}</h2>

                   {/* Mobile: Product Section */}
                   <div className="px-4 mt-4 mb-6 md:hidden">
                      <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center">
                            <div className={`${isPubgCar ? 'w-[70px] h-[50px]' : 'w-[56px] h-[56px]'} flex items-center justify-center shrink-0 mr-3 relative`}>
                                {/* Top-left blue glow - reduced intensity */}
                                <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-br from-[#3b82f6]/30 via-[#1e40af]/15 to-transparent rounded-full blur-lg pointer-events-none"></div>
                                {/* Icon glow background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#ffc400]/20 via-transparent to-transparent rounded-lg blur-sm"></div>
                                {isShopProduct ? (
                                  shopProductImage ? (
                                    <img src={shopProductImage} alt={shopProductTitle} className="w-full h-full object-cover rounded-lg relative z-10 drop-shadow-[0_0_8px_rgba(255,196,0,0.4)]" />
                                  ) : (
                                    <img src="/images/uc-stack-icon.png" alt={shopProductLabel} className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,196,0,0.4)]" />
                                  )
                                ) : isPubgCar ? (
                                  <img src={selectedPackage.image} alt={carName || "Car Skin"} className="w-full h-full object-contain rounded-lg relative z-10 drop-shadow-[0_0_8px_rgba(255,196,0,0.4)]" />
                                ) : isFreeFire ? (
                                  <img
                                    src={selectedPackage?.image || "/images/free-fire-diamond-icon.jpeg"}
                                    alt="Diamonds"
                                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,196,0,0.4)]"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/images/free-fire-diamond-icon.jpeg";
                                    }}
                                  />
                                ) : isRoblox ? (
                                  <img src={selectedPackage?.image} alt="Robux" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,196,0,0.4)]" />
                                ) : (
                                  <img src="/images/uc-stack-icon.png" alt="UC Stack" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,196,0,0.4)]" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                {isShopProduct ? (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[16px] font-bold text-white leading-tight truncate max-w-[200px]">{shopProductTitle}</span>
                                    </div>
                                    <span className="text-[#8b91a0] text-[11px] font-normal mt-0.5">
                                        Total: 1 {shopProductLabel}
                                    </span>
                                  </>
                                ) : isPubgCar ? (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[18px] font-bold text-white leading-none">1</span>
                                      <span className="text-[14px] font-medium text-[#ffc400] leading-none truncate max-w-[180px]">{carName}</span>
                                    </div>
                                    <span className="text-[#8b91a0] text-[11px] font-normal mt-0.5">
                                        Total: 1 Car Skin
                                    </span>
                                  </>
                                ) : isFreeFire ? (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[18px] font-bold text-white leading-none">{selectedPackage.baseAmount}</span>
                                      {selectedPackage.bonusAmount > 0 && (
                                        <>
                                          <span className="text-[14px] font-bold text-[#ffc400]">+</span>
                                          <span className="text-[18px] font-bold text-[#ffc400] leading-none">{selectedPackage.bonusAmount}</span>
                                        </>
                                      )}
                                    </div>
                                    <span className="text-[#8b91a0] text-[11px] font-normal mt-0.5">
                                        Total: {totalUC} Diamonds
                                    </span>
                                  </>
                                ) : (
                                  <>
                                     <div className="flex items-center gap-1">
                                      {isRoblox ? (
                                        <img src={selectedPackage?.image} alt="Robux" className="w-7 h-6 object-contain" />
                                      ) : (
                                        <img src="/images/uc-small-icon.png" alt="UC" className="w-7 h-6 object-contain" />
                                      )}
                                      <span className="text-[18px] font-bold text-white leading-none">{selectedPackage.baseAmount}</span>
                                      {selectedPackage.bonusAmount > 0 && (
                                        <>
                                          <span className="text-[14px] font-bold text-[#ffc400]">+</span>
                                          <span className="text-[18px] font-bold text-[#ffc400] leading-none">{selectedPackage.bonusAmount}</span>
                                        </>
                                      )}
                                    </div>
                                    <span className="text-[#8b91a0] text-[11px] font-normal mt-0.5">
                                        Total: {totalUC} {productLabel}
                                    </span>
                                  </>
                                )}
                            </div>
                          </div>
                          {!isPubgCar && (
                            <button 
                                onClick={() => setShowProductDetails(!showProductDetails)}
                                className="w-8 h-8 bg-[#252a3d] rounded-lg flex items-center justify-center border border-[#30364d] shadow-sm hover:bg-[#323852] transition-colors cursor-pointer"
                            >
                                <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white transition-transform duration-200 ${showProductDetails ? 'rotate-180' : ''}`}></div>
                            </button>
                          )}
                      </div>
                      {/* Mobile Dropdown - hide for PUBG Cars */}
                      {!isPubgCar && (
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showProductDetails ? 'max-h-[200px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
                              <div className="bg-[#1c2133] rounded-xl p-5 border border-[#232942]">
                                  <div className="flex justify-between items-center mb-4">
                                      <span className="text-[#8b91a0] text-[14px]">Purchase item:</span>
                                      <div className="flex items-center gap-1.5">
                                          {isShopProduct ? (
                                            <span className="text-white font-medium text-[14px] truncate max-w-[180px]">{shopProductTitle}</span>
                                          ) : isFreeFire ? (
                                            <>
                                              <img src="/images/free-fire-diamond-icon.jpeg" alt="Diamonds" className="w-6 h-6 object-contain" />
                                              <span className="text-white font-bold text-[18px] tracking-wide">{selectedPackage.baseAmount}</span>
                                            </>
                                          ) : isRoblox ? (
                                            <>
                                              <img src={selectedPackage?.image} alt="Robux" className="w-6 h-6 object-contain" />
                                              <span className="text-white font-bold text-[18px] tracking-wide">{selectedPackage.baseAmount}</span>
                                            </>
                                          ) : (
                                            <>
                                              <img src="/images/uc-small-icon.png" alt="UC" className="w-6 h-5 object-contain" />
                                              <span className="text-white font-bold text-[18px] tracking-wide">{selectedPackage.baseAmount}</span>
                                            </>
                                          )}
                                      </div>
                                  </div>
                                  <div className="h-[1px] bg-[#2a304a] w-full mb-4"></div>
                                  <div className="flex justify-between items-center">
                                      <span className="text-white text-[14px]">Total:</span>
                                      <div className="flex items-center gap-1.5">
                                          {isShopProduct ? (
                                            <span className="text-white font-bold text-[16px]">1 {shopProductLabel}</span>
                                          ) : isFreeFire ? (
                                            <>
                                              <img src="/images/free-fire-diamond-icon.jpeg" alt="Diamonds" className="w-6 h-6 object-contain" />
                                              <span className="text-white font-bold text-[18px] tracking-wide">{totalUC}</span>
                                            </>
                                          ) : isRoblox ? (
                                            <>
                                              <img src={selectedPackage?.image} alt="Robux" className="w-6 h-6 object-contain" />
                                              <span className="text-white font-bold text-[18px] tracking-wide">{totalUC}</span>
                                            </>
                                          ) : (
                                            <>
                                              <img src="/images/uc-small-icon.png" alt="UC" className="w-6 h-5 object-contain" />
                                              <span className="text-white font-bold text-[18px] tracking-wide">{totalUC}</span>
                                            </>
                                          )}
                                      </div>
                                  </div>
                              </div>
                        </div>
                      )}
                   </div>

                   {/* Mobile: Extra Section */}
                   <div className="px-4 mb-4 md:hidden">
                      <div 
                        onClick={() => setShowExtraModal(true)}
                        className="cursor-pointer rounded-xl flex items-center justify-between border-t border-t-[#ffffff]/10 border-b border-b-[#000000]/20 shadow-md py-2 px-3 hover:brightness-110 transition-all active:scale-[0.99]"
                        style={{ 
                          background: 'linear-gradient(90deg, #de8031 0%, #3d251c 32%, #181d33 70%)' 
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Gift size={18} className="text-white fill-white" strokeWidth={1.5} />
                          <span className="text-[13px] font-medium text-white/95 tracking-wide">{t('checkout.extraForYou', 'Extra for you')}:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-white font-medium text-[10px] mr-0.5">x20</span>
                            <VIPCoinIcon className="w-6 h-6 -mt-0.5" />
                          </div>
                          <ChevronRight size={16} className="text-gray-500" />
                        </div>
                      </div>
                   </div>

                   {/* Player ID & Coupon Section */}
                   <div className="px-4 mb-6 md:px-0">
                      <div className="bg-[#1c2133] rounded-xl border border-[#232942] overflow-hidden">
                        
                        {/* Row 1: Player ID */}
                        <div 
                          className="flex items-center justify-between p-4 active:bg-[#252a3d] transition-colors cursor-pointer hover:bg-[#252a3d]"
                          onClick={() => setShowPlayerIdModal(true)}
                        >
                          {userInfo ? (
                            <>
                               <div className="flex items-center gap-3">
                                <User size={18} className="text-gray-400" fill="currentColor" />
                                <span className="text-[14px] text-gray-300 font-medium">{isRoblox ? 'Username' : t('checkout.playerId', { defaultValue: 'Player ID' })}:</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-white text-[13px] font-medium">
                                    {isRoblox ? userInfo.name : <>{userInfo.name}<span className="text-gray-400">({userInfo.id})</span></>}
                                </span>
                                <ChevronRight size={16} className="text-[#3a7bfd]" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <User size={18} className="text-gray-400" fill="currentColor" />
                                <span className="text-[13px] text-gray-400 font-medium">{isRoblox ? 'Username' : t('checkout.playerId', { defaultValue: 'Player ID' })}:</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[#3a7bfd] text-[13px] hover:underline">{isRoblox ? 'Enter Username to purchase' : t('checkout.enterPlayerIdToPurchase', { defaultValue: 'Enter Player ID to purchase' })}</span>
                                <ChevronRight size={16} className="text-[#3a7bfd]" />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="h-[1px] bg-[#2a304a] mx-4"></div>

                        {/* Row 2: Coupon */}
                        <div 
                          className="flex items-center justify-between p-4 active:bg-[#252a3d] transition-colors cursor-pointer hover:bg-[#252a3d]"
                          onClick={() => setShowCouponModal(true)}
                        >
                          <div className="flex items-center gap-3">
                            <Ticket size={18} className="text-gray-400" />
                            <span className="text-[13px] text-gray-400 font-medium">{t('checkout.coupon', { defaultValue: 'Coupon' })}:</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-[13px]">{t('checkout.noAvailableCoupon', { defaultValue: 'No Available Coupon' })}</span>
                            <ChevronRight size={16} className="text-gray-500" />
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Section Header */}
                   <div className="px-4 flex items-center gap-2 mb-3 md:px-0 md:mt-8">
                      <span className="text-white font-bold text-[13px] md:text-[15px] tracking-wide uppercase">{t('checkout.selectPaymentChannels', { defaultValue: 'Select Payment Channels' })}</span>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                          <path d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0d101e" />
                      </svg>
                   </div>

                   {/* Payment Methods */}
                   <div className="px-4 space-y-3 md:px-0">
                      {/* Credit Card / Global Payment */}
                      <div 
                        onClick={() => setSelectedMethod('card')}
                        className={`relative rounded-xl p-4 pt-6 transition-all duration-200 border-[1.5px] overflow-hidden cursor-pointer ${
                          selectedMethod === 'card' 
                            ? 'bg-[#151a2e] border-[#307bf5]' 
                            : 'bg-[#1c2133] border-transparent hover:bg-[#252a3d]'
                        }`}
                      >
                        <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EAA07E] to-[#C07040] text-white text-[11px] font-medium px-2 py-[2px] rounded-br-lg z-10 flex items-center gap-1 shadow-sm">
                            <span className="font-serif italic font-bold text-[#6D3418] text-[12px] leading-none">V</span>
                            <span className="text-white/95 tracking-wide text-[11px]">{t('checkout.vipExtraPoints', 'VIP Extra Points')}</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-[58px] h-[40px] flex items-center justify-center">
                              <img 
                                src="/images/credit-card-icon.png" 
                                alt="Credit Card" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                <div className="text-[14px] font-normal text-white leading-tight">
                                  <span className="md:hidden">Credit/ Debit/<br/>Prepaid Card</span>
                                  <span className="hidden md:inline">Credit/ Debit/ Prepaid<br/>Card</span>
                                </div>
                              </div>
                              
                              <div className="relative inline-flex items-center h-[20px] rounded-[4px] overflow-hidden pr-2 mt-1.5">
                                  <div 
                                    className="absolute inset-0" 
                                    style={{ 
                                      background: 'linear-gradient(115deg, #FFB74D 0%, #F97316 22%, #2b2f42 22.5%)' 
                                    }} 
                                  />
                                  <div className="relative z-10 flex items-center whitespace-nowrap">
                                    <div className="w-[26px] flex justify-center">
                                        <VIPCoinIcon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] text-[#e2e8f0] font-medium tracking-wide ml-0.5">2 x VIP Points</span>
                                  </div>
                                </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <div className="md:hidden mb-1 flex justify-end">
                              <CardPaymentIcons />
                            </div>
                            <div className="hidden md:flex md:mb-1">
                              <CardPaymentIcons />
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[#F0B90B] font-bold text-sm">
                                {formatPrice(selectedPackage.price)}
                              </span>
                              {selectedPackage.originalPrice && selectedPackage.originalPrice > selectedPackage.price && (
                                <span className="text-gray-500 text-xs line-through">
                                  {formatPrice(selectedPackage.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PayFast - Only for Pakistan */}
                      {isPakistan && (
                        <div className="space-y-0">
                          <div 
                            onClick={() => setSelectedMethod('payfast')}
                            className={`relative flex items-center gap-3 p-4 cursor-pointer border-[1.5px] overflow-hidden hover:bg-[#252a3d] ${
                              selectedMethod === 'payfast' 
                                ? 'bg-[#151a2e] border-[#307bf5]' 
                                : 'bg-[#1c2133] border-[#1c2133]'
                            } ${selectedMethod === 'payfast' && !isLoggedIn ? 'rounded-t-xl rounded-b-none border-b-0' : 'rounded-xl'}`}
                          >
                            <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EAA07E] to-[#C07040] text-white text-[11px] font-medium px-2 py-[2px] rounded-br-lg z-10 flex items-center gap-1 shadow-sm">
                                <span className="font-serif italic font-bold text-[#6D3418] text-[12px] leading-none">V</span>
                                <span className="text-white/95 tracking-wide text-[11px]">{t('checkout.vipExtraPoints', 'VIP Extra Points')}</span>
                            </div>

                            <div className="mt-4 flex items-center justify-between w-full">
                                <img 
                                  src="/images/pk-payment-methods.png" 
                                  alt="Payment Methods" 
                                  className="h-7 w-auto object-contain"
                                />
                                <div className="flex flex-col items-end">
                                  <span className="text-[#F0B90B] font-bold text-sm">
                                    {selectedPackage.price.toLocaleString()} PKR
                                  </span>
                                  {selectedPackage.originalPrice && selectedPackage.originalPrice > selectedPackage.price && (
                                    <span className="text-gray-500 text-xs line-through">
                                      {selectedPackage.originalPrice.toLocaleString()} PKR
                                    </span>
                                  )}
                                </div>
                            </div>
                          </div>
                          
                          {/* Quick Email Checkout for non-logged PK users */}
                          {selectedMethod === 'payfast' && !isLoggedIn && (
                            <div className="bg-[#151a2e] border-[1.5px] border-t-0 border-[#307bf5] rounded-b-xl p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg 
                                    className="w-4 h-4 text-[#3a7bfd]" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                    />
                                  </svg>
                                  <span className="text-[12px] text-gray-300 font-medium">
                                    Enter your email for order updates
                                  </span>
                                </div>
                                
                                <div className="relative">
                                  <input 
                                    type="email"
                                    placeholder="your@email.com"
                                    value={quickCheckoutEmail}
                                    onChange={handleQuickEmailChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`w-full bg-[#1c2133] border ${
                                      quickCheckoutEmailError 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : 'border-[#2a3042] focus:border-[#3a7bfd]'
                                    } rounded-lg px-4 py-3 text-white text-[13px] placeholder-gray-500 outline-none transition-colors`}
                                    autoComplete="email"
                                  />
                                  {quickCheckoutEmail && isValidEmail(quickCheckoutEmail) && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                
                                {quickCheckoutEmailError && (
                                  <p className="text-red-400 text-[11px] mt-1">{quickCheckoutEmailError}</p>
                                )}
                                
                                <p className="text-gray-500 text-[10px] leading-tight">
                                  We'll send your order confirmation and UC delivery status to this email
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Binance Pay */}
                      <div className="space-y-0">
                        <div 
                          onClick={() => {
                            setSelectedMethod('binance');
                            // If already selected, toggle crypto payment visibility
                            if (selectedMethod === 'binance') {
                              setShowCryptoPayment(!showCryptoPayment);
                            }
                          }}
                          className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer border-[1.5px] overflow-hidden hover:bg-[#252a3d] ${
                            selectedMethod === 'binance' ? 'bg-[#151a2e] border-[#307bf5]' : 'bg-[#1c2133] border-[#1c2133]'
                          } ${showCryptoPayment && selectedMethod === 'binance' ? 'rounded-b-none border-b-0' : ''}`}
                        >
                          <div className="absolute top-0 left-0 bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] text-black text-[11px] font-medium px-2 py-[2px] rounded-br-lg z-10 flex items-center gap-1 shadow-sm">
                              <span className="font-bold text-[11px]">10% OFF</span>
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                              <img 
                                src={binanceLogoFull} 
                                alt="Binance" 
                                className="h-6 w-auto"
                              />
                          </div>
                          <div className="text-right mt-4">
                            <span className="text-[#F0B90B] font-bold text-sm">
                              {formatPrice(discountedPrice)}
                            </span>
                            <span className="text-gray-500 text-xs line-through ml-2">
                              {formatPrice(selectedPackage.price)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Binance Crypto Payment Details - Show below when Binance selected */}
                        {showCryptoPayment && selectedMethod === 'binance' && userInfo && (
                          <div className="bg-[#151a2e] border-[1.5px] border-t-0 border-[#307bf5] rounded-b-xl p-4 max-h-[400px] overflow-y-auto">
                            <BinanceCryptoPayment
                              amount={convertPkrToAnyCurrency(selectedPackage.price, 'USD')}
                              discountedAmount={convertPkrToAnyCurrency(discountedPrice, 'USD')}
                              orderId={`order_${Date.now()}_${selectedPackage.id}`}
                              productName={getItemName(selectedPackage)}
                              onPaymentConfirmed={handleCryptoPaymentConfirmed}
                              onCancel={() => setShowCryptoPayment(false)}
                            />
                          </div>
                        )}
                      </div>
                   </div>
                </div>

                {/* RIGHT COLUMN (Order Summary) - Desktop Only */}
                <div className="hidden md:block w-[400px] shrink-0">
                   <div className="bg-[#1c2133] rounded-xl border border-[#232942] p-6 shadow-xl sticky top-8">
                      
                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                         <h2 className="text-white font-bold text-[16px] uppercase tracking-wide">{t('checkout.orderSummary', 'ORDER SUMMARY')}</h2>
                      </div>

                      {/* Product Box */}
                      <div 
                        className={`bg-[#14182b] border border-[#262c40] rounded-xl p-4 mb-4 flex items-center justify-between ${isPubgCar ? '' : 'cursor-pointer hover:bg-[#1a2035]'}`}
                        onClick={() => !isPubgCar && setShowPackageDropdown(!showPackageDropdown)}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`${isPubgCar ? 'w-[70px] h-[50px]' : 'w-[56px] h-[56px]'} flex items-center justify-center shrink-0 relative`}>
                               <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-[#3b82f6]/25 via-[#1e40af]/10 to-transparent rounded-full blur-lg pointer-events-none"></div>
                               <div className="absolute inset-0 bg-gradient-to-br from-[#ffc400]/15 via-transparent to-transparent rounded-lg blur-sm"></div>
                               {isShopProduct ? (
                                 shopProductImage ? (
                                   <img src={shopProductImage} alt={shopProductTitle} className="w-full h-full object-cover rounded-lg relative z-10 drop-shadow-[0_0_10px_rgba(255,196,0,0.35)]" />
                                 ) : (
                                   <img src="/images/uc-stack-icon.png" alt={shopProductLabel} className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,196,0,0.35)]" />
                                 )
                               ) : isPubgCar ? (
                                 <img
                                   src={selectedPackage.image}
                                   alt={carName || "Car Skin"}
                                   className="w-full h-full object-contain rounded-lg relative z-10 drop-shadow-[0_0_10px_rgba(255,196,0,0.35)]"
                                 />
                                ) : isFreeFire ? (
                                  <img
                                    src={selectedPackage?.image || "/images/free-fire-diamond-icon.jpeg"}
                                    alt="Diamonds"
                                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,196,0,0.35)]"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/images/free-fire-diamond-icon.jpeg";
                                    }}
                                  />
                                ) : (
                                 <img
                                   src="/images/uc-stack-icon.png"
                                   alt="UC Stack"
                                   className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,196,0,0.35)]"
                                 />
                               )}
                            </div>
                            <div className="flex flex-col">
                               {isShopProduct ? (
                                 <>
                                   <div className="flex items-center gap-2">
                                     <span className="text-white font-bold text-base truncate max-w-[220px]">{shopProductTitle}</span>
                                   </div>
                                   <span className="text-[#8b91a0] text-xs">Total: 1 {shopProductLabel}</span>
                                 </>
                               ) : isPubgCar ? (
                                 <>
                                   <div className="flex items-center gap-2">
                                     <span className="text-white font-bold text-lg">1</span>
                                     <span className="text-[14px] font-medium text-[#ffc400] truncate max-w-[200px]">{carName}</span>
                                   </div>
                                   <span className="text-[#8b91a0] text-xs">Total: 1 Car Skin</span>
                                 </>
                               ) : isFreeFire ? (
                                 <>
                                   <div className="flex items-center gap-1">
                                       <span className="text-white font-bold text-lg">{selectedPackage.baseAmount}</span>
                                       {selectedPackage.bonusAmount > 0 && (
                                         <span className="text-midasbuy-gold font-bold">+{selectedPackage.bonusAmount}</span>
                                       )}
                                   </div>
                                   <span className="text-[#8b91a0] text-xs">Total: {totalUC} Diamonds</span>
                                 </>
                               ) : (
                                 <>
                                   <div className="flex items-center gap-1">
                                       <img src="/images/uc-small-icon.png" alt="UC" className="w-7 h-6 object-contain" />
                                       <span className="text-white font-bold text-lg">{selectedPackage.baseAmount}</span>
                                       {selectedPackage.bonusAmount > 0 && (
                                         <span className="text-midasbuy-gold font-bold">+{selectedPackage.bonusAmount}</span>
                                       )}
                                   </div>
                                   <span className="text-[#8b91a0] text-xs">Total: {totalUC} {productLabel}</span>
                                 </>
                               )}
                            </div>
                         </div>
                         {!isPubgCar && !isShopProduct && (
                           <div className="bg-[#24293d] w-6 h-6 rounded flex items-center justify-center">
                               <ChevronDown className={`w-4 h-4 text-white transition-transform ${showPackageDropdown ? 'rotate-180' : ''}`} />
                           </div>
                         )}
                      </div>

                      {/* Package Dropdown - hide for PUBG Cars and shop products */}
                      {!isPubgCar && !isShopProduct && showPackageDropdown && (
                        <div className="bg-[#14182b] border border-[#262c40] rounded-xl mb-4 max-h-48 overflow-y-auto">
                          {ucPackages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 ${selectedPackage.id === pkg.id ? 'bg-[#307bf5]/20' : ''}`}
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setShowPackageDropdown(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {!isFreeFire && <img src="/images/uc-small-icon.png" alt="UC" className="w-6 h-5 object-contain" />}
                                <span className="text-white">{pkg.baseAmount}</span>
                                <span className="text-midasbuy-gold">+{pkg.bonusAmount}</span>
                              </div>
                              <span className="text-white">
                                {formatPrice(pkg.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                       {/* Breakdown */}
                       <div className="space-y-3 mb-6">
                           <div className="flex justify-between items-center">
                               <span className="text-[#8b91a0] text-sm">Purchase item:</span>
                               {isShopProduct ? (
                                 <span className="text-white font-medium text-right truncate max-w-[220px]">{shopProductTitle}</span>
                               ) : isPubgCar ? (
                                 <span className="text-white font-medium">1 Car Skin</span>
                               ) : isFreeFire ? (
                                 <div className="flex items-center gap-1.5">
                                   <img src="/images/free-fire-diamond-icon.jpeg" alt="Diamonds" className="w-6 h-6 object-contain" />
                                   <span className="text-white font-medium">{selectedPackage.baseAmount}</span>
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-1.5">
                                     <img src="/images/uc-small-icon.png" alt="UC" className="w-7 h-6 object-contain" />
                                     <span className="text-white font-medium">{selectedPackage.baseAmount}</span>
                                 </div>
                               )}
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-[#8b91a0] text-sm">Total:</span>
                               {isShopProduct ? (
                                 <span className="text-white font-medium">1 {shopProductLabel}</span>
                               ) : isPubgCar ? (
                                 <span className="text-white font-medium">1 Car Skin</span>
                               ) : isFreeFire ? (
                                 <div className="flex items-center gap-1.5">
                                   <img src="/images/free-fire-diamond-icon.jpeg" alt="Diamonds" className="w-6 h-6 object-contain" />
                                   <span className="text-white font-medium">{totalUC} Diamonds</span>
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-1.5">
                                     <img src="/images/uc-small-icon.png" alt="UC" className="w-7 h-6 object-contain" />
                                     <span className="text-white font-medium">{totalUC}</span>
                                 </div>
                               )}
                           </div>
                       </div>

                      <div className="h-[1px] bg-[#2a304a] w-full mb-6"></div>

                      {/* Reward Section */}
                      <div className="mb-8">
                         <h3 className="text-white text-sm font-medium mb-3">Purchase Reward</h3>
                         <div className="flex justify-between items-center">
                             <span className="text-[#8b91a0] text-sm">Midasbuy VIP Points:</span>
                             <div className="flex items-center gap-2">
                                 <VIPCoinIcon className="w-5 h-5" />
                                 <span className="text-[#3a7bfd] font-bold text-sm">x20</span>
                             </div>
                         </div>
                      </div>

                      {/* Bottom Section */}
                      <div>
                         <div className="flex justify-between items-end mb-4">
                            <span className="text-white text-base">Total:</span>
                            <div className="text-right">
                               <span className="text-2xl font-bold text-white block leading-none mb-1">
                                 {formatPrice(selectedPackage.price)}
                               </span>
                               {selectedPackage.originalPrice > selectedPackage.price && (
                                 <span className="text-xs text-gray-500 line-through">
                                   {formatPrice(selectedPackage.originalPrice)}
                                 </span>
                               )}
                            </div>
                         </div>

                         {/* Desktop Button */}
                          <button 
                            onClick={() => {
                              // PK Quick checkout with email for PayFast
                              if (isPakistan && selectedMethod === 'payfast' && !isLoggedIn) {
                                if (!userInfo) {
                                  setShowPlayerIdModal(true);
                                } else if (quickCheckoutEmail && isValidEmail(quickCheckoutEmail)) {
                                  handleQuickPayWithEmail();
                                } else {
                                  setQuickCheckoutEmailError('Please enter your email above');
                                }
                              } else if (!isLoggedIn) {
                                openAuthModal();
                              } else if (!userInfo) {
                               setShowPlayerIdModal(true);
                             } else {
                               handlePayNow();
                             }
                           }}
                           disabled={isPaymentLoading}
                           className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                         >
                           {isPaymentLoading 
                             ? 'Processing...' 
                             : (isPakistan && selectedMethod === 'payfast' && !isLoggedIn)
                               ? (!userInfo ? 'Enter Player ID' : 'Pay Now')
                               : (!isLoggedIn ? 'Login Midasbuy' : !userInfo ? 'Enter Player ID' : 'Pay Now')
                           }
                         </button>
                      </div>

                   </div>
                </div>
              </div>
            </div>

            {/* Mobile Fixed Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-[#101426] border-t border-[#1c2133] px-4 py-3 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] md:hidden">
               <div className="max-w-md mx-auto flex items-center justify-between">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2">
                        <span className="text-[22px] font-bold text-white tracking-tight leading-none">
                          {formatPrice(selectedPackage.price)}
                        </span>
                        <div 
                          className="bg-[#24293d] w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors hover:bg-[#2f354d]"
                          onClick={() => setShowPriceDetails(!showPriceDetails)}
                        >
                           <ChevronDown 
                            size={14} 
                            className={`text-gray-400 transition-transform duration-300 ${!showPriceDetails ? 'rotate-180' : ''}`} 
                            strokeWidth={3} 
                           />
                        </div>
                     </div>
                     {selectedPackage.originalPrice > selectedPackage.price && (
                       <span className="text-xs text-gray-500 line-through mt-1">
                         {formatPrice(selectedPackage.originalPrice)}
                       </span>
                     )}
                  </div>
                  
                   <button 
                     onClick={() => {
                       // PK Quick checkout with email for PayFast
                       if (isPakistan && selectedMethod === 'payfast' && !isLoggedIn) {
                         if (!userInfo) {
                           setShowPlayerIdModal(true);
                         } else if (quickCheckoutEmail && isValidEmail(quickCheckoutEmail)) {
                           handleQuickPayWithEmail();
                         } else {
                           setQuickCheckoutEmailError('Please enter your email above');
                         }
                       } else if (!isLoggedIn) {
                         openAuthModal();
                       } else if (!userInfo) {
                        setShowPlayerIdModal(true);
                      } else {
                        handlePayNow();
                      }
                    }}
                    disabled={isPaymentLoading}
                    className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold h-10 px-6 rounded text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-[140px] disabled:opacity-50"
                  >
                    {isPaymentLoading 
                      ? 'Processing...' 
                      : (isPakistan && selectedMethod === 'payfast' && !isLoggedIn)
                        ? (!userInfo ? 'Enter Player ID' : 'Pay Now')
                        : (!isLoggedIn ? 'Login Midasbuy' : !userInfo ? 'Enter Player ID' : 'Pay Now')
                    }
                  </button>
               </div>
            </div>
          </div>

          {/* Price Details Panel - Mobile */}
          {showPriceDetails && (
            <>
              <div 
                className="fixed inset-0 bg-black/80 z-30 transition-opacity md:hidden"
                onClick={() => setShowPriceDetails(false)}
              />
              <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center md:hidden">
                <div className="w-full max-w-md bg-[#101426] rounded-t-2xl px-4 pt-4 pb-28 border-t border-[#232942] animate-in slide-in-from-bottom duration-300 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold text-base tracking-wide">PRICE DETAILS</h3>
                    <button onClick={() => setShowPriceDetails(false)} className="text-gray-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Original Price:</span>
                      <span className="text-white font-medium">
                        {formatPrice(selectedPackage.originalPrice)}
                      </span>
                    </div>
                    {selectedPackage.originalPrice > selectedPackage.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#eeb337]">Discount:</span>
                        <span className="text-[#eeb337] font-medium">
                          -{formatPrice(selectedPackage.originalPrice - selectedPackage.price)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-white text-base">Total:</span>
                      <span className="text-white font-bold text-lg">
                        {formatPrice(selectedPackage.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SUB-MODALS - Rendered inside DialogContent as siblings */}
          
          {/* PLAYER ID MODAL */}
          {showPlayerIdModal && (
            <div 
              className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center"
            >
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => closeSubModal(setShowPlayerIdModal)}
              />

              {/* Bottom Sheet - This is the scroll container */}
              <div 
                className="w-full max-w-md max-h-[85svh] bg-[#101426] rounded-t-2xl md:rounded-2xl relative z-[61] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden"
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-[#101426] px-5 py-5 flex justify-between items-center shrink-0 border-b border-[#232942]">
                  <h2 className="text-white font-bold text-[15px] uppercase tracking-wide">{isRoblox ? 'ENTER YOUR ROBLOX USERNAME NOW' : t('checkout.enterPlayerIdNow', { defaultValue: 'ENTER YOUR PLAYER ID NOW' })}</h2>
                  <button 
                    onClick={() => closeSubModal(setShowPlayerIdModal)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div 
                  className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y',
                  }}
                >
                  
                  {!isLoggedIn && (
                    <div className="flex justify-between items-center mb-2.5 text-xs">
                       <span className="text-gray-200 font-normal text-[13px]">{isRoblox ? 'Username' : 'Player ID'}</span>
                       <button 
                         onClick={handleSignInClick}
                         className="text-[#3a7bfd] flex items-center gap-0.5 hover:underline text-[12px]"
                       >
                         {isRoblox ? 'Sign in to access saved Username' : 'Sign in to access saved Player ID'}
                         <ChevronRight size={14} />
                       </button>
                    </div>
                  )}

                  <div className="mb-5">
                    <div className="bg-gradient-to-r from-[#06bdfd] to-[#2d7bf8] px-4 py-2.5 rounded-t-lg">
                       <p className="text-white text-[11px] leading-tight font-medium whitespace-nowrap">
                         {isRoblox ? 'Please enter your Roblox Username you want to recharge' : 'Please select or fill in your Player ID you want to recharge'}
                       </p>
                    </div>
                    <div className="bg-[#131722] border-x-2 border-b-2 border-[#2d7bf8] rounded-b-lg overflow-hidden">
                      {isRoblox ? (
                        <div className="p-2.5">
                          <input 
                            type="text" 
                            placeholder="Enter Roblox Username"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full bg-transparent text-white/90 outline-none text-[13px] placeholder-gray-500 font-normal"
                            autoComplete="off"
                          />
                        </div>
                      ) : (
                        <>
                          <div className={`p-2.5 ${!isFreeFire ? 'border-b border-[#2d7bf8]/30' : ''}`}>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder={isFreeFire ? "Enter your Free Fire ID" : "Enter Player ID"}
                              value={tempId}
                              onChange={handlePlayerIdChange}
                              maxLength={isFreeFire ? 12 : 15}
                              className="w-full bg-transparent text-white/90 outline-none text-[13px] placeholder-gray-500 font-normal"
                              autoComplete="off"
                            />
                          </div>
                          {isFreeFire && freeFireIdError && (
                            <p className="text-red-500 text-xs px-2.5 pb-1">{freeFireIdError}</p>
                          )}
                          {!isFreeFire && (
                            <div className="p-2.5">
                              <input 
                                type="text" 
                                placeholder="Enter Username"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full bg-transparent text-white/90 outline-none text-[13px] placeholder-gray-500 font-normal"
                                autoComplete="off"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleSavePlayerInfo}
                    className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                  >
                    OK
                  </button>

                  {/* Recent Player IDs or Help Section */}
                  {isLoggedIn && recentPlayerIds.length > 0 ? (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <User size={16} className="text-white" />
                        <span className="text-white text-[13px] font-medium">Recent Player IDs</span>
                      </div>
                      <div className="space-y-2">
                        {recentPlayerIds.map((player) => (
                          <div 
                            key={player.playerId}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                              tempId === player.playerId 
                                ? 'bg-[#1c2a4a] border-[#3a7bfd]' 
                                : 'bg-[#131722] border-[#232942] hover:border-[#3a7bfd]/50'
                            }`}
                            onClick={() => handleSelectRecentPlayerId(player)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] flex items-center justify-center">
                                <User size={14} className="text-white" />
                              </div>
                              <div>
                                <p className="text-white text-[13px] font-medium">{player.username}</p>
                                <p className="text-gray-400 text-[11px]">ID: {player.playerId}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecentPlayerId(player.playerId);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <HelpCircle size={16} className="text-white" />
                        <span className="text-white text-[13px] font-medium">
                          {isRoblox ? "Couldn't find your Username ID?" : "Couldn't find your Player ID?"}
                        </span>
                      </div>

                      {isFreeFire ? (
                        <div className="space-y-6">
                          <div>
                            <p className="text-[#8b91a0] text-[13px] mb-2.5">1. Find your ID in your profile page</p>
                            <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#232942] relative bg-[#0f1222]">
                               <img 
                                 src="/assets/freefire-player-id-help.webp" 
                                 alt="Finding Player ID in Free Fire Profile" 
                                 className="w-full h-full object-cover"
                               />
                            </div>
                          </div>
                        </div>
                      ) : isRoblox ? (
                        <div className="space-y-3">
                          <p className="text-[#8b91a0] text-[13px]">1.1. Enter the game</p>
                          <p className="text-[#8b91a0] text-[13px]">1.2. Find your Username ID</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <p className="text-[#8b91a0] text-[13px] mb-2.5">1.1. Enter the game</p>
                            <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#232942] relative bg-[#0f1222]">
                               <img 
                                 src="/images/pubg-player-id-step1.jpeg" 
                                 alt="Game Lobby - Click on your profile" 
                                 className="w-full h-full object-cover"
                               />
                            </div>
                          </div>

                          <div>
                            <p className="text-[#8b91a0] text-[13px] mb-2.5">1.2. Find your player ID</p>
                            <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#232942] relative bg-[#0f1222]">
                               <img 
                                 src="/images/pubg-player-id-step2.jpeg" 
                                 alt="Profile Page - Copy your UID" 
                                 className="w-full h-full object-cover"
                               />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* COUPON MODAL */}
          {showCouponModal && (
            <div 
              className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center"
            >
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => closeSubModal(setShowCouponModal)}
              />

              <div 
                className="w-full max-w-md max-h-[70svh] bg-[#101426] rounded-t-2xl md:rounded-2xl relative z-[61] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
              >
                
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-[#101426] flex items-center p-4 border-b border-[#1c2133] shrink-0">
                  <button 
                    onClick={() => closeSubModal(setShowCouponModal)}
                    className="text-gray-400 hover:text-white mr-3"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-white font-bold text-[15px] uppercase tracking-wide">CHOOSE COUPON</h2>
                </div>

                <div 
                  className="flex-1 overflow-y-auto overscroll-contain"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y',
                  }}
                >
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative mb-4">
                       <Ticket 
                          size={80} 
                          strokeWidth={1}
                          className="text-[#2b3046] fill-[#1c2133] transform rotate-12"
                       />
                       <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#2b3046] font-bold text-2xl rotate-12">%</span>
                    </div>
                    <p className="text-[#8b91a0] font-medium text-[15px]">No Available Coupon</p>
                  </div>

                  <div className="p-4">
                     <div className="bg-[#131722] rounded-lg p-4 mb-4 border border-[#1c2133]">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white">?</span>
                           </div>
                           <h3 className="text-white font-bold text-[14px]">Didn't see the coupon?</h3>
                        </div>
                        <p className="text-[#8b91a0] text-[13px] leading-snug mb-2.5">
                           We suggest that you can link your player ID to view your coupons.
                        </p>
                        <button className="text-[#3a7bfd] text-[13px] flex items-center hover:underline">
                           Link player ID to view <ChevronRight size={14} />
                        </button>
                     </div>

                     <button 
                       onClick={() => closeSubModal(setShowCouponModal)}
                       className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                     >
                        OK
                     </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* EXTRA FOR YOU MODAL */}
          {showExtraModal && (
            <div 
              className="absolute inset-0 z-[60] flex items-end justify-center"
            >
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-200"
                onClick={() => closeSubModal(setShowExtraModal)}
              />

              <div 
                className="w-full max-w-md bg-[#101426] rounded-t-2xl md:rounded-2xl relative z-[61] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 pb-8"
              >
                
                <div className="px-5 py-4 flex justify-between items-center border-b border-[#232942]">
                  <h2 className="text-white font-bold text-[15px] uppercase tracking-wide">EXTRA FOR YOU</h2>
                  <button 
                    onClick={() => closeSubModal(setShowExtraModal)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="mb-6">
                    <h3 className="text-white text-[15px] font-medium">Purchase Reward</h3>
                  </div>
                  
                  <div className="flex justify-between items-center">
                     <span className="text-[#8b91a0] text-[14px]">Midasbuy VIP Points:</span>
                     <div className="flex items-center gap-2">
                         <VIPCoinIcon className="w-6 h-6" />
                         <span className="text-white font-bold text-[14px]">x20</span>
                     </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Binance Crypto Payment */}
      {showCryptoPayment && selectedPackage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md bg-[#0D1B2A] rounded-xl p-6 relative">
            <button 
              onClick={() => setShowCryptoPayment(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <BinanceCryptoPayment
              amount={selectedPackage.price}
              discountedAmount={discountedPrice}
              orderId={`order-${Date.now()}`}
              productName={`${selectedPackage.baseAmount}+${selectedPackage.bonusAmount} UC`}
              onPaymentConfirmed={handleCryptoPaymentConfirmed}
              onCancel={() => setShowCryptoPayment(false)}
            />
          </div>
        </div>
      )}

      {/* Guest Email Dialog */}
      <GuestEmailDialog
        open={showGuestEmailDialog}
        onOpenChange={setShowGuestEmailDialog}
        onEmailConfirmed={(userId: string, email: string) => {
          setGuestUserId(userId);
          setGuestEmail(email);
          setShowGuestEmailDialog(false);
          handleGoPayFastSubmit(userId, email);
        }}
      />
    </>
  );
};

export default MidasCheckoutModal;

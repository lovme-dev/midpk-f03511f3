import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, Globe, ChevronDown, Flag, Search, Download, Ticket, SlidersHorizontal, Settings, CreditCard, Gift, HelpCircle, Clapperboard, User, LogOut, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/use-mobile";
import { triggerCurrencyChangeEvent } from "@/utils/currencyUtils";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import OptimizedImage from "./OptimizedImage";
import NotificationDropdown from "./NotificationDropdown";
import { useIPDetection } from "@/hooks/useIPDetection";
import usePWAInstall from "@/hooks/usePWAInstall";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { getFlag } from "@/utils/countryFlags";
import { getLanguageForCountry, isRTLLanguage } from "@/utils/countryLanguageMapping";
import trustpilotStars from "@/assets/trustpilot-stars.webp";
import trustpilotLogo from "@/assets/trustpilot-logo.webp";
import installAppIcon from "@/assets/install-app-icon.jpeg";
import FullPageCountrySelector from "./FullPageCountrySelector";


interface HeaderProps {
  onLogout: () => void;
  showNavigation?: boolean;
  activeSection?: string;
  onNavigationClick?: (sectionId: string) => void;
}

const countries = [
  // North America
  { name: "United States", code: "us", region: "North America", currency: "USD" },
  { name: "Canada", code: "ca", region: "North America", currency: "CAD" },
  { name: "Mexico", code: "mx", region: "North America", currency: "MXN" },
  
  // Latin America & Caribbean
  { name: "Argentina", code: "ar", region: "Latin America & Caribbean", currency: "ARS" },
  { name: "Bolivia", code: "bo", region: "Latin America & Caribbean", currency: "BOB" },
  { name: "Brazil", code: "br", region: "Latin America & Caribbean", currency: "BRL" },
  { name: "Chile", code: "cl", region: "Latin America & Caribbean", currency: "CLP" },
  { name: "Colombia", code: "co", region: "Latin America & Caribbean", currency: "COP" },
  { name: "Costa Rica", code: "cr", region: "Latin America & Caribbean", currency: "CRC" },
  { name: "Cuba", code: "cu", region: "Latin America & Caribbean", currency: "CUP" },
  { name: "Dominican Republic", code: "do", region: "Latin America & Caribbean", currency: "DOP" },
  { name: "Ecuador", code: "ec", region: "Latin America & Caribbean", currency: "USD" },
  { name: "El Salvador", code: "sv", region: "Latin America & Caribbean", currency: "USD" },
  { name: "Guatemala", code: "gt", region: "Latin America & Caribbean", currency: "GTQ" },
  { name: "Haiti", code: "ht", region: "Latin America & Caribbean", currency: "HTG" },
  { name: "Honduras", code: "hn", region: "Latin America & Caribbean", currency: "HNL" },
  { name: "Jamaica", code: "jm", region: "Latin America & Caribbean", currency: "JMD" },
  { name: "Nicaragua", code: "ni", region: "Latin America & Caribbean", currency: "NIO" },
  { name: "Panama", code: "pa", region: "Latin America & Caribbean", currency: "PAB" },
  { name: "Paraguay", code: "py", region: "Latin America & Caribbean", currency: "PYG" },
  { name: "Peru", code: "pe", region: "Latin America & Caribbean", currency: "PEN" },
  { name: "Uruguay", code: "uy", region: "Latin America & Caribbean", currency: "UYU" },
  { name: "Venezuela", code: "ve", region: "Latin America & Caribbean", currency: "VES" },
  { name: "Bahamas", code: "bs", region: "Latin America & Caribbean", currency: "BSD" },
  { name: "Barbados", code: "bb", region: "Latin America & Caribbean", currency: "BBD" },
  { name: "Trinidad and Tobago", code: "tt", region: "Latin America & Caribbean", currency: "TTD" },
  
  // Europe
  { name: "United Kingdom", code: "gb", region: "Europe", currency: "GBP" },
  { name: "France", code: "fr", region: "Europe", currency: "EUR" },
  { name: "Germany", code: "de", region: "Europe", currency: "EUR" },
  { name: "Italy", code: "it", region: "Europe", currency: "EUR" },
  { name: "Spain", code: "es", region: "Europe", currency: "EUR" },
  { name: "Portugal", code: "pt", region: "Europe", currency: "EUR" },
  { name: "Netherlands", code: "nl", region: "Europe", currency: "EUR" },
  { name: "Belgium", code: "be", region: "Europe", currency: "EUR" },
  { name: "Switzerland", code: "ch", region: "Europe", currency: "CHF" },
  { name: "Austria", code: "at", region: "Europe", currency: "EUR" },
  { name: "Greece", code: "gr", region: "Europe", currency: "EUR" },
  { name: "Poland", code: "pl", region: "Europe", currency: "PLN" },
  { name: "Sweden", code: "se", region: "Europe", currency: "SEK" },
  { name: "Norway", code: "no", region: "Europe", currency: "NOK" },
  { name: "Denmark", code: "dk", region: "Europe", currency: "DKK" },
  { name: "Finland", code: "fi", region: "Europe", currency: "EUR" },
  { name: "Ireland", code: "ie", region: "Europe", currency: "EUR" },
  { name: "Czech Republic", code: "cz", region: "Europe", currency: "CZK" },
  { name: "Hungary", code: "hu", region: "Europe", currency: "HUF" },
  { name: "Romania", code: "ro", region: "Europe", currency: "RON" },
  { name: "Bulgaria", code: "bg", region: "Europe", currency: "BGN" },
  { name: "Croatia", code: "hr", region: "Europe", currency: "EUR" },
  { name: "Slovenia", code: "si", region: "Europe", currency: "EUR" },
  { name: "Slovakia", code: "sk", region: "Europe", currency: "EUR" },
  { name: "Estonia", code: "ee", region: "Europe", currency: "EUR" },
  { name: "Latvia", code: "lv", region: "Europe", currency: "EUR" },
  { name: "Lithuania", code: "lt", region: "Europe", currency: "EUR" },
  { name: "Iceland", code: "is", region: "Europe", currency: "ISK" },
  { name: "Luxembourg", code: "lu", region: "Europe", currency: "EUR" },
  { name: "Malta", code: "mt", region: "Europe", currency: "EUR" },
  { name: "Cyprus", code: "cy", region: "Europe", currency: "EUR" },
  { name: "Albania", code: "al", region: "Europe", currency: "ALL" },
  { name: "Serbia", code: "rs", region: "Europe", currency: "RSD" },
  { name: "Montenegro", code: "me", region: "Europe", currency: "EUR" },
  { name: "North Macedonia", code: "mk", region: "Europe", currency: "MKD" },
  { name: "Bosnia and Herzegovina", code: "ba", region: "Europe", currency: "BAM" },
  { name: "Ukraine", code: "ua", region: "Europe", currency: "UAH" },
  { name: "Belarus", code: "by", region: "Europe", currency: "BYN" },
  { name: "Moldova", code: "md", region: "Europe", currency: "MDL" },
  { name: "Russia", code: "ru", region: "Europe", currency: "RUB" },
  { name: "Türkiye", code: "tr", region: "Europe", currency: "TRY" },
  
  // Asia
  { name: "China", code: "cn", region: "Asia", currency: "CNY" },
  { name: "Japan", code: "jp", region: "Asia", currency: "JPY" },
  { name: "South Korea", code: "kr", region: "Asia", currency: "KRW" },
  { name: "North Korea", code: "kp", region: "Asia", currency: "KPW" },
  { name: "India", code: "in", region: "Asia", currency: "INR" },
  { name: "Pakistan", code: "pk", region: "Asia", currency: "PKR" },
  { name: "Bangladesh", code: "bd", region: "Asia", currency: "BDT" },
  { name: "Sri Lanka", code: "lk", region: "Asia", currency: "LKR" },
  { name: "Nepal", code: "np", region: "Asia", currency: "NPR" },
  { name: "Bhutan", code: "bt", region: "Asia", currency: "BTN" },
  { name: "Afghanistan", code: "af", region: "Asia", currency: "AFN" },
  { name: "Indonesia", code: "id", region: "Asia", currency: "IDR" },
  { name: "Malaysia", code: "my", region: "Asia", currency: "MYR" },
  { name: "Singapore", code: "sg", region: "Asia", currency: "SGD" },
  { name: "Thailand", code: "th", region: "Asia", currency: "THB" },
  { name: "Vietnam", code: "vn", region: "Asia", currency: "VND" },
  { name: "Philippines", code: "ph", region: "Asia", currency: "PHP" },
  { name: "Cambodia", code: "kh", region: "Asia", currency: "KHR" },
  { name: "Laos", code: "la", region: "Asia", currency: "LAK" },
  { name: "Myanmar (Burma)", code: "mm", region: "Asia", currency: "MMK" },
  { name: "Brunei", code: "bn", region: "Asia", currency: "BND" },
  { name: "Taiwan", code: "tw", region: "Asia", currency: "TWD" },
  { name: "Hong Kong", code: "hk", region: "Asia", currency: "HKD" },
  { name: "Macao", code: "mo", region: "Asia", currency: "MOP" },
  { name: "Mongolia", code: "mn", region: "Asia", currency: "MNT" },
  { name: "Kazakhstan", code: "kz", region: "Asia", currency: "KZT" },
  { name: "Uzbekistan", code: "uz", region: "Asia", currency: "UZS" },
  { name: "Turkmenistan", code: "tm", region: "Asia", currency: "TMT" },
  { name: "Kyrgyzstan", code: "kg", region: "Asia", currency: "KGS" },
  { name: "Tajikistan", code: "tj", region: "Asia", currency: "TJS" },
  { name: "Armenia", code: "am", region: "Asia", currency: "AMD" },
  { name: "Azerbaijan", code: "az", region: "Asia", currency: "AZN" },
  { name: "Georgia", code: "ge", region: "Asia", currency: "GEL" },
  { name: "Maldives", code: "mv", region: "Asia", currency: "MVR" },
  { name: "Timor-Leste", code: "tl", region: "Asia", currency: "USD" },
  
  // Middle East
  { name: "Saudi Arabia", code: "sa", region: "Middle East", currency: "SAR" },
  { name: "United Arab Emirates", code: "ae", region: "Middle East", currency: "AED" },
  { name: "Qatar", code: "qa", region: "Middle East", currency: "QAR" },
  { name: "Kuwait", code: "kw", region: "Middle East", currency: "KWD" },
  { name: "Bahrain", code: "bh", region: "Middle East", currency: "BHD" },
  { name: "Oman", code: "om", region: "Middle East", currency: "OMR" },
  { name: "Yemen", code: "ye", region: "Middle East", currency: "YER" },
  { name: "Iraq", code: "iq", region: "Middle East", currency: "IQD" },
  { name: "Iran", code: "ir", region: "Middle East", currency: "IRR" },
  { name: "Jordan", code: "jo", region: "Middle East", currency: "JOD" },
  { name: "Lebanon", code: "lb", region: "Middle East", currency: "LBP" },
  { name: "Syria", code: "sy", region: "Middle East", currency: "SYP" },
  { name: "Israel", code: "il", region: "Middle East", currency: "ILS" },
  { name: "Palestine", code: "ps", region: "Middle East", currency: "ILS" },
  
  // Africa
  { name: "Egypt", code: "eg", region: "Africa", currency: "EGP" },
  { name: "South Africa", code: "za", region: "Africa", currency: "ZAR" },
  { name: "Nigeria", code: "ng", region: "Africa", currency: "NGN" },
  { name: "Kenya", code: "ke", region: "Africa", currency: "KES" },
  { name: "Ethiopia", code: "et", region: "Africa", currency: "ETB" },
  { name: "Ghana", code: "gh", region: "Africa", currency: "GHS" },
  { name: "Morocco", code: "ma", region: "Africa", currency: "MAD" },
  { name: "Algeria", code: "dz", region: "Africa", currency: "DZD" },
  { name: "Tunisia", code: "tn", region: "Africa", currency: "TND" },
  { name: "Libya", code: "ly", region: "Africa", currency: "LYD" },
  { name: "Sudan", code: "sd", region: "Africa", currency: "SDG" },
  { name: "Tanzania", code: "tz", region: "Africa", currency: "TZS" },
  { name: "Uganda", code: "ug", region: "Africa", currency: "UGX" },
  { name: "Angola", code: "ao", region: "Africa", currency: "AOA" },
  { name: "Mozambique", code: "mz", region: "Africa", currency: "MZN" },
  { name: "Zambia", code: "zm", region: "Africa", currency: "ZMW" },
  { name: "Zimbabwe", code: "zw", region: "Africa", currency: "ZWL" },
  { name: "Botswana", code: "bw", region: "Africa", currency: "BWP" },
  { name: "Namibia", code: "na", region: "Africa", currency: "NAD" },
  { name: "Senegal", code: "sn", region: "Africa", currency: "XOF" },
  { name: "Ivory Coast", code: "ci", region: "Africa", currency: "XOF" },
  { name: "Cameroon", code: "cm", region: "Africa", currency: "XAF" },
  { name: "Mali", code: "ml", region: "Africa", currency: "XOF" },
  { name: "Niger", code: "ne", region: "Africa", currency: "XOF" },
  { name: "Burkina Faso", code: "bf", region: "Africa", currency: "XOF" },
  { name: "Madagascar", code: "mg", region: "Africa", currency: "MGA" },
  { name: "Mauritius", code: "mu", region: "Africa", currency: "MUR" },
  { name: "Rwanda", code: "rw", region: "Africa", currency: "RWF" },
  { name: "Malawi", code: "mw", region: "Africa", currency: "MWK" },
  { name: "Somalia", code: "so", region: "Africa", currency: "SOS" },
  { name: "Congo (DRC)", code: "cd", region: "Africa", currency: "CDF" },
  { name: "Congo (Republic)", code: "cg", region: "Africa", currency: "XAF" },
  { name: "Gabon", code: "ga", region: "Africa", currency: "XAF" },
  { name: "Chad", code: "td", region: "Africa", currency: "XAF" },
  { name: "Central African Republic", code: "cf", region: "Africa", currency: "XAF" },
  { name: "Benin", code: "bj", region: "Africa", currency: "XOF" },
  { name: "Togo", code: "tg", region: "Africa", currency: "XOF" },
  { name: "Sierra Leone", code: "sl", region: "Africa", currency: "SLL" },
  { name: "Liberia", code: "lr", region: "Africa", currency: "LRD" },
  { name: "Mauritania", code: "mr", region: "Africa", currency: "MRU" },
  { name: "Gambia", code: "gm", region: "Africa", currency: "GMD" },
  { name: "Guinea", code: "gn", region: "Africa", currency: "GNF" },
  { name: "Guinea-Bissau", code: "gw", region: "Africa", currency: "XOF" },
  { name: "Equatorial Guinea", code: "gq", region: "Africa", currency: "XAF" },
  { name: "Eritrea", code: "er", region: "Africa", currency: "ERN" },
  { name: "Djibouti", code: "dj", region: "Africa", currency: "DJF" },
  { name: "Seychelles", code: "sc", region: "Africa", currency: "SCR" },
  { name: "Comoros", code: "km", region: "Africa", currency: "KMF" },
  { name: "Cape Verde", code: "cv", region: "Africa", currency: "CVE" },
  { name: "São Tomé and Príncipe", code: "st", region: "Africa", currency: "STN" },
  { name: "Lesotho", code: "ls", region: "Africa", currency: "LSL" },
  { name: "Eswatini", code: "sz", region: "Africa", currency: "SZL" },
  { name: "Burundi", code: "bi", region: "Africa", currency: "BIF" },
  { name: "South Sudan", code: "ss", region: "Africa", currency: "SSP" },
  
  // Oceania
  { name: "Australia", code: "au", region: "Oceania", currency: "AUD" },
  { name: "New Zealand", code: "nz", region: "Oceania", currency: "NZD" },
  { name: "Fiji", code: "fj", region: "Oceania", currency: "FJD" },
  { name: "Papua New Guinea", code: "pg", region: "Oceania", currency: "PGK" },
  { name: "Solomon Islands", code: "sb", region: "Oceania", currency: "SBD" },
  { name: "Vanuatu", code: "vu", region: "Oceania", currency: "VUV" },
  { name: "Samoa", code: "ws", region: "Oceania", currency: "WST" },
  { name: "Tonga", code: "to", region: "Oceania", currency: "TOP" },
  { name: "Micronesia", code: "fm", region: "Oceania", currency: "USD" },
  { name: "Palau", code: "pw", region: "Oceania", currency: "USD" },
  { name: "Marshall Islands", code: "mh", region: "Oceania", currency: "USD" },
  { name: "Kiribati", code: "ki", region: "Oceania", currency: "AUD" },
  { name: "Tuvalu", code: "tv", region: "Oceania", currency: "AUD" },
  { name: "Nauru", code: "nr", region: "Oceania", currency: "AUD" },
];

export type Country = typeof countries[0];

const Header = ({ onLogout, showNavigation = false, activeSection = "popular-games", onNavigationClick }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { detectedCountry } = useIPDetection(countries);
  const [currentCountry, setCurrentCountry] = useState<Country>({ 
    name: "United States", 
    code: "us", 
    region: "North America", 
    currency: "USD" 
  });
  const [tempSelectedCountry, setTempSelectedCountry] = useState<Country>({ 
    name: "United States", 
    code: "us", 
    region: "North America", 
    currency: "USD" 
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  
  const location = useLocation();
  const navigate = useNavigate();
  const countryMenuRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useResponsive();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { isInstallable, isBrowser, handleInstall } = usePWAInstall();
  const { openAuthModal } = useAuthModal();

  // Auto-set language based on country when country changes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    const manualLanguage = localStorage.getItem('manualLanguageSelection');
    
    // If user manually selected language, respect that choice
    if (manualLanguage === 'true' && savedLanguage) {
      return;
    }
    
    // Auto-detect language from country
    const countryLang = getLanguageForCountry(currentCountry.code);
    if (countryLang && countryLang !== i18n.language) {
      i18n.changeLanguage(countryLang);
      localStorage.setItem('language', countryLang);
      
      // Apply RTL if needed
      const isRTL = isRTLLanguage(countryLang);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = countryLang;
    }
  }, [currentCountry, i18n]);

  // Apply RTL on initial load based on saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    const isRTL = isRTLLanguage(savedLanguage);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);
  
  const navLinks = [
    { name: "HOME", path: "/gaming-shop" },
    { name: "PUBG VEHICLES", path: "/car-purchase" },
    { name: "SHOP", path: "/shop" },
    { name: "CUSTOMERS REVIEWS", path: "/customer-reviews" },
  ];

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          setIsScrolled(currentScrollY > 10);
          
          // Only hide header on BGMI and PUBG UC pages
          const shouldAutoHide = location.pathname === '/bgmi' || location.pathname === '/';
          
          if (!shouldAutoHide) {
            // Always show header on other pages
            setIsHeaderVisible(true);
          } else {
            // Hide header when scrolling up beyond 100px, show when scrolling down or at top
            if (currentScrollY < 100) {
              setIsHeaderVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // Scrolling up
              setIsHeaderVisible(false);
            } else if (currentScrollY < lastScrollY) {
              // Scrolling down
              setIsHeaderVisible(true);
            }
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMenuOpen]);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // For country menu: check if click is inside the dropdown or the trigger button
      if (isCountryMenuOpen) {
        // Full-page country selector renders in a portal, so it won't be inside countryMenuRef.
        // If the click happened inside that portal, do NOT close.
        const isInsideFullPageSelector = target.closest('[data-fullpage-country-selector="true"]');
        const isInsideDropdown = target.closest('.country-dropdown-menu');
        const isInsideRef = countryMenuRef.current?.contains(target);
        
        // Only close if clicking completely outside both the dropdown and the trigger
        if (!isInsideFullPageSelector && !isInsideDropdown && !isInsideRef) {
          setIsCountryMenuOpen(false);
        }
      }
      
      // Close notification when clicking outside
      if (!(target).closest('.notification-dropdown')) {
        setIsNotificationOpen(false);
      }
    };

    // Use mousedown for faster response, but check properly
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryMenuOpen]);

  useEffect(() => {
    localStorage.setItem('selectedCountry', JSON.stringify(currentCountry));
    triggerCurrencyChangeEvent(currentCountry.currency);
    const event = new CustomEvent('countryChanged');
    window.dispatchEvent(event);
    const storageEvent = new StorageEvent('storage', {
      key: 'selectedCountry',
      newValue: JSON.stringify(currentCountry)
    });
    window.dispatchEvent(storageEvent);
  }, [currentCountry]);

  // PRIMARY: Detect country from URL - URL is the source of truth
  useEffect(() => {
    // Extract country code from URL patterns like /midasbuy/pk or /midasbuy/pk/buy/pubgm
    const urlMatch = location.pathname.match(/^\/midasbuy\/([a-z]{2})(\/|$)/i);
    
    if (urlMatch) {
      const urlCountryCode = urlMatch[1].toLowerCase();
      const foundCountry = countries.find(c => c.code.toLowerCase() === urlCountryCode);
      
      if (foundCountry) {
        setCurrentCountry(foundCountry);
        setTempSelectedCountry(foundCountry);
        // Save to localStorage for consistency
        localStorage.setItem('selectedCountry', JSON.stringify(foundCountry));
        return; // URL takes priority, exit early
      }
    }
    
    // If no URL country, check manual selection
    const manualSelection = localStorage.getItem('manualCountrySelection');
    
    if (manualSelection === 'true') {
      // User manually selected, use saved country
      const savedCountry = localStorage.getItem('selectedCountry');
      if (savedCountry) {
        try {
          setCurrentCountry(JSON.parse(savedCountry));
        } catch (error) {
          console.error('Error parsing saved country:', error);
        }
      }
    } else if (detectedCountry) {
      // Auto-detected country from IP, use it
      setCurrentCountry(detectedCountry);
    } else {
      // Fallback to saved country if no detection yet
      const savedCountry = localStorage.getItem('selectedCountry');
      if (savedCountry) {
        try {
          setCurrentCountry(JSON.parse(savedCountry));
        } catch (error) {
          console.error('Error parsing saved country:', error);
        }
      }
    }
  }, [location.pathname, detectedCountry]);

  // Listen for country detection events
  useEffect(() => {
    const handleCountryDetected = (event: CustomEvent) => {
      // Only update if not on a country-specific URL and user hasn't manually selected
      const urlMatch = location.pathname.match(/^\/midasbuy\/([a-z]{2})(\/|$)/i);
      const manualSelection = localStorage.getItem('manualCountrySelection');
      
      if (!urlMatch && manualSelection !== 'true') {
        setCurrentCountry(event.detail);
      }
    };

    window.addEventListener('countryDetected' as any, handleCountryDetected);
    return () => {
      window.removeEventListener('countryDetected' as any, handleCountryDetected);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(query) || 
        country.region.toLowerCase().includes(query) ||
        country.currency.toLowerCase().includes(query)
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery]);

  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, typeof countries>);

  const handleSelectCountry = (country: Country) => {
    // Just update temporary selection, don't close dropdown
    setTempSelectedCountry(country);
  };

  /**
   * Handle country confirmation - URL-Based Pricing + Language
   * When user confirms country, we navigate to the country-specific URL
   * This ensures prices are determined by URL, not just localStorage
   * IMPORTANT: User stays on the SAME page, only country code changes
   */
  const handleConfirmCountry = (country: Country, language: string) => {
    // Confirm and close
    setCurrentCountry(country);
    setIsCountryMenuOpen(false);
    setSearchQuery("");
    // Mark as manual selection to prevent IP redirect override
    localStorage.setItem('manualCountrySelection', 'true');
    
    // Update language based on user selection
    const defaultLang = getLanguageForCountry(country.code);
    if (language !== defaultLang) {
      // User manually selected a different language
      localStorage.setItem('manualLanguageSelection', 'true');
    } else {
      // Using country's default language
      localStorage.removeItem('manualLanguageSelection');
    }
    
    // Change i18n language and apply RTL
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    
    const isRTL = isRTLLanguage(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Dispatch language change event for other components
    const langEvent = new CustomEvent('languageChanged', { detail: { language, isRTL } });
    window.dispatchEvent(langEvent);
    
    const countryCode = country.code.toLowerCase();
    const currentPath = location.pathname;
    
    // Check if already on a country-specific midasbuy route
    const midasbuyMatch = currentPath.match(/^\/midasbuy\/([a-z]{2})(\/.*)?$/i);
    
    if (midasbuyMatch) {
      // Replace existing country code with new one, keep the rest of the path
      const restOfPath = midasbuyMatch[2] || ''; // e.g., "/buy/pubgm" or ""
      const newPath = `/midasbuy/${countryCode}${restOfPath}`;
      navigate(newPath, { replace: true });
      console.log(`[Header] Country changed to ${country.name}, staying on same page: ${newPath}`);
      return;
    }
    
    // For non-midasbuy routes (e.g., /coupons, /orders, /payment-issues, etc.)
    // Just update the country in localStorage, don't redirect - stay on same page
    // The country flag will update from localStorage
    console.log(`[Header] Country changed to ${country.name}, staying on current page: ${currentPath}`);
    
    // For game-related legacy routes, redirect to proper localized path
    if (currentPath.includes('/freefire') || currentPath.includes('/free-fire')) {
      navigate(`/midasbuy/${countryCode}/buy/freefire`, { replace: true });
    } else if (currentPath.includes('/roblox')) {
      navigate(`/midasbuy/${countryCode}/buy/roblox`, { replace: true });
    } else if (currentPath.includes('/valorant')) {
      navigate(`/midasbuy/${countryCode}/buy/valorant`, { replace: true });
    } else if (currentPath.includes('/bgmi')) {
      navigate(`/midasbuy/${countryCode}/buy/bgmi`, { replace: true });
    } else if (currentPath.includes('/honor-of-kings') || currentPath.includes('/honorofkings')) {
      navigate(`/midasbuy/${countryCode}/buy/honorofkings`, { replace: true });
    } else if (currentPath.includes('/pubgm') || currentPath.includes('/pubg-mobile')) {
      navigate(`/midasbuy/${countryCode}/buy/pubgm`, { replace: true });
    } else if (currentPath.includes('/car-purchase') || currentPath.includes('/car')) {
      navigate(`/midasbuy/${countryCode}/buy/car`, { replace: true });
    } else if (currentPath === '/' || currentPath === '/gaming-shop') {
      // Home page - redirect to country-specific home
      navigate(`/midasbuy/${countryCode}`, { replace: true });
    }
    // For all other routes (/coupons, /orders, /payment-issues, /redeem, etc.)
    // No redirect - just update localStorage and stay on page
  };

  const handleOpenCountryMenu = () => {
    // Initialize temp selection with current country when opening
    setTempSelectedCountry(currentCountry);
    setIsCountryMenuOpen(true);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Old renderCountryMenu removed - now using FullPageCountrySelector

  return (
    <>
    <header 
      dir="ltr"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-midasbuy-navy/90 backdrop-blur-md shadow-lg" : "bg-transparent",
        !isHeaderVisible ? "transform -translate-y-full" : "transform translate-y-0"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-midasbuy-navy/95 to-midasbuy-navy/90 z-0 opacity-0"></div>
      
      <div className="container mx-auto px-4 py-2 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <Link to="/gaming-shop" className="mr-4">
            <OptimizedImage
              src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png" 
              alt="Midasbuy Logo" 
              className="h-5 md:h-6" 
              priority={true}
              quality={90}
              displayWidth={110}
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <div className="relative" ref={countryMenuRef}>
            <button 
              className="flex items-center text-gray-300 hover:text-white transition-colors bg-transparent text-xs px-2 py-1"
              onClick={handleOpenCountryMenu}
            >
              <span className="text-base mr-1 select-none" role="img" aria-label={currentCountry.name}>
                {getFlag(currentCountry.code)}
              </span>
              <span className="hidden sm:inline">{currentCountry.name}</span>
              <span className="text-xs ml-1 text-midasbuy-gold">{currentCountry.currency}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          <div>
            <NotificationDropdown isMobile={false} />
          </div>

          {isAdmin && (
            <Link 
              to="/admin" 
              className="flex items-center gap-1 text-xs px-3 py-1.5 border border-midasbuy-blue/50 text-white rounded-md hover:shadow-md transition-all"
            >
              {t('dashboard', 'Admin Dashboard')}
            </Link>
          )}
          {!user && (
            <button 
              onClick={openAuthModal}
              className="flex items-center gap-1 text-xs px-4 py-1.5 bg-gradient-to-r from-midasbuy-blue to-midasbuy-blue/80 text-white rounded-md hover:shadow-md hover:shadow-midasbuy-blue/20 transition-all border border-midasbuy-blue/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              {t('login', 'Sign In')}
            </button>
          )}
          {user && (
            <Link 
              to="/profile"
              className="flex items-center gap-1 text-xs px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md hover:shadow-md hover:shadow-cyan-500/20 transition-all border border-cyan-500/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {t('profile', 'My Profile')}
            </Link>
          )}

        </div>

        <div className="md:hidden flex items-center space-x-2">
          <div className="relative" ref={countryMenuRef}>
            <button 
              className="flex items-center text-gray-300 hover:text-white transition-colors bg-transparent"
              onClick={handleOpenCountryMenu}
              aria-label="Select Country"
            >
              <span className="text-base select-none" role="img" aria-label={currentCountry.name}>
                {getFlag(currentCountry.code)}
              </span>
              <span className="text-xs ml-1 text-midasbuy-gold">{currentCountry.currency}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          {/* Notification with manual state control */}
          <div className="relative">
            <button 
              className="relative p-1.5 text-gray-300 hover:text-white transition-colors bg-transparent group"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            
            {/* Custom notification dropdown */}
            {isNotificationOpen && (
              <div className="notification-dropdown fixed top-16 left-0 right-0 mx-2 max-h-[50vh] bg-midasbuy-navy border border-gray-700 rounded-lg shadow-xl z-[100] overflow-hidden opacity-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-midasbuy-darkBlue/50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-midasbuy-blue" />
                    <h3 className="text-white font-bold">{t('notifications', 'Notifications')}</h3>
                  </div>
                  <button 
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">{t('header.noNotifications', 'No notifications yet')}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('header.notificationsHint', "You'll see updates here")}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="text-gray-300 hover:text-white bg-transparent" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs - Only visible when scrolled */}
      {showNavigation && (
        <div className="flex justify-center py-2 px-2">
          <div className={`
            inline-flex items-center bg-slate-700/80 backdrop-blur-xl rounded-full shadow-lg
            ${isMobile ? 'overflow-x-auto scrollbar-hide gap-0.5 py-1 px-1.5' : 'gap-1 py-1.5 px-2'}
          `}>
          {[
              { id: "popular-games", labelKey: "popularGames" },
              { id: "mini-games", labelKey: "miniGames.title" },
              { id: "midasbuy-video", labelKey: "header.midasbuyVideo" },
              { id: "latest-news", labelKey: "latestNews" },
              { id: "about-midasbuy", labelKey: "aboutMidasbuy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigationClick?.(tab.id)}
                className={`
                  whitespace-nowrap rounded-full font-medium transition-all duration-200
                  ${isMobile ? 'text-[10px] px-2 py-1' : 'text-sm px-4 py-2'}
                  ${activeSection === tab.id 
                    ? 'text-white shadow-md' 
                    : 'bg-transparent text-gray-400 hover:text-white'
                  }
                `}
                style={activeSection === tab.id ? {
                  background: 'linear-gradient(90deg, hsl(192 81% 51%) 0%, hsl(207 82% 48%) 30%, hsl(222 84% 46%) 100%)'
                } : undefined}
              >
                {t(tab.labelKey, tab.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
              </button>
            ))}
          </div>
        </div>
      )}

    </header>
    
    {/* Mobile Slide-in Menu - Rendered via Portal to avoid transform issues */}
    {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark Overlay - prevents background interaction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[150] md:hidden touch-none"
              onClick={() => setIsMenuOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
            />
            
            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%', transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="fixed top-0 right-0 w-[75%] max-w-[300px] h-[100dvh] bg-midasbuy-navy z-[151] md:hidden rounded-l-2xl shadow-2xl flex flex-col touch-none"
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Header with Logo and Close */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-midasbuy-blue/10">
                <OptimizedImage 
                  src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png" 
                  alt="Midasbuy Logo" 
                  className="h-5 w-auto"
                  priority={true}
                  quality={90}
                />
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Sign In Section - Logged Out State */}
              {!user ? (
                <div className="px-4 py-4 flex items-center justify-between gap-2">
                  <div className="leading-tight">
                    <p className="text-white text-[13px]">{t('header.signInToEnjoy', 'Sign In to Enjoy')}</p>
                    <p className="text-white text-[13px]">{t('header.exclusiveService', 'Exclusive Service')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openAuthModal();
                    }}
                    className="py-1.5 px-3 bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white text-xs font-medium rounded-md whitespace-nowrap"
                  >
                    {t('header.signInSignUp', 'Sign in / Sign up')}
                  </button>
                </div>
              ) : (
                <div className="px-4 pt-4 pb-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-midasbuy-blue"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-midasbuy-blue to-blue-600 flex items-center justify-center border-2 border-midasbuy-blue">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                  </Link>

                </div>
              )}
              
              {/* Menu Items - reduced spacing */}
              <nav className="flex-1 flex flex-col pt-2">
                {/* Coupon */}
                <Link
                  to="/coupons"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3.5 text-white hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  <div className="relative">
                    <Ticket className="w-5 h-5 text-gray-300" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  </div>
                  <span className="text-[15px] font-medium">{t('header.coupon', 'Coupon')}</span>
                </Link>
                
                {/* Order Center */}
                <Link
                  to="/order-center"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3.5 text-white hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  <SlidersHorizontal className="w-5 h-5 text-gray-300" />
                  <span className="text-[15px] font-medium">{t('header.orderCenter', 'Order Center')}</span>
                </Link>
                
                {/* Account and Security - Coming Soon */}
                <div
                  className="px-6 py-3.5 text-white/50 flex items-center gap-4 cursor-not-allowed"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-[15px] font-medium">{t('header.accountSecurity', 'Account and Security')}</span>
                </div>
                
                {/* Midasbuy Events - Coming Soon */}
                <div
                  className="px-6 py-3.5 text-white/50 flex items-center gap-4 cursor-not-allowed"
                >
                  <Gift className="w-5 h-5 text-gray-500" />
                  <span className="text-[15px] font-medium">{t('header.midasbuyEvents', 'Midasbuy Events')}</span>
                </div>
                
                {/* Help Center */}
                <Link
                  to="/help-center"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3.5 text-white hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  <HelpCircle className="w-5 h-5 text-gray-300" />
                  <span className="text-[15px] font-medium">{t('helpCenter', 'Help Center')}</span>
                </Link>
                
                {/* Live & Video */}
                <Link
                  to="/shop/videos"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3.5 text-white hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  <Clapperboard className="w-5 h-5 text-gray-300" />
                  <span className="text-[15px] font-medium">{t('header.liveVideo', 'Live & Video')}</span>
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-3.5 text-midasbuy-gold hover:bg-white/5 transition-colors flex items-center gap-4 border-t border-midasbuy-blue/10 mt-1"
                  >
                    <Settings className="w-5 h-5 text-midasbuy-gold" />
                    <span className="text-[15px] font-medium">{t('header.adminPanel', 'Admin Panel')}</span>
                  </Link>
                )}
                
                {/* Logout Button - Only show when user is logged in */}
                {user && (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-6 py-3.5 text-white hover:bg-white/5 transition-colors border-t border-midasbuy-blue/10 w-full text-left flex items-center gap-4"
                  >
                    <LogOut className="w-5 h-5 text-gray-300" />
                    <span className="text-[15px] font-medium">{t('logout', 'Log Out')}</span>
                  </button>
                )}
              </nav>
              
              {/* Trustpilot Section - above Install App for all users */}
              <Link
                to="/customer-reviews"
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-3 hover:bg-white/5 transition-colors flex items-center gap-3"
              >
                <div className="flex flex-col items-start gap-1 leading-none flex-shrink-0">
                  <img src={trustpilotLogo} alt="Trustpilot" className="h-3 w-auto" />
                  <img src={trustpilotStars} alt="Trustpilot 5 Stars" className="h-4 w-auto" />
                </div>
                <span className="text-[11px] text-gray-400 leading-tight mt-auto">80,837 verified reviews</span>
              </Link>
              
              {/* Install App - Only show in browser (not in installed PWA) */}
              {isBrowser && isInstallable && (
                <button
                  onClick={() => {
                    handleInstall();
                    setIsMenuOpen(false);
                  }}
                  className="px-6 py-3.5 text-white hover:bg-white/5 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <img src={installAppIcon} alt="Install" className="w-5 h-5 rounded" />
                  <span className="text-[15px] font-medium text-white">Install App</span>
                </button>
              )}
              
              {/* Footer */}
              <div className="py-3 border-t border-midasbuy-blue/10">
                <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1">
                  <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px]">✓</span>
                  Official recharge store by Tencent
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    
    {/* Full Page Country Selector */}
    <FullPageCountrySelector
      isOpen={isCountryMenuOpen}
      onClose={() => setIsCountryMenuOpen(false)}
      countries={countries}
      currentCountry={currentCountry}
      onConfirm={handleConfirmCountry}
    />
    </>
  );
};

export default Header;
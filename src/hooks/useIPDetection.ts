import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COUNTRY_CONFIGS, getCountryCurrency, getCountryNameFromConfig, getCountryConfig } from '@/utils/countryConfigs';

interface Country {
  name: string;
  code: string;
  region: string;
  currency: string;
}

/**
 * IP Detection Hook - FOR REDIRECT ONLY
 * 
 * This hook detects the user's country via IP and redirects to the correct
 * country-specific URL. After redirect, the URL determines pricing.
 * 
 * IMPORTANT: This hook should NOT be used for pricing display!
 * Use useCurrencyFormat or useURLBasedPricing for pricing.
 * 
 * Flow:
 * 1. User visits / or /pubg-mobile
 * 2. IP detection determines country (e.g., Pakistan)
 * 3. User is redirected to /midasbuy/pk/buy/pubgm
 * 4. useCurrencyFormat reads 'pk' from URL → shows PKR prices
 * 
 * This separation ensures:
 * - SEO-friendly: Google indexes each URL with correct prices
 * - Consistent: Same URL always shows same prices
 * - User control: Manual URL/flag change works predictably
 */
export const useIPDetection = (countries: Country[]) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(() => {
    // Initialize from localStorage for instant display
    try {
      const saved = localStorage.getItem('detectedCountry');
      if (saved) {
        const country = JSON.parse(saved);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('countryDetected', { detail: country }));
        }, 0);
        return country;
      }
    } catch (error) {
      console.error('Error loading saved country:', error);
    }
    return null;
  });
  const [ipAddress, setIpAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectIP = async () => {
      try {
        // Always fetch current IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const currentIP = data.ip;
        setIpAddress(currentIP);
        
        // Check if IP has changed
        const savedIP = localStorage.getItem('detectedIP');
        const savedDetectedCountry = localStorage.getItem('detectedCountry');
        
        // If IP changed, clear old data
        if (savedIP !== currentIP) {
          localStorage.removeItem('detectedIP');
          localStorage.removeItem('detectedCountry');
          localStorage.removeItem('manualCountrySelection');
        }
        
        // If IP is same and we have a saved country, we can still redirect using cached data.
        // (Previously we returned early and skipped redirect, which broke / -> /midasbuy/{cc}.)
        if (savedIP === currentIP && savedDetectedCountry) {
          try {
            const cachedCountry = JSON.parse(savedDetectedCountry) as { code?: string };
            const cachedCode = cachedCountry?.code?.toLowerCase();

            // REDIRECT LOGIC: Only redirect if on root/generic pages
            const isRootOrPubgPage = location.pathname === '/' ||
                                     location.pathname === '/midasbuy/buy/pubgm';

            // Already on a country-specific URL (home or buy pages)
            const isAlreadyCountryUrl = /^\/midasbuy\/[a-z]{2}(\/|$)/i.test(location.pathname);

            const hasManualSelection = localStorage.getItem('manualCountrySelection') === 'true';

            if (cachedCode && /^[a-z]{2}$/.test(cachedCode) && isRootOrPubgPage && !isAlreadyCountryUrl && !hasManualSelection) {
              if (location.pathname === '/') {
                console.log(`[IP Redirect] Redirecting to /midasbuy/${cachedCode}`);
                navigate(`/midasbuy/${cachedCode}`, { replace: true });
              } else {
                console.log(`[IP Redirect] Redirecting to /midasbuy/${cachedCode}/buy/pubgm`);
                navigate(`/midasbuy/${cachedCode}/buy/pubgm`, { replace: true });
              }
            }
          } catch {
            // Ignore parse errors and fall back to re-detection
          } finally {
            setLoading(false);
          }
          return;
        }
        
        // Detect country from IP
        try {
          const geoResponse = await fetch(`https://ipapi.co/${currentIP}/json/`);
          const geoData = await geoResponse.json();
          const countryCode = geoData.country_code?.toLowerCase();
          
          if (countryCode) {
            const country = countries.find(c => c.code === countryCode);
            if (country) {
              setDetectedCountry(country);
              
              // Save detection results
              localStorage.setItem('detectedIP', currentIP);
              localStorage.setItem('detectedCountry', JSON.stringify(country));
              
              // Dispatch event for header flag update
              window.dispatchEvent(new CustomEvent('countryDetected', { detail: country }));
              
              // REDIRECT LOGIC: Only redirect if on root/generic pages
              const isRootOrPubgPage = location.pathname === '/' ||
                                       location.pathname === '/midasbuy/buy/pubgm';

              // Already on a country-specific URL (home or buy pages)
              const isAlreadyCountryUrl = /^\/midasbuy\/[a-z]{2}(\/|$)/i.test(location.pathname);

              const hasManualSelection = localStorage.getItem('manualCountrySelection') === 'true';

              // Only redirect if not already on country URL and no manual selection
              if (isRootOrPubgPage && !isAlreadyCountryUrl && !hasManualSelection) {
                const urlCountryCode = countryCode.toLowerCase();
                if (location.pathname === '/') {
                  console.log(`[IP Redirect] Redirecting to /midasbuy/${urlCountryCode}`);
                  navigate(`/midasbuy/${urlCountryCode}`, { replace: true });
                } else {
                  console.log(`[IP Redirect] Redirecting to /midasbuy/${urlCountryCode}/buy/pubgm`);
                  navigate(`/midasbuy/${urlCountryCode}/buy/pubgm`, { replace: true });
                }
              }
            }
          }
        } catch (error) {
          console.error('Error detecting country:', error);
        }
      } catch (error) {
        console.error('Error fetching IP:', error);
      } finally {
        setLoading(false);
      }
    };

    detectIP();
  }, [countries, navigate, location]);

  return { detectedCountry, ipAddress, loading };
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

/**
 * Redirects /honor-of-kings to /midasbuy/{countryCode}/buy/honorofkings
 * Uses stored country or detects via IP
 */
const HonorOfKingsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getCountryCode = async (): Promise<string> => {
      const stored = localStorage.getItem('selectedCountry');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.code) {
            return parsed.code.toLowerCase();
          }
        } catch {
          // Continue to IP detection
        }
      }

      try {
        const response = await fetch('https://ipapi.co/json/', { 
          signal: AbortSignal.timeout(3000) 
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.country_code) {
            return data.country_code.toLowerCase();
          }
        }
      } catch {
        // Fallback to US
      }

      return 'us';
    };

    const redirect = async () => {
      const countryCode = await getCountryCode();
      navigate(`/midasbuy/${countryCode}/buy/honorofkings`, { replace: true });
    };

    redirect();
  }, [navigate]);

  return <LoadingScreen message="Redirecting..." />;
};

export default HonorOfKingsRedirect;

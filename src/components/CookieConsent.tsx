import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CookieSettingsModal, CookiePreferences } from './CookieSettingsModal';

const COOKIE_CONSENT_KEY = 'midasbuy_cookie_consent';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    // Only show if no consent stored (completely new user)
    // Once user makes ANY choice (accepted, rejected, customized), never show again
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    closePopup();
    enableAnalytics();
  };

  const handleRejectAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    closePopup();
    disableAnalytics();
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSavePreferences = (preferences: CookiePreferences) => {
    if (preferences.analytics || preferences.marketing) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
    closePopup();
  };

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowConsent(false);
      setIsClosing(false);
    }, 300);
  };

  const enableAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
      });
    }
  };

  const disableAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
      });
    }
  };

  if (!showConsent && !showSettings) return null;

  return (
    <>
      <AnimatePresence>
        {showConsent && !isClosing && !showSettings && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999]"
          >
            <div className="bg-[#1e293b] w-full rounded-t-2xl">
              {/* Content */}
              <div className="px-4 pt-5 pb-4">
                {/* Title */}
                <h2 className="text-white text-base font-bold mb-3 tracking-wide">
                  COOKIES CONFIRM
                </h2>
                
                {/* Description */}
                <p className="text-gray-300 text-xs leading-[1.6] mb-4">
                  We use cookies that are necessary to provide this website.We would also like to use cookies, including from third party partners, to improve your experience, optimize and analyze website features and usage, and serve ads we think you would like. For more information, please refer to our{' '}
                  <Link 
                    to="/cookie-policy" 
                    className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2.5">
                  {/* Accept All Button */}
                  <button
                    onClick={handleAcceptAll}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-semibold text-xs transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                  >
                    Accept All Optional Cookies
                  </button>
                  
                  {/* Reject All Button */}
                  <button
                    onClick={handleRejectAll}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-semibold text-xs transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                  >
                    Reject All Optional Cookies
                  </button>
                  
                  {/* Customize Settings Link */}
                  <button
                    onClick={handleCustomize}
                    className="w-full py-1.5 text-[#3b82f6] font-medium text-xs hover:text-[#60a5fa] transition-colors"
                  >
                    Customize Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <CookieSettingsModal
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          // Only show popup again if user hasn't made any choice yet
          const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
          if (!consent) {
            setShowConsent(true);
          }
        }}
        onSave={handleSavePreferences}
      />
    </>
  );
}

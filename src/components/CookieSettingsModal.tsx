import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, BarChart3, Target, Settings, Cookie, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functionality: boolean;
}

const COOKIE_PREFERENCES_KEY = 'midasbuy_cookie_preferences';

export function CookieSettingsModal({ isOpen, onClose, onSave }: CookieSettingsModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    functionality: false,
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...parsed, essential: true }); // Essential always true
      } catch {
        // Use defaults
      }
    }
  }, [isOpen]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    localStorage.setItem('midasbuy_cookie_consent', 'customized');
    onSave(preferences);
    onClose();
  };

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functionality: true,
    };
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allEnabled));
    localStorage.setItem('midasbuy_cookie_consent', 'accepted');
    onSave(allEnabled);
    onClose();
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functionality: false,
    };
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyEssential));
    localStorage.setItem('midasbuy_cookie_consent', 'rejected');
    onSave(onlyEssential);
    onClose();
  };

  const cookieTypes = [
    {
      key: 'essential' as keyof CookiePreferences,
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for the website to function. Cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      icon: BarChart3,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website to improve it.',
      required: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      icon: Target,
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements based on your interests.',
      required: false,
    },
    {
      key: 'functionality' as keyof CookiePreferences,
      icon: Settings,
      title: 'Functionality Cookies',
      description: 'Enable enhanced features like language preferences and personalization.',
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[10001] max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-[#111827] rounded-t-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-[#111827] border-b border-gray-700/50 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-base">Cookie Settings</h2>
                    <p className="text-gray-400 text-xs">Manage your preferences</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="px-4 py-4">
                <p className="text-gray-300 text-xs leading-relaxed mb-4">
                  We use cookies to enhance your browsing experience. You can choose which types of cookies you allow. Learn more in our{' '}
                  <Link to="/cookie-policy" className="text-blue-400 hover:underline" onClick={onClose}>
                    Cookie Policy
                  </Link>.
                </p>

                {/* Cookie Types */}
                <div className="space-y-3">
                  {cookieTypes.map((cookie) => (
                    <div
                      key={cookie.key}
                      className={`bg-gray-800/50 rounded-xl p-3 border ${
                        preferences[cookie.key] ? 'border-blue-500/30' : 'border-gray-700/50'
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                          <cookie.icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-white font-medium text-sm">{cookie.title}</h3>
                            {cookie.required ? (
                              <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                Required
                              </span>
                            ) : (
                              <button
                                onClick={() => handleToggle(cookie.key)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${
                                  preferences[cookie.key] ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                    preferences[cookie.key] ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            {cookie.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-[#111827] border-t border-gray-700/50 px-4 py-4">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    Accept All Cookies
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 py-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      Save Preferences
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 py-2.5 rounded-lg border border-gray-600 hover:bg-gray-700/30 text-gray-300 font-medium text-xs transition-colors"
                    >
                      Reject Optional
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
/**
 * Centralized Localization Context
 * - Detects country from URL on every route
 * - Syncs i18n language + RTL direction globally
 * - Fires events for currency/country changes
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageForCountry, isRTLLanguage, COUNTRY_LANGUAGE_MAP } from '@/utils/countryLanguageMapping';

interface LocalizationContextValue {
  countryCode: string | null;
  languageCode: string;
  isRTL: boolean;
}

const LocalizationContext = createContext<LocalizationContextValue>({
  countryCode: null,
  languageCode: 'en',
  isRTL: false,
});

export const useLocalization = () => useContext(LocalizationContext);

interface Props {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<Props> = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Extract country code from URL (e.g., /midasbuy/sa/... => 'sa')
  const countryCode = useMemo(() => {
    const match = location.pathname.match(/^\/midasbuy\/([a-z]{2})(\/|$)/i);
    return match ? match[1].toLowerCase() : null;
  }, [location.pathname]);

  // Determine language to use
  const [languageCode, setLanguageCode] = useState<string>(() => {
    if (countryCode) {
      return getLanguageForCountry(countryCode);
    }
    return localStorage.getItem('language') || 'en';
  });

  // RTL determination
  const isRTL = useMemo(() => isRTLLanguage(languageCode), [languageCode]);

  // Sync language whenever country code changes (from URL)
  useEffect(() => {
    if (!countryCode) return;

    // Check if user explicitly overrode language
    const manualOverride = localStorage.getItem('manualLanguageSelection') === 'true';
    if (manualOverride) {
      // Respect user's manual choice – just sync RTL/LTR for that language
      const savedLang = localStorage.getItem('language') || 'en';
      setLanguageCode(savedLang);
      return;
    }

    // Auto-apply country's default language
    const lang = getLanguageForCountry(countryCode);
    setLanguageCode(lang);

    // Update i18n if different
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
    }
  }, [countryCode, i18n]);

  // Apply RTL/LTR on body/html whenever language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  }, [isRTL, languageCode]);

  // Listen for manual language changes from CountrySelector
  useEffect(() => {
    const handleLangChange = (e: CustomEvent<{ language: string; isRTL: boolean }>) => {
      setLanguageCode(e.detail.language);
    };
    window.addEventListener('languageChanged' as any, handleLangChange);
    return () => {
      window.removeEventListener('languageChanged' as any, handleLangChange);
    };
  }, []);

  const value = useMemo(
    () => ({ countryCode, languageCode, isRTL }),
    [countryCode, languageCode, isRTL]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationProvider;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SUPPORTED_LANGUAGES } from '@/utils/countryLanguageMapping';

// Build languages array from SUPPORTED_LANGUAGES for consistency
const languages = SUPPORTED_LANGUAGES.map(lang => ({
  code: lang.code,
  name: lang.nativeName,
  flag: getLanguageFlag(lang.code)
}));

// Helper to get flag for language
function getLanguageFlag(code: string): string {
  const flagMap: Record<string, string> = {
    // Global
    en: '🇺🇸',
    // RTL
    ar: '🇸🇦', ur: '🇵🇰', he: '🇮🇱', fa: '🇮🇷', ps: '🇦🇫',
    // South Asian
    hi: '🇮🇳', bn: '🇧🇩', ne: '🇳🇵', si: '🇱🇰', dz: '🇧🇹', dv: '🇲🇻',
    ta: '🇮🇳', te: '🇮🇳', mr: '🇮🇳', gu: '🇮🇳', pa: '🇮🇳', kn: '🇮🇳', ml: '🇮🇳', or: '🇮🇳', as: '🇮🇳',
    // East Asian
    zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷', mn: '🇲🇳',
    // Southeast Asian
    id: '🇮🇩', ms: '🇲🇾', th: '🇹🇭', vi: '🇻🇳', tl: '🇵🇭', km: '🇰🇭', lo: '🇱🇦', my: '🇲🇲',
    // Central Asian
    kk: '🇰🇿', uz: '🇺🇿', tk: '🇹🇲', ky: '🇰🇬', tg: '🇹🇯',
    // Caucasian
    hy: '🇦🇲', az: '🇦🇿', ka: '🇬🇪',
    // Slavic
    ru: '🇷🇺', uk: '🇺🇦', be: '🇧🇾', pl: '🇵🇱', cs: '🇨🇿', sk: '🇸🇰', bg: '🇧🇬', 
    hr: '🇭🇷', sr: '🇷🇸', sl: '🇸🇮', mk: '🇲🇰', bs: '🇧🇦',
    // Western European
    de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸', pt: '🇵🇹', it: '🇮🇹', nl: '🇳🇱', ca: '🇪🇸', gl: '🇪🇸', eu: '🇪🇸',
    // Nordic
    sv: '🇸🇪', no: '🇳🇴', da: '🇩🇰', fi: '🇫🇮', is: '🇮🇸', fo: '🇫🇴',
    // Baltic
    et: '🇪🇪', lv: '🇱🇻', lt: '🇱🇹',
    // Other European
    el: '🇬🇷', sq: '🇦🇱', ro: '🇷🇴', hu: '🇭🇺', tr: '🇹🇷', mt: '🇲🇹',
    ga: '🇮🇪', cy: '🇬🇧', gd: '🇬🇧', lb: '🇱🇺',
    // African
    sw: '🇹🇿', am: '🇪🇹', ti: '🇪🇷', om: '🇪🇹', so: '🇸🇴', ha: '🇳🇬', yo: '🇳🇬', ig: '🇳🇬',
    zu: '🇿🇦', xh: '🇿🇦', af: '🇿🇦', rw: '🇷🇼', mg: '🇲🇬', sn: '🇿🇼', ny: '🇲🇼', wo: '🇸🇳', ff: '🇸🇳', ln: '🇨🇩',
    // Oceania
    mi: '🇳🇿', sm: '🇼🇸', to: '🇹🇴', fj: '🇫🇯', haw: '🇺🇸',
    // Additional
    eo: '🌍', la: '🇻🇦', ku: '🇮🇶', ckb: '🇮🇶', sd: '🇵🇰', ug: '🇨🇳'
  };
  return flagMap[code] || '🌐';
}

// RTL languages list
const rtlLanguages = ['ar', 'ur', 'he', 'fa', 'ps'];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Listen for language changes from Header's full-page selector
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      const newLang = e.detail?.language || e.detail;
      if (newLang && typeof newLang === 'string' && newLang !== i18n.language) {
        // Already changed by header, just update internal state if needed
      }
    };
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [i18n.language]);

  const changeLanguage = (languageCode: string) => {
    // Check if RTL language
    const isRTL = rtlLanguages.includes(languageCode);
    
    // Change i18n language
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    localStorage.setItem('languageTouched', 'true');
    setIsOpen(false);
    
    // Apply RTL to document
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.remove('rtl');
    }
    
    // Dispatch same event format as Header's full-page selector
    const langEvent = new CustomEvent('languageChanged', { 
      detail: { language: languageCode, isRTL } 
    });
    window.dispatchEvent(langEvent);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 min-w-[130px] bg-gray-900/80 border-gray-700/60 text-white hover:bg-gray-800/90 hover:border-gray-600/80 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <span className="text-lg leading-none">{currentLanguage.flag}</span>
          <span className="font-medium">{currentLanguage.name}</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-52 bg-gray-900/95 border-gray-700/60 max-h-72 overflow-y-auto backdrop-blur-sm shadow-xl z-[100]"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between cursor-pointer text-white hover:bg-gray-800/80 focus:bg-gray-800/80 transition-all duration-200 px-4 py-2.5"
          >
            <span className="font-medium flex items-center gap-2">
              <span className="text-lg leading-none">{language.flag}</span>
              {language.name}
            </span>
            {language.code === i18n.language && (
              <Check className="h-4 w-4 text-midasbuy-blue" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
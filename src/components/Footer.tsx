
import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import SocialMediaIcons from "./SocialMediaIcons";
import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import AppButtons from "./AppButtons";
import OptimizedImage from "./OptimizedImage";
import { useUserRole } from "@/hooks/useUserRole";
import trustpilotStars from "@/assets/trustpilot-stars.webp";
import trustpilotLogo from "@/assets/trustpilot-logo.webp";
import { Mail } from "lucide-react";
import { getCountryData } from "@/utils/gameSeoConfigs";

interface FooterProps {
  showWhyTopUp?: boolean;
  countryFAQSlot?: React.ReactNode;
}

// RTL languages for layout direction
const rtlLanguages = ['ar', 'ur', 'he', 'fa', 'ps'];

const Footer = ({ showWhyTopUp = false, countryFAQSlot }: FooterProps) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const { isAdmin } = useUserRole();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  // Extract country code from URL for unique content
  const countryVars = useMemo(() => {
    const match = location.pathname.match(/\/midasbuy\/([a-z]{2})\//i);
    const code = match ? match[1].toUpperCase() : 'US';
    const data = getCountryData(code);
    return {
      country: data.name,
      currency: data.currency,
      paymentMethods: data.paymentMethods.slice(0, 3).join(', ')
    };
  }, [location.pathname]);

  // Check if current language is RTL
  const isRTL = useMemo(() => {
    return rtlLanguages.includes(i18n.language);
  }, [i18n.language]);

  return (
    <footer className="bg-[#0a1628] py-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
            {/* Midasbuy logo - always LTR */}
            <div className="mb-4 flex justify-start md:justify-center" dir="ltr">
              <OptimizedImage 
                src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png" 
                alt="Midasbuy Logo" 
                className="h-auto w-auto max-h-7 md:max-h-10 transform hover:scale-110 transition-transform object-contain"
                width={138}
                height={29}
                quality={85}
                displayWidth={138}
              />
            </div>
          {/* Desktop/tablet description (localized) */}
          <p className="hidden md:block text-gray-400 text-sm mb-4 text-center">
            {t('footer.description', 'The official platform for purchasing in-game currency and items for PUBG Mobile and other popular games.')}
          </p>

          {/* Mobile description (matches screenshot copy) */}
           <p className="md:hidden text-gray-400 text-xs mb-6 text-left leading-relaxed">
             {t('footer.mobileDescription', 'Midasbuy is the official recharge store by Tencent. Pay Safe, fast and fun at Midasbuy.')}
           </p>
          
          {/* App buttons are not shown in the provided mobile footer screenshots */}
          <div className="hidden md:block">
            <AppButtons />
          </div>
          
          {/* Trustpilot Section - Centered above Follow Us */}
          <div className="hidden md:flex justify-center mb-4">
            <Link
              to="/customer-reviews"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="flex flex-col items-start gap-1 leading-none flex-shrink-0">
                <img src={trustpilotLogo} alt="Trustpilot rating logo" className="h-3 w-auto" />
                <img src={trustpilotStars} alt="Trustpilot 5 star customer rating" className="h-4 w-auto" />
              </div>
              <span className="text-xs text-gray-400 leading-tight mt-auto">{t('footer.verifiedReviews', '80,837 verified reviews')}</span>
            </Link>
          </div>
          
          <SocialMediaIcons />
          
          {/* Payment Methods Carousel - Moved here */}
          <PaymentMethodsCarousel />

          {/* Contact us section (mobile-only, matches screenshot) */}
          <div className="md:hidden mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-white text-sm font-medium mb-2">{t('footer.contactUsTitle', 'Contact us')}</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              {t('footer.contactUsDesc', 'If you need any help, please contact us by clicking "Customer Service" to get in touch with us.')}
            </p>
            {/* Wide centered button for home/non-gaming pages, compact for gaming currency pages */}
            {showWhyTopUp ? (
              <Link
                to="/contact-us"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.16] hover:bg-white/20 transition-colors"
              >
                <Mail className="w-3 h-3 text-white" aria-hidden="true" />
                <span className="text-white text-xs font-medium">{t('footer.customerService', 'Customer Service')}</span>
              </Link>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/contact-us"
                  className="flex items-center justify-center gap-2 w-full mx-2 py-2.5 rounded-md bg-white/[0.16] hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-4 h-4 text-white" aria-hidden="true" />
                  <span className="text-white text-sm font-medium">{t('footer.customerService', 'Customer Service')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Long content section - only shown on PUBG UC and BGMI pages */}
        {showWhyTopUp && (
          <section className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 className="text-white text-base font-semibold mb-4">{t('whyTopUp.title', 'Why top up games on Midasbuy in {{country}}?', countryVars)}</h2>
            <div className="space-y-5 text-gray-400 text-sm leading-relaxed">
              <div>
                <p className="text-gray-400 font-medium mb-2">
                  {t('whyTopUp.section1Title', "1. Midasbuy: PUBG MOBILE's Official Authorized Top-up Store for {{country}}", countryVars)}
                </p>
                <p>
                  {t('whyTopUp.section1Content', "As PUBG MOBILE's exclusive officially authorized payment partner, Midasbuy provides secure and efficient UC recharge services for players in {{country}}.", countryVars)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-medium mb-2">{t('whyTopUp.section2Title', '2. Midasbuy PUBG Mobile UC Bonus Redemption in {{country}}:', countryVars)}</p>
                <p>
                  {t('whyTopUp.section2Content', "Activate PUBG Mobile redeem codes or gift cards at Midasbuy's official redemption portal to claim 3%-7% bonus UC instantly in {{country}}.", countryVars)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-medium mb-2">{t('whyTopUp.section3Title', '3. PUBG MOBILE | THE BEST BATTLE ROYALE MOBILE GAME IN {{country}}', countryVars)}</p>
                <p>
                  {t('whyTopUp.section3Content', 'As a globally popular free-to-play tactical shooter loved by {{country}} gamers, PUBG MOBILE features diverse battlegrounds like Erangel, Miramar, and Rondo.', countryVars)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-medium mb-2">{t('whyTopUp.section4Title', '4. Q&A for {{country}} Players', countryVars)}</p>
                <ul className="space-y-2">
                  <li>{t('whyTopUp.q1', 'Q: How do I make purchases for PUBG MOBILE in {{country}}?', countryVars)}</li>
                  <li>{t('whyTopUp.q2', 'Q: Where do I get my PUBG MOBILE UC after I purchase it in {{country}}?', countryVars)}</li>
                  <li>{t('whyTopUp.q3', 'Q: How to redeem codes for items on Midasbuy in {{country}}?', countryVars)}</li>
                  <li>{t('whyTopUp.q4', "Q: Why can't I get my products after making purchase on Midasbuy?", countryVars)}</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Country-specific FAQ slot - above certification icons */}
        {countryFAQSlot}
        
        {/* Support, Legal, About sections - hidden on mobile, visible on desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">{t('support', 'Support')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/help-center" className="hover:text-white transition-colors">{t('helpCenter', 'Help Center')}</Link></li>
              <li><Link to="/contact-us" className="hover:text-white transition-colors">{t('contactUs', 'Contact Us')}</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">{t('faqs', 'FAQs')}</Link></li>
              <li><Link to="/payment-issues" className="hover:text-white transition-colors">{t('paymentIssues', 'Payment Issues')}</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">{t('security', 'Security')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">{t('legal', 'Legal')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  {t('termsOfService', 'Terms of Service')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  {t('privacyPolicy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition-colors">
                  {t('cookiePolicy', 'Cookie Policy')}
                </Link>
              </li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">{t('refundPolicy', 'Refund Policy')}</Link></li>
              <li><Link to="/copyright-notice" className="hover:text-white transition-colors">{t('copyrightNotice', 'Copyright Notice')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">{t('aboutUs', 'About Us')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about-midasbuy" className="hover:text-white transition-colors">{t('aboutMidasbuy', 'About Midasbuy')}</Link></li>
              {isAdmin && <li><Link to="/ip-detector" className="hover:text-white transition-colors">IP Detector</Link></li>}
              <li><Link to="/blogs" className="hover:text-white transition-colors">{t('blogs', 'Blogs')}</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">{t('careers', 'Careers')}</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">{t('press', 'Press')}</Link></li>
              <li><Link to="/partners" className="hover:text-white transition-colors">{t('partners', 'Partners')}</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Desktop/tablet bottom area */}
        <div className="hidden md:block border-t border-gray-700 pt-6 pb-2 mt-6">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-4 space-x-4">
              <OptimizedImage 
                src="/lovable-uploads/17590eb9-a257-432b-bd97-5ccfa3ee5ed5.png" 
                alt="AICPA SOC" 
                className="h-8 md:h-14"
                width={56}
                height={56}
                quality={70}
                displayWidth={56}
              />
              <OptimizedImage 
                src="/lovable-uploads/57ffc683-59b7-4970-9c91-977479b64214.png" 
                alt="PCI DSS Compliant" 
                className="h-8 md:h-7"
                width={42}
                height={26}
                quality={70}
                displayWidth={26}
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">
                {t('footer.copyright', '© 2026 MidasBuy. All rights reserved. All trademarks referenced herein are the properties of their respective owners.')}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile bottom area (matches screenshot layout) */}
        <div className="md:hidden border-t border-gray-700 pt-8 pb-4 mt-8">
          <div className="flex items-center justify-center gap-6 mb-6">
            <OptimizedImage 
              src="/lovable-uploads/17590eb9-a257-432b-bd97-5ccfa3ee5ed5.png" 
              alt="AICPA SOC" 
              className="h-12"
              width={56}
              height={56}
              quality={70}
              displayWidth={56}
            />
            <OptimizedImage 
              src="/lovable-uploads/57ffc683-59b7-4970-9c91-977479b64214.png" 
              alt="PCI DSS Compliant" 
              className="h-7"
              width={53}
              height={34}
              quality={70}
              displayWidth={34}
            />
          </div>

          <div className="text-center text-sm text-gray-400 space-y-3">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <Link to="/terms-of-service" className="hover:text-white transition-colors">{t('termsOfService', 'Terms of Service')}</Link>
              <span>|</span>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('privacyPolicy', 'Privacy Policy')}</Link>
              <span>|</span>
              <Link to="/cookie-policy" className="hover:text-white transition-colors">{t('cookiePolicy', 'Cookie Policy')}</Link>
              <span>|</span>
              <button
                type="button"
                onClick={() => setShowPrivacyPolicy(true)}
                className="hover:text-white transition-colors"
              >
                {t('footer.cookiesPreference', 'Cookies Preference')}
              </button>
            </div>

            <p className="text-xs text-gray-400">
              {t('footer.copyright', '© 2026 MidasBuy. All rights reserved. All trademarks referenced herein are the properties of their respective owners.')}
            </p>
          </div>
        </div>
      </div>
      
      {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
    </footer>
  );
};

export default Footer;

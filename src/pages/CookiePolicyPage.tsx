import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Shield, Cookie, Eye, BarChart3, Target, Settings, Clock, Globe, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useLocalization } from '@/contexts/LocalizationContext';

interface CookiePolicyPageProps {
  onLogout?: () => void;
}

const CookiePolicyPage = ({ onLogout }: CookiePolicyPageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  const sections = [
    {
      icon: Cookie,
      titleKey: "pages.cookiePolicy.sections.whatAreCookies.title",
      contentKey: "pages.cookiePolicy.sections.whatAreCookies.content",
      defaultTitle: "What Are Cookies?",
      defaultContent: `Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you signed in, and understanding how you use our site. Cookies can be "session" cookies (which expire when you close your browser) or "persistent" cookies (which remain on your device until they expire or you delete them).`
    },
    {
      icon: Shield,
      titleKey: "pages.cookiePolicy.sections.essentialCookies.title",
      contentKey: "pages.cookiePolicy.sections.essentialCookies.content",
      defaultTitle: "Essential Cookies",
      defaultContent: `These cookies are necessary for the website to function properly and cannot be switched off. They are usually set in response to actions made by you, such as setting your privacy preferences, logging into your account, filling in forms, remembering your shopping cart, and security and fraud prevention. Without these cookies, services you have asked for cannot be provided.`
    },
    {
      icon: BarChart3,
      titleKey: "pages.cookiePolicy.sections.analyticsCookies.title",
      contentKey: "pages.cookiePolicy.sections.analyticsCookies.content",
      defaultTitle: "Analytics Cookies",
      defaultContent: `These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us count visitors and traffic sources, understand which pages are most popular, see how visitors move around the site, identify and fix technical issues, and improve website performance. We use Google Analytics and similar tools that may set cookies on your device.`
    },
    {
      icon: Target,
      titleKey: "pages.cookiePolicy.sections.advertisingCookies.title",
      contentKey: "pages.cookiePolicy.sections.advertisingCookies.content",
      defaultTitle: "Advertising & Marketing Cookies",
      defaultContent: `These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement, measure the effectiveness of advertising campaigns, remember that you have visited a website, and share information with third parties like advertisers. These cookies are set by our advertising partners including Google Ads, Facebook, and other networks.`
    },
    {
      icon: Eye,
      titleKey: "pages.cookiePolicy.sections.functionalityCookies.title",
      contentKey: "pages.cookiePolicy.sections.functionalityCookies.content",
      defaultTitle: "Functionality Cookies",
      defaultContent: `These cookies enable enhanced functionality and personalization, such as remembering your language preferences, remembering your region or location, personalizing content based on your preferences, remembering choices you make (username, language, region), and providing enhanced features like live chat. If you do not allow these cookies, some or all of these services may not function properly.`
    },
    {
      icon: Globe,
      titleKey: "pages.cookiePolicy.sections.thirdPartyCookies.title",
      contentKey: "pages.cookiePolicy.sections.thirdPartyCookies.content",
      defaultTitle: "Third-Party Cookies",
      defaultContent: `Some cookies are placed by third-party services that appear on our pages. We do not control the setting of these cookies. Third parties that may set cookies include payment processors (for secure transactions), social media platforms (Facebook, Twitter, etc.), analytics providers (Google Analytics), advertising networks, and customer support tools. Please refer to the respective privacy policies of these third parties for more information.`
    },
    {
      icon: Settings,
      titleKey: "pages.cookiePolicy.sections.managingCookies.title",
      contentKey: "pages.cookiePolicy.sections.managingCookies.content",
      defaultTitle: "Managing Your Cookie Preferences",
      defaultContent: `You have several options for managing cookies. Browser Settings: Most web browsers allow you to control cookies through their settings. You can set your browser to refuse all cookies or to indicate when a cookie is being sent. Our Cookie Settings: When you first visit our site, you can choose to accept or reject optional cookies using our cookie consent banner. Note: Blocking all cookies may affect your experience on our website.`
    },
    {
      icon: Clock,
      titleKey: "pages.cookiePolicy.sections.cookieRetention.title",
      contentKey: "pages.cookiePolicy.sections.cookieRetention.content",
      defaultTitle: "Cookie Retention Period",
      defaultContent: `Different cookies have different lifespans. Session Cookies are deleted when browser closes. Essential Cookies last up to 1 year. Analytics Cookies last up to 2 years. Advertising Cookies last up to 90 days. Preference Cookies last up to 1 year. We regularly review and update our cookie practices to ensure compliance with applicable laws.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('pages.cookiePolicy.title', 'Cookie Policy')} - Midasbuy</title>
        <meta name="description" content={t('pages.cookiePolicy.intro', 'Learn about how Midasbuy uses cookies to improve your experience, analyze site traffic, and personalize content.')} />
      </Helmet>

      <Header onLogout={onLogout} />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Link to="/" className="hover:text-white transition-colors">{t('home', 'Home')}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t('pages.cookiePolicy.title', 'Cookie Policy')}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-500/30">
                <Cookie className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{t('pages.cookiePolicy.title', 'Cookie Policy')}</h1>
                <p className="text-gray-400 mt-1">{t('pages.cookiePolicy.lastUpdated', 'Last updated: January 2025')}</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              {t('pages.cookiePolicy.intro', 'This Cookie Policy explains how Midasbuy uses cookies and similar technologies when you visit our website. We are committed to being transparent about the technologies we use.')}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="bg-[#111827]/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                    <section.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-4">{t(section.titleKey, section.defaultTitle)}</h2>
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {t(section.contentKey, section.defaultContent)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">{t('pages.cookiePolicy.questionsTitle', 'Questions About Our Cookie Policy?')}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {t('pages.cookiePolicy.questionsContent', 'If you have any questions about our use of cookies or this policy, please contact us:')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      to="/contact-us"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors"
                    >
                      <Mail size={16} />
                      {t('contactSupport', 'Contact Support')}
                    </Link>
                    <Link 
                      to="/privacy-policy"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-300 text-sm transition-colors"
                    >
                      <Shield size={16} />
                      {t('privacyPolicy', 'Privacy Policy')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="text-center text-gray-500 text-xs py-4">
              <p>{t('footer.copyright', '© 2026 Midasbuy. All rights reserved.')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicyPage;

import { Helmet } from 'react-helmet-async';
import { Shield, User, Database, Lock, Globe, Share2, Clock, Mail, ChevronRight, Eye, FileText, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useLocalization } from '@/contexts/LocalizationContext';

interface PrivacyPolicyPageProps {
  onLogout?: () => void;
}

const PrivacyPolicyPage = ({ onLogout }: PrivacyPolicyPageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const sections = [
    {
      icon: User,
      title: t('pages.privacyPolicy.sections.informationWeCollect.title', 'Information We Collect'),
      content: t(
        'pages.privacyPolicy.sections.informationWeCollect.content',
        `We collect information you provide directly to us when you create an account, make purchases, or contact our support team.\n\nPersonal Information includes your name, email address, phone number, and payment details which are processed securely via third-party providers. We also collect your Player ID and gaming account information to deliver your purchased items.\n\nAdditionally, we automatically collect device information such as browser type and operating system, your IP address and approximate location, usage data including pages visited and time spent on our platform, as well as information through cookies and similar tracking technologies.\n\nWhen you choose to connect your social media accounts or complete payments, we may receive verification data from those third-party services.`
      )
    },
    {
      icon: Database,
      title: t('pages.privacyPolicy.sections.howWeUse.title', 'How We Use Your Information'),
      content: t(
        'pages.privacyPolicy.sections.howWeUse.content',
        `Your information helps us deliver our services effectively and improve your experience.\n\nFor service delivery, we process your purchases and deliver digital products to your gaming accounts, manage your account settings, send transaction confirmations and receipts, and verify your identity for security purposes.\n\nWe also use your data for improvements and analytics, which includes analyzing usage patterns to enhance our platform, developing new features, conducting research, and monitoring for fraudulent activity.\n\nRegarding communications, we may send promotional offers with your consent, notify you about important updates to our services, respond to your inquiries, and provide customer support when you need assistance.`
      )
    },
    {
      icon: Share2,
      title: t('pages.privacyPolicy.sections.informationSharing.title', 'Information Sharing'),
      content: t(
        'pages.privacyPolicy.sections.informationSharing.content',
        `We do not sell your personal information to third parties.\n\nWe share your information with service providers who assist us in operating our platform, including payment processors for secure transactions, cloud hosting providers for data storage, analytics services to understand usage patterns, and customer support tools to assist you better.\n\nGame publishers receive necessary information when required to deliver in-game items and to verify player accounts for legitimate purchases.\n\nWe may also disclose information when required by law or legal process, to protect our rights and safety, to prevent fraud or security threats, and in connection with business transfers such as mergers or acquisitions.`
      )
    },
    {
      icon: Lock,
      title: t('pages.privacyPolicy.sections.dataSecurity.title', 'Data Security'),
      content: t(
        'pages.privacyPolicy.sections.dataSecurity.content',
        `We implement robust security measures to protect your personal information.\n\nOur technical safeguards include SSL/TLS encryption for all data transmission, secure server infrastructure hosted in certified data centers, regular security audits and vulnerability assessments, and encrypted storage for all sensitive data.\n\nOrganizationally, we limit access to personal information on a need-to-know basis, provide regular employee training on data protection practices, maintain incident response procedures, and conduct periodic security assessments.\n\nFor payment security, we use PCI-DSS compliant payment processing, never store complete credit card numbers on our servers, and employ tokenization for recurring payments.\n\nWhile we strive to protect your information using industry-standard measures, no method of transmission over the internet is completely secure.`
      )
    },
    {
      icon: Eye,
      title: t('pages.privacyPolicy.sections.yourRights.title', 'Your Privacy Rights'),
      content: t(
        'pages.privacyPolicy.sections.yourRights.content',
        `Depending on your location, you may have various rights regarding your personal data.\n\nYou have the right to access and portability, meaning you can request a copy of your personal data and receive it in a commonly used, machine-readable format.\n\nRegarding correction and deletion, you may update any inaccurate information in your account, request deletion of your personal data, and restrict certain processing of your information.\n\nFor consent and objection rights, you can withdraw your consent at any time, opt-out of marketing communications through your account settings or by clicking unsubscribe links, and object to automated decision-making processes.\n\nTo exercise any of these rights, please contact us at privacy@midasbuy.com or through our Contact Us page. We will respond to your request within 30 days.`
      )
    },
    {
      icon: Globe,
      title: t('pages.privacyPolicy.sections.internationalTransfers.title', 'International Data Transfers'),
      content: t(
        'pages.privacyPolicy.sections.internationalTransfers.content',
        `Your information may be transferred to and processed in countries other than your country of residence.\n\nWe use appropriate safeguards for international transfers, including standard contractual clauses approved by relevant data protection authorities and compliance with applicable data protection laws in each jurisdiction.\n\nOur primary servers are located in secure, certified data centers with backup and redundancy systems across multiple regions. We comply with local data residency requirements where applicable.\n\nBy using our services, you acknowledge and consent to the transfer of your information to countries that may have different data protection laws than your country of residence.`
      )
    },
    {
      icon: Clock,
      title: t('pages.privacyPolicy.sections.dataRetention.title', 'Data Retention'),
      content: t(
        'pages.privacyPolicy.sections.dataRetention.content',
        `We retain your information only for as long as necessary to fulfill the purposes outlined in this policy.\n\nAccount data is maintained while your account remains active and is deleted upon account closure, subject to applicable legal retention requirements.\n\nTransaction records are retained for seven years to comply with legal and tax obligations, while payment details are retained according to PCI-DSS requirements.\n\nFor analytics data, aggregated information may be retained indefinitely for statistical purposes, but personal identifiers are removed after twenty-six months.\n\nCustomer support interaction records are kept for three years, and marketing consent records are maintained until you withdraw your consent.\n\nYou may request deletion of your data at any time, though some information may be retained as required by law.`
      )
    },
    {
      icon: AlertTriangle,
      title: t('pages.privacyPolicy.sections.childrensPrivacy.title', "Children's Privacy"),
      content: t(
        'pages.privacyPolicy.sections.childrensPrivacy.content',
        `We are committed to protecting the privacy of children.\n\nOur services are not intended for children under thirteen years of age, or the applicable minimum age in your jurisdiction. We do not knowingly collect personal information from children, and parents or guardians may contact us to request removal of any children's data that may have been inadvertently collected.\n\nWe encourage parents and guardians to supervise their children's online activities and to contact us if they have any concerns about their children's data.\n\nIf we discover that we have collected personal information from a child, we will promptly delete such information from our systems. In certain circumstances, we may implement age verification measures.`
      )
    },
    {
      icon: FileText,
      title: t('pages.privacyPolicy.sections.updates.title', 'Updates to This Policy'),
      content: t(
        'pages.privacyPolicy.sections.updates.content',
        `We may update this Privacy Policy periodically to reflect changes in our practices or for legal, operational, or regulatory reasons.\n\nWhen we make changes, we will post the updated policy on this page with a revised effective date. For significant changes, we will provide additional notice through email notification or prominent in-app announcements.\n\nYour continued use of our services after any changes to this policy constitutes your acceptance of the updated terms. We encourage you to review this policy regularly to stay informed about how we protect your information.\n\nIf you have questions about any changes, please contact us. Upon request, we can provide you with previous versions of this policy for your reference.`
      )
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('pages.privacyPolicy.title', 'Privacy Policy')} - Midasbuy</title>
        <meta name="description" content="Learn how Midasbuy collects, uses, and protects your personal information. Your privacy and data security are our top priorities." />
      </Helmet>

      <Header onLogout={onLogout} />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00c6ff]/20 to-[#0072ff]/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00c6ff]/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Link to="/" className="hover:text-white transition-colors">{t('home', 'Home')}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t('pages.privacyPolicy.title', 'Privacy Policy')}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00c6ff]/30 to-[#0072ff]/30 flex items-center justify-center border border-[#00c6ff]/30">
                <Shield className="w-8 h-8 text-[#00c6ff]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{t('pages.privacyPolicy.title', 'Privacy Policy')}</h1>
                <p className="text-gray-400 mt-1">{t('pages.privacyPolicy.lastUpdated', 'Last updated: January 2025')}</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              {t('pages.privacyPolicy.intro', 'At Midasbuy, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our services.')}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="bg-[#111827]/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 md:p-8 hover:border-[#00c6ff]/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00c6ff]/20 to-[#0072ff]/20 flex items-center justify-center flex-shrink-0 border border-[#00c6ff]/20">
                    <section.icon className="w-6 h-6 text-[#00c6ff]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#00c6ff]/20 to-[#0072ff]/20 rounded-2xl border border-[#00c6ff]/30 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00c6ff]/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#00c6ff]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">{t('pages.privacyPolicy.contact.title', 'Contact Us About Privacy')}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {t('pages.privacyPolicy.contact.intro', 'If you have any questions, concerns, or requests regarding your privacy or this policy, please contact our Privacy Team:')}
                  </p>
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <p>
                      {t('pages.privacyPolicy.contact.emailLabel', 'Email')}: <span className="text-[#00c6ff]">privacy@midasbuy.com</span>
                    </p>
                    <p>
                      {t('pages.privacyPolicy.contact.addressLabel', 'Address')}: {t('pages.privacyPolicy.contact.addressValue', 'Midasbuy Privacy Team, Data Protection Office')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      to="/contact-us"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#00c6ff]/20 hover:bg-[#00c6ff]/30 border border-[#00c6ff]/30 rounded-lg text-[#00c6ff] text-sm transition-colors"
                    >
                      <Mail size={16} />
                      {t('contactSupport', 'Contact Support')}
                    </Link>
                    <Link 
                      to="/cookie-policy"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-300 text-sm transition-colors"
                    >
                      <Shield size={16} />
                      {t('pages.cookiePolicy.title', 'Cookie Policy')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="text-center text-gray-500 text-xs py-4">
              <p>{t('legalNoticeTitle', '© {{year}} Midasbuy. All rights reserved.', { year: new Date().getFullYear() })}</p>
              <p className="mt-1">{t('policySubjectToChange', 'This policy is subject to change. Please check back regularly for updates.')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
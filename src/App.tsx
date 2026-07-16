import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { NotificationProvider } from "@/hooks/useNotifications";
import { HelmetProvider } from "react-helmet-async";
import AuthRoute from "./components/AuthRoute";
import AdminRoute from "./components/AdminRoute";
import AppInstallNotification from "./components/AppInstallNotification";
import InternetConnectionChecker from "./components/InternetConnectionChecker";
import InternationalRedirect from "./components/InternationalRedirect";
import ErrorBoundary from "./components/ErrorBoundary";
import { GlobalPushPrompt } from "./components/push/GlobalPushPrompt";
import { useEffect, useState, lazy, Suspense } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useAnalyticsTracking } from "@/hooks/useAnalyticsTracking";
import { useStatusBar } from "@/hooks/useStatusBar";
import { useAuthNotifications } from "@/hooks/useAuthNotifications";
import { useCapacitor } from "@/hooks/useCapacitor";
import { useLocation } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { CookieConsent } from "@/components/CookieConsent";
import { LocalizationProvider } from "@/contexts/LocalizationContext";


// Lazy load all page components
// Lazy load AI chatbot to reduce initial bundle size
const AIChatbotWidget = lazy(() => import("./components/AIChatbotWidget").then(module => ({ default: module.AIChatbotWidget })));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const Index = lazy(() => import("@/pages/Index"));
const FreeFire = lazy(() => import("@/pages/FreeFire"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const PurchaseHistoryPage = lazy(() => import("./pages/PurchaseHistoryPage"));
const PubgAccountsPage = lazy(() => import("./pages/PubgAccountsPage"));
const PubgAccountCheckoutPage = lazy(() => import("./pages/PubgAccountCheckoutPage"));
const GamingShopPage = lazy(() => import("./pages/GamingShopPage"));
const HonorOfKingsPage = lazy(() => import("./pages/HonorOfKingsPage"));
// HonorOfKingsPurchasePage removed - now uses popup checkout
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const FAQsPage = lazy(() => import("./pages/FAQsPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const PressPage = lazy(() => import("./pages/PressPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const CopyrightNoticePage = lazy(() => import("./pages/CopyrightNoticePage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const PaymentIssuesPage = lazy(() => import("./pages/PaymentIssuesPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CarPurchasePage = lazy(() => import("./pages/CarPurchasePage"));
const GoogleAuthCallbackPage = lazy(() => import("./pages/GoogleAuthCallbackPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentCanceledPage = lazy(() => import("./pages/PaymentCanceledPage"));
const PaymentFailedPage = lazy(() => import("./pages/PaymentFailedPage"));
const OrderThankYouPage = lazy(() => import("./pages/OrderThankYouPage"));
const RefundStatusPage = lazy(() => import("./pages/RefundStatusPage"));
const OrderCenterPage = lazy(() => import("./pages/OrderCenterPage"));
const PayProReturnPage = lazy(() => import("./pages/PayProReturnPage"));
const RedeemPage = lazy(() => import("./pages/RedeemPage"));
const InternationalPubgPage = lazy(() => import("./pages/InternationalPubgPage"));
const PubgMobileRedirect = lazy(() => import("./components/PubgMobileRedirect"));
const InternationalFreeFirePage = lazy(() => import("./pages/InternationalFreeFirePage"));
const FreeFireRedirect = lazy(() => import("./components/FreeFireRedirect"));
const CountryPubgPage = lazy(() => import("./pages/CountryPubgPage"));
const CountryFreeFirePage = lazy(() => import("./pages/CountryFreeFirePage"));
const CountryRobloxPage = lazy(() => import("./pages/CountryRobloxPage"));
const CountryValorantPage = lazy(() => import("./pages/CountryValorantPage"));
const CountryHomePage = lazy(() => import("./pages/CountryHomePage"));
const BGMIPage = lazy(() => import("./pages/BGMIPage"));
const BGMIRedirect = lazy(() => import("./components/BGMIRedirect"));
const RobloxPage = lazy(() => import("./pages/RobloxPage"));
const RobloxRedirect = lazy(() => import("./components/RobloxRedirect"));
const ValorantPage = lazy(() => import("./pages/ValorantPage"));
const ValorantRedirect = lazy(() => import("./components/ValorantRedirect"));
const HonorOfKingsRedirect = lazy(() => import("./components/HonorOfKingsRedirect"));
const CarPurchaseRedirect = lazy(() => import("./components/CarPurchaseRedirect"));
const CountryCarPurchasePage = lazy(() => import("./pages/CountryCarPurchasePage"));
// Roblox/Valorant/HonorOfKings checkout pages removed - now uses popup checkout
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const AboutMidasbuyPage = lazy(() => import("./pages/AboutMidasbuyPage"));
const IPDetectorPage = lazy(() => import("./pages/IPDetectorPage"));
const CustomerReviewsPage = lazy(() => import("./pages/CustomerReviewsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const CreditCardPaymentPage = lazy(() => import("./pages/CreditCardPaymentPage"));
const CouponsPage = lazy(() => import("./pages/CouponsPage"));
const MyFeedbacksPage = lazy(() => import("./pages/MyFeedbacksPage"));
const VideosPage = lazy(() => import("./pages/VideosPage"));
const ExternalGameIframePage = lazy(() => import("./components/ExternalGameIframePage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

// Create QueryClient outside component to avoid hook issues
const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading, signOut } = useAuth();
  const [isStandalone, setIsStandalone] = useState(false);
  const { isNative, platform } = useCapacitor();
  const location = useLocation();
  
  // Track page views
  usePageTracking();
  
  // Track analytics visits
  useAnalyticsTracking();
  
  // Configure status bar for mobile
  useStatusBar();
  
  // Track authentication events for notifications
  useAuthNotifications();
  
  const logout = async () => {
    await signOut();
  };
  useEffect(() => {
    const check = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true ||
        isNative;
      setIsStandalone(standalone);
    };
    check();
    
    if (!isNative) {
      const mql = window.matchMedia('(display-mode: standalone)');
      const handler = () => check();
      mql.addEventListener('change', handler);
      window.addEventListener('appinstalled', check);
      return () => {
        mql.removeEventListener('change', handler);
        window.removeEventListener('appinstalled', check);
      };
    }
  }, [isNative]);

  if (loading) {
    return <LoadingScreen message="loading..." />;
  }

  // Hide chatbot on auth/admin and payment card page.
  // For /midasbuy/* country pages: show chatbot on the country home page, but hide on /buy/* flows.
  // Show on browser home page (/) only in standalone/PWA mode.
  const hideChatbotPrefixes = ['/auth', '/admin', '/api/auth', '/pay/card', '/payment/success'];
  const isMidasbuyBuyFlow =
    location.pathname === '/midasbuy/buy/pubgm' ||
    (location.pathname.startsWith('/midasbuy/') && location.pathname.includes('/buy/'));

  // Show chatbot: not on hidden prefixes, not on /midasbuy/*/buy/*, and either standalone mode OR not on home page
  const showChatbot =
    !hideChatbotPrefixes.some((prefix) => location.pathname.startsWith(prefix)) &&
    !isMidasbuyBuyFlow &&
    (isStandalone || location.pathname !== '/');

  return (
    <>
      <InternationalRedirect />
      {/* AI Chatbot Widget - appears on checkout, payment, and gaming shop pages */}
      {showChatbot && (
        <Suspense fallback={null}>
          <AIChatbotWidget />
        </Suspense>
      )}
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen message="loading..." />}>
            <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<GamingShopPage onLogout={logout} />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={
        <AdminRoute redirectTo="/">
          <AdminDashboardPage />
        </AdminRoute>
      } />
      {/* Redirect old /pubg-mobile to country-specific URL */}
      <Route path="/pubg-mobile" element={<PubgMobileRedirect />} />
      {/* Redirect old /free-fire to country-specific URL */}
      <Route path="/free-fire" element={<FreeFireRedirect />} />
      {/* Redirect old /bgmi to country-specific URL */}
      <Route path="/bgmi" element={<BGMIRedirect />} />
      {/* Redirect old /roblox to country-specific URL */}
      <Route path="/roblox" element={<RobloxRedirect />} />
      <Route path="/roblox/purchase/:id" element={<RobloxRedirect />} />
      <Route path="/roblox/checkout/:id" element={<RobloxRedirect />} />
      {/* Redirect old /valorant to country-specific URL */}
      <Route path="/valorant" element={<ValorantRedirect />} />
      <Route path="/valorant/purchase/:id" element={<ValorantRedirect />} />
      <Route path="/valorant/checkout/:id" element={<ValorantRedirect />} />
      {/* Redirect old /car-purchase to country-specific URL */}
      <Route path="/car-purchase" element={<CarPurchaseRedirect />} />
      <Route path="/purchase-history" element={<PurchaseHistoryPage onLogout={logout} />} />
      <Route path="/pubg-accounts" element={<PubgAccountsPage />} />
      <Route path="/pubg-accounts/checkout/:id" element={<PubgAccountCheckoutPage onLogout={logout} />} />
      <Route path="/gaming-shop" element={<Navigate to="/" replace />} />
      {/* Redirect old /honor-of-kings to country-specific URL */}
      <Route path="/honor-of-kings" element={<HonorOfKingsRedirect />} />
      
      {/* Old checkout routes - redirect to PUBG page */}
      <Route path="/player-id" element={<PubgMobileRedirect />} />
      <Route path="/purchase/:id" element={<PubgMobileRedirect />} />
      <Route path="/checkout/:id" element={<PubgMobileRedirect />} />
      <Route path="/thankyou" element={<Navigate to="/thank-you" replace />} />
      <Route path="/events" element={<Navigate to="/" replace />} />
      <Route path="/redeem" element={<RedeemPage onLogout={logout} />} />
      
      {/* PUBG Mobile Purchase Route */}
      <Route path="/midasbuy/buy/pubgm" element={<Index onLogout={logout} />} />
      
      {/* Country-specific Home Page Route */}
      <Route path="/midasbuy/:countryCode" element={<CountryHomePage onLogout={logout} />} />
      
      {/* Country-specific PUBG Mobile Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/pubgm" element={<CountryPubgPage onLogout={logout} />} />
      
      {/* Country-specific Free Fire Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/freefire" element={<CountryFreeFirePage onLogout={logout} />} />
      
      {/* Country-specific Roblox Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/roblox" element={<CountryRobloxPage onLogout={logout} />} />
      
      {/* Country-specific Valorant Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/valorant" element={<CountryValorantPage onLogout={logout} />} />
      
      {/* Country-specific BGMI Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/bgmi" element={<BGMIPage onLogout={logout} />} />
      
      {/* Country-specific Honor of Kings Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/honorofkings" element={<HonorOfKingsPage onLogout={logout} />} />
      
      {/* Country-specific Car Purchase Route */}
      <Route path="/midasbuy/:countryCode/buy/car" element={<CountryCarPurchasePage onLogout={logout} />} />
      
      {/* External Game Iframe Routes - Games that embed official Midasbuy pages */}
      <Route path="/midasbuy/:countryCode/game/honorofkings" element={<ExternalGameIframePage gameKey="honorofkings" />} />
      <Route path="/midasbuy/:countryCode/game/deltaforce" element={<ExternalGameIframePage gameKey="deltaforce" />} />
      <Route path="/midasbuy/:countryCode/game/dragonheir" element={<ExternalGameIframePage gameKey="dragonheir" />} />
      <Route path="/midasbuy/:countryCode/game/undawn" element={<ExternalGameIframePage gameKey="undawn" />} />
      <Route path="/midasbuy/:countryCode/game/arenabreakout" element={<ExternalGameIframePage gameKey="arenabreakout" />} />
      <Route path="/midasbuy/:countryCode/game/nba" element={<ExternalGameIframePage gameKey="nba" />} />
      <Route path="/midasbuy/:countryCode/game/ludo" element={<ExternalGameIframePage gameKey="ludo" />} />
      
      {/* Free Fire Purchase Route */}
      <Route path="/midasbuy/buy/freefire" element={<FreeFire onLogout={logout} />} />
      
      {/* Honor of Kings checkout routes redirected */}
      <Route path="/honor-of-kings/purchase/:id" element={<HonorOfKingsRedirect />} />
      {/* Free Fire checkout routes redirected to country-specific page */}
      <Route path="/purchase/free-fire/:id" element={<FreeFireRedirect />} />
      <Route path="/checkout/free-fire/:id" element={<FreeFireRedirect />} />
      <Route path="/help-center" element={<HelpCenterPage onLogout={logout} />} />
      <Route path="/my-feedbacks" element={<MyFeedbacksPage onLogout={logout} />} />
      <Route path="/contact-us" element={<ContactUsPage onLogout={logout} />} />
      <Route path="/faqs" element={<FAQsPage onLogout={logout} />} />
      <Route path="/careers" element={<CareersPage onLogout={logout} />} />
      <Route path="/about-midasbuy" element={<AboutMidasbuyPage onLogout={logout} />} />
      <Route path="/press" element={<PressPage onLogout={logout} />} />
      <Route path="/partners" element={<PartnersPage onLogout={logout} />} />
      <Route path="/copyright-notice" element={<CopyrightNoticePage onLogout={logout} />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage onLogout={logout} />} />
      <Route path="/refund-policy" element={<RefundPolicyPage onLogout={logout} />} />
      <Route path="/payment-issues" element={<PaymentIssuesPage onLogout={logout} />} />
      <Route path="/security" element={<SecurityPage onLogout={logout} />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage onLogout={logout} />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage onLogout={logout} />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/shop/videos" element={<VideosPage onLogout={logout} />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/ip-detector" element={<IPDetectorPage onLogout={logout} />} />
      <Route path="/customer-reviews" element={<CustomerReviewsPage onLogout={logout} />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/coupons" element={<CouponsPage onLogout={logout} />} />
      <Route path="/payment-success" element={<OrderThankYouPage onLogout={logout} />} />
      <Route path="/payment-canceled" element={<PaymentCanceledPage onLogout={logout} />} />
      <Route path="/payment/failed" element={<PaymentFailedPage onLogout={logout} />} />
      <Route path="/payment/success" element={<OrderThankYouPage onLogout={logout} />} />
      <Route path="/payment/paypro-return" element={<PayProReturnPage onLogout={logout} />} />
      <Route path="/thank-you" element={<OrderThankYouPage onLogout={logout} />} />
      <Route path="/order-cancelled" element={<OrderThankYouPage onLogout={logout} />} />
      <Route path="/order-center" element={<OrderCenterPage onLogout={logout} />} />
      <Route path="/track-orders" element={<Navigate to="/order-center" replace />} />
      <Route path="/api/auth/callback/google" element={<GoogleAuthCallbackPage />} />
      <Route path="/auth/callback" element={<GoogleAuthCallbackPage />} />
      <Route path="/pay/card" element={<CreditCardPaymentPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <AuthModalProvider>
              <NotificationProvider>
                <LocalizationProvider>
                  <InternetConnectionChecker />
                  <GlobalPushPrompt />
                  {/* <AppInstallNotification /> */}
                  <Toaster />
                  <Sonner />
                  <AppRoutes />
                  <AuthModal />
                  <CookieConsent />
                </LocalizationProvider>
              </NotificationProvider>
            </AuthModalProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;

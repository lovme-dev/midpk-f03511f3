import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "@/lib/helmet";
import { useEffect, useState, lazy, Suspense } from "react";
import appCss from "../styles.css?url";

import { AuthProvider } from "@/hooks/useAuth";
import { NotificationProvider } from "@/hooks/useNotifications";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import InternetConnectionChecker from "@/components/InternetConnectionChecker";
import InternationalRedirect from "@/components/InternationalRedirect";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GlobalPushPrompt } from "@/components/push/GlobalPushPrompt";
import LoadingScreen from "@/components/LoadingScreen";
import NotFound from "@/pages/NotFound";
import { useLocation } from "@/lib/router-compat";
import { useAuth } from "@/hooks/useAuth";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useAnalyticsTracking } from "@/hooks/useAnalyticsTracking";
import { useStatusBar } from "@/hooks/useStatusBar";
import { useAuthNotifications } from "@/hooks/useAuthNotifications";
import { useCapacitor } from "@/hooks/useCapacitor";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import "@/i18n/config";

const AIChatbotWidget = lazy(() =>
  import("@/components/AIChatbotWidget").then((m) => ({ default: m.AIChatbotWidget })),
);

const TITLE = "Midasbuy — Official PUBG Mobile UC Top Up Store";
const DESCRIPTION =
  "Buy PUBG Mobile UC on Midasbuy. Up to 60% off, instant delivery in 2 minutes and secure local payments trusted by 10M+ gamers worldwide.";
const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/O1Gyf4pVPFQWKdlDIH5FwjUBnsM2/social-images/social-1771300303076-IMG_3216.webp";

// ported from index.html — dynamic canonical / title per country URL
const DYNAMIC_SEO_SCRIPT = `(function(){var baseUrl='https://www.midasbuy.com.pk';function normalizePath(p){if(!p)return '/';return p.length>1&&p.endsWith('/')?p.slice(0,-1):p;}function upsertMeta(sel,an,av,c){var el=document.querySelector(sel);if(!el){el=document.createElement('meta');el.setAttribute(an,av);document.head.appendChild(el);}el.setAttribute('content',c);}function upsertCanonical(href){var el=document.getElementById('canonical-link');if(!el){el=document.createElement('link');el.setAttribute('id','canonical-link');el.setAttribute('rel','canonical');document.head.appendChild(el);}el.setAttribute('href',href);}function applyDynamicSeo(){var path=normalizePath(window.location.pathname||'/');var canonicalHref=baseUrl+path;upsertCanonical(canonicalHref);upsertMeta('meta#og-url-meta, meta[property="og:url"]','property','og:url',canonicalHref);var CN={pk:'Pakistan',in:'India',us:'United States',bd:'Bangladesh',ae:'UAE',sa:'Saudi Arabia',gb:'United Kingdom',de:'Germany',fr:'France',tr:'Turkey',id:'Indonesia',my:'Malaysia',ph:'Philippines',th:'Thailand',vn:'Vietnam',jp:'Japan',kr:'South Korea',br:'Brazil',eg:'Egypt',iq:'Iraq',ng:'Nigeria',za:'South Africa',au:'Australia',ca:'Canada',es:'Spain',it:'Italy',nl:'Netherlands',ru:'Russia',np:'Nepal',lk:'Sri Lanka',af:'Afghanistan'};var GM={pubgm:'PUBG Mobile UC',freefire:'Free Fire Diamonds',roblox:'Roblox Robux',valorant:'Valorant Points',car:'PUBG Car Skins'};var parts=path.split('/');if(parts[1]==='midasbuy'&&parts[2]){var cc=parts[2].toLowerCase();var country=CN[cc]||cc.toUpperCase();var game=parts[4]?GM[parts[4]]:null;var t='',d='';if(game){t='Buy '+game+' in '+country+' | 60% OFF Instant Delivery | Midasbuy';d='Buy '+game+' in '+country+' at the cheapest price. Up to 60% discount + VIP bonus, instant delivery, secure payments.';}else{t="Tencent's official recharge, top-up and redeem "+country+' | Midasbuy';d='Midasbuy '+country+' official store. Buy gaming credits at best prices with fast delivery and secure payment methods.';}document.title=t;upsertMeta('meta[name="description"]','name','description',d);upsertMeta('meta[property="og:title"]','property','og:title',t);upsertMeta('meta[property="og:description"]','property','og:description',d);upsertMeta('meta[name="twitter:title"]','name','twitter:title',t);upsertMeta('meta[name="twitter:description"]','name','twitter:description',d);}}applyDynamicSeo();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',applyDynamicSeo,{once:true});}else{setTimeout(applyDynamicSeo,0);}})();`;

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Midasbuy",
      legalName: "Midasbuy",
      alternateName: ["Midasbuy Official", "Midasbuy Store", "Midasbuy Official Store", "Middasbuy", "Midasbuy Gaming"],
      url: "https://www.midasbuy.com.pk",
      logo: "https://www.midasbuy.com.pk/favicon.png",
      description:
        "Midasbuy is the official PUBG Mobile UC top-up platform and trusted gaming store. Buy cheap UC with instant delivery.",
      sameAs: ["https://www.facebook.com/midasbuy", "https://x.com/midasbuy", "https://www.instagram.com/midasbuy"],
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "500000", bestRating: "5" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.midasbuy.com.pk/#website",
      name: "Midasbuy",
      url: "https://www.midasbuy.com.pk",
      inLanguage: "en",
      copyrightYear: 2020,
    },
    {
      "@type": "LocalBusiness",
      name: "Midasbuy Official Store",
      priceRange: "$1-$500",
      paymentAccepted: "Stripe, Credit Card, Debit Card, JazzCash, EasyPaisa",
      openingHours: "Mo-Su 00:00-23:59",
      email: "support@midasbuy.com.pk",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Gulberg III",
        addressLocality: "Lahore",
        addressRegion: "Punjab",
        postalCode: "54000",
        addressCountry: "PK",
      },
    },
  ],
});

const PWA_PROMPT_SCRIPT = `window.__pwaInstallPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;});`;

const ANTI_INSPECT_SCRIPT = `(function(){var ua=(navigator.userAgent||'').toLowerCase();var isBot=/bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|embedly|whatsapp|applebot|pinterest|redditbot|telegrambot|discordbot|ia_archiver|chatgpt|gptbot|claudebot|perplexitybot|ccbot/i.test(ua);if(isBot)return;document.addEventListener('contextmenu',function(e){e.preventDefault();return false;},{capture:true});document.addEventListener('dragstart',function(e){if(e.target&&e.target.tagName==='IMG')e.preventDefault();},{capture:true});document.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if(e.key==='F12'){e.preventDefault();return false;}if(e.ctrlKey&&k==='u'){e.preventDefault();return false;}if(e.ctrlKey&&k==='s'){e.preventDefault();return false;}if((e.ctrlKey&&e.shiftKey)&&['i','j','c','k'].indexOf(k)!==-1){e.preventDefault();return false;}if(e.metaKey&&e.altKey&&['i','j','c'].indexOf(k)!==-1){e.preventDefault();return false;}if(e.metaKey&&k==='u'){e.preventDefault();return false;}},{capture:true});try{var h=location.hostname;if(h&&h.indexOf('lovable')===-1&&h.indexOf('localhost')===-1){var noop=function(){};['log','info','warn','error','debug','table','trace'].forEach(function(m){try{console[m]=noop;}catch(_){}}); }}catch(_){}})();`;

const TIKTOK_PIXEL = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('D62IRV3C77U69UNGJPLG');ttq.page();}(window,document,'ttq');`;

const GTAG_INLINE = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-D152QYKZPQ');gtag('config','G-V58GVVDSKB');`;

// Third-party marketing/analytics tags are heavy; load them only once the page
// is idle (or on first user interaction) so they never block first paint.
const DEFERRED_THIRD_PARTY = `(function(){var done=false;function boot(){if(done)return;done=true;
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-D152QYKZPQ';document.head.appendChild(s);
var g=document.createElement('script');g.text=${JSON.stringify(GTAG_INLINE)};document.head.appendChild(g);
var t=document.createElement('script');t.text=${JSON.stringify(TIKTOK_PIXEL)};document.head.appendChild(t);
var a=document.createElement('script');a.async=true;a.crossOrigin='anonymous';a.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3756302413439008';document.head.appendChild(a);}
['pointerdown','keydown','touchstart','scroll'].forEach(function(e){window.addEventListener(e,boot,{once:true,passive:true});});
var start=function(){ (window.requestIdleCallback||function(f){setTimeout(f,2500);})(boot,{timeout:5000}); };
if(document.readyState==='complete'){start();}else{window.addEventListener('load',start,{once:true});}})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" },
      { title: TITLE },
      { name: "title", content: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Midasbuy" },
      {
        name: "keywords",
        content:
          "midasbuy, midasbuy official, midasbuy.com.pk, midasbuy store, midasbuy pubg, midasbuy uc, buy uc midasbuy, midasbuy pakistan, cheap pubg uc, buy pubg uc online, midasbuy top up",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "bingbot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "application-name", content: "Midasbuy" },
      { name: "generator", content: "Midasbuy" },
      { name: "classification", content: "Gaming Store, Digital Products, Mobile Gaming" },
      { name: "category", content: "Gaming" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "rating", content: "General" },
      { name: "geo.region", content: "PK;IN;US" },
      { name: "geo.placename", content: "Pakistan;India;United States" },
      { name: "theme-color", content: "#050505" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Midasbuy" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Midasbuy Official Store" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "200" },
      { property: "og:image:height", content: "200" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/apple-touch-icon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "apple-touch-icon", sizes: "192x192", href: "/icon-192.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preload", as: "image", href: "/images/extra-discount-badge.png" },
      { rel: "preload", as: "image", href: "/images/extra-bonus-badge.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3756302413439008",
        async: true,
        crossOrigin: "anonymous",
      },
      { src: "https://js.xstak.com/v4/xpay.js", defer: true },
      { src: "https://www.googletagmanager.com/gtag/js?id=G-D152QYKZPQ", async: true },
      { children: GTAG_INLINE },
      { children: TIKTOK_PIXEL },
      { children: DYNAMIC_SEO_SCRIPT },
      { children: PWA_PROMPT_SCRIPT },
      { children: ANTI_INSPECT_SCRIPT },
      { type: "application/ld+json", children: JSON_LD },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body style={{ backgroundColor: "#13182B" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  const { loading } = useAuth();
  const [isStandalone, setIsStandalone] = useState(false);
  const { isNative } = useCapacitor();
  const location = useLocation();

  usePageTracking();
  useAnalyticsTracking();
  useStatusBar();
  useAuthNotifications();

  useEffect(() => {
    // ported from main.tsx — interaction prevention + service worker lifecycle
    let cleanup: (() => void) | undefined;
    import("@/utils/preventInteractions").then((m) => m.initializeInteractionPrevention());

    if ("serviceWorker" in navigator) {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      } else {
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      }
    }
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    const check = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        isNative;
      setIsStandalone(standalone);
    };
    check();

    if (!isNative) {
      const mql = window.matchMedia("(display-mode: standalone)");
      const handler = () => check();
      mql.addEventListener("change", handler);
      window.addEventListener("appinstalled", check);
      return () => {
        mql.removeEventListener("change", handler);
        window.removeEventListener("appinstalled", check);
      };
    }
    return undefined;
  }, [isNative]);

  if (loading) {
    return <LoadingScreen message="loading..." />;
  }

  const hideChatbotPrefixes = ["/auth", "/admin", "/api/auth", "/pay/card", "/payment/success"];
  const isMidasbuyBuyFlow =
    location.pathname === "/midasbuy/buy/pubgm" ||
    (location.pathname.startsWith("/midasbuy/") && location.pathname.includes("/buy/"));

  const showChatbot =
    !hideChatbotPrefixes.some((prefix) => location.pathname.startsWith(prefix)) &&
    !isMidasbuyBuyFlow &&
    (isStandalone || location.pathname !== "/");

  return (
    <>
      <InternationalRedirect />
      {showChatbot && (
        <Suspense fallback={null}>
          <AIChatbotWidget />
        </Suspense>
      )}
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen message="loading..." />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <AuthModalProvider>
            <NotificationProvider>
              <LocalizationProvider>
                <InternetConnectionChecker />
                <GlobalPushPrompt />
                <Toaster />
                <Sonner />
                <AppShell />
                <AuthModal />
                <CookieConsent />
              </LocalizationProvider>
            </NotificationProvider>
          </AuthModalProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-foreground">
      <h1 className="text-2xl font-semibold">This page didn't load</h1>
      <p className="max-w-md text-center text-muted-foreground">
        Something went wrong while loading this page. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
        <a className="rounded-md border border-border px-4 py-2" href="/">
          Go home
        </a>
      </div>
    </div>
  );
}

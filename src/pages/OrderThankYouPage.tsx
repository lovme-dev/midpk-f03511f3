import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Phone, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { 
  getPageTranslation, 
  getPageTranslationByCurrency, 
  isRTLLanguage, 
  isRTLByCurrency,
  getLanguageName,
  CURRENCY_TO_COUNTRY
} from "@/utils/pageTranslations";

interface OrderThankYouPageProps {
  onLogout: () => void;
}

export default function OrderThankYouPage({ onLogout }: OrderThankYouPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const hasSentRefundEmailRef = useRef(false);
  const [currencyCode, setCurrencyCode] = useState<string | null>(null);
  const [headerCountryCode, setHeaderCountryCode] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    orderId: searchParams.get("orderId") || "MB" + Date.now(),
    amount: searchParams.get("amount") || "0",
    item: searchParams.get("item") || "Gaming Package",
    status: searchParams.get("status") || "cancelled",
    paymentMethod: searchParams.get("method") || "PayFast",
    transactionId: searchParams.get("txnId") || "TXN" + Date.now(),
  });
  
  // Listen to header country changes
  useEffect(() => {
    const getCountryFromStorage = () => {
      const storedCountry = localStorage.getItem('selectedCountry');
      if (storedCountry) {
        try {
          const parsed = JSON.parse(storedCountry);
          return parsed.code?.toUpperCase() || null;
        } catch {
          return null;
        }
      }
      return null;
    };
    
    // Set initial value
    setHeaderCountryCode(getCountryFromStorage());
    
    // Listen for country changes from Header
    const handleCountryChange = () => {
      setHeaderCountryCode(getCountryFromStorage());
    };
    
    window.addEventListener('countryChanged', handleCountryChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'selectedCountry') {
        handleCountryChange();
      }
    });
    
    return () => {
      window.removeEventListener('countryChanged', handleCountryChange);
    };
  }, []);
  
  // Detect country from URL path (e.g., /midasbuy/pk)
  const detectedCountryCode = useMemo(() => {
    // PRIORITY 1: Header country selection (user manually changed)
    if (headerCountryCode) {
      return headerCountryCode;
    }
    
    // PRIORITY 2: Try to get from localStorage currency (set during checkout)
    const storedCurrency = localStorage.getItem('lastOrderCurrency');
    if (storedCurrency) {
      return CURRENCY_TO_COUNTRY[storedCurrency.toUpperCase()] || null;
    }
    
    // PRIORITY 3: Try to detect from URL
    const pathMatch = location.pathname.match(/\/midasbuy\/([a-z]{2})/i);
    if (pathMatch) {
      return pathMatch[1].toUpperCase();
    }
    
    // PRIORITY 4: Try from stored country
    const storedCountry = localStorage.getItem('selectedCountry');
    if (storedCountry) {
      try {
        const parsed = JSON.parse(storedCountry);
        return parsed.code?.toUpperCase() || null;
      } catch {
        return null;
      }
    }
    
    return null;
  }, [location.pathname, headerCountryCode]);
  
  // Get translation based on header country (PRIORITY) > currency > detected country
  const translation = useMemo(() => {
    // If header country is set by user, use that language
    if (headerCountryCode) {
      return getPageTranslation(headerCountryCode);
    }
    // Otherwise use currency-based or detected
    if (currencyCode) {
      return getPageTranslationByCurrency(currencyCode);
    }
    if (detectedCountryCode) {
      return getPageTranslation(detectedCountryCode);
    }
    return getPageTranslation('US');
  }, [currencyCode, detectedCountryCode, headerCountryCode]);
  
  // Check if RTL based on header country or detected
  const isRTL = useMemo(() => {
    if (headerCountryCode) {
      return isRTLLanguage(headerCountryCode);
    }
    if (currencyCode) {
      return isRTLByCurrency(currencyCode);
    }
    return isRTLLanguage(detectedCountryCode);
  }, [currencyCode, detectedCountryCode, headerCountryCode]);
  
  // Get language info for display
  const langInfo = useMemo(() => {
    const countryCode = headerCountryCode || (currencyCode ? CURRENCY_TO_COUNTRY[currencyCode.toUpperCase()] : detectedCountryCode);
    return getLanguageName(countryCode);
  }, [currencyCode, detectedCountryCode, headerCountryCode]);

  // Restore auth session and update order status when returning from payment gateway
  useEffect(() => {
    const restoreSessionAndUpdateOrder = async () => {
      // First try to get existing session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Try to refresh the session if no active session
        await supabase.auth.refreshSession();
      }

      setIsAuthReady(true);

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Helper to get country code from currency code
      const getCountryFromCurrency = (currencyCode: string): string => {
        const currencyToCountry: Record<string, string> = {
          'PKR': 'PK', 'USD': 'US', 'EUR': 'DE', 'GBP': 'GB', 'RUB': 'RU',
          'INR': 'IN', 'AED': 'AE', 'SAR': 'SA', 'BDT': 'BD', 'MYR': 'MY',
          'IDR': 'ID', 'PHP': 'PH', 'THB': 'TH', 'VND': 'VN', 'TRY': 'TR',
          'JPY': 'JP', 'CNY': 'CN', 'KRW': 'KR', 'KZT': 'KZ', 'BRL': 'BR',
          'ARS': 'AR', 'CLP': 'CL', 'COP': 'CO', 'PEN': 'PE', 'MXN': 'MX',
          'ZAR': 'ZA', 'NGN': 'NG', 'EGP': 'EG', 'PLN': 'PL', 'CZK': 'CZ',
          'HUF': 'HU', 'RON': 'RO', 'BGN': 'BG', 'UAH': 'UA', 'SEK': 'SE',
          'NOK': 'NO', 'DKK': 'DK', 'CHF': 'CH', 'SGD': 'SG', 'HKD': 'HK',
          'TWD': 'TW', 'NZD': 'NZ', 'AUD': 'AU', 'CAD': 'CA', 'IRR': 'IR',
          'ILS': 'IL', 'JOD': 'JO', 'KWD': 'KW', 'QAR': 'QA', 'BHD': 'BH',
          'OMR': 'OM', 'LBP': 'LB', 'IQD': 'IQ', 'NPR': 'NP', 'LKR': 'LK',
          'AFN': 'AF', 'MMK': 'MM', 'KHR': 'KH', 'LAK': 'LA', 'MNT': 'MN',
          'UZS': 'UZ', 'AZN': 'AZ', 'GEL': 'GE', 'AMD': 'AM', 'KES': 'KE',
          'GHS': 'GH', 'TZS': 'TZ', 'UGX': 'UG', 'ETB': 'ET', 'RWF': 'RW',
          'XOF': 'SN', 'MAD': 'MA', 'DZD': 'DZ', 'TND': 'TN', 'AOA': 'AO',
          'MZN': 'MZ', 'ZWL': 'ZW', 'ZMW': 'ZM', 'BWP': 'BW', 'NAD': 'NA',
          'MUR': 'MU', 'MGA': 'MG', 'CDF': 'CD', 'XAF': 'CM', 'GTQ': 'GT',
          'HNL': 'HN', 'NIO': 'NI', 'CRC': 'CR', 'PAB': 'PA', 'JMD': 'JM',
          'TTD': 'TT', 'DOP': 'DO', 'HTG': 'HT', 'UYU': 'UY', 'PYG': 'PY',
          'BOB': 'BO', 'VES': 'VE', 'GYD': 'GY', 'SRD': 'SR', 'FJD': 'FJ',
        };
        return currencyToCountry[currencyCode?.toUpperCase()] || 'US';
      };

      const sendRefundEmail = async (order: any, finalStatus: string) => {
        if (hasSentRefundEmailRef.current) return;
        if (finalStatus !== "cancelled" && finalStatus !== "failed") return;

        hasSentRefundEmailRef.current = true;

        // Get country code from currency for language detection
        const countryCode = getCountryFromCurrency(order.currency_code || "PKR");

        try {
          await supabase.functions.invoke("send-order-email", {
            body: {
              userId: user.id,
              orderId: order.id,
              emailType: "refund",
              orderDetails: {
                packageName: order.product_name || order.uc_packages?.name || "Package",
                ucAmount:
                  order.uc_packages?.uc_amount ||
                  parseInt(order.product_amount || "0") ||
                  0,
                price: order.price || 0,
                paymentMethod: order.payment_method || "Unknown",
                playerId: order.player_id || "",
                transactionId: basketId || order.transaction_id || order.id,
                productType: order.product_type || undefined,
                productName: order.product_name || undefined,
                productCode: order.product_code || undefined,
                productAmount: order.product_amount || undefined,
                currencyCode: order.currency_code || "PKR",
                countryCode: countryCode, // For language detection
              },
            },
          });
          console.log("[payment-success] refund email triggered for order:", order.id, "language country:", countryCode);
        } catch (emailError) {
          console.error("[payment-success] failed to send refund email:", emailError);
        }
      };

      // Try to identify the exact order (gateway usually returns basket_id / transaction_id)
      const basketId =
        searchParams.get("transaction_id") ||
        searchParams.get("basket_id") ||
        searchParams.get("basketId") ||
        searchParams.get("transactionId") ||
        searchParams.get("m_payment_id") ||
        "";

      // 1) Find order by transaction_id (preferred)
      let order: any = null;
      if (basketId) {
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select(
            "id, status, price, currency_code, player_id, payment_method, product_name, product_type, product_code, product_amount, transaction_id, email_sent_at, uc_packages(name, uc_amount), created_at"
          )
          .eq("user_id", user.id)
          .eq("transaction_id", basketId)
          .maybeSingle();

        if (orderError) console.error("[payment-success] order lookup error:", orderError);
        if (orderData) order = orderData;
      }

      // 2) Fallback: most recent pending order for this user
      if (!order) {
        const { data: recentOrder, error: recentError } = await supabase
          .from("orders")
          .select(
            "id, status, price, currency_code, player_id, payment_method, product_name, product_type, product_code, product_amount, transaction_id, email_sent_at, uc_packages(name, uc_amount), created_at"
          )
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recentError) console.error("[payment-success] recent order lookup error:", recentError);
        if (recentOrder) order = recentOrder;
      }

      if (order && order.status === "pending") {
        const newStatus = "cancelled"; // refund pending tab

        const { error: updateError } = await supabase
          .from("orders")
          .update({
            transaction_id: basketId || order.transaction_id,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        if (updateError) {
          console.error("[payment-success] failed to update order status:", updateError);
          return;
        }

        // Notify admin + log into admin_notification_history
        try {
          await supabase.functions.invoke("notify-admin-new-order", {
            body: {
              event_type: "order_cancelled",
              order_details: {
                order_id: order.id,
                package_name: order.product_name || order.uc_packages?.name || "Package",
                price: order.price,
                currency_code: order.currency_code || "PKR",
                player_id: order.player_id,
                payment_method: order.payment_method || "gopayfast",
                status: newStatus,
              },
            },
          });
        } catch (notifyError) {
          console.error("[payment-success] failed to notify admin:", notifyError);
        }

        // Send refund email on /payment/success as well (for cancelled/failed states)
        await sendRefundEmail(order, newStatus);
        // Set currency code for translation
        if (order.currency_code) {
          setCurrencyCode(order.currency_code);
        }

        console.log("Order marked as cancelled (refund pending):", order.id);
      }

      // If order was already cancelled/failed before user landed here, still trigger refund email
      if (order && (order.status === "cancelled" || order.status === "failed")) {
        await sendRefundEmail(order, order.status);
      }
    };

    restoreSessionAndUpdateOrder();
  }, [searchParams]);

  useEffect(() => {
    // Only fetch user name after auth is ready
    if (!isAuthReady) return;
    
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name.split(' ')[0]); // Get first name
        }
      }
    };
    fetchUserName();
  }, [isAuthReady]);

  useEffect(() => {
    // Analytics tracking for cancelled order
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase_cancelled', {
        transaction_id: orderDetails.orderId,
        value: parseFloat(orderDetails.amount),
        currency: 'PKR',
        items: [{
          item_id: orderDetails.orderId,
          item_name: orderDetails.item,
          category: 'Gaming',
          quantity: 1,
          price: parseFloat(orderDetails.amount)
        }]
      });
    }
  }, [orderDetails]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleContactSupport = () => {
    navigate("/contact-us");
  };

  return (
    <>
      <Helmet>
        <title>Order Cancelled - Payment Processing | MidasBuy</title>
        <meta name="description" content="Your order has been cancelled due to technical issues. Refund processing information and support contact details." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-midasbuy-darkBlue via-midasbuy-navy to-midasbuy-darkBlue">
        <Header onLogout={onLogout} />
        
        <div className="relative pt-16 pb-8 px-3" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-lg mx-auto">
            {/* Compact Header: Icon + Title in one line */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <img src="/images/payment-cancel-icon.png" alt="Payment Cancelled" className="w-12 h-12 object-contain flex-shrink-0" />
              <h1 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">
                {translation.orderCancelledTitle}
              </h1>
            </motion.div>

            {/* Single unified card with all info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white/8 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-4"
            >
              <p className="text-gray-300 text-sm mb-3">
                {translation.orderCancelledSubtitle}
              </p>

              <p className="text-sm text-gray-200 mb-2">
                <span className="text-white font-medium">{translation.dearCustomer}{userName ? ` ${userName}` : ''},</span> {translation.cancelledMessage1}
              </p>

              {/* Refund Info - inline compact */}
              <div className={`bg-white/5 rounded-lg p-3 mb-2 ${isRTL ? 'border-r-2 border-blue-400' : 'border-l-2 border-blue-400'}`}>
                <p className={`text-white text-xs font-semibold mb-1 flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                  {translation.refundProcessTitle}
                </p>
                <div className="text-gray-300 text-xs space-y-0.5 leading-relaxed">
                  <p>• {translation.refundPoint1}</p>
                  <p>• {translation.refundPoint2}</p>
                  <p>• {translation.refundPoint3}</p>
                  <p>• {translation.refundPoint4}</p>
                </div>
              </div>

              {/* If no refund - compact */}
              <div className={`bg-red-500/10 rounded-lg p-3 mb-2 ${isRTL ? 'border-r-2 border-red-400/60' : 'border-l-2 border-red-400/60'}`}>
                <p className={`text-white text-xs font-semibold mb-1 flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-red-400/70" />
                  {translation.ifNoRefundTitle}
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {translation.ifNoRefundMessage}
                </p>
              </div>

              <p className="text-center text-gray-400 text-xs italic">
                {translation.trustMessage}
              </p>
            </motion.div>

            {/* Buttons - compact row */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-2"
            >
              {/* Track Refund - brand gradient */}
              <Button
                onClick={() => navigate("/track-orders?tab=pending")}
                className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:opacity-90 text-white h-9 text-xs font-medium overflow-hidden"
              >
                <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                <span className="truncate">{translation.trackRefundStatus}</span>
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="flex-1 border-white/20 bg-white/10 text-white hover:bg-white/20 h-8 text-xs overflow-hidden"
                >
                  <Home className={`w-3.5 h-3.5 flex-shrink-0 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span className="truncate">{translation.backToHome}</span>
                </Button>
                
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10 h-8 text-xs overflow-hidden"
                >
                  <Phone className={`w-3.5 h-3.5 flex-shrink-0 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span className="truncate">{translation.contactSupport}</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
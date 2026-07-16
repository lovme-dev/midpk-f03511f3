import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ArrowLeft, Home, Loader2, RefreshCw, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { ttqPurchase } from "@/utils/tiktokTracking";

interface PayProReturnPageProps {
  onLogout: () => void;
}

type OrderStatus = "pending" | "completed" | "cancelled" | "failed" | "unknown";

const PayProReturnPage = ({ onLogout }: PayProReturnPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get("order");
  const payproStatus = searchParams.get("status"); // "success" or "failed" from PayPro redirect
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("pending");
  const [isPolling, setIsPolling] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const MAX_POLL_COUNT = 24; // 2 minutes at 5 second intervals
  const POLL_INTERVAL = 5000; // 5 seconds

  // Fetch order status
  const fetchOrderStatus = useCallback(async () => {
    if (!orderId) {
      setError("No order ID provided");
      setIsPolling(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("transaction_id", orderId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching order:", fetchError);
        setError("Failed to fetch order status");
        return;
      }

      if (!data) {
        console.log("Order not found yet, continuing to poll...");
        return;
      }

      setOrderDetails(data);

      if (data.status === "completed") {
        setOrderStatus("completed");
        setIsPolling(false);
        console.log("Order completed!");
        
        // TikTok: Track Purchase event on successful payment
        ttqPurchase({
          contentId: data.transaction_id || orderId || 'unknown',
          contentName: data.product_name || 'PUBG UC',
          value: data.price || 0,
          currency: data.currency_code || 'USD'
        });
      } else if (data.status === "cancelled" || data.status === "failed") {
        setOrderStatus(data.status as OrderStatus);
        setIsPolling(false);
      } else {
        setOrderStatus("pending");
      }
    } catch (err) {
      console.error("Error in fetchOrderStatus:", err);
    }
  }, [orderId]);

  // Polling effect
  useEffect(() => {
    if (!isPolling) return;

    // Initial fetch
    fetchOrderStatus();

    const intervalId = setInterval(() => {
      setPollCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= MAX_POLL_COUNT) {
          setIsPolling(false);
          clearInterval(intervalId);
          return newCount;
        }
        fetchOrderStatus();
        return newCount;
      });
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isPolling, fetchOrderStatus]);

  // If PayPro explicitly said "failed" and we haven't found a completed order
  useEffect(() => {
    if (payproStatus === "failed" && orderStatus === "pending" && pollCount > 3) {
      setOrderStatus("failed");
      setIsPolling(false);
    }
  }, [payproStatus, orderStatus, pollCount]);

  const handleRetry = () => {
    setIsPolling(true);
    setPollCount(0);
    setError(null);
    setOrderStatus("pending");
    fetchOrderStatus();
  };

  const renderContent = () => {
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
            <Button onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </motion.div>
      );
    }

    if (orderStatus === "completed") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckCircle className="w-14 h-14 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-6">
            Your order has been confirmed and UC will be delivered shortly.
          </p>
          
          {orderDetails && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left max-w-sm mx-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-white font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Product:</span>
                  <span className="text-white">{orderDetails.product_name || "PUBG UC"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-green-400">${orderDetails.price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Player ID:</span>
                  <span className="text-white">{orderDetails.player_id}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/purchase-history")} variant="outline" className="gap-2">
              View Order History
            </Button>
            <Button onClick={() => navigate("/")} className="gap-2 bg-midasbuy-blue hover:bg-midasbuy-blue/90">
              <Home className="w-4 h-4" />
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      );
    }

    if (orderStatus === "failed" || orderStatus === "cancelled") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment {orderStatus === "cancelled" ? "Cancelled" : "Failed"}</h1>
          <p className="text-gray-400 mb-6">
            {orderStatus === "cancelled" 
              ? "Your payment was cancelled. No charges were made."
              : "There was an issue processing your payment. Please try again."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={() => navigate("/contact-us")} className="gap-2">
              <HeadphonesIcon className="w-4 h-4" />
              Contact Support
            </Button>
          </div>
        </motion.div>
      );
    }

    // Pending / polling state
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-midasbuy-blue/20 flex items-center justify-center">
          {isPolling ? (
            <Loader2 className="w-12 h-12 text-midasbuy-blue animate-spin" />
          ) : (
            <Clock className="w-12 h-12 text-yellow-500" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          {isPolling ? "Verifying Payment..." : "Payment Pending"}
        </h1>
        
        <p className="text-gray-400 mb-4">
          {isPolling 
            ? "Please wait while we confirm your payment with the bank."
            : "Your payment is still being processed. This may take a few minutes."}
        </p>
        
        {isPolling && (
          <div className="mb-6">
            <div className="w-48 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
              <motion.div 
                className="h-full bg-midasbuy-blue"
                initial={{ width: "0%" }}
                animate={{ width: `${(pollCount / MAX_POLL_COUNT) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Checking... ({Math.ceil((MAX_POLL_COUNT - pollCount) * POLL_INTERVAL / 1000)}s remaining)
            </p>
          </div>
        )}

        {!isPolling && orderStatus === "pending" && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-yellow-400 text-sm">
              <strong>Don't worry!</strong> Your payment may still be processing. 
              If you were charged, your UC will be delivered automatically once the bank confirms the payment.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isPolling && (
            <Button onClick={handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Check Again
            </Button>
          )}
          <Button onClick={() => navigate("/purchase-history")} variant="outline" className="gap-2">
            View Orders
          </Button>
          <Button onClick={() => navigate("/contact-us")} className="gap-2">
            <HeadphonesIcon className="w-4 h-4" />
            Contact Support
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Payment Status | Midasbuy</title>
        <meta name="description" content="Checking your payment status" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-midasbuy-darkBlue via-midasbuy-darkBlue to-black">
        <Header onLogout={onLogout} />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-lg mx-auto">
            {/* Back link */}
            <Link 
              to="/"
              className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            {/* Main card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {renderContent()}
            </div>
            
            {/* Order ID display */}
            {orderId && (
              <p className="text-center text-gray-500 text-xs mt-4">
                Order Reference: {orderId}
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default PayProReturnPage;

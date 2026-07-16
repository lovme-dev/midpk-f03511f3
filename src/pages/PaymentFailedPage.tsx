import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Home, HelpCircle, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PaymentFailedPageProps {
  onLogout?: () => void;
}

const PaymentFailedPage = ({ onLogout }: PaymentFailedPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(true);
  
  // Extract payment failure details from URL params
  const errCode = searchParams.get('err_code') || '';
  const errMsg = searchParams.get('err_msg') || 'Transaction was not completed';
  const transactionId = searchParams.get('transaction_id') || '';
  const paymentName = searchParams.get('PaymentName') || searchParams.get('issuer_name') || '';
  const transactionAmount = searchParams.get('transaction_amount') || searchParams.get('merchant_amount') || '';
  const transactionCurrency = searchParams.get('transaction_currency') || 'PKR';

  // Get checkout path from localStorage (stored before payment)
  const [checkoutPath, setCheckoutPath] = useState('/');

  useEffect(() => {
    // First priority: Use the exact stored checkout path
    const storedPath = localStorage.getItem('lastCheckoutPath');
    if (storedPath) {
      setCheckoutPath(storedPath);
      return;
    }
    
    // Fallback: Determine by game type
    const lastGame = localStorage.getItem('lastCheckoutGame');
    if (lastGame === 'freefire') {
      setCheckoutPath('/free-fire/checkout');
    } else if (lastGame === 'roblox') {
      setCheckoutPath('/roblox/checkout');
    } else if (lastGame === 'pubg') {
      setCheckoutPath('/midasbuy/buy/pubgm');
    }
  }, []);

  // Update order status to 'failed' when landing on this page
  useEffect(() => {
    const updateOrderToFailed = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const basketId = searchParams.get("basketId") || searchParams.get("basket_id");
      
      let orderQuery = supabase
        .from('orders')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
      
      // If we have a basket ID (transaction ID), try to find that specific order
      if (basketId) {
        orderQuery = supabase
          .from('orders')
          .select('id, status')
          .eq('transaction_id', basketId)
          .limit(1);
      }
      
      const { data: orders } = await orderQuery;
      
      if (orders && orders.length > 0 && orders[0].status === 'pending') {
        // Update order status to 'failed'
        await supabase
          .from('orders')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', orders[0].id);
        
        console.log('Order marked as failed:', orders[0].id);
      }
    };
    
    updateOrderToFailed();
  }, [searchParams]);

  const handleTryAgain = () => {
    setShowModal(false);
    navigate(checkoutPath);
  };

  const handleGoHome = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleGetHelp = () => {
    setShowModal(false);
    navigate('/help-center');
  };

  // Decode error message
  const decodedErrorMsg = decodeURIComponent(errMsg.replace(/\+/g, ' '));

  // Get user-friendly error message
  const getErrorMessage = () => {
    if (errCode === '1301' || decodedErrorMsg.includes('did not approve')) {
      return 'Transaction was cancelled by user';
    }
    if (decodedErrorMsg.includes('insufficient')) {
      return 'Insufficient balance in account';
    }
    if (decodedErrorMsg.includes('timeout')) {
      return 'Transaction timed out';
    }
    return decodedErrorMsg || 'Payment could not be processed';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] via-[#0d1526] to-[#0a0f1c] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-[420px]"
          >
            {/* Main Card */}
            <div className="relative bg-gradient-to-b from-[#1a2234] to-[#141c2e] rounded-3xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
              
              {/* Top glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              
              {/* Content */}
              <div className="p-8 pt-10">
                
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-red-500/20 to-red-600/10 flex items-center justify-center border border-red-500/30">
                      <ShieldX className="w-12 h-12 text-red-400" strokeWidth={1.5} />
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-center mb-6"
                >
                  <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
                  <p className="text-gray-400 text-sm">Don't worry, no amount was deducted</p>
                </motion.div>

                {/* Error Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0d1220] rounded-2xl p-5 mb-6 border border-white/5"
                >
                  <p className="text-red-400 font-medium text-sm mb-4">{getErrorMessage()}</p>
                  
                  <div className="space-y-2.5">
                    {paymentName && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Payment Method</span>
                        <span className="text-gray-300 text-xs font-medium">{paymentName}</span>
                      </div>
                    )}
                    {transactionAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Amount</span>
                        <span className="text-white text-sm font-semibold">{transactionCurrency} {transactionAmount}</span>
                      </div>
                    )}
                    {errCode && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Error Code</span>
                        <span className="text-gray-400 text-xs font-mono">{errCode}</span>
                      </div>
                    )}
                    {transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Reference</span>
                        <span className="text-gray-400 text-xs font-mono truncate max-w-[150px]">{transactionId.slice(0, 16)}...</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-3"
                >
                  <Button 
                    onClick={handleTryAgain}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button 
                    onClick={handleGoHome}
                    variant="ghost"
                    className="w-full h-11 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium rounded-xl border border-white/10 transition-all duration-300"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="my-6 border-t border-white/5" />

                {/* Help Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <button 
                    onClick={handleGetHelp}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-midasbuy-blue transition-colors group"
                  >
                    <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Need help? Visit Help Center</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentFailedPage;

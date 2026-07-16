import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { usePurchaseNotifications } from "@/hooks/useAuthNotifications";
import { supabase } from "@/integrations/supabase/client";

interface PaymentSuccessPageProps {
  onLogout: () => void;
}

const PaymentSuccessPage = ({ onLogout }: PaymentSuccessPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notifyPaymentCanceled } = usePurchaseNotifications();
  const hasProcessedRef = useRef(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get payment details from URL params (GoPayFast returns these)
  const transactionId = searchParams.get('transaction_id') || searchParams.get('basket_id') || searchParams.get('m_payment_id') || '';
  const basketId = searchParams.get('basket_id') || searchParams.get('BASKET_ID') || transactionId;
  const errCode = searchParams.get('err_code') || '';
  const errMsg = searchParams.get('err_msg') || '';
  const isSuccess = errCode === '000' || errMsg?.toLowerCase() === 'success';

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessedRef.current) return;
      hasProcessedRef.current = true;

      console.log('Payment Page - Processing:', { transactionId, basketId, errCode, errMsg, isSuccess });

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          setIsLoading(false);
          return;
        }

        // Try to find the order by transaction_id (basket_id)
        let order = null;
        if (basketId) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*, uc_packages(*)')
            .eq('transaction_id', basketId)
            .maybeSingle();

          if (orderError) {
            console.error('Error fetching order:', orderError);
          } else if (orderData) {
            order = orderData;
            console.log('Found order:', order);
          }
        }

        // If no order found by transaction_id, try to find recent pending order for this user
        if (!order) {
          const { data: recentOrder } = await supabase
            .from('orders')
            .select('*, uc_packages(*)')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (recentOrder) {
            order = recentOrder;
            console.log('Found recent pending order:', order);
          }
        }

        if (order) {
          setOrderDetails(order);

          // Update order status to cancelled when user lands on this page (customer cancelled)
          // Always update to cancelled if order is pending (regardless of basketId)
          if (order.status === 'pending') {
            const newStatus = 'cancelled';
            const { error: updateError } = await supabase
              .from('orders')
              .update({ 
                transaction_id: basketId || order.transaction_id,
                status: newStatus,
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);

            if (updateError) {
              console.error('Error updating order:', updateError);
            } else {
              console.log('Order updated - status:', newStatus);
              
              // Notify admin about cancelled order - using correct currency from order
              try {
                await supabase.functions.invoke('notify-admin-new-order', {
                  body: {
                    event_type: 'order_cancelled',
                    order_details: {
                      order_id: order.id,
                      package_name: order.product_name || order.uc_packages?.name || 'Package',
                      price: order.price || 0,
                      currency_code: order.currency_code || 'PKR',
                      player_id: order.player_id,
                      payment_method: order.payment_method || 'gopayfast',
                      status: newStatus,
                    },
                  },
                });
                console.log('Admin notification sent for order cancelled with currency:', order.currency_code);
              } catch (notifyError) {
                console.error('Failed to notify admin:', notifyError);
              }

              // Send automatic refund email to customer
              try {
                await supabase.functions.invoke('send-order-email', {
                  body: {
                    userId: user.id,
                    orderId: order.id,
                    emailType: 'refund',
                    orderDetails: {
                      packageName: order.product_name || order.uc_packages?.name || 'Package',
                      productName: order.product_name || order.uc_packages?.name || 'Package',
                      productAmount: order.product_amount,
                      productType: order.product_type || 'pubg_uc',
                      ucAmount: order.product_amount ? parseInt(order.product_amount) : 0,
                      price: order.price || 0,
                      currencyCode: order.currency_code || 'PKR',
                      playerId: order.player_id || '',
                      transactionId: basketId || order.transaction_id || '',
                      paymentMethod: order.payment_method || 'gopayfast',
                    },
                  },
                });
                console.log('Refund email sent to customer for order:', order.id);
              } catch (emailError) {
                console.error('Failed to send refund email:', emailError);
              }
            }
          }

          console.log('Order processed - status updated to cancelled');
        }

        // Show canceled notification since we're displaying canceled page
        notifyPaymentCanceled();
        
      } catch (error) {
        console.error('Error processing payment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processPayment();
  }, [basketId, transactionId, errCode, errMsg, isSuccess, notifyPaymentCanceled]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midasbuy-darkBlue flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  // Always show canceled page content as per user request
  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-[50vh] bg-hero-pattern bg-cover bg-center opacity-20 z-0"></div>
      </div>
      
      <Header onLogout={onLogout} />
      
      <main className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-16 h-16 text-red-400" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Payment Canceled
            </h1>
            
            <p className="text-gray-300 mb-6 text-lg">
              Your payment was canceled and no charges were made to your account.
            </p>
            
            <div className="bg-midasbuy-navy/30 rounded-lg p-6 mb-8">
              <h3 className="text-white font-semibold mb-4">Details</h3>
              <div className="space-y-2 text-sm">
                {basketId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-white font-mono text-xs">{basketId}</span>
                  </div>
                )}
                {orderDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">PKR {orderDetails.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Player ID:</span>
                      <span className="text-white">{orderDetails.player_id}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-red-400">Canceled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate(-1)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Continue Shopping
              </Button>
              
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Go Back</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { usePurchaseNotifications } from "@/hooks/useAuthNotifications";

interface PaymentCanceledPageProps {
  onLogout: () => void;
}

const PaymentCanceledPage = ({ onLogout }: PaymentCanceledPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notifyPaymentCanceled } = usePurchaseNotifications();
  
  const reason = searchParams.get('reason') || 'Payment was canceled by the user';

  // Add notification when user lands on this page
  useEffect(() => {
    notifyPaymentCanceled();
  }, []);

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
              <p className="text-gray-300 text-sm">{reason}</p>
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

export default PaymentCanceledPage;
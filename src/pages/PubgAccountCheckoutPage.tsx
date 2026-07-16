import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import ProcessingPaymentScreen from "@/components/ProcessingPaymentScreen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerServiceWidget } from "@/components/CustomerServiceWidget";
import { Link } from "react-router-dom";
import { convertPkrToUsd } from "@/utils/currencyUtils";

interface PubgAccountCheckoutPageProps {
  onLogout: () => void;
}

interface PubgAccount {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail_url?: string;
  video_url?: string;
}

const allPaymentMethods = [
  { 
    id: "gopayfast", 
    name: "", 
    icon: "/lovable-uploads/ccd11874-4f10-4abd-bcbc-111bd7fab743.png",
    forPakistan: true
  },
  { 
    id: "global_payment", 
    name: "", 
    icon: new URL("@/assets/visa-mastercard-logo.png", import.meta.url).href,
    forPakistan: false
  }
];

const PubgAccountCheckoutPage = ({ onLogout }: PubgAccountCheckoutPageProps) => {
  const { id, countryCode } = useParams<{ id: string; countryCode?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  
  // Determine if user is in Pakistan based on URL country code (not IP)
  const isPakistan = countryCode?.toLowerCase() === 'pk';
  
  // Filter payment methods based on country
  const paymentMethods = allPaymentMethods.filter(method => 
    isPakistan ? method.forPakistan : !method.forPakistan
  );
  
  const [selectedPayment, setSelectedPayment] = useState(
    isPakistan ? "gopayfast" : "global_payment"
  );
  
  // Account data from location state
  const accountData = location.state as PubgAccount | undefined;
  
  // Stripe form states
  const [stripeForm, setStripeForm] = useState({
    email: ""
  });
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  
  // GoPayFast form states
  const [goPayFastForm, setGoPayFastForm] = useState({
    email: ""
  });
  const [isGoPayFastLoading, setIsGoPayFastLoading] = useState(false);
  

  useEffect(() => {
    if (!accountData) {
      navigate("/pubg-accounts");
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [accountData, navigate]);

  const validateStripeForm = () => {
    const { email } = stripeForm;
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleStripeSubmit = async () => {
    if (!validateStripeForm()) return;
    setIsStripeLoading(true);
    
    try {
      const paymentData = {
        amount: accountData?.price || 0,
        item_name: `PUBG Account - ${accountData?.title || 'Account'}`,
        email_address: stripeForm.email,
        payment_id: `STRIPE_ACCOUNT_${Date.now()}`,
        account_type: 'pubg_account'
      };

      const response = await fetch(`https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/stripe-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaGlqbWp4cGdrd2h0eXNtY3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDk3OTgsImV4cCI6MjA3MDA4NTc5OH0.Vav5evDk2tlzyrQJ9Iq0K01g9g8_5I9nAeEYD-l2cKQ`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      if (result.success && result.checkout_url) {
        window.open(result.checkout_url, '_blank');
      } else {
        throw new Error(result.error || 'Payment initialization failed');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize Stripe payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStripeLoading(false);
    }
  };

  const validateGoPayFastForm = () => {
    const { email } = goPayFastForm;
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleGoPayFastSubmit = async () => {
    setIsGoPayFastLoading(true);
    
    try {
      // Define redirect URLs for PUBG account packages based on price
      const accountRedirectUrls = {
        "6000": "https://www.midassbuye.shop/checkouts/cn/hWN1wMs10wHO0TK7XjyFx9tq?_theme_id=138032152650",
        "12000": "https://www.midassbuye.shop/checkouts/cn/hWN1wNAzSW3zwl31Qkz2TSlO?_theme_id=138032152650"
      };

      let redirectUrl = "";

      // Determine redirect URL based on account price
      if (accountData?.price === 6000) {
        redirectUrl = accountRedirectUrls["6000"];
      } else if (accountData?.price === 12000) {
        redirectUrl = accountRedirectUrls["12000"];
      }

      if (redirectUrl) {
        // Direct redirect to the specific URL
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL found for this account package');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoPayFastLoading(false);
    }
  };




  const handleCompletePurchase = async () => {
    if (selectedPayment === "gopayfast") {
      handleGoPayFastSubmit();
    }
  };

  if (isLoading || !accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midasbuy-darkBlue">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-midasbuy-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400 animate-pulse">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden">
      <AnimatePresence>
        {showProcessingScreen && (
          <ProcessingPaymentScreen paymentMethod={selectedPayment} />
        )}
      </AnimatePresence>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-[50vh] bg-hero-pattern bg-cover bg-center opacity-20 z-0"></div>
      </div>
      
      <Header onLogout={onLogout} />
      
      <main className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6">
            <button 
              onClick={() => navigate("/pubg-accounts")}
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Accounts</span>
            </button>
          </div>
          
          {/* Order Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Order Information</h2>
            
            <div className="flex items-center mb-6 pb-6 border-b border-gray-700">
              <img 
                src={accountData.thumbnail_url || "/lovable-uploads/ecae37c2-470f-4c72-8005-270d82abe96f.png"} 
                alt={accountData.title} 
                className="w-20 h-20 object-cover rounded-lg mr-4" 
              />
              
              <div className="flex-1">
                <h3 className="text-white text-xl font-semibold mb-1">{accountData.title}</h3>
                <div className="text-midasbuy-gold font-bold text-xl">
                  {isPakistan ? `PKR ${accountData.price.toLocaleString()}` : convertPkrToUsd(accountData.price)}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-base">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white">
                  {isPakistan ? `PKR ${accountData.price.toLocaleString()}` : convertPkrToUsd(accountData.price)}
                </span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-gray-300">Taxes</span>
                <span className="text-white">{isPakistan ? '0.00 PKR' : '$0.00'}</span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-midasbuy-gold">Discount</span>
                <span className="text-midasbuy-gold">
                  {isPakistan ? '-PKR 12,000' : convertPkrToUsd(-12000)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between mb-6 pt-3 border-t border-gray-700">
              <span className="font-bold text-white text-xl">Total</span>
              <span className="font-bold text-white text-2xl">
                {isPakistan ? `PKR ${accountData.price.toLocaleString()}` : convertPkrToUsd(accountData.price)}
              </span>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              By clicking "Complete Purchase", you agree to our Terms of Service and Privacy Policy.
            </div>
          </motion.div>

            {/* Payment Info */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-effect rounded-xl p-6"
           >
             <h2 className="text-2xl font-bold mb-6 text-white">Payment Info</h2>
             
             {/* Payment Method Selection */}
             <div className="mb-6 space-y-3">
               {paymentMethods.map((method) => (
                 <div key={method.id}>
                   <div
                     className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                       selectedPayment === method.id 
                         ? "border-midasbuy-blue bg-midasbuy-blue/10" 
                         : "border-gray-700 bg-midasbuy-navy/30 hover:bg-midasbuy-navy/50"
                     }`}
                     onClick={() => setSelectedPayment(method.id)}
                   >
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center">
                           <img src={method.icon} alt={method.name} className="h-16 w-auto object-contain mr-3" />
                           {method.name && (
                             <span className="text-white font-medium">{method.name}</span>
                           )}
                         </div>
                        
                          <div className="flex items-center gap-3">
                            <span className="text-midasbuy-gold font-semibold text-xs">
                              {isPakistan ? `PKR ${accountData?.price.toLocaleString()}` : convertPkrToUsd(accountData?.price || 0)}
                            </span>
                          {selectedPayment === method.id && (
                            <div className="bg-midasbuy-blue w-5 h-5 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          </div>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
             
              {/* GoPayFast Form */}
              {selectedPayment === "gopayfast" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Button 
                    className="w-full h-20 font-bold transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-2xl"
                    onClick={handleCompletePurchase}
                    disabled={isGoPayFastLoading}
                  >
                    {isGoPayFastLoading ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                        <span className="text-sm">Processing GoPayFast Payment...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-base font-bold mb-1">
                          Pay {isPakistan ? `PKR ${accountData.price.toLocaleString()}` : convertPkrToUsd(accountData.price)} with GoPayFast
                        </div>
                        <div className="text-xs opacity-90 font-normal">
                          Secure Payment via GoPayFast Gateway
                        </div>
                      </div>
                    )}
                  </Button>
                </motion.div>
               )}
            </motion.div>
         </div>
       </main>
       
       
       <footer className="bg-midasbuy-navy py-6 relative z-10">
         <div className="container mx-auto px-4">
           <div className="text-center text-gray-400 text-sm">
             <p>© 2026 Midasbuy. All Rights Reserved.</p>
             <div className="mt-2">
               <Link to="/terms-of-service" className="text-gray-400 hover:text-gray-300 mx-2">Terms of Service</Link>
               <span className="text-gray-600">|</span>
               <a 
                 href="https://cdn.midasbuy.com/static_page/privacy/Privacy%20Policy.html" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-gray-300 mx-2"
               >
                 Privacy Policy
               </a>
               <span className="text-gray-600">|</span>
               <Link to="/contact-us" className="text-gray-400 hover:text-gray-300 mx-2">Contact Us</Link>
             </div>
           </div>
         </div>
       </footer>
     </div>
   );
 };

export default PubgAccountCheckoutPage;
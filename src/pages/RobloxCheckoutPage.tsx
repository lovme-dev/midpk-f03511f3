import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, AlertCircle, Sparkles, Percent } from "lucide-react";
import Header from "@/components/Header";
import { convertPkrToUsd } from "@/utils/currencyUtils";
import ProcessingPaymentScreen from "@/components/ProcessingPaymentScreen";
import { getRobuxPackageById, RobuxPackage } from "@/data/robuxPackages";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import robuxCoins from "@/assets/robux-coins.png";
import { supabase } from "@/integrations/supabase/client";
import BinanceCryptoPayment from "@/components/BinanceCryptoPayment";
import binanceLogoFull from "@/assets/binance-logo-full.png";
import { GuestEmailDialog } from "@/components/GuestEmailDialog";

interface RobloxCheckoutPageProps {
  onLogout: () => void;
}

const allPaymentMethods = [
  { 
    id: "gopayfast", 
    name: "PayFast", 
    icon: "/lovable-uploads/ccd11874-4f10-4abd-bcbc-111bd7fab743.png",
    currency: "PKR",
    forPakistan: true
  },
  { 
    id: "usd_payment", 
    name: "Global Payment", 
    icon: new URL("@/assets/visa-mastercard-logo.png", import.meta.url).href,
    currency: "USD",
    forPakistan: false
  },
  { 
    id: "binance_crypto", 
    name: "Binance Pay", 
    icon: "",
    currency: "CRYPTO",
    forPakistan: true,
    forGlobal: true,
    recommended: true,
    discount: 10
  }
];

const RobloxCheckoutPage = ({ onLogout }: RobloxCheckoutPageProps) => {
  const { id, countryCode } = useParams<{ id: string; countryCode?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Determine if user is in Pakistan based on URL country code (not IP)
  const isPakistan = countryCode?.toLowerCase() === 'pk';
  
  // Filter payment methods based on country detection - always include binance_crypto
  const availablePaymentMethods = allPaymentMethods.filter(method => 
    method.id === 'binance_crypto' || (isPakistan ? method.forPakistan : !method.forPakistan)
  );
  
  const [selectedPayment, setSelectedPayment] = useState(isPakistan ? "gopayfast" : "usd_payment");
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  
  // Guest checkout state
  const [showGuestEmailDialog, setShowGuestEmailDialog] = useState(false);
  const [guestUserId, setGuestUserId] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  
  const [username, setUsername] = useState("");
  
  // Payment form states
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  // Calculate discounted price for Binance
  const getBinanceDiscountedPrice = (price: number) => {
    return price * 0.9; // 10% discount
  };

  // Get package data
  const statePackage = location.state?.packageDetails as RobuxPackage | undefined;
  const packageDetails = statePackage || getRobuxPackageById(id || "");
  const selectedCountry = location.state?.selectedCountry || { code: 'pk', currency: 'PKR' };

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user?.email || null);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUserEmail(session.user?.email || null);
      } else {
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("robloxUsername");
    
    if (!storedUsername) {
      navigate(`/roblox/purchase/${id}`);
      return;
    }
    
    setUsername(storedUsername);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, id]);

  const getDisplayPrice = (pricePKR: number) => {
    if (selectedCountry.currency === 'PKR' || isPakistan) {
      return `Rs ${pricePKR.toLocaleString()}`;
    }
    return convertPkrToUsd(pricePKR);
  };

  const handlePaymentSubmit = async (overrideUserId?: string, overrideEmail?: string) => {
    const effectiveUserId = overrideUserId || guestUserId;
    const effectiveEmail = overrideEmail || guestEmail || userEmail;
    
    // Check if user is logged in for GoPayFast OR we have guest credentials
    if (selectedPayment === "gopayfast" && !userEmail && !effectiveUserId) {
      setShowGuestEmailDialog(true);
      return;
    }

    setIsPaymentLoading(true);
    
    try {
      // Determine user credentials
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || effectiveUserId || '';
      const emailToUse = user?.email || effectiveEmail || '';
      
      if (selectedPayment === "gopayfast" && packageDetails) {
        const itemName = `Robux ${packageDetails.baseAmount}+${packageDetails.bonusAmount}`;
        
        // Save checkout path for payment failure redirect
        localStorage.setItem('lastCheckoutPath', window.location.pathname);
        localStorage.setItem('lastCheckoutGame', 'roblox');
        
        // Save package info for Thank You page
        localStorage.setItem('lastPackageName', itemName);
        localStorage.setItem('purchaseAmount', packageDetails.price.toString());
        localStorage.setItem('ucAmount', `${packageDetails.baseAmount}+${packageDetails.bonusAmount}`);
        localStorage.setItem('paymentMethod', 'PayFast');
        localStorage.setItem('playerID', username);
        localStorage.setItem('pubgUsername', username);
        
        console.log('Initiating GoPayFast payment for Roblox:', { 
          packageId: packageDetails.id, 
          amount: packageDetails.price, 
          itemName 
        });
        
        // Call edge function to get access token and form data
        const response = await supabase.functions.invoke('gopayfast-payment', {
          body: {
            amount: packageDetails.price,
            item_name: itemName,
            email_address: emailToUse,
            player_id: username,
            username: username,
            package_id: packageDetails.id,
            user_id: userId,
            product_type: 'roblox_robux',
            product_name: itemName,
            product_amount: `${packageDetails.baseAmount}+${packageDetails.bonusAmount}`,
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message || 'Payment initialization failed');
        }
        
        const { success, post_url, form_data, error } = response.data;
        
        if (!success || !form_data) {
          throw new Error(error || 'Failed to initialize payment');
        }
        
        console.log('GoPayFast token received, submitting to checkout:', post_url);
        
        // Create and submit form to GoPayFast checkout page
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = post_url;
        form.target = '_self';
        
        // Add all form fields
        Object.entries(form_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
        return;
        
      } else if (selectedPayment === "usd_payment") {
        // Show maintenance for now
        toast({
          title: "🔧 Under Maintenance",
          description: "Global Roblox payments are currently being set up. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: (error as any)?.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (isLoading || !packageDetails) {
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
      <AdvancedSEOHelmet 
        title={`Buy ${packageDetails?.baseAmount} Robux | Checkout | Midasbuy`}
        description={`Complete your purchase of ${packageDetails?.baseAmount} Robux with bonus. Secure payment, instant delivery. Midasbuy Official Roblox Store.`}
        keywords="robux checkout, buy robux, robux payment, roblox robux purchase, midasbuy checkout"
        canonicalUrl={`/roblox/checkout/${id}`}
      />
      <AnimatePresence>
        {showProcessingScreen && (
          <ProcessingPaymentScreen paymentMethod={selectedPayment} />
        )}
      </AnimatePresence>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-[50vh] bg-hero-pattern bg-cover bg-center opacity-20 z-0"></div>
      </div>
      
      <div className="hidden">
        <Header onLogout={onLogout} />
      </div>
      
      <main className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Player Info</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold mb-4 text-white">Order Information</h2>
                
                <div className="flex items-center mb-6 pb-4 border-b border-gray-700">
                  <img 
                    src={robuxCoins} 
                    alt="Robux Package" 
                    className="w-20 h-20 object-contain rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-bold text-white text-lg">
                      {packageDetails.baseAmount} Robux
                      {packageDetails.bonusAmount > 0 && (
                        <span className="text-midasbuy-gold"> +{packageDetails.bonusAmount}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">Roblox</p>
                  </div>
                </div>
                
                {/* Player Info */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="text-white font-medium">{username}</p>
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Package Price</span>
                    <span className="text-white">{getDisplayPrice(packageDetails.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-500">{packageDetails.discount}</span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-700">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-midasbuy-gold text-xl">
                    {getDisplayPrice(packageDetails.price)}
                  </span>
                </div>
              </motion.div>
            </div>
            
            {/* Payment Section */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-white">Payment Method</h2>
                
                {/* User Email Section - Show if logged in */}
                {userEmail && (
                  <div className="mb-4 flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-400">Logged in as</span>
                    <span className="text-white font-medium">{userEmail}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {availablePaymentMethods.map((method) => (
                    <div key={method.id}>
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${
                          selectedPayment === method.id 
                            ? method.id === 'binance_crypto' ? "border-[#F0B90B] bg-[#F0B90B]/10" : "border-midasbuy-blue bg-midasbuy-blue/10" 
                            : "border-gray-700 bg-midasbuy-navy/30 hover:bg-midasbuy-navy/50"
                        }`}
                        onClick={() => {
                          setSelectedPayment(method.id);
                          if (method.id === 'binance_crypto') {
                            setShowCryptoPayment(true);
                          } else {
                            setShowCryptoPayment(false);
                          }
                        }}
                      >
                        {/* Recommended & Discount tags for Binance */}
                        {method.id === 'binance_crypto' && (
                          <div className="absolute -top-2 right-2 flex gap-1">
                            <span className="bg-[#F0B90B] text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Recommended
                            </span>
                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Percent className="w-3 h-3" /> 10% OFF
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            {method.id === 'binance_crypto' ? (
                              <img src={binanceLogoFull} alt="Binance" className="h-10 w-auto object-contain rounded" />
                            ) : (
                              <img src={method.icon} alt={method.name} className="h-10 w-auto object-contain" />
                            )}
                          </div>
                         
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              {method.id === 'binance_crypto' ? (
                                <>
                                  <span className="text-[#F0B90B] font-bold text-sm">
                                    {isPakistan 
                                      ? `PKR ${getBinanceDiscountedPrice(packageDetails.price).toLocaleString()}`
                                      : `$${(getBinanceDiscountedPrice(packageDetails.price) / 280).toFixed(2)}`
                                    }
                                  </span>
                                  <span className="text-gray-500 text-xs line-through ml-1">
                                    {isPakistan 
                                      ? `PKR ${packageDetails.price.toLocaleString()}`
                                      : `$${(packageDetails.price / 280).toFixed(2)}`
                                    }
                                  </span>
                                </>
                              ) : (
                                <span className="text-midasbuy-gold font-semibold text-sm">
                                  {getDisplayPrice(packageDetails.price)}
                                </span>
                              )}
                            </div>
                            {selectedPayment === method.id && (
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${method.id === 'binance_crypto' ? 'bg-[#F0B90B]' : 'bg-midasbuy-blue'}`}>
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Binance Crypto Payment */}
                {selectedPayment === 'binance_crypto' && showCryptoPayment && (
                  <div className="mb-6">
                    <BinanceCryptoPayment
                      amount={packageDetails.price / 280}
                      discountedAmount={getBinanceDiscountedPrice(packageDetails.price) / 280}
                      orderId={`ROBUX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}
                      productName={`Robux ${packageDetails.baseAmount}+${packageDetails.bonusAmount}`}
                      onPaymentConfirmed={(txId) => {
                        toast({ title: "Payment Confirmed!", description: `TX: ${txId.substring(0, 16)}...` });
                        navigate('/thank-you');
                      }}
                      onCancel={() => setShowCryptoPayment(false)}
                    />
                  </div>
                )}
                
                {/* Warning Notice */}
                <div className="flex items-start gap-3 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/20 mb-6">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Please make sure your Username is correct before completing the purchase. Robux cannot be transferred after delivery.
                  </p>
                </div>
                
                {selectedPayment !== 'binance_crypto' && (
                  <Button
                    onClick={() => handlePaymentSubmit()}
                    disabled={isPaymentLoading}
                    className="w-full py-6 text-lg font-bold bg-midasbuy-blue hover:bg-midasbuy-blue/80"
                  >
                    {isPaymentLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Complete Purchase - ${getDisplayPrice(packageDetails.price)}`
                    )}
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-midasbuy-darkBlue border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact-us" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
      
      {/* Guest Email Dialog for GoPayFast checkout without login */}
      <GuestEmailDialog
        open={showGuestEmailDialog}
        onOpenChange={setShowGuestEmailDialog}
        onEmailConfirmed={(userId, email) => {
          setGuestUserId(userId);
          setGuestEmail(email);
          handlePaymentSubmit(userId, email);
        }}
      />
    </div>
  );
};

export default RobloxCheckoutPage;

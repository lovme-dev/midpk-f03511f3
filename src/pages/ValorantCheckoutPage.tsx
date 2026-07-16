import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle, Check, Sparkles, Percent } from "lucide-react";
import { useToast, toast } from "@/hooks/use-toast";
import { valorantPackages } from "@/data/valorantPackages";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import BinanceCryptoPayment from "@/components/BinanceCryptoPayment";
import binanceLogoFull from "@/assets/binance-logo-full.png";
import { supabase } from "@/integrations/supabase/client";

interface ValorantCheckoutPageProps {
  onLogout: () => void;
}

const ValorantCheckoutPage = ({ onLogout }: ValorantCheckoutPageProps) => {
  const { id, countryCode } = useParams<{ id?: string; countryCode?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [riotId, setRiotId] = useState("");
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  
  // Determine if user is in Pakistan based on URL country code (not IP)
  const isPakistan = countryCode?.toLowerCase() === 'pk';
  
  const selectedPackage = valorantPackages.find(pkg => pkg.id === id);
  
  // Convert PKR to USD
  const convertToUsd = (pkrAmount: number) => {
    return (pkrAmount / 280).toFixed(2);
  };
  
  // Calculate discounted price for Binance
  const getBinanceDiscountedPrice = (price: number) => {
    return price * 0.9; // 10% discount
  };

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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Get Riot ID from state or localStorage
    const stateRiotId = location.state?.riotId;
    const savedRiotId = localStorage.getItem("valorantRiotId");
    
    if (stateRiotId) {
      setRiotId(stateRiotId);
    } else if (savedRiotId) {
      setRiotId(savedRiotId);
    }
    
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleBackToValorant = () => {
    navigate('/valorant');
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      showToast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue",
        variant: "destructive",
      });
      return;
    }

    if (!email || !email.includes('@')) {
      showToast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      showToast({
        title: "Order Placed Successfully!",
        description: "Your VP will be delivered shortly",
      });
      setIsProcessing(false);
      navigate('/order-thankyou', {
        state: {
          orderDetails: {
            packageName: `${selectedPackage?.baseAmount} VP`,
            riotId: riotId,
            price: isPakistan ? `Rs ${selectedPackage?.price}` : `$${convertToUsd(selectedPackage?.price || 0)}`
          }
        }
      });
    }, 2000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-midasbuy-darkBlue flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Package not found</h1>
          <Button onClick={handleBackToValorant}>Back to Valorant</Button>
        </div>
      </div>
    );
  }

  const paymentMethods = isPakistan 
    ? [
        { id: 'gopayfast', name: 'PayFast', icon: '/lovable-uploads/ccd11874-4f10-4abd-bcbc-111bd7fab743.png', currency: 'PKR' },
        { id: 'binance_crypto', name: 'Binance Pay', icon: '', currency: 'CRYPTO', recommended: true, discount: 10 }
      ]
    : [
        { id: 'stripe', name: 'Credit/Debit Card', icon: '/lovable-uploads/stripe-icon.png', currency: 'USD' },
        { id: 'binance_crypto', name: 'Binance Pay', icon: '', currency: 'CRYPTO', recommended: true, discount: 10 }
      ];

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue">
      <SEOHelmet
        title={`Checkout - ${selectedPackage.baseAmount} VP | Valorant Points | Midasbuy`}
        description={`Complete your purchase of ${selectedPackage.baseAmount} Valorant Points. Secure payment and instant delivery.`}
      />
      
      <Header onLogout={onLogout} />
      
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBackToValorant}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Valorant
          </button>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-[#1a2438] to-[#151c2b] rounded-xl p-6 border border-[#2a3548]"
            >
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2a3548]">
                <img 
                  src={selectedPackage.image} 
                  alt={`${selectedPackage.baseAmount} VP`}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-white font-medium">
                    {selectedPackage.baseAmount.toLocaleString()} VP
                    {selectedPackage.bonusAmount > 0 && (
                      <span className="text-red-400 ml-1">+{selectedPackage.bonusAmount.toLocaleString()}</span>
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm">Valorant Points</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Riot ID</span>
                  <span className="text-white">{riotId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">
                    {isPakistan 
                      ? `Rs ${selectedPackage.originalPrice.toLocaleString()}`
                      : `$${convertToUsd(selectedPackage.originalPrice)}`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Discount ({selectedPackage.discount})</span>
                  <span>
                    -{isPakistan 
                      ? `Rs ${(selectedPackage.originalPrice - selectedPackage.price).toLocaleString()}`
                      : `$${convertToUsd(selectedPackage.originalPrice - selectedPackage.price)}`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-[#2a3548]">
                  <span>Total</span>
                  <span className="text-red-500">
                    {isPakistan 
                      ? `Rs ${selectedPackage.price.toLocaleString()}`
                      : `$${convertToUsd(selectedPackage.price)}`
                    }
                  </span>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#1A1F2E] rounded-lg p-2">
                  <Shield className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Secure</span>
                </div>
                <div className="bg-[#1A1F2E] rounded-lg p-2">
                  <Clock className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Instant</span>
                </div>
                <div className="bg-[#1A1F2E] rounded-lg p-2">
                  <CheckCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Official</span>
                </div>
              </div>
            </motion.div>
            
            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-[#1a2438] to-[#151c2b] rounded-xl p-6 border border-[#2a3548]"
            >
              <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
              
              {/* User Email Section - Show if logged in */}
              {userEmail && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-400">Logged in as</span>
                  <span className="text-white font-medium">{userEmail}</span>
                </div>
              )}
              
              {/* Email Input */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-[#1A1F2E] border-[#2a3548] text-white"
                />
                <p className="text-gray-500 text-xs mt-1">Receipt will be sent to this email</p>
              </div>
              
              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <div key={method.id}>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${
                        selectedPayment === method.id 
                          ? method.id === 'binance_crypto' ? "border-[#F0B90B] bg-[#F0B90B]/10" : "border-red-500 bg-red-500/10" 
                          : "border-[#2a3548] bg-[#1A1F2E] hover:border-red-500/50"
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
                            <>
                              <CreditCard className="w-6 h-6 text-red-400 mr-3" />
                            </>
                          )}
                        </div>
                       
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {method.id === 'binance_crypto' ? (
                              <>
                                <span className="text-[#F0B90B] font-bold text-sm">
                                  {isPakistan 
                                    ? `Rs ${getBinanceDiscountedPrice(selectedPackage.price).toLocaleString()}`
                                    : `$${(getBinanceDiscountedPrice(selectedPackage.price) / 280).toFixed(2)}`
                                  }
                                </span>
                                <span className="text-gray-500 text-xs line-through ml-1">
                                  {isPakistan 
                                    ? `Rs ${selectedPackage.price.toLocaleString()}`
                                    : `$${(selectedPackage.price / 280).toFixed(2)}`
                                  }
                                </span>
                              </>
                            ) : (
                              <span className="text-red-500 font-semibold text-sm">
                                {isPakistan 
                                  ? `Rs ${selectedPackage.price.toLocaleString()}`
                                  : `$${convertToUsd(selectedPackage.price)}`
                                }
                              </span>
                            )}
                          </div>
                          {selectedPayment === method.id && (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${method.id === 'binance_crypto' ? 'bg-[#F0B90B]' : 'bg-red-500'}`}>
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
                    amount={selectedPackage.price / 280}
                    discountedAmount={getBinanceDiscountedPrice(selectedPackage.price) / 280}
                    orderId={`VP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}
                    productName={`Valorant Points ${selectedPackage.baseAmount}+${selectedPackage.bonusAmount}`}
                    onPaymentConfirmed={(txId) => {
                      toast({ title: "Payment Confirmed!", description: `TX: ${txId.substring(0, 16)}...` });
                      navigate('/thank-you');
                    }}
                    onCancel={() => setShowCryptoPayment(false)}
                  />
                </div>
              )}
              
              {/* Pay Button - only show when not using Binance */}
              {selectedPayment !== 'binance_crypto' && (
                <Button
                  onClick={handlePayment}
                  disabled={!selectedPayment || isProcessing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 text-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Pay ${isPakistan ? `Rs ${selectedPackage.price.toLocaleString()}` : `$${convertToUsd(selectedPackage.price)}`}`
                  )}
                </Button>
              )}
              
              <p className="text-gray-500 text-xs text-center mt-4">
                By completing this purchase, you agree to our Terms of Service
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ValorantCheckoutPage;
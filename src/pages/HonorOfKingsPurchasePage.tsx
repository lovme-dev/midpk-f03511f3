import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle, Check, RefreshCw, User, Shield, X, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import { getPackageById, getSelectedCountry, setupCountryChangeListener } from "@/data/ucPackages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { convertAndFormatPrice, setupCurrencyChangeListener } from "@/utils/currencyUtils";
import { useResponsive } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import LoadingScreen from "@/components/LoadingScreen";

interface HonorOfKingsPurchasePageProps {
  onLogout: () => void;
}

const HonorOfKingsPurchasePage = ({ onLogout }: HonorOfKingsPurchasePageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playerID, setPlayerID] = useState("");
  const [isPlayerIDValid, setIsPlayerIDValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getSelectedCountry());
  const [username, setUsername] = useState("");
  const { isMobile, isTablet } = useResponsive();
  const [showPlayerIdModal, setShowPlayerIdModal] = useState(false);
  const [tempPlayerID, setTempPlayerID] = useState("");

  const honorPackage = id ? getPackageById(id) : undefined;

  useEffect(() => {
    if (!honorPackage) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [honorPackage, navigate]);

  useEffect(() => {
    const savedPlayerID = localStorage.getItem("playerID");
    const savedUsername = localStorage.getItem("pubgUsername");
    
    if (savedPlayerID) {
      setPlayerID(savedPlayerID);
      setIsPlayerIDValid(true);
      
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        setPlayerID("");
        setIsPlayerIDValid(false);
        localStorage.removeItem("playerID");
      }
    }
    
    const handleCountryChange = () => {
      const newSelectedCountry = getSelectedCountry();
      if (newSelectedCountry.currency !== selectedCountry.currency) {
        setSelectedCountry(newSelectedCountry);
      }
    };

    const storageCleanup = setupCountryChangeListener(handleCountryChange);
    const currencyCleanup = setupCurrencyChangeListener(() => {
      handleCountryChange();
    });

    return () => {
      storageCleanup();
      currencyCleanup();
    };
  }, []);

  const handleVerifyPlayerID = () => {
    if (!tempPlayerID || tempPlayerID.length < 8) {
      toast({
        title: "Invalid Player ID",
        description: "Please enter a valid Player ID",
        variant: "destructive",
      });
      return;
    }

    const savedUsername = localStorage.getItem("pubgUsername");
    if (!savedUsername) {
      toast({
        title: "Username Not Verified",
        description: "Please verify your username in the Events page first",
        variant: "destructive",
      });
      setShowPlayerIdModal(false);
      navigate("/events");
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setIsPlayerIDValid(true);
      setPlayerID(tempPlayerID);
      
      toast({
        title: "Player ID Verified",
        description: "ID verification successful",
      });
      
      localStorage.setItem("playerID", tempPlayerID);
      
      setUsername(savedUsername);
      
      setShowPlayerIdModal(false);
    }, 1500);
  };

  const handleResetPlayerID = () => {
    setPlayerID("");
    setIsPlayerIDValid(false);
    localStorage.removeItem("playerID");
    
    toast({
      title: "Player ID Reset",
      description: "Please enter a new Player ID",
    });
    
    setShowPlayerIdModal(true);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleProceedToCheckout = () => {
    if (!isPlayerIDValid) {
      toast({
        title: "Player ID Required",
        description: "Please verify your Player ID before proceeding",
        variant: "destructive",
      });
      setShowPlayerIdModal(true);
      return;
    }

    if (id) {
      navigate(`/checkout/${id}`);
    }
  };
  
  const openPlayerIdModal = () => {
    setTempPlayerID("");
    setShowPlayerIdModal(true);
  };

  if (isLoading || !honorPackage) {
    return <LoadingScreen message="Loading package details..." />;
  }

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden">
      <SEOHelmet />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-[50vh] bg-hero-pattern bg-cover bg-center opacity-20 z-0"></div>
      </div>
      
      <Header onLogout={onLogout} />
      
      <AnimatePresence>
        <Dialog open={showPlayerIdModal} onOpenChange={setShowPlayerIdModal}>
          <DialogContent className="w-[95vw] max-w-md md:w-full bg-[#121B2E] border-none text-white p-0 overflow-hidden mx-auto">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <DialogTitle className="text-lg sm:text-xl font-bold text-white">Enter Your Player ID</DialogTitle>
                <Button 
                  variant="ghost" 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                  onClick={() => setShowPlayerIdModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            
              <div className="py-2">
                <div className="mb-3">
                  <div className="bg-[#0099FF] p-2 rounded-t-md text-center text-white text-sm">
                    Please select or fill in your Player ID you want to recharge
                  </div>
                  <div className="bg-[#1A1F2E] rounded-b-md p-3 border border-[#182238]">
                    <Input
                      value={tempPlayerID}
                      onChange={(e) => setTempPlayerID(e.target.value)}
                      placeholder="Enter Player ID"
                      variant="dark"
                      className="h-10 text-base"
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-4"
                  variant="blue"
                  size="lg"
                  onClick={handleVerifyPlayerID}
                  disabled={isVerifying || !tempPlayerID}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    "OK"
                  )}
                </Button>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-white font-medium mb-2 flex items-center text-sm">
                      <HelpCircle className="w-4 h-4 mr-1 text-[#0099FF]" />
                      Couldn't find your Player ID?
                    </h5>
                    
                    <div className="ml-5 space-y-3">
                      <div>
                        <p className="text-xs text-gray-300 mb-1">1. Or view your ID in the game lobby</p>
                        <div className="rounded-md overflow-hidden mb-3">
                          <img 
                            src="/lovable-uploads/d8a0389b-81ee-4c91-bd70-8e9e7b0d765b.png" 
                            alt="Finding Player ID in Game Lobby" 
                            className="w-full rounded-md border border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-300 mb-1">2. Find your ID in your profile page</p>
                        <div className="rounded-md overflow-hidden">
                          <img 
                            src="/lovable-uploads/a11f7ec0-260b-4785-89db-c8478d536442.png" 
                            alt="Finding Player ID in Profile Page" 
                            className="w-full rounded-md border border-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
      
      <main className="pt-20 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <button 
              onClick={handleBackToHome}
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Packages</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-midasbuy-blue" />
                    Player Information
                  </h2>
                  <div className="bg-midasbuy-navy/50 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-midasbuy-blue" />
                    Secure Verification
                  </div>
                </div>
                
                {isPlayerIDValid ? (
                  <div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-6 w-full justify-start">
                        <div className="bg-gradient-to-r from-[#1a5fb4] to-[#3584e4] text-white text-xs px-3 py-1 rounded-full flex items-center font-medium shadow-md">
                          <Check className="w-3 h-3 mr-1" /> Verified Account
                        </div>
                      </div>
                      
                      <div className="w-full space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-700/30 pb-3">
                          <span className="text-gray-400 text-sm font-medium w-32">Player ID:</span>
                          <span className="text-white font-semibold tracking-wide text-right">{playerID}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-gray-400 text-sm font-medium w-32">Username:</span>
                          <span className="text-white font-semibold text-right">{username}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 w-full flex justify-center">
                        <Button 
                          className="bg-[#1F2A3C] hover:bg-[#2A3A52] text-white shadow-md transition-all duration-200"
                          onClick={handleResetPlayerID}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" /> Change ID
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center">
                    <Button 
                      className="w-[80%] py-3 h-auto bg-gradient-to-r from-midasbuy-blue to-blue-500 hover:from-blue-600 hover:to-blue-500 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg"
                      onClick={openPlayerIdModal}
                    >
                      <User className="w-4 h-4 mr-2" /> Enter Your Player ID Now &gt;
                    </Button>
                  </div>
                )}
                
                <div className="mt-3 flex items-start">
                  <AlertCircle className="w-4 h-4 text-midasbuy-gold mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">
                    Your Player ID can be found in your Honor of Kings game. Go to your profile and copy the ID number. 
                    This ID is required to deliver credits directly to your account.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-effect rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-white">Important Information</h2>
                
                <div className="space-y-4 text-sm text-gray-300">
                  <p className="flex items-start">
                    <span className="text-midasbuy-gold mr-2">•</span>
                    Credits will be directly added to the Honor of Kings account with the Player ID you provide.
                  </p>
                  <p className="flex items-start">
                    <span className="text-midasbuy-gold mr-2">•</span>
                    Please ensure that the Player ID is correct before proceeding with the purchase.
                  </p>
                  <p className="flex items-start">
                    <span className="text-midasbuy-gold mr-2">•</span>
                    Credit delivery is instant but may take up to 5 minutes in some cases.
                  </p>
                  <p className="flex items-start">
                    <span className="text-midasbuy-gold mr-2">•</span>
                    For any issues with your purchase, please contact our support team.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-1 order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold mb-4 text-white">Order Information</h2>
                
                <div className="flex items-center mb-6 pb-4 border-b border-gray-700">
                  <img src="/lovable-uploads/f6594fcb-d2eb-4e92-9f21-fe5959fa5360.png" alt="Credits" className="w-[70px] mr-4" width="94" height="70" />
                  
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-white text-xl">{honorPackage?.baseAmount}</span>
                      {honorPackage?.bonusAmount > 0 && (
                        <span className="text-midasbuy-gold ml-1">+{honorPackage?.bonusAmount}</span>
                      )}
                      <span className="text-white ml-1">Credits</span>
                      
                      {honorPackage?.bonusPercent && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-midasbuy-gold/20 text-midasbuy-gold">
                          {honorPackage?.bonusPercent}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1">
                      <span className="text-midasbuy-gold font-medium">
                        {convertAndFormatPrice(honorPackage?.price || 0, selectedCountry.currency)}
                      </span>
                      {honorPackage?.originalPrice > (honorPackage?.price || 0) && (
                        <span className="text-gray-400 line-through text-sm ml-2">
                          {convertAndFormatPrice(honorPackage?.originalPrice || 0, selectedCountry.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-300 mb-1">Player Information:</div>
                  <div className="p-3 bg-midasbuy-navy/50 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID:</span>
                      <span className="text-white font-medium">{playerID}</span>
                    </div>
                    {username && (
                      <div className="flex justify-between mt-1 border-t border-midasbuy-navy/80 pt-1">
                        <span className="text-gray-400">Username:</span>
                        <span className="text-white font-medium">{username}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white">
                      {convertAndFormatPrice(honorPackage?.price || 0, selectedCountry.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Taxes</span>
                    <span className="text-white">
                      {convertAndFormatPrice(0.00, selectedCountry.currency)}
                    </span>
                  </div>
                  
                  {honorPackage?.originalPrice > (honorPackage?.price || 0) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-midasbuy-gold">Discount</span>
                      <span className="text-midasbuy-gold">
                        -{convertAndFormatPrice((honorPackage?.originalPrice || 0) - (honorPackage?.price || 0), selectedCountry.currency)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mb-6 pb-2 border-b border-gray-700">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-white text-xl">
                    {convertAndFormatPrice(honorPackage?.price || 0, selectedCountry.currency)}
                  </span>
                </div>
                
                <Button 
                  className="w-full h-12 bg-midasbuy-blue hover:bg-blue-600 text-white font-medium text-lg"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-midasbuy-navy py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2026 Midasbuy. All Rights Reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">Terms of Service</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">Privacy Policy</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HonorOfKingsPurchasePage;

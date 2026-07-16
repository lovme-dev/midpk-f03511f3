import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { valorantPackages } from "@/data/valorantPackages";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface ValorantPlayerIdPageProps {
  onLogout: () => void;
}

const ValorantPlayerIdPage = ({ onLogout }: ValorantPlayerIdPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [riotId, setRiotId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const selectedPackage = valorantPackages.find(pkg => pkg.id === id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Check for saved Riot ID
    const savedRiotId = localStorage.getItem("valorantRiotId");
    if (savedRiotId) {
      setRiotId(savedRiotId);
      setIsVerified(true);
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyRiotId = () => {
    if (!riotId || riotId.length < 3 || !riotId.includes('#')) {
      toast({
        title: "Invalid Riot ID",
        description: "Please enter a valid Riot ID (e.g., Player#1234)",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      localStorage.setItem("valorantRiotId", riotId);
      
      toast({
        title: "Riot ID Verified",
        description: "Your Riot ID has been verified successfully",
      });
    }, 1500);
  };

  const handleContinueToCheckout = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your Riot ID first",
        variant: "destructive",
      });
      return;
    }

    navigate(`/valorant/checkout/${id}`, {
      state: {
        packageType: 'valorant',
        packageId: id,
        packageName: `${selectedPackage?.baseAmount} VP`,
        price: selectedPackage?.price,
        originalPrice: selectedPackage?.originalPrice,
        currency: 'PKR',
        riotId: riotId
      }
    });
  };

  const handleBackToValorant = () => {
    navigate('/valorant');
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

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue">
      <SEOHelmet
        title={`Buy ${selectedPackage.baseAmount} VP | Valorant Points | Midasbuy`}
        description={`Purchase ${selectedPackage.baseAmount} Valorant Points at best price. Instant delivery and secure payment.`}
      />
      
      <Header onLogout={onLogout} />
      
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={handleBackToValorant}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Valorant
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#1a2438] to-[#151c2b] rounded-xl p-6 border border-[#2a3548]"
          >
            {/* Package Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2a3548]">
              <img 
                src={selectedPackage.image} 
                alt={`${selectedPackage.baseAmount} VP`}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {selectedPackage.baseAmount.toLocaleString()} VP
                  {selectedPackage.bonusAmount > 0 && (
                    <span className="text-red-400 ml-2">+{selectedPackage.bonusAmount.toLocaleString()}</span>
                  )}
                </h1>
                <p className="text-red-500 font-bold text-lg">Rs {selectedPackage.price.toLocaleString()}</p>
                <p className="text-gray-500 line-through text-sm">Rs {selectedPackage.originalPrice.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Riot ID Input */}
            <div className="mb-6">
              <label className="text-white font-medium mb-2 block">
                <User className="w-4 h-4 inline mr-2" />
                Enter Your Riot ID
              </label>
              <div className="flex gap-2">
                <Input
                  value={riotId}
                  onChange={(e) => {
                    setRiotId(e.target.value);
                    setIsVerified(false);
                  }}
                  placeholder="e.g., Player#1234"
                  className="flex-1 bg-[#1A1F2E] border-[#2a3548] text-white"
                  disabled={isVerified}
                />
                {!isVerified ? (
                  <Button
                    onClick={handleVerifyRiotId}
                    disabled={isVerifying || !riotId}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isVerifying ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsVerified(false);
                      setRiotId("");
                      localStorage.removeItem("valorantRiotId");
                    }}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    Change
                  </Button>
                )}
              </div>
              
              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-green-400"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Riot ID verified</span>
                </motion.div>
              )}
            </div>
            
            {/* Info Box */}
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-white mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>VP will be delivered to your Riot account within minutes</li>
                    <li>Make sure your Riot ID is correct before proceeding</li>
                    <li>Contact support if VP is not received within 30 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Continue Button */}
            <Button
              onClick={handleContinueToCheckout}
              disabled={!isVerified}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 text-lg"
            >
              Continue to Checkout
            </Button>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ValorantPlayerIdPage;

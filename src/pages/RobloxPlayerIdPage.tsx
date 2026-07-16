import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { ArrowLeft, User, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdvancedSEOHelmet from "@/components/SEO/AdvancedSEOHelmet";
import { motion } from "framer-motion";
import robuxCoins from "@/assets/robux-coins.png";
import { RobuxPackage } from "@/data/robuxPackages";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RobloxPlayerIdPageProps {
  onLogout: () => void;
}

const RobloxPlayerIdPage = ({ onLogout }: RobloxPlayerIdPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [usernameConfirmed, setUsernameConfirmed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const packageDetails = location.state?.packageDetails as RobuxPackage | undefined;
  const selectedCountry = location.state?.selectedCountry || { code: 'pk', currency: 'PKR' };

  useEffect(() => {
    if (!packageDetails) {
      navigate('/roblox');
      return;
    }

    // Load saved username
    const savedUsername = localStorage.getItem("robloxUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setUsernameConfirmed(true);
    }

    setIsLoading(false);
  }, [packageDetails, navigate]);

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your Roblox Username first",
        variant: "destructive",
      });
      return;
    }

    // Save username to localStorage
    localStorage.setItem("robloxUsername", username.trim());

    // Close dialog and navigate
    setShowUsernameDialog(false);
    
    navigate(`/roblox/checkout/${packageDetails?.id}`, {
      state: {
        packageDetails,
        selectedCountry,
        username: username.trim()
      }
    });
  };

  if (isLoading) {
    return <LoadingScreen message="loading..." />;
  }

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue text-white">
      <AdvancedSEOHelmet 
        title="Enter Roblox Player ID | Buy Robux Secure | Midasbuy"
        description="Enter your Roblox Player ID and Username to purchase Robux securely. Fast verification, instant delivery. Official Midasbuy Robux purchase."
        keywords="roblox player id, robux purchase, buy robux, roblox username, robux recharge, midasbuy roblox"
        canonicalUrl={`/roblox/purchase/${packageDetails?.id}`}
      />
      <Header onLogout={onLogout} />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Packages</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          {/* Selected Package */}
          <div className="glass-effect rounded-xl p-4 mb-6">
            <h3 className="text-sm text-gray-400 mb-2">Selected Package</h3>
            <div className="flex items-center gap-4">
              <img 
                src={robuxCoins}
                alt="Robux" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="text-xl font-bold text-white">
                  {packageDetails?.baseAmount} Robux
                  {packageDetails?.bonusAmount ? (
                    <span className="text-midasbuy-gold ml-2">+{packageDetails.bonusAmount}</span>
                  ) : null}
                </p>
                <p className="text-midasbuy-gold">
                  {selectedCountry.currency === 'PKR' ? 'Rs ' : '$'}
                  {packageDetails?.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Player Information */}
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-midasbuy-blue" />
                <h2 className="text-xl font-bold">Player Information</h2>
              </div>
              <div className="flex items-center gap-2 bg-midasbuy-navy/50 px-3 py-1.5 rounded-full">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-300">Secure Verification</span>
              </div>
            </div>

            <Button
              onClick={() => setShowUsernameDialog(true)}
              className="w-full bg-midasbuy-blue hover:bg-midasbuy-blue/80 text-white py-3"
            >
              <User className="w-5 h-5 mr-2" />
              Enter Your Username Now &gt;
            </Button>

          </div>

          {/* Important Information */}
          <div className="mt-6 glass-effect rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Important Information</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-midasbuy-blue">•</span>
                Robux will be directly added to the Roblox account with the Username you provide.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-midasbuy-blue">•</span>
                Please ensure that the Username is correct before proceeding with the purchase.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-midasbuy-blue">•</span>
                Robux delivery is instant but may take up to 5 minutes in some cases.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-midasbuy-blue">•</span>
                Contact customer support if you face any issues with your order.
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      {/* Username Dialog */}
      <Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
        <DialogContent className="bg-midasbuy-navy border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-midasbuy-blue" />
              Enter Your Roblox Username
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-yellow-900/20 rounded-lg border border-yellow-600/20">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Your Roblox Username can be found in your Roblox profile. Go to your profile and copy your username. This is required to deliver Robux directly to your account.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Roblox Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Roblox Username"
                className="bg-midasbuy-darkBlue border-gray-700 text-white"
              />
            </div>

            <Button
              onClick={handleUsernameSubmit}
              className="w-full bg-midasbuy-blue hover:bg-midasbuy-blue/80 text-white py-3"
            >
              Continue to Checkout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RobloxPlayerIdPage;

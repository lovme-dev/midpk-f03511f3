import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Ticket, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";
import couponEmptyIcon from "@/assets/coupon-empty-icon.png";

interface CouponsPageProps {
  onLogout: () => void;
}

const CouponsPage = ({ onLogout }: CouponsPageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue flex flex-col">
      <Helmet>
        <title>My Coupons | Discount Codes for PUBG UC & Gaming Currency | Midasbuy</title>
        <meta name="description" content="View and redeem your Midasbuy coupons for discounts on PUBG UC, Free Fire diamonds, Roblox Robux, and more gaming currencies. Get exclusive deals and save more." />
        <link rel="canonical" href="https://www.middasbuy.com/coupons" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <Header onLogout={onLogout} />
      
      <main className="flex-1 pt-16 md:pt-20">
        {/* Page Header */}
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-colors bg-transparent md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-white text-lg md:text-xl font-bold tracking-wide">{t('couponsPage.title', 'MY COUPONS')}</h1>
          </div>
          
          {/* Redeem Button - exact match to reference */}
          <Link
            to="/redeem"
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-500/50 rounded-full bg-[#1a2942] hover:bg-[#243550] transition-colors"
          >
            <Ticket className="w-4 h-4 text-midasbuy-blue" />
            <span className="text-sm font-medium text-midasbuy-blue">{t('couponsPage.redeem', 'Redeem')}</span>
          </Link>
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          {/* Coupon Icon Image */}
          <div className="mb-6">
            <img 
              src={couponEmptyIcon} 
              alt="No coupons" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          {/* No Coupons Text */}
          <p className="text-gray-500 text-base mb-8">{t('couponsPage.noEligibleCoupons', 'No Eligible Coupons')}</p>
          
          {/* Historical Coupons Link */}
          <button
            onClick={() => {
              if (!user) {
                openAuthModal();
              }
            }}
            className="flex items-center gap-1 text-midasbuy-blue hover:underline transition-colors"
          >
            <span className="text-sm font-medium">{t('couponsPage.historicalCoupons', 'Historical Coupons')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CouponsPage;

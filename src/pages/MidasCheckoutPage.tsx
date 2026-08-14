import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  User, 
  Info, 
  CreditCard,
  Ticket,
  HelpCircle,
  Gift
} from 'lucide-react';
import { 
  EasyPaisaLogo, 
  JazzCashLogo, 
  VisaLogo, 
  MastercardLogo, 
  AmexLogo, 
  UnionPayLogo, 
  MidasLogo, 
  UCStackIcon, 
  SingleUCIcon 
} from '@/components/checkout/CheckoutIcons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface MidasCheckoutPageProps {
  onLogout?: () => void;
}

const MidasCheckoutPage: React.FC<MidasCheckoutPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { countryCode } = useParams<{ countryCode?: string }>();
  
  // Determine if user is in Pakistan based on URL country code
  const isPakistan = countryCode?.toLowerCase() === 'pk';
  
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [showPriceDetails, setShowPriceDetails] = useState<boolean>(false);
  const [showPlayerIdModal, setShowPlayerIdModal] = useState<boolean>(false);
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [showProductDetails, setShowProductDetails] = useState<boolean>(false);
  const [showExtraModal, setShowExtraModal] = useState<boolean>(false);

  // User Info State
  const [userInfo, setUserInfo] = useState<{id: string, name: string} | null>(null);
  
  // Temporary state for modal inputs
  const [tempId, setTempId] = useState('');
  const [tempName, setTempName] = useState('');

  // Package data from location state or defaults
  const packageData = location.state?.packageData || {
    ucAmount: 300,
    bonusUC: 25,
    price: 249,
    originalPrice: 269,
    currency: 'PKR'
  };

  const handleSavePlayerInfo = () => {
    if (tempId && tempName) {
      setUserInfo({ id: tempId, name: tempName });
      setShowPlayerIdModal(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handlePayment = () => {
    if (userInfo) {
      alert('Proceed to Payment');
      // Add actual payment logic here
    }
  };

  // Prevent background scrolling when any modal/panel is open (mobile/iOS-safe)
  useEffect(() => {
    const isAnyOverlayOpen = showPlayerIdModal || showCouponModal || showExtraModal || showPriceDetails;
    if (!isAnyOverlayOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [showPlayerIdModal, showCouponModal, showExtraModal, showPriceDetails]);

  return (
    // Main background updated to match lighter body: #14192b
    <div className="min-h-screen w-full bg-[#14192b] text-white flex justify-center font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 100% Same Lighting: Stronger Top-Left Blue Spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(85% 60% at 0% 0%, #2F6FE4 0%, rgba(47, 111, 228, 0.45) 40%, transparent 85%)',
          opacity: 0.85
        }}
      ></div>
      
      {/* Main Container - Responsive for Mobile & Desktop */}
      <div className={`w-full max-w-[1100px] min-h-screen relative z-10 p-0 md:p-8 lg:p-12 transition-filter duration-200 ${showPlayerIdModal || showCouponModal || showExtraModal ? 'brightness-50' : ''}`}>
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="flex items-center justify-between px-4 pt-5 pb-2 sticky top-0 z-20 md:hidden">
          <MidasLogo />
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={26} strokeWidth={1.5} />
          </button>
        </header>

        {/* Desktop Logo (Visible only on Desktop) */}
        <div className="hidden md:flex justify-between items-center mb-8">
           <MidasLogo />
           <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">English</span>
              <div className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-300">
                 <User size={18} />
                 <span className="text-sm font-medium">Sign in</span>
              </div>
           </div>
        </div>

        {/* RESPONSIVE LAYOUT GRID */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          
          {/* ================= LEFT COLUMN (Security Payment + Channels) ================= */}
          <div className="flex-1 pb-28 md:pb-0">
             
             <h2 className="hidden md:block text-white font-bold text-[18px] uppercase tracking-wide mb-5">SECURITY PAYMENT</h2>

             {/* Mobile: Product Section (Hidden on Desktop) */}
             <div className="px-4 mt-4 mb-6 md:hidden">
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center">
                      <div className="w-[60px] h-[60px] bg-[#14182b] border border-[#262c40] rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 mr-3">
                          <UCStackIcon />
                      </div>
                      <div className="flex items-center">
                          <div className="flex items-baseline gap-1">
                            <div className="self-center mr-1 transform scale-90"><SingleUCIcon /></div>
                            <span className="text-[22px] font-bold text-white leading-none tracking-tight">{packageData.ucAmount}</span>
                            {packageData.bonusUC > 0 && (
                              <>
                                <span className="text-[18px] font-bold text-[#ffc400] mx-0.5">+</span>
                                <span className="text-[22px] font-bold text-[#ffc400] leading-none tracking-tight">{packageData.bonusUC}</span>
                              </>
                            )}
                            <span className="text-[#8b91a0] text-[12px] font-normal ml-2 transform translate-y-[-1px]">
                                Total: {packageData.ucAmount + (packageData.bonusUC || 0)} UC
                            </span>
                          </div>
                      </div>
                    </div>
                    <button 
                        onClick={() => setShowProductDetails(!showProductDetails)}
                        className="w-8 h-8 bg-[#252a3d] rounded-lg flex items-center justify-center border border-[#30364d] shadow-sm hover:bg-[#323852] transition-colors cursor-pointer"
                    >
                        <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white transition-transform duration-200 ${showProductDetails ? 'rotate-180' : ''}`}></div>
                    </button>
                </div>
                {/* Mobile Dropdown */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showProductDetails ? 'max-h-[200px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
                      <div className="bg-[#1c2133] rounded-xl p-5 border border-[#232942]">
                          <div className="flex justify-between items-center mb-4">
                              <span className="text-[#8b91a0] text-[14px]">Purchase item:</span>
                              <div className="flex items-center gap-1.5">
                                  <div className="scale-90 opacity-90"><SingleUCIcon /></div>
                                  <span className="text-white font-bold text-[18px] tracking-wide">{packageData.ucAmount}</span>
                              </div>
                          </div>
                          <div className="h-[1px] bg-[#2a304a] w-full mb-4"></div>
                          <div className="flex justify-between items-center">
                              <span className="text-white text-[14px]">Total:</span>
                              <div className="flex items-center gap-1.5">
                                  <div className="scale-90 opacity-90"><SingleUCIcon /></div>
                                  <span className="text-white font-bold text-[18px] tracking-wide">{packageData.ucAmount + (packageData.bonusUC || 0)}</span>
                              </div>
                          </div>
                      </div>
                </div>
             </div>

             {/* Mobile: Extra Section (Hidden on Desktop - integrated into summary) */}
             <div className="px-4 mb-4 md:hidden">
                <div 
                  onClick={() => setShowExtraModal(true)}
                  className="cursor-pointer rounded-xl flex items-center justify-between border-t border-t-[#ffffff]/10 border-b border-b-[#000000]/20 shadow-md py-2 px-3 hover:brightness-110 transition-all active:scale-[0.99]"
                  style={{ 
                    background: 'linear-gradient(90deg, #de8031 0%, #3d251c 32%, #181d33 70%)' 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Gift size={18} className="text-white fill-white" strokeWidth={1.5} />
                    <span className="text-[13px] font-medium text-white/95 tracking-wide">Extra for you:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#dcecf7] via-[#8dbddb] to-[#5984a3] border border-[#a8cce3] shadow-sm flex items-center justify-center relative overflow-hidden">
                            <div className="w-4 h-4 rounded-full border border-[#ffffff]/40 bg-gradient-to-br from-[#ffffff]/20 to-[#000000]/10"></div>
                            <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px]"></div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 z-10">
                            <span className="text-white font-black text-[10px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] leading-none">20</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                </div>
             </div>

             {/* Player ID & Coupon Section */}
             <div className="px-4 mb-6 md:px-0">
                <div className="bg-[#1c2133] rounded-xl border border-[#232942] overflow-hidden">
                  
                  {/* Row 1: Player ID */}
                  <div 
                    className="flex items-center justify-between p-4 active:bg-[#252a3d] transition-colors cursor-pointer hover:bg-[#252a3d]"
                    onClick={() => setShowPlayerIdModal(true)}
                  >
                    {userInfo ? (
                      <>
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-gray-400" fill="currentColor" />
                          <span className="text-[14px] text-gray-300 font-medium">Player ID:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-[13px] font-medium">
                              {userInfo.name}<span className="text-gray-400">({userInfo.id})</span>
                          </span>
                          <ChevronRight size={16} className="text-[#3a7bfd]" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-gray-400" fill="currentColor" />
                          <span className="text-[13px] text-gray-400 font-medium">Player ID:</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#3a7bfd] text-[13px] hover:underline">Enter Player ID to purchase</span>
                          <ChevronRight size={16} className="text-[#3a7bfd]" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="h-[1px] bg-[#2a304a] mx-4"></div>

                  {/* Row 2: Coupon */}
                  <div 
                    className="flex items-center justify-between p-4 active:bg-[#252a3d] transition-colors cursor-pointer hover:bg-[#252a3d]"
                    onClick={() => setShowCouponModal(true)}
                  >
                    <div className="flex items-center gap-3">
                      <Ticket size={18} className="text-gray-400" />
                      <span className="text-[13px] text-gray-400 font-medium">Coupon:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-[13px]">No Available Coupon</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </div>
                </div>
             </div>

             {/* Section Header */}
             <div className="px-4 flex items-center gap-2 mb-3 md:px-0 md:mt-8">
                <span className="text-white font-bold text-[13px] md:text-[15px] tracking-wide uppercase">Select Payment Channels</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    <path d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0d101e" />
                </svg>
             </div>

             {/* Payment Methods */}
             <div className="px-4 space-y-3 md:px-0">
                {/* Credit Card */}
                <div 
                  onClick={() => setSelectedMethod('card')}
                  className={`relative rounded-xl p-4 pt-6 transition-all duration-200 border-[1.5px] overflow-hidden cursor-pointer ${
                    selectedMethod === 'card' 
                      ? 'bg-[#151a2e] border-[#307bf5]' 
                      : 'bg-[#1c2133] border-transparent hover:bg-[#252a3d]'
                  }`}
                >
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EAA07E] to-[#C07040] text-white text-[11px] font-medium px-2 py-[2px] rounded-br-lg z-10 flex items-center gap-1 shadow-sm">
                      <span className="font-serif italic font-bold text-[#6D3418] text-[12px] leading-none">V</span>
                      <span className="text-white/95 tracking-wide text-[11px]">VIP Extra Points</span>
                  </div>

                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-white rounded-md p-1 w-[46px] h-[30px] flex items-center justify-center mt-1 shadow-sm">
                        <CreditCard className="text-[#3b82f6] w-6 h-6 fill-blue-50" />
                      </div>
                      <div>
                        <div className="text-[14px] font-normal text-white mb-1.5 leading-tight">Credit/ Debit/ Prepaid<br/>Card</div>
                        
                        <div className="relative inline-flex items-center h-[20px] rounded-[4px] overflow-hidden pr-2">
                            <div 
                              className="absolute inset-0" 
                              style={{ 
                                background: 'linear-gradient(115deg, #FFB74D 0%, #F97316 22%, #2b2f42 22.5%)' 
                              }} 
                            />
                            <div className="relative z-10 flex items-center">
                              <div className="w-[24px] flex justify-center">
                                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#e1e7ef] via-[#9ca3af] to-[#4b5563] border border-[#d1d5db] shadow-[0_1px_2px_rgba(0,0,0,0.2)] flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-[#94a3b8] border border-[#cbd5e1]/50 bg-gradient-to-br from-transparent to-black/20"></div>
                                  </div>
                              </div>
                              <span className="text-[11px] text-[#e2e8f0] font-medium tracking-wide ml-0.5">2 x VIP Points</span>
                            </div>
                          </div>
                      </div>
                    </div>

                    <div className="flex -space-x-2.5 mt-2">
                      <div className="z-40 scale-[0.85]"><VisaLogo /></div>
                      <div className="z-30 scale-[0.85]"><MastercardLogo /></div>
                      <div className="z-20 scale-[0.85]"><AmexLogo /></div>
                      <div className="z-10 scale-[0.85]"><UnionPayLogo /></div>
                      <div className="z-0 w-8 h-5 bg-[#222736] rounded-sm text-[9px] flex items-center justify-center text-white border border-gray-700 ml-1.5">+3</div>
                    </div>
                  </div>

                  {selectedMethod === 'card' && (
                    <div className="mt-4 pt-3 border-t border-[#232942] flex items-center justify-between animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 text-xs text-white">
                        <Info size={14} className="text-white stroke-[2]" />
                        <span className="font-medium">Login Midasbuy Required</span>
                      </div>
                      <button className="bg-[#0096fa] hover:bg-[#0084db] text-white text-[11px] font-bold py-1.5 px-6 rounded-full shadow-lg shadow-blue-500/20">
                        Login
                      </button>
                    </div>
                  )}
                </div>

                {/* EasyPaisa - Only visible for Pakistan users */}
                {isPakistan && (
                  <div 
                    onClick={() => setSelectedMethod('easypaisa')}
                    className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer border-[1.5px] overflow-hidden hover:bg-[#252a3d] ${
                      selectedMethod === 'easypaisa' ? 'bg-[#151a2e] border-[#307bf5]' : 'bg-[#1c2133] border-[#1c2133]'
                    }`}
                  >
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EAA07E] to-[#C07040] text-white text-[11px] font-medium px-2 py-[2px] rounded-br-lg z-10 flex items-center gap-1 shadow-sm">
                        <span className="font-serif italic font-bold text-[#6D3418] text-[12px] leading-none">V</span>
                        <span className="text-white/95 tracking-wide text-[11px]">VIP Extra Points</span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <EasyPaisaLogo />
                        <span className="text-sm font-medium">Easypaisa</span>
                    </div>
                  </div>
                )}

                {/* JazzCash - Only visible for Pakistan users */}
                {isPakistan && (
                  <div 
                    onClick={() => setSelectedMethod('jazzcash')}
                    className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer border-[1.5px] overflow-hidden hover:bg-[#252a3d] ${
                      selectedMethod === 'jazzcash' ? 'bg-[#151a2e] border-[#307bf5]' : 'bg-[#1c2133] border-[#1c2133]'
                    }`}
                  >
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EAA07E] to-[#C07040] text-white text-[11px] font-medium px-2 py-[2px] rounded-br-lg z-10 flex items-center gap-1 shadow-sm">
                        <span className="font-serif italic font-bold text-[#6D3418] text-[12px] leading-none">V</span>
                        <span className="text-white/95 tracking-wide text-[11px]">VIP Extra Points</span>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-3">
                        <JazzCashLogo />
                        <span className="text-sm font-medium">JazzCash</span>
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* ================= RIGHT COLUMN (Order Summary) ================= */}
          <div className="hidden md:block w-[400px] shrink-0">
             <div className="bg-[#1c2133] rounded-xl border border-[#232942] p-6 shadow-xl sticky top-8">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-white font-bold text-[16px] uppercase tracking-wide">ORDER SUMMARY</h2>
                   <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                </div>

                {/* Product Box */}
                <div className="bg-[#14182b] border border-[#262c40] rounded-xl p-4 mb-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-[50px] h-[50px] flex items-center justify-center">
                         <UCStackIcon />
                      </div>
                      <div className="flex flex-col">
                         <div className="flex items-center gap-1">
                             <SingleUCIcon />
                             <span className="text-white font-bold text-lg">{packageData.ucAmount}</span>
                         </div>
                         <span className="text-[#8b91a0] text-xs">Total: {packageData.ucAmount + (packageData.bonusUC || 0)} UC</span>
                      </div>
                   </div>
                   <div className="bg-[#24293d] w-6 h-6 rounded flex items-center justify-center">
                       <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white"></div>
                   </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[#8b91a0] text-sm">Purchase item:</span>
                        <div className="flex items-center gap-1">
                            <div className="scale-75 opacity-80"><SingleUCIcon /></div>
                            <span className="text-white font-medium">{packageData.ucAmount}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#8b91a0] text-sm">Total:</span>
                        <div className="flex items-center gap-1">
                            <div className="scale-75 opacity-80"><SingleUCIcon /></div>
                            <span className="text-white font-medium">{packageData.ucAmount + (packageData.bonusUC || 0)}</span>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] bg-[#2a304a] w-full mb-6"></div>

                {/* Reward Section */}
                <div className="mb-8">
                   <h3 className="text-white text-sm font-medium mb-3">Purchase Reward</h3>
                   <div className="flex justify-between items-center">
                      <span className="text-[#8b91a0] text-sm">Midasbuy VIP Points:</span>
                      <div className="flex items-center gap-2">
                          <div className="relative w-5 h-5 flex items-center justify-center">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#dcecf7] via-[#8dbddb] to-[#5984a3] border border-[#a8cce3] shadow-sm flex items-center justify-center relative overflow-hidden">
                                  <div className="w-3 h-3 rounded-full border border-[#ffffff]/40 bg-gradient-to-br from-[#ffffff]/20 to-[#000000]/10"></div>
                                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-white/60 rounded-full blur-[1px]"></div>
                              </div>
                          </div>
                          <span className="text-[#3a7bfd] font-bold text-sm">x20</span>
                      </div>
                   </div>
                </div>

                {/* Bottom Section */}
                <div>
                   <div className="flex justify-between items-end mb-4">
                      <span className="text-white text-base">Total:</span>
                      <div className="text-right">
                         <span className="text-2xl font-bold text-white block leading-none mb-1">{packageData.price} {packageData.currency}</span>
                         {packageData.originalPrice && (
                           <span className="text-xs text-gray-500 line-through">{packageData.originalPrice} {packageData.currency}</span>
                         )}
                      </div>
                   </div>

                   {/* Desktop Button */}
                   {userInfo ? (
                      <button 
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                      >
                        Login Midasbuy
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowPlayerIdModal(true)}
                        className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                      >
                        Enter Player ID
                      </button>
                    )}
                </div>

             </div>
          </div>
        </div>

      </div>

      {/* Mobile Fixed Footer (Hidden on Desktop) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#101426] border-t border-[#1c2133] px-4 py-3 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] md:hidden">
         <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <span className="text-[22px] font-bold text-white tracking-tight leading-none">{packageData.price} {packageData.currency}</span>
                  <div 
                    className="bg-[#24293d] w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors hover:bg-[#2f354d]"
                    onClick={() => setShowPriceDetails(!showPriceDetails)}
                  >
                     <ChevronDown 
                      size={14} 
                      className={`text-gray-400 transition-transform duration-300 ${!showPriceDetails ? 'rotate-180' : ''}`} 
                      strokeWidth={3} 
                     />
                  </div>
               </div>
               {packageData.originalPrice && (
                 <span className="text-xs text-gray-500 line-through mt-1">{packageData.originalPrice} {packageData.currency}</span>
               )}
            </div>
            
            {userInfo ? (
              <button 
                onClick={handlePayment}
                className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold h-10 px-6 rounded text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-[140px]"
              >
                Pay Now
              </button>
            ) : (
              <button 
                onClick={() => setShowPlayerIdModal(true)}
                className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold h-10 px-6 rounded text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-[140px]"
              >
                Enter Player ID
              </button>
            )}
         </div>
      </div>

      {/* Dark Overlay for Price Details - Z-30 */}
      {showPriceDetails && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 transition-opacity md:hidden"
          onClick={() => setShowPriceDetails(false)}
          onTouchMove={(e) => e.preventDefault()}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Price Details Panel - Z-40 (Behind Footer which is Z-50) */}
      {showPriceDetails && (
        <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center md:hidden">
          <div className="w-full max-w-md bg-[#101426] rounded-t-2xl px-4 pt-4 pb-28 border-t border-[#232942] animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-base tracking-wide">PRICE DETAILS</h3>
              <button onClick={() => setShowPriceDetails(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Original Price:</span>
                <span className="text-white font-medium">{packageData.originalPrice || packageData.price} {packageData.currency}</span>
              </div>
              {packageData.originalPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-[#eeb337]">Discount:</span>
                  <span className="text-[#eeb337] font-medium">-{packageData.originalPrice - packageData.price} {packageData.currency}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-white text-base">Total:</span>
                <span className="text-white font-bold text-lg">{packageData.price} {packageData.currency}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER ID MODAL - Height Updated to 65vh */}
      {showPlayerIdModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowPlayerIdModal(false)}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: 'none' }}
          ></div>

          {/* Modal Content - CHANGED h-[90vh] to h-[65vh] */}
          <div className="w-full max-w-md h-[65vh] bg-[#101426] rounded-t-2xl md:rounded-2xl relative z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Header */}
            <div className="px-5 py-5 flex justify-between items-center">
              <h2 className="text-white font-bold text-[15px] uppercase tracking-wide">ENTER YOUR PLAYER ID NOW</h2>
              <button 
                onClick={() => setShowPlayerIdModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto px-5 pb-8"
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Labels */}
              <div className="flex justify-between items-center mb-2.5 text-xs">
                 <span className="text-gray-200 font-normal text-[13px]">Player ID</span>
                 <button className="text-[#3a7bfd] flex items-center gap-0.5 hover:underline text-[12px]">
                   Sign in to access saved Player ID
                   <ChevronRight size={14} />
                 </button>
              </div>

              {/* Input Box Container - UPDATED: TOUCHING */}
              <div className="mb-5">
                {/* Bright Blue Top Gradient Bar - Rounded Top Only */}
                <div className="bg-gradient-to-r from-[#06bdfd] to-[#2d7bf8] px-4 py-2.5 rounded-t-lg">
                   <p className="text-white text-[11px] leading-tight font-medium">
                     Please select or fill in your Player ID you want to recharge.
                   </p>
                </div>
                {/* Dark Input Field - TOUCHING (No Margin, No Top Rounding, Top Border Removed from View) */}
                <div className="bg-[#131722] border-x-2 border-b-2 border-[#2d7bf8] rounded-b-lg overflow-hidden">
                  <div className="p-2.5 border-b border-[#2d7bf8]/30">
                    <input 
                      type="text" 
                      placeholder="Enter Player ID"
                      value={tempId}
                      onChange={(e) => setTempId(e.target.value)}
                      className="w-full bg-transparent text-white/90 outline-none text-[13px] placeholder-gray-500 font-normal"
                    />
                  </div>
                  {/* Username Field */}
                  <div className="p-2.5">
                    <input 
                      type="text" 
                      placeholder="Enter Username"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-transparent text-white/90 outline-none text-[13px] placeholder-gray-500 font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* OK Button - UPDATED ON CLICK */}
              <button 
                onClick={handleSavePlayerInfo}
                className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                OK
              </button>

              {/* Help Section */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle size={16} className="text-white" />
                  <span className="text-white text-[13px] font-medium">Couldn't find your Player ID?</span>
                </div>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <p className="text-[#8b91a0] text-[13px] mb-2.5">1.1. Enter the game</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#232942] relative bg-[#0f1222]">
                       {/* Placeholder for Game Lobby Image */}
                       <div className="absolute inset-0 flex items-center justify-center">
                         <img 
                           src="https://img.freepik.com/free-vector/video-game-concept-illustration_114360-6379.jpg" 
                           alt="Game Lobby" 
                           className="w-full h-full object-cover opacity-60"
                         />
                         {/* Simulated Highlight Box top left */}
                         <div className="absolute top-4 left-4 w-12 h-12 border-2 border-red-500 rounded-sm"></div>
                       </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <p className="text-[#8b91a0] text-[13px] mb-2.5">2.2. Find your player ID</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#232942] relative bg-[#0f1222]">
                        {/* Placeholder for Profile Image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src="https://img.freepik.com/free-vector/hud-interface-futuristic-blue-virtual-graphic-touch-user-interface-target_1150-37146.jpg" 
                            alt="Profile Page" 
                            className="w-full h-full object-cover opacity-60"
                          />
                          {/* Simulated Highlight Box center */}
                          <div className="absolute top-1/3 left-1/3 w-24 h-8 border-2 border-red-500 rounded-sm"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL - 100% Same */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowCouponModal(false)}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: 'none' }}
          ></div>

          {/* Modal Content - height 65vh to match image approx */}
          <div className="w-full max-w-md h-[65vh] bg-[#101426] rounded-t-2xl md:rounded-2xl relative z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Header with Back Arrow */}
            <div className="flex items-center p-4 border-b border-[#1c2133]">
              <button 
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-white mr-3"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-white font-bold text-[15px] uppercase tracking-wide">CHOOSE COUPON</h2>
            </div>

            {/* Main Content - Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
              {/* Ticket Icon */}
              <div className="relative mb-4">
                 <Ticket 
                    size={80} 
                    strokeWidth={1}
                    className="text-[#2b3046] fill-[#1c2133] transform rotate-12"
                 />
                 {/* Simulate the % inside */}
                 <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#2b3046] font-bold text-2xl rotate-12">%</span>
              </div>
              <p className="text-[#8b91a0] font-medium text-[15px]">No Available Coupon</p>
            </div>

            {/* Bottom Info Box */}
            <div className="p-4">
               <div className="bg-[#131722] rounded-lg p-4 mb-4 border border-[#1c2133]">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">?</span>
                     </div>
                     <h3 className="text-white font-bold text-[14px]">Didn't see the coupon?</h3>
                  </div>
                  <p className="text-[#8b91a0] text-[13px] leading-snug mb-2.5">
                     We suggest that you can link your player ID to view your coupons.
                  </p>
                  <button className="text-[#3a7bfd] text-[13px] flex items-center hover:underline">
                     Link player ID to view <ChevronRight size={14} />
                  </button>
               </div>

               {/* OK Button */}
               <button 
                 onClick={() => setShowCouponModal(false)}
                 className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:brightness-110 text-white font-bold py-3.5 rounded-md text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
               >
                  OK
               </button>
            </div>

          </div>
        </div>
      )}

      {/* EXTRA FOR YOU MODAL */}
      {showExtraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop - lighter opacity 60% as interpreted from 'dark na ho' + image visibility */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-200"
            onClick={() => setShowExtraModal(false)}
          ></div>

          {/* Modal Content - Auto height */}
          <div className="w-full max-w-md bg-[#101426] rounded-t-2xl md:rounded-2xl relative z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 pb-8">
            
            {/* Header */}
            <div className="px-5 py-4 flex justify-between items-center border-b border-[#232942]">
              <h2 className="text-white font-bold text-[15px] uppercase tracking-wide">EXTRA FOR YOU</h2>
              <button 
                onClick={() => setShowExtraModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-6">
                <h3 className="text-white text-[15px] font-medium">Purchase Reward</h3>
              </div>
              
              <div className="flex justify-between items-center">
                 <span className="text-[#8b91a0] text-[14px]">Midasbuy VIP Points:</span>
                 <div className="flex items-center gap-2">
                    {/* Coin Icon - No badge */}
                     <div className="relative w-6 h-6 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#dcecf7] via-[#8dbddb] to-[#5984a3] border border-[#a8cce3] shadow-sm flex items-center justify-center relative overflow-hidden">
                              <div className="w-4 h-4 rounded-full border border-[#ffffff]/40 bg-gradient-to-br from-[#ffffff]/20 to-[#000000]/10"></div>
                              <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px]"></div>
                          </div>
                     </div>
                     <span className="text-white font-bold text-[14px]">x20</span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MidasCheckoutPage;

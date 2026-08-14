import React, { useState } from 'react';

export const EasyPaisaLogo = () => (
  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
      <span className="text-[8px] font-bold text-green-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">ep</span>
    </div>
  </div>
);

export const JazzCashLogo = () => (
  <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-gray-200">
    <div className="w-6 h-4 bg-red-600 relative">
      <div className="absolute right-0 top-0 w-2 h-4 bg-yellow-400"></div>
    </div>
  </div>
);

export const RazerGoldLogo = () => (
  <div className="w-8 h-8 rounded bg-black flex items-center justify-center border border-green-500">
    <span className="text-[8px] font-bold text-green-500">Z</span>
  </div>
);

export const VisaLogo = () => (
  <svg viewBox="0 0 36 24" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="2" fill="white"/>
    <path d="M14.5 6H17.5L16 18H13L14.5 6Z" fill="#1A1F71"/>
    <path d="M21 6L19 18H16.5L18.5 6H21Z" fill="#1A1F71"/>
    <path d="M27 6H24L23 9H25L25.5 6H27Z" fill="#1A1F71"/>
  </svg>
);

export const MastercardLogo = () => (
  <svg viewBox="0 0 36 24" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="2" fill="#222"/>
    <circle cx="14" cy="12" r="6" fill="#EB001B"/>
    <circle cx="22" cy="12" r="6" fill="#F79E1B" fillOpacity="0.9"/>
  </svg>
);

export const AmexLogo = () => (
  <div className="w-[30px] h-4 rounded bg-[#006fcf] flex items-center justify-center">
    <span className="text-[6px] font-bold text-white tracking-tighter">AMEX</span>
  </div>
);

export const UnionPayLogo = () => (
  <div className="w-[30px] h-4 rounded bg-[#004f5e] flex items-center justify-center relative overflow-hidden">
     <div className="absolute right-0 w-1/3 h-full bg-[#e33e46] transform -skew-x-12"></div>
     <div className="absolute left-0 w-1/3 h-full bg-[#007c7a] transform -skew-x-12"></div>
     <span className="relative z-10 text-[5px] text-white font-bold">Union</span>
  </div>
);

export const MidasLogo = () => (
  <div className="flex items-center">
    <img 
      src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png" 
      alt="Midasbuy Logo" 
      className="h-5 w-auto"
    />
  </div>
);

// New UC Stack Icon to simulate the 3D stack in the image
export const UCStackIcon = () => (
  <div className="relative w-full h-full flex items-center justify-center">
     <div className="absolute w-10 h-6 bg-[#3d342b] border border-[#a88b5e] rounded transform -rotate-12 translate-y-1 translate-x-1 opacity-60"></div>
     <div className="absolute w-10 h-6 bg-[#5c4d3c] border border-[#d4af37] rounded transform -rotate-6 translate-y-0.5 translate-x-0.5"></div>
     <div className="relative w-10 h-6 bg-gradient-to-br from-[#2a2a2a] to-[#000] border border-[#f2c037] rounded flex items-center justify-center shadow-lg">
        <span className="text-[#f2c037] font-black text-[10px] tracking-widest">UC</span>
     </div>
  </div>
);

// Small inline UC Icon
export const SingleUCIcon = () => (
  <div className="w-[26px] h-[16px] bg-gradient-to-br from-[#2a2a2a] to-[#000] border border-[#9CA3AF] rounded flex items-center justify-center shadow-sm">
     <span className="text-white font-bold text-[7px] tracking-widest">UC</span>
  </div>
);

// VIP Coin Icon
export const VIPCoinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <img 
    src="/images/vip-coin-icon.png" 
    alt="VIP Coin" 
    className={className}
  />
);

// Card Payment Icons with expandable view
const cardIcons = [
  { src: '/images/visa-card.png', alt: 'Visa' },
  { src: '/images/mastercard.png', alt: 'Mastercard' },
  { src: '/images/amex-card.png', alt: 'American Express' },
  { src: '/images/unionpay-card.png', alt: 'UnionPay' },
  { src: '/images/jcb-card.png', alt: 'JCB' },
  { src: '/images/discover-card.png', alt: 'Discover' },
  { src: '/images/diners-card.png', alt: 'Diners Club' },
];

export const CardPaymentIcons = () => {
  const [expanded, setExpanded] = useState(false);
  
  const visibleIcons = expanded ? cardIcons : cardIcons.slice(0, 4);
  const remainingCount = cardIcons.length - 4;

  // Smaller icons to fit all in one line
  const iconSize = expanded ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-0.5 flex-nowrap">
        {visibleIcons.map((icon) => (
          <div 
            key={icon.alt}
            className={`${iconSize} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0`}
          >
            <img 
              src={icon.src} 
              alt={icon.alt} 
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        {!expanded && remainingCount > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="w-4 h-4 rounded-full bg-[#2a3042]/60 text-[7px] flex items-center justify-center text-gray-300 font-medium hover:bg-[#353d54] transition-colors flex-shrink-0"
          >
            +{remainingCount}
          </button>
        )}
      </div>
    </div>
  );
};

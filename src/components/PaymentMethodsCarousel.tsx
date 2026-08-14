
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import './SocialMediaIcons.css';

const PaymentMethodsCarousel = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  
  // Check if current URL is Pakistani
  const isPakistanUrl = location.pathname.toLowerCase().includes('/pk');
  
  const handleMaintenanceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "🔧 Under Maintenance",
      description: "Payment methods are temporarily unavailable. We're working to bring them back soon!",
      variant: "destructive",
    });
  };
  
  // Pakistan specific payment methods (8 icons)
  const pkPaymentMethods = [
    { src: "/lovable-uploads/pk-ufone.png", alt: "Ufone", link: "#", needsBg: true },
    { src: "/lovable-uploads/pk-zong.png", alt: "Zong", link: "#", needsBg: true },
    { src: "/lovable-uploads/pk-jazz.png", alt: "Jazz", link: "#", needsBg: true },
    { src: "/lovable-uploads/pk-creditcards.png", alt: "Credit Cards", link: "#", needsBg: true },
    { src: "/lovable-uploads/pk-telenor.jpeg", alt: "Telenor", link: "#", needsBg: true },
    { src: "/lovable-uploads/pk-easypaisa.png", alt: "Easypaisa", link: "#", needsBg: true },
    { src: "/lovable-uploads/pk-razergold.jpeg", alt: "Razer Gold", link: "#", needsBg: false },
    { src: "/lovable-uploads/pk-jazzcash.png", alt: "JazzCash", link: "#", needsBg: true },
  ];
  
  // Default payment methods for other regions (10 icons)
  const defaultPaymentMethods = [
    { src: "/lovable-uploads/global-stc.png", alt: "STC", link: "#", needsBg: true },
    { src: "/lovable-uploads/global-applepay.png", alt: "Apple Pay", link: "#", needsBg: false },
    { src: "/lovable-uploads/global-unipin.png", alt: "UniPin", link: "#", needsBg: true },
    { src: "/lovable-uploads/global-jawal.png", alt: "Jawal", link: "#", needsBg: true },
    { src: "/lovable-uploads/global-mobily.png", alt: "Mobily", link: "#", needsBg: true },
    { src: "/lovable-uploads/global-asiacell.png", alt: "Asiacell", link: "#", needsBg: false },
    { src: "/lovable-uploads/global-humo.jpeg", alt: "HUMO", link: "#", needsBg: false },
    { src: "/lovable-uploads/global-maxis.jpeg", alt: "Maxis", link: "#", needsBg: true },
    { src: "/lovable-uploads/global-creditcards.png", alt: "Credit Cards", link: "#", needsBg: true },
    { src: "/lovable-uploads/global-razergold.jpeg", alt: "Razer Gold", link: "#", needsBg: false },
  ];
  
  // Select payment methods based on URL
  const paymentMethods = isPakistanUrl ? pkPaymentMethods : defaultPaymentMethods;

  // Duplicate the array for seamless looping
  const duplicatedMethods = [...paymentMethods, ...paymentMethods];

  useEffect(() => {
    if (paymentMethods.length === 0) {
      setRenderComplete(true);
      return;
    }
    
    // Preload all payment method images in parallel
    const preloadPromises = paymentMethods.map(method => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = method.src;
        img.loading = "eager";
        img.onload = () => {
          setImagesLoaded(prev => prev + 1);
          resolve();
        };
        img.onerror = () => resolve();
      });
    });
    
    // Mark component as ready to render when all images are loaded
    Promise.all(preloadPromises).then(() => {
      setRenderComplete(true);
    });
  }, [paymentMethods.length]);

  // Don't render if no payment methods for this region
  if (paymentMethods.length === 0) {
    return null;
  }

  return (
    <div className="mt-10" dir="ltr">
      <h3 className="hidden md:block text-white font-bold mb-4 text-center">Payment Methods</h3>
      <h3 className="md:hidden text-white text-sm font-medium mb-3 text-left">
        Midasbuy Supports Payment Channels
      </h3>
      <div className={`payment-methods-container optimize-layout transition-opacity duration-300 ${renderComplete ? 'opacity-100' : 'opacity-0'}`}>
        <div className="payment-methods-scroll optimize-animation">
          {duplicatedMethods.map((method, index) => (
            <div
              key={`${method.alt}-${index}`}
              onClick={handleMaintenanceClick}
              className="payment-method-logo cursor-pointer"
            >
              <img 
                src={method.src}
                alt={method.alt} 
                className={`h-full w-auto object-contain ${method.needsBg ? 'needs-bg' : ''}`}
                width="40"
                height="28"
                style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsCarousel;

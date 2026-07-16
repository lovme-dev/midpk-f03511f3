import { useToast } from "@/hooks/use-toast";

const PaymentMethods = () => {
  const { toast } = useToast();
  
  const handleMaintenanceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "🔧 Under Maintenance", 
      description: "Payment methods are temporarily unavailable. We're working to bring them back soon!",
      variant: "destructive",
    });
  };

  // Using exact same images from PaymentMethodsCarousel that exist in public/lovable-uploads
  const paymentMethods = [
    { src: "/lovable-uploads/472b4a57-816e-438a-9263-5def84a255d4.png", alt: "WeChat Pay" },
    { src: "/lovable-uploads/49c6d1b3-3f65-4564-abb7-4508f09f1be4.png", alt: "Paysafecard" },
    { src: "/lovable-uploads/d144375d-1696-41a3-8db3-0060edf9bc1b.png", alt: "QBucks" },
    { src: "/lovable-uploads/34a2899d-6b6b-4a53-b345-8ed077fa89c9.png", alt: "Dollar General" },
    { src: "/lovable-uploads/0d361fa6-0d2b-42d0-a2fb-1b292c4a9f68.png", alt: "PayPal" },
    { src: "/lovable-uploads/17e669b9-358d-4d7d-afaa-06e54f7a7d21.png", alt: "Google Pay" },
    { src: "/lovable-uploads/3a833ba0-ffe1-4464-b71c-3078d1ad11a3.png", alt: "Apple Pay" },
    { src: "/lovable-uploads/239b1416-8be4-4867-a17f-1021d7fa9634.png", alt: "CVS" },
    { src: "/lovable-uploads/a267526b-908a-4ca3-b4a2-5a2e84d6028d.png", alt: "Razer Gold" },
    { src: "/lovable-uploads/a3bcbe77-a5ec-47d8-869b-12fd83375b7a.png", alt: "Free Fire Diamonds" },
    { src: "/lovable-uploads/64d8c033-d782-423f-b765-28400efa4bb7.png", alt: "Easypaisa" },
    { src: "/lovable-uploads/003a6305-518f-450a-b4c1-2a023cd35475.png", alt: "JazzCash" },
    { src: "/lovable-uploads/a67bd7cd-6266-45f5-920d-5c4e2e13b41b.png", alt: "Razer Gold" },
    { src: "/lovable-uploads/2fec7e58-ac70-42fe-a8b8-8ad1a9d94ef0.png", alt: "Credit Card" },
  ];

  return (
    <div className="payment-methods-container">
      <div className="payment-methods-heading">Payment Methods</div>
      <div className="payment-methods-logos">
        {paymentMethods.map((method, index) => (
          <div key={index} className="payment-method-logo cursor-pointer" onClick={handleMaintenanceClick}>
            <img 
              src={method.src} 
              alt={method.alt} 
              width="36" 
              height="24" 
              loading="lazy" 
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
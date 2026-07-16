import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CustomerServiceWidgetProps {
  whatsappNumber?: string;
}

export function CustomerServiceWidget({ whatsappNumber }: CustomerServiceWidgetProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [activeWhatsAppNumber, setActiveWhatsAppNumber] = useState(whatsappNumber || "+14502322003");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "How can I help you?",
    "What can I help you with?",
    "Do you have any questions?",
    "Having any issues? Contact now",
    "Need assistance? We're here",
    "Got questions? Ask us now",
    "Need help? Chat with us"
  ];

  useEffect(() => {
    // For now, use a default WhatsApp number
    // This can be configured through admin panel later
    setActiveWhatsAppNumber('+14502322003');
    
    if (!whatsappNumber) {
      // Future: fetch WhatsApp number from admin settings
    }
  }, [whatsappNumber]);

  useEffect(() => {
    // Show message for 3 seconds, then hide for 20 seconds, repeat
    const interval = setInterval(() => {
      // Change message each time it shows
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 23000); // 3 seconds show + 20 seconds hide

    // Initial display
    setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 1000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const handleClick = () => {
    const cleanNumber = activeWhatsAppNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative flex flex-col items-center gap-1">
        {/* Message bubble - positioned above */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-white rounded-lg shadow-lg p-2 md:p-3 max-w-[160px] md:max-w-[200px] border relative mb-1"
            >
              <div className="text-xs md:text-sm text-gray-800 font-medium text-center">
                {messages[currentMessageIndex]}
              </div>
              {/* Arrow pointing down */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[7px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character image - moved 2% up */}
        <div className="relative" style={{ marginTop: '-2%' }}>
          <img 
            src="/lovable-uploads/c68519df-0213-4770-ae3f-d0a385c8c373.png" 
            alt="Mira Assistant" 
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* Mira button */}
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-white font-medium text-sm"
        >
          <span className="text-base">🎧</span>
          <span>Mira</span>
          
          {/* Online indicator */}
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </motion.button>
      </div>
    </div>
  );
}
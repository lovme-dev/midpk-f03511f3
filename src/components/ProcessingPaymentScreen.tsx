
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface ProcessingPaymentScreenProps {
  paymentMethod: string;
  selectedMobilePayment?: string;
  status?: 'processing' | 'success' | 'failed';
  errorMessage?: string;
}

const ProcessingPaymentScreen = ({ 
  paymentMethod, 
  selectedMobilePayment,
  status = 'processing',
  errorMessage
}: ProcessingPaymentScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="flex flex-col items-center">
          {/* Card Icon with Status */}
          <div className="relative mb-6">
            {/* Card Background */}
            <motion.div 
              className={`w-32 h-20 rounded-xl shadow-lg flex items-center justify-center ${
                status === 'failed' 
                  ? 'bg-gradient-to-br from-red-400 to-red-500' 
                  : status === 'success'
                    ? 'bg-gradient-to-br from-green-400 to-green-500'
                    : 'bg-gradient-to-br from-blue-400 to-blue-500'
              }`}
              animate={status === 'processing' ? { 
                boxShadow: [
                  "0 10px 30px -10px rgba(59, 130, 246, 0.5)",
                  "0 20px 40px -15px rgba(59, 130, 246, 0.6)",
                  "0 10px 30px -10px rgba(59, 130, 246, 0.5)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Card Chip */}
              <div className="w-10 h-7 bg-yellow-300/80 rounded-md border border-yellow-400/50 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-yellow-500/60 rounded-sm" />
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Status Badge */}
            <AnimatePresence mode="wait">
              {status === 'processing' ? (
                <motion.div 
                  key="processing"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </motion.div>
              ) : status === 'success' ? (
                <motion.div 
                  key="success"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div 
                  key="failed"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring" }}
                >
                  <X className="w-5 h-5 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Status Text */}
          <AnimatePresence mode="wait">
            {status === 'processing' ? (
              <motion.div
                key="processing-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Processing payment, please wait
                </h2>
                <p className="text-gray-500">a moment...</p>
              </motion.div>
            ) : status === 'success' ? (
              <motion.div
                key="success-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-1">
                  Card Verified Successfully
                </h2>
                <p className="text-gray-500">Proceeding to verification...</p>
              </motion.div>
            ) : (
              <motion.div
                key="failed-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h2 className="text-lg font-semibold text-red-600 mb-1">
                  Payment Failed
                </h2>
                <p className="text-gray-500 text-sm px-2">
                  {errorMessage || 'Please check your card details and try again.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Loading Dots - only show when processing */}
          {status === 'processing' && (
            <div className="flex gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingPaymentScreen;

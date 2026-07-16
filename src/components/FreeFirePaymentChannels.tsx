import { useState } from "react";
import { ChevronDown, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FreeFirePaymentChannelsProps {
  onPaymentMethodChange?: (method: string) => void;
}

const FreeFirePaymentChannels = ({ onPaymentMethodChange }: FreeFirePaymentChannelsProps) => {
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const paymentMethods = [
    { value: "all", label: "All Payment Methods", icon: "💳" },
    { value: "garena_shells", label: "Garena Shells", icon: "🔥" },
    { value: "google_play", label: "Google Play Cards", icon: "🎮" },
    { value: "apple_gift", label: "Apple Gift Cards", icon: "🍎" },
    { value: "credit_card", label: "Credit/Debit Card", icon: "💳" },
    { value: "paypal", label: "PayPal", icon: "💰" },
    { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  ];

  const handleMethodSelect = (method: string) => {
    // Show maintenance notification for all payment methods
    toast({
      title: "🔧 Under Maintenance",
      description: "Payment channels are temporarily unavailable. We're working to bring them back soon!",
      variant: "destructive",
    });
    setIsOpen(false);
  };

  const selectedMethodData = paymentMethods.find(method => method.value === selectedMethod);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-midasbuy-navy/50 text-white rounded-lg hover:bg-midasbuy-navy/70 transition-colors border border-[#2196F3]/20 text-sm">
          <CreditCard className="w-4 h-4 text-[#33C3F0]" />
          <span className="hidden sm:inline">Payment Channels</span>
          <span className="sm:hidden">Payment</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-midasbuy-navy border border-[#2196F3]/20">
        <div className="p-3 border-b border-[#2196F3]/20">
          <h3 className="text-white font-medium text-sm">Free Fire Payment Methods</h3>
          <p className="text-gray-400 text-xs mt-1">Choose your preferred payment method</p>
        </div>
        {paymentMethods.map((method) => (
          <DropdownMenuItem
            key={method.value}
            onClick={() => handleMethodSelect(method.value)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#2196F3]/10 ${
              selectedMethod === method.value ? 'bg-[#2196F3]/20' : ''
            }`}
          >
            <span className="text-lg">{method.icon}</span>
            <span className="text-white text-sm">{method.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FreeFirePaymentChannels;
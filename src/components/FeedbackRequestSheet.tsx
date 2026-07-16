import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";

interface OrderItem {
  id: string;
  gameName: string;
  productLabel: string;
  ucAmount: number;
  price: number;
  currencyCode: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed' | 'refund_review' | 'refunded';
  transactionId: string;
  playerId: string;
  productType?: string | null;
  paymentMethod?: string;
  username?: string;
}

interface FeedbackRequestSheetProps {
  order: OrderItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  userEmail?: string;
}

export default function FeedbackRequestSheet({ 
  order, 
  open, 
  onOpenChange, 
  onNext,
}: FeedbackRequestSheetProps) {
  if (!order) return null;

  const formatDateTime = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })}`;
  };

  // Get payment method label
  const getPaymentMethodLabel = () => {
    const method = order.paymentMethod?.toLowerCase() || 'redeem';
    if (method.includes('card') || method.includes('xpay')) return 'card';
    if (method.includes('payfast')) return 'payfast';
    return 'redeem';
  };

  // Format player ID with username
  const formatPlayerDisplay = () => {
    if (order.username) {
      return `${order.playerId}(${order.username})`;
    }
    return order.playerId;
  };

  // Form field component - read-only style
  const FormField = ({ label, value, required = true }: { label: string; value: string; required?: boolean }) => (
    <div className="mb-4">
      <label className="text-[#8b9cb8] text-sm mb-1.5 block">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="bg-[#1a2a3f] rounded-lg px-4 py-3 text-[#8b9cb8] text-sm border border-[#2a3a4f]">
        {value}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="bg-[#0f1a2b] border-t-0 rounded-t-3xl p-0 max-h-[95vh] overflow-y-auto"
      >
        {/* Red accent bar at top */}
        <div className="h-1 bg-red-500 w-full" />
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1a2b] px-5 pt-4 pb-3 flex items-center justify-between z-10">
          <SheetTitle className="text-white text-base font-bold uppercase tracking-wide">
            SUBMIT A REQUEST
          </SheetTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-[#8b9cb8] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6">
          <FormField label="Time" value={formatDateTime(order.date)} />
          <FormField label="Region" value="pk" />
          <FormField label="Payment Method" value={getPaymentMethodLabel()} />
          <FormField label="Amount" value={String(order.ucAmount)} />
          <FormField label="Game" value={order.gameName} />
          <FormField label="Player ID" value={formatPlayerDisplay()} />
          <FormField label="Item" value="UC" />

          {/* Next Button - Blue gradient like Enter Player ID Now */}
          <button
            onClick={onNext}
            className="w-full mt-4 py-4 rounded-xl font-semibold text-white text-base transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
            }}
          >
            Next
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

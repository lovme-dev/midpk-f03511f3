import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FeedbackRequestSheet from "./FeedbackRequestSheet";
import FeedbackQuestionsSheet from "./FeedbackQuestionsSheet";
import { formatOrderPrice } from "@/utils/formatOrderPrice";

interface OrderItem {
  id: string;
  gameName: string;
  productLabel: string;
  ucAmount: number;
  bonusAmount: number;
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

interface OrderDetailSheetProps {
  order: OrderItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDetailSheet({ order, open, onOpenChange }: OrderDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const [feedbackRequestOpen, setFeedbackRequestOpen] = useState(false);
  const [feedbackQuestionsOpen, setFeedbackQuestionsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Fetch user email when component mounts
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // First try to get email from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.email) {
          setUserEmail(profile.email);
        } else if (user.email) {
          setUserEmail(user.email);
        }
      }
    };
    fetchUserEmail();
  }, []);

  if (!order) return null;

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Success';
      case 'pending':
      case 'processing':
        return 'Incomplete';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Failed';
      case 'refund_review':
        return 'Refund Review';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
      case 'processing':
        return 'text-yellow-400';
      case 'refund_review':
      case 'refunded':
        return 'text-emerald-400';
      case 'cancelled':
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const formatDate = (date: Date) => {
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

  // Row component for consistent layout
  const DetailRow = ({ label, value, valueClassName = "text-white" }: { label: string; value: React.ReactNode; valueClassName?: string }) => (
    <div className="flex py-1.5">
      <span className="text-[#8b9cb8] text-[13px] w-[120px] flex-shrink-0">{label}</span>
      <span className={`text-[13px] ${valueClassName}`}>{value}</span>
    </div>
  );

  // Format account display like image: "52210077772 (beverserc)"
  const formatAccountDisplay = () => {
    if (order.username) {
      return `${order.playerId} (${order.username})`;
    }
    return order.playerId;
  };

  // Handle feedback problem click
  const handleFeedbackClick = () => {
    setFeedbackRequestOpen(true);
  };

  // Handle next from request sheet to questions sheet
  const handleNextToQuestions = () => {
    setFeedbackRequestOpen(false);
    setFeedbackQuestionsOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="bg-[#0f1a2b] border-t-0 rounded-t-3xl p-0 max-h-[85vh] overflow-y-auto"
        >
          {/* Custom Header */}
          <div className="sticky top-0 bg-[#0f1a2b] px-5 pt-5 pb-3 flex items-center justify-between z-10">
            <SheetTitle className="text-white text-base font-bold uppercase tracking-wide">
              ORDER DETAILS
            </SheetTitle>
            <button 
              onClick={() => onOpenChange(false)}
              className="text-[#8b9cb8] hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 pb-8">
            {/* Order Info Section */}
            <div className="border-b border-[#1a2a3f] pb-1">
              {/* Order Number with Copy button */}
              <div className="flex py-1.5">
                <span className="text-[#8b9cb8] text-[13px] w-[120px] flex-shrink-0">Order Number :</span>
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-white text-[13px] break-all leading-tight flex-1">
                    {order.transactionId}
                  </span>
                  <button 
                    onClick={handleCopyOrderNumber}
                    className="flex-shrink-0 text-[#5b8fd9] hover:text-[#7aa3e5] transition-colors p-0.5"
                    title="Copy Order Number"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <DetailRow 
                label="Time :" 
                value={formatDate(order.date)}
              />
              <DetailRow 
                label="Payment :" 
                value={getPaymentMethodLabel()}
              />
              <DetailRow 
                label="Status :" 
                value={getStatusLabel(order.status)}
                valueClassName={getStatusColor(order.status)}
              />
            </div>

            {/* Product Info Section */}
            <div className="border-b border-[#1a2a3f] py-1 mt-2">
              <DetailRow 
                label="Product :" 
                value={order.productLabel}
              />
              <DetailRow 
                label="Rewards :" 
                value={order.bonusAmount > 0 ? (
                  <span>
                    <span className="text-white">{order.productLabel} {order.ucAmount}</span>
                    <span className="text-amber-600">* {order.bonusAmount}</span>
                  </span>
                ) : "No Rewards"}
              />
              {/* Account row with format like image: "52210077772 (beverserc)\nGame Name" */}
              <div className="flex py-1.5">
                <span className="text-[#8b9cb8] text-[13px] w-[120px] flex-shrink-0">Account:</span>
                <div className="text-white text-[13px] leading-tight">
                  <div>{formatAccountDisplay()}</div>
                  <div>{order.gameName}</div>
                </div>
              </div>
            </div>

            {/* Rewards with game-specific currency label */}
            {/* Note: productLabel already contains the correct currency (Robux/Diamond/UC/VP) */}

            {/* Price Section - Always show actual payment amount with currency */}
            <div className="border-b border-[#1a2a3f] py-2.5 mt-2">
              <div className="flex">
                <span className="text-[#8b9cb8] text-[13px] w-[120px] flex-shrink-0">Price :</span>
                <span className="text-white text-lg font-bold">
                  {formatOrderPrice(order.price, order.currencyCode)}
                </span>
              </div>
            </div>

            {/* Feedback Link - Centered with darker blue */}
            <div className="pt-4 text-center">
              <button 
                onClick={handleFeedbackClick}
                className="text-[#5b8fd9] text-[13px] hover:text-[#7aa3e5] transition-colors"
              >
                Feedback Problem
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Feedback Request Sheet (Step 1) */}
      <FeedbackRequestSheet
        order={order}
        open={feedbackRequestOpen}
        onOpenChange={setFeedbackRequestOpen}
        onNext={handleNextToQuestions}
        userEmail={userEmail}
      />

      {/* Feedback Questions Sheet (Step 2) */}
      <FeedbackQuestionsSheet
        order={order}
        open={feedbackQuestionsOpen}
        onOpenChange={setFeedbackQuestionsOpen}
        userEmail={userEmail}
      />
    </>
  );
}

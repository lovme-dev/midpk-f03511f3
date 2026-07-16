import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface FeedbackQuestionsSheetProps {
  order: OrderItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

const NATURE_OF_REQUEST_OPTIONS = [
  "Items into account",
  "Redemption code",
  "Recharge activities",
  "Card payment",
  "Account related classes",
  "Other",
  "Other consulting"
];

const REQUEST_TYPE_OPTIONS = [
  "Item not received",
  "Recharge Select Account/Region",
  "Insufficient goods received"
];

// Custom Dropdown Component matching reference design
const CustomDropdown = ({ 
  label, 
  value, 
  options, 
  onChange,
  required = true,
  isOpen,
  onToggle,
  onClose
}: { 
  label: string; 
  value: string; 
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="mb-4 relative">
      <label className="text-[#8b9cb8] text-sm mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full bg-[#1a2a3f] rounded-xl px-4 py-3.5 text-white text-[15px] text-left flex items-center justify-between transition-all duration-200 ${
          isOpen 
            ? 'border-2 border-[#38bdf8] ring-1 ring-[#38bdf8]/30' 
            : 'border border-[#2a3a4f]'
        }`}
      >
        <span>{value}</span>
        <ChevronDown className={`w-5 h-5 text-[#8b9cb8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          
          {/* Options Container */}
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a2a3f] rounded-2xl border border-[#2a3a4f] overflow-hidden z-50 shadow-xl">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  onClose();
                }}
                className={`w-full px-5 py-4 text-left text-[15px] transition-colors ${
                  value === option 
                    ? 'bg-[#2a3a4f] text-white' 
                    : 'text-[#8b9cb8] hover:bg-[#232f42]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function FeedbackQuestionsSheet({ 
  order, 
  open, 
  onOpenChange, 
  userEmail = ""
}: FeedbackQuestionsSheetProps) {
  const navigate = useNavigate();
  const [natureOfRequest, setNatureOfRequest] = useState("Items into account");
  const [requestType, setRequestType] = useState("Item not received");
  const [questionDetails, setQuestionDetails] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [natureDropdownOpen, setNatureDropdownOpen] = useState(false);
  const [requestTypeDropdownOpen, setRequestTypeDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!order) return null;

  // Format player ID with username
  const formatPlayerDisplay = () => {
    if (order.username) {
      return `${order.playerId}(${order.username})`;
    }
    return order.playerId;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - images.length);
      setImages(prev => [...prev, ...newImages].slice(0, 3));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!questionDetails.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      // Create feedback submission with user_id
      const { error } = await supabase
        .from('customer_inquiries')
        .insert({
          name: formatPlayerDisplay(),
          email: userEmail || 'no-email@provided.com',
          subject: `${natureOfRequest} - ${requestType} - Order: ${order.transactionId}`,
          message: `
Application: ${order.gameName}
Nature of Request: ${natureOfRequest}
Request Type: ${requestType}
Order Number: ${order.transactionId}
Player ID: ${formatPlayerDisplay()}

Question Details:
${questionDetails}
          `.trim(),
          user_id: user?.id || null,
          status: 'pending'
        });

      if (error) throw error;

      // Show success popup
      setShowSuccess(true);

    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close success and reset
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setQuestionDetails("");
    setImages([]);
    setNatureOfRequest("Items into account");
    setRequestType("Item not received");
    onOpenChange(false);
  };

  // Handle go to my feedbacks
  const handleGoToFeedbacks = () => {
    handleCloseSuccess();
    navigate('/my-feedbacks');
  };

  // Form field component - read-only style
  const ReadOnlyField = ({ label, value, required = true }: { label: string; value: string; required?: boolean }) => (
    <div className="mb-4">
      <label className="text-[#8b9cb8] text-sm mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="bg-[#1a2a3f] rounded-xl px-4 py-3.5 text-[#6b7c8f] text-[15px] border border-[#2a3a4f]">
        {value}
      </div>
    </div>
  );

  // Success popup content
  if (showSuccess) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="bg-[#0f1a2b] border-t-0 rounded-t-3xl p-0 h-[95vh]"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0f1a2b] px-5 pt-4 pb-3 flex items-center justify-between z-10">
            <SheetTitle className="text-white text-sm font-bold uppercase tracking-wide">
              FEEDBACK ORDER PROBLEM
            </SheetTitle>
            <button 
              onClick={handleCloseSuccess}
              className="text-[#8b9cb8] hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Content */}
          <div className="flex flex-col items-center justify-center px-6 py-20">
            {/* Checkmark Icon - Gradient Circle */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
              }}
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>

            {/* Title */}
            <h2 className="text-white text-lg font-bold tracking-wider mb-3 uppercase">
              SUBMIT SUCCESSFULLY
            </h2>

            {/* Description */}
            <p className="text-[#8b9cb8] text-center text-sm leading-relaxed mb-10 max-w-xs">
              We will notify you of the result by email, and you can also check the processing progress on the my feedback record.
            </p>

            {/* Buttons */}
            <div className="w-full max-w-xs space-y-3">
              {/* My Feedback Record Button - Gradient */}
              <button
                onClick={handleGoToFeedbacks}
                className="w-full py-3 rounded-lg font-medium text-white text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                }}
              >
                My Feedback Record
              </button>

              {/* Close Button - Outlined with gradient border */}
              <button
                onClick={handleCloseSuccess}
                className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'transparent',
                  border: '1.5px solid transparent',
                  backgroundImage: 'linear-gradient(#0f1a2b, #0f1a2b), linear-gradient(90deg, #2563eb, #38bdf8)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  color: '#38bdf8',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="bg-[#0f1a2b] border-t-0 rounded-t-3xl p-0 max-h-[95vh] overflow-y-auto"
      >
        {/* Yellow progress bar at top */}
        <div className="h-1 bg-yellow-400 w-full" />
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1a2b] px-5 pt-4 pb-3 flex items-center justify-between z-10">
          <SheetTitle className="text-white text-base font-bold uppercase tracking-wide">
            FEEDBACK QUESTIONS
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
          <ReadOnlyField label="Application Name" value={order.gameName} />
          
          <CustomDropdown 
            label="Nature of Request" 
            value={natureOfRequest}
            options={NATURE_OF_REQUEST_OPTIONS}
            onChange={setNatureOfRequest}
            isOpen={natureDropdownOpen}
            onToggle={() => {
              setNatureDropdownOpen(!natureDropdownOpen);
              setRequestTypeDropdownOpen(false);
            }}
            onClose={() => setNatureDropdownOpen(false)}
          />
          
          <CustomDropdown 
            label="Request Type" 
            value={requestType}
            options={REQUEST_TYPE_OPTIONS}
            onChange={setRequestType}
            isOpen={requestTypeDropdownOpen}
            onToggle={() => {
              setRequestTypeDropdownOpen(!requestTypeDropdownOpen);
              setNatureDropdownOpen(false);
            }}
            onClose={() => setRequestTypeDropdownOpen(false)}
          />
          
          <ReadOnlyField label="Order Number" value={order.transactionId} />
          <ReadOnlyField label="Player ID" value={formatPlayerDisplay()} />
          <ReadOnlyField label="Contact Email" value={userEmail || 'Not provided'} />

          {/* Question Details Textarea */}
          <div className="mb-4">
            <label className="text-[#8b9cb8] text-sm mb-1.5 block">
              Question Details <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                value={questionDetails}
                onChange={(e) => setQuestionDetails(e.target.value.slice(0, 500))}
                placeholder="Please describe your issue in detail..."
                className="w-full bg-[#1a2a3f] rounded-xl px-4 py-3.5 text-white text-[15px] border border-[#2a3a4f] min-h-[120px] resize-none focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/30 placeholder:text-[#5a6a7e]"
              />
              <div className="absolute bottom-3 right-4 text-xs text-[#5a6a7e]">
                {questionDetails.length}/500
              </div>
            </div>
          </div>

          {/* Upload Picture */}
          <div className="mb-6">
            <label className="text-[#8b9cb8] text-sm mb-1.5 block">
              Upload Picture <span className="text-[#5a6a7e]">({images.length}/3)</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {/* Uploaded images */}
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#1a2a3f] border border-[#2a3a4f]"
                >
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              
              {/* Add button */}
              {images.length < 3 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg bg-[#1a2a3f] border border-[#2a3a4f] border-dashed flex items-center justify-center text-blue-400 hover:bg-[#1f2f44] transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Submit Button - Blue gradient */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

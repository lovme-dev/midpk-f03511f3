import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import authShieldIcon from "@/assets/auth-shield-icon.png";
import authGiftIcon from "@/assets/auth-gift-icon.png";
import loginIconGoogle from "@/assets/login-icon-google.jpeg";
import loginIconLeftCustom from "@/assets/login-icon-left-custom.jpeg";

// Fingerprint Icon - Custom realistic fingerprint design
const FingerprintIcon = () => {
  return (
    <svg 
      width="65" 
      height="65" 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fingerprint-grad-modal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      <g stroke="url(#fingerprint-grad-modal)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 25 35 C 35 20, 65 20, 75 35" />
        <path d="M 20 45 C 15 60, 20 85, 30 95" />
        <path d="M 80 45 C 85 60, 80 85, 70 95" />
        <path d="M 32 40 C 40 32, 60 32, 68 40" />
        <path d="M 28 50 C 25 65, 30 80, 38 88" />
        <path d="M 72 50 C 75 65, 70 80, 62 88" />
        <path d="M 38 55 C 36 65, 40 75, 45 80" />
        <path d="M 62 55 C 64 65, 60 75, 55 80" />
        <path d="M 42 48 C 46 45, 54 45, 58 48" />
        <path d="M 50 55 V 75" />
        <path d="M 42 92 L 44 90" strokeLinecap="round" strokeWidth="6" />
        <path d="M 56 92 L 58 90" strokeLinecap="round" strokeWidth="6" />
      </g>
    </svg>
  );
};

// Mobile Pattern Lock Icon
const PatternLockIcon = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="7" fill="url(#dot-grad-1-modal)" />
      <circle cx="40" cy="20" r="7" fill="url(#dot-grad-2-modal)" />
      <circle cx="60" cy="20" r="7" fill="url(#dot-grad-1-modal)" />
      <circle cx="20" cy="40" r="7" fill="url(#dot-grad-2-modal)" />
      <circle cx="40" cy="40" r="7" fill="#00d2ff" />
      <circle cx="60" cy="40" r="7" fill="url(#dot-grad-2-modal)" />
      <circle cx="20" cy="60" r="7" fill="url(#dot-grad-1-modal)" />
      <circle cx="40" cy="60" r="7" fill="url(#dot-grad-2-modal)" />
      <circle cx="60" cy="60" r="7" fill="url(#dot-grad-1-modal)" />
      
      <path
        d="M20 20L40 20L60 40L40 60L20 40L40 40"
        stroke="url(#line-grad-modal)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      <defs>
        <linearGradient id="dot-grad-1-modal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="dot-grad-2-modal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="line-grad-modal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#00d2ff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Animated switching icon component
const AnimatedSecurityIcon = () => {
  const [showFingerprint, setShowFingerprint] = useState(true);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFingerprint((prev) => !prev);
      setRotation((prev) => prev + 360);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div className="absolute bottom-6 right-6 flex items-center justify-center z-30">
        <svg width="22" height="22" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="20" fill="#0a1730" />
          <circle cx="16" cy="15" r="4.5" stroke="#94a3b8" strokeWidth="1.8" fill="none" />
          <path
            d="M7 30C7 25 11 22 16 22C18.5 22 20.5 22.8 22 24"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="30" cy="18" r="5" stroke="#00d2ff" strokeWidth="2" fill="none" />
          <path d="M30 23V32" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 27H34" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 30H33" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div
        className="absolute w-16 h-16 rounded-full transition-all duration-700 z-10"
        style={{
          background: showFingerprint 
            ? "radial-gradient(circle, rgba(0, 210, 255, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      
      <div 
        className="relative flex items-center justify-center transition-transform duration-700 ease-in-out z-20"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className="absolute transition-all duration-500 ease-in-out"
          style={{
            opacity: showFingerprint ? 1 : 0,
            transform: showFingerprint 
              ? "scale(1) rotate(0deg)" 
              : "scale(0.6) rotate(-180deg)",
          }}
        >
          <FingerprintIcon />
        </div>
        
        <div
          className="absolute transition-all duration-500 ease-in-out"
          style={{
            opacity: showFingerprint ? 0 : 1,
            transform: showFingerprint 
              ? "scale(0.6) rotate(180deg)" 
              : "scale(1) rotate(0deg)",
          }}
        >
          <PatternLockIcon />
        </div>
      </div>
    </div>
  );
};

export function AuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal();
  const { signIn, signUp, signInWithGoogle, signInWithApple, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  
  // Track if the modal was opened when user was already logged in
  // This prevents the modal from auto-closing due to cached session
  const [userWhenOpened, setUserWhenOpened] = useState<string | null>(null);

  // Track user state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Remember user ID when modal opens (could be null or existing user)
      setUserWhenOpened(user?.id || null);
    }
  }, [isOpen]);

  // Close modal only when user ACTUALLY logs in (user changes from null to something)
  // Don't close if user was already logged in when modal opened
  useEffect(() => {
    if (user && isOpen && userWhenOpened === null && user.id !== userWhenOpened) {
      // User just logged in (was null before, now has value)
      closeAuthModal();
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      }
    }
  }, [user, isOpen, userWhenOpened, closeAuthModal, navigate]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setShowEmailForm(false);
      setIsSignUp(false);
      setShowPassword(false);
      setShowForgotPassword(false);
      setForgotEmail("");
      setUserWhenOpened(null);
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message || "Google login failed");
      }
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        toast.error(error.message || "Apple login failed");
      }
    } catch (err) {
      toast.error("Apple login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await resetPassword(forgotEmail);
      if (!error) {
        toast.success("Password reset link sent to your email!");
        setShowForgotPassword(false);
        setShowEmailForm(true);
        setIsSignUp(false);
      }
    } catch (err) {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailContinue = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setShowEmailForm(true);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message || "Sign up failed");
        } else {
          toast.success("Account created successfully!");
          closeAuthModal();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message || "Login failed");
        } else {
          toast.success("Welcome back!");
          closeAuthModal();
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="w-full h-full max-w-none max-h-none sm:w-[95vw] sm:h-auto sm:max-w-[460px] sm:max-h-[95vh] bg-[#0a1730] border-none sm:border sm:border-[#232942] text-white p-0 overflow-hidden rounded-none sm:rounded-2xl flex flex-col [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Sign In or Sign Up</DialogTitle>
        </VisuallyHidden>

        {/* Top-left corner light glow */}
        <div
          className="absolute pointer-events-none z-[1]"
          style={{
            top: "0",
            left: "0",
            width: "80%",
            height: "45%",
            background: "radial-gradient(ellipse at 0% 0%, rgba(70, 140, 255, 0.5) 0%, rgba(50, 120, 230, 0.3) 25%, rgba(35, 100, 200, 0.15) 45%, transparent 70%)",
          }}
        />

        {/* Header - only logo, sticky */}
        <div className="px-4 py-1 flex justify-between items-center sticky top-0 z-40 bg-transparent">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/b032faed-8af8-43c2-90b8-b20597ef2781.png"
              alt="Midasbuy Logo"
              className="h-4"
            />
          </div>
          <button
            onClick={closeAuthModal}
            className="text-gray-400 hover:text-white transition-colors w-7 h-7 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="px-5 pb-6 space-y-3 relative z-10 overflow-y-auto flex-1">
          {/* Title - now scrollable with content */}
          <h1 className="text-white text-lg font-bold uppercase tracking-wide pt-0 pb-1">SIGN IN OR SIGN UP</h1>
          {!showEmailForm ? (
            <>
              {/* Passkey Card - compact */}
              <div
                className="rounded-xl p-2.5 flex flex-col items-center gap-0 relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(18, 30, 55, 0.95) 0%, rgba(14, 25, 50, 0.98) 100%)",
                  border: "1px solid rgba(80, 140, 220, 0.35)",
                  boxShadow: "0 0 20px rgba(50, 120, 200, 0.1)",
                }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: "0",
                    left: "0",
                    width: "50%",
                    height: "40%",
                    background: "radial-gradient(ellipse at 0% 0%, rgba(70, 140, 255, 0.25) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: "0",
                    left: "0",
                    width: "45%",
                    height: "35%",
                    background: "radial-gradient(ellipse at 0% 100%, rgba(60, 130, 240, 0.3) 0%, transparent 65%)",
                  }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: "0",
                    right: "0",
                    width: "45%",
                    height: "35%",
                    background: "radial-gradient(ellipse at 100% 100%, rgba(30, 60, 120, 0.2) 0%, transparent 65%)",
                  }}
                />
                
                <AnimatedSecurityIcon />

                <div className="w-full space-y-1.5 relative z-10">
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setShowEmailForm(true);
                    }}
                    className="w-full py-3 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] tracking-wide transition-all active:scale-[0.97]"
                    style={{
                      background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
                      boxShadow: "0 4px 12px rgba(0, 114, 255, 0.3)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                    Sign Up with Passkey
                  </button>

                  <div className="text-[12px] text-center text-gray-400 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>Make sure you already have a Passkey</span>
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        setShowEmailForm(true);
                      }}
                      className="text-[#3b82f6] font-medium flex items-center gap-1 hover:brightness-110"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <rect x="14" y="11" width="8" height="6" rx="1" ry="1"></rect>
                      </svg>
                      Sign In
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Authentication (match reference) */}
              <div className="flex justify-center items-center gap-4 pt-1">
                {/* Left custom icon (image) */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => toast.info("Coming soon")}
                  className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-transparent hover:scale-105 transition-transform disabled:opacity-50"
                  aria-label="Continue with Desktop"
                >
                  <img
                    src={loginIconLeftCustom}
                    className="w-full h-full object-cover"
                    alt="Desktop"
                    loading="lazy"
                  />
                </button>

                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-white hover:scale-105 transition-transform disabled:opacity-50"
                  aria-label="Continue with Google"
                >
                  <img
                    src={loginIconGoogle}
                    className="w-9 h-9 object-contain"
                    alt="Google"
                    loading="lazy"
                  />
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => toast.info("Facebook login coming soon")}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-[#1877F2] hover:scale-105 transition-transform disabled:opacity-50"
                  aria-label="Continue with Facebook"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>

                {/* Discord (right) */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => toast.info("Discord login coming soon")}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-[#5865F2] hover:scale-105 transition-transform disabled:opacity-50"
                  aria-label="Continue with Discord"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </button>

                {/* Apple */}
                <button
                  onClick={handleAppleLogin}
                  disabled={isLoading}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-black hover:scale-105 transition-transform disabled:opacity-50 border border-gray-700"
                  aria-label="Continue with Apple"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[0.5px] bg-gray-700/50"></div>
                <span className="text-gray-500 text-[11px]">or</span>
                <div className="flex-1 h-[0.5px] bg-gray-700/50"></div>
              </div>

              {/* Email Entry - compact */}
              <div className="space-y-2.5">
                <div className="space-y-1.5">
                  <label className="text-gray-400 text-[13px] font-medium block">Email</label>
                  <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-3 text-white outline-none bg-transparent transition-all duration-200 text-[14px]"
                    style={{ border: "1px solid rgba(59, 130, 246, 0.4)" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(59, 130, 246, 0.4)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  onClick={handleEmailContinue}
                  disabled={isLoading}
                  className="w-full py-3 text-white rounded-lg font-bold text-[15px] tracking-wide transition-all active:scale-[0.97] disabled:opacity-50"
                  style={{
                    background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
                    boxShadow: "0 4px 12px rgba(0, 114, 255, 0.3)",
                  }}
                >
                  Continue
                </button>
              </div>

              {/* Why Purchase Section - compact */}
              <div className="pt-3 space-y-3">
                <h3 className="text-white text-[14px] font-bold">Why Purchase on Midasbuy?</h3>

                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                      <img src={authShieldIcon} alt="Official" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="space-y-0">
                      <h4 className="text-[13px] font-bold text-white">Official Recharge Store by Tencent</h4>
                      <p className="text-[11px] text-gray-400">
                        We provide safer, faster, and more enjoyable payment services.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                      <img src={authGiftIcon} alt="Benefits" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="space-y-0">
                      <h4 className="text-[13px] font-bold text-white">Benefits</h4>
                      <p className="text-[11px] text-gray-400">More Promotions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Official recharge store */}
              <div className="pt-4 pb-2 flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" stroke="#6b7280" strokeWidth="2" />
                </svg>
                <span className="text-gray-500 text-[13px]">Official recharge store by Tencent</span>
              </div>
            </>
          ) : showForgotPassword ? (
            /* Forgot Password Form */
            <div className="space-y-6 mt-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">Forgot Password</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-[14px] font-medium block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full rounded-lg px-4 py-3.5 text-white outline-none bg-transparent transition-all duration-200"
                  style={{ border: "1px solid rgba(59, 130, 246, 0.4)" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(59, 130, 246, 0.4)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="w-full py-4 text-white rounded-lg font-bold text-[16px] tracking-wide transition-all active:scale-[0.97] disabled:opacity-50"
                style={{
                  background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
                  boxShadow: "0 4px 15px rgba(0, 114, 255, 0.3)",
                }}
              >
                {isLoading ? "Please wait..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setShowEmailForm(true); }}
                  className="text-[#3b82f6] text-sm hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Email/Password Form */
            <form onSubmit={handleAuth} className="space-y-6 mt-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isSignUp ? "Fill in your details to get started" : "Sign in to your account"}
                </p>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-gray-400 text-[14px] font-medium block">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="w-full rounded-lg px-4 py-3.5 text-white outline-none bg-transparent transition-all duration-200"
                    style={{ border: "1px solid rgba(59, 130, 246, 0.4)" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(59, 130, 246, 0.4)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-gray-400 text-[14px] font-medium block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg px-4 py-3.5 text-white outline-none bg-transparent transition-all duration-200"
                  style={{ border: "1px solid rgba(59, 130, 246, 0.4)" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(59, 130, 246, 0.4)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-[14px] font-medium block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg pl-4 pr-12 py-3.5 text-white outline-none bg-transparent transition-all duration-200"
                    style={{ border: "1px solid rgba(59, 130, 246, 0.4)" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(59, 130, 246, 0.4)";
                      e.target.style.boxShadow = "none";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setShowEmailForm(false); setShowForgotPassword(true); setForgotEmail(email); }}
                      className="text-[#3b82f6] text-[13px] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-white rounded-lg font-bold text-[16px] tracking-wide transition-all active:scale-[0.97] disabled:opacity-50"
                style={{
                  background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
                  boxShadow: "0 4px 15px rgba(0, 114, 255, 0.3)",
                }}
              >
                {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-[#3b82f6] text-sm hover:underline"
                >
                  ← Back to options
                </button>
              </div>

              <div className="text-[13px] text-center text-gray-400">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-[#3b82f6] font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-[#3b82f6] font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ttqCompleteRegistration, ttqIdentify } from '@/utils/tiktokTracking';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithFacebook: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithPhoneOtp: (phone: string) => Promise<{ error: any }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: any }>;
  checkRateLimit: (email: string) => Promise<boolean>;
  incrementAuthAttempts: (email: string) => Promise<void>;
  resetAuthAttempts: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Try to get cached session from localStorage immediately for faster initial render
  const getCachedSession = (): { user: User | null; session: Session | null } => {
    try {
      const stored = localStorage.getItem('sb-vecburzoqlivoctpkdhk-auth-token');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user && parsed?.access_token) {
          // Check if token is not expired (with 60 second buffer)
          const expiresAt = parsed.expires_at;
          if (expiresAt && expiresAt * 1000 > Date.now() + 60000) {
            return { 
              user: parsed.user as User, 
              session: parsed as Session 
            };
          }
        }
      }
    } catch (e) {
      console.warn('[Auth] Failed to read cached session:', e);
    }
    return { user: null, session: null };
  };

  const cached = getCachedSession();
  const [user, setUser] = useState<User | null>(cached.user);
  const [session, setSession] = useState<Session | null>(cached.session);
  const [loading, setLoading] = useState(!cached.user); // Not loading if we have cached user
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Synchronous updates only - no async operations in callback
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Reset auth attempts on successful login - deferred
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            resetAuthAttempts(currentSession.user.id);
          }, 0);
        }
      }
    );

    // Then verify session from server (this will update if cached was stale)
    supabase.auth.getSession().then(({ data: { session: serverSession } }) => {
      setSession(serverSession);
      setUser(serverSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkRateLimit = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_auth_rate_limit', {
        p_email: email
      });
      
      if (error) {
        console.error('Rate limit check error:', error);
        return true; // Allow attempt if function fails
      }
      
      // data = false means "no rate limit reached" = can attempt
      // data = true means "rate limit reached" = cannot attempt
      // Return true if can attempt (no rate limit), false if blocked
      return !data;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow attempt on error
    }
  };

  const incrementAuthAttempts = async (email: string): Promise<void> => {
    try {
      await supabase.rpc('increment_auth_attempts', {
        p_email: email
      });
    } catch (error) {
      console.error('Failed to increment auth attempts:', error);
    }
  };

  const resetAuthAttempts = async (userId: string): Promise<void> => {
    try {
      await supabase.rpc('reset_auth_attempts', {
        p_user_id: userId
      });
    } catch (error) {
      console.error('Failed to reset auth attempts:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Check rate limit before attempting
    const canAttempt = await checkRateLimit(email);
    if (!canAttempt) {
      const error = { message: 'Too many attempts. Account temporarily locked.' };
      toast({
        variant: "destructive",
        title: "Account Locked",
        description: error.message,
      });
      return { error };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });

    if (error) {
      await incrementAuthAttempts(email);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Check your email",
        description: "We sent you a confirmation link to complete your signup.",
      });
      
      // TikTok: Track CompleteRegistration event
      ttqCompleteRegistration();
      ttqIdentify({ email });
      
      // Send welcome email via edge function
      try {
        await fetch('https://wzomzlnrlpshjcidwoda.supabase.co/functions/v1/send-auth-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b216bG5ybHBzaGpjaWR3b2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODg4MjQsImV4cCI6MjA3MDA2NDgyNH0.pnpuIIRINOIRfgnK1p6-kW1SS-IVVoDj19QXny7nEVo`
          },
          body: JSON.stringify({
            to: email,
            type: 'welcome',
            data: { name: fullName }
          })
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Check rate limit before attempting
    const canAttempt = await checkRateLimit(email);
    if (!canAttempt) {
      const error = { message: 'Too many attempts. Account temporarily locked.' };
      toast({
        variant: "destructive",
        title: "Account Locked",
        description: error.message,
      });
      return { error };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await incrementAuthAttempts(email);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }

    return { error };
  };

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Facebook Login Failed",
        description: error.message,
      });
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    const { lovable } = await import("@/integrations/lovable/index");
    
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: {
        prompt: 'select_account',
      },
    });

    const error = result?.error || null;

    if (error) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message || "Google login failed",
      });
    }

    return { error };
  };

  const signInWithApple = async () => {
    const { lovable } = await import("@/integrations/lovable/index");
    
    const result = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });

    const error = result?.error || null;

    if (error) {
      toast({
        variant: "destructive",
        title: "Apple Login Failed",
        description: error.message || "Apple login failed",
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Check your email",
        description: "We sent you a password reset link.",
      });
    }

    return { error };
  };

  const signInWithPhoneOtp = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "SMS Login Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "OTP sent",
        description: "We sent a verification code via SMS.",
      });
    }

    return { error };
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Verified",
        description: "Phone number verified successfully.",
      });
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithFacebook,
      signInWithGoogle,
      signInWithApple,
      signOut,
      resetPassword,
      signInWithPhoneOtp,
      verifyPhoneOtp,
      checkRateLimit,
      incrementAuthAttempts,
      resetAuthAttempts,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
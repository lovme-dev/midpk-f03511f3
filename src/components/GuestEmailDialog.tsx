import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface GuestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailConfirmed: (userId: string, email: string) => void;
}

export function GuestEmailDialog({ open, onOpenChange, onEmailConfirmed }: GuestEmailDialogProps) {
  const { openAuthModal } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) => {
    const trimmed = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed);
  };

  const isValidPassword = (value: string) => {
    return value.length >= 6;
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    setError(null);

    // Validate email
    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (trimmedEmail.length > 255) {
      setError("Email address is too long");
      return;
    }

    // Validate password
    if (!trimmedPassword) {
      setError("Please enter a password");
      return;
    }

    if (!isValidPassword(trimmedPassword)) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('create-or-get-guest-profile', {
        body: { email: trimmedEmail, password: trimmedPassword }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create account');
      }

      const { success, user_id, email: confirmedEmail, error: responseError, is_existing } = response.data;

      if (!success || !user_id) {
        throw new Error(responseError || 'Failed to create account');
      }

      // Now sign in the user with Supabase auth so the session is established
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        console.error('Sign in error after account creation:', signInError);
        // Account was created but sign in failed - still proceed with guest flow
        localStorage.setItem('guest_user_id', user_id);
        localStorage.setItem('guest_email', confirmedEmail);
      } else {
        // Clear guest storage since user is now properly signed in
        localStorage.removeItem('guest_user_id');
        localStorage.removeItem('guest_email');
      }

      // Close dialog and proceed
      onOpenChange(false);
      onEmailConfirmed(user_id, confirmedEmail);

    } catch (err: any) {
      console.error('Account creation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      toast({
        title: "Error",
        description: err.message || 'Failed to create account',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-midasbuy-blue" />
            Create Account
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your details to continue with payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="guest-email" className="text-white">Email Address</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-midasbuy-blue"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="guest-password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="guest-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-midasbuy-blue pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-600">
            <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">
              Your information is safe with us. We only use it to send order confirmations and updates.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-midasbuy-blue to-blue-600 hover:from-midasbuy-blue/90 hover:to-blue-600/90 text-white font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Continue to Payment'
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={() => {
                onOpenChange(false);
                openAuthModal();
              }}
              className="text-midasbuy-blue hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
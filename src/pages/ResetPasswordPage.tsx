import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let recovered = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[ResetPassword] Auth event:', event);
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        recovered = true;
        setSessionReady(true);
      }
    });

    // Also check if already in recovery session (hash fragment already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !recovered) {
        setSessionReady(true);
      }
    });

    // If hash contains access_token, give Supabase time to process it
    if (window.location.hash.includes('access_token')) {
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) setSessionReady(true);
        });
      }, 2000);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error('[ResetPassword] Update error:', error);
        toast({ variant: 'destructive', title: 'Failed', description: error.message });
      } else {
        setSuccess(true);
        toast({ title: 'Success', description: 'Your password has been updated!' });
        // Sign out and redirect to login
        await supabase.auth.signOut();
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err: any) {
      console.error('[ResetPassword] Unexpected error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#13182B' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-brand-from to-brand-to flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Updated!</h1>
          <p className="text-gray-400">Redirecting you to login page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#13182B' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-brand-from to-brand-to flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your new password below to reset your account</p>
        </div>

        {/* Form Card */}
        <div className="border border-gray-700 rounded-2xl p-6 shadow-xl" style={{ backgroundColor: '#1a2038' }}>
          {!sessionReady ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-brand-from border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Verifying your reset link...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1.5 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-gray-600 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-from/50 focus:border-brand-from transition-all" style={{ backgroundColor: '#13182B' }}
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full border border-gray-600 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-from/50 focus:border-brand-from transition-all" style={{ backgroundColor: '#13182B' }}
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-from to-brand-to hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Midasbuy. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;

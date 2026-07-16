import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

export const useAuthNotifications = () => {
  const { user, session } = useAuth();
  const { addNotification } = useNotifications();
  const hasNotifiedRef = useRef<string | null>(null);

  useEffect(() => {
    // Track authentication events - only notify once per session
    if (user && session) {
      const sessionId = session.access_token?.slice(-10) || '';
      
      // Prevent duplicate notifications for same session
      if (hasNotifiedRef.current === sessionId) {
        return;
      }

      // Check if this is a recent login (session created within last 30 seconds)
      const sessionCreatedAt = new Date(session.access_token ? session.expires_at! * 1000 - session.expires_in! * 1000 : Date.now());
      const timeDiff = Date.now() - sessionCreatedAt.getTime();
      
      if (timeDiff < 30000) { // 30 seconds
        hasNotifiedRef.current = sessionId;
        
        // Check localStorage to see if this is truly a new signup
        const lastLoginKey = `last_login_${user.id}`;
        const lastLogin = localStorage.getItem(lastLoginKey);
        const isFirstLogin = !lastLogin;
        
        if (isFirstLogin) {
          addNotification({
            title: 'Welcome to Midasbuy!',
            message: `Account created successfully! Welcome ${user.email?.split('@')[0] || 'Player'}, you're now ready to purchase UC and gaming items.`,
            type: 'success'
          });
        } else {
          addNotification({
            title: 'Welcome back!',
            message: `Successfully logged in as ${user.email?.split('@')[0] || 'Player'}.`,
            type: 'info'
          });
        }
        
        // Store login timestamp
        localStorage.setItem(lastLoginKey, Date.now().toString());
      }
    }
  }, [user, session, addNotification]);
};

// Hook to manually add purchase notifications
export const usePurchaseNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyPurchaseSuccess = (packageName: string, playerId: string) => {
    addNotification({
      title: 'Purchase Successful!',
      message: `${packageName} has been added to account ${playerId}. Enjoy your gaming!`,
      type: 'success'
    });
  };

  const notifyPurchaseError = (error: string) => {
    addNotification({
      title: 'Purchase Failed',
      message: `${error}. Please try again or contact support.`,
      type: 'error'
    });
  };

  const notifyPaymentCanceled = () => {
    addNotification({
      title: 'Payment Canceled',
      message: 'Your payment was canceled. No charges were made. You can try again anytime.',
      type: 'warning'
    });
  };

  const notifyPaymentPending = () => {
    addNotification({
      title: 'Payment Processing',
      message: 'Your payment is being processed. You will be notified once complete.',
      type: 'info'
    });
  };

  return {
    notifyPurchaseSuccess,
    notifyPurchaseError,
    notifyPaymentCanceled,
    notifyPaymentPending
  };
};
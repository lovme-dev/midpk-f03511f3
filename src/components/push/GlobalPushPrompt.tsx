import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { PushAutoPromptDialog } from './PushAutoPromptDialog';
import { useToast } from '@/hooks/use-toast';

/**
 * Global component that prompts iOS PWA users to enable push notifications after login.
 * Shows a one-time prompt per session when user is logged in and hasn't enabled notifications.
 */
export function GlobalPushPrompt() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isSupported,
    isSubscribed,
    permission,
    isiOS,
    isPWA,
    subscribe,
  } = usePushNotifications();
  
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show prompt if:
    // 1. User is logged in
    // 2. Push is supported (iOS PWA or desktop browser)
    // 3. User hasn't already subscribed
    // 4. Permission is still 'default' (not denied or granted)
    // 5. Haven't shown prompt this session
    if (!user) return;
    if (!isSupported) return;
    if (isSubscribed) return;
    if (permission !== 'default') return;
    
    const promptKey = `push_prompt_shown_${user.id}`;
    if (sessionStorage.getItem(promptKey) === '1') return;
    
    // Mark as shown for this session
    sessionStorage.setItem(promptKey, '1');
    
    // Show prompt after a short delay (let the page load first)
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [user, isSupported, isSubscribed, permission]);

  const handleEnable = async () => {
    try {
      await subscribe();
      toast({
        title: 'Notifications enabled!',
        description: 'You will now receive important updates.',
      });
    } catch (error: any) {
      console.error('[GlobalPushPrompt] Error:', error);
      toast({
        title: 'Could not enable notifications',
        description: error.message || 'Please try again from Settings',
        variant: 'destructive',
      });
    } finally {
      setShowPrompt(false);
    }
  };

  // Don't render anything if conditions not met
  if (!user || !isSupported) return null;

  return (
    <PushAutoPromptDialog
      open={showPrompt}
      onOpenChange={setShowPrompt}
      onEnable={handleEnable}
    />
  );
}

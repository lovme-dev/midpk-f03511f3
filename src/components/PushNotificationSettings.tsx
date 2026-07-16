import { useEffect, useState } from "react";
import { Bell, BellOff, Smartphone, AlertCircle, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";
import { PushAutoPromptDialog } from "@/components/push/PushAutoPromptDialog";

export function PushNotificationSettings() {
  const { toast } = useToast();
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    isiOS,
    isPWA,
    debugInfo,
    subscribe,
    unsubscribe
  } = usePushNotifications();
  const [showAutoPrompt, setShowAutoPrompt] = useState(false);

  useEffect(() => {
    // iOS won't allow showing the system permission popup automatically without a user action.
    // We auto-show a small dialog, and the user taps "Continue" to trigger the system prompt.
    if (!isiOS || !isPWA) return;
    if (!isSupported) return;
    if (permission !== 'default') return;
    if (isSubscribed) return;

    if (sessionStorage.getItem('push_auto_prompt_shown') === '1') return;
    sessionStorage.setItem('push_auto_prompt_shown', '1');

    const t = window.setTimeout(() => setShowAutoPrompt(true), 600);
    return () => window.clearTimeout(t);
  }, [isiOS, isPWA, isSupported, permission, isSubscribed]);

  const handleToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
        toast({ title: "Notifications disabled" });
      } else {
        await subscribe();
        toast({ 
          title: "Notifications enabled!",
          description: "You will now receive push notifications."
        });
      }
    } catch (error: any) {
      console.error('[Push Settings] Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  // iOS not in PWA mode - show installation instructions
  if (isiOS && !isPWA) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Push Notifications</h3>
        </div>
        <p className="text-sm text-slate-400">Install the app to enable notifications</p>
        <div className="text-xs text-slate-500 space-y-1 bg-slate-900/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-medium mb-2">📱 How to install:</p>
          <p>1. Tap the <strong>Share</strong> button (⎋) in Safari</p>
          <p>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
          <p>3. Open the app from your home screen</p>
          <p>4. Come back here to enable notifications</p>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          iOS requires apps to be installed for push notifications.
        </p>
      </div>
    );
  }

  // Not supported (other reasons)
  if (!isSupported) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <h3 className="font-semibold text-white">Push Notifications</h3>
            <p className="text-sm text-slate-400">Not supported in this browser</p>
          </div>
        </div>
        {debugInfo && (
          <p className="text-xs text-slate-600 mt-2 font-mono">{debugInfo}</p>
        )}
      </div>
    );
  }

  // Permission denied - need to update browser/device settings
  if (permission === 'denied') {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <BellOff className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="font-semibold text-white">Push Notifications</h3>
            <p className="text-sm text-slate-400">Permission blocked</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">
          <p className="text-yellow-400 font-medium mb-2">⚠️ To enable notifications:</p>
          {isiOS ? (
            <>
              <p>1. Open <strong>Settings</strong> on your device</p>
              <p>2. Find this app in your apps list</p>
              <p>3. Tap <strong>Notifications</strong></p>
              <p>4. Enable <strong>Allow Notifications</strong></p>
            </>
          ) : (
            <>
              <p>1. Click the lock icon (🔒) in your browser's address bar</p>
              <p>2. Find <strong>Notifications</strong> setting</p>
              <p>3. Change from "Block" to "Allow"</p>
              <p>4. Refresh this page</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <PushAutoPromptDialog
        open={showAutoPrompt}
        onOpenChange={setShowAutoPrompt}
        onEnable={async () => {
          await handleToggle();
          setShowAutoPrompt(false);
        }}
      />

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Bell className="w-5 h-5 text-cyan-400" />
            ) : (
              <BellOff className="w-5 h-5 text-slate-500" />
            )}
            <div>
              <h3 className="font-semibold text-white">Push Notifications</h3>
              <p className="text-sm text-slate-400">
                {isSubscribed ? "Enabled - You'll receive order updates" : "Disabled"}
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

        {/* Debug info for troubleshooting */}
        {debugInfo && import.meta.env.DEV && (
          <div className="flex items-start gap-2 text-xs text-slate-600 mt-2">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="font-mono break-all">{debugInfo}</span>
          </div>
        )}
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Monitor, RefreshCw, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PushSubscription {
  id: string;
  endpoint: string;
  created_at: string;
  user_id: string;
}

export function NotificationSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    isSupported, 
    isSubscribed, 
    permission, 
    isLoading, 
    subscribe, 
    unsubscribe, 
    checkSubscription,
    isiOS,
    isPWA
  } = usePushNotifications();
  
  const [subscriptions, setSubscriptions] = useState<PushSubscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [testingNotification, setTestingNotification] = useState(false);

  const fetchSubscriptions = async () => {
    if (!user) return;
    
    setLoadingSubscriptions(true);
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
    } else {
      setSubscriptions(data || []);
    }
    setLoadingSubscriptions(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const handleEnableNotifications = async () => {
    try {
      await subscribe();
      toast({
        title: "Notifications Enabled",
        description: "You will now receive push notifications on this device.",
      });
      await fetchSubscriptions();
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      await unsubscribe();
      toast({
        title: "Notifications Disabled",
        description: "Push notifications have been disabled for this device.",
      });
      await fetchSubscriptions();
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Subscription deleted',
        description: 'Device has been removed from notifications.',
      });
      await fetchSubscriptions();
      await checkSubscription();
    }
  };

  const handleTestNotification = async () => {
    if (!user) return;
    
    setTestingNotification(true);
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          user_id: user.id,
          payload: {
            title: '🔔 Test Notification',
            body: 'Push notifications are working correctly!',
            icon: '/icon-192.png',
            url: '/admin',
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Test notification sent',
        description: 'Check your device for the notification.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Test failed',
        description: error.message || 'Failed to send test notification',
      });
    } finally {
      setTestingNotification(false);
    }
  };

  const getDeviceIcon = (endpoint: string) => {
    if (endpoint.includes('apple') || endpoint.includes('webkit')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (endpoint.includes('fcm') || endpoint.includes('android')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceType = (endpoint: string) => {
    if (endpoint.includes('apple') || endpoint.includes('webkit')) {
      return 'iOS/Safari';
    }
    if (endpoint.includes('fcm')) {
      return 'Android/Chrome';
    }
    return 'Browser';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Notification Settings</h1>
        <p className="text-muted-foreground">Manage push notifications for your admin devices</p>
      </div>

      {/* Current Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            This Device
          </CardTitle>
          <CardDescription>
            Enable push notifications to receive alerts when new orders come in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Support:</span>
              {isSupported ? (
                <Badge variant="default" className="bg-green-600">Supported</Badge>
              ) : (
                <Badge variant="destructive">Not Supported</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Permission:</span>
              <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
                {permission}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {isSubscribed ? (
                <Badge variant="default" className="bg-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <X className="h-3 w-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>
          </div>

          {isiOS && !isPWA && (
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 text-sm text-yellow-200">
              <strong>iOS Users:</strong> To receive push notifications, please add this app to your Home Screen first (tap Share → Add to Home Screen).
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!isSubscribed ? (
              <Button 
                onClick={handleEnableNotifications} 
                disabled={!isSupported || isLoading}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                {isLoading ? 'Enabling...' : 'Enable Notifications'}
              </Button>
            ) : (
              <>
                <Button 
                  variant="destructive"
                  onClick={handleDisableNotifications} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  <BellOff className="h-4 w-4" />
                  {isLoading ? 'Disabling...' : 'Disable Notifications'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleTestNotification}
                  disabled={testingNotification}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  {testingNotification ? 'Sending...' : 'Send Test Notification'}
                </Button>
              </>
            )}
            <Button 
              variant="ghost"
              onClick={() => {
                checkSubscription();
                fetchSubscriptions();
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Subscribed Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Your Subscribed Devices
          </CardTitle>
          <CardDescription>
            All devices where you have enabled push notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSubscriptions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No devices subscribed to notifications</p>
              <p className="text-sm">Enable notifications on this device to start receiving alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div 
                  key={sub.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getDeviceIcon(sub.endpoint)}
                    </div>
                    <div>
                      <div className="font-medium">{getDeviceType(sub.endpoint)}</div>
                      <div className="text-sm text-muted-foreground">
                        Added: {formatDate(sub.created_at)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSubscription(sub.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Enable on Multiple Devices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
            <p>Login as admin on any device (Android phone, iPhone, Desktop browser)</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</div>
            <p>Go to Admin Panel → Notification Settings</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</div>
            <p>Click "Enable Notifications" and allow when prompted</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">4</div>
            <p>Repeat on each device where you want to receive notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
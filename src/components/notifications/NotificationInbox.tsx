import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, CheckCheck, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserNotification {
  id: string;
  notification_id: string;
  read: boolean;
  read_at: string | null;
  delivered: boolean;
  created_at: string;
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    icon_url: string | null;
    action_url: string | null;
    sent_at: string;
  };
}

export function NotificationInbox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('user_notifications')
      .select(`
        id,
        notification_id,
        read,
        read_at,
        delivered,
        created_at,
        notification:notifications (
          id,
          title,
          message,
          type,
          icon_url,
          action_url,
          sent_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load notifications',
      });
    } else {
      // Filter out any null notifications (in case of orphaned records)
      const validNotifications = (data || []).filter(n => n.notification !== null) as UserNotification[];
      setNotifications(validNotifications);
    }
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    setMarkingRead(notificationId);
    const { error } = await supabase
      .from('user_notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark as read',
      });
    } else {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
      ));
    }
    setMarkingRead(null);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('user_notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .in('id', unreadIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark all as read',
      });
    } else {
      setNotifications(notifications.map(n => ({
        ...n,
        read: true,
        read_at: n.read_at || new Date().toISOString()
      })));
      toast({
        title: 'Done',
        description: 'All notifications marked as read',
      });
    }
  };

  const handleNotificationClick = (notification: UserNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.notification.action_url) {
      const url = notification.notification.action_url;
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'promo': return 'default';
      case 'system': return 'destructive';
      case 'announcement': return 'secondary';
      case 'order': return 'outline';
      default: return 'outline';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <Card className="bg-card">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Please log in to view notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>
          Stay updated with announcements and offers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    notif.read
                      ? "border-border/50 bg-background/30 hover:bg-background/50"
                      : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      notif.read ? "bg-muted" : "bg-primary animate-pulse"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "font-medium",
                          !notif.read && "text-foreground"
                        )}>
                          {notif.notification.title}
                        </span>
                        <Badge variant={getTypeBadgeVariant(notif.notification.type)} className="text-xs">
                          {notif.notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notif.notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(notif.notification.sent_at).toLocaleString()}</span>
                        {notif.notification.action_url && (
                          <ExternalLink className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                    {markingRead === notif.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : !notif.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

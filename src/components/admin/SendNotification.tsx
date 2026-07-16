import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Loader2, Users, CheckCircle, Clock, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  sent_at: string;
  icon_url: string | null;
  action_url: string | null;
}

const notificationTemplates = [
  {
    id: 'new-offer',
    title: '🎮 Special Offer!',
    message: 'Get 20% OFF on all UC packages! Limited time offer.',
    type: 'promo',
  },
  {
    id: 'maintenance',
    title: '⚙️ Scheduled Maintenance',
    message: 'Our servers will be under maintenance from 2:00 AM to 4:00 AM UTC.',
    type: 'system',
  },
  {
    id: 'new-feature',
    title: '🚀 New Feature!',
    message: 'Check out our new faster checkout experience!',
    type: 'announcement',
  },
  {
    id: 'order-reminder',
    title: '📦 Complete Your Order',
    message: 'Your cart is waiting! Complete your purchase now.',
    type: 'reminder',
  },
];

export function SendNotification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'announcement',
    icon_url: '',
    action_url: '',
  });

  useEffect(() => {
    fetchSentNotifications();
    fetchSubscriberCount();
    fetchTotalUsersCount();
  }, []);

  const fetchSentNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setSentNotifications(data || []);
    }
    setLoading(false);
  };

  const fetchSubscriberCount = async () => {
    const { count, error } = await supabase
      .from('push_subscriptions')
      .select('user_id', { count: 'exact', head: true });

    if (!error && count !== null) {
      // Get unique user count
      const { data } = await supabase
        .from('push_subscriptions')
        .select('user_id');
      
      if (data) {
        const uniqueUsers = new Set(data.map(d => d.user_id));
        setSubscriberCount(uniqueUsers.size);
      }
    }
  };

  const fetchTotalUsersCount = async () => {
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    if (!error && count !== null) {
      setTotalUsersCount(count);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = notificationTemplates.find(t => t.id === templateId);
    if (template) {
      setForm({
        ...form,
        title: template.title,
        message: template.message,
        type: template.type,
      });
    }
  };

  const sendNotification = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Title and message are required',
      });
      return;
    }

    setSending(true);
    try {
      const response = await supabase.functions.invoke('broadcast-notification', {
        body: {
          title: form.title,
          message: form.message,
          type: form.type,
          icon_url: form.icon_url || null,
          action_url: form.action_url || null,
          admin_id: user?.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      toast({
        title: 'Notification Sent!',
        description: `Sent to ${result.sent}/${result.total} devices (${result.users_notified} users)`,
      });

      // Reset form
      setForm({
        title: '',
        message: '',
        type: 'announcement',
        icon_url: '',
        action_url: '',
      });

      // Refresh list
      fetchSentNotifications();
      fetchSubscriberCount();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: error instanceof Error ? error.message : 'Failed to send notification',
      });
    } finally {
      setSending(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    setDeleting(notificationId);
    try {
      // First delete all user_notifications for this notification
      const { error: userNotifError } = await supabase
        .from('user_notifications')
        .delete()
        .eq('notification_id', notificationId);

      if (userNotifError) {
        console.error('Error deleting user_notifications:', userNotifError);
      }

      // Then delete the notification itself
      const { error: notifError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (notifError) {
        throw notifError;
      }

      toast({
        title: 'Notification Deleted',
        description: 'Notification removed from all users',
      });

      // Refresh list
      fetchSentNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete notification',
      });
    } finally {
      setDeleting(null);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'promo': return 'default';
      case 'system': return 'destructive';
      case 'announcement': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Send Notifications
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Broadcast push notifications to all subscribed users
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{subscriberCount} subscribed / {totalUsersCount} total users</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Send Form */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Compose Notification
            </CardTitle>
            <CardDescription>
              Create and send a push notification to all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Templates */}
            <div>
              <Label>Quick Templates</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {notificationTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template.id)}
                  >
                    {template.title.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Notification title"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Notification message"
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="promo">Promotion</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="order">Order Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action_url">Action URL (optional)</Label>
              <Input
                id="action_url"
                value={form.action_url}
                onChange={(e) => setForm({ ...form, action_url: e.target.value })}
                placeholder="/pubg-uc or https://..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Where to navigate when user clicks the notification
              </p>
            </div>

            <div>
              <Label htmlFor="icon_url">Icon URL (optional)</Label>
              <Input
                id="icon_url"
                value={form.icon_url}
                onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <Button
              className="w-full"
              onClick={sendNotification}
              disabled={sending || !form.title || !form.message}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to All Users
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sent History */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recently Sent
            </CardTitle>
            <CardDescription>
              History of sent notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : sentNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications sent yet
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="font-medium truncate">{notif.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={getTypeBadgeVariant(notif.type)}>
                          {notif.type}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={deleting === notif.id}
                            >
                              {deleting === notif.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Notification?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this notification and remove it from all users' inboxes. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteNotification(notif.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(notif.sent_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

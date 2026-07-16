import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Bell, ShoppingCart, XCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { formatOrderPrice } from '@/utils/formatOrderPrice';

interface NotificationHistoryItem {
  id: string;
  event_type: string;
  title: string;
  body: string;
  order_id: string | null;
  package_name: string | null;
  price: number | null;
  player_id: string | null;
  sent_to_count: number;
  total_admins: number;
  created_at: string;
  currency_code: string | null;
}

export function AdminNotificationHistory() {
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_notification_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setNotifications((data as NotificationHistoryItem[]) || []);
    } catch (error) {
      console.error('Failed to fetch notification history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'new_order':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'order_cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'new_order':
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">New Order</Badge>;
      case 'order_cancelled':
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{eventType}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Admin Notification History
          </CardTitle>
          <CardDescription>
            Log of all push notifications sent to admin devices
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchNotifications} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications sent yet</p>
            <p className="text-sm">Admin notifications will appear here when orders are placed or cancelled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEventIcon(notification.event_type)}
                        {getEventBadge(notification.event_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{notification.body}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{notification.package_name || '-'}</span>
                    </TableCell>
                    <TableCell>
                      {notification.price ? (
                        <span className="text-sm font-medium">{formatOrderPrice(notification.price, notification.currency_code)}</span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {notification.sent_to_count > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm">
                          {notification.sent_to_count}/{notification.total_admins}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BackendNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  action_url: string | null;
  icon_url: string | null;
  read: boolean;
  delivered: boolean;
  created_at: string;
  user_notification_id: string;
}

export function useBackendNotifications() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_notifications')
        .select(`
          id,
          read,
          delivered,
          created_at,
          notification:notifications (
            id,
            title,
            message,
            type,
            action_url,
            icon_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[BackendNotifications] Error fetching:', error);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const formatted: BackendNotification[] = (data || [])
        .filter(item => item.notification)
        .map(item => ({
          id: (item.notification as any).id,
          title: (item.notification as any).title,
          message: (item.notification as any).message,
          type: (item.notification as any).type,
          action_url: (item.notification as any).action_url,
          icon_url: (item.notification as any).icon_url,
          read: item.read,
          delivered: item.delivered,
          created_at: item.created_at,
          user_notification_id: item.id,
        }));

      setNotifications(formatted);
      setUnreadCount(formatted.filter(n => !n.read).length);
    } catch (error) {
      console.error('[BackendNotifications] Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (userNotificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', userNotificationId);

      if (error) {
        console.error('[BackendNotifications] Error marking as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(n =>
          n.user_notification_id === userNotificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('[BackendNotifications] Error:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('[BackendNotifications] Error marking all as read:', error);
        return;
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('[BackendNotifications] Error:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchNotifications();
      } else if (event === 'SIGNED_OUT') {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchNotifications]);

  // Listen for push events from service worker to refresh
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PUSH_RECEIVED') {
        console.log('[BackendNotifications] Push received, refreshing...');
        fetchNotifications();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker?.removeEventListener('message', handleMessage);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}

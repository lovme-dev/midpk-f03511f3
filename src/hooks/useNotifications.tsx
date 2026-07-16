import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Helper to get user-specific storage key
const getStorageKey = (userId: string | null) => {
  return userId ? `notifications_${userId}` : 'notifications_guest';
};

const getVersionKey = (userId: string | null) => {
  return userId ? `notification_version_${userId}` : 'notification_version_guest';
};

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Listen for auth changes to get current user
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id || null;
      
      // If user changed, we need to reload notifications for new user
      if (newUserId !== userId) {
        setUserId(newUserId);
        setIsInitialized(false);
      }
    });

    // Get initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, [userId]);

  // Load notifications when user changes
  useEffect(() => {
    if (isInitialized) return;

    const storageKey = getStorageKey(userId);
    const versionKey = getVersionKey(userId);
    const currentVersion = '2.0';
    
    const notificationVersion = localStorage.getItem(versionKey);
    
    if (notificationVersion !== currentVersion) {
      localStorage.removeItem(storageKey);
      localStorage.setItem(versionKey, currentVersion);
      setNotifications([]);
      setIsInitialized(true);
      return;
    }
    
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const loadedNotifications = parsed
          .map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
          .filter((n: Notification) => n.timestamp > sevenDaysAgo);
        
        setNotifications(loadedNotifications);
      } catch {
        localStorage.removeItem(storageKey);
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
    
    setIsInitialized(true);
  }, [userId, isInitialized]);

  // Save to localStorage whenever notifications change (user-specific)
  useEffect(() => {
    if (!isInitialized) return;
    const storageKey = getStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, userId, isInitialized]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

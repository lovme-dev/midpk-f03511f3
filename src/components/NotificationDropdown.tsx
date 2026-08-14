import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import { useBackendNotifications } from '@/hooks/useBackendNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  isMobile?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useBackendNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promotion': return 'text-green-400';
      case 'order': return 'text-blue-400';
      case 'system': return 'text-yellow-400';
      case 'update': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    if (!notification.read) {
      await markAsRead(notification.user_notification_id);
    }
    if (notification.action_url) {
      if (notification.action_url.startsWith('/')) {
        navigate(notification.action_url);
      } else {
        window.open(notification.action_url, '_blank');
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button 
        className="relative p-1.5 text-gray-300 hover:text-white transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
            <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            {isMobile && (
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
            )}
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                ${isMobile 
                  ? 'fixed top-16 left-0 right-0 mx-2 max-h-[50vh]' 
                  : 'fixed right-4 top-16 w-96 max-h-[80vh]'
                } 
                bg-midasbuy-navy border border-gray-700 rounded-lg shadow-xl z-[100] overflow-hidden opacity-100
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-midasbuy-darkBlue/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-midasbuy-blue" />
                  <h3 className="text-white font-bold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-midasbuy-blue hover:text-white transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  
                  {isMobile && (
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[35vh] md:max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      You'll see updates here
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.user_notification_id}
                        className={`
                          relative p-3 rounded-lg mb-2 transition-all hover:bg-midasbuy-blue/10 cursor-pointer
                          ${notification.read ? 'bg-slate-800/30' : 'bg-slate-800/60 border-l-4 border-midasbuy-blue'}
                        `}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 mt-0.5 ${getTypeColor(notification.type)}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm mb-1">
                              {notification.title}
                            </p>
                            <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-500 text-xs">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </p>
                              {notification.action_url && (
                                <ExternalLink className="w-3 h-3 text-gray-500" />
                              )}
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="absolute top-3 right-3 w-2 h-2 bg-midasbuy-blue rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-700 p-3 bg-midasbuy-darkBlue/50">
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-sm text-midasbuy-blue hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Inbox className="w-4 h-4" />
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;

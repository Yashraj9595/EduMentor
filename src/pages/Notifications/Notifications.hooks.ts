import { useState, useEffect } from 'react';
import { Notification } from './Notifications.types';
import { mockNotifications } from './Notifications.utils';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [mobileView, setMobileView] = useState(false);

  // Check screen size to determine layout
  useEffect(() => {
    const checkScreenSize = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    filter,
    setFilter,
    mobileView,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
};
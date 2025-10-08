import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mentor_request' | 'review_scheduled' | 'diary_submitted' | 'project_update';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  relatedProjectId?: string;
  relatedEntityType?: string;
  senderId?: string;
  senderName?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, '_id' | 'isRead' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  connect: () => void;
  disconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Set up WebSocket connection for real-time notifications
  const connect = () => {
    if (!user) return;
    
    // In a real implementation, this would connect to a WebSocket server
    // For now, we'll simulate real-time notifications
    console.log('Connecting to notification service...');
    
    // Simulate receiving notifications
    const interval = setInterval(() => {
      // Randomly generate notifications for demo purposes
      if (Math.random() > 0.7) {
        const notificationTypes = [
          { type: 'mentor_request', title: 'New Mentor Request', message: 'A student has requested you as a mentor' },
          { type: 'review_scheduled', title: 'Review Scheduled', message: 'A project review has been scheduled' },
          { type: 'diary_submitted', title: 'Diary Entry Submitted', message: 'A student has submitted a diary entry for review' },
          { type: 'project_update', title: 'Project Update', message: 'A student has updated their project status' }
        ];
        
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        addNotification({
          title: randomNotification.title,
          message: randomNotification.message,
          type: randomNotification.type as any,
          priority: 'medium'
        });
      }
    }, 30000); // Every 30 seconds for demo
    
    // Store interval ID to clear later
    (window as any).notificationInterval = interval;
  };

  const disconnect = () => {
    if ((window as any).notificationInterval) {
      clearInterval((window as any).notificationInterval);
    }
    console.log('Disconnected from notification service');
  };

  const fetchNotifications = async () => {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          _id: '1',
          title: 'Mentor Request',
          message: 'Sarah Johnson has requested you as a mentor for "AI Healthcare Assistant"',
          type: 'mentor_request',
          priority: 'high',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          relatedProjectId: 'proj1',
          senderId: 'student1',
          senderName: 'Sarah Johnson'
        },
        {
          _id: '2',
          title: 'Diary Entry Submitted',
          message: 'Mike Chen has submitted a diary entry for review',
          type: 'diary_submitted',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          relatedProjectId: 'proj2',
          senderId: 'student2',
          senderName: 'Mike Chen'
        },
        {
          _id: '3',
          title: 'Review Scheduled',
          message: 'Mid-term review for "Blockchain Voting System" scheduled for tomorrow',
          type: 'review_scheduled',
          priority: 'medium',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          relatedProjectId: 'proj2',
          senderId: 'system',
          senderName: 'System'
        },
        {
          _id: '4',
          title: 'Project Update',
          message: 'Emily Davis has updated the project status to "In Progress"',
          type: 'project_update',
          priority: 'low',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          relatedProjectId: 'proj3',
          senderId: 'student3',
          senderName: 'Emily Davis'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification._id === id ? { ...notification, isRead: true } : notification
    ));
    setUnreadCount(notifications.filter(n => !n.isRead && n._id !== id).length);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  };

  const addNotification = (notification: Omit<Notification, '_id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      _id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications([newNotification, ...notifications]);
    setUnreadCount(unreadCount + 1);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification._id !== id));
    const removedNotification = notifications.find(n => n._id === id);
    if (removedNotification && !removedNotification.isRead) {
      setUnreadCount(unreadCount - 1);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    connect,
    disconnect
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
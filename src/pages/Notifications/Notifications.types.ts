export interface NotificationsProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationsState {
  notifications: Notification[];
  filter: 'all' | 'unread' | 'read';
  mobileView: boolean;
}

export type NotificationsRef = HTMLDivElement;
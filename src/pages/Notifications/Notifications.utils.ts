import { Notification } from './Notifications.types';

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Terry Franci',
    message: 'requests permission to change Project - Nganter App',
    timestamp: '5 min ago',
    read: false,
    type: 'info',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Alena Franci',
    message: 'requests permission to change Project - Nganter App',
    timestamp: '8 min ago',
    read: false,
    type: 'info',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Jocelyn Kenter',
    message: 'requests permission to change Project - Nganter App',
    timestamp: '15 min ago',
    read: false,
    type: 'info',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Brandon Philips',
    message: 'requests permission to change Project - Nganter App',
    timestamp: '1 hr ago',
    read: true,
    type: 'info',
    priority: 'medium'
  }
];
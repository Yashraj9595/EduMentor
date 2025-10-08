import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationsProps } from './Notifications.types';

export const Notifications: React.FC<NotificationsProps> = ({ className, id }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getIconByType = (type: 'info' | 'success' | 'warning' | 'error' | 'mentor_request' | 'project_update') => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      case 'mentor_request': return <Bell className="text-purple-500" size={20} />;
      case 'project_update': return <Info className="text-blue-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getTypeClass = (type: 'info' | 'success' | 'warning' | 'error' | 'mentor_request' | 'project_update') => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      case 'mentor_request': return 'border-l-purple-500';
      case 'project_update': return 'border-l-blue-500';
      default: return 'border-l-blue-500';
    }
  };

  const markAllAsReadHandler = () => {
    markAllAsRead();
  };

  const clearAll = () => {
    notifications.forEach(notification => {
      deleteNotification(notification._id);
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  return (
    <div 
      className={`notifications ${className || ''}`}
      id={id}
      data-testid="notifications"
    >
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={markAllAsReadHandler}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {/* Filter controls */}
          <div className="flex border-b border-border">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                filter === 'all' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                filter === 'unread' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                filter === 'read' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>

          {/* Notifications list */}
          <div className="divide-y divide-border">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto text-muted-foreground" size={48} />
                <h3 className="mt-4 font-medium text-foreground">No notifications</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You're all caught up! Check back later for new notifications.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 flex gap-3 hover:bg-accent/50 transition-colors ${
                    !notification.read ? 'bg-accent/30' : ''
                  } border-l-4 ${getTypeClass(notification.type)}`}
                >
                  <div className="flex-shrink-0 pt-0.5">
                    {getIconByType(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h4>
                      <button 
                        onClick={() => deleteNotification(notification._id)}
                        className="text-muted-foreground hover:text-foreground ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {!notification.read && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification._id)}
                      className="self-start text-xs text-primary hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Notifications;
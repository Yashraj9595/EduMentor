import React from 'react';
import { X, Bell } from 'lucide-react';
import { useNotifications } from './Notifications.hooks';

interface FloatingNotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingNotification: React.FC<FloatingNotificationProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification
  } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      
      {/* Notification Panel - Positioned below header bell icon */}
      <div className="absolute top-20 right-6 w-80 max-h-96 overflow-hidden shadow-xl bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.slice(0, 4).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Profile Picture */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {notification.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {notification.timestamp}
                          </span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {notifications.length > 4 && (
          <div className="border-t border-gray-200 p-3">
            <button 
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
              onClick={() => {
                onClose();
                // Navigate to full notifications page
                window.location.href = '/notifications';
              }}
            >
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

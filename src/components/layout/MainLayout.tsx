import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MobileHeader } from './MobileHeader';
import { FloatingAI } from '../../pages/AI/FloatingAI';
import { FloatingChatButton } from '../../pages/chat/components/FloatingChatButton';
import { FloatingNotification } from '../../pages/Notifications';
import { Bell, Menu } from 'lucide-react';
import { useNotifications } from '../../pages/Notifications';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const [title, setTitle] = useState('Dashboard');
  const { unreadCount } = useNotifications();
  const { user } = useAuth();

  // Check if current page uses PageLayout (has its own header) - only on mobile
  const usesPageLayout = location.pathname.includes('/users/') || 
                         location.pathname.includes('/profile') ||
                         location.pathname.includes('/security') ||
                         location.pathname.includes('/notifications') ||
                         location.pathname.includes('/preferences') ||
                         location.pathname.includes('/view-profile') ||
                         // Admin pages - hide MobileHeader because they handle their own header
                         location.pathname.includes('/admin-settings') ||
                         location.pathname.includes('/user-settings') ||
                         location.pathname.includes('/analytics') ||
                         location.pathname.includes('/reports') ||
                         location.pathname.includes('/users');

  useEffect(() => {
    // Determine title based on current route
    const path = location.pathname;
    if (path.includes('dashboard')) setTitle('Dashboard');
    else if (path.includes('analytics')) setTitle('Analytics');
    else if (path.includes('reports')) setTitle('Reports');
    else if (path.includes('users') && !path.includes('settings')) setTitle('Users');
    else if (path.includes('projects')) setTitle('Projects');
    else if (path.includes('profile')) setTitle('Profile');
    else if (path.includes('security')) setTitle('Security');
    else if (path.includes('notifications')) setTitle('Notifications');
    else if (path.includes('preferences')) setTitle('Preferences');
    else if (path.includes('view-profile')) setTitle('View Profile');
    else if (path.includes('settings')) setTitle('Settings');
    else setTitle('Dashboard');
  }, [location]);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background w-full max-w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Navigation isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden w-full max-w-full">
          {/* Desktop Header - Only visible on desktop */}
          {!usesPageLayout && (
            <div className="hidden lg:block border-b border-border bg-background">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground"
                  >
                    <Menu size={20} />
                  </button>
                  <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or type command..."
                      className="w-64 px-4 py-2 pl-10 pr-4 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">
                      ⌘K
                    </div>
                  </div>
                  
                  {/* Theme Toggle */}
                  <ThemeToggle />
                  
                  {/* Notification Icon */}
                  <div className="relative">
                    <button
                      onClick={() => setNotificationOpen(!notificationOpen)}
                      className="p-2 rounded-lg hover:bg-accent text-muted-foreground relative"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                  
                  {/* User Profile */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Header - Only visible on mobile and only if page doesn't have its own header */}
          {!usesPageLayout && (
            <div className="lg:hidden">
              <MobileHeader 
                onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
                title={title}
              />
            </div>
          )}
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 w-full max-w-full">
            <div className="container mx-auto  max-w-7xl w-full">
              <Outlet />
            </div>
          </main>

          {/* Mobile Bottom Navigation - Only visible on mobile */}
          <div className="lg:hidden">
            <Navigation isOpen={false} onToggle={() => {}} isMobile={true} />
          </div>
        </div>
      </div>
      
      
      {/* Floating Notification Panel */}
      <FloatingNotification 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
      
      {/* Floating AI Assistant - Available on all pages */}
      <FloatingAI isOpen={aiOpen} onToggle={() => setAiOpen(!aiOpen)} />
      
      {/* Instagram-style Floating Chat - Available on all pages */}
      <FloatingChatButton />
    </>
  );
};
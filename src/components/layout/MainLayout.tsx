import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MobileHeader } from './MobileHeader';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBell } from '../Notifications';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't show layout on auth pages
  const authPages = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
    '/registration-success',
    '/select-role'
  ];

  const hideLayout = authPages.includes(location.pathname);

  if (hideLayout) {
    return <>{children || <Outlet />}</>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-64 border-r border-border bg-card">
        <Navigation isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">EduMentor</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.firstName}!
                </span>
                <NotificationBell />
              </>
            )}
          </div>
        </header>

        {/* Mobile Header */}
        <div className="md:hidden">
          <MobileHeader onMenuToggle={toggleSidebar} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
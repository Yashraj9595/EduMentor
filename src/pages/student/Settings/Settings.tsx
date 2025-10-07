import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Lock, Bell, Globe, LogOut, HelpCircle, Trash2 } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../../components/layout/PageLayout';
import { Profile } from './components/Profile';
import { Security } from './components/Security';
import { Notifications } from './components/Notifications';
import { Preferences } from './components/Preferences';

import { useSettings } from './Settings.hooks';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { } = useSettings({});

  useEffect(() => {
    // Track user visiting settings page
    console.log(`User ${user?.email} visited settings page`);
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion logic here
      console.log('Account deletion requested');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const additionalActions = [
    { id: 'help', label: 'Help & Support', icon: HelpCircle, action: () => navigate('/help') },
    { id: 'delete', label: 'Delete Account', icon: Trash2, action: handleDeleteAccount },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'security':
        return <Security />;
      case 'notifications':
        return <Notifications />;
      case 'preferences':
        return <Preferences />;
      default:
        return <Profile />;
    }
  };

  // For small screens, show individual pages with PageLayout
  const renderMobileView = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <PageLayout title="Profile" showBackButton onBack={() => setActiveTab('')}>
            <div className="pt-2">
              <Profile />
            </div>
          </PageLayout>
        );
      case 'security':
        return (
          <PageLayout title="Security" showBackButton onBack={() => setActiveTab('')}>
            <div className="pt-2">
              <Security />
            </div>
          </PageLayout>
        );
      case 'notifications':
        return (
          <PageLayout title="Notifications" showBackButton onBack={() => setActiveTab('')}>
            <div className="pt-2">
              <Notifications />
            </div>
          </PageLayout>
        );
      case 'preferences':
        return (
          <PageLayout title="Preferences" showBackButton onBack={() => setActiveTab('')}>
            <div className="pt-2">
              <Preferences />
            </div>
          </PageLayout>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Mobile view - show individual pages with PageLayout */}
      <div className="md:hidden">
        {activeTab ? renderMobileView() : (
          <div className="w-full min-h-screen bg-background">
            {/* Custom header for main Settings page */}
            <div className="bg-background border-b border-border p-4 sticky top-0 z-20">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              </div>
            </div>
            
            {/* Page Content */}
            <div className="p-4 pb-6">
              <div className="space-y-4 pt-2">
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                          index < tabs.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon size={20} />
                        </div>
                        <span className="font-medium text-foreground">{tab.label}</span>
                        <div className="ml-auto">
                          <svg className="text-muted-foreground" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                  {additionalActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                          index < additionalActions.length - 1 ? 'border-b border-border' : ''
                        } ${action.id === 'delete' ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:bg-accent'}`}
                      >
                        <div className={`p-2 rounded-lg ${action.id === 'delete' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                          <Icon size={20} />
                        </div>
                        <span className={`font-medium ${action.id === 'delete' ? 'text-destructive' : 'text-foreground'}`}>{action.label}</span>
                        <div className="ml-auto">
                          <svg className={action.id === 'delete' ? 'text-destructive' : 'text-muted-foreground'} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-4 text-left transition-colors text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                      <LogOut size={20} />
                    </div>
                    <span className="font-medium text-destructive">
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </span>
                    <div className="ml-auto">
                      <svg className="text-destructive" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop view - show tabs and content side by side */}
      <div className="hidden md:block space-y-6 w-full p-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardBody className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
                
                <div className="border-t border-border my-2 mx-4"></div>
                
                {additionalActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors text-left ${
                        action.id === 'delete' 
                          ? 'text-destructive hover:bg-destructive/10' 
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon size={20} />
                      <span className={`font-medium ${action.id === 'delete' ? 'text-destructive' : ''}`}>{action.label}</span>
                    </button>
                  );
                })}
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors text-left text-destructive hover:bg-destructive/10 mt-4 disabled:opacity-50"
                >
                  <LogOut size={20} />
                  <span className="font-medium">
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </nav>
            </CardBody>
          </Card>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
};
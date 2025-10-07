import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  Menu,
  Trophy,
  User,
  Compass,
  MessageCircle,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Shield,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle, isMobile = false }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard', mobileLabel: 'Admin', roles: ['admin'] },
    { path: '/app/user-dashboard', icon: LayoutDashboard, label: 'Student Dashboard', mobileLabel: 'Student', roles: ['student'] },
    { path: '/app/mentor-dashboard', icon: LayoutDashboard, label: 'Mentor Dashboard', mobileLabel: 'Mentor', roles: ['mentor'] },
    { path: '/app/hackathon-dashboard', icon: LayoutDashboard, label: 'Hackathon Dashboard', mobileLabel: 'Events', roles: ['organizer'] },
    { path: '/app/company-dashboard', icon: LayoutDashboard, label: 'Company Dashboard', mobileLabel: 'Company', roles: ['company'] },
    { path: '/app/institution-dashboard', icon: LayoutDashboard, label: 'Institution Dashboard', mobileLabel: 'Institution', roles: ['institution'] },
    
  // Student-specific navigation
  { path: '/app/student/projects', icon: FileText, label: 'My Projects', mobileLabel: 'Projects', roles: ['student'] },
  { path: '/app/student/explore', icon: Compass, label: 'Explore Projects', mobileLabel: 'Explore', roles: ['student'] },
  { path: '/app/student/mentors', icon: Users, label: 'Find Mentors', mobileLabel: 'Mentors', roles: ['student'] },
  { path: '/app/student/hackathons', icon: Trophy, label: 'Hackathons', mobileLabel: 'Events', roles: ['student'] },
  { path: '/app/student/teams/create', icon: Users, label: 'Create Team', mobileLabel: 'Teams', roles: ['student'] },
  { path: '/app/student/profile', icon: User, label: 'My Portfolio', mobileLabel: 'Profile', roles: ['student'] },
  
  // Diary Management for Students
  { path: '/app/student/diary', icon: BookOpen, label: 'Project Diary', mobileLabel: 'Diary', roles: ['student'] },
  
  // Advanced Features (AI Recommendations removed)
  { path: '/app/student/achievements', icon: Award, label: 'Achievements', mobileLabel: 'Rewards', roles: ['student'] },
  { path: '/app/student/features', icon: Sparkles, label: 'Feature Guide', mobileLabel: 'Features', roles: ['student'] },
  
  // Mentor Diary Management
  { path: '/app/mentor-diary', icon: BookOpen, label: 'Diary Management', mobileLabel: 'Diary', roles: ['mentor'] },
  { path: '/app/mentor-reviews', icon: Calendar, label: 'Review Scheduler', mobileLabel: 'Reviews', roles: ['mentor'] },
  
  // Admin Diary Monitoring
  { path: '/app/diary-monitor', icon: Shield, label: 'Diary Monitor', mobileLabel: 'Monitor', roles: ['admin'] },
  
  // Chat - Available for all roles
  { path: '/app/chat', icon: MessageCircle, label: 'Chat', mobileLabel: 'Chat', roles: ['student', 'mentor', 'organizer', 'company', 'admin'] },
    
    { path: '/app/users', icon: Users, label: 'Users', mobileLabel: 'Users', roles: ['admin'] },
    { path: '/app/analytics', icon: BarChart3, label: 'Analytics', mobileLabel: 'Analytics', roles: ['admin', 'mentor'] },
    { path: '/app/reports', icon: FileText, label: 'Reports', mobileLabel: 'Reports', roles: ['admin', 'mentor'] },
    { path: '/app/admin-settings', icon: Settings, label: 'Admin Settings', mobileLabel: 'Settings', roles: ['admin'] },
    { path: '/app/user-settings', icon: Settings, label: 'Settings', mobileLabel: 'Settings', roles: ['student', 'mentor', 'organizer', 'company'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  // For mobile bottom nav, show all available items (no logout button)
  const displayItems = filteredNavItems;

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-30">
        <div className="flex">
          {displayItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-1 flex-1 min-w-0 transition-colors
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-xs font-medium text-center leading-tight">{item.mobileLabel || item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-background border-r border-border
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
          lg:relative
          max-w-full
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {isOpen && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-foreground truncate">Auth App</h2>
                  <p className="text-xs text-muted-foreground capitalize truncate">{user?.role}</p>
                </div>
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hidden lg:block"
            >
              {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {displayItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-accent text-accent-foreground' 
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                      title={!isOpen ? item.label : undefined}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {isOpen && <span className="font-medium truncate">{item.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            {isOpen && user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-semibold truncate">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Theme Toggle */}
            {isOpen && (
              <div className="mb-3">
                <ThemeToggle className="w-full" />
              </div>
            )}
            
            <button
              onClick={logout}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-destructive hover:bg-destructive/10 transition-colors w-full
                ${!isOpen && 'justify-center'}
              `}
              title={!isOpen ? 'Logout' : undefined}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
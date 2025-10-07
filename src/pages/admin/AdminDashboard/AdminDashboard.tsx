import React from 'react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Database, 
  Activity,
  GraduationCap,
  UserCheck,
  Calendar,
  Trophy,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const adminFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage all students, teachers, and staff accounts',
      status: 'Coming Soon',
      color: 'bg-primary',
    },
    {
      icon: FileText,
      title: 'Project Monitoring',
      description: 'Monitor institution-wide project progress',
      status: 'Coming Soon',
      color: 'bg-secondary',
    },
    {
      icon: Trophy,
      title: 'Hackathon Management',
      description: 'Create and manage hackathon events',
      status: 'Coming Soon',
      color: 'bg-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Insights on skills, projects, and mentor activity',
      status: 'Coming Soon',
      color: 'bg-accent',
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Schedule and manage academic events',
      status: 'Coming Soon',
      color: 'bg-green-500',
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Configure institution-wide settings',
      status: 'Coming Soon',
      color: 'bg-card',
    },
  ];

  return (
    <div className="space-y-6 w-full p-4">
      {/* Welcome Section */}
      <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName}! 🏫
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              College Admin Dashboard
            </p>
          </div>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Manage your institution's projects, users, and events from this centralized dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">1,234</p>
              </div>
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">89</p>
              </div>
              <FileText className="w-8 h-8 text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Mentors</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </div>
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Admin Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Administrative Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${feature.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {feature.status}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-card-foreground">Recent Institutional Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { action: 'New student registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
              { action: 'Project submitted', user: 'AI Research Project', time: '1 hour ago', type: 'project' },
              { action: 'Hackathon created', user: 'Tech Innovation Challenge', time: '2 hours ago', type: 'event' },
              { action: 'Mentor assigned', user: 'Dr. Smith to Web Dev Project', time: '3 hours ago', type: 'mentor' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-primary' :
                    activity.type === 'project' ? 'bg-secondary' :
                    activity.type === 'event' ? 'bg-purple-500' :
                    'bg-accent'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
import React from 'react';
import { 
  Users, 
  Trophy, 
  Calendar, 
  BarChart3, 
  Clock,
  Target,
  Award,
  MessageSquare
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export const HackathonDashboard: React.FC = () => {
  const { user } = useAuth();

  const organizerFeatures = [
    {
      icon: Trophy,
      title: 'Create Hackathon',
      description: 'Set up new hackathon events with rules and timelines',
      status: 'Coming Soon',
      color: 'bg-primary',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage participant teams and members',
      status: 'Coming Soon',
      color: 'bg-secondary',
    },
    {
      icon: MessageSquare,
      title: 'Judging Panel',
      description: 'Coordinate judges and judging criteria',
      status: 'Coming Soon',
      color: 'bg-accent',
    },
    {
      icon: Target,
      title: 'Submissions',
      description: 'Review project submissions and progress',
      status: 'Coming Soon',
      color: 'bg-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Live Scoreboard',
      description: 'Monitor real-time scoring and rankings',
      status: 'Coming Soon',
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      title: 'Event Schedule',
      description: 'Manage hackathon timeline and activities',
      status: 'Coming Soon',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6 w-full p-4">
      {/* Welcome Section */}
      <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName}! 💻
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Hackathon Organizer Dashboard
            </p>
          </div>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Manage your hackathon events, teams, and judging process.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registered Teams</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <Users className="w-8 h-8 text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Judges Assigned</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Organizer Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Organizer Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizerFeatures.map((feature, index) => {
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
          <h2 className="text-lg font-semibold text-card-foreground">Recent Event Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { action: 'New team registered', item: 'Tech Innovators', time: '1 hour ago', type: 'team' },
              { action: 'Judge assigned', item: 'Dr. Johnson to Web Dev Category', time: '2 hours ago', type: 'judge' },
              { action: 'Project submitted', item: 'AI Solution', time: '1 day ago', type: 'project' },
              { action: 'Event created', item: 'Data Science Challenge', time: '2 days ago', type: 'event' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'team' ? 'bg-primary' :
                    activity.type === 'judge' ? 'bg-secondary' :
                    activity.type === 'project' ? 'bg-green-500' :
                    'bg-accent'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
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
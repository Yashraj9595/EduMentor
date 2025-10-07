import React from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Star,
  Shield
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export const MentorDashboard: React.FC = () => {
  const { user } = useAuth();

  const mentorFeatures = [
    {
      icon: BookOpen,
      title: 'Diary Management',
      description: 'Monitor student diary entries and project progress',
      status: 'Available',
      color: 'bg-primary',
      link: '/app/mentor-diary',
    },
    {
      icon: Calendar,
      title: 'Review Scheduler',
      description: 'Schedule and conduct project reviews',
      status: 'Available',
      color: 'bg-secondary',
      link: '/app/mentor-reviews',
    },
    {
      icon: Users,
      title: 'My Students',
      description: 'View and manage your assigned students',
      status: 'Coming Soon',
      color: 'bg-accent',
    },
    {
      icon: FileText,
      title: 'Project Reviews',
      description: 'Review and provide feedback on student projects',
      status: 'Coming Soon',
      color: 'bg-purple-500',
    },
    {
      icon: MessageSquare,
      title: 'Mentor Sessions',
      description: 'Schedule and manage mentoring sessions',
      status: 'Coming Soon',
      color: 'bg-green-500',
    },
    {
      icon: Target,
      title: 'Milestones',
      description: 'Track student project milestones',
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
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName}! 👨‍🏫
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Mentor Dashboard
            </p>
          </div>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Guide your students, review their projects, and track their progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned Students</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <FileText className="w-8 h-8 text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Reviews</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Mentor Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Mentor Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isAvailable = feature.status === 'Available';
            return (
              <Card key={index} className={`relative overflow-hidden hover:shadow-lg transition-shadow ${isAvailable ? 'cursor-pointer' : ''}`}>
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
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feature.status}
                      </div>
                      {isAvailable && feature.link && (
                        <div className="mt-2">
                          <a 
                            href={feature.link}
                            className="text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            Open Feature →
                          </a>
                        </div>
                      )}
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
          <h2 className="text-lg font-semibold text-card-foreground">Recent Mentoring Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { action: 'Project review completed', item: 'Web Development Project', time: '1 hour ago', type: 'review' },
              { action: 'New student assigned', item: 'Jane Smith', time: '2 hours ago', type: 'student' },
              { action: 'Feedback provided', item: 'AI Research Milestone', time: '1 day ago', type: 'feedback' },
              { action: 'Session scheduled', item: 'Mobile App Design', time: '2 days ago', type: 'session' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'review' ? 'bg-primary' :
                    activity.type === 'student' ? 'bg-secondary' :
                    activity.type === 'feedback' ? 'bg-green-500' :
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
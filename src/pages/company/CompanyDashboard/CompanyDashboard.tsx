import React from 'react';
import { 
  Building, 
  Users, 
  FileText, 
  BarChart3, 
  Target, 
  Award,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();

  const companyFeatures = [
    {
      icon: Target,
      title: 'Post Challenges',
      description: 'Create industry challenges for students',
      status: 'Coming Soon',
      color: 'bg-primary',
    },
    {
      icon: FileText,
      title: 'Project Showcase',
      description: 'View and evaluate student projects',
      status: 'Coming Soon',
      color: 'bg-secondary',
    },
    {
      icon: Users,
      title: 'Talent Discovery',
      description: 'Find skilled students for internships',
      status: 'Coming Soon',
      color: 'bg-accent',
    },
    {
      icon: BarChart3,
      title: 'Skill Analytics',
      description: 'Analyze in-demand skills and technologies',
      status: 'Coming Soon',
      color: 'bg-purple-500',
    },
    {
      icon: Award,
      title: 'Internship Portal',
      description: 'Post and manage internship opportunities',
      status: 'Coming Soon',
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      title: 'Event Sponsorship',
      description: 'Sponsor hackathons and academic events',
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
            <Building className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName}! 🏭
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Company Dashboard
            </p>
          </div>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Discover talent, post challenges, and engage with students.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Challenges</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects Reviewed</p>
                <p className="text-2xl font-bold text-foreground">15</p>
              </div>
              <FileText className="w-8 h-8 text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Talent Matches</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Internship Posts</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Company Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Company Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyFeatures.map((feature, index) => {
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
          <h2 className="text-lg font-semibold text-card-foreground">Recent Company Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { action: 'New challenge posted', item: 'AI Optimization Problem', time: '1 hour ago', type: 'challenge' },
              { action: 'Project reviewed', item: 'Machine Learning Solution', time: '2 hours ago', type: 'project' },
              { action: 'Talent match found', item: 'Data Science Student', time: '1 day ago', type: 'talent' },
              { action: 'Internship created', item: 'Summer Developer Position', time: '2 days ago', type: 'internship' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'challenge' ? 'bg-primary' :
                    activity.type === 'project' ? 'bg-secondary' :
                    activity.type === 'talent' ? 'bg-green-500' :
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
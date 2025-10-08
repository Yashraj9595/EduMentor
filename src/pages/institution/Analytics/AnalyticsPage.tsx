import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const analyticsData = [
    {
      title: 'Student Performance',
      value: '87%',
      change: '+5%',
      trend: 'up',
      description: 'Average performance across all students'
    },
    {
      title: 'Teacher Engagement',
      value: '92%',
      change: '+3%',
      trend: 'up',
      description: 'Active teacher participation rate'
    },
    {
      title: 'Project Completion',
      value: '78%',
      change: '+8%',
      trend: 'up',
      description: 'Projects completed on time'
    },
    {
      title: 'Hackathon Participation',
      value: '156',
      change: '+24',
      trend: 'up',
      description: 'Total participants in hackathons'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your institution's performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/app/institution-dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((metric, index) => (
          <Card key={index}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <TrendingUp className={`h-4 w-4 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Student Performance Trends
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Performance chart would be displayed here</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teacher Activity
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Activity chart would be displayed here</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/students')}
            >
              <GraduationCap className="h-6 w-6" />
              <span className="font-medium">View Students</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/teachers')}
            >
              <Users className="h-6 w-6" />
              <span className="font-medium">View Teachers</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/hackathons')}
            >
              <Trophy className="h-6 w-6" />
              <span className="font-medium">Manage Hackathons</span>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

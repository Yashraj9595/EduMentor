import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [stats] = useState({
    totalProjects: 8,
    completedProjects: 5,
    activeProjects: 2,
    pendingReviews: 1,
    totalReports: 12,
    completedReports: 8,
    averageGrade: 85,
    mentorMeetings: 3
  });

  const [recentProjects] = useState([
    {
      id: '1',
      title: 'E-commerce Platform Development',
      status: 'in-progress',
      progress: 75,
      dueDate: '2024-02-15',
      mentor: 'Dr. Sarah Johnson',
      grade: null
    },
    {
      id: '2',
      title: 'Mobile App for Healthcare',
      status: 'completed',
      progress: 100,
      dueDate: '2024-01-30',
      mentor: 'Prof. Michael Chen',
      grade: 92
    },
    {
      id: '3',
      title: 'AI-Powered Learning System',
      status: 'review',
      progress: 90,
      dueDate: '2024-02-20',
      mentor: 'Dr. Emily Davis',
      grade: null
    }
  ]);

  const [recentReports] = useState([
    {
      id: '1',
      title: 'Data Privacy Regulations Analysis',
      type: 'Legal Research',
      status: 'completed',
      lastModified: '2024-01-20'
    },
    {
      id: '2',
      title: 'Comparative Legal Framework Study',
      type: 'Academic Research',
      status: 'in-progress',
      lastModified: '2024-01-18'
    }
  ]);

  const [upcomingEvents] = useState([
    {
      id: '1',
      title: 'Mentor Meeting with Dr. Johnson',
      type: 'meeting',
      date: '2024-01-25',
      time: '2:00 PM'
    },
    {
      id: '2',
      title: 'Project Review Session',
      type: 'review',
      date: '2024-01-28',
      time: '10:00 AM'
    },
    {
      id: '3',
      title: 'Report Submission Deadline',
      type: 'deadline',
      date: '2024-02-01',
      time: '11:59 PM'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'review':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'review':
        return <FileText className="h-4 w-4" />;
      case 'deadline':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'text-blue-600';
      case 'review':
        return 'text-yellow-600';
      case 'deadline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome back, Student!</h1>
        <p className="text-xl text-muted-foreground">
          Track your projects, reports, and academic progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold">{stats.totalProjects}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedProjects}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeProjects}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                <p className="text-3xl font-bold text-purple-600">{stats.averageGrade}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => window.location.href = '/app/student/projects'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Manage Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              View and manage your academic projects
            </p>
            <Button className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Go to Projects
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = '/app/student/report-generation'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Report Generation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Create professional reports and documents
            </p>
            <Button className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = '/app/student/diary'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle>Project Diary</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Track your daily progress and milestones
            </p>
            <Button className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Open Diary
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/app/student/projects'}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.mentor}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status}</span>
                    </Badge>
                    {project.grade && (
                      <Badge variant="outline">Grade: {project.grade}%</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-lg font-semibold">{project.progress}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Reports
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/app/student/report-generation'}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{report.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1 capitalize">{report.status}</span>
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Modified</div>
                  <div className="text-sm font-medium">{report.lastModified}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-gray-100 ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getEventColor(event.type)}>
                  {event.type.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export is now at the top of the file

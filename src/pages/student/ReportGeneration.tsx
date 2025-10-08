import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Plus, 
  History, 
  Download,
  Settings,
  BookOpen,
  Scale,
  Briefcase,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const ReportGeneration: React.FC = () => {
  const [recentReports] = useState([
    {
      id: '1',
      title: 'Data Privacy Regulations Analysis',
      type: 'Legal Research',
      status: 'completed',
      lastModified: '2024-01-20',
      progress: 100
    },
    {
      id: '2',
      title: 'Comparative Legal Framework Study',
      type: 'Academic Research',
      status: 'in-progress',
      lastModified: '2024-01-18',
      progress: 75
    },
    {
      id: '3',
      title: 'International Data Protection Laws',
      type: 'Business Report',
      status: 'draft',
      lastModified: '2024-01-15',
      progress: 45
    }
  ]);

  const [templates] = useState([
    {
      id: 'legal',
      name: 'Legal Research Report',
      description: 'Comprehensive legal research with proper citations',
      icon: <Scale className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-800',
      features: ['Bluebook Citations', 'Legal Analysis', 'Case Studies', '14 Sections']
    },
    {
      id: 'academic',
      name: 'Academic Research Report',
      description: 'Standard academic format with APA citations',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-green-100 text-green-800',
      features: ['APA Citations', 'Literature Review', 'Methodology', '10 Sections']
    },
    {
      id: 'business',
      name: 'Business Report',
      description: 'Professional business report with recommendations',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-800',
      features: ['Executive Summary', 'Analysis', 'Recommendations', '9 Sections']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
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
      case 'draft':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <FileText className="h-10 w-10" />
          Report Generation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create professional legal, academic, and business reports with proper formatting, 
          citations, and university-level standards.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => window.location.href = '/project-report'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Create New Report</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Start a new report with professional templates
            </p>
            <Button className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = '/project-report/history'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Report History</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              View and manage your saved reports
            </p>
            <Button variant="outline" className="w-full">
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = '/project-report/templates'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Browse available report templates
            </p>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Reports</h2>
          <Button variant="outline" onClick={() => window.location.href = '/project-report/history'}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{report.type}</p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{report.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${report.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Last modified: {report.lastModified}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Report Templates</h2>
          <Button variant="outline" onClick={() => window.location.href = '/project-report/templates'}>
            View All Templates
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/project-report?template=${template.id}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={template.color}>
                      {template.id.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1</div>
              <div className="text-sm text-muted-foreground">Draft</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export is now at the top of the file

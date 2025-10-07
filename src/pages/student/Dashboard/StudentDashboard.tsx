import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Users, 
  Trophy, 
  Bell,
  Plus, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  BookOpen,
  User,
  Settings,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  Link as LinkIcon,
  TrendingUp,
  Star
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/api';

interface Project {
  _id: string;
  title: string;
  status: string;
  endDate: string;
  mentorName?: string;
}


export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects
      const projectsResponse = await apiService.get<any>('/projects/my-projects');
      setProjects(projectsResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty array for projects if API fails
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };


  // Calculate dashboard metrics
  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const pendingApprovals = projects.filter(p => p.status === 'under_review').length;
  const thisWeekDeadlines = projects.filter(p => {
    const endDate = new Date(p.endDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return endDate >= today && endDate <= nextWeek;
  }).length;
  const unreadNotifications = 0; // Using centralized notification system

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Student Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button 
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-primary-foreground mb-6">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-primary-foreground/80 text-lg">
                  Ready to make progress on your projects today?
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/80 max-w-2xl">
              Manage your academic projects, connect with mentors, and participate in hackathons - all in one place.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-foreground">{activeProjects}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    <p className="text-2xl font-bold text-foreground">{pendingApprovals}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Deadlines This Week</p>
                    <p className="text-2xl font-bold text-foreground">{thisWeekDeadlines}</p>
                  </div>
                  <Clock className="w-8 h-8 text-accent" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unread Notifications</p>
                    <p className="text-2xl font-bold text-foreground">{unreadNotifications}</p>
                  </div>
                  <Bell className="w-8 h-8 text-yellow-500" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-card-foreground">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                  <Plus className="w-8 h-8 text-primary mb-2" />
                  <span className="font-medium text-foreground">Create Project</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
                  <Users className="w-8 h-8 text-secondary mb-2" />
                  <span className="font-medium text-foreground">Join Hackathon</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                  <FileText className="w-8 h-8 text-accent mb-2" />
                  <span className="font-medium text-foreground">Upload Deliverable</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                  <Trophy className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="font-medium text-foreground">Browse Mentors</span>
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Diary Management Feature */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Project Diary Management
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Digital Diary</h3>
                    <p className="text-sm text-blue-700">Track your project progress with digital diary entries</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Progress Tracking</h3>
                    <p className="text-sm text-green-700">Visual progress bars and milestone completion</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Gamification</h3>
                    <p className="text-sm text-purple-700">Earn badges, points, and achievements</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <a 
                  href="/app/student/diary" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Open Project Diary
                </a>
              </div>
            </CardBody>
          </Card>

          {/* Recent Projects and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-card-foreground">Recent Projects</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-medium text-foreground">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.mentorName ? `Mentor: ${project.mentorName}` : 'No mentor assigned'}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No projects yet. Create your first project to get started!</p>
                  )}
                </div>
              </CardBody>
            </Card>

          </div>
        </div>
      </div>

    </div>
  );
};
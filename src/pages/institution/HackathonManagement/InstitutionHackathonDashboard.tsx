import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Award, 
  BarChart3, 
  Calendar, 
  Target, 
  Plus,
  Eye,
  Edit,
  Star
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui/Progress';
import { CreateHackathon } from '../../organizer/HackathonManagement/CreateHackathon';
import { TeamManagement } from '../../organizer/HackathonManagement/TeamManagement';
import { JudgingSystem } from '../../organizer/HackathonManagement/JudgingSystem';
import { AnalyticsDashboard } from '../../organizer/HackathonManagement/AnalyticsDashboard';
import { useAuth } from '../../../contexts/AuthContext';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  participants: number;
  teams: number;
  submissions: number;
  averageScore: number;
  categories: string[];
  prizePool: string;
  location: string;
}

interface InstitutionStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalTeams: number;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
}

export const InstitutionHackathonDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current section from URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/create')) return 'create';
    if (path.includes('/teams')) return 'teams';
    if (path.includes('/judging')) return 'judging';
    if (path.includes('/analytics')) return 'analytics';
    return 'dashboard';
  };

  const currentSection = getCurrentSection();

  useEffect(() => {
    fetchHackathons();
    fetchStats();
  }, []);

  const fetchHackathons = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockHackathons: Hackathon[] = [
        {
          id: '1',
          title: 'Tech Innovation Challenge 2025',
          description: 'A comprehensive hackathon focusing on emerging technologies and real-world problem solving.',
          startDate: '2025-02-15T09:00:00Z',
          endDate: '2025-02-17T18:00:00Z',
          status: 'published',
          participants: 156,
          teams: 42,
          submissions: 38,
          averageScore: 4.2,
          categories: ['AI/ML', 'Web Development', 'Mobile Development'],
          prizePool: '$15,000',
          location: 'Main Campus, Building A'
        },
        {
          id: '2',
          title: 'Data Science Hackathon',
          description: 'Competition focused on data-driven solutions for social impact and business optimization.',
          startDate: '2025-03-01T09:00:00Z',
          endDate: '2025-03-03T18:00:00Z',
          status: 'draft',
          participants: 0,
          teams: 0,
          submissions: 0,
          averageScore: 0,
          categories: ['Data Science', 'Machine Learning', 'Analytics'],
          prizePool: '$10,000',
          location: 'Engineering Block, Room 201'
        },
        {
          id: '3',
          title: 'Green Tech Solutions',
          description: 'Environmental sustainability hackathon for innovative eco-friendly solutions.',
          startDate: '2025-01-20T09:00:00Z',
          endDate: '2025-01-22T18:00:00Z',
          status: 'completed',
          participants: 89,
          teams: 24,
          submissions: 22,
          averageScore: 4.5,
          categories: ['Sustainability', 'IoT', 'Renewable Energy'],
          prizePool: '$8,000',
          location: 'Online'
        }
      ];
      setHackathons(mockHackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockStats: InstitutionStats = {
        totalHackathons: 8,
        activeHackathons: 2,
        totalParticipants: 456,
        totalTeams: 98,
        totalSubmissions: 89,
        averageScore: 4.3,
        completionRate: 92.5
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Hackathon['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render different views based on current section
  const renderCreateView = () => {
    // Create a wrapper component that overrides navigation for institution context
    const CreateHackathonWrapper = () => {
      return <CreateHackathon />;
    };
    return <CreateHackathonWrapper />;
  };

  const renderTeamsView = () => {
    const TeamManagementWrapper = () => {
      return <TeamManagement />;
    };
    return <TeamManagementWrapper />;
  };

  const renderJudgingView = () => {
    const JudgingSystemWrapper = () => {
      return <JudgingSystem />;
    };
    return <JudgingSystemWrapper />;
  };

  const renderAnalyticsView = () => {
    const AnalyticsDashboardWrapper = () => {
      return <AnalyticsDashboard />;
    };
    return <AnalyticsDashboardWrapper />;
  };

  const getStatusText = (status: Hackathon['status']) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'published': return 'Published';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const quickActions = [
    {
      title: 'Create New Hackathon',
      description: 'Set up a new hackathon event',
      icon: Plus,
      color: 'bg-primary',
      link: '/app/institution-dashboard/hackathons/create',
      available: true
    },
    {
      title: 'Manage Teams',
      description: 'Review and manage participant teams',
      icon: Users,
      color: 'bg-blue-500',
      link: '/app/institution-dashboard/hackathons/teams',
      available: true
    },
    {
      title: 'Judging System',
      description: 'Set up judges and scoring criteria',
      icon: Award,
      color: 'bg-green-500',
      link: '/app/institution-dashboard/hackathons/judging',
      available: true
    },
    {
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights',
      icon: BarChart3,
      color: 'bg-purple-500',
      link: '/app/institution-dashboard/hackathons/analytics',
      available: true
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render different views based on current section
  if (currentSection === 'create') {
    return renderCreateView();
  }
  
  if (currentSection === 'teams') {
    return renderTeamsView();
  }
  
  if (currentSection === 'judging') {
    return renderJudgingView();
  }
  
  if (currentSection === 'analytics') {
    return renderAnalyticsView();
  }

  // Default dashboard view
  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {user?.firstName} {user?.lastName}!
            </h2>
            <p className="text-blue-100 text-lg mb-4">
              {user?.university || 'Your Institution'} - Hackathon Management
            </p>
            <p className="text-blue-50 max-w-2xl">
              Create and manage hackathon events for your institution. 
              Access all the tools you need to organize successful hackathons.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/app/institution-dashboard/hackathons/create')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Hackathon
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app/institution-dashboard')}
              className="flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold">Hackathon Management Tools</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/hackathons/create')}
            >
              <Plus className="h-6 w-6" />
              <span className="font-medium">Create Hackathon</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/hackathons/teams')}
            >
              <Users className="h-6 w-6" />
              <span className="font-medium">Team Management</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/hackathons/judging')}
            >
              <Award className="h-6 w-6" />
              <span className="font-medium">Judging System</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/app/institution-dashboard/hackathons/analytics')}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">Analytics</span>
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hackathons</p>
                  <p className="text-2xl font-bold">{stats.totalHackathons}</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Events</p>
                  <p className="text-2xl font-bold">{stats.activeHackathons}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold">Hackathon Management Tools</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center gap-2 ${
                    action.available ? 'hover:scale-105' : 'opacity-75'
                  }`}
                  onClick={() => action.available && navigate(action.link)}
                  disabled={!action.available}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Recent Hackathons */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Hackathons</h2>
            <Button onClick={() => navigate('/app/institution-dashboard/hackathons/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardBody>
        
        <div className="space-y-4">
          {hackathons.map((hackathon) => (
            <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{hackathon.title}</h3>
                      <Badge className={getStatusColor(hackathon.status)}>
                        {getStatusText(hackathon.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{hackathon.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(hackathon.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Participants</p>
                          <p className="text-sm text-muted-foreground">{hackathon.participants}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Teams</p>
                          <p className="text-sm text-muted-foreground">{hackathon.teams}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Prize Pool</p>
                          <p className="text-sm text-muted-foreground">{hackathon.prizePool}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hackathon.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/app/institution-dashboard/hackathons/${hackathon.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/app/institution-dashboard/hackathons/${hackathon.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        </CardBody>
      </Card>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Performance Overview</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Submission Rate</h4>
              <div className="flex items-center gap-2">
                <Progress value={stats?.completionRate || 0} className="flex-1" />
                <span className="text-sm font-medium">{stats?.completionRate || 0}%</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Average Score</h4>
              <div className="flex items-center gap-2">
                <Progress value={((stats?.averageScore || 0) / 5) * 100} className="flex-1" />
                <span className="text-sm font-medium">{stats?.averageScore || 0}/5</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Active Events</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${((stats?.activeHackathons || 0) / (stats?.totalHackathons || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats?.activeHackathons || 0}/{stats?.totalHackathons || 0}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

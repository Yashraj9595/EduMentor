import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageCircle,
  BarChart3,
  Eye,
  Edit,
  Plus,
  Download,
  Send,
  User
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Project {
  _id: string;
  title: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'draft' | 'submitted' | 'in_progress' | 'under_review' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  progress: number;
  lastActivity: string;
}

interface DiaryEntry {
  _id: string;
  projectId: string;
  student: {
    firstName: string;
    lastName: string;
  };
  project: {
    title: string;
  };
  title: string;
  content: string;
  entryType: 'daily' | 'weekly' | 'milestone' | 'review';
  status: 'draft' | 'submitted' | 'approved' | 'needs_revision';
  createdAt: string;
  isLocked: boolean;
}

interface Review {
  _id: string;
  projectId: string;
  student: {
    firstName: string;
    lastName: string;
  };
  project: {
    title: string;
  };
  title: string;
  reviewType: 'proposal' | 'mid_term' | 'final' | 'custom';
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  overallScore?: number;
  maxScore: number;
}

interface Milestone {
  _id: string;
  projectId: string;
  student: {
    firstName: string;
    lastName: string;
  };
  project: {
    title: string;
  };
  title: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  weight: number;
}

export const MentorDiaryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'diary' | 'reviews' | 'milestones'>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockProjects: Project[] = [
        {
          _id: '1',
          title: 'AI-Powered Healthcare Assistant',
          student: {
            _id: 'student1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com'
          },
          status: 'in_progress',
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-06-15T00:00:00Z',
          progress: 65,
          lastActivity: '2024-01-20T10:30:00Z'
        },
        {
          _id: '2',
          title: 'E-commerce Platform with ML Recommendations',
          student: {
            _id: 'student2',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@email.com'
          },
          status: 'in_progress',
          startDate: '2024-01-10T00:00:00Z',
          endDate: '2024-05-10T00:00:00Z',
          progress: 45,
          lastActivity: '2024-01-19T14:20:00Z'
        },
        {
          _id: '3',
          title: 'IoT Smart Home System',
          student: {
            _id: 'student3',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@email.com'
          },
          status: 'under_review',
          startDate: '2023-12-01T00:00:00Z',
          endDate: '2024-03-01T00:00:00Z',
          progress: 85,
          lastActivity: '2024-01-18T16:45:00Z'
        }
      ];

      const mockDiaryEntries: DiaryEntry[] = [
        {
          _id: '1',
          projectId: '1',
          student: { firstName: 'Sarah', lastName: 'Johnson' },
          project: { title: 'AI-Powered Healthcare Assistant' },
          title: 'Week 2 - Database Implementation Complete',
          content: 'Successfully implemented the database schema and created all necessary tables. Started working on the API endpoints.',
          entryType: 'weekly',
          status: 'submitted',
          createdAt: '2024-01-20T10:30:00Z',
          isLocked: false
        },
        {
          _id: '2',
          projectId: '2',
          student: { firstName: 'Mike', lastName: 'Chen' },
          project: { title: 'E-commerce Platform with ML Recommendations' },
          title: 'Daily Update - Frontend Development',
          content: 'Completed the user authentication flow and started working on the product catalog interface.',
          entryType: 'daily',
          status: 'approved',
          createdAt: '2024-01-19T14:20:00Z',
          isLocked: true
        },
        {
          _id: '3',
          projectId: '3',
          student: { firstName: 'Emily', lastName: 'Davis' },
          project: { title: 'IoT Smart Home System' },
          title: 'Milestone Review - Hardware Integration',
          content: 'Completed the hardware integration and testing phase. All sensors are working correctly.',
          entryType: 'milestone',
          status: 'needs_revision',
          createdAt: '2024-01-18T16:45:00Z',
          isLocked: false
        }
      ];

      const mockReviews: Review[] = [
        {
          _id: '1',
          projectId: '1',
          student: { firstName: 'Sarah', lastName: 'Johnson' },
          project: { title: 'AI-Powered Healthcare Assistant' },
          title: 'Mid-term Review',
          reviewType: 'mid_term',
          scheduledDate: '2024-02-15T10:00:00Z',
          status: 'scheduled',
          maxScore: 100
        },
        {
          _id: '2',
          projectId: '2',
          student: { firstName: 'Mike', lastName: 'Chen' },
          project: { title: 'E-commerce Platform with ML Recommendations' },
          title: 'Proposal Review',
          reviewType: 'proposal',
          scheduledDate: '2024-01-25T14:00:00Z',
          status: 'completed',
          overallScore: 85,
          maxScore: 100
        },
        {
          _id: '3',
          projectId: '3',
          student: { firstName: 'Emily', lastName: 'Davis' },
          project: { title: 'IoT Smart Home System' },
          title: 'Final Review',
          reviewType: 'final',
          scheduledDate: '2024-02-28T09:00:00Z',
          status: 'scheduled',
          maxScore: 100
        }
      ];

      const mockMilestones: Milestone[] = [
        {
          _id: '1',
          projectId: '1',
          student: { firstName: 'Sarah', lastName: 'Johnson' },
          project: { title: 'AI-Powered Healthcare Assistant' },
          title: 'Database Design Complete',
          type: 'implementation',
          dueDate: '2024-01-25T00:00:00Z',
          status: 'completed',
          weight: 25
        },
        {
          _id: '2',
          projectId: '2',
          student: { firstName: 'Mike', lastName: 'Chen' },
          project: { title: 'E-commerce Platform with ML Recommendations' },
          title: 'API Development',
          type: 'implementation',
          dueDate: '2024-02-15T00:00:00Z',
          status: 'in_progress',
          weight: 30
        },
        {
          _id: '3',
          projectId: '3',
          student: { firstName: 'Emily', lastName: 'Davis' },
          project: { title: 'IoT Smart Home System' },
          title: 'Hardware Testing',
          type: 'testing',
          dueDate: '2024-01-20T00:00:00Z',
          status: 'overdue',
          weight: 20
        }
      ];

      setProjects(mockProjects);
      setDiaryEntries(mockDiaryEntries);
      setReviews(mockReviews);
      setMilestones(mockMilestones);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
      case 'submitted':
        return 'text-blue-600 bg-blue-100';
      case 'overdue':
      case 'needs_revision':
        return 'text-red-600 bg-red-100';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
      case 'needs_revision':
        return <AlertTriangle className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${project.student.firstName} ${project.student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Mentor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Monitor and manage student projects and diary entries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Review
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'in_progress').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold">{milestones.filter(m => m.status === 'overdue').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'projects', label: 'Projects', icon: Target },
            { id: 'diary', label: 'Diary Entries', icon: BookOpen },
            { id: 'reviews', label: 'Reviews', icon: MessageCircle },
            { id: 'milestones', label: 'Milestones', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {diaryEntries.slice(0, 5).map((entry) => (
                  <div key={entry._id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.student.firstName} {entry.student.lastName}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{entry.project.title}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{entry.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                          {getStatusIcon(entry.status)}
                          {entry.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Upcoming Reviews */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Upcoming Reviews</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {reviews.filter(r => r.status === 'scheduled').slice(0, 3).map((review) => (
                  <div key={review._id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {review.student.firstName} {review.student.lastName} • {review.project.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(review.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.scheduledDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects or students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <Card key={project._id}>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {project.student.firstName} {project.student.lastName}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {project.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last activity: {new Date(project.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'diary' && (
        <div className="space-y-4">
          {diaryEntries.map((entry) => (
            <Card key={entry._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{entry.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {getStatusIcon(entry.status)}
                        {entry.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span>{entry.student.firstName} {entry.student.lastName}</span>
                      <span>•</span>
                      <span>{entry.project.title}</span>
                      <span>•</span>
                      <span>{entry.entryType}</span>
                      <span>•</span>
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{entry.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{review.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {getStatusIcon(review.status)}
                        {review.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span>{review.student.firstName} {review.student.lastName}</span>
                      <span>•</span>
                      <span>{review.project.title}</span>
                      <span>•</span>
                      <span>{review.reviewType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(review.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    {review.overallScore !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Score: {review.overallScore}/{review.maxScore}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(review.overallScore / review.maxScore) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {getStatusIcon(milestone.status)}
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span>{milestone.student.firstName} {milestone.student.lastName}</span>
                      <span>•</span>
                      <span>{milestone.project.title}</span>
                      <span>•</span>
                      <span>{milestone.type}</span>
                      <span>•</span>
                      <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Weight: {milestone.weight}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

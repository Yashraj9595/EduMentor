import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar, 
  CheckCircle,
  Clock,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  Send,
  Archive,
  User,
  Plus,
  Edit3,
  Lightbulb,
  Upload
  } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'under_review' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  progress: number;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProblemStatement {
  _id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  projectCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemForm, setProblemForm] = useState({
    title: '',
    description: '',
    category: 'Technology',
    technologies: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced'
  });

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
    {
      icon: Lightbulb,
      title: 'Problem Statements',
      description: 'Post new problem statements for students',
      status: 'Available',
      color: 'bg-blue-500',
      link: '#',
      onClick: () => setShowProblemForm(true),
    },
  ];

  useEffect(() => {
    fetchMentorProjects();
    fetchProblemStatements();
  }, []);

  const fetchMentorProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<ApiResponse<Project[]>>('/projects/mentor-projects');
      if (response.data && response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching mentor projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemStatements = async () => {
    try {
      setLoading(true);
      // Fetch mentor's problem statements from the backend
      const response = await apiService.get<ApiResponse<ProblemStatement[]>>('/problem-statements/mentor');
      if (response.data && response.data.success) {
        setProblemStatements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching problem statements:', error);
      // Fallback to mock data if API fails
      const mockProblemStatements: ProblemStatement[] = [
        {
          _id: '1',
          title: 'AI-Powered Healthcare Assistant',
          description: 'Develop an intelligent healthcare assistant that can analyze symptoms and provide preliminary diagnoses.',
          category: 'Healthcare',
          technologies: ['Python', 'TensorFlow', 'React'],
          difficulty: 'advanced',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          postedBy: { _id: user?._id || '', firstName: user?.firstName || '', lastName: user?.lastName || '' },
          isActive: true,
          projectCount: 3
        },
        {
          _id: '2',
          title: 'Smart City Traffic Management',
          description: 'Create a system to optimize traffic flow in urban areas using real-time data analysis.',
          category: 'IoT',
          technologies: ['Node.js', 'MongoDB', 'React Native'],
          difficulty: 'intermediate',
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-10T14:20:00Z',
          postedBy: { _id: user?._id || '', firstName: user?.firstName || '', lastName: user?.lastName || '' },
          isActive: true,
          projectCount: 2
        }
      ];
      setProblemStatements(mockProblemStatements);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemStatementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit the new problem statement to the backend
      const response = await apiService.post<ApiResponse<ProblemStatement>>('/problem-statements', {
        title: problemForm.title,
        description: problemForm.description,
        category: problemForm.category,
        technologies: problemForm.technologies.split(',').map(t => t.trim()).filter(t => t),
        difficulty: problemForm.difficulty
      });
      
      if (response.data && response.data.success) {
        // Add the new problem statement to the list
        setProblemStatements([...problemStatements, response.data.data]);
      }
      
      setShowProblemForm(false);
      setProblemForm({
        title: '',
        description: '',
        category: 'Technology',
        technologies: '',
        difficulty: 'intermediate'
      });
    } catch (error) {
      console.error('Error submitting problem statement:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'archived':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <TrendingUp className="w-4 h-4" />;
      case 'under_review':
        return <Clock className="w-4 h-4" />;
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'submitted':
        return <Send className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${project.studentId.firstName} ${project.studentId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getProjectStats = () => {
    return {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in_progress').length,
      underReview: projects.filter(p => p.status === 'under_review').length,
      needsAttention: projects.filter(p => p.status === 'under_review').length
    };
  };

  const stats = getProjectStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <div className="mt-4 flex flex-wrap gap-2">
          <a 
            href="/app/mentor-profile" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            <User className="w-4 h-4" />
            View My Profile
          </a>
          <button 
            onClick={() => setShowProblemForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post Problem Statement
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned Students</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.underReview}</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Problem Statements</p>
                <p className="text-2xl font-bold text-foreground">{problemStatements.length}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-blue-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Your Assigned Projects</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardBody className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No projects match your search criteria.' 
                  : 'You don\'t have any assigned projects yet.'}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project._id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {project.studentId.firstName.charAt(0)}{project.studentId.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {project.studentId.firstName} {project.studentId.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {project.studentId.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Problem Statements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Problem Statements</h2>
          <Button onClick={() => setShowProblemForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {problemStatements.length === 0 ? (
          <Card>
            <CardBody className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Problem Statements</h3>
              <p className="text-muted-foreground mb-4">
                You haven't posted any problem statements yet. Create one to help students find interesting projects.
              </p>
              <Button onClick={() => setShowProblemForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Problem Statement
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemStatements.map((problem) => (
              <Card key={problem._id}>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-card-foreground">{problem.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {problem.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.technologies.map((tech, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mentor Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Mentor Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isAvailable = feature.status === 'Available';
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden hover:shadow-lg transition-shadow ${isAvailable ? 'cursor-pointer' : ''}`}
                onClick={feature.onClick}
              >
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
                      {isAvailable && feature.link && !feature.onClick && (
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
              { action: 'Problem statement posted', item: 'IoT Smart Agriculture', time: '3 days ago', type: 'problem' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'review' ? 'bg-primary' :
                    activity.type === 'student' ? 'bg-secondary' :
                    activity.type === 'feedback' ? 'bg-green-500' :
                    activity.type === 'session' ? 'bg-accent' :
                    'bg-blue-500'
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

      {/* Problem Statement Form Modal */}
      {showProblemForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Post New Problem Statement</h2>
              <button 
                onClick={() => setShowProblemForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleProblemStatementSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={problemForm.title}
                  onChange={(e) => setProblemForm({...problemForm, title: e.target.value})}
                  placeholder="Enter problem statement title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={problemForm.description}
                  onChange={(e) => setProblemForm({...problemForm, description: e.target.value})}
                  placeholder="Describe the problem statement in detail"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={problemForm.category}
                    onChange={(e) => setProblemForm({...problemForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="IoT">IoT</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={problemForm.difficulty}
                    onChange={(e) => setProblemForm({...problemForm, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                <Input
                  value={problemForm.technologies}
                  onChange={(e) => setProblemForm({...problemForm, technologies: e.target.value})}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowProblemForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Post Problem Statement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
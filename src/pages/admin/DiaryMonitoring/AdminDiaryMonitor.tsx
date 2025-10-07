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
  TrendingUp,
  BarChart3,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  User,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Activity,
  Zap,
  Award,
  Shield,
  Database,
  PieChart,
  LineChart,
  TrendingDown,
  RefreshCw,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Key,
  Star,
  Heart,
  Flame,
  Crown,
  Gem,
  Sword,
  Rocket,
  Lightbulb,
  Code,
  Cpu,
  Globe as GlobeIcon,
  Gift,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface ProjectActivity {
  _id: string;
  projectId: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    college: string;
  };
  mentor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    title: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  activityType: 'diary_entry' | 'review' | 'milestone' | 'feedback' | 'submission';
  description: string;
  timestamp: string;
  status: 'active' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface MentorActivity {
  _id: string;
  mentor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalReviews: number;
  completedReviews: number;
  averageScore: number;
  lastActivity: string;
  responseTime: number; // in hours
  studentSatisfaction: number; // 1-5 rating
}

interface StudentProgress {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    college: string;
  };
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalDiaryEntries: number;
  averageScore: number;
  streak: number;
  badges: number;
  points: number;
  level: number;
  lastActivity: string;
}

interface SystemStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalStudents: number;
  totalMentors: number;
  totalDiaryEntries: number;
  totalReviews: number;
  averageProjectDuration: number;
  averageScore: number;
  systemUptime: number;
  activeUsers: number;
}

export const AdminDiaryMonitor: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'mentors' | 'students' | 'reports'>('overview');
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [mentorActivities, setMentorActivities] = useState<MentorActivity[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockActivities: ProjectActivity[] = [
        {
          _id: '1',
          projectId: '1',
          student: {
            _id: 'student1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            college: 'MIT'
          },
          mentor: {
            _id: 'mentor1',
            firstName: 'Dr. Michael',
            lastName: 'Smith',
            email: 'michael.smith@email.com'
          },
          project: {
            title: 'AI-Powered Healthcare Assistant',
            status: 'in_progress',
            startDate: '2024-01-15T00:00:00Z',
            endDate: '2024-06-15T00:00:00Z'
          },
          activityType: 'diary_entry',
          description: 'Submitted weekly progress update',
          timestamp: '2024-01-20T10:30:00Z',
          status: 'completed',
          priority: 'medium'
        },
        {
          _id: '2',
          projectId: '2',
          student: {
            _id: 'student2',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@email.com',
            college: 'Stanford'
          },
          mentor: {
            _id: 'mentor2',
            firstName: 'Prof. Emily',
            lastName: 'Davis',
            email: 'emily.davis@email.com'
          },
          project: {
            title: 'E-commerce Platform with ML Recommendations',
            status: 'in_progress',
            startDate: '2024-01-10T00:00:00Z',
            endDate: '2024-05-10T00:00:00Z'
          },
          activityType: 'review',
          description: 'Mid-term review completed with score 85/100',
          timestamp: '2024-01-19T14:20:00Z',
          status: 'completed',
          priority: 'high'
        },
        {
          _id: '3',
          projectId: '3',
          student: {
            _id: 'student3',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@email.com',
            college: 'Berkeley'
          },
          mentor: {
            _id: 'mentor3',
            firstName: 'Dr. James',
            lastName: 'Wilson',
            email: 'james.wilson@email.com'
          },
          project: {
            title: 'IoT Smart Home System',
            status: 'under_review',
            startDate: '2023-12-01T00:00:00Z',
            endDate: '2024-03-01T00:00:00Z'
          },
          activityType: 'milestone',
          description: 'Hardware integration milestone overdue',
          timestamp: '2024-01-18T16:45:00Z',
          status: 'overdue',
          priority: 'urgent'
        }
      ];

      const mockMentorActivities: MentorActivity[] = [
        {
          _id: '1',
          mentor: {
            _id: 'mentor1',
            firstName: 'Dr. Michael',
            lastName: 'Smith',
            email: 'michael.smith@email.com'
          },
          totalProjects: 12,
          activeProjects: 8,
          completedProjects: 4,
          totalReviews: 24,
          completedReviews: 20,
          averageScore: 87.5,
          lastActivity: '2024-01-20T10:30:00Z',
          responseTime: 2.5,
          studentSatisfaction: 4.8
        },
        {
          _id: '2',
          mentor: {
            _id: 'mentor2',
            firstName: 'Prof. Emily',
            lastName: 'Davis',
            email: 'emily.davis@email.com'
          },
          totalProjects: 15,
          activeProjects: 10,
          completedProjects: 5,
          totalReviews: 30,
          completedReviews: 28,
          averageScore: 89.2,
          lastActivity: '2024-01-19T14:20:00Z',
          responseTime: 1.8,
          studentSatisfaction: 4.9
        },
        {
          _id: '3',
          mentor: {
            _id: 'mentor3',
            firstName: 'Dr. James',
            lastName: 'Wilson',
            email: 'james.wilson@email.com'
          },
          totalProjects: 8,
          activeProjects: 6,
          completedProjects: 2,
          totalReviews: 16,
          completedReviews: 14,
          averageScore: 82.1,
          lastActivity: '2024-01-18T16:45:00Z',
          responseTime: 4.2,
          studentSatisfaction: 4.2
        }
      ];

      const mockStudentProgress: StudentProgress[] = [
        {
          _id: '1',
          student: {
            _id: 'student1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            college: 'MIT'
          },
          totalProjects: 3,
          activeProjects: 2,
          completedProjects: 1,
          totalDiaryEntries: 15,
          averageScore: 88.5,
          streak: 7,
          badges: 8,
          points: 450,
          level: 5,
          lastActivity: '2024-01-20T10:30:00Z'
        },
        {
          _id: '2',
          student: {
            _id: 'student2',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@email.com',
            college: 'Stanford'
          },
          totalProjects: 2,
          activeProjects: 1,
          completedProjects: 1,
          totalDiaryEntries: 12,
          averageScore: 85.2,
          streak: 5,
          badges: 6,
          points: 320,
          level: 4,
          lastActivity: '2024-01-19T14:20:00Z'
        },
        {
          _id: '3',
          student: {
            _id: 'student3',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@email.com',
            college: 'Berkeley'
          },
          totalProjects: 4,
          activeProjects: 2,
          completedProjects: 2,
          totalDiaryEntries: 20,
          averageScore: 91.3,
          streak: 12,
          badges: 12,
          points: 680,
          level: 7,
          lastActivity: '2024-01-18T16:45:00Z'
        }
      ];

      const mockSystemStats: SystemStats = {
        totalProjects: 45,
        activeProjects: 28,
        completedProjects: 17,
        totalStudents: 32,
        totalMentors: 12,
        totalDiaryEntries: 156,
        totalReviews: 89,
        averageProjectDuration: 4.2,
        averageScore: 86.7,
        systemUptime: 99.8,
        activeUsers: 24
      };

      setActivities(mockActivities);
      setMentorActivities(mockMentorActivities);
      setStudentProgress(mockStudentProgress);
      setSystemStats(mockSystemStats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'diary_entry':
        return <BookOpen className="w-4 h-4" />;
      case 'review':
        return <MessageCircle className="w-4 h-4" />;
      case 'milestone':
        return <Target className="w-4 h-4" />;
      case 'feedback':
        return <ThumbsUp className="w-4 h-4" />;
      case 'submission':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${activity.student.firstName} ${activity.student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || activity.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
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
            <Shield className="w-8 h-8 text-primary" />
            Admin Diary Monitor
          </h1>
          <p className="text-muted-foreground mt-2">Monitor all project activities, mentor performance, and student progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Stats */}
      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{systemStats.totalProjects}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{systemStats.activeUsers}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{systemStats.averageScore}%</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                  <p className="text-2xl font-bold">{systemStats.systemUptime}%</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'activities', label: 'Activities', icon: Activity },
            { id: 'mentors', label: 'Mentors', icon: Users },
            { id: 'students', label: 'Students', icon: User },
            { id: 'reports', label: 'Reports', icon: PieChart }
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
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity._id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{activity.student.firstName} {activity.student.lastName}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{activity.project.title}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Mentor Performance */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Top Performing Mentors</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {mentorActivities.slice(0, 3).map((mentor) => (
                  <div key={mentor._id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{mentor.mentor.firstName} {mentor.mentor.lastName}</h4>
                        <p className="text-sm text-muted-foreground">{mentor.activeProjects} active projects</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{mentor.averageScore}% avg score</p>
                      <p className="text-xs text-muted-foreground">{mentor.studentSatisfaction}/5 satisfaction</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-border rounded-md"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity._id}>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getActivityIcon(activity.activityType)}
                        </div>
                        <h3 className="text-lg font-semibold">{activity.description}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{activity.student.firstName} {activity.student.lastName}</span>
                        </div>
                        <span>•</span>
                        <span>{activity.student.college}</span>
                        <span>•</span>
                        <span>{activity.project.title}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{activity.mentor.firstName} {activity.mentor.lastName}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="space-y-4">
          {mentorActivities.map((mentor) => (
            <Card key={mentor._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold">{mentor.mentor.firstName} {mentor.mentor.lastName}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Projects</p>
                        <p className="text-xl font-bold">{mentor.totalProjects}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Projects</p>
                        <p className="text-xl font-bold">{mentor.activeProjects}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                        <p className="text-xl font-bold">{mentor.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <p className="text-xl font-bold">{mentor.studentSatisfaction}/5</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Response Time: {mentor.responseTime}h</span>
                      <span>•</span>
                      <span>Last Activity: {new Date(mentor.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-4">
          {studentProgress.map((student) => (
            <Card key={student._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold">{student.student.firstName} {student.student.lastName}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Level</p>
                        <p className="text-xl font-bold">{student.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Points</p>
                        <p className="text-xl font-bold">{student.points}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Badges</p>
                        <p className="text-xl font-bold">{student.badges}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Streak</p>
                        <p className="text-xl font-bold">{student.streak} days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{student.student.college}</span>
                      <span>•</span>
                      <span>Avg Score: {student.averageScore}%</span>
                      <span>•</span>
                      <span>Last Activity: {new Date(student.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="text-center py-12">
          <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Reports</h3>
          <p className="text-muted-foreground">Advanced reporting and analytics will be implemented here</p>
        </div>
      )}
    </div>
  );
};



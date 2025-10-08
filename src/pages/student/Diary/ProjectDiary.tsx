import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Target, 
  Trophy, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  TrendingUp,
  Award,
  Edit,
  Eye,
  Lock,
  FolderOpen,
  Save,
  X
  } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../contexts/ToastContext';

import { useParams, useNavigate } from 'react-router-dom';
import { ProgressTimeline } from '../../../components/Gamification/ProgressTimeline';
import { apiService } from '../../../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  mentorId?: string;
}

interface DiaryEntry {
  _id: string;
  projectId: string;
  title: string;
  content: string;
  entryType: 'daily' | 'weekly' | 'milestone' | 'review';
  status: 'draft' | 'submitted' | 'approved' | 'needs_revision';
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  mentorComments?: string;
  isLocked: boolean;
  attachments: Array<{
    filename: string;
    url: string;
    type: 'image' | 'document' | 'code' | 'video';
  }>;
}

interface Milestone {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  weight: number;
  progress: number;
  deliverables: Array<{
    name: string;
    isCompleted: boolean;
  }>;
}

interface ProjectProgress {
  projectId: string;
  overallProgress: number;
  completedMilestones: number;
  totalMilestones: number;
  completedTasks: number;
  totalTasks: number;
  level: number;
  totalPoints: number;
  nextLevelPoints: number;
  badges: Array<{
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    points: number;
    earnedAt: string;
  }>;
  streak: number;
  weeklyGoal: number;
}

// Define the response type for API calls
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const ProjectDiary: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState<'diary' | 'milestones' | 'progress' | 'reviews'>('diary');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [progressTimeline, setProgressTimeline] = useState<any[]>([]);
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [showProjectSelector, setShowProjectSelector] = useState(!projectId);

  useEffect(() => {
    console.log('=== PROJECT DIARY INITIALIZATION ===');
    console.log('Project ID from params:', projectId);
    console.log('Show project selector:', showProjectSelector);
    console.log('Current user from localStorage:', localStorage.getItem('user'));
    console.log('Access token present:', !!localStorage.getItem('accessToken'));
    
    fetchUserProjects();
    fetchUserRole();
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const fetchUserRole = async () => {
    try {
      const response = await apiService.get<ApiResponse<{ role: string }>>('/auth/profile');
      if (response.data && response.data.data) {
        setUserRole(response.data.data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchUserProjects = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING USER PROJECTS ===');
      console.log('API Base URL:', apiService.baseURL);
      console.log('Auth token present:', !!apiService.getAuthToken());
      
      const response = await apiService.get<ApiResponse<any[]>>('/projects/my-projects');
      console.log('=== API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      console.log('Response message:', response.message);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('=== PROJECTS DATA ===');
        console.log('Raw projects data:', response.data);
        console.log('Number of projects:', response.data.length);
        
        const userProjects = response.data.map((project: any) => ({
          _id: project._id,
          title: project.title,
          description: project.description,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          progress: project.metrics?.progress || 0,
          mentorId: project.mentorId
        }));
        
        console.log('=== MAPPED PROJECTS ===');
        console.log('Mapped projects:', userProjects);
        console.log('Projects count:', userProjects.length);
        
        setProjects(userProjects);
        
        // If no specific project ID, select the first active project
        if (!projectId && userProjects.length > 0) {
          const activeProject = userProjects.find((p: any) => p.status === 'in_progress') || userProjects[0];
          console.log('Selected active project:', activeProject);
          setSelectedProject(activeProject);
          fetchProjectData(activeProject._id);
        }
      } else {
        console.log('=== NO PROJECTS FOUND ===');
        console.log('Response data:', response.data);
        console.log('Setting projects to empty array');
        setProjects([]);
      }
    } catch (error) {
      console.error('=== ERROR FETCHING PROJECTS ===');
      console.error('Error details:', error);
      console.error('Error message:', (error as Error).message);
      showError('Error', 'Failed to fetch projects');
    } finally {
      setLoading(false);
      console.log('=== FETCH COMPLETE ===');
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      setLoading(true);
      
      // Fetch diary entries
      try {
        const diaryResponse = await apiService.get<any>(`/diary/entries/${projectId}?page=1&limit=10`);
        console.log('Diary response:', diaryResponse);
        
        // Handle different response structures
        let entries = [];
        if (diaryResponse.data && Array.isArray(diaryResponse.data)) {
          // Direct array response
          entries = diaryResponse.data;
        } else if (diaryResponse.data && diaryResponse.data.entries) {
          // Nested entries object
          entries = diaryResponse.data.entries;
        } else if (diaryResponse.data && diaryResponse.data.data && diaryResponse.data.data.entries) {
          // Double nested data.entries object
          entries = diaryResponse.data.data.entries;
        }
        
        const formattedEntries = entries.map((entry: any) => ({
          _id: entry._id,
          projectId: entry.projectId,
          title: entry.title,
          content: entry.content,
          entryType: entry.entryType,
          status: entry.status,
          createdAt: entry.createdAt,
          submittedAt: entry.submittedAt,
          approvedAt: entry.approvedAt,
          mentorComments: entry.mentorFeedback?.comment,
          isLocked: entry.status === 'approved',
          attachments: entry.attachments || []
        }));
        setDiaryEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching diary entries:', error);
        showError('Error', 'Failed to fetch diary entries');
      }

      // Fetch project details
      try {
        const projectResponse = await apiService.get<ApiResponse<any>>(`/projects/${projectId}`);
        if (projectResponse.data && projectResponse.data.data) {
          const project = projectResponse.data.data;
          setSelectedProject({
            _id: project._id,
            title: project.title,
            description: project.description,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            progress: project.metrics?.progress || 0,
            mentorId: project.mentorId
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        showError('Error', 'Failed to fetch project details');
      }

      // Fetch project progress timeline
      try {
        const progressResponse = await apiService.get<ApiResponse<any>>(`/diary/progress-timeline/${projectId}`);
        if (progressResponse.data && progressResponse.data.data) {
          const progressData = progressResponse.data.data;
          setProgressTimeline(progressData.timelineSteps || []);
        }
      } catch (error) {
        console.error('Error fetching project progress:', error);
        // Use mock data if API fails
        const mockTimelineSteps: any[] = [
          {
            id: 'planning',
            title: 'Project Planning',
            description: 'Define project scope, objectives, and create detailed project plan with timelines and deliverables.',
            icon: 'User',
            status: 'completed',
            color: 'from-blue-500 to-teal-500',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-700',
            progress: 100,
            points: 100,
            gems: 5,
            level: 1,
            specialEffect: 'sparkle'
          },
          {
            id: 'research',
            title: 'Research & Analysis',
            description: 'Conduct thorough research, gather requirements, and analyze existing solutions and best practices.',
            icon: 'Lightbulb',
            status: 'completed',
            color: 'from-teal-500 to-green-500',
            borderColor: 'border-teal-500',
            textColor: 'text-teal-700',
            progress: 100,
            points: 150,
            gems: 8,
            level: 2,
            specialEffect: 'gem'
          },
          {
            id: 'design',
            title: 'Design & Architecture',
            description: 'Create system architecture, database design, and user interface mockups and prototypes.',
            icon: 'Clock',
            status: 'completed',
            color: 'from-green-500 to-lime-500',
            borderColor: 'border-green-500',
            textColor: 'text-green-700',
            progress: 100,
            points: 200,
            gems: 12,
            level: 3,
            specialEffect: 'diamond'
          },
          {
            id: 'development',
            title: 'Development Phase',
            description: 'Implement core functionality, develop APIs, and build the main application features.',
            icon: 'Settings',
            status: 'current',
            color: 'from-lime-500 to-yellow-500',
            borderColor: 'border-lime-500',
            textColor: 'text-lime-700',
            progress: 65,
            points: 300,
            gems: 15,
            level: 4,
            specialEffect: 'crown'
          },
          {
            id: 'testing',
            title: 'Testing & Review',
            description: 'Conduct comprehensive testing, code reviews, and mentor feedback sessions.',
            icon: 'Users',
            status: 'upcoming',
            color: 'from-yellow-500 to-orange-500',
            borderColor: 'border-yellow-500',
            textColor: 'text-yellow-700',
            progress: 0,
            points: 400,
            gems: 20,
            level: 5,
            specialEffect: 'trophy'
          }
        ];
        setProgressTimeline(mockTimelineSteps);
      }

      // Mock data for milestones and progress (in a real app, fetch from API)
      const mockMilestones: Milestone[] = [
        {
          _id: '1',
          projectId,
          title: 'Project Planning & Setup',
          description: 'Complete project planning and development environment setup',
          type: 'planning',
          dueDate: '2024-01-31',
          status: 'completed',
          weight: 20,
          progress: 100,
          deliverables: [
            { name: 'Project Charter', isCompleted: true },
            { name: 'Technical Requirements', isCompleted: true },
            { name: 'Development Environment Setup', isCompleted: true }
          ]
        },
        {
          _id: '2',
          projectId,
          title: 'Database Design & Implementation',
          description: 'Design and implement the database schema',
          type: 'development',
          dueDate: '2024-02-15',
          status: 'completed',
          weight: 25,
          progress: 100,
          deliverables: [
            { name: 'Database Schema Design', isCompleted: true },
            { name: 'Database Implementation', isCompleted: true },
            { name: 'Data Migration Scripts', isCompleted: true }
          ]
        },
        {
          _id: '3',
          projectId,
          title: 'API Development',
          description: 'Develop RESTful API endpoints',
          type: 'development',
          dueDate: '2024-03-15',
          status: 'in_progress',
          weight: 30,
          progress: 60,
          deliverables: [
            { name: 'Authentication API', isCompleted: true },
            { name: 'User Management API', isCompleted: true },
            { name: 'Project Management API', isCompleted: false }
          ]
        }
      ];

      const mockProgress: ProjectProgress = {
        projectId,
        overallProgress: 65,
        completedMilestones: 2,
        totalMilestones: 3,
        completedTasks: 8,
        totalTasks: 12,
        level: 3,
        totalPoints: 1250,
        nextLevelPoints: 1500,
        badges: [
          {
            name: 'First Steps',
            description: 'Created your first diary entry',
            icon: '🌟',
            earnedAt: '2024-01-15T10:30:00Z'
          },
          {
            name: 'Milestone Master',
            description: 'Completed your first milestone',
            icon: '🏆',
            earnedAt: '2024-01-25T16:45:00Z'
          }
        ],
        achievements: [
          {
            title: 'Consistent Logger',
            description: 'Logged entries for 7 consecutive days',
            points: 100,
            earnedAt: '2024-01-22T09:00:00Z'
          }
        ],
        streak: 7,
        weeklyGoal: 5
      };

      setMilestones(mockMilestones);
      setProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching project data:', error);
      showError('Error', 'Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowProjectSelector(false);
    fetchProjectData(project._id);
    navigate(`/app/student/diary/${project._id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'needs_revision': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-3 h-3" />;
      case 'submitted': return <Clock className="w-3 h-3" />;
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'needs_revision': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  // Check if user can edit progress timeline
  const canEditProgressTimeline = () => {
    if (!selectedProject || !userRole) return false;
    
    // Mentors can always edit
    if (userRole === 'mentor') return true;
    
    // Admins can edit only if no mentor is assigned
    if (userRole === 'admin' && !selectedProject.mentorId) return true;
    
    return false;
  };

  // Save progress timeline changes
  const saveProgressTimeline = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await apiService.put<ApiResponse<any>>(`/diary/progress-timeline/${selectedProject._id}`, {
        timelineSteps: progressTimeline
      });
      
      if (response.data && response.data.success) {
        showSuccess('Success', 'Progress timeline updated successfully');
        setIsEditingTimeline(false);
      } else {
        showError('Error', response.data?.message || 'Failed to update progress timeline');
      }
    } catch (error) {
      console.error('Error updating progress timeline:', error);
      showError('Error', 'Failed to update progress timeline');
    }
  };

  // Update timeline step status
  const updateTimelineStepStatus = (stepId: string, newStatus: 'completed' | 'current' | 'upcoming') => {
    setProgressTimeline(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      )
    );
  };

  if (loading && !selectedProject) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showProjectSelector) {
    console.log('Showing project selector, projects:', projects);
    console.log('Projects length:', projects.length);
    console.log('Loading state:', loading);
    
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Project Diary</h1>
              <p className="text-muted-foreground">Select a project to view and manage its diary</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any projects yet. Create your first project to start using the diary feature.
              </p>
              <Button 
                onClick={() => navigate('/app/student/projects/create')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project) => (
                <Card key={project._id} className="hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col" onClick={() => handleProjectSelect(project)}>
                  <CardBody className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 break-words">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 break-words">{project.description}</p>
                      </div>
                      <FolderOpen className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
                    </div>
                    
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Project Diary</h1>
            <p className="text-muted-foreground">
              {selectedProject?.title} • {selectedProject?.progress}% Complete
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate(`/app/student/progress/${selectedProject?._id}`)}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              View Progress
            </Button>
            <Button 
              onClick={() => navigate(`/app/student/diary/${selectedProject?._id}/new`)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{progress.overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{progress.completedMilestones}/{progress.totalMilestones}</div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{progress.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{progress.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[
              { id: 'diary', label: 'Diary Entries', icon: BookOpen },
              { id: 'milestones', label: 'Milestones', icon: Target },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'reviews', label: 'Reviews', icon: MessageCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
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
                        <p className="text-sm text-muted-foreground mb-3">
                          {new Date(entry.createdAt).toLocaleDateString()} • {entry.entryType}
                        </p>
                        <p className="text-foreground mb-4">{entry.content}</p>
                        
                        {entry.mentorComments && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-800 text-sm">Mentor Feedback</span>
                            </div>
                            <p className="text-blue-700 text-sm">{entry.mentorComments}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!entry.isLocked && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-2"
                            onClick={() => navigate(`/app/student/diary/${selectedProject?._id}/edit/${entry._id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="p-2">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {entry.isLocked && (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
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
                        <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground mb-4">{milestone.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                          <span>Weight: {milestone.weight}%</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {milestone.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Project Progress Timeline
                    </h3>
                    {canEditProgressTimeline() && (
                      <div className="flex gap-2">
                        {isEditingTimeline ? (
                          <>
                            <Button 
                              onClick={() => setIsEditingTimeline(false)}
                              variant="secondary"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                            <Button 
                              onClick={saveProgressTimeline}
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => setIsEditingTimeline(true)}
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Timeline
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  <ProgressTimeline 
                    projectId={selectedProject?._id}
                    currentStep={2}
                    animated={true}
                    showProgress={true}
                    steps={progressTimeline}
                  />
                  
                  {isEditingTimeline && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">Edit Timeline Steps</h4>
                      <div className="space-y-3">
                        {progressTimeline.map((step) => (
                          <div key={step.id} className="flex items-center justify-between p-3 bg-background rounded">
                            <span>{step.title}</span>
                            <select
                              value={step.status}
                              onChange={(e) => updateTimelineStepStatus(step.id, e.target.value as any)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="completed">Completed</option>
                              <option value="current">Current</option>
                              <option value="upcoming">Upcoming</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Achievements
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {progress?.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Award className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-green-600 font-medium">+{achievement.points} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    Badges
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {progress?.badges.map((badge, index) => (
                      <div key={index} className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl mb-2">{badge.icon}</div>
                        <h4 className="font-medium text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'reviews' && (
            <Card>
              <CardBody className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">Reviews will appear here when your mentor schedules them.</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
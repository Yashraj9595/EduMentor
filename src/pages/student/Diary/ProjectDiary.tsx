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
  } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

import { useParams, useNavigate } from 'react-router-dom';
import { ProgressTimeline } from '../../../components/Gamification/ProgressTimeline';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
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

export const ProjectDiary: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'diary' | 'milestones' | 'progress' | 'reviews'>('diary');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [showProjectSelector, setShowProjectSelector] = useState(!projectId);

  useEffect(() => {
    fetchUserProjects();
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const fetchUserProjects = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockProjects: Project[] = [
        {
          _id: '1',
          title: 'EduMentor Platform Development',
          description: 'A comprehensive educational platform for students and mentors',
          status: 'in_progress',
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          progress: 65
        },
        {
          _id: '2',
          title: 'AI-Powered Learning Assistant',
          description: 'Machine learning system for personalized education',
          status: 'in_progress',
          startDate: '2024-02-01',
          endDate: '2024-08-31',
          progress: 30
        },
        {
          _id: '3',
          title: 'Mobile App for Campus Events',
          description: 'React Native app for university event management',
          status: 'completed',
          startDate: '2023-09-01',
          endDate: '2023-12-31',
          progress: 100
        }
      ];
      setProjects(mockProjects);
      
      // If no specific project ID, select the first active project
      if (!projectId && mockProjects.length > 0) {
        const activeProject = mockProjects.find(p => p.status === 'in_progress') || mockProjects[0];
        setSelectedProject(activeProject);
        fetchProjectData(activeProject._id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockDiaryEntries: DiaryEntry[] = [
        {
          _id: '1',
          projectId,
          title: 'Week 1 - Project Setup Complete',
          content: 'Successfully set up the development environment and completed initial research. Started working on the database design and API structure.',
          entryType: 'weekly',
          status: 'approved',
          createdAt: '2024-01-15T10:30:00Z',
          submittedAt: '2024-01-15T10:30:00Z',
          approvedAt: '2024-01-16T14:20:00Z',
          mentorComments: 'Great start! The database design looks solid. Keep up the good work.',
          isLocked: false,
          attachments: []
        },
        {
          _id: '2',
          projectId,
          title: 'Daily Update - API Implementation',
          content: 'Implemented the core API endpoints for user authentication and project management. Fixed several bugs in the authentication middleware.',
          entryType: 'daily',
          status: 'submitted',
          createdAt: '2024-01-20T09:15:00Z',
          submittedAt: '2024-01-20T09:15:00Z',
          isLocked: false,
          attachments: []
        },
        {
          _id: '3',
          projectId,
          title: 'Milestone: Database Schema Complete',
          content: 'Completed the database schema design and implemented all the necessary models. Ready to move on to the API development phase.',
          entryType: 'milestone',
          status: 'approved',
          createdAt: '2024-01-25T16:45:00Z',
          submittedAt: '2024-01-25T16:45:00Z',
          approvedAt: '2024-01-26T10:30:00Z',
          mentorComments: 'Excellent work on the database design. The schema is well-structured and scalable.',
          isLocked: false,
          attachments: []
        }
      ];

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

      setDiaryEntries(mockDiaryEntries);
      setMilestones(mockMilestones);
      setProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching project data:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showProjectSelector) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Project Diary</h1>
              <p className="text-muted-foreground">Select a project to view and manage its diary</p>
            </div>
          </div>

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
            <Button onClick={() => {}} className="flex items-center gap-2">
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
                        <Button variant="ghost" size="sm" className="p-2">
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

        {activeTab === 'progress' && progress && (
          <div className="space-y-6">
            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Project Progress Timeline
                </h3>
              </CardHeader>
              <CardBody>
                <ProgressTimeline 
                  projectId={selectedProject?._id}
                  currentStep={2}
                  animated={true}
                  showProgress={true}
                />
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
                  {progress.achievements.map((achievement, index) => (
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
                  {progress.badges.map((badge, index) => (
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
  );
};
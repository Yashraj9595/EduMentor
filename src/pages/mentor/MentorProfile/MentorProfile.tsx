import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkIcon, 
  Edit3, 
  Award,
  FileText,
  Github,
  Linkedin,
  Trophy,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Activity,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/api';
import { useParams } from 'react-router-dom';

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  studentName: string;
  status: string;
  progress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  timestamp: string;
  details?: string;
}

interface AnalyticsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  avgProjectScore: number;
  totalStudents: number;
  activeStudents: number;
  reviewsCompleted: number;
  avgReviewScore: number;
}

interface MentorProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  university: string;
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  achievements: Achievement[];
  activityLogs: ActivityLog[];
  analytics: AnalyticsData;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const MentorProfile: React.FC = () => {
  const { user } = useAuth();
  const { mentorId } = useParams<{ mentorId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'analytics'>('profile');
  
  // Profile data state
  const [profileData, setProfileData] = useState<MentorProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    university: '',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: '',
    skills: [],
    certifications: [],
    projects: [],
    achievements: [],
    activityLogs: [],
    analytics: {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      avgProjectScore: 0,
      totalStudents: 0,
      activeStudents: 0,
      reviewsCompleted: 0,
      avgReviewScore: 0
    }
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    university: '',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, [mentorId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // If viewing another mentor's profile
      if (mentorId && mentorId !== user?._id) {
        const response = await apiService.get<ApiResponse<MentorProfileData>>(`/api/v1/users/${mentorId}/profile`);
        if (response.data && response.data.success) {
          setProfileData(response.data.data);
          setFormData({
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            phone: response.data.data.phone,
            department: response.data.data.department,
            university: response.data.data.university,
            bio: response.data.data.bio,
            github: response.data.data.github,
            linkedin: response.data.data.linkedin,
            portfolio: response.data.data.portfolio
          });
        }
      } else {
        // Viewing own profile
        const response = await apiService.get<ApiResponse<MentorProfileData>>('/api/v1/users/profile');
        if (response.data && response.data.success) {
          setProfileData(response.data.data);
          setFormData({
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            phone: response.data.data.phone,
            department: response.data.data.department,
            university: response.data.data.university,
            bio: response.data.data.bio,
            github: response.data.data.github,
            linkedin: response.data.data.linkedin,
            portfolio: response.data.data.portfolio
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Fallback to mock data if API fails
      const mockProfileData: MentorProfileData = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '+1 (555) 987-6543',
        department: 'Computer Science',
        university: 'University of Technology',
        bio: 'Experienced mentor with 10+ years in software development and AI research. Passionate about guiding the next generation of tech innovators.',
        github: 'https://github.com/mentor-username',
        linkedin: 'https://linkedin.com/in/mentor-username',
        portfolio: 'https://mentor-portfolio.example.com',
        skills: [
          { id: '1', name: 'Machine Learning', level: 'expert' },
          { id: '2', name: 'Python', level: 'expert' },
          { id: '3', name: 'Data Science', level: 'advanced' },
          { id: '4', name: 'React', level: 'intermediate' },
          { id: '5', name: 'Cloud Architecture', level: 'advanced' },
          { id: '6', name: 'Project Management', level: 'expert' }
        ],
        certifications: [
          { 
            id: '1', 
            title: 'Google Cloud Professional Data Engineer', 
            issuer: 'Google Cloud', 
            date: '2025-06-15',
            url: 'https://example.com/cert1'
          },
          { 
            id: '2', 
            title: 'AWS Certified Solutions Architect', 
            issuer: 'Amazon Web Services', 
            date: '2025-03-20',
            url: 'https://example.com/cert2'
          }
        ],
        projects: [
          { 
            id: '1', 
            title: 'AI-Powered Recommendation System', 
            description: 'Building a recommendation engine for e-commerce platforms', 
            technologies: ['Python', 'TensorFlow', 'React'], 
            studentName: 'Alex Johnson',
            status: 'in_progress',
            progress: 75
          },
          { 
            id: '2', 
            title: 'Blockchain Voting System', 
            description: 'Secure and transparent voting system using blockchain technology', 
            technologies: ['Solidity', 'React', 'Node.js'], 
            studentName: 'Sarah Williams',
            status: 'completed',
            progress: 100
          }
        ],
        achievements: [
          { 
            id: '1', 
            title: 'Mentor of the Year 2025', 
            description: 'Recognized for outstanding mentorship and student success', 
            date: '2025-12-15'
          },
          { 
            id: '2', 
            title: '100+ Students Mentored', 
            description: 'Reached milestone of mentoring over 100 students', 
            date: '2025-11-01'
          }
        ],
        activityLogs: [
          { 
            id: '1', 
            action: 'Approved project', 
            entityType: 'project', 
            entityId: 'proj1', 
            entityTitle: 'AI Healthcare Assistant', 
            timestamp: '2025-10-07T14:30:00Z'
          },
          { 
            id: '2', 
            action: 'Completed review', 
            entityType: 'review', 
            entityId: 'rev1', 
            entityTitle: 'Web Development Project', 
            timestamp: '2025-10-07T10:15:00Z'
          }
        ],
        analytics: {
          totalProjects: 12,
          activeProjects: 5,
          completedProjects: 7,
          avgProjectScore: 87.5,
          totalStudents: 23,
          activeStudents: 5,
          reviewsCompleted: 18,
          avgReviewScore: 4.2
        }
      };
      
      setProfileData(mockProfileData);
      setFormData({
        firstName: mockProfileData.firstName,
        lastName: mockProfileData.lastName,
        phone: mockProfileData.phone,
        department: mockProfileData.department,
        university: mockProfileData.university,
        bio: mockProfileData.bio,
        github: mockProfileData.github,
        linkedin: mockProfileData.linkedin,
        portfolio: mockProfileData.portfolio
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.put<ApiResponse<MentorProfileData>>('/api/v1/users/profile', formData);
      if (response.data && response.data.success) {
        setProfileData({
          ...profileData,
          ...response.data.data
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-gray-100 text-gray-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <User className="w-8 h-8 text-primary" />
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p className="text-muted-foreground mt-2">Mentor Profile</p>
        </div>
        {(!mentorId || mentorId === user?._id) && (
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">University</label>
                      <Input
                        value={formData.university}
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        value={profileData.email}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub</label>
                      <Input
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn</label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Portfolio</label>
                      <Input
                        value={formData.portfolio}
                        onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-muted-foreground">{profileData.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{profileData.department}, {profileData.university}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {profileData.github && (
                      <a 
                        href={profileData.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-muted hover:bg-muted/80"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profileData.linkedin && (
                      <a 
                        href={profileData.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-muted hover:bg-muted/80"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {profileData.portfolio && (
                      <a 
                        href={profileData.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-muted hover:bg-muted/80"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Skills & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Skills & Expertise
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {profileData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Certifications
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          Issued {new Date(cert.date).toLocaleDateString()}
                        </span>
                        {cert.url && (
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Projects */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Assigned Projects
              </h2>
            </CardHeader>
            <CardBody>
              {profileData.projects.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects assigned yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.projects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Student: {project.studentName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{project.progress}%</span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Achievements
              </h2>
            </CardHeader>
            <CardBody>
              {profileData.achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData.achievements.map((achievement) => (
                    <div key={achievement.id} className="border border-border rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(achievement.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
          </CardHeader>
          <CardBody>
            {profileData.activityLogs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profileData.activityLogs.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <div className="mt-1">
                      {activity.entityType === 'project' ? (
                        <FileText className="w-5 h-5 text-primary" />
                      ) : activity.entityType === 'review' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.action} {activity.entityTitle}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.entityType === 'project' ? 'Project' : 
                         activity.entityType === 'review' ? 'Review' : 
                         'Activity'}
                      </p>
                      {activity.details && (
                        <p className="text-sm mt-2">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{profileData.analytics.totalProjects}</p>
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
                    <p className="text-2xl font-bold">{profileData.analytics.completedProjects}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="text-2xl font-bold">{profileData.analytics.totalStudents}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold">{profileData.analytics.avgProjectScore}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Project Distribution
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Active Projects</span>
                      <span className="text-sm font-medium">{profileData.analytics.activeProjects}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${(profileData.analytics.activeProjects / profileData.analytics.totalProjects) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Completed Projects</span>
                      <span className="text-sm font-medium">{profileData.analytics.completedProjects}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${(profileData.analytics.completedProjects / profileData.analytics.totalProjects) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Review Analytics
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Reviews Completed</span>
                      <span className="text-sm font-medium">{profileData.analytics.reviewsCompleted}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-purple-500 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Avg. Review Score</span>
                      <span className="text-sm font-medium">{profileData.analytics.avgReviewScore}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-yellow-500 rounded-full" 
                        style={{ width: `${(profileData.analytics.avgReviewScore / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
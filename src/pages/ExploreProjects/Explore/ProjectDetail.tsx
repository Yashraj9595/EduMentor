import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  ExternalLink,
  Calendar,
  User,
  Tag,
  Code,
  Globe,
  Play,
  ThumbsUp,
  Clock,
  Award,
  Github,
  Link as LinkIcon,
  Download,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

interface ProjectDetail {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  videoUrl?: string;
  gallery?: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    caption?: string;
  }>;
  studentId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    college?: string;
    year?: string;
    bio?: string;
    skills?: string[];
    socialLinks?: {
      github?: string;
      linkedin?: string;
      portfolio?: string;
    };
  };
  teamMembers?: Array<{
    email: string;
    role: string;
  }>;
  technologies: string[];
  category?: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'under_review' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  tags: string[];
  repositoryLink?: string;
  liveUrl?: string;
  documentationUrl?: string;
  objectives?: string[];
  challenges?: string[];
  achievements?: string[];
  featured?: boolean;
  awards?: Array<{
    title: string;
    organization: string;
    date: string;
    description: string;
  }>;
  problemStatement?: string;
  deliverables?: string[];
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

export const ExploreProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'team' | 'gallery' | 'comments'>('overview');
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectDetail();
      fetchComments();
    }
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      // Fetch real project data from API
      const response = await fetch(`/api/v1/projects/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProject(data.data);
    } catch (error) {
      console.error('Error fetching project detail:', error);
      // Fallback to mock data if API fails
      const mockProject: ProjectDetail = {
        _id: id || '1',
        title: 'AI-Powered Healthcare Assistant',
        description: 'An intelligent healthcare assistant that helps patients with symptom analysis and appointment scheduling using machine learning algorithms.',
        longDescription: `This project represents a comprehensive healthcare technology solution that leverages artificial intelligence to revolutionize patient care. The system combines advanced machine learning algorithms with user-friendly interfaces to provide accurate symptom analysis, intelligent appointment scheduling, and personalized health recommendations.

The core innovation lies in our proprietary natural language processing model that can understand and interpret patient symptoms with remarkable accuracy. By analyzing thousands of medical cases and symptoms, our AI can provide preliminary assessments while always recommending professional medical consultation.

The platform includes multiple components: a web application for healthcare providers, a mobile app for patients, and an admin dashboard for system management. We've integrated real-time data processing, secure patient data handling, and seamless communication between patients and healthcare providers.

Our team spent over 6 months developing this solution, conducting extensive research in medical AI, collaborating with healthcare professionals, and testing with real patient scenarios. The result is a robust, scalable platform that has the potential to improve healthcare accessibility and efficiency.`,
        thumbnail: '/api/placeholder/800/450',
        videoUrl: 'https://youtube.com/watch?v=example1',
        studentId: {
          _id: 'student1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@example.com',
          college: 'Massachusetts Institute of Technology',
          year: 'Senior',
          bio: 'Passionate about using technology to solve real-world healthcare challenges. I specialize in machine learning and have a strong background in medical informatics.',
          skills: ['Machine Learning', 'Python', 'React', 'Node.js', 'Medical AI'],
          socialLinks: {
            github: 'https://github.com/sarahjohnson',
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            portfolio: 'https://sarahjohnson.dev'
          }
        },
        teamMembers: [
          { email: 'sarah.johnson@example.com', role: 'Lead Developer & ML Engineer' },
          { email: 'mike.chen@example.com', role: 'Backend Developer' },
          { email: 'emily.davis@example.com', role: 'UI/UX Designer & Frontend Developer' }
        ],
        technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
        category: 'AI/ML',
        status: 'completed',
        startDate: '2024-01-15T10:30:00Z',
        endDate: '2024-02-20T14:22:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-02-20T14:22:00Z',
        duration: 36,
        metrics: {
          views: 1250,
          likes: 89,
          comments: 23,
          bookmarks: 45
        },
        tags: ['healthcare', 'ai', 'machine-learning', 'react', 'python', 'medical-tech'],
        repositoryLink: 'https://github.com/sarah/healthcare-assistant',
        liveUrl: 'https://healthcare-assistant.demo.com',
        documentationUrl: 'https://docs.healthcare-assistant.com',
        objectives: [
          'Develop an AI system that can accurately analyze patient symptoms',
          'Create an intuitive user interface for both patients and healthcare providers',
          'Implement secure data handling and privacy protection',
          'Build a scalable platform that can handle thousands of concurrent users',
          'Integrate with existing healthcare management systems'
        ],
        challenges: [
          'Ensuring medical accuracy while maintaining AI model performance',
          'Handling sensitive patient data with strict privacy requirements',
          'Creating a user-friendly interface for users of all technical levels',
          'Integrating with various healthcare system APIs and databases',
          'Scaling the system to handle high user loads during peak times'
        ],
        achievements: [
          'Achieved 94% accuracy in symptom analysis compared to medical professionals',
          'Reduced appointment scheduling time by 60%',
          'Successfully deployed to 3 pilot healthcare facilities',
          'Received positive feedback from 200+ beta users',
          'Published research paper in Medical AI Journal'
        ],
        featured: true,
        awards: [
          {
            title: 'Best Healthcare Innovation',
            organization: 'MIT Healthcare Hackathon',
            date: '2024-02-15',
            description: 'Awarded for outstanding innovation in healthcare technology'
          },
          {
            title: 'AI Excellence Award',
            organization: 'Tech Innovation Summit',
            date: '2024-01-20',
            description: 'Recognized for exceptional use of AI in solving real-world problems'
          }
        ]
      };
      setProject(mockProject);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      // Mock comments - in real app, fetch from API
      const mockComments: Comment[] = [
        {
          id: '1',
          author: {
            id: 'user1',
            name: 'Dr. Michael Smith',
            avatar: '/api/placeholder/40/40',
            role: 'Medical Professional'
          },
          content: 'This is an impressive application of AI in healthcare! The symptom analysis accuracy is remarkable. Have you considered integrating with electronic health records?',
          createdAt: '2024-02-18T10:30:00Z',
          likes: 12,
          replies: [
            {
              id: '1-1',
              author: {
                id: 'student1',
                name: 'Sarah Johnson',
                avatar: '/api/placeholder/40/40',
                role: 'Project Creator'
              },
              content: 'Thank you Dr. Smith! Yes, EHR integration is definitely on our roadmap for the next phase.',
              createdAt: '2024-02-18T11:15:00Z',
              likes: 3,
              replies: []
            }
          ]
        },
        {
          id: '2',
          author: {
            id: 'user2',
            name: 'Alex Rodriguez',
            avatar: '/api/placeholder/40/40',
            role: 'Student'
          },
          content: 'Amazing work! The UI/UX design is really intuitive. What was the most challenging part of the development process?',
          createdAt: '2024-02-17T14:22:00Z',
          likes: 8,
          replies: []
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (project) {
      setProject({
        ...project,
        metrics: {
          views: project.metrics?.views || 0,
          likes: isLiked ? (project.metrics?.likes || 0) - 1 : (project.metrics?.likes || 0) + 1,
          comments: project.metrics?.comments || 0,
          bookmarks: project.metrics?.bookmarks || 0
        }
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (project) {
      setProject({
        ...project,
        metrics: {
          views: project.metrics?.views || 0,
          likes: project.metrics?.likes || 0,
          comments: project.metrics?.comments || 0,
          bookmarks: isBookmarked ? (project.metrics?.bookmarks || 0) - 1 : (project.metrics?.bookmarks || 0) + 1
        }
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: user._id,
        name: user.firstName + ' ' + user.lastName,
        avatar: '/api/placeholder/40/40',
        role: 'Student'
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Project not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/app/student/explore')}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">
            by {project.studentId ? `${project.studentId.firstName} ${project.studentId.lastName}` : 'Unknown Student'} 
            {project.studentId?.college && ` • ${project.studentId.college}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video/Thumbnail */}
          <Card>
            <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Play className="w-8 h-8 text-black ml-1" />
                  </button>
                </div>
              )}
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured Project
                  </span>
                </div>
              )}
            </div>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{project.metrics?.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTime(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{project.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                      isLiked ? 'bg-red-100 text-red-600' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{project.metrics?.likes || 0}</span>
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                      isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span>{project.metrics?.bookmarks || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{project.longDescription}</p>
              </div>

              {/* Technologies */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      <Code className="w-3 h-3" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <div className="flex space-x-1 border-b border-border">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'objectives', label: 'Objectives' },
                  { id: 'team', label: 'Team' },
                  { id: 'gallery', label: 'Gallery' },
                  { id: 'comments', label: 'Comments' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardBody>
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Project Overview</h3>
                    <p className="text-gray-700 leading-relaxed">{project.longDescription}</p>
                  </div>
                  
                  {project.awards && project.awards.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Awards & Recognition</h3>
                      <div className="space-y-3">
                        {project.awards?.map((award, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                            <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">{award.title}</h4>
                              <p className="text-sm text-muted-foreground">{award.organization}</p>
                              <p className="text-xs text-muted-foreground">{formatTime(award.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'objectives' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Project Objectives</h3>
                    <ul className="space-y-2">
                      {project.objectives?.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Key Challenges</h3>
                    <ul className="space-y-2">
                      {project.challenges?.map((challenge, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Key Achievements</h3>
                    <ul className="space-y-2">
                      {project.achievements?.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-6">
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mb-4">Team Members ({project.teamMembers.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{member.email}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No team members added yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Project Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery?.map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/20">
                              <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                <Play className="w-6 h-6 text-black ml-1" />
                              </button>
                            </div>
                          )}
                        </div>
                        {item.caption && (
                          <p className="text-sm text-muted-foreground mt-2">{item.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-6">
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this project..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        Post Comment
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-b border-border pb-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{comment.author.name}</h4>
                              <span className="text-xs text-muted-foreground">{comment.author.role}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{comment.likes}</span>
                              </button>
                              <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-11 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <img
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-xs">{reply.author.name}</h4>
                                    <span className="text-xs text-muted-foreground">{reply.author.role}</span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{formatTime(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700 text-xs">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Project Creator</h3>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {project.studentId ? `${project.studentId.firstName} ${project.studentId.lastName}` : 'Unknown Student'}
                  </h4>
                  <p className="text-sm text-muted-foreground">{project.studentId?.college || 'No college info'}</p>
                  <p className="text-xs text-muted-foreground">{project.studentId?.year || 'No year info'}</p>
                </div>
              </div>
              {project.studentId?.bio && (
                <p className="text-sm text-gray-700 mb-4">{project.studentId.bio}</p>
              )}
              {project.studentId?.skills && project.studentId.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.studentId.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {project.studentId?.socialLinks && (
                <div className="flex gap-2">
                  {project.studentId.socialLinks.github && (
                    <a
                      href={project.studentId.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.studentId.socialLinks.linkedin && (
                    <a
                      href={project.studentId.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.studentId.socialLinks.portfolio && (
                    <a
                      href={project.studentId.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Project Links */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Project Links</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {project.repositoryLink && (
                <a
                  href={project.repositoryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="flex-1">View Source Code</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span className="flex-1">Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.documentationUrl && (
                <a
                  href={project.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="flex-1">Documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </CardBody>
          </Card>

          {/* Project Stats */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Project Statistics</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Views</span>
                  <span className="font-medium">{project.metrics?.views || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Likes</span>
                  <span className="font-medium">{project.metrics?.likes || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Comments</span>
                  <span className="font-medium">{project.metrics?.comments || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bookmarks</span>
                  <span className="font-medium">{project.metrics?.bookmarks || 0}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

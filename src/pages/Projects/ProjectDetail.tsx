import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  Edit3,
  Upload,
  Link as LinkIcon,
  Tag,
  ArrowLeft,
  BookOpen,
  Trash2,
  Share2,
  Download,
  ExternalLink,
  Globe,
  Github,
  Play,
  Code,
  Award,
  Star,
  Heart,
  Bookmark,
  MoreHorizontal,
  Plus,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  X
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { YouTubeVideo } from '../../components/YouTubeVideo';
import { ExpandableDescription } from '../../components/ExpandableDescription';

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  problemStatement: string;
  status: string;
  startDate: string;
  endDate: string;
  tags: string[];
  technologies: string[];
  category: string;
  repositoryLink?: string;
  liveUrl?: string;
  documentationUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  deliverables: string[];
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
    email: string;
  }>;
  mentorName?: string;
  mentorId?: string;
  createdAt: string;
  updatedAt: string;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  featured?: boolean;
  awards?: Array<{
    title: string;
    organization: string;
    date: string;
    description: string;
  }>;
}

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'team' | 'deliverables' | 'links'>('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await apiService.get<any>(`/projects/${projectId}`);
      setProject(response.data || null);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error('Error fetching project:', err);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML': return <Code className="w-4 h-4" />;
      case 'IoT': return <Globe className="w-4 h-4" />;
      case 'Blockchain': return <Code className="w-4 h-4" />;
      case 'Web Development': return <Globe className="w-4 h-4" />;
      case 'Mobile': return <Globe className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
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

  const handleDelete = async () => {
    if (!project) return;
    
    try {
      setDeleting(true);
      await apiService.delete(`/projects/${project._id}`);
      navigate('/app/student/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: project?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await apiService.get('/users/mentors');
      if (response.success && response.data) {
        setMentors(response.data as any[]);
      } else {
        console.error('Failed to fetch mentors:', response.message);
        // Fallback to empty array
        setMentors([]);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      // Fallback to empty array
      setMentors([]);
    }
  };

  const handleRequestMentorClick = () => {
    setShowMentorModal(true);
    fetchMentors();
  };

  const handleMentorSelect = async (mentor: any) => {
    if (!project) return;
    
    try {
      // Update the project with the selected mentor
      const response = await apiService.put(`/projects/${project._id}`, {
        mentorId: mentor.id
      });
      
      if (response.success) {
        // Refresh the project data
        fetchProject(project._id);
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowMentorModal(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error requesting mentor:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/app/student/projects')}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              {getCategoryIcon(project.category)}
              <span className="text-sm text-muted-foreground">{project.category}</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(project.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            {project.featured && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 font-medium">Featured</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-md transition-colors ${
              isLiked ? 'bg-red-100 text-red-600' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-md transition-colors ${
              isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video and Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Video Section - Takes 3 columns */}
        <div className="lg:col-span-3">
          {project.videoUrl && project.videoUrl.trim() !== '' ? (
            <div className="relative aspect-video max-h-120 bg-black rounded-lg overflow-hidden">
              <YouTubeVideo 
                videoUrl={project.videoUrl} 
                title={project.title}
                className="rounded-lg h-full"
              />
            </div>
          ) : (
            <div className="relative aspect-video max-h-120 bg-muted rounded-lg overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="text-center text-muted-foreground">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <p className="text-xs">No video available</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Stats and Info Sidebar - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-3">
          {/* Project Statistics */}
          {project.metrics && (
            <Card>
              <CardHeader className="pb-2">
                <h2 className="text-base font-semibold">Project Statistics</h2>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="font-medium">{project.metrics.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Likes</span>
                    <span className="font-medium">{project.metrics.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Comments</span>
                    <span className="font-medium">{project.metrics.comments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bookmarks</span>
                    <span className="font-medium">{project.metrics.bookmarks}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Project Information */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-base font-semibold">Project Information</h2>
            </CardHeader>
            <CardBody className="pt-0 space-y-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <p className="text-sm">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                <p className="text-sm">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-3">
          {/* Tabs */}
          <Card>
            <CardHeader>
              <div className="flex space-x-1 border-b border-border">
                {[
                  { id: 'overview', label: 'Overview', icon: FileText },
                  { id: 'timeline', label: 'Timeline', icon: Calendar },
                  { id: 'team', label: 'Team', icon: User },
                  { id: 'deliverables', label: 'Deliverables', icon: Upload },
                  { id: 'links', label: 'Links', icon: LinkIcon }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardBody>
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <ExpandableDescription 
                      description={project.description}
                      maxLines={3}
                    />
                  </div>
                  
                  {project.longDescription && (
                    <div>
                      <h3 className="font-semibold mb-2">Detailed Description</h3>
                      <ExpandableDescription 
                        description={project.longDescription}
                        maxLines={5}
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold mb-2">Problem Statement</h3>
                    <ExpandableDescription 
                      description={project.problemStatement}
                      maxLines={4}
                    />
                  </div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
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
                  )}

                  {/* Awards */}
                  {project.awards && project.awards.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Awards & Recognition</h3>
                      <div className="space-y-3">
                        {project.awards.map((award, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                            <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">{award.title}</h4>
                              <p className="text-sm text-muted-foreground">{award.organization}</p>
                              <p className="text-xs text-muted-foreground">{new Date(award.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2">Start Date</h3>
                      <p className="text-2xl font-bold text-primary">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2">End Date</h3>
                      <p className="text-2xl font-bold text-primary">
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Duration</h3>
                    <p className="text-lg">
                      {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-3">
                  {/* Project Creator */}
                  <div>
                    <h3 className="font-semibold mb-3">Project Creator</h3>
                    <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Project Owner</h4>
                        <p className="text-sm text-muted-foreground">Student</p>
                      </div>
                    </div>
                  </div>

                  {/* Mentor Information */}
                  {project.mentorName && (
                    <div>
                      <h3 className="font-semibold mb-3">Mentor</h3>
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-green-800">{project.mentorName}</h4>
                          <p className="text-sm text-green-600">Project Mentor</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Members */}
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mb-3">Team Members ({project.teamMembers.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.teamMembers.map((member) => (
                          <div key={member.id} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold mb-3">Team Members</h3>
                      <div className="text-center py-8 border border-dashed border-border rounded-lg">
                        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No team members added yet</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deliverables' && (
                <div className="space-y-4">
                  {project.deliverables.length > 0 ? (
                    <div className="space-y-3">
                      {project.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="flex-1">{deliverable}</span>
                          <button className="text-primary hover:text-primary/80">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No deliverables uploaded yet</p>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-4">
                    <button className="flex items-center gap-2 text-primary hover:text-primary/80">
                      <Plus className="w-4 h-4" />
                      Upload New Deliverable
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.repositoryLink && (
                      <a
                        href={project.repositoryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">Repository</h4>
                          <p className="text-sm text-muted-foreground">View source code</p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">Live Demo</h4>
                          <p className="text-sm text-muted-foreground">View live project</p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    
                    {project.documentationUrl && (
                      <a
                        href={project.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">Documentation</h4>
                          <p className="text-sm text-muted-foreground">View documentation</p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    
                    {project.videoUrl && (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">Demo Video</h4>
                          <p className="text-sm text-muted-foreground">Watch project demo</p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Tags */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Actions</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <button 
                onClick={() => navigate(`/app/student/projects/${project._id}/edit`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Project
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" />
                Upload Deliverable
              </button>
              <a 
                href={`/app/student/diary/${project._id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Open Project Diary
              </a>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
            </CardBody>
          </Card>

          {/* Mentor Request Card */}
          {project && !project.mentorId && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Request Mentor</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a mentor to guide you on this project.
                </p>
                <button 
                  onClick={handleRequestMentorClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Select Mentor
                </button>
              </CardBody>
            </Card>
          )}

          {project && project.mentorId && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Mentor Assigned</h2>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {project.mentorName || 'Mentor Assigned'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your mentor for this project
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}


        </div>
      </div>

      {/* Mentor Selection Modal */}
      {showMentorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select a Mentor</h3>
              <button 
                onClick={() => setShowMentorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              <p className="text-muted-foreground mb-4">
                Choose a mentor to guide you on your project:
              </p>
              
              {mentors.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium mb-1">No mentors available</h4>
                  <p className="text-sm text-muted-foreground">
                    Please try again later.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mentors.map((mentor) => (
                    <div 
                      key={mentor.id}
                      onClick={() => handleMentorSelect(mentor)}
                      className="border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                         <div className="flex-1">
                           <h4 className="font-medium">{mentor.name}</h4>
                           <p className="text-sm text-muted-foreground">{mentor.department}</p>
                           {mentor.bio && (
                             <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                               {mentor.bio}
                             </p>
                           )}
                           <div className="flex items-center gap-2 mt-2">
                             <div className="flex items-center gap-1">
                               <Star className="w-4 h-4 text-yellow-500 fill-current" />
                               <span className="text-sm">{mentor.rating}</span>
                             </div>
                             <div className="flex flex-wrap gap-1">
                               {mentor.expertise.slice(0, 3).map((exp: any, index: number) => (
                                <span 
                                  key={index} 
                                  className="text-xs bg-muted px-2 py-0.5 rounded-full"
                                >
                                  {exp}
                                </span>
                               ))}
                               {mentor.expertise.length > 3 && (
                                 <span className="text-xs text-muted-foreground">
                                   +{mentor.expertise.length - 3} more
                                 </span>
                               )}
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <button 
                onClick={() => setShowMentorModal(false)}
                className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Delete Project</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{project.title}"? This will permanently remove the project and all its data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Cpu, 
  Zap, 
  Database, 
  Globe, 
  Smartphone, 
  Code,
  Eye,
  Share2,
  Calendar,
  Users,
  Play,
  BookOpen,
  Filter,
  FileText,
  Tag,
  Heart,
  MessageCircle,
  User,
  ExternalLink,
  Bookmark,
  Edit3
  } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  videoUrl?: string;
  status: string;
  startDate: string;
  endDate: string;
  tags: string[];
  technologies: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  mentorName?: string;
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
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
  }>;
  repositoryLink?: string;
  liveUrl?: string;
  documentationUrl?: string;
}

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects...');
      const response = await apiService.get<any>('/projects/my-projects');
      console.log('Projects API response:', response);
      console.log('Projects data:', response.data);
      setProjects(response.data || []);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML': return <Cpu className="w-4 h-4" />;
      case 'IoT': return <Zap className="w-4 h-4" />;
      case 'Blockchain': return <Database className="w-4 h-4" />;
      case 'Web Development': return <Globe className="w-4 h-4" />;
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getTechnologyIcon = (tech: string) => {
    const techIcons: { [key: string]: React.ComponentType<any> } = {
      'Python': Code,
      'React': Globe,
      'Node.js': Code,
      'JavaScript': Code,
      'TypeScript': Code,
      'Arduino': Cpu,
      'AWS': Database,
      'TensorFlow': Cpu,
      'Solidity': Database,
      'Web3.js': Globe,
      'Ethereum': Database
    };
    const Icon = techIcons[tech] || Code;
    return <Icon className="w-3 h-3" />;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'most_viewed':
        return (b.metrics?.views || 0) - (a.metrics?.views || 0);
      case 'most_liked':
        return (b.metrics?.likes || 0) - (a.metrics?.likes || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto min-h-0 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">Manage your academic and hackathon projects</p>
        </div>
        <button
          onClick={() => navigate('/app/student/projects/create')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Create Project
        </button>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search projects, technologies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base min-w-0"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 sm:p-3 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 sm:p-3 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="min-w-0">
            <label className="block text-xs sm:text-sm font-medium mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm min-w-0"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="min-w-0">
            <label className="block text-xs sm:text-sm font-medium mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm min-w-0"
            >
              <option value="all">All Categories</option>
              <option value="AI/ML">AI/ML</option>
              <option value="IoT">IoT</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
          
          <div className="min-w-0">
            <label className="block text-xs sm:text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm min-w-0"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="most_viewed">Most Viewed</option>
              <option value="most_liked">Most Liked</option>
            </select>
          </div>
          
          <div className="flex items-end min-w-0">
            <button className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm min-w-0">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Advanced Filters</span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          Showing {sortedProjects.length} of {projects.length} projects
        </p>
      </div>

      {sortedProjects.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'No projects match your search criteria.' 
                : 'Get started by creating your first project.'}
            </p>
            <button
              onClick={() => navigate('/app/student/projects/create')}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Create Your First Project
            </button>
          </CardBody>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
          : 'space-y-4'
        }>
          {sortedProjects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col overflow-hidden">
              {/* Thumbnail */}
              {project.thumbnail && (
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Play className="w-6 h-6 text-black ml-1" />
                      </button>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              <CardBody className="p-3 sm:p-4 flex-1 flex flex-col min-h-0">
                {/* Project Info */}
                <div className="space-y-2 sm:space-y-3 flex-1 min-h-0">
                  <div className="min-h-0">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1 break-words overflow-hidden">{project.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words overflow-hidden">{project.description}</p>
                  </div>

                  {/* Category and Technologies */}
                  <div className="flex items-center gap-2 mb-2 min-h-0">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground min-w-0">
                      {getCategoryIcon(project.category)}
                      <span className="truncate">{project.category}</span>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 min-h-0">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs truncate max-w-[100px] sm:max-w-[120px]"
                        title={tech}
                      >
                        {getTechnologyIcon(tech)}
                        <span className="truncate">{tech}</span>
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 min-h-0">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground rounded-full text-xs truncate max-w-[100px] sm:max-w-[120px]"
                        title={tag}
                      >
                        <Tag className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{tag}</span>
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  {project.metrics && (
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground min-h-0">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{project.metrics.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{project.metrics.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{project.metrics.comments}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground min-h-0">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>

                  {/* Team Info */}
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground min-h-0">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">{project.teamMembers.length} team member{project.teamMembers.length > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Mentor Info */}
                  {project.mentorName && (
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground min-h-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Mentor: {project.mentorName}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2 pt-2 border-t border-border mt-auto min-h-0">
                    <button 
                      onClick={() => navigate(`/app/student/projects/${project._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm min-w-0"
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden sm:inline truncate">View Project</span>
                      <span className="sm:hidden truncate">View</span>
                    </button>
                    <button 
                      onClick={() => navigate(`/app/student/diary/${project._id}`)}
                      className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm min-w-0"
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden sm:inline truncate">Diary</span>
                    </button>
                    <button className="p-1 sm:p-1.5 sm:p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button className="p-1 sm:p-1.5 sm:p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/app/student/projects/${project._id}/edit`)}
                      className="p-1 sm:p-1.5 sm:p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
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
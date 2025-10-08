import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Heart, 
  MessageCircle, 
  ExternalLink,
  Bookmark,
  Share2,
  Play,
  Image as ImageIcon,
  Code,
  Globe,
  Smartphone,
  Database,
  Cpu,
  Zap,
  Brain,
  Sparkles,
  Plus
} from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { ExpandableDescription } from '../../../components/ExpandableDescription';

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  student: {
    id: string;
    name: string;
    avatar: string;
    college: string;
    year: string;
  };
  team: {
    members: Array<{
      id: string;
      name: string;
      avatar: string;
      role: string;
    }>;
    size: number;
    mentor?: {
      id: string;
      name: string;
      avatar: string;
      role: string;
      email: string;
    } | null;
  };
  technologies: string[];
  category: string;
  status: 'completed' | 'in_progress' | 'showcase';
  createdAt: string;
  updatedAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  tags: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  duration?: string;
  featured: boolean;
}

interface FilterOptions {
  category: string;
  technology: string;
  status: string;
  sortBy: string;
  timeRange: string;
}

export const ExploreProjects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendedProjects, setAiRecommendedProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    technology: 'all',
    status: 'all',
    sortBy: 'trending',
    timeRange: 'all'
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const generateAIRecommendations = () => {
    console.log('generateAIRecommendations called, user:', user);
    if (!user) {
      console.log('No user found, cannot generate recommendations');
      return;
    }

    if (projects.length === 0) {
      console.log('No projects available yet');
      return;
    }

    // Mock user skills and interests based on role and profile
    const userSkills = getUserSkills();
    const userInterests = getUserInterests();
    console.log('User skills:', userSkills);
    console.log('User interests:', userInterests);
    console.log('Available projects:', projects.length);
    
    // Filter and score projects based on user profile
    const scoredProjects = projects.map(project => {
      let score = 0;
      
      // Score based on technology match
      project.technologies.forEach(tech => {
        if (userSkills.includes(tech)) score += 3;
        if (userInterests.includes(tech)) score += 2;
      });
      
      // Score based on category match
      if (userInterests.includes(project.category)) score += 2;
      
      // Score based on project status (prefer completed projects for learning)
      if (project.status === 'completed') score += 1;
      
      // Score based on engagement (popular projects)
      score += Math.log(project.metrics.views + project.metrics.likes) * 0.5;
      
      return { ...project, aiScore: score };
    });
    
    // Sort by AI score and take top 6
    const recommendations = scoredProjects
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 6);
    
    console.log('Generated recommendations:', recommendations);
    setAiRecommendedProjects(recommendations);
  };

  const getUserSkills = () => {
    // Mock user skills based on role and profile
    const baseSkills = ['JavaScript', 'React', 'Node.js'];
    
    if (user?.role === 'student') {
      return [...baseSkills, 'Python', 'HTML', 'CSS'];
    }
    
    return baseSkills;
  };

  const getUserInterests = () => {
    // Mock user interests based on role
    if (user?.role === 'student') {
      return ['AI/ML', 'Web Development', 'Mobile'];
    }
    
    return ['Web Development'];
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects from API...');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.technology !== 'all') queryParams.append('technology', filters.technology);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.sortBy !== 'trending') queryParams.append('sortBy', filters.sortBy);
      queryParams.append('limit', '50');
      
      const queryString = queryParams.toString();
      const endpoint = `/projects/explore${queryString ? `?${queryString}` : ''}`;
      
      console.log('API endpoint:', endpoint);
      
      const response = await apiService.get(endpoint);
      console.log('API response:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log('Raw API data:', response.data);
        
        // Transform the API data to match the expected format
        const transformedProjects = response.data.map((project: any) => ({
          id: project._id,
          title: project.title,
          description: project.description,
          thumbnail: project.thumbnail || 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0',
          videoUrl: project.videoUrl,
    student: {
            id: project.studentId?._id || project.studentId,
            name: project.studentId?.firstName && project.studentId?.lastName 
              ? `${project.studentId.firstName} ${project.studentId.lastName}`
              : 'Unknown Student',
      avatar: '/api/placeholder/40/40',
            college: 'University', // This would need to be added to the user model
            year: 'Student'
    },
    team: {
            members: Array.isArray(project.teamMembers) 
              ? project.teamMembers.map((member: any, index: number) => ({
                  id: `member-${index}`,
                  name: member.email?.split('@')[0] || 'Team Member',
                  avatar: '/api/placeholder/32/32',
                  role: member.role || 'Team Member'
                }))
              : [],
            size: Array.isArray(project.teamMembers) ? project.teamMembers.length : 1,
            mentor: project.mentorId ? {
              id: project.mentorId._id || project.mentorId,
              name: project.mentorId.firstName && project.mentorId.lastName 
                ? `${project.mentorId.firstName} ${project.mentorId.lastName}`
                : 'Mentor',
              avatar: '/api/placeholder/32/32',
              role: 'Mentor',
              email: project.mentorId.email
            } : null
          },
          technologies: project.technologies || [],
          category: project.category || 'Other',
          status: project.status || 'draft',
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          metrics: project.metrics || { views: 0, likes: 0, comments: 0, bookmarks: 0 },
          tags: project.tags || [],
          repositoryUrl: project.repositoryLink,
          liveUrl: project.liveUrl,
          duration: project.startDate && project.endDate 
            ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
            : 'Unknown',
          featured: project.featured || false
        }));
        
        console.log('Transformed projects:', transformedProjects);
        setProjects(transformedProjects);
      } else {
        console.error('API response not successful:', response);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('Invalid data format')) {
        console.log('Database contains invalid data. This might be due to corrupted project records.');
        console.log('Showing fallback data while we fix the database issue...');
        
        // Show some fallback data while we debug
        setProjects([{
          id: 'fallback-1',
          title: 'Sample AI Project',
          description: 'This is a sample project to demonstrate the interface while we fix the database issue.',
          thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0',
          student: {
            id: 'student-1',
            name: 'Sample Student',
            avatar: '/api/placeholder/40/40',
            college: 'University',
            year: 'Student'
          },
          team: {
            members: [{
              id: 'member-1',
              name: 'Team Member',
              avatar: '/api/placeholder/32/32',
              role: 'Developer'
            }],
            size: 1
          },
          technologies: ['React', 'Node.js', 'MongoDB'],
          category: 'Web Development',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: { views: 100, likes: 10, comments: 5, bookmarks: 3 },
          tags: ['web', 'react', 'node'],
          repositoryUrl: 'https://github.com/sample/project',
          liveUrl: 'https://sample-project.com',
          duration: '3 months',
          featured: false
        }]);
      } else if (error instanceof Error && error.message.includes('Route not found')) {
        console.log('Backend server is not running with the new code. Please restart the backend server.');
        console.log('Showing fallback data while we restart the backend...');
        
        // Show some fallback data while we restart the backend
        setProjects([{
          id: 'fallback-2',
          title: 'Backend Restart Required',
          description: 'The backend server needs to be restarted to apply the new code changes. Please restart the backend server.',
          thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0',
          student: {
            id: 'system-1',
            name: 'System Message',
            avatar: '/api/placeholder/40/40',
            college: 'System',
            year: 'Admin'
          },
          team: {
            members: [{
              id: 'admin-1',
              name: 'Admin',
              avatar: '/api/placeholder/32/32',
              role: 'System Administrator'
            }],
            size: 1
          },
          technologies: ['Backend', 'Node.js', 'Express'],
          category: 'System',
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: { views: 1, likes: 0, comments: 0, bookmarks: 0 },
          tags: ['backend', 'restart', 'maintenance'],
          repositoryUrl: '',
          liveUrl: '',
          duration: '1 minute',
          featured: false
        }]);
      } else {
        setProjects([]);
      }
    } finally {
      setLoading(false);
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
                        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || project.category === filters.category;
    const matchesTechnology = filters.technology === 'all' || project.technologies.includes(filters.technology);
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesTechnology && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (filters.sortBy) {
      case 'trending':
        return (b.metrics.views + b.metrics.likes) - (a.metrics.views + a.metrics.likes);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most_liked':
        return b.metrics.likes - a.metrics.likes;
      case 'most_viewed':
        return b.metrics.views - a.metrics.views;
      default:
        return 0;
    }
  });

  const categories = ['all', 'AI/ML', 'IoT', 'Blockchain', 'Web Development', 'Mobile'];
  const technologies = ['all', 'Python', 'React', 'Node.js', 'JavaScript', 'TypeScript', 'Arduino', 'AWS', 'TensorFlow'];
  const statuses = ['all', 'completed', 'in_progress', 'showcase'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
        <p className="text-muted-foreground">Discover amazing projects from students around the world</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, technologies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
            <button
              onClick={() => {
                // AI-powered search suggestions
                const aiSuggestions = [
                  'AI/ML projects',
                  'Web development',
                  'Mobile apps',
                  'Blockchain',
                  'IoT projects'
                ];
                const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
                setSearchTerm(randomSuggestion);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
              title="AI Search Suggestions"
            >
              <Brain className="w-4 h-4" />
            </button>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          
          {/* AI Recommendations Toggle */}
          <button
            onClick={() => {
              console.log('AI Recommendations button clicked');
              if (!showAIRecommendations) {
                console.log('Generating AI recommendations...');
                generateAIRecommendations();
              }
              setShowAIRecommendations(!showAIRecommendations);
            }}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
              showAIRecommendations 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'border-border hover:bg-muted'
            }`}
          >
            <Brain className="w-5 h-5" />
            AI Recommendations
          </button>
          
          {/* Test Project Button */}
          <button
            onClick={async () => {
              try {
                console.log('Creating test project...');
                const response = await apiService.post('/projects/test', {});
                console.log('Test project created:', response);
                // Refresh the projects list
                fetchProjects();
              } catch (error) {
                console.error('Error creating test project:', error);
              }
            }}
            className="flex items-center gap-2 px-4 py-3 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Test Project
          </button>
          
          {/* Debug Button */}
          <button
            onClick={async () => {
              try {
                console.log('Testing debug endpoint...');
                const response = await apiService.get('/projects/debug');
                console.log('Debug response:', response);
              } catch (error) {
                console.error('Error testing debug endpoint:', error);
              }
            }}
            className="flex items-center gap-2 px-4 py-3 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Code className="w-5 h-5" />
            Debug Database
          </button>
          
          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardBody>
              {/* AI Recommendations Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">AI-Powered Recommendations</h3>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Get personalized project suggestions based on your interests and skills</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Trending AI Projects',
                    'Beginner Friendly',
                    'Advanced ML',
                    'Web Development',
                    'Mobile Apps',
                    'Blockchain',
                    'IoT Projects'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchTerm(suggestion)}
                      className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Technology</label>
                  <select
                    value={filters.technology}
                    onChange={(e) => setFilters({...filters, technology: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {technologies.map(tech => (
                      <option key={tech} value={tech}>{tech === 'all' ? 'All Technologies' : tech}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status === 'all' ? 'All Status' : status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="trending">Trending</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="most_liked">Most Liked</option>
                    <option value="most_viewed">Most Viewed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time Range</label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* AI Recommendations Section */}
      {showAIRecommendations && (
        <div className="mb-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
                  <p className="text-sm text-muted-foreground">Personalized projects based on your skills and interests</p>
                </div>
                <Sparkles className="w-5 h-5 text-primary ml-auto" />
              </div>
              
              {aiRecommendedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiRecommendedProjects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => navigate(`/app/student/explore/${project.id}`)}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(project.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 line-clamp-1">{project.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {project.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                              {project.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{project.metrics.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{project.metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{project.metrics.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No recommendations available</h3>
                  <p className="text-sm text-muted-foreground">Try searching for projects to get personalized recommendations</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          Showing {sortedProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid/List */}
      {sortedProjects.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardBody>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {sortedProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow group">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.videoUrl && project.videoUrl.trim() !== '' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.videoUrl, '_blank');
                      }}
                      className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Play className="w-6 h-6 text-black ml-1" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No video available</p>
                    </div>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {project.duration}
                  </span>
                </div>
              </div>

              <CardBody className="p-4">
                {/* Project Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">{project.title}</h3>
                    <ExpandableDescription 
                      description={project.description}
                      maxLines={2}
                    />
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={project.student.avatar}
                      alt={project.student.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{project.student.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.student.college} • {project.student.year}
                      </p>
                    </div>
                  </div>

                  {/* Team/Mentor Info */}
                  {project.team.mentor && (
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <img
                        src={project.team.mentor.avatar}
                        alt={project.team.mentor.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{project.team.mentor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.team.mentor.role}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {getTechnologyIcon(tech)}
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.metrics.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{project.metrics.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{project.metrics.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(project.category)}
                      <span className="text-xs">{project.category}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button 
                      onClick={() => navigate(`/app/student/explore/${project.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
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

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
  Sparkles
} from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  }, []);

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
      // Mock data - in real app, fetch from API
// Mock data - Extended Projects with Unsplash thumbnails
const mockProjects: Project[] = [
  {
    id: '4',
    title: 'AI Mental Health Companion',
    description: 'An AI chatbot that provides emotional support, mindfulness exercises, and connects users with licensed therapists when needed.',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', // mental health / therapy
    student: {
      id: 'student4',
      name: 'Rohan Mehta',
      avatar: '/api/placeholder/40/40',
      college: 'IIT Bombay',
      year: 'Sophomore'
    },
    team: {
      members: [
        { id: '10', name: 'Rohan Mehta', avatar: '/api/placeholder/32/32', role: 'AI Developer' },
        { id: '11', name: 'Ananya Sharma', avatar: '/api/placeholder/32/32', role: 'Psychology Researcher' }
      ],
      size: 2
    },
    technologies: ['Python', 'TensorFlow', 'React Native', 'Firebase'],
    category: 'AI/Healthcare',
    status: 'in_progress',
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-04-12T18:20:00Z',
    metrics: { views: 560, likes: 48, comments: 12, bookmarks: 20 },
    tags: ['ai', 'mental-health', 'chatbot', 'react-native'],
    repositoryUrl: 'https://github.com/rohan/ai-mental-companion',
    duration: '5 months',
    featured: false
  },
  {
    id: '5',
    title: 'EcoTrack – Smart Waste Management',
    description: 'IoT-enabled smart bins with sensors that notify authorities when full, helping cities reduce overflow and improve recycling efficiency.',
    thumbnail: 'https://images.unsplash.com/photo-1528323273322-d81458248d40', // recycling bins
    student: {
      id: 'student5',
      name: 'Maria Gonzales',
      avatar: '/api/placeholder/40/40',
      college: 'Harvard',
      year: 'Junior'
    },
    team: {
      members: [
        { id: '12', name: 'Maria Gonzales', avatar: '/api/placeholder/32/32', role: 'IoT Engineer' },
        { id: '13', name: 'Daniel Lee', avatar: '/api/placeholder/32/32', role: 'Backend Developer' }
      ],
      size: 2
    },
    technologies: ['Arduino', 'MQTT', 'React', 'MongoDB'],
    category: 'IoT/Environment',
    status: 'completed',
    createdAt: '2023-09-18T08:00:00Z',
    updatedAt: '2023-12-10T10:30:00Z',
    metrics: { views: 980, likes: 120, comments: 25, bookmarks: 50 },
    tags: ['iot', 'waste-management', 'smart-city'],
    repositoryUrl: 'https://github.com/maria/ecotrack',
    duration: '3 months',
    featured: true
  },
  {
    id: '6',
    title: 'AgroSense – AI Crop Monitoring',
    description: 'A drone-based system that uses AI to detect crop diseases early and provide fertilizer recommendations.',
    thumbnail: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde', // drone in agriculture
    student: {
      id: 'student6',
      name: 'Chen Wei',
      avatar: '/api/placeholder/40/40',
      college: 'Tsinghua University',
      year: 'Senior'
    },
    team: {
      members: [
        { id: '14', name: 'Chen Wei', avatar: '/api/placeholder/32/32', role: 'Drone Engineer' },
        { id: '15', name: 'Li Na', avatar: '/api/placeholder/32/32', role: 'Data Scientist' },
        { id: '16', name: 'Raj Verma', avatar: '/api/placeholder/32/32', role: 'ML Engineer' }
      ],
      size: 3
    },
    technologies: ['Python', 'OpenCV', 'TensorFlow', 'DroneKit'],
    category: 'AI/Agriculture',
    status: 'completed',
    createdAt: '2024-01-10T07:15:00Z',
    updatedAt: '2024-03-02T12:30:00Z',
    metrics: { views: 1500, likes: 135, comments: 40, bookmarks: 75 },
    tags: ['ai', 'agriculture', 'drones', 'opencv'],
    repositoryUrl: 'https://github.com/chen/agrosense',
    duration: '4 months',
    featured: true
  },
  {
    id: '7',
    title: 'EduMatch – Personalized Learning',
    description: 'An AI platform that recommends personalized study material and mock tests for students preparing for competitive exams.',
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350', // studying students
    student: {
      id: 'student7',
      name: 'Aisha Khan',
      avatar: '/api/placeholder/40/40',
      college: 'Delhi University',
      year: 'Graduate'
    },
    team: {
      members: [
        { id: '17', name: 'Aisha Khan', avatar: '/api/placeholder/32/32', role: 'ML Engineer' },
        { id: '18', name: 'Omar Ali', avatar: '/api/placeholder/32/32', role: 'Frontend Developer' }
      ],
      size: 2
    },
    technologies: ['Python', 'Flask', 'React', 'PostgreSQL'],
    category: 'EdTech',
    status: 'in_progress',
    createdAt: '2024-04-01T10:45:00Z',
    updatedAt: '2024-04-20T13:10:00Z',
    metrics: { views: 300, likes: 25, comments: 8, bookmarks: 15 },
    tags: ['education', 'ai', 'recommendation', 'edtech'],
    repositoryUrl: 'https://github.com/aisha/edumatch',
    duration: '8 months',
    featured: false
  },
  {
    id: '8',
    title: 'MedScan XR – AR-based Surgery Assistance',
    description: 'An AR platform for surgeons to visualize 3D scans in real-time during operations, improving accuracy and reducing errors.',
    thumbnail: 'https://images.unsplash.com/photo-1581091012184-5c56d06b7c49', // healthcare AR
    student: {
      id: 'student8',
      name: 'John Carter',
      avatar: '/api/placeholder/40/40',
      college: 'Oxford',
      year: 'Senior'
    },
    team: {
      members: [
        { id: '19', name: 'John Carter', avatar: '/api/placeholder/32/32', role: 'AR Developer' },
        { id: '20', name: 'Sophia Williams', avatar: '/api/placeholder/32/32', role: 'Medical Consultant' }
      ],
      size: 2
    },
    technologies: ['Unity', 'C#', 'ARKit', 'Azure'],
    category: 'Healthcare/AR',
    status: 'completed',
    createdAt: '2023-10-12T11:00:00Z',
    updatedAt: '2024-01-05T15:00:00Z',
    metrics: { views: 1750, likes: 145, comments: 38, bookmarks: 82 },
    tags: ['ar', 'healthcare', 'surgery', '3d-visualization'],
    repositoryUrl: 'https://github.com/john/medscan-xr',
    duration: '6 months',
    featured: true
  },
  {
    id: '9',
    title: 'FinGuard – Fraud Detection System',
    description: 'An AI-powered system that monitors financial transactions in real-time to detect and prevent fraud.',
    thumbnail: 'https://images.unsplash.com/photo-1605902711622-cfb43c44367d', // fintech security
    student: {
      id: 'student9',
      name: 'Kavya Reddy',
      avatar: '/api/placeholder/40/40',
      college: 'BITS Pilani',
      year: 'Junior'
    },
    team: {
      members: [
        { id: '21', name: 'Kavya Reddy', avatar: '/api/placeholder/32/32', role: 'Lead Developer' },
        { id: '22', name: 'Arjun Menon', avatar: '/api/placeholder/32/32', role: 'Data Scientist' }
      ],
      size: 2
    },
    technologies: ['Python', 'Scikit-learn', 'Kafka', 'React'],
    category: 'FinTech',
    status: 'in_progress',
    createdAt: '2024-05-01T09:10:00Z',
    updatedAt: '2024-05-15T16:45:00Z',
    metrics: { views: 420, likes: 37, comments: 10, bookmarks: 18 },
    tags: ['fintech', 'fraud-detection', 'ai', 'realtime'],
    repositoryUrl: 'https://github.com/kavya/finguard',
    duration: '5 months',
    featured: false
  },
  {
    id: '10',
    title: 'SafeRide – Women Safety App',
    description: 'A safety app with AI anomaly detection, live GPS tracking, SOS alerts, and auto-recording during emergencies.',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0', // women safety / night travel
    student: {
      id: 'student10',
      name: 'Neha Singh',
      avatar: '/api/placeholder/40/40',
      college: 'Pune University',
      year: 'Senior'
    },
    team: {
      members: [
        { id: '23', name: 'Neha Singh', avatar: '/api/placeholder/32/32', role: 'Mobile Developer' },
        { id: '24', name: 'Rahul Gupta', avatar: '/api/placeholder/32/32', role: 'Security Analyst' }
      ],
      size: 2
    },
    technologies: ['React Native', 'Firebase', 'Python', 'Twilio API'],
    category: 'Safety/Mobile App',
    status: 'completed',
    createdAt: '2023-08-20T07:30:00Z',
    updatedAt: '2023-11-12T14:40:00Z',
    metrics: { views: 2100, likes: 160, comments: 55, bookmarks: 95 },
    tags: ['safety', 'women', 'gps', 'mobile-app'],
    repositoryUrl: 'https://github.com/neha/saferide',
    liveUrl: 'https://saferide.app',
    duration: '4 months',
    featured: true
  },
  {
    id: '11',
    title: 'GreenLedger – Carbon Credit Tracker',
    description: 'A blockchain-based solution for tracking carbon credits and promoting sustainability among industries.',
    thumbnail: 'https://images.unsplash.com/photo-1523978591478-c753949ff840', // environment green
    student: {
      id: 'student11',
      name: 'Oliver Smith',
      avatar: '/api/placeholder/40/40',
      college: 'Cambridge',
      year: 'Graduate'
    },
    team: {
      members: [
        { id: '25', name: 'Oliver Smith', avatar: '/api/placeholder/32/32', role: 'Blockchain Developer' },
        { id: '26', name: 'Emma Johnson', avatar: '/api/placeholder/32/32', role: 'Environment Analyst' }
      ],
      size: 2
    },
    technologies: ['Solidity', 'Ethereum', 'React', 'Node.js'],
    category: 'Blockchain/Environment',
    status: 'completed',
    createdAt: '2023-07-05T12:10:00Z',
    updatedAt: '2023-10-28T17:25:00Z',
    metrics: { views: 1320, likes: 98, comments: 22, bookmarks: 44 },
    tags: ['blockchain', 'sustainability', 'carbon-credits'],
    repositoryUrl: 'https://github.com/oliver/greenledger',
    duration: '6 months',
    featured: false
  },
  {
    id: '12',
    title: 'FoodShare – Zero Hunger Platform',
    description: 'A mobile platform that connects restaurants with NGOs to donate leftover food in real time.',
    thumbnail: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092', // food donation
    student: {
      id: 'student12',
      name: 'Fatima Noor',
      avatar: '/api/placeholder/40/40',
      college: 'UCLA',
      year: 'Junior'
    },
    team: {
      members: [
        { id: '27', name: 'Fatima Noor', avatar: '/api/placeholder/32/32', role: 'Fullstack Developer' },
        { id: '28', name: 'Mohammed Ali', avatar: '/api/placeholder/32/32', role: 'Backend Developer' }
      ],
      size: 2
    },
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API'],
    category: 'Social Impact',
    status: 'completed',
    createdAt: '2023-09-01T11:00:00Z',
    updatedAt: '2023-12-05T18:00:00Z',
    metrics: { views: 1980, likes: 175, comments: 60, bookmarks: 102 },
    tags: ['food-donation', 'ngo', 'social-good', 'mobile-app'],
    repositoryUrl: 'https://github.com/fatima/foodshare',
    liveUrl: 'https://foodshare.org',
    duration: '3 months',
    featured: true
  }
];

      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              {/* Thumbnail */}
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
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
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

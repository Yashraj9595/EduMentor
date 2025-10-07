import React, { useState } from 'react';
import { 
  Brain,
  Award, 
  Compass, 
  Users, 
  Trophy, 
  Bot, 
  User,
  Code,
  Target,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  category: 'core' | 'ai' | 'analytics' | 'collaboration' | 'gamification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isNew?: boolean;
  isPopular?: boolean;
  features: string[];
}

export const FeatureAccessGuide: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const features: Feature[] = [
    {
      id: '1',
      title: 'Achievement System',
      description: 'Gamified learning experience with achievements, rewards, and leaderboards',
      icon: Award,
      path: '/app/student/achievements',
      category: 'gamification',
      difficulty: 'beginner',
      isNew: true,
      features: [
        'Achievement badges',
        'XP and leveling system',
        'Global leaderboards',
        'Rewards shop',
        'Activity streaks',
        'Skill progression tracking'
      ]
    },
    {
      id: '2',
      title: 'Explore Projects',
      description: 'Discover and explore projects from other students with AI-powered recommendations and advanced search',
      icon: Compass,
      path: '/app/student/explore',
      category: 'core',
      difficulty: 'beginner',
      isPopular: true,
      features: [
        'AI-powered project recommendations',
        'Smart project suggestions',
        'Technology trend analysis',
        'YouTube-style browsing',
        'Advanced search & filters',
        'Project thumbnails',
        'Engagement metrics',
        'Technology indicators',
        'Social interactions'
      ]
    },
    {
      id: '3',
      title: 'My Projects',
      description: 'Manage your personal projects with enhanced features and comprehensive tracking',
      icon: Code,
      path: '/app/student/projects',
      category: 'core',
      difficulty: 'beginner',
      features: [
        'Project management',
        'Enhanced project cards',
        'Media upload support',
        'Team collaboration',
        'Progress tracking',
        'Technology stack display'
      ]
    },
    {
      id: '4',
      title: 'Find Mentors',
      description: 'Connect with experienced mentors and industry professionals for guidance',
      icon: Users,
      path: '/app/student/mentors',
      category: 'core',
      difficulty: 'beginner',
      features: [
        'Mentor discovery',
        'Expertise matching',
        'Real-time chat',
        'File sharing',
        'Video calls',
        'Feedback system'
      ]
    },
    {
      id: '5',
      title: 'Hackathons',
      description: 'Participate in hackathons and coding competitions with submission tools',
      icon: Trophy,
      path: '/app/student/hackathons',
      category: 'core',
      difficulty: 'intermediate',
      features: [
        'Hackathon discovery',
        'Project submission',
        'Team formation',
        'Live judging',
        'Results tracking',
        'Digital certificates'
      ]
    },
    {
      id: '6',
      title: 'AI Assistant',
      description: 'Get AI-powered assistance for project ideas, code help, and learning guidance',
      icon: Bot,
      path: '/app/student/ai-assistant',
      category: 'ai',
      difficulty: 'beginner',
      features: [
        'Project idea generation',
        'Code assistance',
        'Learning recommendations',
        'Abstract writing help',
        'FAQ chatbot',
        'Technical guidance'
      ]
    },
    {
      id: '7',
      title: 'My Portfolio',
      description: 'Create and manage your professional portfolio to showcase your work',
      icon: User,
      path: '/app/student/profile',
      category: 'core',
      difficulty: 'beginner',
      features: [
        'Profile management',
        'Project showcase',
        'Skills tracking',
        'Achievement display',
        'Social links',
        'Professional networking'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', icon: Star },
    { id: 'core', label: 'Core Features', icon: Code },
    { id: 'ai', label: 'AI Features', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'collaboration', label: 'Collaboration', icon: MessageCircle },
    { id: 'gamification', label: 'Gamification', icon: Award }
  ];

  const filteredFeatures = features.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Code className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'analytics': return <TrendingUp className="w-4 h-4" />;
      case 'collaboration': return <MessageCircle className="w-4 h-4" />;
      case 'gamification': return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Feature Access Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover all the powerful features available in your student platform. 
          From AI-powered recommendations to real-time collaboration, everything you need to succeed.
        </p>
      </div>

      {/* Quick Access Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold">{features.length}</p>
            <p className="text-sm text-muted-foreground">Total Features</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{features.filter(f => f.isNew).length}</p>
            <p className="text-sm text-muted-foreground">New Features</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold">{features.filter(f => f.isPopular).length}</p>
            <p className="text-sm text-muted-foreground">Popular</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-sm text-muted-foreground">Accessible</p>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardBody className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        {feature.isNew && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                        {feature.isPopular && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
                    </div>
                  </div>

                  {/* Category and Difficulty */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getCategoryIcon(feature.category)}
                      <span className="capitalize">{feature.category}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(feature.difficulty)}`}>
                      {feature.difficulty}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {feature.features.slice(0, 3).map((feat, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                      {feature.features.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{feature.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(feature.path)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <span>Access Feature</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Shortcuts */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Quick Access Shortcuts
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/app/student/achievements')}
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Award className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Achievements</span>
            </button>
            <button
              onClick={() => navigate('/app/student/explore')}
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Compass className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Explore Projects</span>
            </button>
            <button
              onClick={() => navigate('/app/student/projects')}
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Code className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">My Projects</span>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

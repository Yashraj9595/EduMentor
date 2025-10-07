import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Star, 
  Users, 
  Code, 
  Lightbulb,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

interface AIRecommendation {
  id: string;
  type: 'project_suggestion' | 'collaboration' | 'technology' | 'trending';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionUrl?: string;
  tags: string[];
}

interface TrendingTech {
  name: string;
  growth: number;
  projects: number;
  demand: 'high' | 'medium' | 'low';
}

export const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [trendingTech, setTrendingTech] = useState<TrendingTech[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIRecommendations();
    fetchTrendingTech();
  }, []);

  const fetchAIRecommendations = async () => {
    // Mock AI recommendations
    const mockRecommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'project_suggestion',
        title: 'AI-Powered Study Assistant',
        description: 'Based on your interest in AI and education, we recommend building a personalized study assistant that uses machine learning to optimize learning paths.',
        confidence: 92,
        reasoning: 'You have experience with React and Python, and your past projects show interest in educational technology.',
        actionUrl: '/app/student/projects/create',
        tags: ['AI', 'Education', 'Machine Learning']
      },
      {
        id: '2',
        type: 'collaboration',
        title: 'Potential Team Members',
        description: 'We found 3 students with complementary skills who are working on similar projects and might be interested in collaboration.',
        confidence: 87,
        reasoning: 'Based on skill overlap and project compatibility analysis.',
        actionUrl: '/app/student/teams/create',
        tags: ['Collaboration', 'Team Building']
      },
      {
        id: '3',
        type: 'technology',
        title: 'Learn Web3 Development',
        description: 'Blockchain projects are trending with 40% growth. Consider learning Solidity and Web3.js to stay competitive.',
        confidence: 78,
        reasoning: 'Your current tech stack aligns well with blockchain development, and there\'s high demand in the market.',
        actionUrl: '/app/student/ai-assistant',
        tags: ['Blockchain', 'Web3', 'Learning']
      }
    ];
    setRecommendations(mockRecommendations);
  };

  const fetchTrendingTech = async () => {
    const mockTrending: TrendingTech[] = [
      { name: 'AI/ML', growth: 45, projects: 156, demand: 'high' },
      { name: 'Web3', growth: 38, projects: 89, demand: 'high' },
      { name: 'IoT', growth: 25, projects: 67, demand: 'medium' },
      { name: 'AR/VR', growth: 32, projects: 43, demand: 'medium' },
      { name: 'Quantum Computing', growth: 15, projects: 12, demand: 'low' }
    ];
    setTrendingTech(mockTrending);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'project_suggestion': return <Lightbulb className="w-5 h-5" />;
      case 'collaboration': return <Users className="w-5 h-5" />;
      case 'technology': return <Code className="w-5 h-5" />;
      case 'trending': return <TrendingUp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI-Powered Recommendations
          </h2>
          <p className="text-sm text-muted-foreground">
            Personalized suggestions based on your skills, interests, and market trends
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence}% match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <p className="text-xs text-muted-foreground mb-3 italic">"{rec.reasoning}"</p>
                    <div className="flex items-center gap-2">
                      {rec.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {rec.actionUrl && (
                        <button className="ml-auto text-primary hover:text-primary/80 text-sm font-medium">
                          Take Action →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Trending Technologies */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Trending Technologies
          </h2>
          <p className="text-sm text-muted-foreground">
            Technologies gaining momentum in the student project ecosystem
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {trendingTech.map((tech, index) => (
              <div key={tech.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.projects} active projects</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{tech.growth}%</p>
                    <p className="text-xs text-muted-foreground">growth</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(tech.demand)}`}>
                    {tech.demand} demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Skill Gap Analysis */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Skill Gap Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Identify skills to learn for your next breakthrough project
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-green-600">Strengths</h3>
              <div className="space-y-2">
                {['React', 'JavaScript', 'Node.js'].map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{skill}</span>
                    <span className="text-xs text-muted-foreground ml-auto">Advanced</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-orange-600">Growth Areas</h3>
              <div className="space-y-2">
                {['Machine Learning', 'Blockchain', 'DevOps'].map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">{skill}</span>
                    <span className="text-xs text-muted-foreground ml-auto">Beginner</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

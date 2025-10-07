import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Star,
  Trophy,
  BookOpen,
  ArrowLeft,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ProgressTimeline } from '../../../components/Gamification/ProgressTimeline';

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

export const ProjectProgress: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProgressData();
    }
  }, [projectId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockProgress: ProjectProgress = {
        projectId: projectId || '1',
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
          },
          {
            name: 'Consistent Logger',
            description: 'Logged entries for 7 consecutive days',
            icon: '📝',
            earnedAt: '2024-01-22T09:00:00Z'
          }
        ],
        achievements: [
          {
            title: 'Consistent Logger',
            description: 'Logged entries for 7 consecutive days',
            points: 100,
            earnedAt: '2024-01-22T09:00:00Z'
          },
          {
            title: 'Milestone Achiever',
            description: 'Completed your first project milestone',
            points: 250,
            earnedAt: '2024-01-25T16:45:00Z'
          }
        ],
        streak: 7,
        weeklyGoal: 5
      };

      setProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Project Progress</h1>
            <p className="text-muted-foreground">Track your project journey and achievements</p>
          </div>
        </div>

        {/* Progress Overview Cards */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{progress.overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">{progress.completedMilestones}/{progress.totalMilestones}</div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">Level {progress.level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">{progress.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Progress Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Project Progress Timeline
            </h3>
          </CardHeader>
          <CardBody>
            <ProgressTimeline 
              projectId={projectId}
              currentStep={2}
              animated={true}
              showProgress={true}
            />
          </CardBody>
        </Card>

        {/* Achievements and Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Recent Achievements
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {progress?.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-green-600 font-medium">+{achievement.points} points</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
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
                Earned Badges
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {progress?.badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Level Progress */}
        {progress && (
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Level Progress
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Level {progress.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {progress.totalPoints} / {progress.nextLevelPoints} points
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(progress.totalPoints / progress.nextLevelPoints) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {progress.nextLevelPoints - progress.totalPoints} points to next level
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

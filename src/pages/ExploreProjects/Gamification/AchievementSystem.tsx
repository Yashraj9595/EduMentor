import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Zap, 
  Shield, 
  Crown, 
  Medal,
  Flame,
  Rocket,
  Diamond,
  Gem,
  CheckCircle,
  Clock,
  Users,
  Code,
  Heart,
  Eye,
  MessageCircle,
  Bookmark,
  Share2,
  TrendingUp,
  BarChart3,
  Calendar,
  Gift,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'project' | 'social' | 'learning' | 'collaboration' | 'innovation';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
  rewards: {
    xp: number;
    coins: number;
    badge?: string;
  };
}

interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  totalXp: number;
  coins: number;
  achievements: number;
  projects: number;
  collaborations: number;
  streak: number;
  rank: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  achievements: number;
  isCurrentUser: boolean;
}

export const AchievementSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'rewards'>('achievements');

  useEffect(() => {
    fetchAchievements();
    fetchUserStats();
    fetchLeaderboard();
  }, []);

  const fetchAchievements = async () => {
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Project',
        description: 'Create your first project on the platform',
        icon: Rocket,
        category: 'project',
        rarity: 'common',
        points: 100,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        progress: 1,
        maxProgress: 1,
        requirements: ['Create a project'],
        rewards: { xp: 100, coins: 50 }
      },
      {
        id: '2',
        title: 'Code Master',
        description: 'Complete 10 coding challenges',
        icon: Code,
        category: 'learning',
        rarity: 'rare',
        points: 500,
        isUnlocked: false,
        progress: 7,
        maxProgress: 10,
        requirements: ['Complete 10 coding challenges'],
        rewards: { xp: 500, coins: 200 }
      },
      {
        id: '3',
        title: 'Social Butterfly',
        description: 'Get 100 likes on your projects',
        icon: Heart,
        category: 'social',
        rarity: 'epic',
        points: 1000,
        isUnlocked: false,
        progress: 67,
        maxProgress: 100,
        requirements: ['Get 100 likes on projects'],
        rewards: { xp: 1000, coins: 500, badge: 'Social Butterfly' }
      },
      {
        id: '4',
        title: 'Team Player',
        description: 'Collaborate on 5 team projects',
        icon: Users,
        category: 'collaboration',
        rarity: 'rare',
        points: 750,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        progress: 5,
        maxProgress: 5,
        requirements: ['Collaborate on 5 team projects'],
        rewards: { xp: 750, coins: 300 }
      },
      {
        id: '5',
        title: 'Innovation Master',
        description: 'Create a project using cutting-edge technology',
        icon: Diamond,
        category: 'innovation',
        rarity: 'legendary',
        points: 2000,
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
        requirements: ['Use AI/ML, Blockchain, or IoT in a project'],
        rewards: { xp: 2000, coins: 1000, badge: 'Innovation Master' }
      },
      {
        id: '6',
        title: 'Streak Master',
        description: 'Maintain a 30-day activity streak',
        icon: Flame,
        category: 'social',
        rarity: 'epic',
        points: 1500,
        isUnlocked: false,
        progress: 12,
        maxProgress: 30,
        requirements: ['Maintain 30-day activity streak'],
        rewards: { xp: 1500, coins: 750 }
      }
    ];
    setAchievements(mockAchievements);
  };

  const fetchUserStats = async () => {
    const mockStats: UserStats = {
      level: 12,
      xp: 2450,
      nextLevelXp: 3000,
      totalXp: 12450,
      coins: 1250,
      achievements: 8,
      projects: 5,
      collaborations: 3,
      streak: 12,
      rank: 15
    };
    setUserStats(mockStats);
  };

  const fetchLeaderboard = async () => {
    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, name: 'Alex Johnson', avatar: '/avatars/alex.jpg', xp: 25000, level: 25, achievements: 45, isCurrentUser: false },
      { rank: 2, name: 'Sarah Chen', avatar: '/avatars/sarah.jpg', xp: 22000, level: 22, achievements: 38, isCurrentUser: false },
      { rank: 3, name: 'Mike Rodriguez', avatar: '/avatars/mike.jpg', xp: 20000, level: 20, achievements: 35, isCurrentUser: false },
      { rank: 15, name: 'You', avatar: '/avatars/current-user.jpg', xp: 12450, level: 12, achievements: 8, isCurrentUser: true },
      { rank: 16, name: 'Emma Wilson', avatar: '/avatars/emma.jpg', xp: 12000, level: 12, achievements: 7, isCurrentUser: false }
    ];
    setLeaderboard(mockLeaderboard);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return <Code className="w-4 h-4" />;
      case 'social': return <Heart className="w-4 h-4" />;
      case 'learning': return <Bookmark className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      case 'innovation': return <Diamond className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return (progress / maxProgress) * 100;
  };

  if (!userStats) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achievements & Rewards</h1>
          <p className="text-muted-foreground">Track your progress and unlock amazing rewards</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{userStats.level}</p>
            <p className="text-sm text-muted-foreground">Level</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{userStats.coins}</p>
            <p className="text-sm text-muted-foreground">Coins</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Progress</p>
                <p className="font-semibold">{userStats.xp} / {userStats.nextLevelXp}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="font-semibold">{userStats.achievements}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="font-semibold">{userStats.projects}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="font-semibold">{userStats.streak} days</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-3 font-medium ${
              activeTab === 'achievements' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-3 font-medium ${
              activeTab === 'leaderboard' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-3 font-medium ${
              activeTab === 'rewards' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gift className="w-4 h-4 inline mr-2" />
            Rewards
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = getProgressPercentage(achievement.progress, achievement.maxProgress);
              
              return (
                <Card key={achievement.id} className={`${achievement.isUnlocked ? 'ring-2 ring-green-200' : ''}`}>
                  <CardBody className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.isUnlocked ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            achievement.isUnlocked ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        {achievement.isUnlocked && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">{achievement.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              achievement.isUnlocked ? 'bg-green-500' : 'bg-primary'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{achievement.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-blue-500" />
                          <span>{achievement.rewards.coins} coins</span>
                        </div>
                      </div>

                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Global Leaderboard</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    entry.isCurrentUser ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">#{entry.rank}</span>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {entry.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{entry.name}</h3>
                    <p className="text-sm text-muted-foreground">Level {entry.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{entry.xp.toLocaleString()} XP</p>
                    <p className="text-sm text-muted-foreground">{entry.achievements} achievements</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardBody className="p-4 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Premium Badge</h3>
              <p className="text-sm text-muted-foreground mb-3">Show off your premium status</p>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Claim (500 coins)
              </button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Diamond className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Exclusive Theme</h3>
              <p className="text-sm text-muted-foreground mb-3">Dark mode with special effects</p>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Claim (750 coins)
              </button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Project Boost</h3>
              <p className="text-sm text-muted-foreground mb-3">Get featured on homepage</p>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Claim (1000 coins)
              </button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

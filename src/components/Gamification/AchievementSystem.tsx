import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Award, 
  Crown,
  Bell,
  X
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { BadgeCollection } from './Badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  earnedAt: string;
  category: 'milestone' | 'streak' | 'quality' | 'collaboration' | 'achievement' | 'special';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeData {
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'quality' | 'collaboration' | 'achievement' | 'special';
  earnedAt: string;
  isEarned: boolean;
  isNew?: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface AchievementSystemProps {
  userId: string;
  projectId?: string;
  showNotifications?: boolean;
  onAchievementEarned?: (achievement: Achievement) => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userId,
  projectId,
  showNotifications = true,
  onAchievementEarned
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [userId, projectId]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Created your first diary entry',
          points: 10,
          earnedAt: '2024-01-15T10:30:00Z',
          category: 'milestone',
          icon: 'target',
          rarity: 'common'
        },
        {
          id: '2',
          title: 'Consistent Learner',
          description: 'Submitted 5 diary entries',
          points: 25,
          earnedAt: '2024-01-20T09:15:00Z',
          category: 'streak',
          icon: 'book',
          rarity: 'common'
        },
        {
          id: '3',
          title: 'Milestone Master',
          description: 'Completed first milestone',
          points: 50,
          earnedAt: '2024-01-10T00:00:00Z',
          category: 'achievement',
          icon: 'trophy',
          rarity: 'rare'
        },
        {
          id: '4',
          title: 'Streak Keeper',
          description: 'Maintained 7-day activity streak',
          points: 30,
          earnedAt: '2024-01-22T00:00:00Z',
          category: 'streak',
          icon: 'flame',
          rarity: 'epic'
        },
        {
          id: '5',
          title: 'Quality Contributor',
          description: 'Received 5 star rating from mentor',
          points: 40,
          earnedAt: '2024-01-18T14:20:00Z',
          category: 'quality',
          icon: 'award',
          rarity: 'rare'
        },
        {
          id: '6',
          title: 'Team Player',
          description: 'Collaborated on 3 team projects',
          points: 35,
          earnedAt: '2024-01-25T16:45:00Z',
          category: 'collaboration',
          icon: 'users',
          rarity: 'common'
        }
      ];

      const mockBadges: BadgeData[] = [
        {
          name: 'Research Ready',
          description: 'Completed literature review milestone',
          icon: 'book',
          category: 'milestone',
          earnedAt: '2024-01-15T10:30:00Z',
          isEarned: true,
          isNew: false,
          rarity: 'common',
          points: 15
        },
        {
          name: 'Code Warrior',
          description: 'Completed 10 coding challenges',
          icon: 'code',
          category: 'achievement',
          earnedAt: '2024-01-20T09:15:00Z',
          isEarned: true,
          isNew: true,
          rarity: 'rare',
          points: 30
        },
        {
          name: 'Presentation Pro',
          description: 'Delivered excellent project presentation',
          icon: 'award',
          category: 'quality',
          earnedAt: '2024-01-18T14:20:00Z',
          isEarned: true,
          isNew: false,
          rarity: 'epic',
          points: 25
        },
        {
          name: 'Mentor\'s Choice',
          description: 'Received outstanding feedback from mentor',
          icon: 'crown',
          category: 'quality',
          earnedAt: '2024-01-22T00:00:00Z',
          isEarned: true,
          isNew: false,
          rarity: 'legendary',
          points: 50
        },
        {
          name: 'Team Builder',
          description: 'Successfully led a team project',
          icon: 'users',
          category: 'collaboration',
          earnedAt: '2024-01-25T16:45:00Z',
          isEarned: true,
          isNew: false,
          rarity: 'rare',
          points: 40
        },
        {
          name: 'Innovation Hub',
          description: 'Proposed and implemented innovative solution',
          icon: 'lightbulb',
          category: 'special',
          earnedAt: '2024-01-28T11:30:00Z',
          isEarned: false,
          isNew: false,
          rarity: 'legendary',
          points: 100
        }
      ];

      setAchievements(mockAchievements);
      setBadges(mockBadges);

      // Check for new achievements
      const newAchievements = mockAchievements.filter(a => 
        new Date(a.earnedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      
      if (newAchievements.length > 0) {
        setNewAchievements(newAchievements);
        if (showNotifications) {
          setShowNotification(true);
        }
        newAchievements.forEach(achievement => {
          if (onAchievementEarned) {
            onAchievementEarned(achievement);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPoints = () => {
    return achievements.reduce((total, achievement) => total + achievement.points, 0);
  };

  const getEarnedBadges = () => {
    return badges.filter(badge => badge.isEarned);
  };

  const getRarityCount = (rarity: string) => {
    return badges.filter(badge => badge.isEarned && badge.rarity === rarity).length;
  };

  const getCategoryCount = (category: string) => {
    return badges.filter(badge => badge.isEarned && badge.category === category).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      {showNotification && newAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 animate-bounce" />
              <div>
                <h3 className="font-semibold">New Achievement Unlocked!</h3>
                <p className="text-sm">
                  {newAchievements.length === 1 
                    ? `You earned "${newAchievements[0].title}"`
                    : `You earned ${newAchievements.length} new achievements!`
                  }
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotification(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{getTotalPoints()}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">{getEarnedBadges().length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Legendary</p>
                <p className="text-2xl font-bold">{getRarityCount('legendary')}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Milestones</p>
                <p className="text-2xl font-bold">{getCategoryCount('milestone')}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Achievements</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {achievements.slice(0, 5).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary">+{achievement.points} pts</span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Badge Collection */}
      <BadgeCollection
        badges={badges}
        title="Badges & Achievements"
        showUnearned={true}
        onBadgeClick={(badge) => {
          console.log('Badge clicked:', badge);
        }}
      />

      {/* Rarity Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Badge Rarity Breakdown</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => (
              <div key={rarity} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                  rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                  rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-medium capitalize">{rarity}</h4>
                <p className="text-2xl font-bold">{getRarityCount(rarity)}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};




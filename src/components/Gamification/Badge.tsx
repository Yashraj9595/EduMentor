import React from 'react';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  BookOpen, 
  Calendar, 
  Users, 
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Heart,
  Flame,
  Crown,
  Gem,
  Shield,
  Sword,
  Rocket,
  Lightbulb,
  Code,
  Database,
  Cpu,
  Globe,
  Lock,
  Unlock,
  Key,
  Gift,
  Sparkles
} from 'lucide-react';

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'quality' | 'collaboration' | 'achievement' | 'special';
  earnedAt: string;
  isEarned?: boolean;
  isNew?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  points?: number;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  name,
  description,
  icon,
  category,
  earnedAt,
  isEarned = true,
  isNew = false,
  rarity = 'common',
  points = 0,
  onClick
}) => {
  const getIconComponent = () => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'trophy': Trophy,
      'star': Star,
      'zap': Zap,
      'target': Target,
      'award': Award,
      'book': BookOpen,
      'calendar': Calendar,
      'users': Users,
      'message': MessageCircle,
      'trending': TrendingUp,
      'check': CheckCircle,
      'clock': Clock,
      'heart': Heart,
      'flame': Flame,
      'crown': Crown,
      'gem': Gem,
      'shield': Shield,
      'sword': Sword,
      'rocket': Rocket,
      'lightbulb': Lightbulb,
      'code': Code,
      'database': Database,
      'cpu': Cpu,
      'globe': Globe,
      'lock': Lock,
      'unlock': Unlock,
      'key': Key,
      'gift': Gift,
      'sparkles': Sparkles
    };

    const IconComponent = iconMap[icon] || Star;
    return <IconComponent className="w-6 h-6" />;
  };

  const getRarityClasses = () => {
    switch (rarity) {
      case 'rare':
        return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'epic':
        return 'border-purple-300 bg-purple-50 text-purple-700';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50 text-yellow-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'milestone':
        return <Target className="w-3 h-3" />;
      case 'streak':
        return <Flame className="w-3 h-3" />;
      case 'quality':
        return <Award className="w-3 h-3" />;
      case 'collaboration':
        return <Users className="w-3 h-3" />;
      case 'achievement':
        return <Trophy className="w-3 h-3" />;
      case 'special':
        return <Sparkles className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'milestone':
        return 'text-green-600';
      case 'streak':
        return 'text-orange-600';
      case 'quality':
        return 'text-blue-600';
      case 'collaboration':
        return 'text-purple-600';
      case 'achievement':
        return 'text-yellow-600';
      case 'special':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
        isEarned ? getRarityClasses() : 'border-gray-200 bg-gray-100 text-gray-400'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          NEW!
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full ${isEarned ? 'bg-white' : 'bg-gray-200'}`}>
          {getIconComponent()}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${getCategoryColor()}`}>
              {getCategoryIcon()}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {category}
            </span>
            {points > 0 && (
              <span className="text-xs text-muted-foreground">
                +{points} pts
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className={`text-sm ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
        {description}
      </p>
      
      {isEarned && (
        <div className="mt-2 text-xs text-muted-foreground">
          Earned on {new Date(earnedAt).toLocaleDateString()}
        </div>
      )}
      
      {!isEarned && (
        <div className="mt-2 text-xs text-muted-foreground">
          Not yet earned
        </div>
      )}
    </div>
  );
};

interface BadgeCollectionProps {
  badges: BadgeProps[];
  title?: string;
  showUnearned?: boolean;
  maxDisplay?: number;
  onBadgeClick?: (badge: BadgeProps) => void;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  title = "Badges & Achievements",
  showUnearned = false,
  maxDisplay,
  onBadgeClick
}) => {
  const earnedBadges = badges.filter(badge => badge.isEarned);
  
  const displayBadges = showUnearned ? badges : earnedBadges;
  const limitedBadges = maxDisplay ? displayBadges.slice(0, maxDisplay) : displayBadges;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          {earnedBadges.length} / {badges.length} earned
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limitedBadges.map((badge, index) => (
          <Badge
            key={index}
            {...badge}
            onClick={onBadgeClick ? () => onBadgeClick(badge) : undefined}
          />
        ))}
      </div>
      
      {maxDisplay && displayBadges.length > maxDisplay && (
        <div className="text-center">
          <button className="text-sm text-primary hover:text-primary/80">
            View all {displayBadges.length} badges
          </button>
        </div>
      )}
    </div>
  );
};





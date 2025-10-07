import React from 'react';
import { Trophy, Star, Zap, Target, Award, TrendingUp, Calendar } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  max: number;
  type?: 'level' | 'weekly' | 'milestone' | 'overall';
  showIcon?: boolean;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  type = 'overall',
  showIcon = true,
  showPercentage = true,
  showLabel = true,
  label,
  color = 'primary',
  size = 'md',
  animated = true
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  const remaining = max - current;

  const getIcon = () => {
    switch (type) {
      case 'level':
        return <Trophy className="w-4 h-4" />;
      case 'weekly':
        return <Calendar className="w-4 h-4" />;
      case 'milestone':
        return <Target className="w-4 h-4" />;
      case 'overall':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const getLabel = () => {
    if (label) return label;
    
    switch (type) {
      case 'level':
        return 'Level Progress';
      case 'weekly':
        return 'Weekly Goal';
      case 'milestone':
        return 'Milestone Progress';
      case 'overall':
        return 'Overall Progress';
      default:
        return 'Progress';
    }
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showIcon && getIcon()}
            <span className="text-sm font-medium">{getLabel()}</span>
          </div>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${getSizeClasses()}`}>
        <div 
          className={`${getColorClasses()} ${getSizeClasses()} rounded-full transition-all duration-500 ${
            animated ? 'ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{current} / {max}</span>
        {remaining > 0 && (
          <span>{remaining} remaining</span>
        )}
      </div>
    </div>
  );
};

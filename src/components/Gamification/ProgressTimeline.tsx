import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lightbulb, 
  Clock, 
  Settings, 
  Users, 
  TrendingUp, 
  Globe,
  CheckCircle,
  Star,
  Target,
  Zap,
  Sparkles,
  Crown,
  Gem,
  Trophy,
  Diamond
} from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'current' | 'upcoming';
  color: string;
  borderColor: string;
  textColor: string;
  progress: number;
  points: number;
  gems: number;
  level: number;
  specialEffect?: 'sparkle' | 'crown' | 'diamond' | 'gem' | 'trophy';
}

interface ProgressTimelineProps {
  projectId?: string;
  currentStep?: number;
  steps?: TimelineStep[];
  showProgress?: boolean;
  animated?: boolean;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  steps,
  showProgress = true,
  animated = true
}) => {
  const [sparkleAnimations, setSparkleAnimations] = useState<{[key: string]: boolean}>({});
  
  const defaultSteps: TimelineStep[] = [
    {
      id: 'planning',
      title: 'Project Planning',
      description: 'Define project scope, objectives, and create detailed project plan with timelines and deliverables.',
      icon: User,
      status: 'completed',
      color: 'from-blue-500 to-teal-500',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      progress: 100,
      points: 100,
      gems: 5,
      level: 1,
      specialEffect: 'sparkle'
    },
    {
      id: 'research',
      title: 'Research & Analysis',
      description: 'Conduct thorough research, gather requirements, and analyze existing solutions and best practices.',
      icon: Lightbulb,
      status: 'completed',
      color: 'from-teal-500 to-green-500',
      borderColor: 'border-teal-500',
      textColor: 'text-teal-700',
      progress: 100,
      points: 150,
      gems: 8,
      level: 2,
      specialEffect: 'gem'
    },
    {
      id: 'design',
      title: 'Design & Architecture',
      description: 'Create system architecture, database design, and user interface mockups and prototypes.',
      icon: Clock,
      status: 'completed',
      color: 'from-green-500 to-lime-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      progress: 100,
      points: 200,
      gems: 12,
      level: 3,
      specialEffect: 'diamond'
    },
    {
      id: 'development',
      title: 'Development Phase',
      description: 'Implement core functionality, develop APIs, and build the main application features.',
      icon: Settings,
      status: 'current',
      color: 'from-lime-500 to-yellow-500',
      borderColor: 'border-lime-500',
      textColor: 'text-lime-700',
      progress: 65,
      points: 300,
      gems: 15,
      level: 4,
      specialEffect: 'crown'
    },
    {
      id: 'testing',
      title: 'Testing & Review',
      description: 'Conduct comprehensive testing, code reviews, and mentor feedback sessions.',
      icon: Users,
      status: 'upcoming',
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      progress: 0,
      points: 400,
      gems: 20,
      level: 5,
      specialEffect: 'trophy'
    },
    {
      id: 'deployment',
      title: 'Deployment & Launch',
      description: 'Deploy the application, conduct final testing, and prepare for production launch.',
      icon: TrendingUp,
      status: 'upcoming',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      progress: 0,
      points: 500,
      gems: 25,
      level: 6,
      specialEffect: 'diamond'
    },
    {
      id: 'completion',
      title: 'Project Completion',
      description: 'Final documentation, project presentation, and handover to stakeholders.',
      icon: Globe,
      status: 'upcoming',
      color: 'from-red-500 to-purple-500',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      progress: 0,
      points: 1000,
      gems: 50,
      level: 7,
      specialEffect: 'crown'
    }
  ];

  const timelineSteps = steps || defaultSteps;

  useEffect(() => {
    // Trigger sparkle animations for completed steps
    const completedSteps = timelineSteps.filter(step => step.status === 'completed');
    completedSteps.forEach(step => {
      setTimeout(() => {
        setSparkleAnimations(prev => ({ ...prev, [step.id]: true }));
        setTimeout(() => {
          setSparkleAnimations(prev => ({ ...prev, [step.id]: false }));
        }, 2000);
      }, Math.random() * 3000);
    });
  }, [timelineSteps]);


  const getStepIcon = (step: TimelineStep) => {
    const Icon = step.icon;
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${
        step.status === 'completed' ? 'bg-green-100 text-green-600' :
        step.status === 'current' ? 'bg-blue-100 text-blue-600' :
        'bg-gray-100 text-gray-400'
      }`}>
        {step.status === 'completed' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
        
        {/* Special Effects */}
        {step.status === 'completed' && step.specialEffect && (
          <div className="absolute -top-1 -right-1">
            {step.specialEffect === 'sparkle' && (
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            )}
            {step.specialEffect === 'crown' && (
              <Crown className="w-4 h-4 text-yellow-500 animate-bounce" />
            )}
            {step.specialEffect === 'diamond' && (
              <Diamond className="w-4 h-4 text-blue-500 animate-pulse" />
            )}
            {step.specialEffect === 'gem' && (
              <Gem className="w-4 h-4 text-purple-500 animate-pulse" />
            )}
            {step.specialEffect === 'trophy' && (
              <Trophy className="w-4 h-4 text-orange-500 animate-bounce" />
            )}
          </div>
        )}
      </div>
    );
  };

  const getConnectionGradient = (currentIndex: number, nextIndex: number) => {
    if (nextIndex >= timelineSteps.length) return '';
    const currentStep = timelineSteps[currentIndex];
    const nextStep = timelineSteps[nextIndex];
    return `bg-gradient-to-r ${currentStep.color} to ${nextStep.color}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 sm:left-8 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Steps */}
        <div className="space-y-8">
          {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;
            const isAlternating = index % 2 === 0;
            
            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {!isLast && (
                  <div 
                    className={`absolute left-4 sm:left-8 top-8 w-0.5 h-16 ${
                      step.status === 'completed' ? getConnectionGradient(index, index + 1) : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    style={{
                      background: step.status === 'completed' ? 
                        `linear-gradient(to bottom, var(--tw-gradient-stops))` : 
                        undefined
                    }}
                  ></div>
                )}
                
                <div className={`flex flex-col sm:flex-row items-center ${isAlternating ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Text Box */}
                  <div className={`flex-1 w-full ${isAlternating ? 'sm:mr-8' : 'sm:ml-8'} mb-4 sm:mb-0`}>
                    <div className={`p-4 sm:p-6 rounded-2xl shadow-lg border-2 ${step.borderColor} bg-white dark:bg-gray-800 relative overflow-hidden`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h3 className={`text-lg sm:text-xl font-bold ${step.textColor} dark:text-white`}>{step.title}</h3>
                        {step.status === 'completed' && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-medium">Completed</span>
                          </div>
                        )}
                        {step.status === 'current' && (
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs sm:text-sm font-medium">In Progress</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Gamification Stats */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">{step.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          <Gem className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">{step.gems} gems</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">Level {step.level}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">{step.description}</p>
                      
                      {showProgress && step.status !== 'upcoming' && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                            <span className={`font-bold ${step.textColor} dark:text-white`}>{step.progress}%</span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 shadow-inner">
                              <div 
                                className={`h-2 sm:h-3 rounded-full transition-all duration-1000 relative overflow-hidden ${
                                  animated ? 'animate-pulse' : ''
                                }`}
                                style={{ 
                                  width: `${step.progress}%`,
                                  background: `linear-gradient(90deg, ${step.color.replace('from-', '').replace('to-', '')})`
                                }}
                              >
                                {/* Candy Crush-like shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                                {/* Progress sparkles */}
                                {step.progress > 0 && (
                                  <div className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                                )}
                              </div>
                            </div>
                            {/* Floating progress indicators */}
                            {step.progress > 0 && (
                              <div className="absolute -top-4 sm:-top-6 right-0 transform -translate-x-1/2">
                                <div className="bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-lg border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200">
                                  {step.progress}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Additional Info for Current Step */}
                      {step.status === 'current' && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <Target className="w-4 h-4" />
                            <span className="text-sm font-medium">Current Focus</span>
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                            Working on core functionality implementation and API development.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Circle Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-gray-800 border-4 ${step.borderColor} shadow-lg flex items-center justify-center relative ${
                      animated && step.status === 'current' ? 'animate-pulse' : ''
                    }`}>
                      {getStepIcon(step)}
                      
                      {/* Sparkle effects for completed steps */}
                      {step.status === 'completed' && sparkleAnimations[step.id] && (
                        <div className="absolute inset-0 rounded-full">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
                          </div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                            <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
                          </div>
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                            <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
                          </div>
                          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                            <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Progress Ring for Current Step */}
                    {step.status === 'current' && (
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                    )}
                    
                    {/* Level indicator */}
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg">
                      {step.level}
                    </div>
                    
                    {/* Floating gems for completed steps */}
                    {step.status === 'completed' && (
                      <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 animate-bounce">
                        <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Overall Progress Summary */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-blue-200 dark:border-gray-600 relative overflow-hidden">
        {/* Background sparkles */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
          <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-bounce" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">Project Progress Overview</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Track your journey to success!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-2xl font-bold">
                  {timelineSteps.reduce((acc, step) => acc + step.points, 0)}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-2xl font-bold">
                  {timelineSteps.reduce((acc, step) => acc + step.gems, 0)}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Gems</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                {timelineSteps.filter(step => step.status === 'completed').length}
              </div>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">Completed</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Great job! 🎉</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {timelineSteps.filter(step => step.status === 'current').length}
              </div>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">In Progress</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Keep going! 💪</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-400 dark:text-gray-500">
                {timelineSteps.filter(step => step.status === 'upcoming').length}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Upcoming</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Ready to start! 🚀</div>
          </div>
        </div>
        
        {/* Progress bar for overall completion */}
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
              {Math.round(timelineSteps.reduce((acc, step) => acc + step.progress, 0) / timelineSteps.length)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 shadow-inner">
            <div 
              className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 relative overflow-hidden"
              style={{ 
                width: `${Math.round(timelineSteps.reduce((acc, step) => acc + step.progress, 0) / timelineSteps.length)}%` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

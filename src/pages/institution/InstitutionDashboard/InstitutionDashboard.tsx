import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Users, 
  GraduationCap, 
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
  RefreshCw,
  Award,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Progress } from '../../../components/ui/Progress';
import { useInstitutionAccounts } from './InstitutionDashboard.hooks';
import { AccountStats } from './InstitutionDashboard.types';

interface DashboardStats extends AccountStats {
  recentAdditions: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'student_registered' | 'teacher_added' | 'account_updated';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}


interface PerformanceMetric {
  id: string;
  label: string;
  value: number;
  color: string;
}

export const InstitutionDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats: accountStats, fetchStats } = useInstitutionAccounts();
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch account stats
      await fetchStats();
      
      // Simulate additional data loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock recent activity data
      setRecentActivity([
        {
          id: '1',
          type: 'student_registered',
          title: 'New Student Registration',
          description: 'John Doe registered for Computer Science program',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: 'John Doe'
        },
        {
          id: '2',
          type: 'teacher_added',
          title: 'New Teacher Added',
          description: 'Dr. Sarah Johnson joined as Computer Science mentor',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          user: 'Dr. Sarah Johnson'
        },
        {
          id: '3',
          type: 'student_registered',
          title: 'New Student Registration',
          description: 'Jane Smith registered for Engineering program',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          user: 'Jane Smith'
        },
        {
          id: '4',
          type: 'teacher_added',
          title: 'New Teacher Added',
          description: 'Prof. Michael Brown joined as Mathematics mentor',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          user: 'Prof. Michael Brown'
        },
        {
          id: '5',
          type: 'account_updated',
          title: 'Account Updated',
          description: 'Updated student profile for Emma Wilson',
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          user: 'Emma Wilson'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Compute dashboard stats from account stats
  useEffect(() => {
    if (accountStats) {
      setDashboardStats({
        ...accountStats,
        recentAdditions: accountStats.recentAccounts,
        completionRate: accountStats.activeAccounts > 0 
          ? Math.round((accountStats.activeAccounts / (accountStats.totalStudents + accountStats.totalMentors)) * 100)
          : 0
      });
    }
  }, [accountStats]);


  const performanceMetrics: PerformanceMetric[] = useMemo(() => [
    { id: 'engagement', label: 'Student Engagement', value: 87, color: 'bg-blue-500' },
    { id: 'activity', label: 'Teacher Activity', value: 92, color: 'bg-green-500' },
    { id: 'completion', label: 'Profile Completion', value: 78, color: 'bg-purple-500' },
    { id: 'creation', label: 'Account Creation Rate', value: 95, color: 'bg-amber-500' }
  ], []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'student_registered':
        return <GraduationCap className="h-5 w-5 text-green-600" />;
      case 'teacher_added':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'account_updated':
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMs = now.getTime() - then.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return then.toLocaleDateString();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="text-muted-foreground text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="text-destructive text-center">
          <Activity className="h-16 w-16 mx-auto mb-4" />
          <p className="text-lg font-semibold">{error}</p>
        </div>
        <Button onClick={loadDashboardData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {user?.firstName} {user?.lastName}!
            </h2>
            <p className="text-blue-100 text-lg mb-4">
              {user?.university || 'Your Institution'}
            </p>
            <p className="text-blue-50 max-w-2xl">
              Create and manage student and teacher accounts for your institution. 
              Use the navigation menu to access different sections.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Students</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                    {dashboardStats.totalStudents.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Registered students
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-300">Total Teachers</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                    {dashboardStats.totalMentors.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Active mentors
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Recent Additions</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                    {dashboardStats.recentAdditions}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Last 7 days
                  </p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Active Accounts</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                    {dashboardStats.completionRate}%
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {dashboardStats.activeAccounts} of {dashboardStats.totalStudents + dashboardStats.totalMentors} total
                  </p>
                </div>
                <div className="p-3 bg-amber-500 rounded-full">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}


      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/app/institution-dashboard/activity')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-muted rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm">{activity.title}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      {activity.user && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {activity.user}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* Performance Overview */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Overview
              </h3>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/app/institution-dashboard/analytics')}>
                Details
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {performanceMetrics.map((metric) => (
                <div key={metric.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{metric.label}</span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={metric.value} 
                      className="h-3"
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {metric.value >= 90 ? 'Excellent' : metric.value >= 75 ? 'Good' : metric.value >= 60 ? 'Fair' : 'Needs Attention'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Overall Performance</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your institution is performing well across all metrics. Keep up the great work!
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

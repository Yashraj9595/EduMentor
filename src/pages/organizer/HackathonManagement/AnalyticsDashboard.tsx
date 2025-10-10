import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Download,
  Star,
  Activity,
  Eye,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/SelectNew';
import { Progress } from '../../../components/ui/Progress';

interface AnalyticsData {
  overview: {
    totalParticipants: number;
    totalTeams: number;
    totalSubmissions: number;
    averageScore: number;
    completionRate: number;
  };
  participation: {
    daily: { date: string; registrations: number; submissions: number }[];
    byCategory: { category: string; count: number }[];
    byExperience: { level: string; count: number }[];
  };
  submissions: {
    status: { status: string; count: number }[];
    scores: { range: string; count: number }[];
    topProjects: { name: string; team: string; score: number }[];
  };
  engagement: {
    judges: { name: string; reviewsCompleted: number; averageRating: number }[];
    feedback: { positive: number; negative: number; neutral: number };
    activity: { date: string; actions: number }[];
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  // const [selectedMetric, setSelectedMetric] = useState('participation');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockData: AnalyticsData = {
        overview: {
          totalParticipants: 156,
          totalTeams: 42,
          totalSubmissions: 38,
          averageScore: 4.2,
          completionRate: 90.5
        },
        participation: {
          daily: [
            { date: '2025-01-15', registrations: 12, submissions: 0 },
            { date: '2025-01-16', registrations: 18, submissions: 0 },
            { date: '2025-01-17', registrations: 15, submissions: 0 },
            { date: '2025-01-18', registrations: 22, submissions: 0 },
            { date: '2025-01-19', registrations: 8, submissions: 0 },
            { date: '2025-01-20', registrations: 5, submissions: 12 },
            { date: '2025-01-21', registrations: 3, submissions: 18 },
            { date: '2025-01-22', registrations: 2, submissions: 8 }
          ],
          byCategory: [
            { category: 'AI/ML', count: 15 },
            { category: 'Web Development', count: 12 },
            { category: 'Mobile Development', count: 8 },
            { category: 'Data Science', count: 7 },
            { category: 'IoT', count: 5 }
          ],
          byExperience: [
            { level: 'Beginner', count: 45 },
            { level: 'Intermediate', count: 78 },
            { level: 'Advanced', count: 33 }
          ]
        },
        submissions: {
          status: [
            { status: 'Submitted', count: 38 },
            { status: 'Under Review', count: 25 },
            { status: 'Reviewed', count: 13 },
            { status: 'Finalist', count: 8 },
            { status: 'Winner', count: 3 }
          ],
          scores: [
            { range: '1-2', count: 2 },
            { range: '2-3', count: 5 },
            { range: '3-4', count: 15 },
            { range: '4-5', count: 16 }
          ],
          topProjects: [
            { name: 'AI Healthcare Assistant', team: 'Tech Innovators', score: 4.8 },
            { name: 'Smart City Analytics', team: 'Data Wizards', score: 4.6 },
            { name: 'EcoTracker', team: 'GreenTech', score: 4.5 },
            { name: 'EduConnect', team: 'Learning Squad', score: 4.4 },
            { name: 'HealthMonitor', team: 'MedTech', score: 4.3 }
          ]
        },
        engagement: {
          judges: [
            { name: 'Dr. Sarah Johnson', reviewsCompleted: 15, averageRating: 4.8 },
            { name: 'Mike Chen', reviewsCompleted: 12, averageRating: 4.6 },
            { name: 'Alex Rodriguez', reviewsCompleted: 10, averageRating: 4.7 },
            { name: 'Lisa Wang', reviewsCompleted: 8, averageRating: 4.5 }
          ],
          feedback: {
            positive: 85,
            negative: 8,
            neutral: 7
          },
          activity: [
            { date: '2025-01-15', actions: 45 },
            { date: '2025-01-16', actions: 52 },
            { date: '2025-01-17', actions: 38 },
            { date: '2025-01-18', actions: 61 },
            { date: '2025-01-19', actions: 29 },
            { date: '2025-01-20', actions: 78 },
            { date: '2025-01-21', actions: 89 },
            { date: '2025-01-22', actions: 67 }
          ]
        }
      };
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Simulate report export
    console.log('Exporting analytics report...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your hackathon</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/app/hackathon-dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/app/organizer/hackathons')}
          >
            Hackathons
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/app/organizer/hackathons/create')}
          >
            Create Hackathon
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/app/organizer/hackathons/teams')}
          >
            Team Management
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/app/organizer/hackathons/judging')}
          >
            Judging System
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalTeams}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalSubmissions}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{analyticsData.overview.averageScore}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Participation by Category */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Participation by Category</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analyticsData.participation.byCategory.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(item.count / Math.max(...analyticsData.participation.byCategory.map(c => c.count))) * 100} 
                      className="w-24 h-2" 
                    />
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Experience Level Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Experience Level Distribution</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analyticsData.participation.byExperience.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.level}</span>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(item.count / Math.max(...analyticsData.participation.byExperience.map(e => e.count))) * 100} 
                      className="w-24 h-2" 
                    />
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Submission Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Submission Status</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analyticsData.submissions.status.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.status}</span>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(item.count / Math.max(...analyticsData.submissions.status.map(s => s.count))) * 100} 
                      className="w-24 h-2" 
                    />
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Score Distribution</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analyticsData.submissions.scores.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.range}</span>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(item.count / Math.max(...analyticsData.submissions.scores.map(s => s.count))) * 100} 
                      className="w-24 h-2" 
                    />
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Projects */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Performing Projects</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {analyticsData.submissions.topProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">by {project.team}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold">{project.score}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Judge Performance */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Judge Performance</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {analyticsData.engagement.judges.map((judge, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {judge.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{judge.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {judge.reviewsCompleted} reviews completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="font-bold">{judge.averageRating}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Reviews</p>
                    <p className="font-bold">{judge.reviewsCompleted}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Feedback Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Feedback Sentiment</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Positive</span>
                </div>
                <span className="font-bold">{analyticsData.engagement.feedback.positive}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="font-bold">{analyticsData.engagement.feedback.neutral}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Negative</span>
                </div>
                <span className="font-bold">{analyticsData.engagement.feedback.negative}%</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Daily Activity</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {analyticsData.engagement.activity.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(day.actions / 100) * 100} className="w-16 h-2" />
                    <span className="text-sm font-medium">{day.actions}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Key Metrics</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{analyticsData.overview.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analyticsData.overview.averageScore}/5</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalSubmissions}</p>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Star, 
  Award, 
  CheckCircle, 
  Eye, 
  Edit, 
  Plus,
  X,
  Trophy,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/SelectNew';
import { Badge } from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui/Progress';

interface Judge {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  expertise: string[];
  assignedCategories: string[];
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  reviewsCompleted: number;
  totalReviews: number;
}

interface Submission {
  id: string;
  teamName: string;
  projectName: string;
  description: string;
  category: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'reviewed' | 'finalist' | 'winner';
  scores: {
    innovation: number;
    technical: number;
    presentation: number;
    impact: number;
    overall: number;
  };
  reviews: Review[];
}

interface Review {
  id: string;
  judgeId: string;
  judgeName: string;
  scores: {
    innovation: number;
    technical: number;
    presentation: number;
    impact: number;
  };
  comments: string;
  strengths: string;
  improvements: string;
  submittedAt: string;
}

interface JudgingCriteria {
  innovation: {
    weight: number;
    description: string;
    questions: string[];
  };
  technical: {
    weight: number;
    description: string;
    questions: string[];
  };
  presentation: {
    weight: number;
    description: string;
    questions: string[];
  };
  impact: {
    weight: number;
    description: string;
    questions: string[];
  };
}

export const JudgingSystem: React.FC = () => {
  const navigate = useNavigate();
  const [judges, setJudges] = useState<Judge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [newJudge, setNewJudge] = useState({
    name: '',
    email: '',
    title: '',
    company: '',
    expertise: [] as string[],
    assignedCategories: [] as string[]
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'judges' | 'submissions' | 'criteria'>('judges');

  const judgingCriteria: JudgingCriteria = {
    innovation: {
      weight: 25,
      description: 'How innovative and creative is the solution?',
      questions: [
        'Does the solution address a novel problem or approach?',
        'Is the solution creative and original?',
        'Does it demonstrate out-of-the-box thinking?'
      ]
    },
    technical: {
      weight: 25,
      description: 'Technical quality and implementation',
      questions: [
        'Is the technical implementation solid?',
        'Does the code demonstrate good practices?',
        'Is the solution technically feasible?'
      ]
    },
    presentation: {
      weight: 25,
      description: 'Quality of presentation and communication',
      questions: [
        'Is the presentation clear and engaging?',
        'Does the team effectively communicate their solution?',
        'Is the demo well-executed?'
      ]
    },
    impact: {
      weight: 25,
      description: 'Potential impact and scalability',
      questions: [
        'What is the potential impact of this solution?',
        'Is the solution scalable and sustainable?',
        'Does it address a real-world problem?'
      ]
    }
  };

  useEffect(() => {
    fetchJudges();
    fetchSubmissions();
  }, []);

  const fetchJudges = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockJudges: Judge[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah@techcorp.com',
          title: 'CTO',
          company: 'TechCorp',
          expertise: ['AI/ML', 'Software Architecture', 'Product Management'],
          assignedCategories: ['AI/ML', 'Web Development'],
          status: 'active',
          rating: 4.8,
          reviewsCompleted: 12,
          totalReviews: 15
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@startup.com',
          title: 'Senior Developer',
          company: 'StartupXYZ',
          expertise: ['Mobile Development', 'UI/UX', 'React'],
          assignedCategories: ['Mobile Development', 'UI/UX'],
          status: 'active',
          rating: 4.6,
          reviewsCompleted: 8,
          totalReviews: 10
        }
      ];
      setJudges(mockJudges);
    } catch (error) {
      console.error('Error fetching judges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockSubmissions: Submission[] = [
        {
          id: '1',
          teamName: 'Tech Innovators',
          projectName: 'AI Healthcare Assistant',
          description: 'An intelligent healthcare assistant that helps patients with symptom analysis and appointment scheduling.',
          category: 'AI/ML',
          submittedAt: '2025-01-20T10:00:00Z',
          status: 'under_review',
          scores: {
            innovation: 4.5,
            technical: 4.2,
            presentation: 4.0,
            impact: 4.3,
            overall: 4.25
          },
          reviews: []
        },
        {
          id: '2',
          teamName: 'Data Wizards',
          projectName: 'Smart City Analytics',
          description: 'A data analytics platform for smart city management and optimization.',
          category: 'Data Science',
          submittedAt: '2025-01-20T14:30:00Z',
          status: 'reviewed',
          scores: {
            innovation: 4.0,
            technical: 4.5,
            presentation: 4.2,
            impact: 4.1,
            overall: 4.2
          },
          reviews: []
        }
      ];
      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const addJudge = async () => {
    if (!newJudge.name || !newJudge.email) return;

    const judge: Judge = {
      id: Date.now().toString(),
      name: newJudge.name,
      email: newJudge.email,
      title: newJudge.title,
      company: newJudge.company,
      expertise: newJudge.expertise,
      assignedCategories: newJudge.assignedCategories,
      status: 'pending',
      rating: 0,
      reviewsCompleted: 0,
      totalReviews: 0
    };

    setJudges(prev => [...prev, judge]);
    setNewJudge({
      name: '',
      email: '',
      title: '',
      company: '',
      expertise: [],
      assignedCategories: []
    });
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !newJudge.expertise.includes(newExpertise.trim())) {
      setNewJudge(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertise: string) => {
    setNewJudge(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !newJudge.assignedCategories.includes(newCategory.trim())) {
      setNewJudge(prev => ({
        ...prev,
        assignedCategories: [...prev.assignedCategories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setNewJudge(prev => ({
      ...prev,
      assignedCategories: prev.assignedCategories.filter(c => c !== category)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      case 'finalist': return 'bg-purple-100 text-purple-800';
      case 'winner': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Judging System</h1>
            <p className="text-muted-foreground">Manage judges and review submissions</p>
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
              onClick={() => navigate('/app/organizer/hackathons/analytics')}
            >
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'judges', label: 'Judges', icon: Users },
          { id: 'submissions', label: 'Submissions', icon: Award },
          { id: 'criteria', label: 'Criteria', icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Judges Tab */}
      {activeTab === 'judges' && (
        <div className="space-y-6">
          {/* Add Judge Form */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Add New Judge</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="judgeName">Name *</Label>
                  <Input
                    id="judgeName"
                    value={newJudge.name}
                    onChange={(e) => setNewJudge(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter judge name"
                  />
                </div>
                <div>
                  <Label htmlFor="judgeEmail">Email *</Label>
                  <Input
                    id="judgeEmail"
                    type="email"
                    value={newJudge.email}
                    onChange={(e) => setNewJudge(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter judge email"
                  />
                </div>
                <div>
                  <Label htmlFor="judgeTitle">Title</Label>
                  <Input
                    id="judgeTitle"
                    value={newJudge.title}
                    onChange={(e) => setNewJudge(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <Label htmlFor="judgeCompany">Company</Label>
                  <Input
                    id="judgeCompany"
                    value={newJudge.company}
                    onChange={(e) => setNewJudge(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <Label>Expertise Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {newJudge.expertise.map((expertise, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {expertise}
                      <button
                        onClick={() => removeExpertise(expertise)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add expertise area"
                    onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                  />
                  <Button onClick={addExpertise} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Assigned Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {newJudge.assignedCategories.map((category, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {category}
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add category"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <Button onClick={addCategory} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={addJudge} disabled={!newJudge.name || !newJudge.email}>
                <Plus className="h-4 w-4 mr-2" />
                Add Judge
              </Button>
            </CardBody>
          </Card>

          {/* Judges List */}
          <div className="space-y-4">
            {judges.map((judge) => (
              <Card key={judge.id}>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{judge.name}</h3>
                        <Badge className={getStatusColor(judge.status)}>
                          {judge.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{judge.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-2">{judge.title} at {judge.company}</p>
                      <p className="text-sm text-muted-foreground mb-4">{judge.email}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {judge.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Assigned Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {judge.assignedCategories.map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{judge.reviewsCompleted} reviews completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{judge.totalReviews} total assigned</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Select value={judge.status} onValueChange={(value) => {
                        setJudges(prev => prev.map(j => 
                          j.id === judge.id ? { ...j, status: value as Judge['status'] } : j
                        ));
                      }}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Submissions</h3>
              {submissions.map((submission) => (
                <Card 
                  key={submission.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedSubmission?.id === submission.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{submission.projectName}</h4>
                          <Badge className={getSubmissionStatusColor(submission.status)}>
                            {submission.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{submission.teamName}</p>
                        <p className="text-sm mb-3">{submission.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {submission.category}</span>
                          <span>Score: {submission.scores.overall}/5</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Submission Details */}
            {selectedSubmission && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Submission Details</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div>
                      <h4 className="font-medium">Project: {selectedSubmission.projectName}</h4>
                      <p className="text-sm text-muted-foreground">by {selectedSubmission.teamName}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm">{selectedSubmission.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Scores</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedSubmission.scores).map(([key, value]) => (
                          key !== 'overall' && (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{key}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={(value / 5) * 100} className="w-20 h-2" />
                                <span className="text-sm font-medium">{value}/5</span>
                              </div>
                            </div>
                          )
                        ))}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="font-medium">Overall</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(selectedSubmission.scores.overall / 5) * 100} className="w-20 h-2" />
                            <span className="font-bold">{selectedSubmission.scores.overall}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Scores
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Criteria Tab */}
      {activeTab === 'criteria' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Judging Criteria</h3>
              <p className="text-muted-foreground">Define how submissions will be evaluated</p>
            </CardHeader>
            <CardBody className="space-y-6">
              {Object.entries(judgingCriteria).map(([key, criteria]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium capitalize">{key}</h4>
                    <Badge variant="outline">{criteria.weight}%</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{criteria.description}</p>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Evaluation Questions:</h5>
                    <ul className="space-y-1">
                      {criteria.questions.map((question: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Judges</p>
                <p className="text-2xl font-bold">{judges.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Judges</p>
                <p className="text-2xl font-bold">{judges.filter(j => j.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews Completed</p>
                <p className="text-2xl font-bold">
                  {judges.reduce((sum, judge) => sum + judge.reviewsCompleted, 0)}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

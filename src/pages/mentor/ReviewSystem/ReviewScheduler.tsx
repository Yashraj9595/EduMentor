import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Send,
  CheckCircle,
  AlertTriangle,
  Star,
  FileText,
  MessageCircle,
  Download,
  Filter,
  Search,
  ChevronRight,
  User,
  BookOpen,
  Award,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface Review {
  _id: string;
  projectId: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    title: string;
    description: string;
  };
  title: string;
  description?: string;
  reviewType: 'proposal' | 'mid_term' | 'final' | 'custom';
  scheduledDate: string;
  actualDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  evaluationCriteria: Array<{
    criterion: string;
    weight: number;
    maxScore: number;
    score?: number;
    comments?: string;
  }>;
  overallScore?: number;
  maxScore: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    generalComments: string;
  };
  mentorNotes?: string;
  studentResponse?: string;
  isRescheduled: boolean;
  rescheduleReason?: string;
}

interface Project {
  _id: string;
  title: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
  startDate: string;
  endDate: string;
}

export const ReviewScheduler: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Form state for creating/editing reviews
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    reviewType: 'proposal' as 'proposal' | 'mid_term' | 'final' | 'custom',
    scheduledDate: '',
    evaluationCriteria: [] as Array<{
      criterion: string;
      weight: number;
      maxScore: number;
    }>
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockProjects: Project[] = [
        {
          _id: '1',
          title: 'AI-Powered Healthcare Assistant',
          student: { _id: 'student1', firstName: 'Sarah', lastName: 'Johnson' },
          status: 'in_progress',
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-06-15T00:00:00Z'
        },
        {
          _id: '2',
          title: 'E-commerce Platform with ML Recommendations',
          student: { _id: 'student2', firstName: 'Mike', lastName: 'Chen' },
          status: 'in_progress',
          startDate: '2024-01-10T00:00:00Z',
          endDate: '2024-05-10T00:00:00Z'
        },
        {
          _id: '3',
          title: 'IoT Smart Home System',
          student: { _id: 'student3', firstName: 'Emily', lastName: 'Davis' },
          status: 'under_review',
          startDate: '2023-12-01T00:00:00Z',
          endDate: '2024-03-01T00:00:00Z'
        }
      ];

      const mockReviews: Review[] = [
        {
          _id: '1',
          projectId: '1',
          student: { _id: 'student1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com' },
          project: { title: 'AI-Powered Healthcare Assistant', description: 'An intelligent healthcare assistant using ML' },
          title: 'Mid-term Review',
          description: 'Comprehensive review of project progress and implementation',
          reviewType: 'mid_term',
          scheduledDate: '2024-02-15T10:00:00Z',
          status: 'scheduled',
          evaluationCriteria: [
            { criterion: 'Technical Implementation', weight: 30, maxScore: 30 },
            { criterion: 'Documentation Quality', weight: 20, maxScore: 20 },
            { criterion: 'Code Quality', weight: 25, maxScore: 25 },
            { criterion: 'Presentation', weight: 25, maxScore: 25 }
          ],
          maxScore: 100,
          feedback: {
            strengths: [],
            improvements: [],
            recommendations: [],
            generalComments: ''
          },
          isRescheduled: false
        },
        {
          _id: '2',
          projectId: '2',
          student: { _id: 'student2', firstName: 'Mike', lastName: 'Chen', email: 'mike.chen@email.com' },
          project: { title: 'E-commerce Platform with ML Recommendations', description: 'E-commerce platform with ML-based recommendations' },
          title: 'Proposal Review',
          description: 'Initial project proposal evaluation',
          reviewType: 'proposal',
          scheduledDate: '2024-01-25T14:00:00Z',
          actualDate: '2024-01-25T14:30:00Z',
          status: 'completed',
          evaluationCriteria: [
            { criterion: 'Problem Definition', weight: 25, maxScore: 25, score: 22 },
            { criterion: 'Technical Approach', weight: 30, maxScore: 30, score: 26 },
            { criterion: 'Timeline Feasibility', weight: 20, maxScore: 20, score: 18 },
            { criterion: 'Innovation', weight: 25, maxScore: 25, score: 20 }
          ],
          overallScore: 86,
          maxScore: 100,
          feedback: {
            strengths: ['Clear problem definition', 'Good technical approach', 'Realistic timeline'],
            improvements: ['Add more technical details', 'Include risk assessment'],
            recommendations: ['Consider scalability aspects', 'Plan for testing strategy'],
            generalComments: 'Excellent proposal with good technical foundation. Minor improvements needed in documentation.'
          },
          mentorNotes: 'Student shows strong understanding of the problem domain.',
          studentResponse: 'Thank you for the feedback. I will incorporate the suggested improvements.',
          isRescheduled: false
        },
        {
          _id: '3',
          projectId: '3',
          student: { _id: 'student3', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@email.com' },
          project: { title: 'IoT Smart Home System', description: 'IoT-based smart home automation system' },
          title: 'Final Review',
          description: 'Final project evaluation and assessment',
          reviewType: 'final',
          scheduledDate: '2024-02-28T09:00:00Z',
          status: 'scheduled',
          evaluationCriteria: [
            { criterion: 'Final Implementation', weight: 40, maxScore: 40 },
            { criterion: 'Documentation', weight: 20, maxScore: 20 },
            { criterion: 'Testing & Validation', weight: 20, maxScore: 20 },
            { criterion: 'Presentation & Demo', weight: 20, maxScore: 20 }
          ],
          maxScore: 100,
          feedback: {
            strengths: [],
            improvements: [],
            recommendations: [],
            generalComments: ''
          },
          isRescheduled: false
        }
      ];

      setProjects(mockProjects);
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${review.student.firstName} ${review.student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesType = filterType === 'all' || review.reviewType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateReview = () => {
    // In real app, this would make API call
    console.log('Creating review:', formData);
    setShowCreateForm(false);
    setFormData({
      projectId: '',
      title: '',
      description: '',
      reviewType: 'proposal',
      scheduledDate: '',
      evaluationCriteria: []
    });
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      projectId: review.projectId,
      title: review.title,
      description: review.description || '',
      reviewType: review.reviewType,
      scheduledDate: review.scheduledDate.split('T')[0],
      evaluationCriteria: review.evaluationCriteria.map(c => ({
        criterion: c.criterion,
        weight: c.weight,
        maxScore: c.maxScore
      }))
    });
    setShowCreateForm(true);
  };

  const addEvaluationCriterion = () => {
    setFormData({
      ...formData,
      evaluationCriteria: [
        ...formData.evaluationCriteria,
        { criterion: '', weight: 0, maxScore: 0 }
      ]
    });
  };

  const updateEvaluationCriterion = (index: number, field: string, value: any) => {
    const updated = [...formData.evaluationCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, evaluationCriteria: updated });
  };

  const removeEvaluationCriterion = (index: number) => {
    const updated = formData.evaluationCriteria.filter((_, i) => i !== index);
    setFormData({ ...formData, evaluationCriteria: updated });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Review Scheduler
          </h1>
          <p className="text-muted-foreground mt-2">Schedule and manage project reviews with students</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Review
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'completed').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'scheduled').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">
                  {reviews.filter(r => r.overallScore).length > 0 
                    ? Math.round(reviews.filter(r => r.overallScore).reduce((sum, r) => sum + (r.overallScore || 0), 0) / reviews.filter(r => r.overallScore).length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search reviews, students, or projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-border rounded-md"
        >
          <option value="all">All Types</option>
          <option value="proposal">Proposal</option>
          <option value="mid_term">Mid-term</option>
          <option value="final">Final</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review._id}>
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{review.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {getStatusIcon(review.status)}
                      {review.status.replace('_', ' ')}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {review.reviewType.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{review.student.firstName} {review.student.lastName}</span>
                    </div>
                    <span>•</span>
                    <span>{review.project.title}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    {review.actualDate && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Completed: {new Date(review.actualDate).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {review.description && (
                    <p className="text-gray-700 mb-4">{review.description}</p>
                  )}

                  {/* Evaluation Criteria */}
                  {review.evaluationCriteria.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Evaluation Criteria:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {review.evaluationCriteria.map((criterion, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{criterion.criterion}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {criterion.score !== undefined ? `${criterion.score}/${criterion.maxScore}` : `0/${criterion.maxScore}`}
                              </span>
                              {criterion.score !== undefined && (
                                <div className="w-16 bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-primary h-1 rounded-full"
                                    style={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overall Score */}
                  {review.overallScore !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Overall Score:</span>
                        <span className="text-lg font-bold text-primary">{review.overallScore}/{review.maxScore}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(review.overallScore / review.maxScore) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {review.feedback.generalComments && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Feedback:</h4>
                      <p className="text-blue-700">{review.feedback.generalComments}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleEditReview(review)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Create/Edit Review Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedReview ? 'Edit Review' : 'Schedule New Review'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.title} - {project.student.firstName} {project.student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter review title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter review description"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Review Type</label>
                  <select
                    value={formData.reviewType}
                    onChange={(e) => setFormData({ ...formData, reviewType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="proposal">Proposal</option>
                    <option value="mid_term">Mid-term</option>
                    <option value="final">Final</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scheduled Date</label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Evaluation Criteria</label>
                  <Button type="button" variant="secondary" size="sm" onClick={addEvaluationCriterion}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Criterion
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.evaluationCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-lg">
                      <Input
                        value={criterion.criterion}
                        onChange={(e) => updateEvaluationCriterion(index, 'criterion', e.target.value)}
                        placeholder="Criterion name"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={criterion.weight}
                        onChange={(e) => updateEvaluationCriterion(index, 'weight', parseInt(e.target.value) || 0)}
                        placeholder="Weight %"
                        className="w-20"
                      />
                      <Input
                        type="number"
                        value={criterion.maxScore}
                        onChange={(e) => updateEvaluationCriterion(index, 'maxScore', parseInt(e.target.value) || 0)}
                        placeholder="Max Score"
                        className="w-20"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeEvaluationCriterion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReview}>
                {selectedReview ? 'Update Review' : 'Schedule Review'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  TrendingUp,
  Send,
  Download,
  Search,
  Filter,
  Star,
  MessageSquare,
  FileText,
  Award,
  BarChart3
} from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

interface Review {
  _id: string;
  projectId: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    _id: string;
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
    _id?: string;
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
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
  startDate: string;
  endDate: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const ReviewScheduler: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
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

  // Form state for conducting reviews
  const [reviewForm, setReviewForm] = useState({
    strengths: [] as string[],
    improvements: [] as string[],
    recommendations: [] as string[],
    generalComments: '',
    mentorNotes: '',
    evaluationScores: [] as Array<{ criterionId: string; score: number; comments: string }>,
    newStrength: '',
    newImprovement: '',
    newRecommendation: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch mentor projects
      const projectsResponse = await apiService.get<ApiResponse<Project[]>>('/projects/mentor-projects');
      if (projectsResponse.data && projectsResponse.data.success) {
        const formattedProjects = projectsResponse.data.data.map((project: any) => ({
          _id: project._id,
          title: project.title,
          studentId: project.studentId,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate
        }));
        setProjects(formattedProjects);
      }

      // Fetch reviews for mentor's projects
      const reviewsResponse = await apiService.get<ApiResponse<Review[]>>('/reviews/mentor-reviews');
      if (reviewsResponse.data && reviewsResponse.data.success) {
        setReviews(reviewsResponse.data.data);
      } else {
        // Fallback to mock data if API fails
        const mockReviews: Review[] = [
          {
            _id: '1',
            projectId: '1',
            studentId: { _id: 'student1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com' },
            project: { _id: '1', title: 'AI-Powered Healthcare Assistant', description: 'An intelligent healthcare assistant using ML' },
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
            studentId: { _id: 'student2', firstName: 'Mike', lastName: 'Chen', email: 'mike.chen@email.com' },
            project: { _id: '2', title: 'E-commerce Platform with ML Recommendations', description: 'E-commerce platform with ML-based recommendations' },
            title: 'Proposal Review',
            description: 'Initial project proposal evaluation',
            reviewType: 'proposal',
            scheduledDate: '2024-01-25T14:00:00Z',
            actualDate: '2024-01-25T14:30:00Z',
            status: 'completed',
            evaluationCriteria: [
              { _id: 'c1', criterion: 'Problem Definition', weight: 25, maxScore: 25, score: 22 },
              { _id: 'c2', criterion: 'Technical Approach', weight: 30, maxScore: 30, score: 26 },
              { _id: 'c3', criterion: 'Timeline Feasibility', weight: 20, maxScore: 20, score: 18 },
              { _id: 'c4', criterion: 'Innovation', weight: 25, maxScore: 25, score: 20 }
            ],
            overallScore: 86,
            maxScore: 100,
            feedback: {
              strengths: [
                'Clear problem statement and well-defined objectives',
                'Good understanding of the technology stack'
              ],
              improvements: [
                'Need more detailed timeline with specific milestones',
                'Should include risk assessment and mitigation strategies'
              ],
              recommendations: [
                'Add more technical details about the ML algorithms to be used',
                'Consider scalability requirements in the architecture design'
              ],
              generalComments: 'Good start on the proposal. Address the feedback points and resubmit for final approval.'
            },
            mentorNotes: 'Student showed good preparation and understanding of the project requirements.',
            isRescheduled: false
          }
        ];
        setReviews(mockReviews);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedReview) {
        // Update existing review
        const response = await apiService.put<ApiResponse<Review>>(`/reviews/${selectedReview._id}`, formData);
        if (response.data && response.data.success) {
          setReviews(reviews.map(review => 
            review._id === selectedReview._id ? response.data!.data : review
          ));
        }
      } else {
        // Create new review
        const response = await apiService.post<ApiResponse<Review>>('/reviews', formData);
        if (response.data && response.data.success) {
          setReviews([...reviews, response.data.data]);
        }
      }
      
      setShowCreateForm(false);
      setFormData({
        projectId: '',
        title: '',
        description: '',
        reviewType: 'proposal',
        scheduledDate: '',
        evaluationCriteria: []
      });
      setSelectedReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedReview) return;
      
      // Submit completed review
      const response = await apiService.put<ApiResponse<Review>>(`/reviews/${selectedReview._id}/complete`, {
        ...reviewForm,
        status: 'completed',
        actualDate: new Date().toISOString()
      });
      
      if (response.data && response.data.success) {
        setReviews(reviews.map(review => 
          review._id === selectedReview._id ? response.data!.data : review
        ));
        setShowReviewModal(false);
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await apiService.delete<ApiResponse<any>>(`/reviews/${id}`);
      if (response.success) {
        setReviews(reviews.filter(review => review._id !== id));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleStartReview = (review: Review) => {
    setSelectedReview(review);
    setReviewForm({
      strengths: review.feedback.strengths || [],
      improvements: review.feedback.improvements || [],
      recommendations: review.feedback.recommendations || [],
      generalComments: review.feedback.generalComments || '',
      mentorNotes: review.mentorNotes || '',
      evaluationScores: review.evaluationCriteria.map(criterion => ({
        criterionId: criterion._id || '',
        score: criterion.score || 0,
        comments: criterion.comments || ''
      })),
      newStrength: '',
      newImprovement: '',
      newRecommendation: ''
    });
    setShowReviewModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'mid_term': return 'bg-purple-100 text-purple-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${review.studentId.firstName} ${review.studentId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesType = filterType === 'all' || review.reviewType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getReviewStats = () => {
    return {
      total: reviews.length,
      scheduled: reviews.filter(r => r.status === 'scheduled').length,
      completed: reviews.filter(r => r.status === 'completed').length,
      inProgress: reviews.filter(r => r.status === 'in_progress').length,
      cancelled: reviews.filter(r => r.status === 'cancelled').length
    };
  };

  const stats = getReviewStats();

  const addEvaluationCriterion = () => {
    setFormData({
      ...formData,
      evaluationCriteria: [
        ...formData.evaluationCriteria,
        { criterion: '', weight: 0, maxScore: 0 }
      ]
    });
  };

  const updateEvaluationCriterion = (index: number, field: string, value: string | number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    (updatedCriteria[index] as any)[field] = value;
    setFormData({
      ...formData,
      evaluationCriteria: updatedCriteria
    });
  };

  const removeEvaluationCriterion = (index: number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    updatedCriteria.splice(index, 1);
    setFormData({
      ...formData,
      evaluationCriteria: updatedCriteria
    });
  };

  const addStrength = () => {
    if (reviewForm.newStrength.trim()) {
      setReviewForm({
        ...reviewForm,
        strengths: [...reviewForm.strengths, reviewForm.newStrength.trim()],
        newStrength: ''
      });
    }
  };

  const removeStrength = (index: number) => {
    const updatedStrengths = [...reviewForm.strengths];
    updatedStrengths.splice(index, 1);
    setReviewForm({
      ...reviewForm,
      strengths: updatedStrengths
    });
  };

  const addImprovement = () => {
    if (reviewForm.newImprovement.trim()) {
      setReviewForm({
        ...reviewForm,
        improvements: [...reviewForm.improvements, reviewForm.newImprovement.trim()],
        newImprovement: ''
      });
    }
  };

  const removeImprovement = (index: number) => {
    const updatedImprovements = [...reviewForm.improvements];
    updatedImprovements.splice(index, 1);
    setReviewForm({
      ...reviewForm,
      improvements: updatedImprovements
    });
  };

  const addRecommendation = () => {
    if (reviewForm.newRecommendation.trim()) {
      setReviewForm({
        ...reviewForm,
        recommendations: [...reviewForm.recommendations, reviewForm.newRecommendation.trim()],
        newRecommendation: ''
      });
    }
  };

  const removeRecommendation = (index: number) => {
    const updatedRecommendations = [...reviewForm.recommendations];
    updatedRecommendations.splice(index, 1);
    setReviewForm({
      ...reviewForm,
      recommendations: updatedRecommendations
    });
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
          <p className="text-muted-foreground mt-2">Schedule and conduct project reviews for your students</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Review
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="proposal">Proposal</option>
            <option value="mid_term">Mid-term</option>
            <option value="final">Final</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardBody className="p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'No reviews match your search criteria.'
                : 'Get started by scheduling your first review.'}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Review
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <Card key={review._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground mb-1">{review.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.project.title} by {review.studentId.firstName} {review.studentId.lastName}
                    </p>
                  </div>
                  {review.overallScore && (
                    <div className="text-right">
                      <p className="text-2xl font-bold">{review.overallScore}</p>
                      <p className="text-xs text-muted-foreground">/{review.maxScore}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(review.reviewType)}`}>
                      {review.reviewType.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {review.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartReview(review)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Start Review
                      </Button>
                    )}
                    {review.status === 'completed' && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleStartReview(review)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Create Review Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedReview ? 'Edit Review' : 'Schedule New Review'}
              </h2>
              <button 
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedReview(null);
                  setFormData({
                    projectId: '',
                    title: '',
                    description: '',
                    reviewType: 'proposal',
                    scheduledDate: '',
                    evaluationCriteria: []
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.title} - {project.studentId.firstName} {project.studentId.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter review title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter review description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Review Type</label>
                  <select
                    value={formData.reviewType}
                    onChange={(e) => setFormData({...formData, reviewType: e.target.value as any})}
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
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Evaluation Criteria</label>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={addEvaluationCriterion}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Criterion
                  </Button>
                </div>
                
                {formData.evaluationCriteria.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-md">
                    <p className="text-muted-foreground">No evaluation criteria added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.evaluationCriteria.map((criterion, index) => (
                      <div key={index} className="p-3 border border-border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                          <div>
                            <Input
                              placeholder="Criterion name"
                              value={criterion.criterion}
                              onChange={(e) => updateEvaluationCriterion(index, 'criterion', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={criterion.weight}
                              onChange={(e) => updateEvaluationCriterion(index, 'weight', parseInt(e.target.value) || 0)}
                              required
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Max Score"
                              value={criterion.maxScore}
                              onChange={(e) => updateEvaluationCriterion(index, 'maxScore', parseInt(e.target.value) || 0)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeEvaluationCriterion(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setSelectedReview(null);
                    setFormData({
                      projectId: '',
                      title: '',
                      description: '',
                      reviewType: 'proposal',
                      scheduledDate: '',
                      evaluationCriteria: []
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedReview ? 'Update Review' : 'Schedule Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conduct Review Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Conduct Review: {selectedReview.title}</h2>
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedReview(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Project Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Project:</span> {selectedReview.project.title}</p>
                    <p><span className="font-medium">Student:</span> {selectedReview.studentId.firstName} {selectedReview.studentId.lastName}</p>
                    <p><span className="font-medium">Scheduled Date:</span> {new Date(selectedReview.scheduledDate).toLocaleString()}</p>
                    <p><span className="font-medium">Review Type:</span> {selectedReview.reviewType.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Evaluation Summary</h3>
                  <div className="space-y-2">
                    {selectedReview.evaluationCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{criterion.criterion} ({criterion.weight}%)</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max={criterion.maxScore}
                            value={reviewForm.evaluationScores[index]?.score || 0}
                            onChange={(e) => {
                              const updatedScores = [...reviewForm.evaluationScores];
                              updatedScores[index] = {
                                ...updatedScores[index],
                                score: parseInt(e.target.value) || 0
                              };
                              setReviewForm({...reviewForm, evaluationScores: updatedScores});
                            }}
                            className="w-20"
                          />
                          <span className="text-muted-foreground">/ {criterion.maxScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Strengths</h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={reviewForm.newStrength}
                    onChange={(e) => setReviewForm({...reviewForm, newStrength: e.target.value})}
                    placeholder="Add a strength"
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={addStrength}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {reviewForm.strengths.length > 0 && (
                  <div className="space-y-2">
                    {reviewForm.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">{strength}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeStrength(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Areas for Improvement</h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={reviewForm.newImprovement}
                    onChange={(e) => setReviewForm({...reviewForm, newImprovement: e.target.value})}
                    placeholder="Add an improvement area"
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={addImprovement}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {reviewForm.improvements.length > 0 && (
                  <div className="space-y-2">
                    {reviewForm.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">{improvement}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeImprovement(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Recommendations</h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={reviewForm.newRecommendation}
                    onChange={(e) => setReviewForm({...reviewForm, newRecommendation: e.target.value})}
                    placeholder="Add a recommendation"
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={addRecommendation}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {reviewForm.recommendations.length > 0 && (
                  <div className="space-y-2">
                    {reviewForm.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">{recommendation}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeRecommendation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">General Comments</h3>
                <Textarea
                  value={reviewForm.generalComments}
                  onChange={(e) => setReviewForm({...reviewForm, generalComments: e.target.value})}
                  placeholder="Enter general comments about the project"
                  rows={4}
                />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Mentor Notes</h3>
                <Textarea
                  value={reviewForm.mentorNotes}
                  onChange={(e) => setReviewForm({...reviewForm, mentorNotes: e.target.value})}
                  placeholder="Private notes for your reference"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedReview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
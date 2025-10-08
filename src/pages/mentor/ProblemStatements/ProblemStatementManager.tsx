import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/api';

interface ProblemStatement {
  _id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  skillsRequired: string[];
  createdAt: string;
  updatedAt: string;
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  projectCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const ProblemStatementManager: React.FC = () => {
  const { user } = useAuth();
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [editingProblem, setEditingProblem] = useState<ProblemStatement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    technologies: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    estimatedDuration: '4-6 weeks',
    skillsRequired: ''
  });

  // Available categories
  const categories = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 
    'IoT', 'AI/ML', 'Blockchain', 'Cybersecurity', 'Mobile Apps', 
    'Web Development', 'Data Science', 'UI/UX', 'Other'
  ];

  // Difficulty levels with colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Education': 'bg-green-100 text-green-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'E-commerce': 'bg-purple-100 text-purple-800',
      'IoT': 'bg-indigo-100 text-indigo-800',
      'AI/ML': 'bg-pink-100 text-pink-800',
      'Blockchain': 'bg-gray-100 text-gray-800',
      'Cybersecurity': 'bg-orange-100 text-orange-800',
      'Mobile Apps': 'bg-teal-100 text-teal-800',
      'Web Development': 'bg-cyan-100 text-cyan-800',
      'Data Science': 'bg-lime-100 text-lime-800',
      'UI/UX': 'bg-rose-100 text-rose-800',
      'Other': 'bg-muted text-muted-foreground'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchProblemStatements();
  }, []);

  const fetchProblemStatements = async () => {
    try {
      setLoading(true);
      // Fetch mentor's problem statements from the backend
      const response = await apiService.get<ApiResponse<ProblemStatement[]>>('/api/v1/problem-statements/mentor');
      if (response.data && response.data.success) {
        setProblemStatements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching problem statements:', error);
      // Fallback to mock data if API fails
      const mockProblemStatements: ProblemStatement[] = [
        {
          _id: '1',
          title: 'AI-Powered Healthcare Assistant',
          description: 'Develop an intelligent healthcare assistant that can analyze symptoms and provide preliminary diagnoses using machine learning algorithms.',
          category: 'Healthcare',
          technologies: ['Python', 'TensorFlow', 'React', 'Node.js'],
          difficulty: 'advanced',
          estimatedDuration: '8-10 weeks',
          skillsRequired: ['Machine Learning', 'Python', 'React', 'API Development'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:20:00Z',
          postedBy: { _id: user?._id || '', firstName: user?.firstName || '', lastName: user?.lastName || '' },
          isActive: true,
          projectCount: 3
        },
        {
          _id: '2',
          title: 'Smart City Traffic Management',
          description: 'Create a system to optimize traffic flow in urban areas using real-time data analysis and IoT sensors.',
          category: 'IoT',
          technologies: ['Node.js', 'MongoDB', 'React Native', 'MQTT'],
          difficulty: 'intermediate',
          estimatedDuration: '6-8 weeks',
          skillsRequired: ['IoT', 'Node.js', 'Mobile Development', 'Data Analysis'],
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-12T09:15:00Z',
          postedBy: { _id: user?._id || '', firstName: user?.firstName || '', lastName: user?.lastName || '' },
          isActive: true,
          projectCount: 2
        },
        {
          _id: '3',
          title: 'E-learning Platform with Gamification',
          description: 'Build an engaging e-learning platform that incorporates gamification elements to enhance student learning experience.',
          category: 'Education',
          technologies: ['React', 'Firebase', 'Tailwind CSS', 'Redux'],
          difficulty: 'intermediate',
          estimatedDuration: '6-8 weeks',
          skillsRequired: ['React', 'Firebase', 'UI/UX Design', 'Gamification'],
          createdAt: '2024-01-05T09:45:00Z',
          updatedAt: '2024-01-08T16:30:00Z',
          postedBy: { _id: user?._id || '', firstName: user?.firstName || '', lastName: user?.lastName || '' },
          isActive: true,
          projectCount: 5
        },
        {
          _id: '4',
          title: 'Personal Finance Tracker',
          description: 'Develop a mobile application that helps users track their expenses, set budgets, and visualize spending patterns.',
          category: 'Finance',
          technologies: ['React Native', 'SQLite', 'Chart.js', 'Expo'],
          difficulty: 'beginner',
          estimatedDuration: '4-6 weeks',
          skillsRequired: ['Mobile Development', 'Data Visualization', 'SQLite'],
          createdAt: '2024-01-01T11:20:00Z',
          updatedAt: '2024-01-03T13:45:00Z',
          postedBy: { _id: user?._id || '', firstName: user?.firstName || '', lastName: user?.lastName || '' },
          isActive: false,
          projectCount: 1
        }
      ];
      setProblemStatements(mockProblemStatements);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        // Update existing problem statement
        const response = await apiService.put<ApiResponse<ProblemStatement>>(`/api/v1/problem-statements/${editingProblem._id}`, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
          difficulty: formData.difficulty,
          estimatedDuration: formData.estimatedDuration,
          skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
        });
        
        if (response.data && response.data.success) {
          setProblemStatements(problemStatements.map(p => 
            p._id === editingProblem._id ? response.data!.data : p
          ));
        }
      } else {
        // Create new problem statement
        const response = await apiService.post<ApiResponse<ProblemStatement>>('/api/v1/problem-statements', {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
          difficulty: formData.difficulty,
          estimatedDuration: formData.estimatedDuration,
          skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
        });
        
        if (response.data && response.data.success) {
          setProblemStatements([...problemStatements, response.data.data]);
        }
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Technology',
        technologies: '',
        difficulty: 'intermediate',
        estimatedDuration: '4-6 weeks',
        skillsRequired: ''
      });
      setShowForm(false);
      setEditingProblem(null);
    } catch (error) {
      console.error('Error submitting problem statement:', error);
    }
  };

  const handleEdit = (problem: ProblemStatement) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      category: problem.category,
      technologies: problem.technologies.join(', '),
      difficulty: problem.difficulty,
      estimatedDuration: problem.estimatedDuration,
      skillsRequired: problem.skillsRequired.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete problem statement from the backend
      const response = await apiService.delete<ApiResponse<any>>(`/api/v1/problem-statements/${id}`);
      if (response.success) {
        setProblemStatements(problemStatements.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting problem statement:', error);
    }
  };

  const toggleActiveStatus = async (id: string) => {
    try {
      // Toggle active status in the backend
      const problem = problemStatements.find(p => p._id === id);
      if (!problem) return;
      
      const response = await apiService.put<ApiResponse<ProblemStatement>>(`/api/v1/problem-statements/${id}/toggle-active`, {
        isActive: !problem.isActive
      });
      
      if (response.data && response.data.success) {
        setProblemStatements(problemStatements.map(p => 
          p._id === id ? { ...p, isActive: !p.isActive } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const filteredProblems = problemStatements.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || problem.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const uniqueCategories = Array.from(new Set(problemStatements.map(p => p.category)));

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
            <Lightbulb className="w-8 h-8 text-primary" />
            Problem Statement Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage problem statements for students to work on
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Problem Statement
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Problems</p>
                <p className="text-2xl font-bold">{problemStatements.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Problems</p>
                <p className="text-2xl font-bold">{problemStatements.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{problemStatements.reduce((sum, p) => sum + p.projectCount, 0)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold">6-8 weeks</p>
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
            placeholder="Search problem statements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Problem Statements List */}
      {filteredProblems.length === 0 ? (
        <Card>
          <CardBody className="p-12 text-center">
            <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Problem Statements Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== 'all' || filterDifficulty !== 'all'
                ? 'No problem statements match your search criteria.'
                : 'Get started by creating your first problem statement.'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Problem Statement
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => (
            <Card key={problem._id}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{problem.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {problem.description}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleActiveStatus(problem._id)}
                    className={problem.isActive ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}
                  >
                    {problem.isActive ? 'Active' : 'Inactive'}
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(problem.category)}`}>
                    {problem.category}
                  </span>
                  {problem.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {tech}
                    </span>
                  ))}
                  {problem.technologies.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      +{problem.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Duration: {problem.estimatedDuration}</span>
                  <span>{problem.projectCount} projects</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(problem.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleEdit(problem)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleDelete(problem._id)}
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

      {/* Problem Statement Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingProblem ? 'Edit Problem Statement' : 'Create New Problem Statement'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingProblem(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: 'Technology',
                    technologies: '',
                    difficulty: 'intermediate',
                    estimatedDuration: '4-6 weeks',
                    skillsRequired: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter problem statement title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the problem statement in detail"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Duration</label>
                  <Input
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
                    placeholder="e.g., 4-6 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                  <Input
                    value={formData.technologies}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills Required (comma separated)</label>
                <Input
                  value={formData.skillsRequired}
                  onChange={(e) => setFormData({...formData, skillsRequired: e.target.value})}
                  placeholder="e.g., React, API Development, UI/UX Design"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProblem(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'Technology',
                      technologies: '',
                      difficulty: 'intermediate',
                      estimatedDuration: '4-6 weeks',
                      skillsRequired: ''
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProblem ? 'Update Problem Statement' : 'Create Problem Statement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
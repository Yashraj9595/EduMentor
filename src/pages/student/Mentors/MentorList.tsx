import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { 
  Search, 
  User, 
  Star, 
  Mail,
  MessageCircle,
  X,
  BookOpen,
  Calendar,
  Tag
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
  rating: number;
  projectsMentored: number;
  availability: 'available' | 'full' | 'limited';
  bio: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tags: string[];
  status: string;
  category: string;
}

export const MentorList: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterExpertise, setFilterExpertise] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/users/mentors');
      if (response.success && response.data) {
        // Transform API data to match our interface
        const transformedMentors = response.data.map((mentor: any) => ({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          department: mentor.department,
          expertise: mentor.expertise,
          rating: mentor.rating,
          projectsMentored: Math.floor(Math.random() * 30) + 5, // Mock data for now
          availability: ['available', 'limited', 'full'][Math.floor(Math.random() * 3)] as 'available' | 'limited' | 'full',
          bio: mentor.bio
        }));
        setMentors(transformedMentors);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Get unique departments and expertise areas
  const departments = Array.from(new Set(mentors.map(m => m.department)));
  const expertiseAreas = Array.from(new Set(mentors.flatMap(m => m.expertise)));

  // Fetch student projects when modal opens
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await apiService.get<any>('/projects/my-projects');
      setProjects(response.data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mentor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = filterDepartment === 'all' || mentor.department === filterDepartment;
    const matchesExpertise = filterExpertise === 'all' || mentor.expertise.includes(filterExpertise);
    
    return matchesSearch && matchesDepartment && matchesExpertise;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSelectedProject(null);
    setShowProjectModal(true);
    setRequestSuccess(false);
    fetchProjects();
  };

  const handleSendRequest = async () => {
    if (!selectedMentor || !selectedProject) return;
    
    try {
      setRequestLoading(true);
      // Update the project with the selected mentor
      const response = await apiService.put(`/projects/${selectedProject._id}`, {
        mentorId: selectedMentor.id
      });
      
      if (response.success) {
        setRequestSuccess(true);
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowProjectModal(false);
          setRequestSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending mentor request:', err);
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Find a Mentor</h1>
        <p className="text-muted-foreground">Browse and connect with mentors for your projects</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search mentors, departments, expertise..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterExpertise}
            onChange={(e) => setFilterExpertise(e.target.value)}
          >
            <option value="all">All Expertise</option>
            {expertiseAreas.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-medium text-primary">AI Mentor Recommendation</h3>
            <p className="text-sm text-primary/80">
              Based on your skills and project interests, we recommend Dr. Sarah Johnson for your AI project.
            </p>
          </div>
          <button className="ml-auto px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
            View Recommendation
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMentors.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No mentors found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">{mentor.department}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(mentor.availability)}`}>
                    {mentor.availability.charAt(0).toUpperCase() + mentor.availability.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.expertise.map((exp, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-muted-foreground">({mentor.projectsMentored} projects)</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRequestMentor(mentor)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Request
                  </button>
                  <button 
                    onClick={() => navigate(`/app/student/mentors/${mentor.id}/chat`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button 
                    onClick={() => navigate(`/app/student/mentors/${mentor.id}/profile`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Project Selection Modal */}
      {showProjectModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Request {selectedMentor.name} as Mentor
              </h3>
              <button 
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              <p className="text-muted-foreground mb-4">
                Select a project you'd like {selectedMentor.name} to mentor:
              </p>
              
              {requestSuccess ? (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-green-800 mb-1">Request Sent!</h4>
                  <p className="text-sm text-green-600">
                    Your mentor request has been sent to {selectedMentor.name}.
                  </p>
                </div>
              ) : (
                <>
                  {loadingProjects ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-medium mb-1">No projects found</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        You don't have any projects yet.
                      </p>
                      <Button 
                        onClick={() => {
                          setShowProjectModal(false);
                          navigate('/app/student/projects/create');
                        }}
                      >
                        Create Your First Project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <div 
                          key={project._id}
                          onClick={() => setSelectedProject(project)}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedProject?._id === project._id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                selectedProject?._id === project._id 
                                  ? 'border-primary bg-primary' 
                                  : 'border-gray-300'
                              }`}>
                                {selectedProject?._id === project._id && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{project.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {project.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                                <span className="px-2 py-0.5 bg-muted rounded-full">
                                  {project.category}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {project.status.replace('_', ' ')}
                                </span>
                              </div>
                              {project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.tags.slice(0, 3).map((tag) => (
                                    <span 
                                      key={tag} 
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                                    >
                                      <Tag className="w-2.5 h-2.5" />
                                      {tag}
                                    </span>
                                  ))}
                                  {project.tags.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{project.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {!requestSuccess && projects.length > 0 && (
              <div className="p-4 border-t flex justify-end gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowProjectModal(false)}
                  disabled={requestLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendRequest}
                  disabled={!selectedProject || requestLoading}
                  className="flex items-center gap-2"
                >
                  {requestLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
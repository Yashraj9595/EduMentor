import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Lightbulb, 
  Users, 
  Calendar,
  Tag,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Code,
  Globe,
  Smartphone,
  Database,
  Cpu,
  Zap,
  Award,
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

interface TeamMember {
  email: string;
  role: string;
}

interface Milestone {
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ email: '', role: '' }]);
  const [milestones, setMilestones] = useState<Milestone[]>([{ title: '', description: '', dueDate: '', status: 'pending' }]);
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [challenges, setChallenges] = useState<string[]>(['']);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [gallery, setGallery] = useState<Array<{ id: string; url: string; type: 'image' | 'video'; caption: string }>>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    description: '',
    longDescription: '',
    category: '',
    technologies: '',
    tags: '',
    repositoryLink: '',
    liveUrl: '',
    documentationUrl: '',
    startDate: '',
    endDate: '',
    thumbnail: null as File | null,
    videoUrl: '',
    status: 'draft',
    mentorId: ''
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setFetchLoading(true);
      const response = await apiService.get<any>(`/projects/${id}`);
      const project = response.data;
      
      // Populate form data
      setFormData({
        title: project.title || '',
        problemStatement: project.problemStatement || '',
        description: project.description || '',
        longDescription: project.longDescription || '',
        category: project.category || '',
        technologies: project.technologies?.join(', ') || '',
        tags: project.tags?.join(', ') || '',
        repositoryLink: project.repositoryLink || '',
        liveUrl: project.liveUrl || '',
        documentationUrl: project.documentationUrl || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        videoUrl: project.videoUrl || '',
        status: project.status || 'draft',
        mentorId: project.mentorId || '',
        thumbnail: null
      });

      // Populate arrays
      setTeamMembers(project.teamMembers?.length > 0 ? project.teamMembers : [{ email: '', role: '' }]);
      setMilestones(project.milestones?.length > 0 ? project.milestones : [{ title: '', description: '', dueDate: '', status: 'pending' }]);
      setDeliverables(project.deliverables?.length > 0 ? project.deliverables : ['']);
      setObjectives(project.objectives?.length > 0 ? project.objectives : ['']);
      setChallenges(project.challenges?.length > 0 ? project.challenges : ['']);
      setAchievements(project.achievements?.length > 0 ? project.achievements : ['']);
      setGallery(project.gallery?.length > 0 ? project.gallery : []);
      
    } catch (err) {
      setError('Failed to fetch project details');
      console.error('Error fetching project:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        thumbnail: e.target.files![0]
      }));
    }
  };

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'AI/ML', label: 'AI/ML', icon: Cpu },
    { value: 'IoT', label: 'IoT', icon: Zap },
    { value: 'Blockchain', label: 'Blockchain', icon: Database },
    { value: 'Web Development', label: 'Web Development', icon: Globe },
    { value: 'Mobile', label: 'Mobile', icon: Smartphone },
    { value: 'Other', label: 'Other', icon: Code }
  ];

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { email: '', role: '' }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      const updatedMembers = [...teamMembers];
      updatedMembers.splice(index, 1);
      setTeamMembers(updatedMembers);
    }
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setMilestones(updatedMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', dueDate: '', status: 'pending' }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      const updatedMilestones = [...milestones];
      updatedMilestones.splice(index, 1);
      setMilestones(updatedMilestones);
    }
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const updatedDeliverables = [...deliverables];
    updatedDeliverables[index] = value;
    setDeliverables(updatedDeliverables);
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      const updatedDeliverables = [...deliverables];
      updatedDeliverables.splice(index, 1);
      setDeliverables(updatedDeliverables);
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index] = value;
    setObjectives(updatedObjectives);
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      const updatedObjectives = [...objectives];
      updatedObjectives.splice(index, 1);
      setObjectives(updatedObjectives);
    }
  };

  const handleChallengeChange = (index: number, value: string) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index] = value;
    setChallenges(updatedChallenges);
  };

  const addChallenge = () => {
    setChallenges([...challenges, '']);
  };

  const removeChallenge = (index: number) => {
    if (challenges.length > 1) {
      const updatedChallenges = [...challenges];
      updatedChallenges.splice(index, 1);
      setChallenges(updatedChallenges);
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = value;
    setAchievements(updatedAchievements);
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      const updatedAchievements = [...achievements];
      updatedAchievements.splice(index, 1);
      setAchievements(updatedAchievements);
    }
  };

  const handleGalleryItemChange = (index: number, field: 'url' | 'caption' | 'type', value: string) => {
    const updatedGallery = [...gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setGallery(updatedGallery);
  };

  const addGalleryItem = () => {
    setGallery([...gallery, { id: Date.now().toString(), url: '', type: 'image', caption: '' }]);
  };

  const removeGalleryItem = (index: number) => {
    const updatedGallery = [...gallery];
    updatedGallery.splice(index, 1);
    setGallery(updatedGallery);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate dates
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error('End date must be after start date');
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        category: formData.category,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        startDate: formData.startDate,
        endDate: formData.endDate,
        deliverables: deliverables.filter(deliverable => deliverable.trim()),
        milestones: milestones.filter(milestone => milestone.title.trim() && milestone.description.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        problemStatement: formData.problemStatement,
        repositoryLink: formData.repositoryLink,
        liveUrl: formData.liveUrl,
        documentationUrl: formData.documentationUrl,
        videoUrl: formData.videoUrl,
        teamMembers: teamMembers.filter(member => member.email && member.role),
        status: formData.status,
        mentorId: formData.mentorId || undefined,
        objectives: objectives.filter(objective => objective.trim()),
        challenges: challenges.filter(challenge => challenge.trim()),
        achievements: achievements.filter(achievement => achievement.trim()),
        gallery: gallery.filter(item => item.url.trim())
      };

      console.log('Updating project data:', projectData);
      const response = await apiService.put(`/projects/${id}`, projectData);
      console.log('Project update response:', response);
      
      // Show success message and redirect
      alert('Project updated successfully!');
      navigate(`/app/student/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/app/student/projects/${id}`)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">Update your project details</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-1">
                Problem Statement *
              </label>
              <div className="relative">
                <textarea
                  id="problemStatement"
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the problem your project aims to solve"
                />
                <button 
                  type="button"
                  className="absolute bottom-2 right-2 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Lightbulb className="w-4 h-4" />
                  AI Suggestions
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief description of your project"
              />
            </div>

            <div>
              <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Detailed description of your project, including methodology, challenges, and achievements"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies Used
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Python, React, Node.js, etc. (comma separated)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="under_review">Under Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="mentorId" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Mentor (Optional)
                </label>
                <input
                  type="text"
                  id="mentorId"
                  name="mentorId"
                  value={formData.mentorId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Mentor ID or email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags/Keywords
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="AI, IoT, Web Dev, etc. (comma separated)"
                />
                <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Team Members Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label htmlFor={`memberEmail-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Member Email
                  </label>
                  <input
                    type="email"
                    id={`memberEmail-${index}`}
                    value={member.email}
                    onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="team.member@example.com"
                  />
                </div>
                
                <div className="md:col-span-5">
                  <label htmlFor={`memberRole-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id={`memberRole-${index}`}
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Developer, Designer, etc."
                  />
                </div>
                
                <div className="md:col-span-2">
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addTeamMember}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
          </CardBody>
        </Card>

        {/* Milestones Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Project Milestones
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label htmlFor={`milestoneTitle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    id={`milestoneTitle-${index}`}
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Design Phase"
                  />
                </div>
                
                <div className="md:col-span-4">
                  <label htmlFor={`milestoneDescription-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id={`milestoneDescription-${index}`}
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label htmlFor={`milestoneDueDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id={`milestoneDueDate-${index}`}
                    value={milestone.dueDate}
                    onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="md:col-span-1">
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addMilestone}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </button>
          </CardBody>
        </Card>

        {/* Deliverables Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Expected Deliverables
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {deliverables.map((deliverable, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-10">
                  <label htmlFor={`deliverable-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Deliverable
                  </label>
                  <input
                    type="text"
                    id={`deliverable-${index}`}
                    value={deliverable}
                    onChange={(e) => handleDeliverableChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Working prototype, Documentation, Presentation"
                  />
                </div>
                
                <div className="md:col-span-2">
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addDeliverable}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Deliverable
            </button>
          </CardBody>
        </Card>

        {/* Objectives Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Project Objectives
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {objectives.map((objective, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-10">
                  <label htmlFor={`objective-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Objective {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`objective-${index}`}
                    value={objective}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Develop a user-friendly interface for data visualization"
                  />
                </div>
                
                <div className="md:col-span-2">
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addObjective}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Objective
            </button>
          </CardBody>
        </Card>

        {/* Challenges Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Key Challenges
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {challenges.map((challenge, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-10">
                  <label htmlFor={`challenge-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Challenge {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`challenge-${index}`}
                    value={challenge}
                    onChange={(e) => handleChallengeChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Handling large datasets efficiently"
                  />
                </div>
                
                <div className="md:col-span-2">
                  {challenges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChallenge(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addChallenge}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Challenge
            </button>
          </CardBody>
        </Card>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Key Achievements
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-10">
                  <label htmlFor={`achievement-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`achievement-${index}`}
                    value={achievement}
                    onChange={(e) => handleAchievementChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Achieved 95% accuracy in data processing"
                  />
                </div>
                
                <div className="md:col-span-2">
                  {achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addAchievement}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Achievement
            </button>
          </CardBody>
        </Card>

        {/* Gallery Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Project Gallery
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {gallery.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label htmlFor={`galleryUrl-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Media URL
                  </label>
                  <input
                    type="url"
                    id={`galleryUrl-${index}`}
                    value={item.url}
                    onChange={(e) => handleGalleryItemChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor={`galleryType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id={`galleryType-${index}`}
                    value={item.type}
                    onChange={(e) => handleGalleryItemChange(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                <div className="md:col-span-5">
                  <label htmlFor={`galleryCaption-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    id={`galleryCaption-${index}`}
                    value={item.caption}
                    onChange={(e) => handleGalleryItemChange(index, 'caption', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description of the media"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addGalleryItem}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Gallery Item
            </button>
          </CardBody>
        </Card>

        {/* Media & Links Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Media & Links
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                Project Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <label htmlFor="thumbnail" className="cursor-pointer">
                  {formData.thumbnail ? (
                    <div className="space-y-2">
                      <ImageIcon className="w-8 h-8 text-primary mx-auto" />
                      <p className="text-sm text-gray-600">{formData.thumbnail.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Demo Video URL
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://youtube.com/watch?v=example"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="repositoryLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Repository Link
                </label>
                <input
                  type="url"
                  id="repositoryLink"
                  name="repositoryLink"
                  value={formData.repositoryLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://github.com/username/project"
                />
              </div>
              
              <div>
                <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://your-demo.com"
                />
              </div>
              
              <div>
                <label htmlFor="documentationUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Documentation URL
                </label>
                <input
                  type="url"
                  id="documentationUrl"
                  name="documentationUrl"
                  value={formData.documentationUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://docs.your-project.com"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/app/student/projects/${id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
};




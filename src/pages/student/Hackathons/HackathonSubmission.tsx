import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Video,
  Code,
  Camera,
  Link,
  CheckCircle,
  X,
  ArrowLeft,
  Trophy,
  Clock,
  AlertCircle,
  Save,
  Send,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui/Progress';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface SubmissionFile {
  id: string;
  name: string;
  type: 'document' | 'video' | 'image' | 'code' | 'link';
  url: string;
  size?: number;
  uploadedAt: string;
}

interface SubmissionForm {
  projectTitle: string;
  projectDescription: string;
  problemStatement: string;
  solution: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  learnings: string[];
  futurePlans: string;
  demoUrl: string;
  repositoryUrl: string;
  presentationUrl: string;
  files: SubmissionFile[];
  teamMembers: {
    name: string;
    role: string;
    contribution: string;
  }[];
  acknowledgments: string;
  additionalNotes: string;
}

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  requirements: {
    pitchDeck: boolean;
    sourceCode: boolean;
    demoVideo: boolean;
    documentation: boolean;
    teamPhoto: boolean;
    presentation: boolean;
    prototype: boolean;
  };
  submissionStages: {
    id: string;
    name: string;
    type: 'online_ppt' | 'prototype_review' | 'offline_review';
    date: string;
    description: string;
    requirements: string[];
  }[];
}

export const HackathonSubmission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [formData, setFormData] = useState<SubmissionForm>({
    projectTitle: '',
    projectDescription: '',
    problemStatement: '',
    solution: '',
    technologies: [],
    features: [],
    challenges: [],
    learnings: [],
    futurePlans: '',
    demoUrl: '',
    repositoryUrl: '',
    presentationUrl: '',
    files: [],
    teamMembers: [
      {
        name: user?.firstName + ' ' + user?.lastName || '',
        role: 'Team Lead',
        contribution: ''
      }
    ],
    acknowledgments: '',
    additionalNotes: ''
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newLearning, setNewLearning] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    contribution: ''
  });

  // Fetch hackathon details
  const fetchHackathon = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await apiService.getHackathonById(id);
      
      if (response.success && response.data) {
        setHackathon(response.data);
      } else {
        showToast('Hackathon not found', 'error');
        navigate('/app/hackathons');
      }
    } catch (error: any) {
      console.error('Error fetching hackathon:', error);
      showToast('Failed to load hackathon details', 'error');
      navigate('/app/hackathons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathon();
  }, [id]);

  const handleInputChange = (field: keyof SubmissionForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setFormData(prev => ({
        ...prev,
        challenges: [...prev.challenges, newChallenge.trim()]
      }));
      setNewChallenge('');
    }
  };

  const removeChallenge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  };

  const addLearning = () => {
    if (newLearning.trim()) {
      setFormData(prev => ({
        ...prev,
        learnings: [...prev.learnings, newLearning.trim()]
      }));
      setNewLearning('');
    }
  };

  const removeLearning = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learnings: prev.learnings.filter((_, i) => i !== index)
    }));
  };

  const addTeamMember = () => {
    if (newTeamMember.name.trim()) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { ...newTeamMember }]
      }));
      setNewTeamMember({ name: '', role: '', contribution: '' });
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: SubmissionFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.type),
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, newFile]
      }));
    });
  };

  const getFileType = (mimeType: string): 'document' | 'video' | 'image' | 'code' | 'link' => {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('text/') || mimeType.includes('application/')) return 'code';
    return 'document';
  };

  const removeFile = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId)
    }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <Camera className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateSubmission = (): boolean => {
    if (!formData.projectTitle.trim()) return false;
    if (!formData.projectDescription.trim()) return false;
    if (!formData.problemStatement.trim()) return false;
    if (!formData.solution.trim()) return false;
    if (formData.technologies.length === 0) return false;
    if (hackathon?.requirements.sourceCode && !formData.repositoryUrl.trim()) return false;
    if (hackathon?.requirements.demoVideo && !formData.demoUrl.trim()) return false;
    if (hackathon?.requirements.presentation && !formData.presentationUrl.trim()) return false;
    return true;
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      // TODO: Implement save draft API call
      console.log('Saving draft:', formData);
      showToast('Draft saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving draft:', error);
      showToast('Failed to save draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateSubmission()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting project:', formData);
      
      const response = await apiService.submitProject(id!, formData);
      
      if (response.success) {
        showToast('Project submitted successfully!', 'success');
        navigate(`/app/student/hackathons/${id}`);
      } else {
        showToast('Failed to submit project', 'error');
      }
    } catch (error: any) {
      console.error('Error submitting project:', error);
      showToast(error.message || 'Failed to submit project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilDeadline = () => {
    if (!hackathon?.submissionDeadline) return null;
    const now = new Date();
    const deadline = new Date(hackathon.submissionDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Deadline passed';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="p-6">
        <Card>
          <CardBody className="p-12 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Hackathon not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The hackathon you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/app/hackathons')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hackathons
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/app/hackathons/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Submit Project for {hackathon.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Submit your hackathon project and showcase your work
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hackathon.submissionDeadline && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getTimeUntilDeadline()}
            </Badge>
          )}
        </div>
      </div>

      {/* Submission Requirements */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Submission Requirements</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(hackathon.requirements).map(([requirement, required]) => (
              <div key={requirement} className="flex items-center gap-2">
                {required ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm capitalize">
                  {requirement.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Submission Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Project Submission</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                value={formData.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                placeholder="Enter your project title"
              />
            </div>
            
            <div>
              <Label htmlFor="projectDescription">Project Description *</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                placeholder="Describe your project in detail"
                rows={4}
              />
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Problem & Solution</h3>
            
            <div>
              <Label htmlFor="problemStatement">Problem Statement *</Label>
              <Textarea
                id="problemStatement"
                value={formData.problemStatement}
                onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                placeholder="What problem does your project solve?"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="solution">Solution *</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="How does your project solve the problem?"
                rows={4}
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technologies Used</h3>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <button
                    onClick={() => removeTechnology(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Add technology"
                onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
              />
              <Button onClick={addTechnology} size="sm">
                Add
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Key Features</h3>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    onClick={() => removeFeature(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button onClick={addFeature} size="sm">
                Add
              </Button>
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Project Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hackathon.requirements.repositoryUrl && (
                <div>
                  <Label htmlFor="repositoryUrl">Repository URL *</Label>
                  <Input
                    id="repositoryUrl"
                    value={formData.repositoryUrl}
                    onChange={(e) => handleInputChange('repositoryUrl', e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              )}
              
              {hackathon.requirements.demoUrl && (
                <div>
                  <Label htmlFor="demoUrl">Demo URL *</Label>
                  <Input
                    id="demoUrl"
                    value={formData.demoUrl}
                    onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                    placeholder="https://your-demo.com"
                  />
                </div>
              )}
              
              {hackathon.requirements.presentationUrl && (
                <div>
                  <Label htmlFor="presentationUrl">Presentation URL *</Label>
                  <Input
                    id="presentationUrl"
                    value={formData.presentationUrl}
                    onChange={(e) => handleInputChange('presentationUrl', e.target.value)}
                    placeholder="https://slides.com/your-presentation"
                  />
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">File Upload</h3>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Upload your project files
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>
            </div>

            {/* Uploaded Files */}
            {formData.files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files</h4>
                {formData.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Team Members</h3>
            
            <div className="space-y-4">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Member {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`memberName${index}`}>Name</Label>
                      <Input
                        id={`memberName${index}`}
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...formData.teamMembers];
                          newMembers[index].name = e.target.value;
                          handleInputChange('teamMembers', newMembers);
                        }}
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`memberRole${index}`}>Role</Label>
                      <Input
                        id={`memberRole${index}`}
                        value={member.role}
                        onChange={(e) => {
                          const newMembers = [...formData.teamMembers];
                          newMembers[index].role = e.target.value;
                          handleInputChange('teamMembers', newMembers);
                        }}
                        placeholder="e.g., Developer, Designer"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`memberContribution${index}`}>Contribution</Label>
                      <Input
                        id={`memberContribution${index}`}
                        value={member.contribution}
                        onChange={(e) => {
                          const newMembers = [...formData.teamMembers];
                          newMembers[index].contribution = e.target.value;
                          handleInputChange('teamMembers', newMembers);
                        }}
                        placeholder="What did they contribute?"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Team Member */}
            <Card>
              <CardHeader>
                <h4 className="font-medium">Add Team Member</h4>
              </CardHeader>
              <CardBody className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="newMemberName">Name</Label>
                    <Input
                      id="newMemberName"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newMemberRole">Role</Label>
                    <Input
                      id="newMemberRole"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Developer, Designer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newMemberContribution">Contribution</Label>
                    <Input
                      id="newMemberContribution"
                      value={newTeamMember.contribution}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, contribution: e.target.value }))}
                      placeholder="What did they contribute?"
                    />
                  </div>
                </div>
                
                <Button onClick={addTeamMember} className="w-full mt-4">
                  Add Member
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div>
              <Label htmlFor="challenges">Challenges Faced</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.challenges.map((challenge, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {challenge}
                    <button
                      onClick={() => removeChallenge(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  placeholder="Add challenge"
                  onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
                />
                <Button onClick={addChallenge} size="sm">
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="learnings">Key Learnings</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.learnings.map((learning, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {learning}
                    <button
                      onClick={() => removeLearning(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  placeholder="Add learning"
                  onKeyPress={(e) => e.key === 'Enter' && addLearning()}
                />
                <Button onClick={addLearning} size="sm">
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="futurePlans">Future Plans</Label>
              <Textarea
                id="futurePlans"
                value={formData.futurePlans}
                onChange={(e) => handleInputChange('futurePlans', e.target.value)}
                placeholder="What are your plans for this project after the hackathon?"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="acknowledgments">Acknowledgments</Label>
              <Textarea
                id="acknowledgments"
                value={formData.acknowledgments}
                onChange={(e) => handleInputChange('acknowledgments', e.target.value)}
                placeholder="Thank any mentors, sponsors, or resources that helped you"
                rows={3}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/app/hackathons/${id}`)}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={submitting || !validateSubmission()}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Project
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

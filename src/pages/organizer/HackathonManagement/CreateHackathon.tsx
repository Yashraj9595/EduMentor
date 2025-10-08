import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Plus,
  X,
  CheckCircle,
  Tag,
  Award,
  Save
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/SelectNew';
import { Progress } from '../../../components/ui/Progress';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { apiService } from '../../../services/api';

interface HackathonForm {
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  submissionDeadline: string;
  location: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  maxTeams: number;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: string;
  currency: string;
  tags: string[];
  categories: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  requirements: {
    pitchDeck: boolean;
    sourceCode: boolean;
    demoVideo: boolean;
    documentation: boolean;
    teamPhoto: boolean;
    presentation: boolean;
    prototype: boolean;
  };
  judgingCriteria: {
    innovation: number;
    technical: number;
    presentation: number;
    impact: number;
    creativity: number;
    feasibility: number;
  };
  rules: string[];
  prizes: {
    position: string;
    amount: string;
    description: string;
    icon?: string;
  }[];
  sponsors: {
    name: string;
    logo: string;
    website: string;
    description: string;
    tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  }[];
  mentors: {
    name: string;
    email: string;
    expertise: string[];
    bio: string;
  }[];
  resources: {
    title: string;
    type: 'document' | 'video' | 'link' | 'template';
    url: string;
    description: string;
  }[];
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    socialMedia: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
    };
  };
  submissionStages: {
    id: string;
    name: string;
    type: 'online_ppt' | 'prototype_review' | 'offline_review';
    date: string;
    description: string;
    requirements: string[];
  }[];
  volunteers: {
    name: string;
    email: string;
    phone: string;
    role: string;
    expertise: string[];
    availability: string;
    description: string;
  }[];
}

export const CreateHackathon: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<HackathonForm>({
    title: '',
    description: '',
    shortDescription: '',
    startDate: '',
    endDate: '',
    registrationStart: '',
    registrationEnd: '',
    submissionDeadline: '',
    location: '',
    locationType: 'physical',
    maxTeams: 50,
    maxTeamSize: 4,
    minTeamSize: 2,
    prizePool: '',
    currency: 'USD',
    tags: [],
    categories: [],
    difficulty: 'mixed',
    requirements: {
      pitchDeck: true,
      sourceCode: true,
      demoVideo: true,
      documentation: true,
      teamPhoto: true,
      presentation: true,
      prototype: false
    },
    judgingCriteria: {
      innovation: 20,
      technical: 20,
      presentation: 20,
      impact: 20,
      creativity: 10,
      feasibility: 10
    },
    rules: [],
    prizes: [],
    sponsors: [],
    mentors: [],
    resources: [],
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      socialMedia: {}
    },
    submissionStages: [],
    volunteers: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newPrize, setNewPrize] = useState({ position: '', amount: '', description: '', icon: '' });
  const [newSponsor, setNewSponsor] = useState({ name: '', logo: '', website: '', description: '', tier: 'bronze' as const });
  const [newStage, setNewStage] = useState({ name: '', type: 'online_ppt' as const, date: '', description: '', requirements: [] as string[] });
  const [newRequirement, setNewRequirement] = useState('');
  const [newVolunteer, setNewVolunteer] = useState({ name: '', email: '', phone: '', role: '', expertise: [] as string[], availability: '', description: '' });
  const [newVolunteerExpertise, setNewVolunteerExpertise] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Hackathon details and timeline' },
    { id: 2, title: 'Requirements & Criteria', description: 'Submission requirements and judging criteria' },
    { id: 3, title: 'Prizes & Sponsors', description: 'Prize structure and sponsor information' },
    { id: 4, title: 'Mentors & Resources', description: 'Mentor assignments and helpful resources' },
    { id: 5, title: 'Contact & Rules', description: 'Contact information and competition rules' },
    { id: 6, title: 'Review & Publish', description: 'Final review and publication' }
  ];

  const handleInputChange = (field: keyof HackathonForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: keyof HackathonForm, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };


  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addPrize = () => {
    if (newPrize.position && newPrize.amount) {
      setFormData(prev => ({
        ...prev,
        prizes: [...prev.prizes, { ...newPrize }]
      }));
      setNewPrize({ position: '', amount: '', description: '', icon: '' });
    }
  };


  const removePrize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const addSponsor = () => {
    if (newSponsor.name) {
      setFormData(prev => ({
        ...prev,
        sponsors: [...prev.sponsors, { ...newSponsor }]
      }));
      setNewSponsor({ name: '', logo: '', website: '', description: '', tier: 'bronze' });
    }
  };

  const removeSponsor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter((_, i) => i !== index)
    }));
  };

  const addStage = () => {
    if (newStage.name && newStage.date) {
      const stage = {
        id: Date.now().toString(),
        name: newStage.name,
        type: newStage.type,
        date: newStage.date,
        description: newStage.description,
        requirements: newStage.requirements
      };
      setFormData(prev => ({
        ...prev,
        submissionStages: [...prev.submissionStages, stage]
      }));
      setNewStage({ name: '', type: 'online_ppt' as const, date: '', description: '', requirements: [] as string[] });
    }
  };

  const removeStage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      submissionStages: prev.submissionStages.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setNewStage(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setNewStage(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addVolunteer = () => {
    if (newVolunteer.name && newVolunteer.email) {
      setFormData(prev => ({
        ...prev,
        volunteers: [...prev.volunteers, { ...newVolunteer }]
      }));
      setNewVolunteer({ name: '', email: '', phone: '', role: '', expertise: [] as string[], availability: '', description: '' });
    }
  };

  const removeVolunteer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volunteers: prev.volunteers.filter((_, i) => i !== index)
    }));
  };

  const addVolunteerExpertise = () => {
    if (newVolunteerExpertise.trim()) {
      setNewVolunteer(prev => ({
        ...prev,
        expertise: [...prev.expertise, newVolunteerExpertise.trim()]
      }));
      setNewVolunteerExpertise('');
    }
  };

  const removeVolunteerExpertise = (index: number) => {
    setNewVolunteer(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating hackathon:', formData);
      
      // Prepare data for backend
      const hackathonData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        registrationStart: formData.registrationStart ? new Date(formData.registrationStart) : undefined,
        registrationEnd: formData.registrationEnd ? new Date(formData.registrationEnd) : undefined,
        submissionDeadline: formData.submissionDeadline ? new Date(formData.submissionDeadline) : undefined,
        submissionStages: formData.submissionStages.map(stage => ({
          ...stage,
          date: new Date(stage.date)
        }))
      };

      const response = await apiService.createHackathon(hackathonData);
      
      if (response.success) {
        showToast('Hackathon created successfully!', 'success');
        navigate('/app/organizer/hackathons');
      } else {
        showToast('Failed to create hackathon. Please try again.', 'error');
      }
    } catch (error: any) {
      console.error('Error creating hackathon:', error);
      showToast(error.message || 'Failed to create hackathon. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    try {
      console.log('Saving hackathon draft:', formData);
      
      // Prepare data for backend with draft status
      const hackathonData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        registrationStart: formData.registrationStart ? new Date(formData.registrationStart) : undefined,
        registrationEnd: formData.registrationEnd ? new Date(formData.registrationEnd) : undefined,
        submissionDeadline: formData.submissionDeadline ? new Date(formData.submissionDeadline) : undefined,
        submissionStages: formData.submissionStages.map(stage => ({
          ...stage,
          date: new Date(stage.date)
        })),
        status: 'draft'
      };

      const response = await apiService.createHackathon(hackathonData);
      
      if (response.success) {
        showToast('Draft saved successfully!', 'success');
      } else {
        showToast('Failed to save draft. Please try again.', 'error');
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      showToast(error.message || 'Failed to save draft. Please try again.', 'error');
    } finally {
      setIsDraft(false);
    }
  };

  const validateStepWithoutState = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title.trim() && formData.description.trim() && formData.startDate && formData.endDate && formData.location.trim());
      case 2:
        const totalCriteria = Object.values(formData.judgingCriteria).reduce((sum, val) => sum + val, 0);
        return totalCriteria === 100;
      case 3:
        return formData.prizes.length > 0;
      case 4:
        return true; // Mentors and resources are optional
      case 5:
        return !!(formData.contactInfo.email.trim() && formData.rules.length > 0);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const getProgressPercentage = () => {
    const totalFields = 6;
    const completedSteps = steps.filter(step => validateStepWithoutState(step.id)).length;
    return (completedSteps / totalFields) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="title">Hackathon Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter hackathon title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description (max 150 characters)"
                maxLength={150}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.shortDescription.length}/150 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the hackathon, its goals, and what participants can expect"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="locationType">Event Type</Label>
                <Select value={formData.locationType} onValueChange={(value) => handleInputChange('locationType', value)}>
                  <option value="physical">Physical Event</option>
                  <option value="virtual">Virtual Event</option>
                  <option value="hybrid">Hybrid Event</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="mixed">Mixed Levels</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="registrationStart">Registration Start</Label>
                <Input
                  id="registrationStart"
                  type="datetime-local"
                  value={formData.registrationStart}
                  onChange={(e) => handleInputChange('registrationStart', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="registrationEnd">Registration End</Label>
                <Input
                  id="registrationEnd"
                  type="datetime-local"
                  value={formData.registrationEnd}
                  onChange={(e) => handleInputChange('registrationEnd', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="submissionDeadline">Submission Deadline</Label>
              <Input
                id="submissionDeadline"
                type="datetime-local"
                value={formData.submissionDeadline}
                onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="maxTeams">Max Teams</Label>
                <Input
                  id="maxTeams"
                  type="number"
                  min="1"
                  value={formData.maxTeams}
                  onChange={(e) => handleInputChange('maxTeams', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="minTeamSize">Min Team Size</Label>
                <Input
                  id="minTeamSize"
                  type="number"
                  min="1"
                  value={formData.minTeamSize}
                  onChange={(e) => handleInputChange('minTeamSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="maxTeamSize">Max Team Size</Label>
                <Input
                  id="maxTeamSize"
                  type="number"
                  min="1"
                  value={formData.maxTeamSize}
                  onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="prizePool">Prize Pool</Label>
                <Input
                  id="prizePool"
                  value={formData.prizePool}
                  onChange={(e) => handleInputChange('prizePool', e.target.value)}
                  placeholder="e.g., 10,000"
                />
              </div>
              <div>
                <Label htmlFor="submissionDeadline">Submission Deadline</Label>
                <Input
                  id="submissionDeadline"
                  type="datetime-local"
                  value={formData.submissionDeadline}
                  onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                      <Award className="h-3 w-3" />
                      {category}
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            categories: prev.categories.filter(c => c !== category)
                          }));
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add category"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    className="flex-1"
                  />
                  <Button onClick={addCategory} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Submission Requirements</h3>
              <div className="space-y-4">
                {Object.entries(formData.requirements).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <p className="text-sm text-muted-foreground">
                        {key === 'pitchDeck' && 'PowerPoint or PDF presentation'}
                        {key === 'sourceCode' && 'GitHub repository or code files'}
                        {key === 'demoVideo' && 'Video demonstration of the project'}
                        {key === 'documentation' && 'Technical documentation and README'}
                        {key === 'teamPhoto' && 'Team photo for promotional materials'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleNestedInputChange('requirements', key, e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Project Submission Stages</h3>
              <p className="text-muted-foreground mb-6">Define the different stages of project submission with specific dates and requirements</p>
              
              <div className="space-y-4 mb-6">
                {formData.submissionStages.map((stage, index) => (
                  <div key={stage.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={stage.type === 'online_ppt' ? 'default' : stage.type === 'prototype_review' ? 'secondary' : 'outline'}>
                          {stage.type === 'online_ppt' ? 'Online PPT' : stage.type === 'prototype_review' ? 'Prototype Review' : 'Offline Review'}
                        </Badge>
                        <h4 className="font-medium">{stage.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(stage.date).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => removeStage(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                    {stage.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {stage.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stageName">Stage Name</Label>
                    <Input
                      id="stageName"
                      value={newStage.name}
                      onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Initial Presentation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stageType">Stage Type</Label>
                    <Select value={newStage.type} onValueChange={(value) => setNewStage(prev => ({ ...prev, type: value as any }))}>
                      <option value="online_ppt">Online PPT</option>
                      <option value="prototype_review">Prototype Review</option>
                      <option value="offline_review">Offline Review</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stageDate">Submission Date</Label>
                    <Input
                      id="stageDate"
                      type="datetime-local"
                      value={newStage.date}
                      onChange={(e) => setNewStage(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stageDescription">Stage Description</Label>
                  <Textarea
                    id="stageDescription"
                    value={newStage.description}
                    onChange={(e) => setNewStage(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what participants need to submit in this stage"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Stage Requirements</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {newStage.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
                        {req}
                        <button
                          onClick={() => removeRequirement(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add requirement"
                      onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    />
                    <Button onClick={addRequirement} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={addStage} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Submission Stage
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Judging Criteria (Total: 100%)</h3>
              <div className="space-y-4">
                {Object.entries(formData.judgingCriteria).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={value}
                        onChange={(e) => handleNestedInputChange('judgingCriteria', key, parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="w-12 text-sm">{value}%</span>
                    </div>
                  </div>
                ))}
                <div className={`text-sm ${Object.values(formData.judgingCriteria).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {Object.values(formData.judgingCriteria).reduce((a, b) => a + b, 0)}%
                  {Object.values(formData.judgingCriteria).reduce((a, b) => a + b, 0) !== 100 && (
                    <span className="ml-2">⚠️ Must equal 100%</span>
                  )}
                </div>
                {errors.judgingCriteria && <p className="text-red-500 text-sm mt-1">{errors.judgingCriteria}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Competition Rules</h3>
              <div className="space-y-2 mb-4">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="flex-1">{rule}</span>
                    <button
                      onClick={() => removeRule(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add rule"
                  onKeyPress={(e) => e.key === 'Enter' && addRule()}
                />
                <Button onClick={addRule} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Prizes</h3>
              <div className="space-y-4 mb-4">
                {formData.prizes.map((prize, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{prize.position}</h4>
                      <button
                        onClick={() => removePrize(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{prize.amount}</p>
                    <p className="text-sm">{prize.description}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newPrize.position}
                  onChange={(e) => setNewPrize(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Position (e.g., 1st Place)"
                />
                <Input
                  value={newPrize.amount}
                  onChange={(e) => setNewPrize(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Amount (e.g., $5,000)"
                />
                <Input
                  value={newPrize.description}
                  onChange={(e) => setNewPrize(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                />
              </div>
              <Button onClick={addPrize} className="mt-2" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Prize
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Sponsors</h3>
              <div className="space-y-4 mb-4">
                {formData.sponsors.map((sponsor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{sponsor.name}</h4>
                      <button
                        onClick={() => removeSponsor(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{sponsor.website}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Sponsor Name"
                />
                <Input
                  value={newSponsor.logo}
                  onChange={(e) => setNewSponsor(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="Logo URL"
                />
                <Input
                  value={newSponsor.website}
                  onChange={(e) => setNewSponsor(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Website URL"
                />
              </div>
              <Button onClick={addSponsor} className="mt-2" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sponsor
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mentors & Resources</h3>
              <p className="text-muted-foreground mb-6">Add mentors and helpful resources for participants</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Mentors</h4>
                  <div className="space-y-4 mb-4">
                    {formData.mentors.map((mentor, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{mentor.name}</h5>
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                mentors: prev.mentors.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{mentor.email}</p>
                        <p className="text-sm mt-1">{mentor.bio}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Mentor Name"
                      value={formData.mentors.length > 0 ? '' : 'Add mentor name'}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData(prev => ({
                            ...prev,
                            mentors: [...prev.mentors, {
                              name: e.target.value,
                              email: '',
                              expertise: [],
                              bio: ''
                            }]
                          }));
                        }
                      }}
                    />
                    <Input
                      placeholder="Email"
                      value={formData.mentors.length > 0 ? '' : 'Add email'}
                      onChange={(e) => {
                        if (e.target.value && formData.mentors.length > 0) {
                          const lastMentor = formData.mentors[formData.mentors.length - 1];
                          setFormData(prev => ({
                            ...prev,
                            mentors: [...prev.mentors.slice(0, -1), { ...lastMentor, email: e.target.value }]
                          }));
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Volunteers</h4>
                  <p className="text-sm text-muted-foreground mb-4">Add volunteers who can provide guidance and support to students</p>
                  
                  <div className="space-y-4 mb-4">
                    {formData.volunteers.map((volunteer, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{volunteer.name}</h5>
                          <button
                            onClick={() => removeVolunteer(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Role:</span> {volunteer.role}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {volunteer.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {volunteer.phone}
                          </div>
                          <div>
                            <span className="font-medium">Availability:</span> {volunteer.availability}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{volunteer.description}</p>
                        {volunteer.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {volunteer.expertise.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="volunteerName">Volunteer Name *</Label>
                        <Input
                          id="volunteerName"
                          value={newVolunteer.name}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter volunteer name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="volunteerEmail">Email *</Label>
                        <Input
                          id="volunteerEmail"
                          type="email"
                          value={newVolunteer.email}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="volunteer@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="volunteerPhone">Phone</Label>
                        <Input
                          id="volunteerPhone"
                          value={newVolunteer.phone}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="volunteerRole">Role</Label>
                        <Input
                          id="volunteerRole"
                          value={newVolunteer.role}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="e.g., Technical Mentor, Event Coordinator"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="volunteerAvailability">Availability</Label>
                      <Input
                        id="volunteerAvailability"
                        value={newVolunteer.availability}
                        onChange={(e) => setNewVolunteer(prev => ({ ...prev, availability: e.target.value }))}
                        placeholder="e.g., Weekends, 9 AM - 5 PM"
                      />
                    </div>

                    <div>
                      <Label htmlFor="volunteerDescription">Description</Label>
                      <Textarea
                        id="volunteerDescription"
                        value={newVolunteer.description}
                        onChange={(e) => setNewVolunteer(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of volunteer's background and how they can help students"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Areas of Expertise</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {newVolunteer.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
                            {skill}
                            <button
                              onClick={() => removeVolunteerExpertise(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newVolunteerExpertise}
                          onChange={(e) => setNewVolunteerExpertise(e.target.value)}
                          placeholder="Add expertise area"
                          onKeyPress={(e) => e.key === 'Enter' && addVolunteerExpertise()}
                        />
                        <Button onClick={addVolunteerExpertise} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button onClick={addVolunteer} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Volunteer
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Resources</h4>
                  <div className="space-y-4 mb-4">
                    {formData.resources.map((resource, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{resource.title}</h5>
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                resources: prev.resources.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <p className="text-sm mt-1">{resource.url}</p>
                        <Badge variant="outline" className="text-xs mt-2">
                          {resource.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Resource Title"
                      value={formData.resources.length > 0 ? '' : 'Add resource title'}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData(prev => ({
                            ...prev,
                            resources: [...prev.resources, {
                              title: e.target.value,
                              type: 'document',
                              url: '',
                              description: ''
                            }]
                          }));
                        }
                      }}
                    />
                    <Select
                      value={formData.resources.length > 0 ? 'document' : 'document'}
                      onValueChange={(value) => {
                        if (formData.resources.length > 0) {
                          const lastResource = formData.resources[formData.resources.length - 1];
                          setFormData(prev => ({
                            ...prev,
                            resources: [...prev.resources.slice(0, -1), { ...lastResource, type: value as any }]
                          }));
                        }
                      }}
                    >
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                      <option value="template">Template</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information & Rules</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                        placeholder="contact@hackathon.com"
                        className={errors.contactEmail ? 'border-red-500' : ''}
                      />
                      {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactWebsite">Website</Label>
                      <Input
                        id="contactWebsite"
                        value={formData.contactInfo.website}
                        onChange={(e) => handleNestedInputChange('contactInfo', 'website', e.target.value)}
                        placeholder="https://hackathon.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactTwitter">Twitter</Label>
                      <Input
                        id="contactTwitter"
                        value={formData.contactInfo.socialMedia.twitter || ''}
                        onChange={(e) => handleNestedInputChange('contactInfo', 'socialMedia', {
                          ...formData.contactInfo.socialMedia,
                          twitter: e.target.value
                        })}
                        placeholder="@hackathon"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Competition Rules</h4>
                  <div className="space-y-2 mb-4">
                    {formData.rules.map((rule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="flex-1">{rule}</span>
                        <button
                          onClick={() => removeRule(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add rule"
                      onKeyPress={(e) => e.key === 'Enter' && addRule()}
                    />
                    <Button onClick={addRule} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Ready to Publish</h3>
              </div>
              <p className="text-green-700">
                Your hackathon is ready to be published. Once published, participants will be able to register and view the event details.
              </p>
            </div>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Hackathon Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Title:</span>
                        <p className="text-sm text-muted-foreground">{formData.title || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Location:</span>
                        <p className="text-sm text-muted-foreground">{formData.location || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Event Type:</span>
                        <p className="text-sm text-muted-foreground capitalize">{formData.locationType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Difficulty:</span>
                        <p className="text-sm text-muted-foreground capitalize">{formData.difficulty}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Timeline</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Start Date:</span>
                        <p className="text-sm text-muted-foreground">
                          {formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">End Date:</span>
                        <p className="text-sm text-muted-foreground">
                          {formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Registration:</span>
                        <p className="text-sm text-muted-foreground">
                          {formData.registrationStart && formData.registrationEnd 
                            ? `${new Date(formData.registrationStart).toLocaleDateString()} - ${new Date(formData.registrationEnd).toLocaleDateString()}`
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Teams & Prizes</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Max Teams:</span>
                        <p className="text-sm text-muted-foreground">{formData.maxTeams}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Team Size:</span>
                        <p className="text-sm text-muted-foreground">{formData.minTeamSize} - {formData.maxTeamSize} members</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Prize Pool:</span>
                        <p className="text-sm text-muted-foreground">{formData.prizePool || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Prizes:</span>
                        <p className="text-sm text-muted-foreground">{formData.prizes.length} prize(s) defined</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact & Rules</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Contact Email:</span>
                        <p className="text-sm text-muted-foreground">{formData.contactInfo.email || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Website:</span>
                        <p className="text-sm text-muted-foreground">{formData.contactInfo.website || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Rules:</span>
                        <p className="text-sm text-muted-foreground">{formData.rules.length} rule(s) defined</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Mentors:</span>
                        <p className="text-sm text-muted-foreground">{formData.mentors.length} mentor(s) assigned</p>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{formData.description}</p>
                  </div>
                )}

                {formData.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.categories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.submissionStages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Submission Stages</h4>
                    <div className="space-y-2">
                      {formData.submissionStages.map((stage) => (
                        <div key={stage.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={stage.type === 'online_ppt' ? 'default' : stage.type === 'prototype_review' ? 'secondary' : 'outline'}>
                              {stage.type === 'online_ppt' ? 'Online PPT' : stage.type === 'prototype_review' ? 'Prototype Review' : 'Offline Review'}
                            </Badge>
                            <span className="font-medium">{stage.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(stage.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stage.requirements.length} requirement(s)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.volunteers.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Volunteers</h4>
                    <div className="space-y-2">
                      {formData.volunteers.map((volunteer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="font-medium">{volunteer.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">({volunteer.role})</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {volunteer.email}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {volunteer.expertise.length} expertise area(s)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">Create Hackathon</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Set up a new hackathon event with all the necessary details</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isDraft}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app/hackathon-dashboard')}
              className="w-full sm:w-auto"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </div>

       {/* Progress Steps */}
       <div className="mb-8">
         {/* Desktop Steps - Wrapping Layout */}
         <div className="hidden md:block">
           <div className="flex flex-wrap items-center justify-center gap-4">
             {steps.map((step, index) => (
               <div key={step.id} className="flex items-center">
                 <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                   currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                 }`}>
                   {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                 </div>
                 <div className="ml-3">
                   <h3 className="font-medium text-sm">{step.title}</h3>
                   <p className="text-xs text-muted-foreground">{step.description}</p>
                 </div>
                 {index < steps.length - 1 && (
                   <div className="flex items-center ml-4">
                     <div className="w-8 h-0.5 bg-muted" />
                     <div className="w-0 h-0 border-l-4 border-l-muted border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1" />
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>

         {/* Mobile Steps */}
         <div className="md:hidden">
           <div className="flex items-center justify-between mb-4 px-2">
             {steps.map((step, index) => (
               <div key={step.id} className="flex flex-col items-center flex-1">
                 <div className={`flex items-center justify-center w-6 h-6 rounded-full mb-1 ${
                   currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                 }`}>
                   {currentStep > step.id ? <CheckCircle className="h-3 w-3" /> : step.id}
                 </div>
                 {index < steps.length - 1 && (
                   <div className="w-full h-0.5 bg-muted mt-3" />
                 )}
               </div>
             ))}
           </div>
           <div className="text-center px-4">
             <h3 className="font-medium text-sm">{steps[currentStep - 1]?.title}</h3>
             <p className="text-xs text-muted-foreground">{steps[currentStep - 1]?.description}</p>
           </div>
         </div>
       </div>

      {/* Step Content */}
      <Card>
        <CardBody className="p-4 sm:p-6">
          {renderStepContent()}
        </CardBody>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/app/organizer/hackathons')}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {currentStep > 1 ? 'Previous' : 'Cancel'}
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
          {currentStep < 6 && (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!validateStepWithoutState(currentStep)}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          )}
          {currentStep === 6 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Publish Hackathon
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

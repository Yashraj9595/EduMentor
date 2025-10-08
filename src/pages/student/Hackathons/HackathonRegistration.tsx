import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Users,
  CheckCircle,
  X,
  ArrowLeft,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  Save,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/SelectNew';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface TeamMember {
  name: string;
  email: string;
  role: string;
  skills: string[];
  phone?: string;
  university?: string;
  year?: string;
}

interface RegistrationForm {
  teamName: string;
  teamDescription: string;
  members: TeamMember[];
  projectIdea: string;
  technologies: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  motivation: string;
  previousHackathons: string;
  availability: string;
  specialRequirements: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  maxTeams: number;
  maxTeamSize: number;
  minTeamSize: number;
  status: string;
  participants: number;
  teams: number;
}

export const HackathonRegistration: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationForm>({
    teamName: '',
    teamDescription: '',
    members: [
      {
        name: user?.firstName + ' ' + user?.lastName || '',
        email: user?.email || '',
        role: 'Team Lead',
        skills: [],
        phone: '',
        university: '',
        year: ''
      }
    ],
    projectIdea: '',
    technologies: [],
    experience: 'beginner',
    motivation: '',
    previousHackathons: '',
    availability: '',
    specialRequirements: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [newMember, setNewMember] = useState<TeamMember>({
    name: '',
    email: '',
    role: '',
    skills: [],
    phone: '',
    university: '',
    year: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newTechnology, setNewTechnology] = useState('');

  const steps = [
    { id: 1, title: 'Team Information', description: 'Basic team details' },
    { id: 2, title: 'Team Members', description: 'Add team members' },
    { id: 3, title: 'Project Details', description: 'Your project idea' },
    { id: 4, title: 'Additional Info', description: 'Experience and requirements' },
    { id: 5, title: 'Review & Submit', description: 'Review and submit registration' }
  ];

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

  const handleInputChange = (field: keyof RegistrationForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: any) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { ...newMember }]
      }));
      setNewMember({
        name: '',
        email: '',
        role: '',
        skills: [],
        phone: '',
        university: '',
        year: ''
      });
    }
  };

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (memberIndex: number) => {
    if (newSkill.trim()) {
      handleMemberChange(memberIndex, 'skills', [...formData.members[memberIndex].skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (memberIndex: number, skillIndex: number) => {
    handleMemberChange(memberIndex, 'skills', 
      formData.members[memberIndex].skills.filter((_, i) => i !== skillIndex)
    );
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.teamName.trim() && formData.teamDescription.trim());
      case 2:
        return formData.members.length >= (hackathon?.minTeamSize || 1) && 
               formData.members.length <= (hackathon?.maxTeamSize || 4) &&
               formData.members.every(member => member.name.trim() && member.email.trim());
      case 3:
        return !!(formData.projectIdea.trim() && formData.technologies.length > 0);
      case 4:
        return !!(formData.motivation.trim() && formData.availability.trim());
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      console.log('Submitting registration:', formData);
      
      const response = await apiService.registerForHackathon(id!, formData);
      
      if (response.success) {
        showToast('Registration submitted successfully!', 'success');
        navigate(`/app/student/hackathons/${id}`);
      } else {
        showToast('Failed to submit registration. Please try again.', 'error');
      }
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      showToast(error.message || 'Failed to submit registration. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                value={formData.teamName}
                onChange={(e) => handleInputChange('teamName', e.target.value)}
                placeholder="Enter your team name"
              />
            </div>
            
            <div>
              <Label htmlFor="teamDescription">Team Description *</Label>
              <Textarea
                id="teamDescription"
                value={formData.teamDescription}
                onChange={(e) => handleInputChange('teamDescription', e.target.value)}
                placeholder="Describe your team and what makes you unique"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Add {hackathon?.minTeamSize || 1} - {hackathon?.maxTeamSize || 4} team members
              </p>
            </div>

            {/* Existing Members */}
            <div className="space-y-4">
              {formData.members.map((member, index) => (
                <Card key={index}>
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Member {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMember(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`memberName${index}`}>Name *</Label>
                        <Input
                          id={`memberName${index}`}
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`memberEmail${index}`}>Email *</Label>
                        <Input
                          id={`memberEmail${index}`}
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`memberRole${index}`}>Role</Label>
                        <Input
                          id={`memberRole${index}`}
                          value={member.role}
                          onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                          placeholder="e.g., Developer, Designer, PM"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`memberPhone${index}`}>Phone</Label>
                        <Input
                          id={`memberPhone${index}`}
                          value={member.phone}
                          onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`memberUniversity${index}`}>University</Label>
                        <Input
                          id={`memberUniversity${index}`}
                          value={member.university}
                          onChange={(e) => handleMemberChange(index, 'university', e.target.value)}
                          placeholder="University name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`memberYear${index}`}>Academic Year</Label>
                        <Select value={member.year} onValueChange={(value) => handleMemberChange(index, 'year', value)}>
                          <option value="">Select year</option>
                          <option value="freshman">Freshman</option>
                          <option value="sophomore">Sophomore</option>
                          <option value="junior">Junior</option>
                          <option value="senior">Senior</option>
                          <option value="graduate">Graduate</option>
                          <option value="other">Other</option>
                        </Select>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-4">
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(index, skillIndex)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill(index)}
                        />
                        <Button onClick={() => addSkill(index)} size="sm">
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Add New Member */}
            {formData.members.length < (hackathon?.maxTeamSize || 4) && (
              <Card>
                <CardHeader>
                  <h4 className="font-medium">Add Team Member</h4>
                </CardHeader>
                <CardBody className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newMemberName">Name *</Label>
                      <Input
                        id="newMemberName"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newMemberEmail">Email *</Label>
                      <Input
                        id="newMemberEmail"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newMemberRole">Role</Label>
                      <Input
                        id="newMemberRole"
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g., Developer, Designer"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newMemberPhone">Phone</Label>
                      <Input
                        id="newMemberPhone"
                        value={newMember.phone}
                        onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={addMember} className="w-full mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="projectIdea">Project Idea *</Label>
              <Textarea
                id="projectIdea"
                value={formData.projectIdea}
                onChange={(e) => handleInputChange('projectIdea', e.target.value)}
                placeholder="Describe your project idea, what problem it solves, and how you plan to build it"
                rows={6}
              />
            </div>
            
            <div>
              <Label>Technologies *</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
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
                  placeholder="Add technology (e.g., React, Python, AWS)"
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                />
                <Button onClick={addTechnology} size="sm">
                  Add
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="motivation">Motivation *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Why do you want to participate in this hackathon?"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="previousHackathons">Previous Hackathons</Label>
              <Textarea
                id="previousHackathons"
                value={formData.previousHackathons}
                onChange={(e) => handleInputChange('previousHackathons', e.target.value)}
                placeholder="List any previous hackathons you've participated in"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="availability">Availability *</Label>
              <Textarea
                id="availability"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                placeholder="Describe your availability during the hackathon period"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Any special requirements or accommodations needed"
                rows={3}
              />
            </div>

            <div>
              <h4 className="font-medium mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact', { ...formData.emergencyContact, name: e.target.value })}
                    placeholder="Emergency contact name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone">Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact', { ...formData.emergencyContact, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact', { ...formData.emergencyContact, relationship: e.target.value })}
                    placeholder="e.g., Parent, Guardian, Friend"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Your Registration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please review all information before submitting
              </p>
            </div>

            <Card>
              <CardHeader>
                <h4 className="font-semibold">Team Information</h4>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <p><strong>Team Name:</strong> {formData.teamName}</p>
                  <p><strong>Description:</strong> {formData.teamDescription}</p>
                  <p><strong>Members:</strong> {formData.members.length}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="font-semibold">Project Details</h4>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <p><strong>Project Idea:</strong> {formData.projectIdea}</p>
                  <p><strong>Technologies:</strong> {formData.technologies.join(', ')}</p>
                  <p><strong>Experience Level:</strong> {formData.experience}</p>
                </div>
              </CardBody>
            </Card>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    By submitting this registration, you agree to participate in the hackathon and follow all rules and guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            Register for {hackathon.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete the registration form to participate in this hackathon
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Steps */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Registration Steps</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === step.id
                        ? 'bg-primary text-white'
                        : currentStep > step.id
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center gap-2">
                      {currentStep > step.id ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          currentStep === step.id ? 'border-white' : 'border-current'
                        }`} />
                      )}
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs opacity-75">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[currentStep - 1].description}
              </p>
            </CardHeader>
            <CardBody>
              {renderStepContent()}
            </CardBody>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                  disabled={!validateStep(currentStep)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !validateStep(currentStep)}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Registration
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

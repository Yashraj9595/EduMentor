import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Award,
  Target,
  UserPlus,
  CheckCircle,
  X,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  ArrowLeft,
  FileText,
  Video,
  Code,
  Camera,
  Download,
  Share2
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui/Progress';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  registrationStart?: string;
  registrationEnd?: string;
  submissionDeadline?: string;
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
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  participants: number;
  teams: number;
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
  organizerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const HackathonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

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

  const handleRegister = async () => {
    if (!hackathon || !user) return;
    
    try {
      setRegistrationLoading(true);
      // TODO: Implement registration API call
      showToast('Registration successful!', 'success');
      setIsRegistered(true);
    } catch (error: any) {
      console.error('Error registering:', error);
      showToast('Failed to register for hackathon', 'error');
    } finally {
      setRegistrationLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'mixed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getLocationTypeIcon = (locationType: string) => {
    switch (locationType) {
      case 'physical':
        return <MapPin className="h-5 w-5" />;
      case 'virtual':
        return <Users className="h-5 w-5" />;
      case 'hybrid':
        return <Target className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      case 'template':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
          onClick={() => navigate('/app/hackathons')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hackathon.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {hackathon.shortDescription}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(hackathon.status)}>
            {hackathon.status}
          </Badge>
          <Badge className={getDifficultyColor(hackathon.difficulty)}>
            {hackathon.difficulty}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About This Hackathon</h2>
            </CardHeader>
            <CardBody>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {hackathon.description}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Timeline</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(hackathon.startDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(hackathon.endDate)}
                    </p>
                  </div>
                </div>

                {hackathon.registrationStart && (
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Registration Opens</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathon.registrationStart)}
                      </p>
                    </div>
                  </div>
                )}

                {hackathon.submissionDeadline && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Submission Deadline</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathon.submissionDeadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Submission Stages */}
          {hackathon.submissionStages.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Submission Stages</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {hackathon.submissionStages.map((stage, index) => (
                    <div key={stage.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{stage.name}</h3>
                        <Badge variant="outline">
                          {stage.type === 'online_ppt' ? 'Online PPT' : 
                           stage.type === 'prototype_review' ? 'Prototype Review' : 
                           'Offline Review'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {stage.description}
                      </p>
                      <p className="text-sm font-medium">
                        Due: {formatDate(stage.date)}
                      </p>
                      {stage.requirements.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Requirements:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400">
                            {stage.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Judging Criteria */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Judging Criteria</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {Object.entries(hackathon.judgingCriteria).map(([criterion, weight]) => (
                  <div key={criterion}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{criterion}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{weight}%</span>
                    </div>
                    <Progress value={weight} className="h-2" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Rules */}
          {hackathon.rules.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Rules & Guidelines</h2>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {hackathon.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {/* Resources */}
          {hackathon.resources.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Resources</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hackathon.resources.map((resource, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        {getResourceIcon(resource.type)}
                        <span className="font-medium">{resource.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {resource.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Resource
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Registration</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {hackathon.participants} / {hackathon.maxTeams * hackathon.maxTeamSize}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Participants Registered
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Teams</span>
                  <span>{hackathon.teams} / {hackathon.maxTeams}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Team Size</span>
                  <span>{hackathon.minTeamSize} - {hackathon.maxTeamSize}</span>
                </div>
              </div>

              {hackathon.status === 'published' && (
                <Button
                  onClick={handleRegister}
                  disabled={registrationLoading || isRegistered}
                  className="w-full"
                >
                  {registrationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : isRegistered ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Registered
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register Now
                    </>
                  )}
                </Button>
              )}

              {hackathon.status !== 'published' && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Registration not available
                </div>
              )}
            </CardBody>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Event Details</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                {getLocationTypeIcon(hackathon.locationType)}
                <div>
                  <p className="font-medium">{hackathon.location}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {hackathon.locationType} Event
                  </p>
                </div>
              </div>

              {hackathon.prizePool && (
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Prize Pool</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hackathon.prizePool} {hackathon.currency}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Organizer</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hackathon.organizerId.firstName} {hackathon.organizerId.lastName}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Prizes */}
          {hackathon.prizes.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Prizes</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {hackathon.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{prize.position}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {prize.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{prize.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Tags */}
          {hackathon.tags.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Tags</h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Contact</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {hackathon.contactInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a 
                    href={`mailto:${hackathon.contactInfo.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {hackathon.contactInfo.email}
                  </a>
                </div>
              )}
              
              {hackathon.contactInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a 
                    href={`tel:${hackathon.contactInfo.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {hackathon.contactInfo.phone}
                  </a>
                </div>
              )}
              
              {hackathon.contactInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <a 
                    href={hackathon.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}

              {/* Social Media */}
              <div className="flex gap-2 pt-2">
                {hackathon.contactInfo.socialMedia.twitter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(hackathon.contactInfo.socialMedia.twitter, '_blank')}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                )}
                {hackathon.contactInfo.socialMedia.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(hackathon.contactInfo.socialMedia.linkedin, '_blank')}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                )}
                {hackathon.contactInfo.socialMedia.facebook && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(hackathon.contactInfo.socialMedia.facebook, '_blank')}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

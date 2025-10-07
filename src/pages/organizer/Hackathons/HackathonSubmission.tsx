import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Video, 
  Image, 
  Link as LinkIcon, 
  CheckCircle,
  AlertCircle,
  Clock,
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  Download,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  location: string;
  maxTeams: number;
  registeredTeams: number;
  tags: string[];
  prizePool: string;
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed';
  requirements: {
    pitchDeck: boolean;
    sourceCode: boolean;
    demoVideo: boolean;
    documentation: boolean;
    teamPhoto: boolean;
  };
}

interface Submission {
  id: string;
  hackathonId: string;
  teamId: string;
  projectName: string;
  projectDescription: string;
  deliverables: {
    pitchDeck?: FileUpload;
    sourceCode?: FileUpload;
    demoVideo?: FileUpload;
    documentation?: FileUpload;
    teamPhoto?: FileUpload;
    additionalFiles?: FileUpload[];
  };
  repositoryLink: string;
  liveDemoLink: string;
  teamMembers: string[];
  submittedAt?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  feedback?: string;
}

interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export const HackathonSubmission: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchHackathonDetails();
    fetchSubmission();
  }, [hackathonId]);

  const fetchHackathonDetails = async () => {
    try {
      // Mock hackathon data - in real app, fetch from API
      const hackathonData: Hackathon = {
        id: hackathonId || '1',
        title: 'Tech Innovation Challenge 2025',
        description: 'A 48-hour hackathon focused on solving real-world problems using emerging technologies.',
        startDate: '2025-11-15T09:00:00Z',
        endDate: '2025-11-17T18:00:00Z',
        submissionDeadline: '2025-11-17T16:00:00Z',
        location: 'Main Campus, Building A',
        maxTeams: 50,
        registeredTeams: 32,
        tags: ['AI', 'IoT', 'Blockchain'],
        prizePool: '$10,000',
        status: 'in_progress',
        requirements: {
          pitchDeck: true,
          sourceCode: true,
          demoVideo: true,
          documentation: true,
          teamPhoto: true
        }
      };
      setHackathon(hackathonData);
    } catch (error) {
      console.error('Error fetching hackathon details:', error);
    }
  };

  const fetchSubmission = async () => {
    try {
      // Mock submission data - in real app, fetch from API
      const submissionData: Submission = {
        id: 'sub-1',
        hackathonId: hackathonId || '1',
        teamId: 'team-1',
        projectName: 'AI-Powered Healthcare Assistant',
        projectDescription: 'An intelligent healthcare assistant that helps patients with symptom analysis and appointment scheduling.',
        deliverables: {
          pitchDeck: {
            id: '1',
            name: 'Healthcare_Assistant_Pitch.pdf',
            size: 2048000,
            type: 'application/pdf',
            url: '/files/pitch.pdf',
            uploadedAt: '2025-01-15T10:30:00Z'
          },
          sourceCode: {
            id: '2',
            name: 'healthcare-assistant.zip',
            size: 5120000,
            type: 'application/zip',
            url: '/files/source.zip',
            uploadedAt: '2025-01-15T11:00:00Z'
          }
        },
        repositoryLink: 'https://github.com/team/healthcare-assistant',
        liveDemoLink: 'https://demo.healthcare-assistant.com',
        teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        status: 'draft'
      };
      setSubmission(submissionData);
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    setUploading(type);
    
    // Simulate file upload
    setTimeout(() => {
      const fileUpload: FileUpload = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };

      setSubmission(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          deliverables: {
            ...prev.deliverables,
            [type]: fileUpload
          }
        };
      });
      
      setUploading(null);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setSubmission(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const generateAISuggestions = async () => {
    // Simulate AI suggestions
    const suggestions = [
      'Consider adding more technical details to your project description',
      'Include metrics and performance benchmarks in your pitch deck',
      'Add a section about scalability and future improvements',
      'Consider including user testimonials or case studies',
      'Add a clear call-to-action in your demo video'
    ];
    setAiSuggestions(suggestions);
  };

  const submitProject = async () => {
    try {
      setLoading(true);
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmission(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'submitted',
          submittedAt: new Date().toISOString()
        };
      });
      
      alert('Project submitted successfully!');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (type.includes('video')) return <Video className="w-5 h-5" />;
    if (type.includes('image')) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const isSubmissionComplete = () => {
    if (!hackathon || !submission) return false;
    
    const required = Object.entries(hackathon.requirements)
      .filter(([_, required]) => required)
      .map(([key, _]) => key);
    
    return required.every(req => submission.deliverables[req as keyof typeof submission.deliverables]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hackathon || !submission) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hackathon or submission not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/app/student/hackathons')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Project Submission</h1>
          <p className="text-muted-foreground">{hackathon.title}</p>
        </div>
      </div>

      {/* Hackathon Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Hackathon Details
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hackathon.status === 'in_progress' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {hackathon.status.replace('_', ' ')}
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Submission Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(hackathon.submissionDeadline).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Team Members</p>
                <p className="text-sm text-muted-foreground">
                  {submission.teamMembers.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Prize Pool</p>
                <p className="text-sm text-muted-foreground">{hackathon.prizePool}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold text-primary">AI Suggestions</h3>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Project Information</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name *</label>
                <input
                  type="text"
                  value={submission.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project Description *</label>
                <textarea
                  value={submission.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your project, its features, and impact"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Repository Link</label>
                <input
                  type="url"
                  value={submission.repositoryLink}
                  onChange={(e) => handleInputChange('repositoryLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://github.com/your-repo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Live Demo Link</label>
                <input
                  type="url"
                  value={submission.liveDemoLink}
                  onChange={(e) => handleInputChange('liveDemoLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://your-demo.com"
                />
              </div>
            </CardBody>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Required Deliverables</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {Object.entries(hackathon.requirements).map(([type, required]) => {
                if (!required) return null;
                
                const deliverable = submission.deliverables[type as keyof typeof submission.deliverables];
                const isUploading = uploading === type;
                
                return (
                  <div key={type} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      {deliverable && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    {deliverable ? (
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        {getFileIcon(deliverable.type)}
                        <div className="flex-1">
                          <p className="font-medium">{deliverable.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(deliverable.size)} • {new Date(deliverable.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={deliverable.url}
                            download={deliverable.name}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id={`upload-${type}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(type, file);
                          }}
                          accept={
                            type === 'demoVideo' ? 'video/*' :
                            type === 'teamPhoto' ? 'image/*' :
                            type === 'pitchDeck' ? '.pdf,.ppt,.pptx' :
                            type === 'sourceCode' ? '.zip,.rar,.tar.gz' :
                            '*'
                          }
                        />
                        <label
                          htmlFor={`upload-${type}`}
                          className="cursor-pointer"
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-muted-foreground">Uploading...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-8 h-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload {type.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        {/* Submission Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Submission Status</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Project Information</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Required Deliverables</span>
                  {isSubmissionComplete() ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Repository Link</span>
                  {submission.repositoryLink ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Live Demo</span>
                  {submission.liveDemoLink ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">AI Assistant</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <button
                  onClick={generateAISuggestions}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  Get AI Suggestions
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Get personalized suggestions to improve your submission
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Submit Project</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>Make sure all required fields are completed before submitting.</p>
                  <p className="mt-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Deadline: {new Date(hackathon.submissionDeadline).toLocaleString()}
                  </p>
                </div>
                
                <button
                  onClick={submitProject}
                  disabled={!isSubmissionComplete() || loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trophy className="w-4 h-4" />
                  )}
                  Submit Project
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

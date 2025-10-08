import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Video, 
  Download,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  BookOpen,
  Calendar,
  Tag,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { Button } from '../../../components/ui/Button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'student' | 'mentor';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isRead: boolean;
}

interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
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

export const MentorChat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mentorId } = useParams<{ mentorId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [hasRequestedMentor, setHasRequestedMentor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMentorDetails();
    fetchMessages();
    checkMentorRequestStatus();
    
    // Only set up interval if user is authenticated
    let intervalId: any = null;
    if (apiService.isAuthenticated()) {
      intervalId = setInterval(() => {
        if (apiService.isAuthenticated()) {
          fetchMessages();
        }
      }, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mentorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMentorDetails = async () => {
    try {
      // Mock mentor data - in real app, fetch from API
      const mentorData: Mentor = {
        id: mentorId || '1',
        name: 'Dr. Sarah Johnson',
        email: 's.johnson@university.edu',
        department: 'Computer Science',
        expertise: ['AI', 'Machine Learning', 'Data Science'],
        isOnline: true,
        lastSeen: '2 minutes ago'
      };
      setMentor(mentorData);
    } catch (error) {
      console.error('Error fetching mentor details:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Mock messages - in real app, fetch from API
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'mentor-1',
          senderName: 'Dr. Sarah Johnson',
          senderType: 'mentor',
          content: 'Hello! I\'m excited to work with you on your AI project. Let\'s start by discussing your problem statement.',
          timestamp: '2025-01-15T10:30:00Z',
          type: 'text',
          isRead: true
        },
        {
          id: '2',
          senderId: user?._id || 'student-1',
          senderName: user?.firstName + ' ' + user?.lastName || 'Student',
          senderType: 'student',
          content: 'Thank you Dr. Johnson! I\'ve attached my initial project proposal. Please review it.',
          timestamp: '2025-01-15T10:35:00Z',
          type: 'text',
          isRead: true
        },
        {
          id: '3',
          senderId: 'mentor-1',
          senderName: 'Dr. Sarah Johnson',
          senderType: 'mentor',
          content: 'I\'ve reviewed your proposal. It looks good, but I have some suggestions for improvement.',
          timestamp: '2025-01-15T11:00:00Z',
          type: 'text',
          isRead: false
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const checkMentorRequestStatus = async () => {
    // In a real app, check if the student has already requested this mentor
    // For now, we'll simulate this with a mock value
    setHasRequestedMentor(false);
  };

  const fetchProjects = async () => {
    // Check if user is authenticated before making request
    if (!apiService.isAuthenticated()) {
      return;
    }
    
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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?._id || 'student-1',
      senderName: user?.firstName + ' ' + user?.lastName || 'Student',
      senderType: 'student',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate mentor typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate mentor response
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'mentor-1',
        senderName: 'Dr. Sarah Johnson',
        senderType: 'mentor',
        content: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false
      };
      setMessages(prev => [...prev, mentorResponse]);
    }, 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const fileMessage: Message = {
        id: Date.now().toString(),
        senderId: user?._id || 'student-1',
        senderName: user?.firstName + ' ' + user?.lastName || 'Student',
        senderType: 'student',
        content: `Shared a file: ${file.name}`,
        timestamp: new Date().toISOString(),
        type: 'file',
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        isRead: false
      };
      
      setMessages(prev => [...prev, fileMessage]);
      setUploading(false);
    }, 1000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-5 h-5" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-5 h-5" />;
      default:
        return <Paperclip className="w-5 h-5" />;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleRequestMentor = () => {
    setSelectedProject(null);
    setShowProjectModal(true);
    setRequestSuccess(false);
    fetchProjects();
  };

  const handleSendRequest = async () => {
    if (!selectedProject || !mentor) return;
    
    try {
      setRequestLoading(true);
      // Update the project with the selected mentor
      const response = await apiService.put(`/projects/${selectedProject._id}`, {
        mentorId: mentor.id
      });
      
      if (response.success) {
        setRequestSuccess(true);
        setHasRequestedMentor(true);
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
    <div className="flex h-screen bg-background">
      {/* Chat Header */}
      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              {mentor?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{mentor?.name}</h2>
              <p className="text-sm text-muted-foreground">
                {mentor?.department} • {mentor?.isOnline ? 'Online' : `Last seen ${mentor?.lastSeen}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {mentor?.expertise.join(', ')}
              </span>
            </div>
          </div>
          
          {/* Mentor Request Button */}
          {!hasRequestedMentor && (
            <div className="mt-3 pt-3 border-t border-border">
              <button
                onClick={handleRequestMentor}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
              >
                <Mail className="w-4 h-4" />
                Request this mentor for a project
              </button>
            </div>
          )}
          
          {/* View Profile Button */}
          <div className="mt-3">
            <button
              onClick={() => navigate(`/app/student/mentors/${mentorId}/profile`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <User className="w-4 h-4" />
              View Full Profile
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.senderType === 'student' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-end gap-2">
                  {message.senderType === 'mentor' && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg px-4 py-2 ${
                    message.senderType === 'student' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    {message.type === 'file' ? (
                      <div className="flex items-center gap-2">
                        {getFileIcon(message.fileName || '')}
                        <div>
                          <p className="font-medium">{message.fileName}</p>
                          <p className="text-xs opacity-80">{message.fileSize}</p>
                        </div>
                        <a
                          href={message.fileUrl}
                          download={message.fileName}
                          className="ml-2 text-current hover:opacity-80"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  
                  {message.senderType === 'student' && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                  message.senderType === 'student' ? 'justify-end' : 'justify-start'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(message.timestamp)}</span>
                  {message.senderType === 'student' && (
                    <div className="flex items-center gap-1">
                      {message.isRead ? (
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">Mentor is typing...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={uploading}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || uploading}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Selection Modal */}
      {showProjectModal && mentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Request {mentor.name} as Mentor
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
                Select a project you'd like {mentor.name} to mentor:
              </p>
              
              {requestSuccess ? (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-green-800 mb-1">Request Sent!</h4>
                  <p className="text-sm text-green-600">
                    Your mentor request has been sent to {mentor.name}.
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
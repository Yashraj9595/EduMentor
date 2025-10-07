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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

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

export const MentorChat: React.FC = () => {
  const { user } = useAuth();
  const { mentorId } = useParams<{ mentorId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMentorDetails();
    fetchMessages();
    // Simulate real-time updates
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
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
    </div>
  );
};

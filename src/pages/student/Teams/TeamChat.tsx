import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Video, 
  Download,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings
} from 'lucide-react';

import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isRead: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projectId?: string;
  createdAt: string;
}

export const TeamChat: React.FC = () => {
  const { user } = useAuth();
  const { teamId } = useParams<{ teamId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [team, setTeam] = useState<Team | null>(null);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeamDetails();
    fetchMessages();
    // Simulate real-time updates
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTeamDetails = async () => {
    try {
      // Mock team data - in real app, fetch from API
      const teamData: Team = {
        id: teamId || '1',
        name: 'AI Innovation Team',
        description: 'Working on AI-powered solutions for social impact',
        projectId: 'proj-1',
        createdAt: '2025-01-10T00:00:00Z',
        members: [
          {
            id: '1',
            name: user?.firstName + ' ' + user?.lastName || 'You',
            email: user?.email || 'you@example.com',
            role: 'Team Leader',
            isOnline: true
          },
          {
            id: '2',
            name: 'Alex Johnson',
            email: 'alex.johnson@university.edu',
            role: 'Developer',
            isOnline: true,
            lastSeen: '1 minute ago'
          },
          {
            id: '3',
            name: 'Sarah Chen',
            email: 'sarah.chen@university.edu',
            role: 'Designer',
            isOnline: false,
            lastSeen: '2 hours ago'
          },
          {
            id: '4',
            name: 'Mike Wilson',
            email: 'mike.wilson@university.edu',
            role: 'Researcher',
            isOnline: true,
            lastSeen: '5 minutes ago'
          }
        ]
      };
      setTeam(teamData);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Mock messages - in real app, fetch from API
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: '1',
          senderName: user?.firstName + ' ' + user?.lastName || 'You',
          content: 'Welcome to our team chat! Let\'s start planning our AI project.',
          timestamp: '2025-01-15T09:00:00Z',
          type: 'text',
          isRead: true
        },
        {
          id: '2',
          senderId: '2',
          senderName: 'Alex Johnson',
          content: 'Great! I\'ve been working on the initial research. Here\'s what I found so far.',
          timestamp: '2025-01-15T09:15:00Z',
          type: 'text',
          isRead: true
        },
        {
          id: '3',
          senderId: '2',
          senderName: 'Alex Johnson',
          content: 'Shared research document',
          timestamp: '2025-01-15T09:16:00Z',
          type: 'file',
          fileName: 'AI_Research_Notes.pdf',
          fileSize: '2.3 MB',
          isRead: true
        },
        {
          id: '4',
          senderId: '3',
          senderName: 'Sarah Chen',
          content: 'I\'ll work on the UI/UX design. Should we schedule a meeting to discuss the requirements?',
          timestamp: '2025-01-15T10:30:00Z',
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
      senderId: user?._id || '1',
      senderName: user?.firstName + ' ' + user?.lastName || 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate other team members typing
    const otherMembers = team?.members.filter(m => m.id !== user?._id) || [];
    if (otherMembers.length > 0) {
      const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
      setIsTyping(prev => [...prev, randomMember.id]);
      
      setTimeout(() => {
        setIsTyping(prev => prev.filter(id => id !== randomMember.id));
        // Simulate team member response
        const teamResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: randomMember.id,
          senderName: randomMember.name,
          content: 'Thanks for the update! I\'ll review this and get back to you.',
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: false
        };
        setMessages(prev => [...prev, teamResponse]);
      }, 2000);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const fileMessage: Message = {
        id: Date.now().toString(),
        senderId: user?._id || '1',
        senderName: user?.firstName + ' ' + user?.lastName || 'You',
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

  const getMemberById = (id: string) => {
    return team?.members.find(member => member.id === id);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Header */}
      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{team?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {team?.members.length} members • {team?.members.filter(m => m.isOnline).length} online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                
                const isCurrentUser = message.senderId === user?._id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-end gap-2">
                        {!isCurrentUser && (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        
                        <div className={`rounded-lg px-4 py-2 ${
                          isCurrentUser 
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
                        
                        {isCurrentUser && (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="font-medium">{message.senderName}</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                        {isCurrentUser && (
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
                );
              })}
              
              {isTyping.length > 0 && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isTyping.map(id => getMemberById(id)?.name).join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
                    </span>
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

          {/* Team Members Sidebar */}
          {showMembers && (
            <div className="w-64 bg-card border-l border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Team Members</h3>
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {team?.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      {!member.isOnline && member.lastSeen && (
                        <p className="text-xs text-muted-foreground">Last seen {member.lastSeen}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

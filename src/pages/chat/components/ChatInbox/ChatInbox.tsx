import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Plus,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { ChatUser, ChatMessage } from '../../Chat.types';

interface ChatInboxProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: ChatUser) => void;
  onOpenFullChat: () => void;
  chatUsers?: ChatUser[];
  recentMessages?: { [userId: string]: ChatMessage };
}

export const ChatInbox: React.FC<ChatInboxProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  onOpenFullChat,
  chatUsers = [],
  recentMessages = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demo - using same IDs as actual chat data
  const mockUsers: ChatUser[] = [
    {
      id: 'user1',
      name: 'John Doe',
      avatar: '',
      email: 'john@example.com',
      role: 'student',
      isOnline: true,
      college: 'MIT',
      year: '2024'
    },
    {
      id: 'user2',
      name: 'Sarah Wilson',
      avatar: '',
      email: 'sarah@example.com',
      role: 'mentor',
      isOnline: true,
      company: 'TechCorp Inc.'
    },
    {
      id: 'user3',
      name: 'Mike Chen',
      avatar: '',
      email: 'mike@example.com',
      role: 'student',
      isOnline: false,
      college: 'Stanford',
      year: '2023'
    },
    {
      id: 'user4',
      name: 'Dr. Emily Rodriguez',
      avatar: '',
      email: 'emily@example.com',
      role: 'mentor',
      isOnline: true,
      college: 'Harvard'
    }
  ];

  const mockRecentMessages: { [userId: string]: ChatMessage } = {
    'user1': {
      id: 'msg1',
      chatId: 'chat1',
      senderId: 'user1',
      content: 'Hi! How is your project going?',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      reactions: [],
      mentions: [],
      isRead: false,
      isEdited: false
    },
    'user2': {
      id: 'msg2',
      chatId: 'chat2',
      senderId: 'current-user',
      content: 'Thanks for the help with the assignment!',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      reactions: [],
      mentions: [],
      isRead: true,
      isEdited: false
    },
    'user3': {
      id: 'msg3',
      chatId: 'chat3',
      senderId: 'user3',
      content: 'This mentor is currently unavailable for new messages.',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      reactions: [],
      mentions: [],
      isRead: true,
      isEdited: false
    },
    'user4': {
      id: 'msg4',
      chatId: 'chat4',
      senderId: 'current-user',
      content: 'Great work on the presentation! 👏',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      reactions: [],
      mentions: [],
      isRead: true,
      isEdited: false
    }
  };

  const allUsers = [...chatUsers, ...mockUsers];
  const allRecentMessages = { ...recentMessages, ...mockRecentMessages };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return `${Math.floor(diffInMinutes / 10080)}w`;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[9998]">
      <div className="bg-card border border-border rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFullChat}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Open full chat"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-muted-foreground"></div>
              </div>
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => {
            const recentMessage = allRecentMessages[user.id];
            const isUnread = recentMessage && !recentMessage.isRead && recentMessage.senderId !== 'current-user';
            
            return (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors border-b border-border"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-semibold">
                    {getUserInitials(user.name)}
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">
                      {user.name}
                    </h3>
                    {recentMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(recentMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  {recentMessage ? (
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${
                        isUnread 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground'
                      }`}>
                        {recentMessage.senderId === 'current-user' ? 'You: ' : ''}
                        {recentMessage.content}
                      </p>
                      {isUnread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle call
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle video call
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Video className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Message Button */}
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Pin, 
  MoreVertical, 
  MessageCircle, 
  Users, 
  FolderOpen, 
  GraduationCap, 
  Calendar,
  Filter,
  Settings
} from 'lucide-react';
import { Chat, ChatUser } from '../Chat.types';
import { 
  getChatDisplayName, 
  getChatAvatar, 
  formatTimestamp, 
  getChatTypeIcon,
  getChatTypeColor,
  sortChats,
  filterChats,
  getUserInitials
} from '../Chat.utils';

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  users: ChatUser[];
  currentUserId: string;
  onSelectChat: (chatId: string) => void;
  onCreateChat: () => void;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChat,
  users,
  currentUserId,
  onSelectChat,
  onCreateChat,
  onSearch,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const filteredChats = filterChats(
    filterType === 'all' ? chats : chats.filter(chat => chat.type === filterType),
    searchQuery,
    currentUserId
  );

  const sortedChats = sortChats(filteredChats);

  const getChatIcon = (chat: Chat) => {
    const iconClass = `w-4 h-4 ${getChatTypeColor(chat.type)}`;
    
    switch (chat.type) {
      case 'direct':
        return <MessageCircle className={iconClass} />;
      case 'group':
        return <Users className={iconClass} />;
      case 'project':
        return <FolderOpen className={iconClass} />;
      case 'mentorship':
        return <GraduationCap className={iconClass} />;
      case 'event':
        return <Calendar className={iconClass} />;
      default:
        return <MessageCircle className={iconClass} />;
    }
  };

  const getOnlineStatus = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherUser = chat.participants.find(p => p.id !== currentUserId);
      return otherUser?.isOnline;
    }
    return false;
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const isOwn = chat.lastMessage.senderId === currentUserId;
    const sender = chat.lastMessage ? users.find(u => u.id === chat.lastMessage!.senderId) : undefined;
    const prefix = isOwn ? 'You: ' : sender ? `${sender.name}: ` : '';
    
    return `${prefix}${chat.lastMessage.content.slice(0, 50)}${chat.lastMessage.content.length > 50 ? '...' : ''}`;
  };

  if (loading) {
    return (
      <div className="w-80 border-r border-border bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateChat}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              title="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === 'all' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('direct')}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === 'direct' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setFilterType('group')}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === 'group' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Groups
              </button>
              <button
                onClick={() => setFilterType('project')}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === 'project' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setFilterType('mentorship')}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === 'mentorship' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Mentorship
              </button>
              <button
                onClick={() => setFilterType('event')}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === 'event' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Events
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations found</p>
            <p className="text-xs mt-1">Start a new chat to get started</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sortedChats.map((chat) => {
              const isSelected = currentChat?.id === chat.id;
              const isOnline = getOnlineStatus(chat);
              const lastMessagePreview = getLastMessagePreview(chat);
              const displayName = getChatDisplayName(chat, currentUserId);
              const avatar = getChatAvatar(chat, currentUserId);

              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group
                    ${isSelected 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                    }
                    ${chat.isPinned ? 'border-l-4 border-l-primary' : ''}
                  `}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Online Status */}
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                    
                    {/* Chat Type Icon */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center">
                      {getChatIcon(chat)}
                    </div>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{displayName}</h3>
                      <div className="flex items-center gap-1">
                        {chat.isPinned && (
                          <Pin className="w-3 h-3 text-primary" />
                        )}
                        {chat.unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {lastMessagePreview}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {chat.lastMessage ? formatTimestamp(chat.lastMessage.timestamp) : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        {chat.isMuted && (
                          <span className="text-xs text-muted-foreground">🔇</span>
                        )}
                        {chat.type === 'group' && (
                          <span className="text-xs text-muted-foreground">
                            {chat.participants.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
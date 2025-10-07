import React, { useState } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Settings, 
  Search, 
  Pin, 
  Archive,
  VolumeX,
  Info,
  UserPlus
} from 'lucide-react';
import { Chat, ChatUser } from '@/pages/chat/Chat.types';
import { getChatDisplayName, getChatAvatar } from '@/pages/chat/Chat.utils';
// Chat header component

interface ChatHeaderProps {
  chat: Chat | null;
  currentUserId: string;
  onCall?: (type: 'voice' | 'video') => void;
  onSearch?: () => void;
  onSettings?: () => void;
  onPin?: () => void;
  onMute?: () => void;
  onArchive?: () => void;
  onAddMembers?: () => void;
  onViewInfo?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  currentUserId,
  onCall,
  onSearch,
  onSettings,
  onPin,
  onMute,
  onArchive,
  onAddMembers,
  onViewInfo
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!chat) {
    return (
      <div className="h-16 border-b border-border bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Select a conversation</div>
      </div>
    );
  }

  const displayName = getChatDisplayName(chat, currentUserId);
  const avatar = getChatAvatar(chat, currentUserId);
  const isOnline = chat.participants.find((p: ChatUser) => p.id !== currentUserId)?.isOnline;

  const getOnlineStatusText = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.participants.find((p: ChatUser) => p.id !== currentUserId);
      if (otherUser?.isOnline) {
        return 'Online now';
      }
      return 'Offline';
    }
    
    const onlineCount = chat.participants.filter((p: ChatUser) => p.isOnline).length;
    return `${onlineCount} online`;
  };

  const getChatDescription = () => {
    switch (chat.type) {
      case 'direct':
        const otherUser = chat.participants.find((p: ChatUser) => p.id !== currentUserId);
        return otherUser?.college || otherUser?.company || '';
      case 'group':
        return `${chat.participants.length} members`;
      case 'project':
        return chat.metadata?.description || 'Project chat';
      case 'mentorship':
        return 'Mentorship chat';
      case 'event':
        return chat.metadata?.description || 'Event chat';
      default:
        return '';
    }
  };

  return (
    <div className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Chat Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
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
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        {/* Chat Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{displayName}</h3>
            {chat.isPinned && (
              <Pin className="w-3 h-3 text-primary" />
            )}
            {chat.isMuted && (
              <VolumeX className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {getOnlineStatusText()}
            </span>
            {getChatDescription() && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground truncate">
                  {getChatDescription()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Call Buttons */}
        {onCall && (
          <>
            <button
              onClick={() => onCall('voice')}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              title="Voice Call"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => onCall('video')}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              title="Video Call"
            >
              <Video className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Search */}
        {onSearch && (
          <button
            onClick={onSearch}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            title="Search Messages"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[200px] z-50">
              {onViewInfo && (
                <button
                  onClick={() => {
                    onViewInfo();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Info className="w-4 h-4" />
                  Chat Info
                </button>
              )}
              
              {onPin && (
                <button
                  onClick={() => {
                    onPin();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Pin className="w-4 h-4" />
                  {chat.isPinned ? 'Unpin Chat' : 'Pin Chat'}
                </button>
              )}
              
              {onMute && (
                <button
                  onClick={() => {
                    onMute();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <VolumeX className="w-4 h-4" />
                  {chat.isMuted ? 'Unmute Chat' : 'Mute Chat'}
                </button>
              )}
              
              {onAddMembers && chat.type !== 'direct' && (
                <button
                  onClick={() => {
                    onAddMembers();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Members
                </button>
              )}
              
              {onSettings && (
                <button
                  onClick={() => {
                    onSettings();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Settings className="w-4 h-4" />
                  Chat Settings
                </button>
              )}
              
              {onArchive && (
                <button
                  onClick={() => {
                    onArchive();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-destructive"
                >
                  <Archive className="w-4 h-4" />
                  Archive Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
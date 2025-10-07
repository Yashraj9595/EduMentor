export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'student' | 'mentor' | 'company' | 'organizer' | 'admin';
  isOnline: boolean;
  lastSeen?: string;
  college?: string;
  year?: string;
  company?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  currentActivity?: string;
  timezone?: string;
  language?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document' | 'code' | 'voice' | 'file' | 'poll' | 'system' | 'announcement';
  timestamp: string;
  editedAt?: string;
  replyTo?: string;
  reactions: MessageReaction[];
  mentions: string[];
  attachments?: ChatAttachment[];
  isRead: boolean;
  isEdited: boolean;
  isDeleted?: boolean;
  threadId?: string;
  metadata?: {
    codeLanguage?: string;
    fileSize?: number;
    duration?: number;
    pollId?: string;
    announcementType?: 'info' | 'warning' | 'success' | 'error';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    encryption?: boolean;
  };
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'code' | 'other';
  url: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
  downloadUrl?: string;
  version?: number;
  isEncrypted?: boolean;
  checksum?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project' | 'mentorship' | 'event' | 'class' | 'hackathon' | 'company';
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description?: string;
  avatar?: string;
  tags?: string[];
  permissions?: ChatPermissions;
  metadata?: {
    projectId?: string;
    hackathonId?: string;
    mentorId?: string;
    teamId?: string;
    eventId?: string;
    classId?: string;
    companyId?: string;
    description?: string;
    avatar?: string;
    maxParticipants?: number;
    isPublic?: boolean;
    inviteCode?: string;
    settings?: ChatSettings;
  };
}

export interface ChatPermissions {
  canSendMessages: boolean;
  canEditMessages: boolean;
  canDeleteMessages: boolean;
  canAddMembers: boolean;
  canRemoveMembers: boolean;
  canChangeSettings: boolean;
  canPinMessages: boolean;
  canCreateThreads: boolean;
  canModerate: boolean;
  canViewHistory: boolean;
  canShareFiles: boolean;
  canStartCalls: boolean;
  canCreatePolls: boolean;
}

export interface ChatSettings {
  userId: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
    mobile: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    allowDirectMessages: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
    days?: number[];
  };
}

export interface ChatTypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
  timestamp: string;
}


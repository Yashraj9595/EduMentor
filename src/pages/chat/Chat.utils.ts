import { Chat, ChatMessage, ChatUser, ChatTypingIndicator } from './Chat.types';

// Format timestamp for display
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Format time for message timestamps
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date for message grouping
export const formatMessageDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    return date.toLocaleDateString();
  }
};

// Get user initials for avatar
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Get user display name
export const getUserDisplayName = (user: ChatUser): string => {
  return user.name || user.email.split('@')[0];
};

// Get chat display name
export const getChatDisplayName = (chat: Chat, currentUserId: string): string => {
  if (chat.type === 'direct') {
    const otherUser = chat.participants.find(p => p.id !== currentUserId);
    return otherUser ? getUserDisplayName(otherUser) : 'Unknown User';
  }
  return chat.name || 'Unnamed Chat';
};

// Get chat avatar
export const getChatAvatar = (chat: Chat, currentUserId: string): string => {
  if (chat.type === 'direct') {
    const otherUser = chat.participants.find(p => p.id !== currentUserId);
    return otherUser?.avatar || '';
  }
  return chat.metadata?.avatar || '';
};

// Check if message is from current user
export const isOwnMessage = (message: ChatMessage, currentUserId: string): boolean => {
  return message.senderId === currentUserId;
};

// Get message status
export const getMessageStatus = (message: ChatMessage, currentUserId: string): 'sent' | 'delivered' | 'read' => {
  if (!isOwnMessage(message, currentUserId)) return 'read';
  
  if (message.isRead) return 'read';
  return 'sent';
};

// Group messages by date
export const groupMessagesByDate = (messages: ChatMessage[]): { [key: string]: ChatMessage[] } => {
  const groups: { [key: string]: ChatMessage[] } = {};
  
  messages.forEach(message => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  
  return groups;
};

// Check if message should show timestamp
export const shouldShowTimestamp = (message: ChatMessage, previousMessage: ChatMessage | null): boolean => {
  if (!previousMessage) return true;
  
  const messageTime = new Date(message.timestamp);
  const previousTime = new Date(previousMessage.timestamp);
  const diffInMinutes = (messageTime.getTime() - previousTime.getTime()) / (1000 * 60);
  
  return diffInMinutes > 5; // Show timestamp if more than 5 minutes apart
};

// Check if message should show avatar
export const shouldShowAvatar = (message: ChatMessage, nextMessage: ChatMessage | null): boolean => {
  if (!nextMessage) return true;
  
  return message.senderId !== nextMessage.senderId;
};

// Get typing indicator text
export const getTypingIndicatorText = (typingUsers: ChatTypingIndicator[], currentUserId: string): string => {
  const otherTypingUsers = typingUsers.filter(t => t.userId !== currentUserId);
  
  if (otherTypingUsers.length === 0) return '';
  if (otherTypingUsers.length === 1) {
    return `${otherTypingUsers[0].userName} is typing...`;
  }
  if (otherTypingUsers.length === 2) {
    return `${otherTypingUsers[0].userName} and ${otherTypingUsers[1].userName} are typing...`;
  }
  return `${otherTypingUsers.length} people are typing...`;
};

// Format message for display
export const formatMessageContent = (content: string): string => {
  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let formattedContent = content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
  
  // Convert line breaks to <br>
  formattedContent = formattedContent.replace(/\n/g, '<br>');
  
  return formattedContent;
};

// Get reaction emoji
export const getReactionEmoji = (emoji: string): string => {
  const emojiMap: { [key: string]: string } = {
    'like': '👍',
    'love': '❤️',
    'laugh': '😂',
    'wow': '😮',
    'sad': '😢',
    'angry': '😠',
    'thumbs_up': '👍',
    'thumbs_down': '👎',
    'check': '✅',
    'cross': '❌',
    'fire': '🔥',
    'star': '⭐'
  };
  
  return emojiMap[emoji] || emoji;
};

// Count reactions
export const countReactions = (reactions: any[]): { [key: string]: number } => {
  const counts: { [key: string]: number } = {};
  
  reactions.forEach(reaction => {
    counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
  });
  
  return counts;
};

// Check if user has reacted
export const hasUserReacted = (reactions: any[], userId: string, emoji: string): boolean => {
  return reactions.some(reaction => reaction.userId === userId && reaction.emoji === emoji);
};

// Get chat type icon
export const getChatTypeIcon = (type: Chat['type']): string => {
  switch (type) {
    case 'direct': return '💬';
    case 'group': return '👥';
    case 'project': return '📁';
    case 'mentorship': return '🎓';
    case 'event': return '🎉';
    case 'class': return '🏫';
    case 'hackathon': return '💻';
    case 'company': return '🏢';
    default: return '💬';
  }
};

// Get chat type color
export const getChatTypeColor = (type: Chat['type']): string => {
  switch (type) {
    case 'direct': return 'text-blue-500';
    case 'group': return 'text-green-500';
    case 'project': return 'text-purple-500';
    case 'mentorship': return 'text-orange-500';
    case 'event': return 'text-pink-500';
    case 'class': return 'text-indigo-500';
    case 'hackathon': return 'text-cyan-500';
    case 'company': return 'text-gray-500';
    default: return 'text-gray-500';
  }
};

// Sort chats by priority (pinned first, then by last message)
export const sortChats = (chats: Chat[]): Chat[] => {
  return [...chats].sort((a, b) => {
    // Pinned chats first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by last message time
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });
};

// Filter chats by search query
export const filterChats = (chats: Chat[], query: string, currentUserId: string): Chat[] => {
  if (!query.trim()) return chats;
  
  const lowercaseQuery = query.toLowerCase();
  
  return chats.filter(chat => {
    const displayName = getChatDisplayName(chat, currentUserId).toLowerCase();
    const lastMessage = chat.lastMessage?.content.toLowerCase() || '';
    
    return displayName.includes(lowercaseQuery) || lastMessage.includes(lowercaseQuery);
  });
};
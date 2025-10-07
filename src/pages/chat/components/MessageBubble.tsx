import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Reply, 
  Copy, 
  Smile,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { ChatMessage, ChatUser } from '../Chat.types';
import { 
  formatMessageTime, 
  isOwnMessage, 
  getMessageStatus, 
  shouldShowAvatar,
  formatMessageContent,
  getReactionEmoji,
  countReactions,
  hasUserReacted
} from '../Chat.utils';

interface MessageBubbleProps {
  message: ChatMessage;
  previousMessage: ChatMessage | null;
  nextMessage: ChatMessage | null;
  currentUserId: string;
  users: ChatUser[];
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string, emoji: string) => void;
  onCopy?: (content: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  nextMessage,
  currentUserId,
  users,
  onEdit,
  onDelete,
  onReply,
  onReact,
  onRemoveReaction,
  onCopy
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isOwn = isOwnMessage(message, currentUserId);
  const showAvatar = shouldShowAvatar(message, nextMessage);
  const messageStatus = getMessageStatus(message, currentUserId);
  const sender = users.find(u => u.id === message.senderId);
  const reactionCounts = countReactions(message.reactions);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id, editContent);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(message.id, emoji);
    }
    setShowReactions(false);
  };

  const handleRemoveReaction = (emoji: string) => {
    if (onRemoveReaction) {
      onRemoveReaction(message.id, emoji);
    }
  };

  const getStatusIcon = () => {
    switch (messageStatus) {
      case 'sent':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    if (isEditing) {
      return (
        <div className="w-full">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full p-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(message.content);
              }}
              className="px-3 py-1 border border-border rounded-md text-sm hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    switch (message.type) {
      case 'text':
        return (
          <div 
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ 
              __html: formatMessageContent(message.content) 
            }}
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            {/* Instagram-style image display */}
            <div className="relative group/image">
              <img 
                src={message.attachments?.[0]?.url} 
                alt="Shared image"
                className="max-w-xs rounded-2xl cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                onClick={() => window.open(message.attachments?.[0]?.url, '_blank')}
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              {/* Image overlay with Instagram-style interactions */}
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-200 rounded-2xl flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                <div className="flex gap-2">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <span className="text-white text-lg">👁️</span>
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <span className="text-white text-lg">❤️</span>
                  </button>
                </div>
              </div>
            </div>
            {message.content && (
              <div 
                className="whitespace-pre-wrap break-words text-sm"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }}
              />
            )}
          </div>
        );
      case 'code':
        return (
          <div className="space-y-2">
            <div className="bg-muted p-3 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{message.content}</code>
              </pre>
            </div>
            {message.metadata?.codeLanguage && (
              <div className="text-xs text-muted-foreground">
                {message.metadata.codeLanguage}
              </div>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-2xl">📎</span>
              <div className="flex-1">
                <div className="font-medium">{message.attachments?.[0]?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {message.attachments?.[0]?.size && `${(message.attachments[0].size / 1024).toFixed(1)} KB`}
                </div>
              </div>
              <button 
                onClick={() => window.open(message.attachments?.[0]?.url, '_blank')}
                className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
              >
                Open
              </button>
            </div>
            {message.content && (
              <div 
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }}
              />
            )}
          </div>
        );
      default:
        return (
          <div 
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ 
              __html: formatMessageContent(message.content) 
            }}
          />
        );
    }
  };

  return (
    <div className={`flex gap-2 group ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {sender ? sender.name.charAt(0).toUpperCase() : '?'}
        </div>
      )}
      
      {!showAvatar && !isOwn && <div className="w-8 flex-shrink-0" />}

      {/* Message Content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name */}
        {showAvatar && !isOwn && sender && (
          <div className="text-xs text-muted-foreground mb-1 px-2">
            {sender.name}
          </div>
        )}

        {/* Message Bubble */}
        <div className={`relative group/message ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
          <div
            className={`
              relative px-3 py-2 rounded-lg break-words shadow-sm
              ${isOwn 
                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                : 'bg-muted text-foreground rounded-bl-sm'
              }
              ${message.isEdited ? 'italic' : ''}
            `}
          >
            {renderMessageContent()}
            
            {/* Edited indicator */}
            {message.isEdited && (
              <div className="text-xs opacity-70 mt-1">(edited)</div>
            )}

            {/* Message Menu */}
            <div className="absolute top-0 right-0 -translate-y-full opacity-0 group-hover/message:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 bg-background border border-border rounded-lg shadow-lg p-1">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1 hover:bg-muted rounded"
                  title="React"
                >
                  <Smile className="w-4 h-4" />
                </button>
                {onReply && (
                  <button
                    onClick={() => onReply(message.id)}
                    className="p-1 hover:bg-muted rounded"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                )}
                {onCopy && (
                  <button
                    onClick={() => onCopy(message.content)}
                    className="p-1 hover:bg-muted rounded"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
                {isOwn && onEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-muted rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {isOwn && onDelete && (
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reactions */}
          {Object.keys(reactionCounts).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => {
                    if (hasUserReacted(message.reactions, currentUserId, emoji)) {
                      handleRemoveReaction(emoji);
                    } else {
                      handleReaction(emoji);
                    }
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs
                    ${hasUserReacted(message.reactions, currentUserId, emoji)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted hover:bg-muted/80'
                    }
                  `}
                >
                  <span>{getReactionEmoji(emoji)}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Reaction Picker */}
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-lg shadow-lg p-2">
              <div className="flex gap-1">
                {['👍', '❤️', '😂', '😮', '😢', '😠', '🔥', '⭐'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-1 hover:bg-muted rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp and Status */}
        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span>{formatMessageTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};
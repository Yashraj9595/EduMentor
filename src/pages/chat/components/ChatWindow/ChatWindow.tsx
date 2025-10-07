import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Image,
  Smile,
  X,
  Maximize2,
  ArrowLeft,
  Phone,
  Video
} from 'lucide-react';
import { ChatMessage, ChatUser } from '../../Chat.types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  chatUser?: ChatUser;
  messages: ChatMessage[];
  onSendMessage: (content: string, type: string, attachments?: any[]) => void;
  onBackToInbox?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  chatUser,
  messages,
  onSendMessage,
  onBackToInbox
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() && attachments.length === 0) return;

    const messageType = attachments.length > 0 ? 'image' : 'text';
    onSendMessage(inputMessage, messageType, attachments);
    
    setInputMessage('');
    setAttachments([]);
    setShowAttachmentMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newAttachments = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type,
        uploadedBy: 'current-user',
        uploadedAt: new Date().toISOString()
      }));
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleFullScreen = () => {
    // Close the floating chat first
    onClose();
    
    // Navigate to main Chat.tsx page
    setTimeout(() => {
      navigate('/chat', { 
        state: { 
          selectedUserId: chatUser?.id,
          selectedUserName: chatUser?.name 
        } 
      });
    }, 100);
  };

  const handleBackToInbox = () => {
    if (onBackToInbox) {
      onBackToInbox();
    } else {
      onClose();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  if (!isOpen) return null;

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="fixed bottom-24 right-6 z-[9998]">
      <div className="bg-card border border-border rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToInbox}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {chatUser && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-semibold">
                    {chatUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  {chatUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{chatUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {chatUser.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Video className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={handleFullScreen}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Open in full screen"
            >
              <Maximize2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex flex-col h-[520px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="text-center mb-4">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>
                
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div className={`max-w-xs ${message.senderId === 'current-user' ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.senderId === 'current-user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        {message.type === 'image' && message.attachments?.[0] ? (
                          <div className="space-y-2">
                            <div className="relative group">
                              <img 
                                src={message.attachments[0].url} 
                                alt="Shared image"
                                className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <div className="text-white text-sm font-medium">View Image</div>
                              </div>
                            </div>
                            {message.content && (
                              <div className="text-sm">{message.content}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                      
                      <div className={`text-xs text-muted-foreground mt-1 ${
                        message.senderId === 'current-user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
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
                  <span className="text-sm text-muted-foreground">Typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview */}
          {attachments.length > 0 && (
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="relative flex-shrink-0">
                    {attachment.type === 'image' ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">File</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Image className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() && attachments.length === 0}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

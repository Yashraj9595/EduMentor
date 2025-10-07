import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Image, 
  File, 
  Code, 
  Mic, 
  X,
  Plus
} from 'lucide-react';
import { ChatAttachment } from '../Chat.types';

interface MessageInputProps {
  onSendMessage: (content: string, type: string, attachments?: ChatAttachment[]) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  onStopTyping,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 4000
}) => {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  // Handle typing indicator
  useEffect(() => {
    if (content.trim() && onTyping) {
      onTyping();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 3000);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [content, onTyping, onStopTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && attachments.length === 0) return;
    
    onSendMessage(content, 'text', attachments);
    setContent('');
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      // Validate file size (max 10MB for images, 50MB for other files)
      const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const attachment: ChatAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.type),
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type,
        uploadedBy: 'current-user',
        uploadedAt: new Date().toISOString()
      };
      
      setAttachments(prev => [...prev, attachment]);
    });
  };

  const getFileType = (mimeType: string): ChatAttachment['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'other';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement voice recording stop logic here
  };

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Attachments Preview - Instagram Style */}
      {attachments.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {attachments.length} {attachments.length === 1 ? 'attachment' : 'attachments'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {attachments.map(attachment => (
              <div key={attachment.id} className="relative group/attachment">
                {attachment.type === 'image' ? (
                  <div className="relative">
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-full h-24 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover/attachment:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded opacity-0 group-hover/attachment:opacity-100 transition-opacity">
                      <div className="truncate">{attachment.name}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <File className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {showAttachmentMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-lg shadow-lg p-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm"
                >
                  <Image className="w-4 h-4" />
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm"
                >
                  <File className="w-4 h-4" />
                  File
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm"
                >
                  <Code className="w-4 h-4" />
                  Code
                </button>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 p-2 hover:bg-muted rounded text-sm ${
                    isRecording ? 'text-red-500' : ''
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  {isRecording ? 'Stop' : 'Voice'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-[40px] max-h-[120px]"
            rows={1}
          />
          
          {/* Character Count */}
          {content.length > maxLength * 0.8 && (
            <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
              {content.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          disabled={disabled}
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!content.trim() && attachments.length === 0)}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*"
        />
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {emojis.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="p-1 hover:bg-muted rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
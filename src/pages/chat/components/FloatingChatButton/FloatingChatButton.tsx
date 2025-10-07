import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from '../ChatWindow';
import { ChatInbox } from '../ChatInbox';
import { ChatUser } from '../../Chat.types';

interface FloatingChatButtonProps {
  chatUsers?: ChatUser[];
  onSendMessage?: (content: string, type: string, attachments?: any[]) => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  chatUsers = [],
  onSendMessage
}) => {
  const [showInbox, setShowInbox] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const handleOpenInbox = () => {
    setShowInbox(true);
  };

  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user);
    setShowInbox(false);
    setShowChat(true);
    
    // Load messages for this user (mock data for now)
    setMessages([
      {
        id: '1',
        chatId: `chat-${user.id}`,
        senderId: user.id,
        content: `Hi! I'm ${user.name}. How can I help you?`,
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        reactions: [],
        mentions: [],
        isRead: false,
        isEdited: false
      }
    ]);
  };

  const handleBackToInbox = () => {
    setShowChat(false);
    setShowInbox(true);
  };

  const handleOpenFullChat = () => {
    // This will be handled by the InstagramChat component
    setShowInbox(false);
    setShowChat(false);
  };

  const handleSendMessage = (content: string, type: string, attachments?: any[]) => {
    if (onSendMessage) {
      onSendMessage(content, type, attachments);
    }

    // Add message to local state
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content,
      type,
      timestamp: new Date().toISOString(),
      attachments
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleClose = () => {
    setShowInbox(false);
    setShowChat(false);
    setSelectedUser(null);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={handleOpenInbox}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-border"
          style={{ display: 'flex' }}
        >
          <MessageCircle className="w-6 h-6" />
          {/* Notification indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>
        
        {/* Floating label */}
        <div className="absolute -top-12 right-0 bg-popover text-popover-foreground text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border">
          Messages
        </div>
      </div>

      {/* Inbox Window */}
      <ChatInbox
        isOpen={showInbox}
        onClose={handleClose}
        onSelectUser={handleSelectUser}
        onOpenFullChat={handleOpenFullChat}
        chatUsers={chatUsers}
      />

      {/* Chat Window */}
      <ChatWindow
        isOpen={showChat}
        onClose={handleClose}
        chatUser={selectedUser || undefined}
        messages={messages}
        onSendMessage={handleSendMessage}
        onBackToInbox={handleBackToInbox}
      />
    </>
  );
};

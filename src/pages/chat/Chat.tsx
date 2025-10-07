import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from './Chat.hooks';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { MessageInput } from './components/MessageInput';
// import { FloatingChatButton } from './components/FloatingChatButton';
import { 
  groupMessagesByDate, 
  getTypingIndicatorText,
  formatMessageDate
} from './Chat.utils';
import { useAuth } from '../../contexts/AuthContext';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    chats,
    currentChat,
    messages,
    users,
    typingUsers,
    loading,
    messagesLoading,
    sendingMessage,
    selectChat,
    sendMessage,
    startTyping,
    stopTyping,
    pinChat,
    muteChat,
    deleteMessage,
    editMessage,
    addReaction,
    removeReaction
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle navigation from floating chat
  useEffect(() => {
    if (location.state?.selectedUserId) {
      // Find and select the chat with the specified user
      const targetChat = chats.find(chat => 
        chat.participants.some(p => p.id === location.state.selectedUserId)
      );
      if (targetChat) {
        selectChat(targetChat.id);
      }
    }
  }, [location.state, chats, selectChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  // Handle message send
  const handleSendMessage = async (content: string, type: string, attachments?: any[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    await sendMessage(content, type, attachments);
  };

  // Handle message edit
  const handleEditMessage = async (messageId: string, content: string) => {
    await editMessage(messageId, content);
  };

  // Handle message delete
  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  // Handle reaction
  const handleReaction = async (messageId: string, emoji: string) => {
    await addReaction(messageId, emoji);
  };

  // Handle remove reaction
  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    await removeReaction(messageId, emoji);
  };

  // Handle copy message
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Handle pin chat
  const handlePinChat = async () => {
    if (currentChat) {
      await pinChat(currentChat.id);
    }
  };

  // Handle mute chat
  const handleMuteChat = async () => {
    if (currentChat) {
      await muteChat(currentChat.id);
    }
  };

  // Handle call
  const handleCall = (type: 'voice' | 'video') => {
    // Implement call functionality
    console.log(`Starting ${type} call with ${currentChat?.name}`);
  };

  // Handle search messages
  const handleSearchMessages = () => {
    // Implement message search
    console.log('Searching messages...');
  };

  // Handle chat settings
  const handleChatSettings = () => {
    // Implement chat settings
    console.log('Opening chat settings...');
  };

  // Handle add members
  const handleAddMembers = () => {
    // Implement add members
    console.log('Adding members...');
  };

  // Handle view info
  const handleViewInfo = () => {
    // Implement view chat info
    console.log('Viewing chat info...');
  };

  // Handle archive chat
  const handleArchiveChat = () => {
    // Implement archive chat
    console.log('Archiving chat...');
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  const typingText = getTypingIndicatorText(typingUsers, user?._id || '');

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-80 border-r border-border bg-background">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        users={users}
        currentUserId={user?._id || ''}
        onSelectChat={selectChat}
        onCreateChat={() => console.log('Create new chat')}
        onSearch={handleSearchMessages}
        loading={loading}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              chat={currentChat}
              currentUserId={user?._id || ''}
              onCall={handleCall}
              onSearch={handleSearchMessages}
              onSettings={handleChatSettings}
              onPin={handlePinChat}
              onMute={handleMuteChat}
              onAddMembers={handleAddMembers}
              onViewInfo={handleViewInfo}
              onArchive={handleArchiveChat}
            />

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messagesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                      {/* Date Separator */}
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                          {formatMessageDate(dateMessages[0].timestamp)}
                        </div>
                      </div>

                      {/* Messages for this date */}
                      <div className="space-y-1">
                        {dateMessages.map((message, index) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            previousMessage={index > 0 ? dateMessages[index - 1] : null}
                            nextMessage={index < dateMessages.length - 1 ? dateMessages[index + 1] : null}
                            currentUserId={user?._id || ''}
                            users={users}
                            onEdit={handleEditMessage}
                            onDelete={handleDeleteMessage}
                            onReact={handleReaction}
                            onRemoveReaction={handleRemoveReaction}
                            onCopy={handleCopyMessage}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {typingText && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span>{typingText}</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={startTyping}
              onStopTyping={stopTyping}
              disabled={sendingMessage}
            />
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Chat</h3>
              <p className="text-muted-foreground mb-4">
                Select a conversation to start messaging
              </p>
              <button
                onClick={() => console.log('Create new chat')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instagram-style Floating Chat Button - Now available on all pages via MainLayout */}
      {/* <FloatingChatButton
        chatUsers={users}
        onSendMessage={handleSendMessage}
      /> */}
    </div>
  );
};

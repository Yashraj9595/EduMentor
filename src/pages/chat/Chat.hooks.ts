import { useState, useEffect } from 'react';
import { Chat, ChatMessage, ChatUser, ChatTypingIndicator } from './Chat.types';
import { mockChats, mockUsers, mockMessages } from './mockData';
// Chat hooks

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [typingUsers] = useState<ChatTypingIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChats(mockChats);
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load messages when chat changes
  useEffect(() => {
    if (currentChat) {
      setMessagesLoading(true);
      // Simulate loading messages
      setTimeout(() => {
        const chatMessages = mockMessages.filter((msg: ChatMessage) => msg.chatId === currentChat.id);
        setMessages(chatMessages);
        setMessagesLoading(false);
      }, 500);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    setCurrentChat(chat || null);
  };

  const sendMessage = async (content: string, type: string, attachments?: any[]) => {
    if (!currentChat) return;

    setSendingMessage(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        chatId: currentChat.id,
        senderId: 'current-user', // This should be the actual current user ID
        content,
        type: type as any,
        timestamp: new Date().toISOString(),
        reactions: [],
        mentions: [],
        attachments,
        isRead: false,
        isEdited: false
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Update chat's last message
      setChats(prev => prev.map(chat => 
        chat.id === currentChat.id 
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : chat
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const startTyping = () => {
    // Implement typing indicator
    console.log('User started typing');
  };

  const stopTyping = () => {
    // Implement typing indicator
    console.log('User stopped typing');
  };

  const pinChat = async (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isPinned: !chat.isPinned }
        : chat
    ));
  };

  const muteChat = async (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isMuted: !chat.isMuted }
        : chat
    ));
  };

  const deleteMessage = async (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const editMessage = async (messageId: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isEdited: true, editedAt: new Date().toISOString() }
        : msg
    ));
  };

  const addReaction = async (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            reactions: [...msg.reactions, {
              emoji,
              userId: 'current-user',
              timestamp: new Date().toISOString()
            }]
          }
        : msg
    ));
  };

  const removeReaction = async (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            reactions: msg.reactions.filter(r => !(r.emoji === emoji && r.userId === 'current-user'))
          }
        : msg
    ));
  };

  return {
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
  };
};


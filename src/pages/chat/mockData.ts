import { Chat, ChatUser, ChatMessage } from './Chat.types';

export const mockUsers: ChatUser[] = [
  {
    id: 'user1',
    name: 'John Doe',
    avatar: '',
    email: 'john@example.com',
    role: 'student',
    isOnline: true,
    college: 'MIT',
    year: '2024'
  },
  {
    id: 'user2',
    name: 'Sarah Wilson',
    avatar: '',
    email: 'sarah@example.com',
    role: 'mentor',
    isOnline: true,
    company: 'TechCorp Inc.'
  },
  {
    id: 'user3',
    name: 'Mike Chen',
    avatar: '',
    email: 'mike@example.com',
    role: 'student',
    isOnline: false,
    college: 'Stanford',
    year: '2023'
  },
  {
    id: 'user4',
    name: 'Dr. Emily Rodriguez',
    avatar: '',
    email: 'emily@example.com',
    role: 'mentor',
    isOnline: true,
    college: 'Harvard'
  }
];

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    name: 'John Doe',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: 'msg1',
      chatId: 'chat1',
      senderId: 'user1',
      content: "I'm having trouble with state management. Here's my code:",
      type: 'text',
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      reactions: [],
      mentions: [],
      isRead: false,
      isEdited: false
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isEncrypted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user1'
  },
  {
    id: 'chat2',
    name: 'React Project Discussion',
    type: 'project',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    lastMessage: {
      id: 'msg2',
      chatId: 'chat2',
      senderId: 'user1',
      content: "I've pushed the latest changes to the repository",
      type: 'text',
      timestamp: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
      reactions: [],
      mentions: [],
      isRead: false,
      isEdited: false
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isEncrypted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user1'
  },
  {
    id: 'chat3',
    name: 'TechCorp Inc.',
    type: 'company',
    participants: [mockUsers[1]],
    lastMessage: {
      id: 'msg3',
      chatId: 'chat3',
      senderId: 'user2',
      content: "We're excited to announce our new internship program!",
      type: 'text',
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      reactions: [],
      mentions: [],
      isRead: false,
      isEdited: false
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isEncrypted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user2'
  },
  {
    id: 'chat4',
    name: 'Machine Learning Study Group',
    type: 'group',
    participants: [mockUsers[0], mockUsers[3], mockUsers[2]],
    lastMessage: {
      id: 'msg4',
      chatId: 'chat4',
      senderId: 'user4',
      content: "Reminder: Our next session is tomorrow at 2 PM",
      type: 'text',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      reactions: [],
      mentions: [],
      isRead: false,
      isEdited: false
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isEncrypted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user4'
  },
  {
    id: 'chat5',
    name: 'Hackathon 2024 Team',
    type: 'hackathon',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: 'msg5',
      chatId: 'chat5',
      senderId: 'user3',
      content: "Great work on the hackathon project! Let's keep the momentum going.",
      type: 'text',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      reactions: [],
      mentions: [],
      isRead: false,
      isEdited: false
    },
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isEncrypted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user3'
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg1',
    chatId: 'chat1',
    senderId: 'user1',
    content: "Hey Sarah! I have a question about the React project we discussed.",
    type: 'text',
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    reactions: [{ emoji: '🔥', userId: 'user2', timestamp: new Date().toISOString() }],
    mentions: [],
    isRead: true,
    isEdited: false
  },
  {
    id: 'msg2',
    chatId: 'chat1',
    senderId: 'user2',
    content: "Hi John! I'd be happy to help. What specific part are you struggling with?",
    type: 'text',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    reactions: [],
    mentions: [],
    isRead: true,
    isEdited: false
  },
  {
    id: 'msg3',
    chatId: 'chat1',
    senderId: 'user1',
    content: "I'm having trouble with state management. Here's my code:",
    type: 'text',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    reactions: [{ emoji: '🔥', userId: 'user2', timestamp: new Date().toISOString() }],
    mentions: [],
    isRead: true,
    isEdited: false
  },
  {
    id: 'msg4',
    chatId: 'chat1',
    senderId: 'user1',
    content: "```javascript\nconst [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);\n```",
    type: 'code',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    reactions: [],
    mentions: [],
    isRead: true,
    isEdited: false,
    metadata: {
      codeLanguage: 'javascript'
    }
  }
];


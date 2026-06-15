import { create } from 'zustand';
import { Conversation, Message } from '@/types';

interface MessageStore {
  conversations: Conversation[];
  messages: Record<number, Message[]>;
  selectedConversationId: number | null;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: number, message: Message) => void;
  selectConversation: (id: number | null) => void;
  getMessagesForConversation: (conversationId: number) => Message[];
  getUnreadCount: () => number;
  markAsRead: (conversationId: number) => void;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    app: 'whatsapp',
    contact: 'Source [Redacted]',
    preview: 'The documents are ready, meet at the usual place...',
    unread: 3,
    lastMessageTime: new Date(),
    isEncrypted: true,
  },
  {
    id: 2,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    app: 'telegram',
    contact: 'Editor H.',
    preview: 'File for tomorrow\'s story...',
    unread: 0,
    lastMessageTime: new Date(Date.now() - 1800000),
    isEncrypted: true,
  },
  {
    id: 3,
    targetId: 2,
    targetName: 'Leila Nazari',
    app: 'signal',
    contact: 'Int\'l Org Geneva',
    preview: 'Your safety report was received...',
    unread: 1,
    lastMessageTime: new Date(Date.now() - 3600000),
    isEncrypted: true,
  },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      conversationId: 1,
      direction: 'in',
      text: 'The documents are ready. I have 47 pages of classified material.',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
    },
    {
      id: 2,
      conversationId: 1,
      direction: 'out',
      text: 'Can you confirm the source? We need to verify chain of custody.',
      timestamp: new Date(Date.now() - 240000),
      isRead: true,
    },
    {
      id: 3,
      conversationId: 1,
      direction: 'in',
      text: 'It came directly from the ministry. My contact is 100% reliable.',
      timestamp: new Date(Date.now() - 180000),
      isRead: false,
    },
  ],
  2: [
    {
      id: 4,
      conversationId: 2,
      direction: 'out',
      text: 'The story goes live Tuesday. Final approval needed.',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
    },
    {
      id: 5,
      conversationId: 2,
      direction: 'in',
      text: 'File it by midnight. Legal has cleared section 3.',
      timestamp: new Date(Date.now() - 1700000),
      isRead: true,
    },
  ],
  3: [
    {
      id: 6,
      conversationId: 3,
      direction: 'in',
      text: 'Your safety report was received by the Geneva office.',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
    },
    {
      id: 7,
      conversationId: 3,
      direction: 'out',
      text: 'Are the 12 names protected from disclosure?',
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
    },
  ],
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: mockConversations,
  messages: mockMessages,
  selectedConversationId: null,
  
  setConversations: (conversations) => set({ conversations }),
  
  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, conversation]
  })),
  
  addMessage: (conversationId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: [...(state.messages[conversationId] || []), message]
    },
    conversations: state.conversations.map(c => 
      c.id === conversationId 
        ? { ...c, preview: message.text, lastMessageTime: message.timestamp, unread: c.unread + 1 }
        : c
    )
  })),
  
  selectConversation: (id) => set({ selectedConversationId: id }),
  
  getMessagesForConversation: (conversationId) => {
    return get().messages[conversationId] || [];
  },
  
  getUnreadCount: () => {
    return get().conversations.reduce((sum, c) => sum + c.unread, 0);
  },
  
  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map(c =>
      c.id === conversationId ? { ...c, unread: 0 } : c
    )
  })),
}));
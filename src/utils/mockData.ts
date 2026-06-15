import { FeedEvent, Target, LocationPoint, Conversation, Message } from '@/types';

export const mockTargets: Target[] = [
  {
    id: 1,
    name: 'Ahmad Karimi',
    role: 'Journalist · Reuters Tehran',
    avatar: 'AK',
    color: '#1a6fc4',
    status: 'active',
    os: 'iOS',
    device: 'iPhone 14 Pro',
    country: 'Iran',
    infectedSince: '2024-01-15',
    agentVersion: 'v4.2.1',
  },
  {
    id: 2,
    name: 'Leila Nazari',
    role: 'Human Rights Activist',
    avatar: 'LN',
    color: '#9c27b0',
    status: 'active',
    os: 'Android',
    device: 'Samsung S23',
    country: 'Turkey',
    infectedSince: '2024-01-22',
    agentVersion: 'v4.2.1',
  },
  {
    id: 3,
    name: 'Marcus Webb',
    role: 'Opposition Politician',
    avatar: 'MW',
    color: '#f0b429',
    status: 'idle',
    os: 'iOS',
    device: 'iPhone 13',
    country: 'UK',
    infectedSince: '2023-12-10',
    agentVersion: 'v4.1.8',
  },
  {
    id: 4,
    name: 'Sara Petrov',
    role: 'Investigative Reporter',
    avatar: 'SP',
    color: '#2e7d32',
    status: 'active',
    os: 'Android',
    device: 'Pixel 7',
    country: 'Russia',
    infectedSince: '2024-02-01',
    agentVersion: 'v4.2.1',
  },
];

export const mockLocationPoints: LocationPoint[] = [
  {
    id: 1,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    address: 'Tehran, Iran - Home',
    coordinates: { lat: 35.6892, lng: 51.3890 },
    timestamp: new Date(),
    accuracy: 10,
    speed: 0,
  },
  {
    id: 2,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    address: 'Tehran, Iran - Reuters Bureau',
    coordinates: { lat: 35.7642, lng: 51.4026 },
    timestamp: new Date(Date.now() - 3600000),
    accuracy: 15,
    speed: 12,
  },
];

export const mockConversations: Conversation[] = [
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
];

export const mockMessages: Record<number, Message[]> = {
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
};

export const generateRandomEvent = (): FeedEvent => {
  const targets = mockTargets;
  const randomTarget = targets[Math.floor(Math.random() * targets.length)];
  const eventTypes: FeedEvent['type'][] = ['message', 'location', 'call', 'keylog', 'camera'];
  const apps = ['WhatsApp', 'Signal', 'Telegram', 'Cellular', 'GPS', 'Camera'];
  const messages = [
    'New encrypted message received',
    'GPS location updated',
    'Call recording saved',
    'Keystroke capture detected',
    'App opened: Signal',
    'Photo captured via front camera',
    'Location shared with contact',
    'File downloaded from cloud',
  ];
  
  return {
    id: Date.now().toString(),
    targetId: randomTarget.id,
    targetName: randomTarget.name,
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    app: apps[Math.floor(Math.random() * apps.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    severity: Math.random() > 0.7 ? 'critical' : 'info',
    timestamp: new Date(),
  };
};